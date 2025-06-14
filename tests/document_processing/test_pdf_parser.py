import unittest
import pytest
from backend.document_processing.pdf_parser import FaradayPDFProcessor, PDFProcessingError

class TestFaradayPDFProcessor(unittest.TestCase):
    def setUp(self):
        self.processor = FaradayPDFProcessor()

    @pytest.mark.usefixtures("sample_pdf")
    def test_valid_pdf_processing(self, sample_pdf):
        pages = self.processor.process(str(sample_pdf))
        self.assertIsInstance(pages, list)
        self.assertGreater(len(pages), 0)
        self.assertIn('Test Content', pages[0])

    def test_invalid_file_handling(self):
        with self.assertRaises(PDFProcessingError):
            self.processor.process("non_existent.pdf")

    def test_supported_types(self):
        self.assertIn('application/pdf', self.processor.supported_mime_types)