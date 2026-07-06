from fastapi import APIRouter, Query
from typing import List, Optional
from app.schemas import ThreatEvent
from app.generator import generator

router = APIRouter(prefix="/threats", tags=["Threat Intelligence"])

@router.get("/active", response_model=List[ThreatEvent])
async def get_active_threats(
    severity: Optional[str] = Query(None, description="Filter threats by severity (low, medium, high, critical)")
):
    """
    Returns active cyber threats with geolocation data (coordinates) for source and targets.
    """
    return generator.get_threats(severity=severity)
