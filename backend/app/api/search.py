from fastapi import APIRouter, HTTPException, Query, Body
from app.services.embeddings import EmbeddingService
from app.services.vector_store_qdrant import VectorStore
from app.services.ai_processor import AIProcessor # <-- Import AIProcessor
from app.schemas.search import SearchResponse, SearchHit, RAGResponse # <-- Import RAGResponse

router = APIRouter()

# NEW RAG ENDPOINT
@router.post("/search/rag", response_model=RAGResponse)
def rag_search(query: str = Body(..., embed=True)):
    try:
        # 1. Initialize services
        emb = EmbeddingService()
        vs = VectorStore()
        ai = AIProcessor()

        # 2. Embed the user's query
        query_vector = emb.embed_text(query)

        # 3. Retrieve relevant chunks from the vector store
        hits = vs.search(query_vector, k=5) # Retrieve top 5 chunks
        if not hits:
            return RAGResponse(answer="I couldn't find any relevant information in the documents.", sources=[])

        # 4. Format the retrieved chunks for the LLM
        context_chunks = [h.payload.get("text_snippet", "") for h in hits if h.payload]
        source_hits = [
            SearchHit(
                doc_id=h.payload.get("doc_id", ""),
                chunk_id=h.payload.get("chunk_id", ""),
                score=h.score,
                page_start=h.payload.get("page_start", 0),
                page_end=h.payload.get("page_end", 0),
                snippet=h.payload.get("text_snippet", "")
            ) for h in hits if h.payload
        ]

        # 5. Generate the answer using the AI Processor
        answer = ai.answer_question(question=query, context_chunks=context_chunks)

        # 6. Return the answer and the sources
        return RAGResponse(answer=answer, sources=source_hits)

    except Exception as e:
        print(f"Error during RAG search: {e}")
        raise HTTPException(status_code=500, detail="Failed to perform RAG search.")

# EXISTING SEMANTIC SEARCH ENDPOINT
@router.get("/search", response_model=SearchResponse)
def search(query: str = Query(...), k: int = Query(10, ge=1, le=50)):
    emb = EmbeddingService()
    vs = VectorStore()
    qvec = emb.embed_text(query)
    hits = vs.search(qvec, k=k)
    if hits is None:
        raise HTTPException(status_code=500, detail="Vector search failed")

    results = []
    for h in hits:
        payload = h.payload or {}
        snippet = payload.get("text_snippet") or payload.get("text") or ""
        # Additional safeguard: truncate for display
        short = snippet[:200] + ("..." if len(snippet) > 200 else "")
        results.append(SearchHit(
            doc_id=payload.get("doc_id", ""),
            chunk_id=payload.get("chunk_id", ""),
            score=h.score,
            page_start=payload.get("page_start", 0),
            page_end=payload.get("page_end", 0),
            snippet=short
        ))
    return SearchResponse(results=results)  