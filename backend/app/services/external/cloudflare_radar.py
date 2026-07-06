"""Cloudflare Radar — global layer-7 attack trends."""

from app.services.external.base import ExternalService


class CloudflareRadarService(ExternalService):
    name = "cloudflare_radar"
    base_url = "https://api.cloudflare.com/client/v4"
    requires_key = True
    min_interval = 1.0

    @property
    def api_key(self) -> str | None:
        return self.settings.cloudflare_radar_token

    def _headers(self) -> dict:
        return {"Authorization": f"Bearer {self.api_key}"}

    async def top_attack_origins(self, date_range: str = "1d", limit: int = 10) -> dict:
        """Top attack-origin locations for layer-7 attacks."""
        self.require_configured()
        payload = await self.request_json(
            "/radar/attacks/layer7/top/locations/origin",
            params={"dateRange": date_range, "limit": limit},
            headers=self._headers(),
            cache_key=f"origins:{date_range}:{limit}",
        )
        return payload.get("result", payload)

    async def attack_timeseries(self, date_range: str = "1d", agg_interval: str = "1h") -> dict:
        """Layer-7 attack volume timeseries."""
        self.require_configured()
        payload = await self.request_json(
            "/radar/attacks/layer7/timeseries",
            params={"dateRange": date_range, "aggInterval": agg_interval},
            headers=self._headers(),
            cache_key=f"timeseries:{date_range}:{agg_interval}",
        )
        return payload.get("result", payload)
