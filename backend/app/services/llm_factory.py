from app.core.model_registry import get_runtime
from .llm_client_ollama import OllamaClient
from .llm_client_vllm import VLLMClient
from .llm_client_gemini import GeminiClient


def get_llm_client():
    rt = get_runtime()
    if rt == "ollama":
        return OllamaClient()
    elif rt == "vllm":
        return VLLMClient()  
    elif rt == "gemini": 
        return GeminiClient()
    else:        
        raise ValueError(f"Unsupported LLM runtime: {rt}. Must be 'ollama', 'vllm', or 'gemini'.")

