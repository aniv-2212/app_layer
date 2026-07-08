from datetime import datetime, timezone

from pydantic import BaseModel, Field


class ContextSchema(BaseModel):
    feature: str | None = Field(default=None, max_length=64)
    url: str | None = Field(default=None, max_length=2048)
    risk_score: float | None = Field(default=None, ge=0, le=100)
    classification: str | None = Field(default=None, max_length=64)
    attack_type: str | None = Field(default=None, max_length=64)
    source_country: str | None = Field(default=None, max_length=64)
    target_country: str | None = Field(default=None, max_length=64)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4096)
    conversation_history: list[dict] = Field(default_factory=list, max_length=50)
    context: ContextSchema | None = None


class ChatResponse(BaseModel):
    response: str
    timestamp: str
    conversation_id: str


class ChatErrorResponse(BaseModel):
    detail: str
    code: str
