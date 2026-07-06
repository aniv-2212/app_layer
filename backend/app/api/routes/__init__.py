"""API route registration."""

from fastapi import APIRouter

from app.api.routes import attacks, countries, custom, dashboard, heatmap, replay, statistics, stream

api_router = APIRouter(prefix="/api")
api_router.include_router(attacks.router)
api_router.include_router(countries.router)
api_router.include_router(statistics.router)
api_router.include_router(replay.router)
api_router.include_router(heatmap.router)
api_router.include_router(dashboard.router)
api_router.include_router(stream.router)
api_router.include_router(custom.router)
