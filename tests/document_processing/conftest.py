import sys
import os
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

@pytest.fixture
def sample_pdf(tmp_path):
    from fpdf import FPDF
    pdf_path = tmp_path / "test_sample.pdf"
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', size=12)
    pdf.cell(200, 10, txt='Test Content', ln=True)
    pdf.output(pdf_path)
    return pdf_path