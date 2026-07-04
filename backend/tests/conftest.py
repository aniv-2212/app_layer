"""Pytest configuration and shared fixtures."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.api.deps import AppContainer
from app.generators.random_data_generator import RandomDataGenerator
from app.main import create_app
from app.repositories.attack_repository import AttackRepository
from app.repositories.country_repository import CountryRepository
from app.services.attack_generator import AttackGenerator
from app.services.heatmap_service import HeatmapService
from app.services.replay_service import ReplayService
from app.services.statistics_service import StatisticsService


@pytest.fixture
def country_repo() -> CountryRepository:
    return CountryRepository()


@pytest.fixture
def attack_repo() -> AttackRepository:
    return AttackRepository(max_size=500)


@pytest.fixture
def random_gen() -> RandomDataGenerator:
    return RandomDataGenerator()


@pytest.fixture
def attack_generator(
    country_repo: CountryRepository,
    attack_repo: AttackRepository,
    random_gen: RandomDataGenerator,
) -> AttackGenerator:
    return AttackGenerator(country_repo, attack_repo, random_gen)


@pytest.fixture
def heatmap_service(attack_repo: AttackRepository) -> HeatmapService:
    return HeatmapService(attack_repo)


@pytest.fixture
def statistics_service(attack_repo: AttackRepository) -> StatisticsService:
    return StatisticsService(attack_repo)


@pytest.fixture
def replay_service(attack_repo: AttackRepository) -> ReplayService:
    return ReplayService(attack_repo)


@pytest.fixture
def test_app():
    """FastAPI app without lifespan streaming for isolated HTTP tests."""
    return create_app()


@pytest.fixture
async def client(test_app):
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
