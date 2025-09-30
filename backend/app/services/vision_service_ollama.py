# backend/app/services/vision_service_ollama.py

import base64
import os
import requests
from app.core.config import settings

# Get the Ollama URL from the central settings
OLLAMA_URL = settings.OLLAMA_URL

# This service specifically uses the VLM_MODEL_NAME from your .env file
VISION_MODEL = settings.VLM_MODEL_NAME

def get_image_caption_with_ollama_vlm(image_path: str) -> str:
    """
    Generates a caption for a local image file using the configured Ollama VLM.
    """
    if not os.path.exists(image_path):
        return "Error: Image file not found."

    try:
        # Encode the image in Base64, which is required by the Ollama API
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

        payload = {
            "model": VISION_MODEL,
            "prompt": "Describe this image in detail. What content does it show and what is its purpose?",
            "stream": False,
            "images": [encoded_string]
        }

        # Make the API call to Ollama's generate endpoint
        response = requests.post(f"{OLLAMA_URL}/api/generate", json=payload, timeout=180)
        response.raise_for_status()

        return response.json().get("response", "Could not generate a caption.").strip()

    except requests.exceptions.RequestException as e:
        print(f"Error calling Ollama API for VLM: {e}")
        return f"Failed to generate caption. Is Ollama running and is the model '{VISION_MODEL}' installed?"
    except Exception as e:
        print(f"An unexpected error occurred during image captioning: {e}")
        return "Failed to generate caption due to an unexpected error."