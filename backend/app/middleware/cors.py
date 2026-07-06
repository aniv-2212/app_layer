"""CORS middleware configuration."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import Settings


def configure_cors(app: FastAPI, settings: Settings) -> None:
    """Apply CORS middleware for frontend development origins."""
    origins = settings.cors_origin_list
    if not origins and settings.debug:
        origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
