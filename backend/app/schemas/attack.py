"""Pydantic schemas for API request/response payloads."""

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.attack import AttackStatus, AttackType, HttpMethod, Protocol, Severity


class AttackEventResponse(BaseModel):
    """Serialized attack event returned by REST and Socket.IO."""

    id: int
    timestamp: str
    source_country: str
    destination_country: str
    source_latitude: float
    source_longitude: float
    destination_latitude: float
    destination_longitude: float
    source_ip: str
    destination_ip: str
    attack_type: AttackType
    severity: Severity
    status: AttackStatus
    endpoint: str
    http_method: HttpMethod
    request_count: int
    duration_ms: int
    confidence: float
    risk_score: int
    protocol: Protocol
    user_agent: str
    asn: str
    city: str
    isp: str
    country_code: str
    latitude: float
    longitude: float


class AttackListResponse(BaseModel):
    """Paginated list of attack events."""

    total: int
    items: list[AttackEventResponse]


class AttackSummaryResponse(BaseModel):
    """Aggregated severity breakdown."""

    total_attacks: int
    critical: int
    high: int
    medium: int
    low: int


class AttackFilterParams(BaseModel):
    """Query filters for attack endpoints."""

    country: str | None = None
    severity: Severity | None = None
    attack_type: AttackType | None = None
    status: AttackStatus | None = None
    time_range: str | None = Field(
        default=None,
        description="Time window: 15m, 1h, 6h, 24h, 7d",
    )
    limit: int = Field(default=100, ge=1, le=500)
    offset: int = Field(default=0, ge=0)
