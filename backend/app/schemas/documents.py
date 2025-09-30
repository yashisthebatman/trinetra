from pydantic import BaseModel
from typing import List, Optional, Any

class UploadResponse(BaseModel):
    doc_id: str
    filename: str
    page_count: int
    ocr_applied: bool
    language_primary: Optional[str] = None
    error: Optional[str] = None

class UploadManyResponse(BaseModel):
    results: List[UploadResponse]

class PageInfo(BaseModel):
    page_number: int
    has_images: bool
    lang_detected: Optional[str] = None
    text_len: int

class Classification(BaseModel):
    label: Optional[str] = None
    confidence: Optional[float] = None

class DocumentResponse(BaseModel):
    doc_id: str
    filename: str
    page_count: int
    ocr_applied: bool
    language_primary: Optional[str] = None
    summary: Any
    classification: Classification
    extraction: Any
    pages: List[PageInfo]

class DocumentListItem(BaseModel):
    doc_id: str
    filename: str
    page_count: int
    uploaded_at: str

class DocumentListResponse(BaseModel):
    total: int
    items: List[DocumentListItem]