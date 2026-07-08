"""Pydantic schemas for the URL Scanner API."""

from datetime import datetime

from pydantic import BaseModel, Field


class ScanRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2048, description="URL to analyze")
    include_domain_intel: bool = Field(
        default=True,
        description="Also run WHOIS / DNS / SSL domain-intelligence lookups",
    )


class DomainIntelligence(BaseModel):
    whois_status: str = "Unavailable"
    age: str = "Unknown"
    registrar: str = "Unknown"
    expiration_date: str = "Unknown"
    dns_record_count: int = 0
    ip_address: str = "Unknown"
    ssl_valid: bool = False


class ScanResult(BaseModel):
    scan_id: str
    url: str
    risk_percentage: float
    verdict: str
    status_class: str  # safe | warning | danger
    model_used: bool
    extracted_features: dict
    domain_intelligence: DomainIntelligence | None = None
    scanned_at: datetime


class ScanHistoryEntry(BaseModel):
    scan_id: str
    url: str
    risk_percentage: float
    verdict: str
    status_class: str
    scanned_at: datetime


class ScanHistoryResponse(BaseModel):
    total: int
    items: list[ScanHistoryEntry]


class ScannerHealth(BaseModel):
    status: str
    model_loaded: bool
    feature_count: int
    scans_performed: int
