"""
Custom / self-serve API endpoints.

Add your own endpoints in this file to inspect realtime data without touching
the core route modules. Every endpoint here is mounted under /api/custom and
appears automatically in the interactive docs at http://localhost:8000/docs.

HOW TO ADD YOUR OWN ENDPOINT
----------------------------
1. Pick the data source you need from app.api.deps:
     get_attack_repo        -> in-memory attack buffer (raw events)
     get_statistics_service -> aggregated stats / summaries
     get_heatmap_service    -> per-country attack counts
     get_replay_service     -> replay buffer
     get_stream_service     -> live generator control + status
     get_country_repo       -> country metadata
2. Copy one of the endpoints below and change the path + logic.
3. Save — uvicorn --reload picks it up instantly. Test it from /docs or curl.
"""

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.deps import (
    get_attack_repo,
    get_heatmap_service,
    get_intel_hub,
    get_statistics_service,
    get_stream_service,
)
from app.repositories.attack_repository import AttackRepository
from app.services.external.base import ExternalServiceError
from app.services.external.intel_hub import IntelHub
from app.services.heatmap_service import HeatmapService
from app.services.statistics_service import StatisticsService
from app.services.stream_service import StreamService

router = APIRouter(prefix="/custom", tags=["Custom"])


def _intel_error(exc: ExternalServiceError) -> HTTPException:
    return HTTPException(status_code=exc.status_code, detail=exc.detail)


@router.get("/realtime")
async def realtime_snapshot(
    limit: int = Query(10, ge=1, le=100, description="How many recent attacks to include"),
    attack_repo: AttackRepository = Depends(get_attack_repo),
    statistics: StatisticsService = Depends(get_statistics_service),
    heatmap: HeatmapService = Depends(get_heatmap_service),
    stream: StreamService = Depends(get_stream_service),
) -> dict:
    """One-call realtime check: stream status, summary, latest attacks, heatmap."""
    attacks = await attack_repo.get_all()
    latest = sorted(attacks, key=lambda a: a.id, reverse=True)[:limit]
    summary = await statistics.get_summary()
    return {
        "stream": stream.status(),
        "summary": summary,
        "latest_attacks": latest,
        "heatmap": heatmap.get_counts(),
    }


@router.get("/attacks/latest")
async def latest_attack(
    attack_repo: AttackRepository = Depends(get_attack_repo),
) -> dict:
    """Return the single most recent attack event, or empty when idle."""
    attacks = await attack_repo.get_all()
    if not attacks:
        return {"attack": None, "stored": 0}
    newest = max(attacks, key=lambda a: a.id)
    return {"attack": newest, "stored": attack_repo.stored_count}


@router.get("/buffer")
async def buffer_status(
    attack_repo: AttackRepository = Depends(get_attack_repo),
) -> dict:
    """Quick counters for the in-memory attack buffer."""
    return {
        "stored": attack_repo.stored_count,
        "capacity": attack_repo.capacity,
        "total_ingested": attack_repo.total_ingested,
        "severity_counts": await attack_repo.get_summary_counts(),
    }


# ---------------------------------------------------------------------------
# External threat-intel endpoints (keys configured in backend/.env)
# ---------------------------------------------------------------------------


@router.get("/intel/status")
async def intel_status(hub: IntelHub = Depends(get_intel_hub)) -> dict:
    """Which external services are configured + their last success/error."""
    return hub.status()


@router.get("/intel/snapshot")
async def intel_snapshot(hub: IntelHub = Depends(get_intel_hub)) -> dict:
    """Aggregated feed snapshot (same payload as the intel:update socket event)."""
    return await hub.snapshot()


