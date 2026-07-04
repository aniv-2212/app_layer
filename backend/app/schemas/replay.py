"""Replay API schemas."""

from pydantic import BaseModel

from app.schemas.attack import AttackEventResponse


class ReplayResponse(BaseModel):
    """Timeline replay buffer."""

    total: int
    capacity: int
    items: list[AttackEventResponse]
