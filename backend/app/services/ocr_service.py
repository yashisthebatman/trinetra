import pytesseract
from PIL import Image
from typing import Optional
import tempfile

# Keep the original function for PDF parsing, but have it call the new one
def ocr_page_pixmap(pixmap) -> Optional[str]:
    # Convert PyMuPDF pixmap to PIL image
    with tempfile.NamedTemporaryFile(suffix=".png") as tmp:
        pixmap.save(tmp.name)
        img = Image.open(tmp.name)
        # Now call our more generic function
        return ocr_image(img)

# NEW: This is the missing function that needs to be added.
def ocr_image(image: Image.Image) -> Optional[str]:
    """
    Performs OCR on a given PIL Image object.
    """
    try:
        # Using "eng+mal" for English and Malayalam as per your original config
        txt = pytesseract.image_to_string(image, lang="eng+mal")
        return txt.strip() if txt and txt.strip() else None
    except Exception as e:
        # It's good practice to log the error
        print(f"Error during OCR: {e}")
        return None