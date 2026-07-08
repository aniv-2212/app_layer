"""URL validation and SSRF protections for the URL Scanner.

The domain-intelligence stage performs real network activity (DNS, WHOIS,
TLS handshake) against the submitted host, so every URL is validated
server-side before any lookup happens.
"""

import ipaddress
import socket
from urllib.parse import urlparse

MAX_URL_LENGTH = 2048
ALLOWED_SCHEMES = {"http", "https"}

_BLOCKED_HOSTNAMES = {
    "localhost",
    "localhost.localdomain",
    "ip6-localhost",
    "metadata.google.internal",
}

_BLOCKED_HOST_SUFFIXES = (".localhost", ".local", ".internal", ".lan", ".home.arpa")


class URLValidationError(ValueError):
    """Raised when a submitted URL fails validation. Message is user-safe."""


def _is_public_ip(ip: ipaddress.IPv4Address | ipaddress.IPv6Address) -> bool:
    return not (
        ip.is_private
        or ip.is_loopback
        or ip.is_link_local
        or ip.is_multicast
        or ip.is_reserved
        or ip.is_unspecified
    )


def normalize_and_validate_url(raw_url: str) -> str:
    """Validate a user-submitted URL for lexical analysis.

    Returns the normalized URL (scheme added if missing). Raises
    URLValidationError with a user-friendly message on failure.
    """
    url = (raw_url or "").strip()
    if not url:
        raise URLValidationError("URL must not be empty.")
    if len(url) > MAX_URL_LENGTH:
        raise URLValidationError(f"URL exceeds maximum length of {MAX_URL_LENGTH} characters.")

    # Detect colon-scheme patterns without :// (javascript:…, data:…, vbscript:…)
    if "://" not in url:
        pre = urlparse(url)
        if pre.scheme and pre.scheme not in ALLOWED_SCHEMES:
            raise URLValidationError("Only http:// and https:// URLs can be scanned.")
        url = f"https://{url}"

    parsed = urlparse(url)
    if parsed.scheme.lower() not in ALLOWED_SCHEMES:
        raise URLValidationError("Only http:// and https:// URLs can be scanned.")
    if not parsed.hostname:
        raise URLValidationError("URL has no valid hostname.")

    return url


def validate_host_for_network_lookup(hostname: str) -> None:
    """Block hosts that would let the scanner reach internal infrastructure.

    Rejects localhost aliases, internal-only suffixes, literal private IPs,
    and hostnames whose DNS resolution points at private/reserved ranges
    (guards against DNS-based SSRF).
    """
    host = (hostname or "").strip().strip(".").lower()
    if not host:
        raise URLValidationError("URL has no valid hostname.")

    if host in _BLOCKED_HOSTNAMES or host.endswith(_BLOCKED_HOST_SUFFIXES):
        raise URLValidationError("Scanning internal or local hosts is not allowed.")

    # Literal IP address (v4 or v6)?
    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        ip = None
    if ip is not None:
        if not _is_public_ip(ip):
            raise URLValidationError("Scanning private or reserved IP addresses is not allowed.")
        return

    # Resolve and verify every returned address is public.
    try:
        results = socket.getaddrinfo(host, None, proto=socket.IPPROTO_TCP)
    except socket.gaierror:
        # Unresolvable hosts are allowed through — lexical analysis still works
        # and the network lookups will simply report "Unknown".
        return

    for family, _type, _proto, _canon, sockaddr in results:
        try:
            resolved = ipaddress.ip_address(sockaddr[0])
        except ValueError:
            continue
        if not _is_public_ip(resolved):
            raise URLValidationError(
                "This hostname resolves to a private or internal address and cannot be scanned."
            )
