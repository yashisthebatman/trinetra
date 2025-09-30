from pydantic import BaseModel
from typing import List

class SearchHit(BaseModel):
    doc_id: str
    chunk_id: str
    score: float
    page_start: int
    page_end: int
    snippet: str

class SearchResponse(BaseModel):
    results: List[SearchHit]

# ADD THIS NEW CLASS
class RAGResponse(BaseModel):
    answer: str
    sources: List[SearchHit]