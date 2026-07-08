"""FastAPI dependency injection providers."""

from functools import lru_cache

from app.ai_assistant.service import AiAssistantService
from app.config.settings import Settings, get_settings
from app.generators.random_data_generator import RandomDataGenerator
from app.repositories.attack_repository import AttackRepository
from app.repositories.country_repository import CountryRepository
from app.services.attack_generator import AttackGenerator
from app.services.external.intel_hub import IntelHub
from app.services.heatmap_service import HeatmapService
from app.services.replay_service import ReplayService
from app.services.statistics_service import StatisticsService
from app.services.stream_service import StreamService
from app.url_scanner.service import URLScannerService
from app.websocket.socket_manager import SocketManager


class AppContainer:
    """
    Application-wide dependency container.

    Holds singleton service instances shared across REST routes and
    the Socket.IO streaming layer.
    """

    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.country_repo = CountryRepository()
        self.attack_repo = AttackRepository(max_size=self.settings.attack_buffer_size)
        self.random_gen = RandomDataGenerator()
        self.attack_generator = AttackGenerator(
            country_repo=self.country_repo,
            attack_repo=self.attack_repo,
            random_gen=self.random_gen,
        )
        self.heatmap_service = HeatmapService(self.attack_repo)
        self.statistics_service = StatisticsService(self.attack_repo)
        self.replay_service = ReplayService(self.attack_repo)
        self.socket_manager = SocketManager(self.settings)
        self.stream_service = StreamService(
            settings=self.settings,
            attack_generator=self.attack_generator,
            attack_repo=self.attack_repo,
            heatmap_service=self.heatmap_service,
            statistics_service=self.statistics_service,
            replay_service=self.replay_service,
            socket_manager=self.socket_manager,
        )
        self.intel_hub = IntelHub(settings=self.settings, socket_manager=self.socket_manager)
        self.url_scanner_service = URLScannerService(
            history_size=self.settings.url_scanner_history_size,
        )
        self.ai_assistant_service = AiAssistantService(settings=self.settings)


@lru_cache
def get_container() -> AppContainer:
    return AppContainer()


def get_attack_repo() -> AttackRepository:
    return get_container().attack_repo


def get_country_repo() -> CountryRepository:
    return get_container().country_repo


def get_heatmap_service() -> HeatmapService:
    return get_container().heatmap_service


def get_statistics_service() -> StatisticsService:
    return get_container().statistics_service


def get_replay_service() -> ReplayService:
    return get_container().replay_service


def get_stream_service() -> StreamService:
    return get_container().stream_service


def get_socket_manager() -> SocketManager:
    return get_container().socket_manager


def get_intel_hub() -> IntelHub:
    return get_container().intel_hub


def get_url_scanner_service() -> URLScannerService:
    return get_container().url_scanner_service


def get_ai_assistant_service() -> AiAssistantService:
    return get_container().ai_assistant_service
