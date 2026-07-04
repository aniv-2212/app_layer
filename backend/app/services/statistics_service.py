"""Aggregates attack metrics for dashboard statistics."""

from collections import Counter

from app.repositories.attack_repository import AttackRepository
from app.schemas.attack import AttackFilterParams, AttackSummaryResponse
from app.schemas.statistics import StatisticsResponse
from app.utils.time_utils import parse_iso_timestamp, parse_time_range, utc_now_iso


class StatisticsService:
    """Computes rolling statistics from the attack repository."""

    MITIGATED_STATUSES = {"Blocked", "Mitigated"}

    def __init__(self, attack_repo: AttackRepository) -> None:
        self._attack_repo = attack_repo
        self._session_total = 0

    @property
    def session_total(self) -> int:
        """Total attacks generated since service start."""
        return self._session_total

    def increment_session_total(self) -> None:
        self._session_total += 1

    async def get_summary(self) -> AttackSummaryResponse:
        """Return severity breakdown using session total for total_attacks."""
        counts = await self._attack_repo.get_summary_counts()
        return AttackSummaryResponse(
            total_attacks=self._session_total,
            critical=counts.get("Critical", 0),
            high=counts.get("High", 0),
            medium=counts.get("Medium", 0),
            low=counts.get("Low", 0),
        )

    async def get_statistics(
        self,
        country: str | None = None,
        severity: str | None = None,
        attack_type: str | None = None,
        status: str | None = None,
        time_range: str | None = None,
    ) -> StatisticsResponse:
        """Build a full statistics snapshot with optional filters."""
        from app.models.attack import AttackStatus, AttackType, Severity

        params = AttackFilterParams(
            country=country,
            severity=Severity(severity) if severity else None,
            attack_type=AttackType(attack_type) if attack_type else None,
            status=AttackStatus(status) if status else None,
            time_range=time_range,
            limit=500,
            offset=0,
        )
        attacks, total = await self._attack_repo.filter(params)

        severity_counts = Counter(a.severity.value for a in attacks)
        type_counts = Counter(a.attack_type.value for a in attacks)
        source_counts = Counter(a.source_country for a in attacks)
        mitigated = sum(1 for a in attacks if a.status.value in self.MITIGATED_STATUSES)
        total_requests = sum(a.request_count for a in attacks)

        # Attacks per minute based on time span of buffer
        attacks_per_minute = 0.0
        if len(attacks) >= 2:
            try:
                oldest = parse_iso_timestamp(attacks[-1].timestamp)
                newest = parse_iso_timestamp(attacks[0].timestamp)
                minutes = max((newest - oldest).total_seconds() / 60.0, 0.1)
                attacks_per_minute = round(len(attacks) / minutes, 2)
            except ValueError:
                attacks_per_minute = float(len(attacks))

        avg_risk = round(sum(a.risk_score for a in attacks) / len(attacks), 1) if attacks else 0.0
        mitigated_pct = round((mitigated / len(attacks)) * 100, 1) if attacks else 0.0
        active_countries = len({a.source_country for a in attacks} | {a.destination_country for a in attacks})

        summary = AttackSummaryResponse(
            total_attacks=self._session_total if not time_range else total,
            critical=severity_counts.get("Critical", 0),
            high=severity_counts.get("High", 0),
            medium=severity_counts.get("Medium", 0),
            low=severity_counts.get("Low", 0),
        )

        return StatisticsResponse(
            summary=summary,
            attacks_per_minute=attacks_per_minute,
            mitigated_percentage=mitigated_pct,
            active_countries=active_countries,
            top_attack_types=dict(type_counts.most_common(5)),
            top_source_countries=dict(source_counts.most_common(5)),
            average_risk_score=avg_risk,
            total_requests=total_requests,
        )

    def summary_to_dict(self, summary: AttackSummaryResponse) -> dict:
        """Serialize summary for Socket.IO."""
        return summary.model_dump()
