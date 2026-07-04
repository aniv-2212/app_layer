"""Attack REST endpoints."""

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_attack_repo
from app.models.attack import AttackStatus, AttackType, Severity
from app.repositories.attack_repository import AttackRepository
from app.schemas.attack import AttackEventResponse, AttackFilterParams, AttackListResponse

router = APIRouter(prefix="/attacks", tags=["Attacks"])


@router.get("", response_model=AttackListResponse)
async def list_attacks(
    country: str | None = Query(default=None, description="Filter by source or destination country"),
    severity: Severity | None = Query(default=None),
    attack_type: AttackType | None = Query(default=None, alias="attack_type"),
    status: AttackStatus | None = Query(default=None),
    time_range: str | None = Query(default=None, description="15m, 1h, 6h, 24h, 7d"),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    repo: AttackRepository = Depends(get_attack_repo),
) -> AttackListResponse:
    """Return filtered attack events from the in-memory store."""
    params = AttackFilterParams(
        country=country,
        severity=severity,
        attack_type=attack_type,
        status=status,
        time_range=time_range,
        limit=limit,
        offset=offset,
    )
    items, total = await repo.filter(params)
    responses = [AttackEventResponse.model_validate(a.model_dump()) for a in items]
    return AttackListResponse(total=total, items=responses)
