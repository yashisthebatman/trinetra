from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column, String, Boolean, Integer, DateTime, ForeignKey, JSON, Float, Text
)
from datetime import datetime
from uuid import uuid4
from app.db.database import Base

def _id():
    return str(uuid4())

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, default=_id, index=True)
    filename = Column(String, nullable=False)
    mime_type = Column(String, nullable=True)
    storage_uri = Column(String, nullable=False)
    language_primary = Column(String, nullable=True)
    ocr_applied = Column(Boolean, default=False)
    page_count = Column(Integer, default=0)
    
    # This is the new line that was added
    status = Column(String, nullable=False, default="COMPLETED") 
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    pages = relationship("Page", backref="document", cascade="all, delete-orphan")
    ai_outputs = relationship("AIOutput", backref="document", cascade="all, delete-orphan")


class Page(Base):
    __tablename__ = "pages"
    id = Column(String, primary_key=True, default=_id)
    doc_id = Column(String, ForeignKey("documents.id", ondelete="CASCADE"), index=True, nullable=False)
    page_number = Column(Integer, nullable=False)
    text_raw = Column(Text, nullable=True)
    text_ocr = Column(Text, nullable=True)
    lang_detected = Column(String, nullable=True)
    has_images = Column(Boolean, default=False)


class AIOutput(Base):
    __tablename__ = "ai_outputs"
    id = Column(String, primary_key=True, default=_id)
    doc_id = Column(String, ForeignKey("documents.id", ondelete="CASCADE"), index=True, nullable=False)
    summary = Column(JSON, nullable=True)
    classification = Column(String, nullable=True)
    classification_confidence = Column(Float, default=0.0)
    extraction = Column(JSON, nullable=True)
    model_version = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)