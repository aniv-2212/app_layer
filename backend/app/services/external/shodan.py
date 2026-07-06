"""Shodan — internet-exposed host intelligence."""

from app.services.external.base import ExternalService


class ShodanService(ExternalService):
    name = "shodan"
    base_url = "https://api.shodan.io"
    requires_key = True
    min_interval = 1.1  # Shodan free tier: 1 request/second

    @property
    def api_key(self) -> str | None:
        return self.settings.shodan_api_key

    async def host(self, ip: str) -> dict:
        """Host lookup: open ports, services, org, vulns."""
        self.require_configured()
        payload = await self.request_json(
            f"/shodan/host/{ip}",
            params={"key": self.api_key},
            cache_key=f"host:{ip}",
        )
        return {
            "ip": payload.get("ip_str", ip),
            "org": payload.get("org"),
            "isp": payload.get("isp"),
            "os": payload.get("os"),
            "country": payload.get("country_name"),
            "city": payload.get("city"),
            "ports": payload.get("ports", []),
            "hostnames": payload.get("hostnames", []),
            "vulns": sorted(payload.get("vulns", [])),
            "tags": payload.get("tags", []),
            "last_update": payload.get("last_update"),
            "services": [
                {
                    "port": item.get("port"),
                    "transport": item.get("transport"),
                    "product": item.get("product"),
                    "version": item.get("version"),
                }
                for item in payload.get("data", [])[:20]
            ],
        }

    async def api_info(self) -> dict:
        """Plan info + remaining query credits."""
        self.require_configured()
        return await self.request_json(
            "/api-info",
            params={"key": self.api_key},
            cache_key="api-info",
            ttl=60.0,
        )
