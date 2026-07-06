"""Live stream control endpoints."""

from fastapi import APIRouter, Depends

from app.api.deps import get_stream_service
from app.services.stream_service import StreamService

router = APIRouter(prefix="/stream", tags=["Stream"])


@router.get("/status")
async def get_stream_status(
    service: StreamService = Depends(get_stream_service),
) -> dict:
    """Return live stream runtime status."""
    return service.status()


@router.post("/start")
async def start_stream(
    service: StreamService = Depends(get_stream_service),
) -> dict:
    """Start background attack streaming."""
    await service.start()
    return service.status()


@router.post("/stop")
async def stop_stream(
    service: StreamService = Depends(get_stream_service),
) -> dict:
    """Stop background attack streaming."""
    await service.stop()
    return service.status()


@router.post("/tick")
async def generate_attack_now(
    service: StreamService = Depends(get_stream_service),
) -> dict:
    """Generate and broadcast one attack immediately."""
    attack = await service.generate_once()
    return {"generated": True, "attack": attack, "stream": service.status()}


@router.post("/snapshot")
async def broadcast_snapshot(
    service: StreamService = Depends(get_stream_service),
) -> dict:
    """Broadcast statistics, heatmap, and timeline immediately."""
    return await service.emit_snapshot()
