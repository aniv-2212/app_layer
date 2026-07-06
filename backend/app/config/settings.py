"""Application configuration loaded from environment variables."""

from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Runtime settings for the CyberAI Live Threat Map backend."""

    model_config = SettingsConfigDict(
        env_file=(BACKEND_DIR / ".env", ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False

    # Interval (seconds) between generated attack events
    socket_interval: float = 1.0
    # Interval (seconds) between summary / statistics broadcasts
    summary_interval: float = 5.0

    # Optional infrastructure (reserved for future PostgreSQL / Redis integration)
    redis_url: str | None = None
    database_url: str | None = None

    # Attack timeline buffer size
    attack_buffer_size: int = 500

    # -- External threat-intel API keys (leave empty to disable a service) --
    cloudflare_radar_token: str | None = None
    shodan_api_key: str | None = None
    virustotal_api_key: str | None = None
    phishtank_app_key: str | None = None  # optional — PhishTank works without it
    abuseipdb_api_key: str | None = None
    otx_api_key: str | None = None  # AlienVault OTX
    ipinfo_token: str | None = None  # optional — IPInfo allows limited keyless use
    hibp_api_key: str | None = None  # only needed for per-account breach lookups

    # -- External intel behaviour --
    intel_http_timeout: float = 15.0
    intel_max_retries: int = 3
    intel_cache_ttl: float = 300.0  # seconds
    intel_broadcast_interval: float = 120.0  # seconds between intel:update emits

    # CORS origins (comma-separated)
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    @field_validator("debug", mode="before")
    @classmethod
    def normalize_debug(cls, value: object) -> object:
        """Accept common deployment strings without crashing settings parsing."""
        if isinstance(value, str) and value.lower() in {"release", "production", "prod"}:
            return False
        if isinstance(value, str) and value.lower() in {"development", "dev"}:
            return True
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return cached settings singleton."""
    return Settings()
