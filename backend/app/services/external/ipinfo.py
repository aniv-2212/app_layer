"""IPInfo — IP geolocation and network ownership."""

from app.services.external.base import ExternalService


class IPInfoService(ExternalService):
    name = "ipinfo"
    base_url = "https://ipinfo.io"
    requires_key = False  # limited keyless quota; token raises limits
    min_interval = 1.0

    @property
    def api_key(self) -> str | None:
        return self.settings.ipinfo_token

    async def lookup(self, ip: str) -> dict:
        """Geolocation + ASN/org details for an IP."""
        params = {"token": self.api_key} if self.api_key else None
        payload = await self.request_json(
            f"/{ip}/json",
            params=params,
            cache_key=f"ip:{ip}",
            ttl=3600.0,
        )
        return {
            "ip": payload.get("ip", ip),
            "hostname": payload.get("hostname"),
            "city": payload.get("city"),
            "region": payload.get("region"),
            "country": payload.get("country"),
            "loc": payload.get("loc"),
            "org": payload.get("org"),
            "timezone": payload.get("timezone"),
            "anycast": payload.get("anycast"),
            "bogon": payload.get("bogon"),
        }
