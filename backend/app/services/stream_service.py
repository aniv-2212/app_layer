"""Background streaming orchestrator for attack simulation."""

import asyncio
import logging

from app.config.settings import Settings
from app.repositories.attack_repository import AttackRepository
from app.services.attack_generator import AttackGenerator
from app.services.heatmap_service import HeatmapService
from app.services.replay_service import ReplayService
from app.services.statistics_service import StatisticsService
from app.websocket.socket_manager import SocketManager

logger = logging.getLogger(__name__)


class StreamService:
    """
    Runs periodic attack generation and Socket.IO broadcasts.

    - Every `socket_interval` seconds: generate attack, emit attack:new
    - Every `summary_interval` seconds: emit attack:summary, heatmap:update,
      statistics:update, timeline:update
    """

    def __init__(
        self,
        settings: Settings,
        attack_generator: AttackGenerator,
        attack_repo: AttackRepository,
        heatmap_service: HeatmapService,
        statistics_service: StatisticsService,
        replay_service: ReplayService,
        socket_manager: SocketManager,
    ) -> None:
        self._settings = settings
        self._generator = attack_generator
        self._attack_repo = attack_repo
        self._heatmap = heatmap_service
        self._statistics = statistics_service
        self._replay = replay_service
        self._socket = socket_manager
        self._running = False
        self._attack_task: asyncio.Task | None = None
        self._summary_task: asyncio.Task | None = None

    @property
    def running(self) -> bool:
        return self._running

    def status(self) -> dict:
        """Return operational stream status for REST health/control endpoints."""
        return {
            "running": self._running,
            "socket_interval": self._settings.socket_interval,
            "summary_interval": self._settings.summary_interval,
            "buffer_size": self._attack_repo.capacity,
            "stored_attacks": self._attack_repo.stored_count,
            "session_total": self._statistics.session_total,
            "connected_clients": self._socket.connected_count,
        }

    async def start(self) -> None:
        """Start background streaming loops."""
        if self._running:
            return
        self._running = True
        logger.info(
            "Starting attack stream (interval=%ss, summary=%ss)",
            self._settings.socket_interval,
            self._settings.summary_interval,
        )
        self._attack_task = asyncio.create_task(self._attack_loop())
        self._summary_task = asyncio.create_task(self._summary_loop())

    async def stop(self) -> None:
        """Cancel background tasks gracefully."""
        self._running = False
        for task in (self._attack_task, self._summary_task):
            if task is not None:
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass
        self._attack_task = None
        self._summary_task = None
        logger.info("Attack stream stopped")

    async def _attack_loop(self) -> None:
        while self._running:
            try:
                await self.generate_once()
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.exception("Error in attack generation loop")
            await asyncio.sleep(self._settings.socket_interval)

    async def generate_once(self) -> dict:
        """Generate, persist, and broadcast a single attack event."""
        attack = await self._generator.generate()
        await self._attack_repo.add(attack)
        self._heatmap.record(attack)
        self._statistics.increment_session_total()

        payload = attack.model_dump(mode="json")
        await self._socket.emit("attack:new", payload)
        return payload

    async def emit_snapshot(self) -> dict:
        """Broadcast all derived dashboard state immediately."""
        summary = await self._statistics.get_summary()
        heatmap = self._heatmap.to_broadcast_payload()
        stats = await self._statistics.get_statistics()
        timeline = await self._replay.get_timeline_payload()

        await self._socket.emit("attack:summary", summary.model_dump())
        await self._socket.emit("heatmap:update", heatmap)
        await self._socket.emit("statistics:update", stats.model_dump())
        await self._socket.emit("timeline:update", timeline)

        return {
            "summary": summary.model_dump(),
            "heatmap": heatmap,
            "statistics": stats.model_dump(),
            "timeline": timeline,
        }

    async def _summary_loop(self) -> None:
        while self._running:
            try:
                await asyncio.sleep(self._settings.summary_interval)
                await self.emit_snapshot()
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.exception("Error in summary broadcast loop")
