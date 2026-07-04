"""Application configuration loaded from environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for the CyberAI Live Threat Map backend."""

    model_config = SettingsConfigDict(
        env_file=".env",
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

    # CORS origins (comma-separated)
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return cached settings singleton."""
    return Settings()
