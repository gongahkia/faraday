import faiss
import numpy as np
import os
import pickle
from typing import List, Tuple
from pathlib import Path

class VectorDB:
    def __init__(self, index_path: str = "./models/embedding/faiss_index"):
        self.index_path = index_path
        self.index = None
        self.documents = []
        self.metadata = []
        self._init_index()

    def _init_index(self):
        """Initialize or load existing FAISS index"""
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
            with open(f"{self.index_path}_meta.pkl", "rb") as f:
                self.documents, self.metadata = pickle.load(f)
        else:
            Path(self.index_path).parent.mkdir(parents=True, exist_ok=True)
            self.index = faiss.IndexFlatL2(384)  

    def add_documents(self, documents: List[str], metadatas: List[dict]):
        """Add documents with metadata to vector store"""
        embeddings = self._get_embeddings(documents)
        self.index.add(embeddings)
        self.documents.extend(documents)
        self.metadata.extend(metadatas)
        self._persist()

    def search(self, query: str, k: int = 5) -> List[Tuple[str, float, dict]]:
        """Semantic search with metadata filtering"""
        query_embedding = self._get_embeddings([query])
        distances, indices = self.index.search(query_embedding, k)
        
        return [
            (
                self.documents[idx], 
                float(distances[0][i]),
                self.metadata[idx]
            )
            for i, idx in enumerate(indices[0])
            if idx != -1
        ]

    def _get_embeddings(self, texts: List[str]) -> np.ndarray:
        """Batch embedding generation with normalization"""
        from ..document_processing.embeddings import get_embedding_model
        model = get_embedding_model()
        embeddings = model.encode(texts, normalize_embeddings=True)
        return embeddings.astype(np.float32)

    def _persist(self):
        """Save index and metadata for E-Ink device storage"""
        faiss.write_index(self.index, self.index_path)
        with open(f"{self.index_path}_meta.pkl", "wb") as f:
            pickle.dump((self.documents, self.metadata), f)