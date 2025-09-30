from qdrant_client import QdrantClient
from qdrant_client.http import models as qm
from app.core.config import settings
from typing import List
import uuid

class VectorStore:
    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY,
            timeout=settings.QDRANT_TIMEOUT
        )
        self.collection = settings.COLLECTION_NAME
        self._ensure_collection_and_indexes()

    def _ensure_collection_and_indexes(self):
        # Create collection if missing
        try:
            self.client.get_collection(self.collection)
        except Exception:
            self.client.recreate_collection(
                collection_name=self.collection,
                vectors_config=qm.VectorParams(size=768, distance=qm.Distance.COSINE),
            )
        # Ensure payload index on doc_id for filtering
        try:
            self.client.create_payload_index(
                collection_name=self.collection,
                field_name="doc_id",
                field_schema=qm.PayloadSchemaType.KEYWORD,
            )
        except Exception:
            # Index might already exist — ignore
            pass

    def upsert_chunks(self, doc_id: str, chunks, vectors: List):
        bs = max(1, settings.QDRANT_BATCH_SIZE)
        acc: List[qm.PointStruct] = []
        for c, v in zip(chunks, vectors):
            pid = str(uuid.uuid4())
            payload = {
                "doc_id": doc_id,
                "chunk_id": c.chunk_id,
                "page_start": c.page_start,
                "page_end": c.page_end,
                "text_snippet": c.text[: settings.TEXT_SNIPPET_CHARS],
            }
            acc.append(qm.PointStruct(id=pid, vector=v.tolist(), payload=payload))
            if len(acc) >= bs:
                self.client.upsert(collection_name=self.collection, points=acc)
                acc = []
        if acc:
            self.client.upsert(collection_name=self.collection, points=acc)

    def delete_document(self, doc_id: str):
        # First try: filter delete (requires index)
        try:
            self.client.delete(
                collection_name=self.collection,
                points_selector=qm.FilterSelector(
                    filter=qm.Filter(
                        must=[qm.FieldCondition(key="doc_id", match=qm.MatchValue(value=doc_id))]
                    )
                ),
                wait=True,
            )
            return
        except Exception:
            # Fallback: scroll to collect point IDs by payload and delete by ID (no index needed)
            collected_ids = []
            next_page = None
            while True:
                res = self.client.scroll(
                    collection_name=self.collection,
                    with_payload=True,
                    with_vectors=False,
                    limit=1000,
                    offset=next_page,
                    # Filter-less scroll; filter later in Python to avoid index requirement
                )
                points, next_page = res
                if not points:
                    break
                for p in points:
                    if (p.payload or {}).get("doc_id") == doc_id:
                        collected_ids.append(p.id)
                if next_page is None:
                    break
            if collected_ids:
                self.client.delete(
                    collection_name=self.collection,
                    points_selector=qm.PointIdsList(points=collected_ids),
                    wait=True,
                )

    def search(self, query_vec, k: int = 10):
        return self.client.search(
            collection_name=self.collection,
            query_vector=query_vec.tolist(),
            limit=k,
            with_payload=True
        )