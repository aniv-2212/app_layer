"""Timeline replay service for the last N attack events."""

from app.repositories.attack_repository import AttackRepository
from app.schemas.attack import AttackEventResponse, AttackFilterParams
from app.schemas.replay import ReplayResponse


class ReplayService:
    """
    Exposes the bounded attack buffer for timeline replay.

    Supports the same filters as the attacks endpoint for investigative
    playback scenarios.
    """

    def __init__(self, attack_repo: AttackRepository) -> None:
        self._attack_repo = attack_repo

    async def get_replay(
        self,
        country: str | None = None,
        severity: str | None = None,
        attack_type: str | None = None,
        status: str | None = None,
        time_range: str | None = None,
    ) -> ReplayResponse:
        """Return up to 500 attacks for replay, optionally filtered."""
        from app.models.attack import AttackStatus, AttackType, Severity

        if any([country, severity, attack_type, status, time_range]):
            params = AttackFilterParams(
                country=country,
                severity=Severity(severity) if severity else None,
                attack_type=AttackType(attack_type) if attack_type else None,
                status=AttackStatus(status) if status else None,
                time_range=time_range,
                limit=500,
                offset=0,
            )
            items, total = await self._attack_repo.filter(params)
            # Chronological order for replay (oldest first)
            items = list(reversed(items))
        else:
            items = await self._attack_repo.get_replay_buffer()
            total = len(items)

        responses = [AttackEventResponse.model_validate(a.model_dump()) for a in items]

        return ReplayResponse(
            total=total,
            capacity=self._attack_repo.capacity,
            items=responses,
        )

    async def get_timeline_payload(self, limit: int = 50) -> list[dict]:
        """Return the most recent attacks for Socket.IO timeline:update."""
        attacks = await self._attack_repo.get_all()
        recent = attacks[-limit:] if len(attacks) > limit else attacks
        return [AttackEventResponse.model_validate(a.model_dump()).model_dump() for a in recent]
