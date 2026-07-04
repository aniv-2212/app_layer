"""Replay REST endpoints."""

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_replay_service
from app.schemas.replay import ReplayResponse
from app.services.replay_service import ReplayService

router = APIRouter(prefix="/replay", tags=["Replay"])


@router.get("", response_model=ReplayResponse)
async def get_replay(
    country: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    attack_type: str | None = Query(default=None, alias="attack_type"),
    status: str | None = Query(default=None),
    time_range: str | None = Query(default=None),
    service: ReplayService = Depends(get_replay_service),
) -> ReplayResponse:
    """Return the last 500 attacks for timeline replay."""
    return await service.get_replay(
        country=country,
        severity=severity,
        attack_type=attack_type,
        status=status,
        time_range=time_range,
    )
