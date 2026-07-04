"""AttackGenerator unit tests."""

import pytest

from app.models.attack import AttackType, Severity
from app.services.attack_generator import AttackGenerator


@pytest.mark.asyncio
async def test_generate_returns_valid_attack(attack_generator: AttackGenerator):
    attack = await attack_generator.generate()
    assert attack.id >= 1
    assert attack.source_country
    assert attack.destination_country
    assert attack.source_country != attack.destination_country
    assert attack.source_ip.count(".") == 3
    assert attack.destination_ip.count(".") == 3
    assert attack.attack_type in AttackType
    assert attack.severity in Severity
    assert 0 <= attack.risk_score <= 100
    assert 0 <= attack.confidence <= 100
    assert attack.request_count >= 1
    assert attack.duration_ms >= 0
    assert attack.endpoint.startswith("/")
    assert attack.timestamp.endswith("Z")


@pytest.mark.asyncio
async def test_generate_increments_ids(attack_generator: AttackGenerator):
    first = await attack_generator.generate()
    second = await attack_generator.generate()
    assert second.id == first.id + 1


@pytest.mark.asyncio
async def test_generate_all_attack_types_represented(attack_generator: AttackGenerator):
    seen = set()
    for _ in range(200):
        attack = await attack_generator.generate()
        seen.add(attack.attack_type)
    assert len(seen) >= 5


@pytest.mark.asyncio
async def test_generate_coordinates_within_bounds(attack_generator: AttackGenerator):
    attack = await attack_generator.generate()
    assert -90 <= attack.latitude <= 90
    assert -180 <= attack.longitude <= 180
    assert -90 <= attack.source_latitude <= 90
    assert -180 <= attack.source_longitude <= 180
