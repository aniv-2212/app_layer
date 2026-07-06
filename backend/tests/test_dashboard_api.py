"""HTTP contract tests for dashboard aggregate and stream endpoints."""

import pytest


@pytest.mark.asyncio
async def test_stream_tick_populates_dashboard_snapshot(client):
    tick_response = await client.post("/api/stream/tick")
    assert tick_response.status_code == 200
    tick_payload = tick_response.json()
    assert tick_payload["generated"] is True
    assert "attack" in tick_payload

    snapshot_response = await client.get("/api/dashboard/snapshot")
    assert snapshot_response.status_code == 200
    snapshot = snapshot_response.json()
    assert snapshot["attacks"]
    assert snapshot["statistics"]["total_requests"] > 0
    assert "heatmap" in snapshot
    assert "replay" in snapshot
    assert "countries" in snapshot
    assert "stream" in snapshot


@pytest.mark.asyncio
async def test_dashboard_metadata_exposes_filter_options(client):
    response = await client.get("/api/dashboard/metadata")
    assert response.status_code == 200
    payload = response.json()
    assert "SQL Injection" in payload["attack_types"]
    assert "Critical" in payload["severities"]
    assert "Blocked" in payload["statuses"]
    assert "India" in payload["countries"]


@pytest.mark.asyncio
async def test_export_csv_returns_downloadable_text(client):
    await client.post("/api/stream/tick")
    response = await client.get("/api/dashboard/export?format=csv")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/csv")
    assert "timestamp,source_country,destination_country" in response.text
