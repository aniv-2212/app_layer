"""Tests for all external threat-intel services and API endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.api.deps import AppContainer, get_container
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
async def test_health_endpoint(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "connected_clients" in data


@pytest.mark.asyncio
async def test_intel_status_endpoint(client):
    response = await client.get("/api/custom/intel/status")
    assert response.status_code == 200
    data = response.json()
    assert "cloudflare_radar" in data
    assert "shodan" in data
    assert "virustotal" in data
    assert "phishtank" in data
    assert "abuseipdb" in data
    assert "alienvault_otx" in data
    assert "cisa_kev" in data
    assert "ipinfo" in data
    assert "hibp" in data

    # Verify no API keys are leaked
    payload = response.text
    assert "cfk_" not in payload
    assert "vQ35JMR" not in payload
    assert "d64e7d" not in payload
    assert "40dc4791" not in payload
    assert "3b4915a4" not in payload
    assert "20cb6528" not in payload


@pytest.mark.asyncio
async def test_cisa_kev_public_feed(client):
    """CISA KEV is a public feed, no key required, should always work."""
    response = await client.get("/api/custom/cisa/kev?limit=3")
    assert response.status_code == 200
    data = response.json()
    assert "vulnerabilities" in data
    assert data["total"] >= 0
    assert data["count"] <= 3


@pytest.mark.asyncio
async def test_hibp_breaches_public(client):
    """HIBP breaches endpoint requires no key."""
    response = await client.get("/api/custom/hibp/breaches?limit=3")
    assert response.status_code == 200
    data = response.json()
    assert "breaches" in data
    assert data["total"] >= 0


@pytest.mark.asyncio
async def test_ipinfo(client):
    """IPInfo works without a key (limited quota)."""
    response = await client.get("/api/custom/ipinfo/8.8.8.8")
    assert response.status_code == 200
    data = response.json()
    assert data["ip"] == "8.8.8.8"


@pytest.mark.asyncio
async def test_radar_not_configured_returns_503(client):
    """If Cloudflare Radar is not configured, return 503."""
    container = get_container()
    if not container.intel_hub.radar.configured:
        response = await client.get("/api/custom/radar/attacks")
        assert response.status_code == 503
    else:
        pytest.skip("Cloudflare Radar is configured — skipping 503 test")


@pytest.mark.asyncio
async def test_shodan_not_configured_returns_503(client):
    container = get_container()
    if not container.intel_hub.shodan.configured:
        response = await client.get("/api/custom/shodan/api-info")
        assert response.status_code == 503
    else:
        pytest.skip("Shodan is configured — skipping 503 test")


@pytest.mark.asyncio
async def test_virustotal_not_configured_returns_503(client):
    container = get_container()
    if not container.intel_hub.virustotal.configured:
        response = await client.get("/api/custom/virustotal/ip/8.8.8.8")
        assert response.status_code == 503
    else:
        pytest.skip("VirusTotal is configured — skipping 503 test")


@pytest.mark.asyncio
async def test_otx_not_configured_returns_503(client):
    container = get_container()
    if not container.intel_hub.otx.configured:
        response = await client.get("/api/custom/otx/pulses")
        assert response.status_code == 503
    else:
        pytest.skip("OTX is configured — skipping 503 test")


@pytest.mark.asyncio
async def test_abuseipdb_not_configured_returns_503(client):
    container = get_container()
    if not container.intel_hub.abuseipdb.configured:
        response = await client.get("/api/custom/abuseipdb/check/8.8.8.8")
        assert response.status_code == 503
    else:
        pytest.skip("AbuseIPDB is configured — skipping 503 test")


@pytest.mark.asyncio
async def test_phishtank(client):
    """PhishTank works without an app key."""
    response = await client.get("/api/custom/phishtank/check?url=https://example.com")
    assert response.status_code == 200
    data = response.json()
    assert data["url"] == "https://example.com"
    assert "in_database" in data


@pytest.mark.asyncio
async def test_hibp_account_requires_key(client):
    """HIBP account lookup returns 503 when no key is configured."""
    container = get_container()
    if not container.intel_hub.hibp.api_key:
        response = await client.get("/api/custom/hibp/account/test@example.com")
        assert response.status_code == 503
        data = response.json()
        assert "HIBP_API_KEY" in data.get("detail", "")
    else:
        pytest.skip("HIBP key configured — skipping 503 test")


@pytest.mark.asyncio
async def test_dashboard_snapshot_endpoint(client):
    response = await client.get("/api/dashboard/snapshot")
    assert response.status_code == 200
    data = response.json()
    assert "attacks" in data
    assert "statistics" in data
    assert "heatmap" in data
    assert "replay" in data
    assert "countries" in data
    assert "stream" in data


@pytest.mark.asyncio
async def test_attacks_endpoint(client):
    response = await client.get("/api/attacks?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "items" in data


@pytest.mark.asyncio
async def test_countries_endpoint(client):
    response = await client.get("/api/countries")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    assert len(data["items"]) > 0


@pytest.mark.asyncio
async def test_statistics_endpoint(client):
    response = await client.get("/api/statistics")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data


@pytest.mark.asyncio
async def test_statistics_summary_endpoint(client):
    response = await client.get("/api/statistics/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_attacks" in data


@pytest.mark.asyncio
async def test_heatmap_endpoint(client):
    response = await client.get("/api/heatmap")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "total" in data


@pytest.mark.asyncio
async def test_replay_endpoint(client):
    response = await client.get("/api/replay")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "capacity" in data


@pytest.mark.asyncio
async def test_stream_flow(client):
    # Start stream
    start = await client.post("/api/stream/start")
    assert start.status_code == 200
    assert start.json()["running"] is True

    # Check status
    status = await client.get("/api/stream/status")
    assert status.status_code == 200
    assert status.json()["running"] is True

    # Generate a tick
    tick = await client.post("/api/stream/tick")
    assert tick.status_code == 200
    assert tick.json()["generated"] is True

    # Stop stream
    stop = await client.post("/api/stream/stop")
    assert stop.status_code == 200
    assert stop.json()["running"] is False


@pytest.mark.asyncio
async def test_cors_endpoints_not_leaking_secrets(client):
    endpoints = [
        "/api/custom/intel/status",
        "/api/custom/intel/snapshot",
        "/api/custom/cisa/kev",
        "/api/custom/hibp/breaches",
        "/api/custom/ipinfo/8.8.8.8",
    ]
    for endpoint in endpoints:
        response = await client.get(endpoint)
        assert response.status_code in (200, 503)
        if response.status_code == 200:
            assert "api_key" not in response.text.lower()
            assert "token" not in response.text.lower() or "ipinfo_token" not in response.text


@pytest.mark.asyncio
async def test_country_detail_endpoint(client):
    response = await client.get("/api/countries/US")
    assert response.status_code == 200
    data = response.json()
    assert data["country_code"] == "US"

    # Test 404 for unknown country
    response = await client.get("/api/countries/ZZ")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_dashboard_export_json(client):
    response = await client.get("/api/dashboard/export?format=json&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "items" in data


@pytest.mark.asyncio
async def test_cisa_kev_search(client):
    response = await client.get("/api/custom/cisa/kev?search=chrome&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "vulnerabilities" in data
