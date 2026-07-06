"""Shared HTTP client for external threat-intel services.

Provides, for every service that subclasses :class:`ExternalService`:
  - lazy shared ``httpx.AsyncClient`` with sane timeouts
  - retries with exponential backoff (honours ``Retry-After`` on 429)
  - in-memory TTL response cache
  - per-service rate limiting (minimum interval between upstream calls)
  - normalized error type (:class:`ExternalServiceError`)
"""

from __future__ import annotations

import asyncio
import logging
import time
from typing import Any

import httpx

from app.config.settings import Settings

logger = logging.getLogger(__name__)


class ExternalServiceError(Exception):
    """Normalized upstream failure, mapped to an HTTP status by the routes."""

    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


class ExternalService:
    """Base class for one external API integration."""

    name: str = "external"
    base_url: str = ""
    #: True when the service is unusable without an API key.
    requires_key: bool = True
    #: Minimum seconds between two upstream requests (rate limit).
    min_interval: float = 1.0

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._client: httpx.AsyncClient | None = None
        self._cache: dict[str, tuple[float, Any]] = {}
        self._rate_lock = asyncio.Lock()
        self._last_request = 0.0
        self.last_success: str | None = None
        self.last_error: str | None = None

    # -- configuration -------------------------------------------------

    @property
    def api_key(self) -> str | None:
        """Override to pull the right key from settings."""
        return None

    @property
    def configured(self) -> bool:
        return bool(self.api_key) or not self.requires_key

    def require_configured(self) -> None:
        if not self.configured:
            raise ExternalServiceError(
                503,
                f"{self.name} is not configured — set its API key in backend/.env",
            )

    def status(self) -> dict:
        return {
            "name": self.name,
            "configured": self.configured,
            "requires_key": self.requires_key,
            "cached_entries": len(self._cache),
            "last_success": self.last_success,
            "last_error": self.last_error,
        }

    # -- plumbing --------------------------------------------------------

    def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(self.settings.intel_http_timeout),
                follow_redirects=True,
                headers={"User-Agent": "CyberAI-SOC-Dashboard/1.0"},
            )
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    def _cache_get(self, key: str) -> Any | None:
        entry = self._cache.get(key)
        if not entry:
            return None
        expires_at, value = entry
        if time.monotonic() > expires_at:
            self._cache.pop(key, None)
            return None
        return value

    def _cache_set(self, key: str, value: Any, ttl: float) -> None:
        # Bound the cache so long-running processes don't grow unbounded.
        if len(self._cache) > 256:
            self._cache.clear()
        self._cache[key] = (time.monotonic() + ttl, value)

    async def _throttle(self) -> None:
        async with self._rate_lock:
            wait = self._last_request + self.min_interval - time.monotonic()
            if wait > 0:
                await asyncio.sleep(wait)
            self._last_request = time.monotonic()

    # -- request ---------------------------------------------------------

    async def request_json(
        self,
        path: str,
        *,
        method: str = "GET",
        params: dict | None = None,
        headers: dict | None = None,
        data: dict | None = None,
        cache_key: str | None = None,
        ttl: float | None = None,
    ) -> Any:
        """Perform an upstream call with cache, rate limit, and retries."""
        ttl = ttl if ttl is not None else self.settings.intel_cache_ttl
        if cache_key is not None:
            cached = self._cache_get(cache_key)
            if cached is not None:
                return cached

        url = path if path.startswith("http") else f"{self.base_url}{path}"
        client = self._get_client()
        retries = max(1, self.settings.intel_max_retries)
        last_failure = "unknown error"

        for attempt in range(retries):
            await self._throttle()
            try:
                response = await client.request(method, url, params=params, headers=headers, data=data)
            except httpx.HTTPError as exc:
                last_failure = f"network error: {exc.__class__.__name__}"
                logger.warning("%s attempt %d failed: %s", self.name, attempt + 1, exc)
                await asyncio.sleep(0.5 * (2**attempt))
                continue

            if response.status_code == 429 or response.status_code >= 500:
                retry_after = response.headers.get("Retry-After")
                delay = float(retry_after) if retry_after and retry_after.isdigit() else 0.5 * (2**attempt)
                last_failure = f"HTTP {response.status_code}"
                logger.warning("%s attempt %d got %s, retrying in %.1fs", self.name, attempt + 1, response.status_code, delay)
                await asyncio.sleep(min(delay, 10.0))
                continue

            if not response.is_success:
                self.last_error = f"HTTP {response.status_code}"
                raise ExternalServiceError(
                    502 if response.status_code >= 500 else response.status_code,
                    f"{self.name} returned HTTP {response.status_code}: {response.text[:200]}",
                )

            try:
                payload = response.json()
            except ValueError:
                payload = {"raw": response.text}
            self.last_success = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            self.last_error = None
            if cache_key is not None:
                self._cache_set(cache_key, payload, ttl)
            return payload

        self.last_error = last_failure
        raise ExternalServiceError(502, f"{self.name} unavailable after {retries} attempts ({last_failure})")
