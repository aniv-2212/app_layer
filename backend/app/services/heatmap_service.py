"""Maintains per-country attack intensity for heatmap visualization."""

from threading import Lock

from app.models.attack import AttackEvent
from app.repositories.attack_repository import AttackRepository
from app.schemas.heatmap import HeatmapResponse
from app.utils.time_utils import utc_now_iso


class HeatmapService:
    """
    Tracks cumulative attack counts per source country.

    Counts are derived from the in-memory repository and can later be
    backed by Redis or PostgreSQL without API changes.
    """

    def __init__(self, attack_repo: AttackRepository) -> None:
        self._attack_repo = attack_repo
        self._counts: dict[str, int] = {}
        self._lock = Lock()

    def record(self, attack: AttackEvent) -> None:
        """Increment heatmap counter for the attack source country."""
        with self._lock:
            self._counts[attack.source_country] = self._counts.get(attack.source_country, 0) + 1

    def get_counts(self) -> dict[str, int]:
        """Return a snapshot of country attack counts."""
        with self._lock:
            return dict(self._counts)

    async def rebuild_from_repository(self) -> None:
        """Rebuild heatmap state from stored attacks (useful on startup)."""
        attacks = await self._attack_repo.get_all()
        with self._lock:
            self._counts.clear()
            for attack in attacks:
                self._counts[attack.source_country] = (
                    self._counts.get(attack.source_country, 0) + 1
                )

    async def get_heatmap(
        self,
        country: str | None = None,
        time_range: str | None = None,
    ) -> HeatmapResponse:
        """
        Return heatmap data, optionally filtered by country name or time range.

        When filters are applied the counts are computed on-the-fly from the
        repository rather than the cached counters.
        """
        if country or time_range:
            from app.schemas.attack import AttackFilterParams

            params = AttackFilterParams(
                country=country,
                time_range=time_range,
                limit=500,
                offset=0,
            )
            attacks, _ = await self._attack_repo.filter(params)
            data: dict[str, int] = {}
            for attack in attacks:
                data[attack.source_country] = data.get(attack.source_country, 0) + 1
        else:
            data = self.get_counts()

        return HeatmapResponse(
            data=data,
            total=sum(data.values()),
            updated_at=utc_now_iso(),
        )

    def to_broadcast_payload(self) -> dict[str, int]:
        """Format heatmap for Socket.IO emission."""
        return self.get_counts()
