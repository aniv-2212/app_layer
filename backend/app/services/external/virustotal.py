"""VirusTotal v3 — file/IP/domain reputation."""

from app.services.external.base import ExternalService


class VirusTotalService(ExternalService):
    name = "virustotal"
    base_url = "https://www.virustotal.com/api/v3"
    requires_key = True
    min_interval = 15.5  # free tier: 4 requests/minute

    @property
    def api_key(self) -> str | None:
        return self.settings.virustotal_api_key

    def _headers(self) -> dict:
        return {"x-apikey": self.api_key or ""}

    @staticmethod
    def _trim(payload: dict) -> dict:
        data = payload.get("data", {})
        attributes = data.get("attributes", {})
        return {
            "id": data.get("id"),
            "type": data.get("type"),
            "reputation": attributes.get("reputation"),
            "last_analysis_stats": attributes.get("last_analysis_stats", {}),
            "tags": attributes.get("tags", []),
            "country": attributes.get("country"),
            "as_owner": attributes.get("as_owner"),
            "meaningful_name": attributes.get("meaningful_name"),
            "type_description": attributes.get("type_description"),
            "size": attributes.get("size"),
            "sha256": attributes.get("sha256"),
            "popular_threat_classification": attributes.get("popular_threat_classification"),
        }

    async def ip_report(self, ip: str) -> dict:
        """Reputation report for an IP address."""
        self.require_configured()
        payload = await self.request_json(
            f"/ip_addresses/{ip}",
            headers=self._headers(),
            cache_key=f"ip:{ip}",
            ttl=900.0,
        )
        return self._trim(payload)

    async def file_report(self, file_hash: str) -> dict:
        """Reputation report for a file hash (MD5/SHA1/SHA256)."""
        self.require_configured()
        payload = await self.request_json(
            f"/files/{file_hash}",
            headers=self._headers(),
            cache_key=f"file:{file_hash}",
            ttl=3600.0,
        )
        return self._trim(payload)
