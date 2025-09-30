import json
import os
import requests
from typing import Any, Dict, Optional
from pydantic import BaseModel, ValidationError
from app.core.model_registry import get_model_config

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

class OllamaClient:
    def __init__(self):
        self.cfg = get_model_config()
        if not self.cfg.ollama_model:
            raise ValueError("Ollama model not configured (ollama_model is None)")

    def _installed_models(self) -> list[str]:
        try:
            r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=10)
            if r.ok:
                data = r.json()
                return [m.get("name","") for m in data.get("models",[])]
        except Exception:
            pass
        return []
    
    # NEW METHOD FOR RAG
    def generate_text(self, prompt: str) -> str:
        body = {
            "model": self.cfg.ollama_model,
            "prompt": prompt,
            "options": {
                "temperature": 0.2, # Lower temp for more factual answers
            },
            "stream": False
        }
        try:
            resp = requests.post(f"{OLLAMA_URL}/api/generate", json=body, timeout=180)
            resp.raise_for_status()
            return resp.json().get("response", "").strip()
        except Exception as e:
            print(f"Error generating text with Ollama: {e}")
            return "Sorry, I was unable to generate a response."

    def generate_json(self, prompt: str, schema_model: BaseModel, system: Optional[str] = None, retries: int = 2) -> Dict[str, Any]:
        sys_prefix = f"System: {system}\n" if system else ""
        body = {
            "model": self.cfg.ollama_model,
            "prompt": f"{sys_prefix}{prompt}",
            "options": {
                "temperature": self.cfg.temperature,
                "top_p": self.cfg.top_p
            },
            "stream": False
        }
        last_err = None
        for _ in range(retries + 1):
            # This print statement is the crucial part
            print("-" * 80)
            print("PROMPT SENT TO OLLAMA:")
            print(body["prompt"])
            print("-" * 80)

            resp = requests.post(f"{OLLAMA_URL}/api/generate", json=body, timeout=180)
            if resp.status_code == 404:
                try:
                    msg = resp.json().get("error") or resp.text
                except Exception:
                    msg = resp.text
                installed = ", ".join(self._installed_models()) or "(no models listed)"
                raise RuntimeError(
                    f"Ollama returned 404 (model missing?). Requested model '{self.cfg.ollama_model}'. "
                    f"Install it with: `ollama pull {self.cfg.ollama_model}`. "
                    f"Ollama URL: {OLLAMA_URL}. Installed models: {installed}. "
                    f"Server message: {msg}"
                )
            resp.raise_for_status()
            txt = resp.json().get("response", "").strip()
            print("-" * 80)
            print("RAW RESPONSE FROM OLLAMA:")
            print(txt)
            print("-" * 80)
            if not txt:
                last_err = "Ollama returned an empty response."
                continue
            try:
                data = json.loads(txt)
            except json.JSONDecodeError as e:
                last_err = e
                body["prompt"] = f"{sys_prefix}Output valid JSON only, no prose. {prompt}"
                continue
            try:
                return schema_model.model_validate(data).model_dump()
            except ValidationError as e:
                last_err = e
                body["prompt"] = f"{sys_prefix}Your previous output did not match the JSON schema. Output valid JSON only. {prompt}"
                continue
        raise RuntimeError(f"Ollama JSON generation failed: {last_err}")