"""AI Assistant REST endpoint."""

from fastapi import APIRouter, Depends, HTTPException

from app.ai_assistant.schemas import ChatErrorResponse, ChatRequest, ChatResponse
from app.ai_assistant.service import AiAssistantService
from app.api.deps import get_ai_assistant_service

router = APIRouter(prefix="/ai-assistant", tags=["AI Assistant"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    responses={400: {"model": ChatErrorResponse}, 503: {"model": ChatErrorResponse}},
)
async def chat(
    payload: ChatRequest,
    service: AiAssistantService = Depends(get_ai_assistant_service),
) -> ChatResponse:
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    if len(payload.message) > 4096:
        raise HTTPException(status_code=400, detail="Message too long (max 4096 characters).")
    try:
        return await service.chat(payload)
    except Exception as exc:
        raise HTTPException(status_code=503, detail="AI assistant service unavailable.") from exc


@router.get("/health")
async def health(
    service: AiAssistantService = Depends(get_ai_assistant_service),
) -> dict:
    configured = service._api_key() is not None
    return {"status": "healthy", "configured": configured, "provider": "openai-compatible"}
