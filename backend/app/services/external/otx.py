"""AlienVault OTX — open threat exchange pulses and indicators."""

from app.services.external.base import ExternalService


class OTXService(ExternalService):
    name = "alienvault_otx"
    base_url = "https://otx.alienvault.com/api/v1"
    requires_key = True
    min_interval = 1.0

    @property
    def api_key(self) -> str | None:
        return self.settings.otx_api_key

    def _headers(self) -> dict:
        return {"X-OTX-API-KEY": self.api_key or ""}

    async def latest_pulses(self, limit: int = 10) -> dict:
        """Most recent subscribed threat pulses."""
        self.require_configured()
        payload = await self.request_json(
            "/pulses/subscribed",
            params={"limit": limit},
            headers=self._headers(),
            cache_key=f"pulses:{limit}",
        )
        return {
            "count": payload.get("count", 0),
            "pulses": [
                {
                    "id": pulse.get("id"),
                    "name": pulse.get("name"),
                    "description": (pulse.get("description") or "")[:280],
                    "author": pulse.get("author_name"),
                    "created": pulse.get("created"),
                    "tags": pulse.get("tags", [])[:8],
                    "targeted_countries": pulse.get("targeted_countries", []),
                    "malware_families": pulse.get("malware_families", [])[:5],
                    "indicator_count": len(pulse.get("indicators", [])),
                }
                for pulse in payload.get("results", [])[:limit]
            ],
        }

    async def ip_reputation(self, ip: str) -> dict:
        """General indicator data for an IPv4 address."""
        self.require_configured()
        payload = await self.request_json(
            f"/indicators/IPv4/{ip}/general",
            headers=self._headers(),
            cache_key=f"ip:{ip}",
            ttl=900.0,
        )
        return {
            "ip": ip,
            "reputation": payload.get("reputation"),
            "country_name": payload.get("country_name"),
            "asn": payload.get("asn"),
            "pulse_count": payload.get("pulse_info", {}).get("count", 0),
            "pulses": [
                {"name": pulse.get("name"), "tags": pulse.get("tags", [])[:6]}
                for pulse in payload.get("pulse_info", {}).get("pulses", [])[:5]
            ],
        }
