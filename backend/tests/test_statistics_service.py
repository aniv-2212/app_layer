"""StatisticsService unit tests."""

import pytest

from app.services.attack_generator import AttackGenerator
from app.services.statistics_service import StatisticsService


@pytest.mark.asyncio
async def test_get_summary_counts_severity(
    attack_generator: AttackGenerator,
    statistics_service: StatisticsService,
    attack_repo,
):
    for _ in range(20):
        attack = await attack_generator.generate()
        await attack_repo.add(attack)
        statistics_service.increment_session_total()

    summary = await statistics_service.get_summary()
    assert summary.total_attacks == 20
    assert summary.critical + summary.high + summary.medium + summary.low == 20


@pytest.mark.asyncio
async def test_get_statistics_includes_top_counts(
    attack_generator: AttackGenerator,
    statistics_service: StatisticsService,
    attack_repo,
):
    for _ in range(15):
        attack = await attack_generator.generate()
        await attack_repo.add(attack)
        statistics_service.increment_session_total()

    stats = await statistics_service.get_statistics()
    assert stats.active_countries >= 1
    assert stats.total_requests > 0
    assert isinstance(stats.top_attack_types, dict)
    assert isinstance(stats.top_source_countries, dict)
    assert 0 <= stats.mitigated_percentage <= 100


@pytest.mark.asyncio
async def test_session_total_increments(statistics_service: StatisticsService):
    assert statistics_service.session_total == 0
    statistics_service.increment_session_total()
    statistics_service.increment_session_total()
    assert statistics_service.session_total == 2
