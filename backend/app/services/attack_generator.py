"""Produces realistic simulated cyber attack events."""

import random

from app.generators.random_data_generator import RandomDataGenerator
from app.models.attack import (
    AttackEvent,
    AttackStatus,
    AttackType,
    HttpMethod,
    Protocol,
    Severity,
)
from app.models.country import Country
from app.repositories.attack_repository import AttackRepository
from app.repositories.country_repository import CountryRepository
from app.utils.time_utils import utc_now_iso


class AttackGenerator:
    """
    Orchestrates attack event synthesis using country metadata and
    randomized network/HTTP attributes.
    """

    ATTACK_TYPES: tuple[AttackType, ...] = tuple(AttackType)
    HTTP_METHODS: tuple[HttpMethod, ...] = tuple(HttpMethod)
    PROTOCOLS: tuple[Protocol, ...] = (Protocol.HTTPS, Protocol.HTTP, Protocol.TCP, Protocol.UDP)
    STATUSES: tuple[AttackStatus, ...] = (
        AttackStatus.BLOCKED,
        AttackStatus.MITIGATED,
        AttackStatus.DETECTED,
        AttackStatus.INVESTIGATING,
        AttackStatus.ALLOWED,
    )

    # Weight higher-risk countries as more frequent attack sources
    HIGH_RISK_WEIGHT = 3
    MEDIUM_RISK_WEIGHT = 2
    LOW_RISK_WEIGHT = 1

    SEVERITY_BY_TYPE: dict[AttackType, tuple[Severity, ...]] = {
        AttackType.SQL_INJECTION: (Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM),
        AttackType.XSS: (Severity.MEDIUM, Severity.HIGH),
        AttackType.COMMAND_INJECTION: (Severity.CRITICAL, Severity.HIGH),
        AttackType.CREDENTIAL_STUFFING: (Severity.HIGH, Severity.MEDIUM),
        AttackType.BOT_ATTACK: (Severity.MEDIUM, Severity.HIGH),
        AttackType.BRUTE_FORCE: (Severity.HIGH, Severity.MEDIUM),
        AttackType.PATH_TRAVERSAL: (Severity.HIGH, Severity.CRITICAL),
        AttackType.RCE: (Severity.CRITICAL,),
        AttackType.SSRF: (Severity.HIGH, Severity.CRITICAL),
        AttackType.DDOS: (Severity.CRITICAL, Severity.HIGH),
        AttackType.DIRECTORY_TRAVERSAL: (Severity.HIGH, Severity.MEDIUM),
        AttackType.FILE_INCLUSION: (Severity.HIGH, Severity.CRITICAL),
        AttackType.MALWARE_DOWNLOAD: (Severity.CRITICAL, Severity.HIGH),
        AttackType.API_ABUSE: (Severity.MEDIUM, Severity.HIGH),
        AttackType.RATE_LIMIT_VIOLATION: (Severity.LOW, Severity.MEDIUM),
    }

    STATUS_WEIGHTS: dict[Severity, tuple[tuple[AttackStatus, int], ...]] = {
        Severity.CRITICAL: (
            (AttackStatus.BLOCKED, 5),
            (AttackStatus.MITIGATED, 3),
            (AttackStatus.INVESTIGATING, 2),
        ),
        Severity.HIGH: (
            (AttackStatus.BLOCKED, 4),
            (AttackStatus.MITIGATED, 4),
            (AttackStatus.DETECTED, 2),
        ),
        Severity.MEDIUM: (
            (AttackStatus.BLOCKED, 3),
            (AttackStatus.DETECTED, 4),
            (AttackStatus.MITIGATED, 3),
        ),
        Severity.LOW: (
            (AttackStatus.BLOCKED, 2),
            (AttackStatus.DETECTED, 5),
            (AttackStatus.ALLOWED, 3),
        ),
    }

    def __init__(
        self,
        country_repo: CountryRepository,
        attack_repo: AttackRepository,
        random_gen: RandomDataGenerator | None = None,
    ) -> None:
        self._country_repo = country_repo
        self._attack_repo = attack_repo
        self._random = random_gen or RandomDataGenerator()
        self._countries = country_repo.get_all()
        self._source_weights = self._build_source_weights()

    def _build_source_weights(self) -> list[int]:
        weights: list[int] = []
        for country in self._countries:
            if country.risk_level.value == "Critical":
                weights.append(self.HIGH_RISK_WEIGHT * 2)
            elif country.risk_level.value == "High":
                weights.append(self.HIGH_RISK_WEIGHT)
            elif country.risk_level.value == "Medium":
                weights.append(self.MEDIUM_RISK_WEIGHT)
            else:
                weights.append(self.LOW_RISK_WEIGHT)
        return weights

    def _pick_source(self) -> Country:
        return random.choices(self._countries, weights=self._source_weights, k=1)[0]

    def _pick_destination(self, source: Country) -> Country:
        # Destinations skew toward lower-risk / high-value targets
        candidates = [c for c in self._countries if c.name != source.name]
        dest_weights = [
            3 if c.risk_level.value in ("Low", "Medium") else 1 for c in candidates
        ]
        return random.choices(candidates, weights=dest_weights, k=1)[0]

    def _pick_severity(self, attack_type: AttackType) -> Severity:
        options = self.SEVERITY_BY_TYPE.get(attack_type, tuple(Severity))
        return random.choice(options)

    def _pick_status(self, severity: Severity) -> AttackStatus:
        weighted = self.STATUS_WEIGHTS.get(severity, ((AttackStatus.DETECTED, 1),))
        statuses, weights = zip(*weighted, strict=True)
        return random.choices(list(statuses), weights=list(weights), k=1)[0]

    def _pick_http_method(self, attack_type: AttackType) -> HttpMethod:
        if attack_type in (AttackType.DDOS, AttackType.BOT_ATTACK):
            return random.choice([HttpMethod.GET, HttpMethod.POST, HttpMethod.HEAD])
        if attack_type in (AttackType.SQL_INJECTION, AttackType.XSS, AttackType.COMMAND_INJECTION):
            return random.choice([HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH])
        return random.choice(self.HTTP_METHODS)

    async def generate(self) -> AttackEvent:
        """Create and return a single fully-populated attack event."""
        attack_type = random.choice(self.ATTACK_TYPES)
        source = self._pick_source()
        destination = self._pick_destination(source)
        severity = self._pick_severity(attack_type)
        status = self._pick_status(severity)
        attack_type_str = attack_type.value
        severity_str = severity.value

        src_lat, src_lon = self._random.jitter_coordinate(source.latitude, source.longitude)
        dst_lat, dst_lon = self._random.jitter_coordinate(
            destination.latitude, destination.longitude
        )

        event_id = await self._attack_repo.next_id()

        return AttackEvent(
            id=event_id,
            timestamp=utc_now_iso(),
            source_country=source.name,
            destination_country=destination.name,
            source_latitude=src_lat,
            source_longitude=src_lon,
            destination_latitude=dst_lat,
            destination_longitude=dst_lon,
            source_ip=self._random.generate_ip(),
            destination_ip=self._random.generate_ip(),
            attack_type=attack_type,
            severity=severity,
            status=status,
            endpoint=self._random.generate_endpoint(),
            http_method=self._pick_http_method(attack_type),
            request_count=self._random.generate_request_count(attack_type_str),
            duration_ms=self._random.generate_duration_ms(attack_type_str),
            confidence=self._random.generate_confidence(severity_str),
            risk_score=self._random.generate_risk_score(severity_str, source.risk_level.value),
            protocol=random.choice(self.PROTOCOLS),
            user_agent=self._random.generate_user_agent(),
            asn=self._random.generate_asn(),
            city=self._random.generate_city(source.name),
            isp=self._random.generate_isp(),
            country_code=source.country_code,
            latitude=src_lat,
            longitude=src_lon,
        )
