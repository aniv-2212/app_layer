"""Utility helpers."""

from datetime import UTC, datetime, timedelta


def utc_now_iso() -> str:
    """Return current UTC timestamp in ISO 8601 format."""
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def parse_time_range(time_range: str | None) -> datetime | None:
    """
    Convert a time_range query string to a UTC cutoff datetime.

    Supported values: 15m, 1h, 6h, 24h, 7d
    """
    if not time_range:
        return None

    mapping: dict[str, timedelta] = {
        "15m": timedelta(minutes=15),
        "1h": timedelta(hours=1),
        "6h": timedelta(hours=6),
        "24h": timedelta(hours=24),
        "7d": timedelta(days=7),
    }

    delta = mapping.get(time_range.lower())
    if delta is None:
        return None

    return datetime.now(UTC) - delta


def parse_iso_timestamp(value: str) -> datetime:
    """Parse ISO 8601 timestamp string to timezone-aware datetime."""
    normalized = value.replace("Z", "+00:00")
    return datetime.fromisoformat(normalized)
