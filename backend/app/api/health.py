import os
from fastapi import APIRouter
from sqlalchemy import text
from app.db.database import SessionLocal
from app.core.config import settings
from app.core.model_registry import get_runtime, get_model_config
from qdrant_client import QdrantClient
import requests

router = APIRouter()

@router.get("/healthz")
def healthz():
    # DB check
    db_ok = False
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
            db_ok = True
    except Exception:
        db_ok = False

    # Qdrant check (cloud or local)
    qdrant_ok = False
    try:
        qc = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY, timeout=settings.QDRANT_TIMEOUT)
        _ = qc.get_collections()
        qdrant_ok = True
    except Exception:
        qdrant_ok = False

    # LLM runtime check (Ollama only for now)
    llm_ok = True
    llm_detail = "ok"
    try:
        if get_runtime() == "ollama":
            ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
            r = requests.get(f"{ollama_url}/api/tags", timeout=5)
            if r.ok:
                names = [m.get("name","") for m in r.json().get("models",[])]
                want = get_model_config().ollama_model
                if want and want not in names:
                    llm_ok = False
                    llm_detail = f"model '{want}' not installed"
            else:
                llm_ok = False
                llm_detail = f"HTTP {r.status_code}"
    except Exception as e:
        llm_ok = False
        llm_detail = str(e)

    return {
        "ok": db_ok and qdrant_ok and llm_ok,
        "db": db_ok,
        "qdrant": qdrant_ok,
        "llm": {"ok": llm_ok, "detail": llm_detail}
    }