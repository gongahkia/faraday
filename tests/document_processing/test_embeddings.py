import unittest
import numpy as np
from backend.document_processing.embeddings import get_embedding_model

class TestEmbeddingModel(unittest.TestCase):
    def setUp(self):
        self.model = get_embedding_model()

    def test_model_loading(self):
        self.assertIsNotNone(self.model.model)
        self.assertEqual(self.model.model[0].pooling_mode_mean_tokens, True)

    def test_embedding_generation(self):
        texts = ["test sentence", "another test"]
        embeddings = self.model.encode(texts)
        self.assertEqual(embeddings.shape, (2, 384))
        self.assertFalse(np.isnan(embeddings).any())