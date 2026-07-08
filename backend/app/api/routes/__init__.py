"""API route registration."""

from fastapi import APIRouter

from app.ai_assistant.router import router as ai_assistant_router
from app.api.routes import attacks, countries, custom, dashboard, heatmap, replay, statistics, stream
from app.url_scanner.router import router as url_scanner_router

api_router = APIRouter(prefix="/api")
api_router.include_router(attacks.router)
api_router.include_router(countries.router)
api_router.include_router(statistics.router)
api_router.include_router(replay.router)
api_router.include_router(heatmap.router)
api_router.include_router(dashboard.router)
api_router.include_router(stream.router)
api_router.include_router(custom.router)
api_router.include_router(url_scanner_router)
api_router.include_router(ai_assistant_router)
