import os
import uuid
import fitz # PyMuPDF
from docx import Document as DocxDocument
from typing import List, Tuple
from dataclasses import dataclass
from app.services.ocr_service import ocr_page_pixmap, ocr_image # <--- Import ocr_image
from app.services.langdet import detect_language
from app.core.config import settings
from PIL import Image # <--- Import the Image library

@dataclass
class ParsedPage:
    page_number: int
    text_raw: str | None
    text_ocr: str | None
    lang_detected: str | None
    has_images: bool

@dataclass
class ParseMeta:
    language_primary: str | None
    ocr_applied: bool

def parse_pdf(path: str) -> Tuple[List[ParsedPage], ParseMeta]:
    doc = fitz.open(path)
    pages: List[ParsedPage] = []
    ocr_applied_any = False
    langs = {}

    for i in range(len(doc)):
        page = doc[i]
        text_raw = page.get_text("text") or ""
        imgs = page.get_images(full=True)
        has_images = len(imgs) > 0
        text_ocr = None

        # If text is very short, attempt OCR
        if len(text_raw.strip()) < 20:
            # render page to image
            pix = page.get_pixmap(dpi=200)
            text_ocr = ocr_page_pixmap(pix)
            if text_ocr:
                ocr_applied_any = True

        lang = detect_language((text_ocr or text_raw)[:2000])
        if lang:
            langs[lang] = langs.get(lang, 0) + 1

        pages.append(ParsedPage(
            page_number=i+1,
            text_raw=text_raw if text_raw.strip() else None,
            text_ocr=text_ocr,
            lang_detected=lang,
            has_images=has_images
        ))

    language_primary = None
    if langs:
        language_primary = max(langs.items(), key=lambda kv: kv[1])[0]

    return pages, ParseMeta(language_primary=language_primary, ocr_applied=ocr_applied_any)

def parse_docx(path: str) -> Tuple[List[ParsedPage], ParseMeta]:
    doc = DocxDocument(path)
    text = "\n".join(p.text for p in doc.paragraphs if p.text)
    # Treat whole doc as a single page for MVP
    lang = detect_language(text[:2000])
    page = ParsedPage(page_number=1, text_raw=text, text_ocr=None, lang_detected=lang, has_images=False)
    return [page], ParseMeta(language_primary=lang, ocr_applied=False)

def parse_image(path: str) -> Tuple[List[ParsedPage], ParseMeta]:
    """
    Parses an image file by performing OCR on it.
    Treats the entire image as a single page.
    """
    try:
        img = Image.open(path)
        text_ocr = ocr_image(img)
    except Exception as e:
        print(f"Could not open or OCR image {path}: {e}")
        text_ocr = None

    lang = detect_language(text_ocr[:2000]) if text_ocr else None
    
    # An image is like a single-page document where all text is OCR'd
    page = ParsedPage(
        page_number=1,
        text_raw=None, # No raw text from an image
        text_ocr=text_ocr,
        lang_detected=lang,
        has_images=True # It IS an image
    )
    
    meta = ParseMeta(
        language_primary=lang,
        ocr_applied=True # OCR is always applied for images
    )
    
    return [page], meta

# UPDATE the main dispatcher function
def parse_document(path: str) -> Tuple[List[ParsedPage], ParseMeta]:
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        return parse_pdf(path)
    elif ext == ".docx":
        return parse_docx(path)
    # NEW: Add a condition for image extensions
    elif ext in [".png", ".jpg", ".jpeg"]:
        return parse_image(path)
    else:
        raise ValueError("Unsupported file type")
