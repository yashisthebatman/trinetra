import os
from dataclasses import dataclass
from dotenv import load_dotenv

# Load .env early
load_dotenv()

@dataclass
class Settings:
    DB_URL: str = os.getenv("DB_URL", "postgresql+psycopg2://trinetra_app:password@localhost:5432/trinetra_db")
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str | None = os.getenv("QDRANT_API_KEY") or None    
    # comment out gemini api key below when using ollama model (not necessary but harmless)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "") 

    # Vector store performance tunables
    QDRANT_TIMEOUT: float = float(os.getenv("QDRANT_TIMEOUT", "60"))  # seconds
    QDRANT_BATCH_SIZE: int = int(os.getenv("QDRANT_BATCH_SIZE", "64"))  # points per upsert batch

    STORAGE_DIR: str = os.getenv("STORAGE_DIR", os.path.abspath("./storage"))
    COLLECTION_NAME: str = os.getenv("QDRANT_COLLECTION", "trinetra_chunks")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "intfloat/multilingual-e5-base")
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "2000"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "200"))

    # How much of the chunk text to store in Qdrant payload for preview/snippet
    TEXT_SNIPPET_CHARS: int = int(os.getenv("TEXT_SNIPPET_CHARS", "500"))
    VLM_MODEL_NAME: str = os.getenv("VLM_MODEL_NAME", "qwen2-vl:7b-q4_K_M")
settings = Settings()
