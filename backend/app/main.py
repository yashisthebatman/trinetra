from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.documents import router as documents_router
from app.api.search import router as search_router
from app.db.database import init_db
from app.services.vector_store_qdrant import VectorStore

app = FastAPI(title="Project Trinetra API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # This line is crucial
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, tags=["health"])
app.include_router(documents_router, prefix="/documents", tags=["documents"])
app.include_router(search_router, tags=["search"])

@app.on_event("startup")
def on_startup():
    init_db()
    # Ensure Qdrant collection + payload index exist
    VectorStore()  # constructor ensures indexes