from langdetect import detect
from typing import Optional

def detect_language(text: str) -> Optional[str]:
    try:
        if not text or not text.strip():
            return None
        return detect(text)
    except Exception:
        return None