from fastapi import APIRouter, UploadFile, HTTPException, status
from pathlib import Path
import shutil
import hashlib
from ..document_processing.pdf_parser import FaradayPDFProcessor
from ..ai_service.vector_db import VectorDB

router = APIRouter()
vector_db = VectorDB()
pdf_processor = FaradayPDFProcessor()

MAX_FILE_SIZE = 50 * 1024 * 1024  
ALLOWED_TYPES = {"application/pdf"}

@router.post("/documents/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(file: UploadFile):
    """Process and store documents for E-Ink querying"""
    try:
        _validate_file(file)
        file_hash = await _save_temp_file(file)
        chunks = _process_document(f"temp/{file_hash}")
        
        vector_db.add_documents(
            chunks,
            [{"source": file.filename, "page": i} for i in range(len(chunks))]
        )
        
        return {"status": "success", "chunks": len(chunks)}
    
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Document processing failed: {str(e)}"
        )

def _validate_file(file: UploadFile):
    if file.content_type not in ALLOWED_TYPES:
        raise ValueError("Invalid file type")
    if file.size > MAX_FILE_SIZE:
        raise ValueError("File size exceeds 50MB limit")

async def _save_temp_file(file: UploadFile) -> str:
    file_hash = hashlib.md5(file.filename.encode()).hexdigest()
    Path("temp").mkdir(exist_ok=True)
    
    with open(f"temp/{file_hash}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return file_hash

def _process_document(file_path: str) -> list[str]:
    return pdf_processor.process(file_path)