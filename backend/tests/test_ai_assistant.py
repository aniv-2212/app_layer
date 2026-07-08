"""Tests for the CyberAI Assistant chatbot."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import create_app


@pytest.fixture
def test_app():
    return create_app()


@pytest.fixture
async def client(test_app):
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_valid_chat_request(client: AsyncClient):
    """A valid chat request returns a response (graceful 'not configured' without API key)."""
    resp = await client.post(
        "/api/ai-assistant/chat",
        json={
            "message": "What is phishing?",
            "conversation_history": [],
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "response" in data
    assert "timestamp" in data
    assert "conversation_id" in data
    # Without an API key it returns a message saying it's not configured
    assert "not configured" in data["response"].lower() or len(data["response"]) > 0


@pytest.mark.asyncio
async def test_empty_message_rejected(client: AsyncClient):
    """Empty message returns 422 (Pydantic min_length catches it)."""
    resp = await client.post(
        "/api/ai-assistant/chat",
        json={"message": "", "conversation_history": []},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_whitespace_message_rejected(client: AsyncClient):
    """Whitespace-only message returns 400."""
    resp = await client.post(
        "/api/ai-assistant/chat",
        json={"message": "   ", "conversation_history": []},
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_excessive_message_length(client: AsyncClient):
    """Very long messages are rejected by Pydantic validation."""
    long_msg = "A" * 5000
    resp = await client.post(
        "/api/ai-assistant/chat",
        json={"message": long_msg, "conversation_history": []},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_malformed_request_missing_message(client: AsyncClient):
    """Request without message field is rejected."""
    resp = await client.post(
        "/api/ai-assistant/chat",
        json={"conversation_history": []},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_malformed_request_wrong_type(client: AsyncClient):
    """Request with non-string message is rejected."""
    resp = await client.post(
        "/api/ai-assistant/chat",
        json={"message": 123, "conversation_history": []},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_chat_with_context(client: AsyncClient):
    """Chat with optional context is accepted."""
    resp = await client.post(
        "/api/ai-assistant/chat",
        json={
            "message": "Why is this URL dangerous?",
            "conversation_history": [],
            "context": {
                "feature": "url_scanner",
                "risk_score": 85.0,
                "classification": "phishing",
                "url": "http://evil-phishing.com",
            },
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "response" in data


@pytest.mark.asyncio
async def test_chat_with_history(client: AsyncClient):
    """Chat with conversation history is accepted."""
    resp = await client.post(
        "/api/ai-assistant/chat",
        json={
            "message": "Tell me more",
            "conversation_history": [
                {"role": "user", "content": "What is phishing?"},
                {"role": "assistant", "content": "Phishing is a type of social engineering attack."},
            ],
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "response" in data


@pytest.mark.asyncio
async def test_context_size_limits(client: AsyncClient):
    """Context with excessive size fields is handled gracefully."""
    resp = await client.post(
        "/api/ai-assistant/chat",
        json={
            "message": "Test",
            "conversation_history": [],
            "context": {
                "feature": "url_scanner",
                "url": "http://" + "x" * 3000,
            },
        },
    )
    # url field max_length is 2048, so this should be 422
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    """Health endpoint returns status and configuration info."""
    resp = await client.get("/api/ai-assistant/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert "configured" in data
    assert "provider" in data


@pytest.mark.asyncio
async def test_conversation_history_limit(client: AsyncClient):
    """Excessive conversation history is rejected by Pydantic max_length."""
    many_turns = [{"role": "user", "content": f"Message {i}"} for i in range(100)]
    resp = await client.post(
        "/api/ai-assistant/chat",
        json={"message": "Final message", "conversation_history": many_turns},
    )
    assert resp.status_code == 422
