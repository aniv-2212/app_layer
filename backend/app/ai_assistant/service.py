"""AI provider service — communicates with OpenAI-compatible APIs."""

import logging
import uuid
from datetime import datetime, timezone

import httpx

from app.ai_assistant.prompts import CONTEXT_TEMPLATE, SYSTEM_PROMPT
from app.ai_assistant.schemas import ChatRequest, ChatResponse, ContextSchema
from app.config.settings import Settings

logger = logging.getLogger(__name__)

TIMEOUT_SECONDS = 45
MAX_HISTORY_TURNS = 25
MAX_RESPONSE_TOKENS = 2048


def _format_context(context: ContextSchema | None) -> str:
    if context is None:
        return ""
    parts = {k: v or "N/A" for k, v in context.model_dump().items()}
    return CONTEXT_TEMPLATE.format(**parts)


class AiAssistantService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client: httpx.AsyncClient | None = None

    def _ensure_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(TIMEOUT_SECONDS),
                limits=httpx.Limits(max_keepalive_connections=5),
            )
        return self._client

    def _provider_base_url(self) -> str:
        provider = self._settings.ai_provider or "openai"
        if provider == "openai" or provider.startswith("https://"):
            return provider if provider.startswith("https://") else "https://api.openai.com/v1"
        return f"https://{provider}/v1"

    def _model_name(self) -> str:
        return self._settings.ai_model or "gpt-4o-mini"

    def _api_key(self) -> str | None:
        return self._settings.ai_api_key

    async def chat(self, request: ChatRequest) -> ChatResponse:
        api_key = self._api_key()
        if not api_key:
            return ChatResponse(
                response="AI Assistant is not configured. Set AI_API_KEY in the backend environment.",
                timestamp=datetime.now(timezone.utc).isoformat(),
                conversation_id=uuid.uuid4().hex[:12],
            )

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        context_text = _format_context(request.context)
        if context_text:
            messages.append({"role": "system", "content": context_text})

        history = request.conversation_history or []
        for turn in history[-MAX_HISTORY_TURNS:]:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": str(content)[:4096]})

        messages.append({"role": "user", "content": request.message[:4096]})

        client = self._ensure_client()
        base_url = self._provider_base_url()
        model = self._model_name()

        try:
            response = await client.post(
                f"{base_url}/chat/completions",
                json={
                    "model": model,
                    "messages": messages,
                    "max_tokens": MAX_RESPONSE_TOKENS,
                    "temperature": 0.7,
                },
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
            )
            response.raise_for_status()
            data = response.json()
            ai_text = data["choices"][0]["message"]["content"]
        except httpx.TimeoutException:
            ai_text = "The AI provider did not respond in time. Please try again later."
        except httpx.HTTPStatusError as exc:
            status = exc.response.status_code
            if status == 401:
                ai_text = "AI authentication failed. Check the AI_API_KEY in the backend configuration."
            elif status == 429:
                ai_text = "AI rate limit reached. Please wait a moment before asking another question."
            else:
                logger.warning("AI provider returned HTTP %d: %s", status, exc.response.text[:200])
                ai_text = "The AI service returned an error. Please try again."
        except Exception as exc:
            logger.error("AI provider request failed: %s", exc)
            ai_text = "Failed to reach the AI provider. The backend may be offline."

        return ChatResponse(
            response=ai_text,
            timestamp=datetime.now(timezone.utc).isoformat(),
            conversation_id=uuid.uuid4().hex[:12],
        )

    async def close(self) -> None:
        if self._client:
            await self._client.aclose()
            self._client = None
