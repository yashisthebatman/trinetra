# backend/app/db/crud.py

from sqlalchemy.orm import Session
from . import models

# --- Image CRUD Functions ---

def create_image_record(db: Session, doc_id: str, page_number: int, storage_uri: str) -> models.Image:
    """Creates a record for an extracted image in the database."""
    db_image = models.Image(
        doc_id=doc_id,
        page_number=page_number,
        storage_uri=storage_uri
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def get_image_uris_for_doc(db: Session, doc_id: str) -> list[str]:
    """Gets all image storage URIs for a given document ID."""
    return db.query(models.Image.storage_uri).filter(models.Image.doc_id == doc_id).all()

def save_caption_for_image(db: Session, storage_uri: str, caption: str, model_version: str):
    """Finds an image by its storage_uri and saves its generated caption."""
    db_image = db.query(models.Image).filter(models.Image.storage_uri == storage_uri).first()
    if db_image:
        db_image.caption = caption
        db_image.caption_model_version = model_version
        db.commit()
    return db_image

def get_images_for_doc(db: Session, doc_id: str) -> list[models.Image]:
    """Gets all image objects for a document, to be returned by the API."""
    return db.query(models.Image).filter(models.Image.doc_id == doc_id).order_by(models.Image.page_number).all()