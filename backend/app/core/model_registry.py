from dataclasses import dataclass
import os

@dataclass(frozen=True)
class ModelConfig:
    ollama_model: str | None = None
    hf_model_id: str | None = None
    temperature: float = 0.1
    top_p: float = 0.9
    max_tokens: int = 1024
    json_only: bool = True
    description: str = ""

_OLLAMA_REGISTRY = {
    # Use this basic model for testing
    "qwen2.5:3b": ModelConfig(
        ollama_model="qwen2.5:3b",
        description="This is a test."
    ),

    # Make the widely-available tag the default to avoid "model not found"
    "qwen2.5:7b-instruct": ModelConfig(
        ollama_model="qwen2.5:7b-instruct",
        description="Default: strong multilingual 7B, stable JSON adherence."
    ),
    # Kept for convenience if you do have quant tags installed
    "qwen2.5:7b-instruct-q4_K_M": ModelConfig(
        ollama_model="qwen2.5:7b-instruct-q4_K_M",
        description="Quantized tag (if available in your Ollama registry)."
    ),
    "qwen3:7b-instruct-q4_K_M": ModelConfig(
        ollama_model="qwen3:7b-instruct-q4_K_M",
        description="Candidate: adopt after A/B validation on golden set."
    ),

    "llama3:8b-instruct-q4_K_M": ModelConfig(
        ollama_model="llama3:8b-instruct-q4_K_M",
        description="Alternative: excellent instruction following and tooling."
    ),
}

def get_runtime() -> str:
    rt = os.getenv("LLM_RUNTIME", "ollama").lower()    
    if rt not in ("ollama", "vllm", "gemini"):
        raise ValueError("LLM_RUNTIME must be 'ollama', 'vllm', or 'gemini'")
    return rt

def get_model_config() -> ModelConfig:
    runtime = get_runtime()
    if runtime == "ollama":
        name = os.getenv("MODEL_NAME", "qwen2.5:7b-instruct-q4_K_M") # Replaced with "qwen2.5:7b-instruct-q4_K_M" for default model.
        cfg = _OLLAMA_REGISTRY.get(name)
        if not cfg:
            raise ValueError(f"MODEL_NAME '{name}' not found in registry. Available: {list(_OLLAMA_REGISTRY.keys())}")
        return cfg    
   
    elif runtime == "gemini":
        # For Gemini, we don't need a complex config from the registry.
        # We can just return a default ModelConfig.
        # The actual model name ('gemini-1.5-flash') is handled in the GeminiClient itself.
        return ModelConfig(description="Gemini runtime via API")   
    
    else: # This block now correctly handles only the 'vllm' case
        hf_id = os.getenv("VLLM_MODEL_ID", "").strip()
        if not hf_id:
            raise ValueError("VLLM_MODEL_ID must be set when LLM_RUNTIME=vllm")
        return ModelConfig(hf_model_id=hf_id, description="vLLM runtime via HF model id")  
