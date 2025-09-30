from typing import List
from dataclasses import dataclass
from uuid import uuid4
from app.core.config import settings
from app.services.parsing_service import ParsedPage

@dataclass
class Chunk:
    chunk_id: str
    doc_id: str
    page_start: int
    page_end: int
    char_start: int
    char_end: int
    lang: str | None
    text: str

def chunk_pages(pages: List[ParsedPage], doc_id: str) -> List[Chunk]:
    """
    Produce fixed-size (approx by characters) chunks per page with overlap.
    Overlap is applied only within a page boundary for simplicity (MVP).
    Provenance: page_start == page_end for each produced chunk (page granularity).
    """
    max_size = settings.CHUNK_SIZE
    overlap = settings.CHUNK_OVERLAP
    chunks: List[Chunk] = []

    for page in pages:
        raw_text = (page.text_ocr or page.text_raw or "").strip()
        if not raw_text:
            continue
        start_idx = 0
        page_len = len(raw_text)
        while start_idx < page_len:
            end_idx = min(start_idx + max_size, page_len)
            segment = raw_text[start_idx:end_idx]
            chunk_id = str(uuid4())
            chunks.append(
                Chunk(
                    chunk_id=chunk_id,
                    doc_id=doc_id,
                    page_start=page.page_number,
                    page_end=page.page_number,
                    char_start=start_idx,
                    char_end=end_idx,
                    lang=page.lang_detected,
                    text=segment
                )
            )
            if end_idx == page_len:
                break
            # Move forward with overlap
            start_idx = end_idx - overlap if end_idx - overlap > start_idx else end_idx
    return chunks