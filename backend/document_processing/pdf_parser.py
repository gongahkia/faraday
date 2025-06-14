from PyPDF2 import PdfReader
from typing import List
import logging

class PDFProcessingError(Exception):
    pass

class FaradayPDFProcessor:
    def __init__(self):
        self._supported_types = ['application/pdf']

    def process(self, file_path: str) -> List[str]:
        """Extract and validate PDF text for E-Ink devices"""
        try:
            return self._extract_pages(file_path)
        except Exception as e:
            logging.error(f"PDF processing failed: {str(e)}")
            raise PDFProcessingError(f"Failed to process PDF: {str(e)}")

    def _extract_pages(self, file_path: str) -> List[str]:
        """Text extraction with empty page filtering"""
        reader = PdfReader(file_path)
        return [
            page.extract_text().strip()
            for page in reader.pages
            if page.extract_text().strip()
        ]

    @property
    def supported_mime_types(self):
        return self._supported_types