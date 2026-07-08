"""URL Scanner REST endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.deps import get_url_scanner_service
from app.url_scanner.schemas import (
    ScanHistoryResponse,
    ScannerHealth,
    ScanRequest,
    ScanResult,
)
from app.url_scanner.security import URLValidationError
from app.url_scanner.service import URLScannerService

router = APIRouter(prefix="/url-scanner", tags=["URL Scanner"])


@router.post("/scan", response_model=ScanResult)
async def scan_url(
    payload: ScanRequest,
    service: URLScannerService = Depends(get_url_scanner_service),
) -> ScanResult:
    """Analyze a URL: ML risk score, lexical features, and domain intelligence."""
    try:
        return await service.scan(payload.url, include_domain_intel=payload.include_domain_intel)
    except URLValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.get("/history", response_model=ScanHistoryResponse)
async def scan_history(
    limit: int = Query(default=50, ge=1, le=200),
    service: URLScannerService = Depends(get_url_scanner_service),
) -> ScanHistoryResponse:
    """Return recent scans (most recent first)."""
    return service.get_history(limit=limit)


@router.get("/result/{scan_id}", response_model=ScanResult)
async def scan_result(
    scan_id: str,
    service: URLScannerService = Depends(get_url_scanner_service),
) -> ScanResult:
    """Return the full result of a previous scan."""
    result = service.get_result(scan_id)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Scan '{scan_id}' not found.")
    return result


@router.get("/health", response_model=ScannerHealth)
async def scanner_health(
    service: URLScannerService = Depends(get_url_scanner_service),
) -> ScannerHealth:
    """Scanner subsystem health, including ML model status."""
    return service.health()
