"""Have I Been Pwned — breach catalog and account exposure."""

from app.services.external.base import ExternalService


class HIBPService(ExternalService):
    name = "hibp"
    base_url = "https://haveibeenpwned.com/api/v3"
    requires_key = False  # /breaches is public; account lookups need a key
    min_interval = 6.5  # HIBP enforces strict per-key rate limits

    @property
    def api_key(self) -> str | None:
        return self.settings.hibp_api_key

    async def breaches(self, limit: int = 20) -> dict:
        """Public breach catalog, newest first (no key required)."""
        payload = await self.request_json("/breaches", cache_key="breaches", ttl=3600.0)
        newest_first = sorted(payload, key=lambda breach: breach.get("BreachDate", ""), reverse=True)
        return {
            "total": len(payload),
            "breaches": [
                {
                    "name": breach.get("Name"),
                    "title": breach.get("Title"),
                    "domain": breach.get("Domain"),
                    "breach_date": breach.get("BreachDate"),
                    "added_date": breach.get("AddedDate"),
                    "pwn_count": breach.get("PwnCount"),
                    "data_classes": breach.get("DataClasses", [])[:8],
                    "is_verified": breach.get("IsVerified"),
                    "description": (breach.get("Description") or "")[:280],
                }
                for breach in newest_first[:limit]
            ],
        }

    async def breached_account(self, account: str) -> dict:
        """Breaches for a specific account (requires HIBP API key)."""
        if not self.api_key:
            from app.services.external.base import ExternalServiceError

            raise ExternalServiceError(503, "hibp account lookups require HIBP_API_KEY in backend/.env")
        payload = await self.request_json(
            f"/breachedaccount/{account}",
            params={"truncateResponse": "false"},
            headers={"hibp-api-key": self.api_key},
            cache_key=f"account:{account}",
            ttl=900.0,
        )
        return {"account": account, "breaches": payload}
