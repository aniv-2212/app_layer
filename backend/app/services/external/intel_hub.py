"""Aggregates all external intel services + periodic WebSocket broadcast."""

from __future__ import annotations

import asyncio
import logging
from typing import TYPE_CHECKING

from app.config.settings import Settings
from app.services.external.abuseipdb import AbuseIPDBService
from app.services.external.base import ExternalService, ExternalServiceError
from app.services.external.cisa_kev import CisaKevService
from app.services.external.cloudflare_radar import CloudflareRadarService
from app.services.external.hibp import HIBPService
from app.services.external.ipinfo import IPInfoService
from app.services.external.otx import OTXService
from app.services.external.phishtank import PhishTankService
from app.services.external.shodan import ShodanService
from app.services.external.virustotal import VirusTotalService

if TYPE_CHECKING:
    from app.websocket.socket_manager import SocketManager

logger = logging.getLogger(__name__)


class IntelHub:
    """Owns every external service instance and the intel:update broadcast loop."""

    def __init__(self, settings: Settings, socket_manager: "SocketManager") -> None:
        self.settings = settings
        self.socket = socket_manager
        self.radar = CloudflareRadarService(settings)
        self.shodan = ShodanService(settings)
        self.virustotal = VirusTotalService(settings)
        self.phishtank = PhishTankService(settings)
        self.abuseipdb = AbuseIPDBService(settings)
        self.otx = OTXService(settings)
        self.cisa_kev = CisaKevService(settings)
        self.ipinfo = IPInfoService(settings)
        self.hibp = HIBPService(settings)
        self._broadcast_task: asyncio.Task | None = None

    @property
    def services(self) -> dict[str, ExternalService]:
        return {
            "cloudflare_radar": self.radar,
            "shodan": self.shodan,
            "virustotal": self.virustotal,
            "phishtank": self.phishtank,
            "abuseipdb": self.abuseipdb,
            "alienvault_otx": self.otx,
            "cisa_kev": self.cisa_kev,
            "ipinfo": self.ipinfo,
            "hibp": self.hibp,
        }

    def status(self) -> dict:
        return {slug: service.status() for slug, service in self.services.items()}

    async def snapshot(self) -> dict:
        """Best-effort snapshot of feed-style sources (used by intel:update)."""
        results: dict = {"sources": {}}

        async def collect(slug: str, coro) -> None:
            try:
                results["sources"][slug] = await coro
            except ExternalServiceError as exc:
                results["sources"][slug] = {"error": exc.detail}
            except Exception as exc:  # never let one feed break the snapshot
                logger.warning("intel snapshot %s failed: %s", slug, exc)
                results["sources"][slug] = {"error": str(exc)[:200]}

        tasks = [
            collect("cisa_kev", self.cisa_kev.vulnerabilities(limit=10)),
            collect("hibp_breaches", self.hibp.breaches(limit=10)),
        ]
        if self.radar.configured:
            tasks.append(collect("cloudflare_radar", self.radar.top_attack_origins()))
        if self.otx.configured:
            tasks.append(collect("alienvault_otx", self.otx.latest_pulses(limit=5)))
        await asyncio.gather(*tasks)
        results["configured"] = {slug: service.configured for slug, service in self.services.items()}
        return results

    async def start_broadcast(self) -> None:
        if self._broadcast_task and not self._broadcast_task.done():
            return
        self._broadcast_task = asyncio.create_task(self._broadcast_loop())

    async def stop_broadcast(self) -> None:
        if self._broadcast_task:
            self._broadcast_task.cancel()
            try:
                await self._broadcast_task
            except asyncio.CancelledError:
                pass
            self._broadcast_task = None
        for service in self.services.values():
            await service.close()

    async def _broadcast_loop(self) -> None:
        """Emit intel:update on an interval so dashboards refresh in realtime."""
        while True:
            try:
                snapshot = await self.snapshot()
                await self.socket.emit("intel:update", snapshot)
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                logger.warning("intel broadcast failed: %s", exc)
            await asyncio.sleep(self.settings.intel_broadcast_interval)
