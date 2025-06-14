import unittest
from backend.document_processing.text_splitter import (
    RecursiveCharacterTextSplitter,
    TextSplitterConfigError
)

class TestRecursiveCharacterTextSplitter(unittest.TestCase):
    def setUp(self):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=100,
            chunk_overlap=20
        )

    def test_basic_splitting(self):
        text = " ".join(["word"] * 200)
        chunks = self.splitter.split_text(text)
        self.assertTrue(all(len(chunk.split()) <= 100 for chunk in chunks))
        self.assertTrue(any(chunks[i][-20:] in chunks[i+1] 
                          for i in range(len(chunks)-1)))

    def test_invalid_configuration(self):
        with self.assertRaises(TextSplitterConfigError):
            RecursiveCharacterTextSplitter(chunk_size=50, chunk_overlap=60)