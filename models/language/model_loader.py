import os
import json
from llama_cpp import Llama
from typing import Dict, Any

class LanguageModelLoader:
    def __init__(self, model_dir: str = "./models/language"):
        self.model_dir = model_dir
        self.config = self._load_config()
        
    def _load_config(self) -> Dict[str, Any]:
        with open(os.path.join(self.model_dir, "config.json")) as f:
            return json.load(f)
    
    def load_default_model(self) -> Llama:
        model_path = os.path.join(
            self.model_dir,
            self.config["default_model"]
        )
        
        return Llama(
            model_path=model_path,
            n_ctx=2048,  
            n_threads=4,
            n_gpu_layers=0,  
            verbose=False
        )
    
    def get_model_specs(self, model_name: str) -> Dict[str, Any]:
        return self.config["supported_models"].get(model_name, {})