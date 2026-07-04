"""API route registration."""

from fastapi import APIRouter

from app.api.routes import attacks, countries, heatmap, replay, statistics

api_router = APIRouter(prefix="/api")
api_router.include_router(attacks.router)
api_router.include_router(countries.router)
api_router.include_router(statistics.router)
api_router.include_router(replay.router)
api_router.include_router(heatmap.router)
