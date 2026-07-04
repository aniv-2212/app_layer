"""Heatmap API schemas."""

from pydantic import BaseModel


class HeatmapResponse(BaseModel):
    """Country-level attack intensity map."""

    data: dict[str, int]
    total: int
    updated_at: str
