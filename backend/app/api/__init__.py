"""REST API package."""

from app.api.deps import get_container
from app.api.routes import api_router

__all__ = ["api_router", "get_container"]
