import json
import google.generativeai as genai
from typing import Any, Dict, Optional
from pydantic import BaseModel, ValidationError
from app.core.config import settings
import re
from tenacity import retry, stop_after_attempt, wait_exponential

class GeminiClient:
    def __init__(self):
        # =====> FIX: MOVED THE CONFIGURATION LOGIC INSIDE __init__ <=====
        # Now, this code only runs when a GeminiClient is actually created.
        if not settings.GEMINI_API_KEY:
            raise ValueError("LLM_RUNTIME is 'gemini', but GEMINI_API_KEY is not set.")
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # ================================================================

        self.model = genai.GenerativeModel(
            'gemini-pro',
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        self.model_version_name = "gemini-pro"

    def _clean_json_string(self, text: str) -> str:
        """
        Finds and extracts the first valid JSON object from a string.
        Handles cases where the model might add markdown backticks.
        """
        # This regex is a bit more robust for finding JSON within markdown
        match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', text, re.DOTALL)
        if match:
            return match.group(1)
        # Fallback for plain JSON without backticks, ensuring it starts with { and ends with }
        match = re.search(r'(\{.*\})', text, re.DOTALL)
        if match:
            return match.group(1)
        return text

    @retry(
        wait=wait_exponential(multiplier=1, min=2, max=60),
        stop=stop_after_attempt(3)
    )
    def generate_json(self, prompt: str, schema_model: BaseModel, system: Optional[str] = None) -> Dict[str, Any]:
        """
        Generates a JSON object from a prompt, validates it against a Pydantic schema, and retries on failure.
        """
        full_prompt = f"{system}\n\n{prompt}" if system else prompt
        
        try:
            response = self.model.generate_content(full_prompt)
            cleaned_text = self._clean_json_string(response.text)
            data = json.loads(cleaned_text)
            validated_data = schema_model.model_validate(data)
            return validated_data.model_dump()

        except (json.JSONDecodeError, ValidationError) as e:
            print(f"Error validating Gemini response. Response text: '{response.text}'. Error: {e}")
            raise
        except Exception as e:
            print(f"An unexpected error occurred with Gemini API: {e}")
            raise