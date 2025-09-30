from celery import Celery
from app.core.config import settings
from app.db.database import SessionLocal
from app.db import models, crud
from app.services.parsing_service import parse_document
from app.services.chunking import chunk_pages
from app.services.embeddings import EmbeddingService
from app.services.vector_store_qdrant import VectorStore
from app.services.ai_processor import AIProcessor

# Import the new Ollama VLM service and its model constant
from app.services.vision_service_ollama import get_image_caption_with_ollama_vlm, VISION_MODEL

# [cite_start]Initialize Celery [cite: 23]
celery_app = Celery(
    "worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_BROKER_URL
)
celery_app.conf.update(
    task_track_started=True,
    broker_connection_retry_on_startup=True
)

@celery_app.task(name="process_document_task")
def process_document_task(doc_id: str, storage_uri: str, filename: str, content_type: str):
    """
    [cite_start]This is the Celery task that processes a document concurrently. [cite: 23, 24]
    It now handles both text analysis with a standard LLM and image analysis with a VLM.
    """
    try:
        # [cite_start]1. Parse document to extract text and save image files [cite: 24]
        pages, meta = parse_document(storage_uri)

        # [cite_start]2. Update document metadata and page info in DB [cite: 24]
        with SessionLocal() as db:
            db.query(models.Document).filter(models.Document.id == doc_id).update({
                "language_primary": meta.language_primary,
                "ocr_applied": meta.ocr_applied,
                "page_count": len(pages)
            })
            for p in pages:
                page_row = models.Page(
    doc_id=doc_id, page_number=p.page_number, text_raw=p.text_raw,
    text_ocr=p.text_ocr, lang_detected=p.lang_detected, has_images=p.has_images
)
                db.add(page_row)
            db.commit()

        # [cite_start]3. Chunk text, create embeddings, and upsert to vector store [cite: 27]
        chunks = chunk_pages(pages, doc_id=doc_id)
        emb = EmbeddingService()
        vectors = emb.embed_chunks(chunks)
        vs = VectorStore()
        vs.upsert_chunks(doc_id, chunks, vectors)

        # 4. AI TEXT ANALYSIS (using the default Ollama text model)
        ai_text_processor = AIProcessor()
        text_outputs = ai_text_processor.process_document(chunks)

        # 5. AI IMAGE ANALYSIS (using the dedicated Ollama VLM)
        with SessionLocal() as db:
            # Retrieve records of images that were extracted during parsing
            images_to_process = crud.get_images_for_doc(db, doc_id)
            for image in images_to_process:
                # Get a caption for each image using the VLM
                caption = get_image_caption_with_ollama_vlm(image.storage_uri)
                # Save the caption to the database
                crud.save_caption_for_image(
                    db,
                    image_id=image.id,
                    caption=caption,
                    model_version=VISION_MODEL
                )

        # [cite_start]6. Persist TEXT AI outputs and mark document as complete [cite: 28]
        with SessionLocal() as db:
            ai_out = models.AIOutput(
                doc_id=doc_id,
                summary=text_outputs.summary,
                classification=text_outputs.classification.label,
                classification_confidence=text_outputs.classification.confidence,
                extraction=text_outputs.extraction,
                model_version=text_outputs.model_version
            )
            db.add(ai_out)
            db.query(models.Document).filter(models.Document.id == doc_id).update({"status": "completed"})
            db.commit()
    except Exception as e:
        # [cite_start]If anything fails, mark the document with an error status [cite: 29]
        print(f"Error processing document {doc_id}: {e}")
        with SessionLocal() as db:
            db.query(models.Document).filter(models.Document.id == doc_id).update({"status": "failed"})
            db.commit()

    return {"doc_id": doc_id, "status": "completed"}