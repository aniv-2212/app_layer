"""ReplayService unit tests."""

import pytest

from app.services.attack_generator import AttackGenerator
from app.services.replay_service import ReplayService


@pytest.mark.asyncio
async def test_get_replay_returns_chronological_order(
    attack_generator: AttackGenerator,
    replay_service: ReplayService,
    attack_repo,
):
    ids = []
    for _ in range(10):
        attack = await attack_generator.generate()
        await attack_repo.add(attack)
        ids.append(attack.id)

    result = await replay_service.get_replay()
    assert result.total == 10
    assert result.capacity == 500
    assert len(result.items) == 10
    returned_ids = [item.id for item in result.items]
    assert returned_ids == ids


@pytest.mark.asyncio
async def test_get_replay_respects_buffer_limit(
    attack_generator: AttackGenerator,
    replay_service: ReplayService,
    attack_repo,
):
    for _ in range(3):
        attack = await attack_generator.generate()
        await attack_repo.add(attack)

    result = await replay_service.get_replay()
    assert len(result.items) <= 500


@pytest.mark.asyncio
async def test_get_timeline_payload(
    attack_generator: AttackGenerator,
    replay_service: ReplayService,
    attack_repo,
):
    for _ in range(5):
        attack = await attack_generator.generate()
        await attack_repo.add(attack)

    timeline = await replay_service.get_timeline_payload(limit=3)
    assert len(timeline) == 3
    assert "attack_type" in timeline[0]
