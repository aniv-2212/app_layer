"""Lexical URL feature extraction — ported from the ThreatLens URL Scanner project.

Produces the exact 33-feature vector the bundled XGBoost model was trained on.
"""

import re
from collections import Counter
from math import log2
from urllib.parse import urlparse

import tldextract

SUSPICIOUS_KEYWORDS = ["login", "verify", "secure", "bank", "update", "free", "wp", "admin"]
BRANDS = ["google", "microsoft", "paypal", "amazon", "netflix", "apple", "facebook"]
SHORTENERS = ["bit.ly", "goo.gl", "tinyurl.com", "t.co", "is.gd", "buff.ly"]
SUSPICIOUS_TLDS = ["xyz", "top", "work", "gq", "fit", "tk", "cn", "ga", "cf"]

# Offline extractor — never fetches the public-suffix list at request time.
_tld_extract = tldextract.TLDExtract(suffix_list_urls=())


def entropy(url: str) -> float:
    """Shannon entropy of a string — measures randomness."""
    if not url:
        return 0.0
    counts = Counter(url)
    length = len(url)
    return -sum((count / length) * log2(count / length) for count in counts.values())


def extract_features(url: str) -> dict:
    """Extract the full 33-feature lexical vector from a URL."""
    features: dict = {}

    parsed = urlparse(url)
    ext = _tld_extract(url)

    hostname = parsed.netloc or ""
    path = parsed.path or ""
    query = parsed.query or ""
    fragment = parsed.fragment or ""

    # Basic length features
    features["url_length"] = len(url)
    features["hostname_length"] = len(hostname)
    features["path_length"] = len(path)
    features["query_length"] = len(query)
    features["fragment_length"] = len(fragment)

    # Character counts
    features["dot_count"] = url.count(".")
    features["hyphen_count"] = url.count("-")
    features["underscore_count"] = url.count("_")
    features["slash_count"] = url.count("/")
    features["digit_count"] = sum(c.isdigit() for c in url)
    features["letter_count"] = sum(c.isalpha() for c in url)

    special_chars = re.findall(r"[^a-zA-Z0-9]", url)
    features["special_char_count"] = len(special_chars)

    # Protocol features
    features["https"] = 1 if parsed.scheme == "https" else 0
    features["http"] = 1 if parsed.scheme == "http" else 0

    # IP address detection
    ip_pattern = r"(\d{1,3}\.){3}\d{1,3}"
    features["ip_address"] = 1 if re.search(ip_pattern, hostname) else 0

    # Domain information
    features["domain_length"] = len(ext.domain)
    features["subdomain_count"] = len(ext.subdomain.split(".")) if ext.subdomain else 0
    features["tld_length"] = len(ext.suffix)

    # Entropy
    features["entropy"] = entropy(url)

    # Token features
    tokens = [t for t in re.split(r"[./?=&_-]", url) if t]
    features["token_count"] = len(tokens)

    if tokens:
        lengths = [len(t) for t in tokens]
        features["avg_token_length"] = sum(lengths) / len(lengths)
        features["max_token_length"] = max(lengths)
    else:
        features["avg_token_length"] = 0
        features["max_token_length"] = 0

    # Suspicious keywords
    url_lower = url.lower()
    features["suspicious_keyword_count"] = sum(keyword in url_lower for keyword in SUSPICIOUS_KEYWORDS)
    features["brand_keyword_count"] = sum(brand in url_lower for brand in BRANDS)

    # URL shortener & suspicious TLDs
    features["url_shortener"] = int(any(short in hostname.lower() for short in SHORTENERS))
    features["suspicious_tld"] = int(ext.suffix.lower() in SUSPICIOUS_TLDS)

    # Engineered ratios & extra rules
    features["digit_ratio"] = features["digit_count"] / features["url_length"] if features["url_length"] > 0 else 0
    features["letter_ratio"] = features["letter_count"] / features["url_length"] if features["url_length"] > 0 else 0
    features["uppercase_count"] = sum(c.isupper() for c in url)

    digit_groups = re.findall(r"\d+", url)
    features["max_consecutive_digits"] = max([len(x) for x in digit_groups], default=0)

    special_groups = re.findall(r"[^a-zA-Z0-9]{2,}", url)
    features["consecutive_special_groups"] = len(special_groups)

    features["double_slash_count"] = url.count("//")
    features["has_at_symbol"] = int("@" in url)
    features["equal_count"] = url.count("=")
    features["question_count"] = url.count("?")
    features["ampersand_count"] = url.count("&")
    features["percent_count"] = url.count("%")
    features["longest_token"] = max([len(token) for token in tokens], default=0)

    features["empty_tokens"] = len([token for token in re.split(r"[./?=&_-]", url) if token == ""])

    try:
        features["has_port"] = int(parsed.port is not None)
    except ValueError:
        features["has_port"] = 0

    features["domain_has_digits"] = int(any(char.isdigit() for char in ext.domain))

    return features
