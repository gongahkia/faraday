import logging
from typing import Optional, AsyncGenerator
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from huggingface_hub import snapshot_download
from ..document_processing.embeddings import get_embedding_model

MODEL_CACHE = "./models/language"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

class LocalLLM:
    def __init__(self, model_name: str = "TheBloke/Mistral-7B-Instruct-v0.2-GGUF"):
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self.embedding_model = get_embedding_model()
        self._load_model()

    def _load_model(self):
        """Load quantized GGUF model with E-Ink device optimizations"""
        try:
            model_path = snapshot_download(
                repo_id=self.model_name,
                allow_patterns=["*.gguf"],
                cache_dir=MODEL_CACHE
            )
            
            torch.set_num_threads(4)
            
            self.tokenizer = AutoTokenizer.from_pretrained(
                "mistralai/Mistral-7B-Instruct-v0.2",
                cache_dir=MODEL_CACHE
            )
            
            self.model = AutoModelForCausalLM.from_pretrained(
                model_path,
                device_map="auto",
                load_in_4bit=True,
                max_memory={0: "6GB"}  
            )
            
        except Exception as e:
            logging.error(f"Model loading failed: {str(e)}")
            raise

    async def generate(
        self, 
        prompt: str,
        context: str = "",
        max_new_tokens: int = 512,
        temperature: float = 0.7
    ) -> AsyncGenerator[str, None]:
        """Async generator for E-Ink friendly response streaming"""
        try:
            full_prompt = f"[INST] {prompt}\n\nContext: {context} [/INST]"
            
            inputs = self.tokenizer(
                full_prompt, 
                return_tensors="pt",
                max_length=4096,  
                truncation=True
            ).to(DEVICE)

            generate_kwargs = dict(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                do_sample=True,
                top_p=0.95,
                pad_token_id=self.tokenizer.eos_token_id,
                streamer=None
            )

            with torch.no_grad():
                outputs = self.model.generate(**generate_kwargs)
                
            response = self.tokenizer.decode(
                outputs[0][inputs.input_ids.shape[1]:], 
                skip_special_tokens=True
            )
            
            for chunk in [response[i:i+100] for i in range(0, len(response), 100)]:
                yield chunk
                
        except torch.cuda.OutOfMemoryError:
            logging.error("VRAM exceeded - reduce model size or input length")
            yield "Error: Device memory limit exceeded"