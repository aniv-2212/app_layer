"""Country REST endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.deps import get_country_repo
from app.repositories.country_repository import CountryRepository
from app.schemas.country import CountryListResponse, CountryResponse

router = APIRouter(prefix="/countries", tags=["Countries"])


@router.get("", response_model=CountryListResponse)
async def list_countries(
    continent: str | None = Query(default=None),
    risk_level: str | None = Query(default=None),
    repo: CountryRepository = Depends(get_country_repo),
) -> CountryListResponse:
    """Return the country dataset used for threat map geolocation."""
    countries = repo.get_all()

    if continent:
        countries = [c for c in countries if c.continent.lower() == continent.lower()]
    if risk_level:
        countries = [c for c in countries if c.risk_level.value.lower() == risk_level.lower()]

    items = [CountryResponse.model_validate(c.model_dump()) for c in countries]
    return CountryListResponse(total=len(items), items=items)


@router.get("/{country_code}", response_model=CountryResponse)
async def get_country(
    country_code: str,
    repo: CountryRepository = Depends(get_country_repo),
) -> CountryResponse:
    """Return a single country by ISO code."""
    country = repo.get_by_code(country_code)
    if country is None:
        raise HTTPException(status_code=404, detail=f"Country '{country_code}' not found")
    return CountryResponse.model_validate(country.model_dump())
