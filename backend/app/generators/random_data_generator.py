"""Synthetic data helpers for realistic attack simulation."""

import random
from typing import Sequence

from faker import Faker

fake = Faker()


class RandomDataGenerator:
    """Generates realistic network and HTTP metadata for attack events."""

    ENDPOINTS: tuple[str, ...] = (
        "/login",
        "/admin",
        "/api/auth",
        "/graphql",
        "/payment",
        "/upload",
        "/dashboard",
        "/api/users",
        "/api/v1/products",
        "/api/v2/checkout",
        "/wp-admin",
        "/.env",
        "/api/internal",
        "/oauth/token",
        "/register",
        "/reset-password",
        "/api/search",
        "/files/download",
        "/api/webhook",
        "/health",
    )

    USER_AGENTS: tuple[str, ...] = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "python-requests/2.31.0",
        "curl/8.4.0",
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
        "Nmap Scripting Engine",
        "sqlmap/1.8.2#stable",
        "Nikto/2.5.0",
        "Masscan/1.3.2",
    )

    ISPS: tuple[str, ...] = (
        "Cloudflare Inc.",
        "Amazon Technologies Inc.",
        "Google LLC",
        "DigitalOcean LLC",
        "Hetzner Online GmbH",
        "OVH SAS",
        "Linode LLC",
        "Comcast Cable Communications",
        "China Telecom",
        "Rostelecom",
        "Airtel Networks",
        "NTT Communications",
        "Deutsche Telekom AG",
        "Orange S.A.",
        "Telstra Corporation",
    )

    # Weighted IP prefixes by region for realism
    IP_PREFIXES: tuple[str, ...] = (
        "185.76",
        "103.21",
        "45.33",
        "192.168",
        "10.0",
        "172.16",
        "203.0",
        "91.108",
        "178.128",
        "52.47",
        "34.98",
        "104.16",
        "151.101",
        "140.82",
        "66.220",
    )

    def generate_ip(self) -> str:
        """Generate a plausible public IPv4 address."""
        prefix = random.choice(self.IP_PREFIXES)
        return f"{prefix}.{random.randint(0, 255)}.{random.randint(1, 254)}"

    def generate_asn(self) -> str:
        """Generate an autonomous system number string."""
        return f"AS{random.randint(1000, 65535)}"

    def generate_user_agent(self) -> str:
        """Return a random HTTP user agent."""
        return random.choice(self.USER_AGENTS)

    def generate_isp(self) -> str:
        """Return a random ISP name."""
        return random.choice(self.ISPS)

    def generate_endpoint(self) -> str:
        """Return a random API or web endpoint path."""
        return random.choice(self.ENDPOINTS)

    def generate_city(self, country_name: str) -> str:
        """Generate a city name localized to the country when possible."""
        try:
            return fake.city()
        except Exception:
            return f"{country_name} Metro"

    def generate_request_count(self, attack_type: str) -> int:
        """Higher-volume attacks (DDoS, bot) produce more requests."""
        if attack_type in ("DDoS", "Bot Attack", "Rate Limit Violation"):
            return random.randint(500, 50000)
        if attack_type in ("Brute Force", "Credential Stuffing"):
            return random.randint(50, 2000)
        return random.randint(1, 500)

    def generate_duration_ms(self, attack_type: str) -> int:
        """Attack duration varies by type."""
        if attack_type == "DDoS":
            return random.randint(30000, 600000)
        if attack_type in ("Brute Force", "Credential Stuffing"):
            return random.randint(5000, 120000)
        return random.randint(10, 15000)

    def generate_confidence(self, severity: str) -> float:
        """Map severity to detection confidence band."""
        bands: dict[str, tuple[float, float]] = {
            "Critical": (85.0, 99.9),
            "High": (70.0, 95.0),
            "Medium": (50.0, 85.0),
            "Low": (30.0, 70.0),
        }
        low, high = bands.get(severity, (40.0, 80.0))
        return round(random.uniform(low, high), 1)

    def generate_risk_score(self, severity: str, source_risk: str) -> int:
        """Composite risk score from severity and source country risk."""
        severity_base: dict[str, int] = {
            "Critical": 85,
            "High": 70,
            "Medium": 50,
            "Low": 25,
        }
        risk_boost: dict[str, int] = {
            "Critical": 15,
            "High": 10,
            "Medium": 5,
            "Low": 0,
        }
        base = severity_base.get(severity, 40)
        boost = risk_boost.get(source_risk, 0)
        jitter = random.randint(-5, 10)
        return max(0, min(100, base + boost + jitter))

    def jitter_coordinate(self, lat: float, lon: float, spread: float = 2.0) -> tuple[float, float]:
        """Add small random offset to coordinates for map visualization."""
        return (
            round(lat + random.uniform(-spread, spread), 4),
            round(lon + random.uniform(-spread, spread), 4),
        )

    def weighted_choice(self, items: Sequence[str], weights: Sequence[int]) -> str:
        """Select an item using weighted random choice."""
        return random.choices(list(items), weights=list(weights), k=1)[0]
