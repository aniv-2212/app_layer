"""Dashboard-facing aggregate API schemas."""

from pydantic import BaseModel

from app.schemas.attack import AttackEventResponse
from app.schemas.country import CountryResponse
from app.schemas.heatmap import HeatmapResponse
from app.schemas.replay import ReplayResponse
from app.schemas.statistics import StatisticsResponse


class CountryRollupResponse(BaseModel):
    """Aggregated operational state for a single country."""

    country: str
    requests: int
    attacks: int
    blocked: int
    threat_score: int
    top_attack: str
    top_sources: list[str]


class DashboardSnapshotResponse(BaseModel):
    """Single request payload used to hydrate the SOC dashboard."""

    attacks: list[AttackEventResponse]
    statistics: StatisticsResponse
    heatmap: HeatmapResponse
    replay: ReplayResponse
    countries: list[CountryResponse]
    stream: dict


class ExportResponse(BaseModel):
    """JSON export payload for filtered attack data."""

    total: int
    items: list[AttackEventResponse]
