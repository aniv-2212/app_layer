"""Domain model for geographic threat regions."""

from enum import Enum

from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    """Country-level cyber risk classification."""

    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class Country(BaseModel):
    """A country with geolocation and risk metadata."""

    name: str
    country_code: str = Field(..., min_length=2, max_length=3)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    continent: str
    risk_level: RiskLevel
