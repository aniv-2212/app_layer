"""CyberAI Live Threat Map — FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI

from app.api.deps import get_container
from app.api.routes import api_router
from app.config.settings import get_settings
from app.middleware.cors import configure_cors

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Start/stop background attack streaming on app lifecycle."""
    container = get_container()
    await container.stream_service.start()
    await container.intel_hub.start_broadcast()
    logger.info("CyberAI backend started — streaming live threat events + intel feeds")
    yield
    await container.intel_hub.stop_broadcast()
    await container.stream_service.stop()
    logger.info("CyberAI backend shutdown complete")


def create_app() -> FastAPI:
    """Application factory used by Uvicorn and tests."""
    settings = get_settings()
    container = get_container()

    app = FastAPI(
        title="CyberAI Live Threat Map API",
        description=(
            "Production-ready backend for the CyberAI SOC Dashboard Live Threat Map. "
            "Streams simulated cyber attack events via Socket.IO and exposes REST "
            "endpoints for filtering, statistics, heatmaps, and timeline replay."
        ),
        version="1.0.0",
        debug=settings.debug,
        lifespan=lifespan,
    )

    configure_cors(app, settings)
    app.include_router(api_router)

    @app.get("/health", tags=["Health"])
    async def health_check() -> dict:
        return {
            "status": "healthy",
            "service": "CyberAI Live Threat Map",
            "connected_clients": container.socket_manager.connected_count,
        }

    return app


fastapi_app = create_app()

# Wrap with Socket.IO ASGIApp — this handles /socket.io/ requests and
# forwards everything else to the FastAPI app.  Uvicorn serves this
# combined ASGI app so WebSocket upgrades reach python-socketio.
_container = get_container()
app = _container.socket_manager.create_asgi_app(fastapi_app)
