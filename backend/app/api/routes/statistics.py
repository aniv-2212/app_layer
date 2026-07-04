"""Statistics REST endpoints."""

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_statistics_service
from app.schemas.attack import AttackSummaryResponse
from app.schemas.statistics import StatisticsResponse
from app.services.statistics_service import StatisticsService

router = APIRouter(prefix="/statistics", tags=["Statistics"])


@router.get("", response_model=StatisticsResponse)
async def get_statistics(
    country: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    attack_type: str | None = Query(default=None, alias="attack_type"),
    status: str | None = Query(default=None),
    time_range: str | None = Query(default=None),
    service: StatisticsService = Depends(get_statistics_service),
) -> StatisticsResponse:
    """Return aggregated attack statistics with optional filters."""
    return await service.get_statistics(
        country=country,
        severity=severity,
        attack_type=attack_type,
        status=status,
        time_range=time_range,
    )


@router.get("/summary", response_model=AttackSummaryResponse)
async def get_summary(
    service: StatisticsService = Depends(get_statistics_service),
) -> AttackSummaryResponse:
    """Return severity breakdown summary."""
    return await service.get_summary()
