"""Heatmap REST endpoints."""

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_heatmap_service
from app.schemas.heatmap import HeatmapResponse
from app.services.heatmap_service import HeatmapService

router = APIRouter(prefix="/heatmap", tags=["Heatmap"])


@router.get("", response_model=HeatmapResponse)
async def get_heatmap(
    country: str | None = Query(default=None),
    time_range: str | None = Query(default=None),
    service: HeatmapService = Depends(get_heatmap_service),
) -> HeatmapResponse:
    """Return country-level attack intensity counts."""
    return await service.get_heatmap(country=country, time_range=time_range)
