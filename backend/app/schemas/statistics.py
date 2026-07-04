"""Statistics API schemas."""

from pydantic import BaseModel

from app.schemas.attack import AttackSummaryResponse


class StatisticsResponse(BaseModel):
    """Full statistics snapshot for dashboard widgets."""

    summary: AttackSummaryResponse
    attacks_per_minute: float
    mitigated_percentage: float
    active_countries: int
    top_attack_types: dict[str, int]
    top_source_countries: dict[str, int]
    average_risk_score: float
    total_requests: int
