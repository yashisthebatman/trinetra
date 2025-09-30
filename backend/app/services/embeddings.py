from sentence_transformers import SentenceTransformer
import numpy as np
from app.core.config import settings

class EmbeddingService:
    _model = None

    def __init__(self):
        if EmbeddingService._model is None:
            EmbeddingService._model = SentenceTransformer(settings.EMBEDDING_MODEL, device="cpu")

    def embed_text(self, text: str) -> np.ndarray:
        vec = EmbeddingService._model.encode([text], normalize_embeddings=True)
        return vec[0].astype(np.float32)

    def embed_chunks(self, chunks) -> list[np.ndarray]:
        texts = [c.text for c in chunks]
        mat = EmbeddingService._model.encode(texts, normalize_embeddings=True)
        return [row.astype(np.float32) for row in mat]