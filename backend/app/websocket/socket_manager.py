"""Socket.IO connection manager and event handlers."""

import logging
from typing import Any

import socketio

from app.config.settings import Settings

logger = logging.getLogger(__name__)


class SocketManager:
    """
    Wraps python-socketio AsyncServer for broadcasting threat events.

    Handles client lifecycle events and provides a typed emit interface
    for the streaming service.
    """

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        cors_origins = settings.cors_origin_list or (["*"] if settings.debug else [])
        self._sio = socketio.AsyncServer(
            async_mode="asgi",
            cors_allowed_origins=cors_origins,
            logger=settings.debug,
            engineio_logger=settings.debug,
        )
        self._register_handlers()

    @property
    def server(self) -> socketio.AsyncServer:
        return self._sio

    def _register_handlers(self) -> None:
        @self._sio.event
        async def connect(sid: str, environ: dict, auth: Any) -> bool:
            logger.info("Client connected: %s", sid)
            await self._sio.emit(
                "connection:success",
                {
                    "message": "Connected to CyberAI Live Threat Map",
                    "sid": sid,
                    "events": [
                        "attack:new",
                        "attack:summary",
                        "heatmap:update",
                        "statistics:update",
                        "timeline:update",
                        "intel:update",
                    ],
                },
                to=sid,
            )
            return True

        @self._sio.event
        async def disconnect(sid: str) -> None:
            logger.info("Client disconnected: %s", sid)

        @self._sio.event
        async def ping_client(sid: str, data: dict | None = None) -> dict:
            """Optional client heartbeat."""
            return {"pong": True, "received": data}

    async def emit(self, event: str, data: Any, room: str | None = None) -> None:
        """Broadcast an event to all connected clients or a specific room."""
        await self._sio.emit(event, data, room=room)

    def create_asgi_app(self, other_asgi_app: Any) -> socketio.ASGIApp:
        """Mount Socket.IO alongside the FastAPI ASGI application."""
        return socketio.ASGIApp(self._sio, other_asgi_app=other_asgi_app)

    @property
    def connected_count(self) -> int:
        """Return number of active Socket.IO sessions."""
        return len(self._sio.manager.rooms.get("/", {}))
