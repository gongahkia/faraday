import os
from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np

class EmbeddingModel:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.cache_dir = "./models/embedding"
        self.model = self._load_model()

    def _load_model(self) -> SentenceTransformer:
        """Load embedding model with E-Ink device optimizations"""
        os.makedirs(self.cache_dir, exist_ok=True)
        return SentenceTransformer(
            self.model_name,
            device="cpu",  
            cache_folder=self.cache_dir
        )

    def encode(self, texts: List[str], normalize: bool = True) -> np.ndarray:
        """Batch encode texts with memory optimization"""
        return self.model.encode(
            texts,
            normalize_embeddings=normalize,
            batch_size=8,  
            convert_to_numpy=True
        )

_embedding_model = None

def get_embedding_model() -> EmbeddingModel:
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = EmbeddingModel()
    return _embedding_model