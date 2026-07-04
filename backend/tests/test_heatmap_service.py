"""HeatmapService unit tests."""

import pytest

from app.services.attack_generator import AttackGenerator
from app.services.heatmap_service import HeatmapService


@pytest.mark.asyncio
async def test_record_increments_country_count(
    attack_generator: AttackGenerator,
    heatmap_service: HeatmapService,
):
    attack = await attack_generator.generate()
    heatmap_service.record(attack)
    counts = heatmap_service.get_counts()
    assert counts[attack.source_country] == 1


@pytest.mark.asyncio
async def test_rebuild_from_repository(
    attack_generator: AttackGenerator,
    heatmap_service: HeatmapService,
    attack_repo,
):
    for _ in range(5):
        attack = await attack_generator.generate()
        await attack_repo.add(attack)
        heatmap_service.record(attack)

    await heatmap_service.rebuild_from_repository()
    counts = heatmap_service.get_counts()
    assert sum(counts.values()) == 5


@pytest.mark.asyncio
async def test_get_heatmap_response(
    attack_generator: AttackGenerator,
    heatmap_service: HeatmapService,
):
    attack = await attack_generator.generate()
    heatmap_service.record(attack)
    result = await heatmap_service.get_heatmap()
    assert result.total >= 1
    assert attack.source_country in result.data
    assert result.updated_at.endswith("Z")
