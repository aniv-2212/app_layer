import random
import asyncio
from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect
from typing import List, Optional
from app.schemas import NetworkEvent
from app.generator import generator
from app.config import settings

router = APIRouter(prefix="/events", tags=["Events & Flows"])

@router.get("", response_model=List[NetworkEvent])
async def get_network_events(
    q: Optional[str] = Query(None, description="Search query matching IP addresses, protocol, or log messages"),
    country: Optional[str] = Query(None, description="Filter flows by country of origin"),
    segment: Optional[str] = Query(None, description="Filter flows by network segment"),
    limit: int = Query(50, ge=1, le=100)
):
    """
    Returns filtered, paginated network logs and packet flows.
    """
    return generator.get_events(query=q, country=country, segment=segment, limit=limit)

@router.websocket("/stream")
async def stream_live_events(websocket: WebSocket):
    """
    WebSocket connection that streams new simulated network traffic flow events in real-time.
    """
    await websocket.accept()
    try:
        while True:
            # Generate a new random event, store it in history, and push to WebSocket
            new_event = generator.generate_random_event()
            generator.add_event(new_event)
            await websocket.send_json(new_event)
            # Sleep a dynamic small duration (e.g. 0.5 to 2.0s) to feel like real traffic packets
            await asyncio.sleep(random.uniform(0.5, settings.SIMULATION_INTERVAL_SEC))
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.close()
        except:
            pass

