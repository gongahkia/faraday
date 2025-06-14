from fastapi import APIRouter, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import AsyncGenerator
import logging
import time
from ..ai_service.local_llm import LocalLLM
from ..ai_service.vector_db import VectorDB
from ..document_processing.text_splitter import RecursiveCharacterTextSplitter

router = APIRouter()
llm = LocalLLM()
vector_db = VectorDB()

class ChatQuery(BaseModel):
    text: str
    context_mode: str = "general"  
    max_tokens: int = 512
    temperature: float = 0.7

@router.post("/chat", response_class=StreamingResponse)
async def chat_endpoint(query: ChatQuery):
    """Streaming endpoint optimized for E-Ink partial refresh"""
    try:
        context = await _get_context(query)
        return StreamingResponse(
            _generate_response(query, context),
            media_type="text/event-stream",
            headers={"X-Eink-Refresh-Mode": "partial"}
        )
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Generation failed: {str(e)}"
        )

async def _get_context(query: ChatQuery) -> str:
    """Retrieve document context for RAG"""
    if query.context_mode == "document":
        results = vector_db.search(query.text, k=3)
        return "\n".join([doc[0] for doc in results])
    return ""

async def _generate_response(query: ChatQuery, context: str) -> AsyncGenerator[str, None]:
    """E-Ink optimized response streaming"""
    start_time = time.time()
    
    async for chunk in llm.generate(
        prompt=query.text,
        context=context,
        max_new_tokens=query.max_tokens,
        temperature=query.temperature
    ):
        latency = (time.time() - start_time) * 1000
        if latency > 2000:  
            yield "\n[SYSTEM: Trigger full refresh]\n"
            start_time = time.time()
            
        yield chunk