"""CISA KEV — Known Exploited Vulnerabilities catalog (public feed, no key)."""

from app.services.external.base import ExternalService

FEED_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"


class CisaKevService(ExternalService):
    name = "cisa_kev"
    base_url = ""
    requires_key = False
    min_interval = 5.0

    async def _catalog(self) -> dict:
        # The feed is ~3 MB; cache aggressively (it updates a few times per week).
        return await self.request_json(FEED_URL, cache_key="catalog", ttl=3600.0)

    async def vulnerabilities(self, limit: int = 25, search: str | None = None) -> dict:
        """Most recently added known-exploited CVEs, optionally filtered."""
        catalog = await self._catalog()
        vulnerabilities = catalog.get("vulnerabilities", [])
        if search:
            needle = search.lower()
            vulnerabilities = [
                vuln
                for vuln in vulnerabilities
                if needle in vuln.get("cveID", "").lower()
                or needle in vuln.get("vendorProject", "").lower()
                or needle in vuln.get("product", "").lower()
                or needle in vuln.get("vulnerabilityName", "").lower()
            ]
        newest_first = sorted(vulnerabilities, key=lambda vuln: vuln.get("dateAdded", ""), reverse=True)
        return {
            "catalog_version": catalog.get("catalogVersion"),
            "total": len(vulnerabilities),
            "count": min(limit, len(newest_first)),
            "vulnerabilities": [
                {
                    "cve_id": vuln.get("cveID"),
                    "vendor": vuln.get("vendorProject"),
                    "product": vuln.get("product"),
                    "name": vuln.get("vulnerabilityName"),
                    "date_added": vuln.get("dateAdded"),
                    "due_date": vuln.get("dueDate"),
                    "known_ransomware": vuln.get("knownRansomwareCampaignUse"),
                    "description": (vuln.get("shortDescription") or "")[:280],
                }
                for vuln in newest_first[:limit]
            ],
        }
