"""PhishTank — community phishing URL verification."""

from app.services.external.base import ExternalService


class PhishTankService(ExternalService):
    name = "phishtank"
    base_url = "https://checkurl.phishtank.com"
    requires_key = False  # app key is optional, raises rate limits when present
    min_interval = 2.0

    @property
    def api_key(self) -> str | None:
        return self.settings.phishtank_app_key

    async def check_url(self, url: str) -> dict:
        """Check whether a URL is a known/verified phish."""
        data = {"url": url, "format": "json"}
        if self.api_key:
            data["app_key"] = self.api_key
        payload = await self.request_json(
            "/checkurl/",
            method="POST",
            data=data,
            cache_key=f"url:{url}",
            ttl=900.0,
        )
        results = payload.get("results", payload)
        return {
            "url": url,
            "in_database": results.get("in_database", False),
            "verified": results.get("verified", False),
            "valid": results.get("valid", False),
            "phish_id": results.get("phish_id"),
            "phish_detail_page": results.get("phish_detail_page"),
        }
