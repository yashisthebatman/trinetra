from pydantic import BaseModel, Field
from typing import List, Dict, Any

class SummarizationSchema(BaseModel):
    summary_bullets: List[str]
    citations: List[Dict[str, int]]  # {"page_start": int, "page_end": int}

class ClassificationSchema(BaseModel):
    label: str
    confidence: float

class ExtractionSafetySchema(BaseModel):
    action_items: List[Dict[str, Any]] = Field(default_factory=list)
    deadlines: List[Dict[str, Any]] = Field(default_factory=list)
    equipment_affected: List[str] = Field(default_factory=list)
    severity_level: str | None = None
    references: List[Dict[str, Any]] = Field(default_factory=list)

class ExtractionInvoiceSchema(BaseModel):
    vendor_name: str | None = None
    invoice_number: str | None = None
    po_number: str | None = None
    total_amount: Dict[str, Any] | None = None
    payment_due_date: str | None = None
    line_items: List[Dict[str, Any]] = Field(default_factory=list)
    contract_effective_date: str | None = None
    contract_expiry_date: str | None = None
    penalty_clauses: List[str] = Field(default_factory=list)

class AIDocResult(BaseModel):
    summary: Dict[str, Any]
    classification: ClassificationSchema
    extraction: Dict[str, Any]
    model_version: str