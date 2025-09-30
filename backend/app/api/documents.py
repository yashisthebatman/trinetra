import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db import models
from app.schemas.documents import (
    UploadResponse, UploadManyResponse,
    DocumentListItem, DocumentListResponse,
    DocumentResponse, PageInfo, Classification
)
from app.services.parsing_service import parse_document
from app.services.chunking import chunk_pages
from app.services.embeddings import EmbeddingService
from app.services.vector_store_qdrant import VectorStore
from app.services.ai_processor import AIProcessor
from app.core.config import settings

router = APIRouter()

def _persist_document_and_pages(
    db: Session,
    doc_id: str,
    storage_uri: str,
    filename: str,
    content_type: Optional[str],
    pages,
    meta
):
    document = models.Document(
        id=doc_id,
        filename=filename,
        mime_type=content_type or "",
        storage_uri=storage_uri,
        language_primary=getattr(meta, "language_primary", None),
        ocr_applied=bool(getattr(meta, "ocr_applied", False)),
        page_count=len(pages),
    )
    db.add(document)
    for p in pages:
        page_row = models.Page(
            doc_id=doc_id,
            page_number=p.page_number,
            text_raw=p.text_raw,
            text_ocr=p.text_ocr,
            lang_detected=p.lang_detected,
            has_images=p.has_images,
        )
        db.add(page_row)
    db.commit()

def _load_document_full(db: Session, doc_id: str) -> DocumentResponse:
    d: Optional[models.Document] = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Document not found")

    pages = db.query(models.Page)\
        .filter(models.Page.doc_id == doc_id)\
        .order_by(models.Page.page_number.asc())\
        .all()
    ai_out: Optional[models.AIOutput] = db.query(models.AIOutput).filter(models.AIOutput.doc_id == doc_id).first()

    summary = getattr(ai_out, "summary", {}) if ai_out else {}
    classification = Classification(
        label=getattr(ai_out, "classification", None) or None,
        confidence=getattr(ai_out, "classification_confidence", None) if ai_out else None
    )
    extraction = getattr(ai_out, "extraction", {}) if ai_out else {}

    page_infos: List[PageInfo] = []
    for p in pages:
        text_raw = getattr(p, "text_raw", "") or ""
        text_ocr = getattr(p, "text_ocr", "") or ""
        text_len = len(text_raw) if text_raw else len(text_ocr)
        page_infos.append(PageInfo(
            page_number=getattr(p, "page_number", 0) or 0,
            has_images=bool(getattr(p, "has_images", False)),
            lang_detected=getattr(p, "lang_detected", None),
            text_len=int(text_len),
        ))

    return DocumentResponse(
        doc_id=d.id,
        filename=d.filename,
        page_count=d.page_count or len(page_infos),
        ocr_applied=bool(getattr(d, "ocr_applied", False)),
        language_primary=getattr(d, "language_primary", None),
        summary=summary,
        classification=classification,
        extraction=extraction,
        pages=page_infos
    )

@router.post("/upload", response_model=UploadManyResponse)
def upload_documents(
    files: List[UploadFile] = File(..., description="Repeat 'files' for multiple uploads")
):
    if not files:
        raise HTTPException(status_code=422, detail="No files found. Send multipart/form-data with one or more 'files' parts.")

    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    emb = EmbeddingService()
    vs = VectorStore()
    ai = AIProcessor()

    results: List[UploadResponse] = []

    for uf in files:
        try:
            if not uf or not uf.filename:
                raise HTTPException(status_code=400, detail="Empty file part.")
            ext = os.path.splitext(uf.filename)[1].lower()
            # UPDATE this list to include image extensions
            if ext not in [".pdf", ".docx", ".png", ".jpg", ".jpeg"]:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Unsupported type for {uf.filename}. Only .pdf, .docx, .png, .jpg, .jpeg are supported."
                )

            doc_id = str(uuid.uuid4())
            storage_uri = os.path.join(settings.STORAGE_DIR, f"{doc_id}{ext}")

            content = uf.file.read()
            if not content:
                raise HTTPException(status_code=400, detail=f"{uf.filename} is empty.")
            with open(storage_uri, "wb") as f:
                f.write(content)

            pages, meta = parse_document(storage_uri)

            # Persist
            with SessionLocal() as db:
                _persist_document_and_pages(db, doc_id, storage_uri, uf.filename, uf.content_type, pages, meta)

            # Chunk + embeddings + Qdrant
            chunks = chunk_pages(pages, doc_id=doc_id)
            vectors = emb.embed_chunks(chunks)
            vs.upsert_chunks(doc_id, chunks, vectors)

            # AI analysis (summary, classification, extraction)
            outputs = ai.process_document(chunks)
            with SessionLocal() as db:
                ai_out = models.AIOutput(
                    doc_id=doc_id,
                    summary=outputs.summary,
                    classification=outputs.classification.label,
                    classification_confidence=outputs.classification.confidence,
                    extraction=outputs.extraction,
                    model_version=outputs.model_version,
                )
                db.add(ai_out)
                db.commit()

            results.append(UploadResponse(
                doc_id=doc_id,
                filename=uf.filename,
                page_count=len(pages),
                ocr_applied=bool(getattr(meta, "ocr_applied", False)),
                language_primary=getattr(meta, "language_primary", None),
            ))
        except HTTPException as he:
            results.append(UploadResponse(
                doc_id="",
                filename=uf.filename if uf else "",
                page_count=0,
                ocr_applied=False,
                language_primary=None,
                error=str(he.detail)
            ))
        except Exception as e:
            results.append(UploadResponse(
                doc_id="",
                filename=uf.filename if uf else "",
                page_count=0,
                ocr_applied=False,
                language_primary=None,
                error=str(e)
            ))

    return JSONResponse(content=UploadManyResponse(results=[r.model_dump() for r in results]).model_dump())

@router.get("", response_model=DocumentListResponse)
def list_documents(limit: int = Query(100, ge=1, le=500), offset: int = Query(0, ge=0)):
    with SessionLocal() as db:
        q = db.query(models.Document).order_by(models.Document.created_at.desc())
        total = q.count()
        docs = q.limit(limit).offset(offset).all()
        items = [
            DocumentListItem(
                doc_id=d.id,
                filename=d.filename,
                page_count=d.page_count,
                uploaded_at=d.created_at.isoformat()
            )
            for d in docs
        ]
        return DocumentListResponse(total=total, items=items)

@router.get("/{doc_id}", response_model=DocumentResponse)
def get_document(doc_id: str):
    with SessionLocal() as db:
        return _load_document_full(db, doc_id)

@router.delete("/{doc_id}")
def delete_document(doc_id: str):
    with SessionLocal() as db:
        d: Optional[models.Document] = db.query(models.Document).filter(models.Document.id == doc_id).first()
        if not d:
            raise HTTPException(status_code=404, detail="Document not found")

        # Remove from vector store (best-effort)
        try:
            vs = VectorStore()
            vs.delete_document(doc_id)
        except Exception:
            pass

        # Delete related rows
        db.query(models.AIOutput).filter(models.AIOutput.doc_id == doc_id).delete()
        db.query(models.Page).filter(models.Page.doc_id == doc_id).delete()

        # Delete stored file
        try:
            if getattr(d, "storage_uri", None) and os.path.exists(d.storage_uri):
                os.remove(d.storage_uri)
        except Exception:
            pass

        db.delete(d)
        db.commit()

        return JSONResponse(content={"status": "ok", "doc_id": doc_id})