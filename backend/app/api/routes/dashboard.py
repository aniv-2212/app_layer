"""Dashboard aggregate, export, and metadata endpoints."""

import csv
import io
from collections import Counter

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse

from app.api.deps import (
    get_attack_repo,
    get_country_repo,
    get_heatmap_service,
    get_replay_service,
    get_statistics_service,
    get_stream_service,
)
from app.models.attack import AttackStatus, AttackType, HttpMethod, Protocol, Severity
from app.repositories.attack_repository import AttackRepository
from app.repositories.country_repository import CountryRepository
from app.schemas.attack import AttackEventResponse, AttackFilterParams
from app.schemas.country import CountryResponse
from app.schemas.dashboard import CountryRollupResponse, DashboardSnapshotResponse, ExportResponse
from app.schemas.heatmap import HeatmapResponse
from app.services.heatmap_service import HeatmapService
from app.services.replay_service import ReplayService
from app.services.statistics_service import StatisticsService
from app.services.stream_service import StreamService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def _enum_values(enum_cls: type) -> list[str]:
    return [item.value for item in enum_cls]


def _coerce_filters(
    country: str | None,
    severity: str | None,
    attack_type: str | None,
    status: str | None,
    time_range: str | None,
    limit: int,
    offset: int = 0,
) -> AttackFilterParams:
    return AttackFilterParams(
        country=country,
        severity=Severity(severity) if severity else None,
        attack_type=AttackType(attack_type) if attack_type else None,
        status=AttackStatus(status) if status else None,
        time_range=time_range,
        limit=limit,
        offset=offset,
    )


@router.get("/snapshot", response_model=DashboardSnapshotResponse)
async def get_dashboard_snapshot(
    country: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    attack_type: str | None = Query(default=None, alias="attack_type"),
    status: str | None = Query(default=None),
    time_range: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    attack_repo: AttackRepository = Depends(get_attack_repo),
    country_repo: CountryRepository = Depends(get_country_repo),
    heatmap_service: HeatmapService = Depends(get_heatmap_service),
    replay_service: ReplayService = Depends(get_replay_service),
    statistics_service: StatisticsService = Depends(get_statistics_service),
    stream_service: StreamService = Depends(get_stream_service),
) -> DashboardSnapshotResponse:
    """Return attacks, stats, heatmap, replay, countries, and stream state in one call."""
    params = _coerce_filters(country, severity, attack_type, status, time_range, limit)
    attacks, _ = await attack_repo.filter(params)
    replay = await replay_service.get_replay(
        country=country,
        severity=severity,
        attack_type=attack_type,
        status=status,
        time_range=time_range,
    )
    statistics = await statistics_service.get_statistics(
        country=country,
        severity=severity,
        attack_type=attack_type,
        status=status,
        time_range=time_range,
    )
    heatmap = await heatmap_service.get_heatmap(country=country, time_range=time_range)
    countries = [CountryResponse.model_validate(c.model_dump()) for c in country_repo.get_all()]

    return DashboardSnapshotResponse(
        attacks=[AttackEventResponse.model_validate(a.model_dump()) for a in attacks],
        statistics=statistics,
        heatmap=heatmap,
        replay=replay,
        countries=countries,
        stream=stream_service.status(),
    )


@router.get("/metadata")
async def get_dashboard_metadata(
    country_repo: CountryRepository = Depends(get_country_repo),
) -> dict:
    """Return frontend filter option metadata."""
    countries = country_repo.get_all()
    return {
        "attack_types": _enum_values(AttackType),
        "severities": _enum_values(Severity),
        "statuses": _enum_values(AttackStatus),
        "http_methods": _enum_values(HttpMethod),
        "protocols": _enum_values(Protocol),
        "countries": [c.name for c in countries],
        "continents": sorted({c.continent for c in countries}),
        "time_ranges": ["15m", "1h", "6h", "24h", "7d"],
    }


@router.get("/countries/{country_name}/rollup", response_model=CountryRollupResponse)
async def get_country_rollup(
    country_name: str,
    time_range: str | None = Query(default=None),
    attack_repo: AttackRepository = Depends(get_attack_repo),
) -> CountryRollupResponse:
    """Return drawer-ready country metrics."""
    params = AttackFilterParams(country=country_name, time_range=time_range, limit=500, offset=0)
    attacks, _ = await attack_repo.filter(params)

    attack_counts = Counter(a.attack_type.value for a in attacks)
    source_counts = Counter(a.source_country for a in attacks if a.source_country.lower() != country_name.lower())
    blocked = sum(1 for a in attacks if a.status.value in {"Blocked", "Mitigated"})
    requests = sum(a.request_count for a in attacks)
    threat_score = round(sum(a.risk_score for a in attacks) / len(attacks)) if attacks else 0

    return CountryRollupResponse(
        country=country_name,
        requests=requests,
        attacks=len(attacks),
        blocked=blocked,
        threat_score=threat_score,
        top_attack=attack_counts.most_common(1)[0][0] if attack_counts else "No attacks",
        top_sources=[name for name, _ in source_counts.most_common(5)],
    )


@router.get("/export", response_model=ExportResponse | None)
async def export_attacks(
    format: str = Query(default="json", pattern="^(json|csv)$"),
    country: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    attack_type: str | None = Query(default=None, alias="attack_type"),
    status: str | None = Query(default=None),
    time_range: str | None = Query(default=None),
    limit: int = Query(default=500, ge=1, le=500),
    attack_repo: AttackRepository = Depends(get_attack_repo),
):
    """Export filtered attacks as JSON or CSV."""
    params = _coerce_filters(country, severity, attack_type, status, time_range, limit)
    attacks, total = await attack_repo.filter(params)
    items = [AttackEventResponse.model_validate(a.model_dump()) for a in attacks]

    if format == "json":
        return ExportResponse(total=total, items=items)

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow([
        "timestamp",
        "source_country",
        "destination_country",
        "source_ip",
        "attack_type",
        "severity",
        "status",
        "endpoint",
        "http_method",
        "protocol",
        "request_count",
        "risk_score",
    ])
    for item in items:
        writer.writerow([
            item.timestamp,
            item.source_country,
            item.destination_country,
            item.source_ip,
            item.attack_type,
            item.severity,
            item.status,
            item.endpoint,
            item.http_method,
            item.protocol,
            item.request_count,
            item.risk_score,
        ])
    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=cyberai-attacks.csv"},
    )
