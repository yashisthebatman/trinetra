import json
import os
import requests
from typing import Any, Dict, Optional, List
from pydantic import BaseModel, ValidationError
from app.core.model_registry import get_model_config

VLLM_BASE_URL = os.getenv("VLLM_BASE_URL", "http://localhost:8000/v1")
VLLM_API_KEY = os.getenv("VLLM_API_KEY", "")

class VLLMClient:
    def __init__(self):
        self.cfg = get_model_config()
        if not self.cfg.hf_model_id:
            raise ValueError("vLLM model not configured (hf_model_id is None)")
        self.session = requests.Session()
        if VLLM_API_KEY:
            self.session.headers.update({"Authorization": f"Bearer {VLLM_API_KEY}"})
        self.model = self.cfg.hf_model_id

    def generate_json(self, prompt: str, schema_model: BaseModel, system: Optional[str] = None, retries: int = 2) -> Dict[str, Any]:
        messages: List[Dict[str, str]] = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": self.cfg.temperature,
            "top_p": self.cfg.top_p
        }
        url = f"{VLLM_BASE_URL}/chat/completions"
        last_err = None
        for _ in range(retries + 1):
            resp = self.session.post(url, json=payload, timeout=120)
            resp.raise_for_status()
            data = resp.json()
            txt = data["choices"][0]["message"]["content"].strip()
            try:
                obj = json.loads(txt)
            except json.JSONDecodeError as e:
                last_err = e
                # add stricter system message for next attempt
                messages = [{"role": "system", "content": "You must output valid JSON only, no prose."}] + messages
                payload["messages"] = messages
                continue
            try:
                return schema_model.model_validate(obj).model_dump()
            except ValidationError as e:
                last_err = e
                messages = [{"role": "system", "content": "Your output must strictly match the JSON schema. Output valid JSON only."}] + [m for m in messages if m["role"] != "system"]
                payload["messages"] = messages
                continue
        raise RuntimeError(f"vLLM JSON generation failed: {last_err}")