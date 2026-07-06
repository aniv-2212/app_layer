import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.schemas import NetworkMetrics
from app.generator import generator
from app.config import settings

router = APIRouter(prefix="/metrics", tags=["Metrics"])

@router.get("/summary", response_model=NetworkMetrics)
async def get_metrics_summary():
    """
    Returns a single metrics snapshot containing connected devices, active session count,
    latency, and health score.
    """
    return generator.get_metrics()

@router.websocket("/live")
async def live_metrics_stream(websocket: WebSocket):
    """
    Establishes a WebSocket connection to stream live network metrics at regular intervals.
    """
    await websocket.accept()
    try:
        while True:
            metrics = generator.get_metrics()
            await websocket.send_json(metrics)
            await asyncio.sleep(settings.SIMULATION_INTERVAL_SEC)
    except WebSocketDisconnect:
        # Client disconnected cleanly
        pass
    except Exception as e:
        # Other socket exceptions
        try:
            await websocket.close()
        except:
            pass