@router.get("/radar/attacks")
async def radar_attacks(
    date_range: str = Query("1d", description="Cloudflare Radar dateRange, e.g. 1d, 7d"),
    hub: IntelHub = Depends(get_intel_hub),
) -> dict:
    """Cloudflare Radar layer-7 attack origins + volume timeseries."""
    try:
        return {
            "top_origins": await hub.radar.top_attack_origins(date_range=date_range),
            "timeseries": await hub.radar.attack_timeseries(date_range=date_range),
        }
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/shodan/host/{ip}")
async def shodan_host(ip: str, hub: IntelHub = Depends(get_intel_hub)) -> dict:
    """Shodan host lookup: open ports, services, vulns."""
    try:
        return await hub.shodan.host(ip)
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/shodan/api-info")
async def shodan_api_info(hub: IntelHub = Depends(get_intel_hub)) -> dict:
    """Shodan plan info and remaining credits."""
    try:
        return await hub.shodan.api_info()
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/virustotal/ip/{ip}")
async def virustotal_ip(ip: str, hub: IntelHub = Depends(get_intel_hub)) -> dict:
    """VirusTotal reputation for an IP address."""
    try:
        return await hub.virustotal.ip_report(ip)
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/virustotal/file/{file_hash}")
async def virustotal_file(file_hash: str, hub: IntelHub = Depends(get_intel_hub)) -> dict:
    """VirusTotal report for a file hash (MD5/SHA1/SHA256)."""
    try:
        return await hub.virustotal.file_report(file_hash)
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/phishtank/check")
async def phishtank_check(
    url: str = Query(..., description="URL to check against PhishTank"),
    hub: IntelHub = Depends(get_intel_hub),
) -> dict:
    """Check whether a URL is a known phish."""
    try:
        return await hub.phishtank.check_url(url)
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/abuseipdb/check/{ip}")
async def abuseipdb_check(
    ip: str,
    max_age_days: int = Query(90, ge=1, le=365),
    hub: IntelHub = Depends(get_intel_hub),
) -> dict:
    """AbuseIPDB confidence score and recent reports for an IP."""
    try:
        return await hub.abuseipdb.check_ip(ip, max_age_days=max_age_days)
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/otx/pulses")
async def otx_pulses(
    limit: int = Query(10, ge=1, le=50),
    hub: IntelHub = Depends(get_intel_hub),
) -> dict:
    """Latest AlienVault OTX threat pulses."""
    try:
        return await hub.otx.latest_pulses(limit=limit)
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/otx/ip/{ip}")
async def otx_ip(ip: str, hub: IntelHub = Depends(get_intel_hub)) -> dict:
    """AlienVault OTX reputation for an IPv4 address."""
    try:
        return await hub.otx.ip_reputation(ip)
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/cisa/kev")
async def cisa_kev(
    limit: int = Query(25, ge=1, le=200),
    search: str | None = Query(None, description="Filter by CVE id, vendor, or product"),
    hub: IntelHub = Depends(get_intel_hub),
) -> dict:
    """CISA Known Exploited Vulnerabilities catalog (public feed)."""
    try:
        return await hub.cisa_kev.vulnerabilities(limit=limit, search=search)
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/ipinfo/{ip}")
async def ipinfo_lookup(ip: str, hub: IntelHub = Depends(get_intel_hub)) -> dict:
    """IPInfo geolocation + network ownership for an IP."""
    try:
        return await hub.ipinfo.lookup(ip)
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/hibp/breaches")
async def hibp_breaches(
    limit: int = Query(20, ge=1, le=100),
    hub: IntelHub = Depends(get_intel_hub),
) -> dict:
    """Have I Been Pwned public breach catalog, newest first."""
    try:
        return await hub.hibp.breaches(limit=limit)
    except ExternalServiceError as exc:
        raise _intel_error(exc)


@router.get("/hibp/account/{account}")
async def hibp_account(account: str, hub: IntelHub = Depends(get_intel_hub)) -> dict:
    """Breach exposure for one account (requires HIBP_API_KEY)."""
    try:
        return await hub.hibp.breached_account(account)
    except ExternalServiceError as exc:
        raise _intel_error(exc)
