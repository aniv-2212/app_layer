"""In-memory attack event repository."""

from collections import deque
from threading import Lock

from app.models.attack import AttackEvent
from app.schemas.attack import AttackFilterParams
from app.utils.time_utils import parse_iso_timestamp, parse_time_range


class AttackRepository:
    """
    Thread-safe in-memory attack store backed by a bounded deque.

    The public async methods mirror what a future PostgreSQL repository
    would expose, keeping service layers storage-agnostic.
    """

    def __init__(self, max_size: int = 500) -> None:
        self._max_size = max_size
        self._attacks: deque[AttackEvent] = deque(maxlen=max_size)
        self._lock = Lock()
        self._next_id = 1
        self._total_ingested = 0

    @property
    def total_ingested(self) -> int:
        """Total attacks ever stored (including evicted entries)."""
        return self._total_ingested

    @property
    def capacity(self) -> int:
        return self._max_size

    async def add(self, attack: AttackEvent) -> AttackEvent:
        """Persist a new attack event."""
        with self._lock:
            self._attacks.append(attack)
            self._total_ingested += 1
        return attack

    async def get_all(self) -> list[AttackEvent]:
        """Return all attacks in chronological order."""
        with self._lock:
            return list(self._attacks)

    async def get_replay_buffer(self) -> list[AttackEvent]:
        """Return the full replay timeline (up to max_size)."""
        return await self.get_all()

    async def count(self) -> int:
        with self._lock:
            return len(self._attacks)

    async def next_id(self) -> int:
        with self._lock:
            current = self._next_id
            self._next_id += 1
            return current

    async def filter(self, params: AttackFilterParams) -> tuple[list[AttackEvent], int]:
        """Apply query filters and return matching attacks plus total count."""
        cutoff = parse_time_range(params.time_range)

        with self._lock:
            items = list(self._attacks)

        filtered: list[AttackEvent] = []
        for attack in items:
            if params.country and params.country.lower() not in (
                attack.source_country.lower(),
                attack.destination_country.lower(),
                attack.country_code.lower(),
            ):
                continue
            if params.severity and attack.severity != params.severity:
                continue
            if params.attack_type and attack.attack_type != params.attack_type:
                continue
            if params.status and attack.status != params.status:
                continue
            if cutoff is not None:
                try:
                    ts = parse_iso_timestamp(attack.timestamp)
                    if ts < cutoff:
                        continue
                except ValueError:
                    continue
            filtered.append(attack)

        # Newest first for API responses
        filtered.reverse()
        total = len(filtered)
        page = filtered[params.offset : params.offset + params.limit]
        return page, total

    async def get_summary_counts(self) -> dict[str, int]:
        """Count attacks by severity across the full buffer."""
        counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        with self._lock:
            for attack in self._attacks:
                key = attack.severity.value
                if key in counts:
                    counts[key] += 1
        return counts
