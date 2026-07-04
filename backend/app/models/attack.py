"""Domain model for cyber attack events."""

from enum import Enum

from pydantic import BaseModel, Field


class AttackType(str, Enum):
    """Supported attack classifications."""

    SQL_INJECTION = "SQL Injection"
    XSS = "Cross Site Scripting"
    COMMAND_INJECTION = "Command Injection"
    CREDENTIAL_STUFFING = "Credential Stuffing"
    BOT_ATTACK = "Bot Attack"
    BRUTE_FORCE = "Brute Force"
    PATH_TRAVERSAL = "Path Traversal"
    RCE = "Remote Code Execution"
    SSRF = "SSRF"
    DDOS = "DDoS"
    DIRECTORY_TRAVERSAL = "Directory Traversal"
    FILE_INCLUSION = "File Inclusion"
    MALWARE_DOWNLOAD = "Malware Download"
    API_ABUSE = "API Abuse"
    RATE_LIMIT_VIOLATION = "Rate Limit Violation"


class Severity(str, Enum):
    """Attack severity tiers."""

    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class AttackStatus(str, Enum):
    """Mitigation status of an attack event."""

    BLOCKED = "Blocked"
    MITIGATED = "Mitigated"
    DETECTED = "Detected"
    INVESTIGATING = "Investigating"
    ALLOWED = "Allowed"


class HttpMethod(str, Enum):
    """HTTP verbs observed in attack traffic."""

    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    PATCH = "PATCH"
    DELETE = "DELETE"
    HEAD = "HEAD"
    OPTIONS = "OPTIONS"


class Protocol(str, Enum):
    """Network protocol."""

    HTTP = "HTTP"
    HTTPS = "HTTPS"
    TCP = "TCP"
    UDP = "UDP"


class AttackEvent(BaseModel):
    """Full attack event payload streamed to clients."""

    id: int
    timestamp: str
    source_country: str
    destination_country: str
    source_latitude: float
    source_longitude: float
    destination_latitude: float
    destination_longitude: float
    source_ip: str
    destination_ip: str
    attack_type: AttackType
    severity: Severity
    status: AttackStatus
    endpoint: str
    http_method: HttpMethod
    request_count: int = Field(..., ge=1)
    duration_ms: int = Field(..., ge=0)
    confidence: float = Field(..., ge=0, le=100)
    risk_score: int = Field(..., ge=0, le=100)
    protocol: Protocol
    user_agent: str
    asn: str
    city: str
    isp: str
    country_code: str
    latitude: float
    longitude: float
