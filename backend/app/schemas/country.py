"""Country-related API schemas."""

from pydantic import BaseModel

from app.models.country import RiskLevel


class CountryResponse(BaseModel):
    """Country metadata exposed via REST."""

    name: str
    country_code: str
    latitude: float
    longitude: float
    continent: str
    risk_level: RiskLevel


class CountryListResponse(BaseModel):
    """List of available countries."""

    total: int
    items: list[CountryResponse]
