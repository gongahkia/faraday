import os
import json
from sentence_transformers import SentenceTransformer
from typing import Dict, Any

class EmbeddingModelManager:
    def __init__(self, model_dir: str = "./models/embedding"):
        self.model_dir = model_dir
        self.config = self._load_config()
        self.model = None
        
    def _load_config(self) -> Dict[str, Any]:
        config_path = os.path.join(self.model_dir, "config.json")
        with open(config_path) as f:
            return json.load(f)
    
    def get_default_model(self) -> SentenceTransformer:
        model_name = self.config["default_model"]
        return self.load_model(model_name)
    
    def load_model(self, model_name: str) -> SentenceTransformer:
        model_path = os.path.join(self.model_dir, model_name)
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model {model_name} not found in {model_path}")
            
        return SentenceTransformer(model_path, device="cpu")
    
    def get_model_info(self, model_name: str) -> Dict[str, Any]:
        return self.config["supported_models"].get(model_name, {})