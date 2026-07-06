"""AbuseIPDB — crowd-sourced IP abuse reports."""

from app.services.external.base import ExternalService


class AbuseIPDBService(ExternalService):
    name = "abuseipdb"
    base_url = "https://api.abuseipdb.com/api/v2"
    requires_key = True
    min_interval = 1.5

    @property
    def api_key(self) -> str | None:
        return self.settings.abuseipdb_api_key

    async def check_ip(self, ip: str, max_age_days: int = 90) -> dict:
        """Abuse confidence score and report history for an IP."""
        self.require_configured()
        payload = await self.request_json(
            "/check",
            params={"ipAddress": ip, "maxAgeInDays": max_age_days, "verbose": ""},
            headers={"Key": self.api_key or "", "Accept": "application/json"},
            cache_key=f"check:{ip}:{max_age_days}",
            ttl=900.0,
        )
        data = payload.get("data", payload)
        return {
            "ip": data.get("ipAddress", ip),
            "abuse_confidence_score": data.get("abuseConfidenceScore"),
            "total_reports": data.get("totalReports"),
            "distinct_users": data.get("numDistinctUsers"),
            "country_code": data.get("countryCode"),
            "isp": data.get("isp"),
            "domain": data.get("domain"),
            "usage_type": data.get("usageType"),
            "is_tor": data.get("isTor"),
            "is_whitelisted": data.get("isWhitelisted"),
            "last_reported_at": data.get("lastReportedAt"),
            "recent_reports": [
                {
                    "reported_at": report.get("reportedAt"),
                    "comment": (report.get("comment") or "")[:160],
                    "categories": report.get("categories", []),
                }
                for report in (data.get("reports") or [])[:5]
            ],
        }
