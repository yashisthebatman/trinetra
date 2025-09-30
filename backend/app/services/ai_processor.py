from typing import List
from app.services.chunking import Chunk
from app.schemas.ai import (
    SummarizationSchema, ClassificationSchema, ExtractionSafetySchema,
    ExtractionInvoiceSchema, AIDocResult
)
from app.services.llm_factory import get_llm_client
from app.core.model_registry import get_model_config

SAFETY_LABELS = [
    "Safety Bulletin","Maintenance Report","Vendor Invoice","Contract",
    "HR Policy","Legal/Compliance","Environmental/Safety Circular",
    "Board Minutes","Other"
]

class AIProcessor:
    def __init__(self):
        self.llm = get_llm_client()
        self.model_cfg = get_model_config()

    def _aggregate_for_context(self, chunks: List[Chunk], max_chars: int = 15000) -> str:
        """
        Naive aggregation: append chunk texts until char budget reached.
        """
        buf = []
        total = 0
        for c in chunks:
            t = c.text
            if total + len(t) > max_chars:
                remaining = max_chars - total
                if remaining > 0:
                    buf.append(t[:remaining])
                break
            buf.append(t)
            total += len(t)
        return "\n\n".join(buf)

    def summarize(self, text: str) -> dict:
        prompt = (
            "You are an assistant that outputs ONLY valid JSON. "
            "Summarize the given document in 3 to 5 concise bullet points. "
            "Provide page citation ranges (page_start, page_end). "
            'Output schema: {"summary_bullets":[str,...],"citations":[{"page_start":int,"page_end":int}]}.\n'
            f"Document:\n{text[:8000]}"
        )
        return self.llm.generate_json(prompt, SummarizationSchema)
    
    # NEW RAG METHOD
    def answer_question(self, question: str, context_chunks: List[str]) -> str:
        """
        Generates an answer to a question based on the provided context.
        """
        # Combine the context chunks into a single string
        context_str = "\n\n".join(context_chunks)

        # Create a prompt using the context
        prompt = (
            "You are an assistant for question-answering tasks. "
            "Use the following pieces of retrieved context to answer the question. "
            "If you don't know the answer, just say that you don't know. "
            "Keep the answer concise.\n\n"
            f"Context:\n{context_str}\n\n"
            f"Question: {question}\n\n"
            "Answer:"
        )

        # Call the new text generation method
        return self.llm.generate_text(prompt)

    def classify(self, text: str) -> ClassificationSchema:
        labels = ", ".join(SAFETY_LABELS)
        prompt = (
            "You are an assistant that outputs ONLY valid JSON. "
            f"Classify the document into one of: {labels}. Provide a confidence 0..1. "
            'Output schema: {"label":str,"confidence":float}.\n'
            f"Document:\n{text[:8000]}"
        )
        data = self.llm.generate_json(prompt, ClassificationSchema)
        return ClassificationSchema.model_validate(data)

    def extract(self, text: str, label: str) -> dict:
        if label == "Safety Bulletin":
            prompt = (
                "You are an assistant that outputs ONLY valid JSON. "
                "Extract action_items, deadlines, equipment_affected, severity_level, references. "
                'Output schema: {"action_items":[{"text":str,"owner":str|null,"due_date":str|null,"page":int|null}],'
                '"deadlines":[{"text":str,"date":str|null,"page":int|null}],'
                '"equipment_affected":[str],"severity_level":str|null,'
                '"references":[{"text":str,"page":int|null}]}.\n'
                f"Document:\n{text[:8000]}"
            )
            return self.llm.generate_json(prompt, ExtractionSafetySchema)
        elif label in ("Vendor Invoice", "Contract"):
            prompt = (
                "You are an assistant that outputs ONLY valid JSON. "
                "Extract key fields (no full table parsing). "
                'Output schema: {"vendor_name":str|null,"invoice_number":str|null,"po_number":str|null,'
                '"total_amount":{"value":float,"currency":str}|null,"payment_due_date":str|null,'
                '"line_items":[{"description":str,"qty":float|null,"unit_price":float|null,"amount":float|null}],'
                '"contract_effective_date":str|null,"contract_expiry_date":str|null,"penalty_clauses":[str]}.\n'
                f"Document:\n{text[:8000]}"
            )
            return self.llm.generate_json(prompt, ExtractionInvoiceSchema)
        else:
            return {}

    def process_document(self, chunks: List[Chunk]) -> AIDocResult:
        aggregated = self._aggregate_for_context(chunks)
        summary = self.summarize(aggregated)
        classification = self.classify(aggregated)
        extraction = self.extract(aggregated, classification.label)

        
        from app.core.model_registry import get_runtime
        if get_runtime() == 'gemini':
            model_version = "gemini-1.5-flash"
        else:          
            model_version = self.model_cfg.ollama_model or self.model_cfg.hf_model_id or "local-model"        

        return AIDocResult(
            summary=summary,
            classification=classification,
            extraction=extraction,
            model_version=model_version
        )