"""Tests for the URL Scanner feature module."""

import pytest

from app.url_scanner.features import extract_features
from app.url_scanner.security import (
    URLValidationError,
    normalize_and_validate_url,
    validate_host_for_network_lookup,
)
from app.url_scanner.service import URLScannerService


class TestFeatureExtraction:
    def test_extracts_all_expected_features(self):
        features = extract_features("https://www.example.com/path?q=1#frag")
        expected_keys = {
            "url_length", "hostname_length", "path_length", "query_length",
            "fragment_length", "dot_count", "hyphen_count", "underscore_count",
            "slash_count", "digit_count", "letter_count", "special_char_count",
            "https", "http", "ip_address", "domain_length", "subdomain_count",
            "tld_length", "entropy", "token_count", "avg_token_length",
            "max_token_length", "suspicious_keyword_count", "brand_keyword_count",
            "url_shortener", "suspicious_tld", "digit_ratio", "letter_ratio",
            "uppercase_count", "max_consecutive_digits", "consecutive_special_groups",
            "double_slash_count", "has_at_symbol", "equal_count", "question_count",
            "ampersand_count", "percent_count", "longest_token", "empty_tokens",
            "has_port", "domain_has_digits",
        }
        assert expected_keys <= set(features.keys())
        assert features["https"] == 1
        assert features["http"] == 0

    def test_detects_suspicious_signals(self):
        features = extract_features("http://paypal-login.xyz/verify?account=1")
        assert features["http"] == 1
        assert features["suspicious_keyword_count"] >= 2  # login + verify
        assert features["brand_keyword_count"] >= 1  # paypal
        assert features["suspicious_tld"] == 1

    def test_ip_hostname_detected(self):
        features = extract_features("http://192.168.10.5/admin")
        assert features["ip_address"] == 1


class TestURLValidation:
    def test_empty_url_rejected(self):
        with pytest.raises(URLValidationError):
            normalize_and_validate_url("")

    def test_bare_domain_gets_https(self):
        assert normalize_and_validate_url("example.com") == "https://example.com"

    def test_dangerous_schemes_rejected(self):
        for bad in ("file:///etc/passwd", "javascript:alert(1)", "ftp://example.com", "gopher://x"):
            with pytest.raises(URLValidationError):
                normalize_and_validate_url(bad)

    def test_overlong_url_rejected(self):
        with pytest.raises(URLValidationError):
            normalize_and_validate_url("https://example.com/" + "a" * 3000)

    def test_localhost_blocked_for_network_lookup(self):
        for host in ("localhost", "sub.localhost", "printer.local", "db.internal"):
            with pytest.raises(URLValidationError):
                validate_host_for_network_lookup(host)

    def test_private_ips_blocked_for_network_lookup(self):
        for ip in ("127.0.0.1", "10.0.0.1", "192.168.1.1", "172.16.0.1", "169.254.169.254", "::1"):
            with pytest.raises(URLValidationError):
                validate_host_for_network_lookup(ip)

    def test_public_ip_allowed(self):
        validate_host_for_network_lookup("8.8.8.8")


class TestScannerService:
    @pytest.fixture
    def service(self) -> URLScannerService:
        return URLScannerService(history_size=10)

    async def test_scan_returns_result(self, service: URLScannerService):
        result = await service.scan("https://example.com", include_domain_intel=False)
        assert result.url == "https://example.com"
        assert 0 <= result.risk_percentage <= 100
        assert result.status_class in {"safe", "warning", "danger"}
        assert result.extracted_features["url_length"] == len("https://example.com")

    async def test_scan_rejects_invalid_url(self, service: URLScannerService):
        with pytest.raises(URLValidationError):
            await service.scan("file:///etc/passwd", include_domain_intel=False)

    async def test_scan_blocks_internal_hosts_for_domain_intel(self, service: URLScannerService):
        with pytest.raises(URLValidationError):
            await service.scan("http://127.0.0.1:8000/admin", include_domain_intel=True)

    async def test_history_and_result_lookup(self, service: URLScannerService):
        result = await service.scan("https://example.com", include_domain_intel=False)
        history = service.get_history()
        assert history.total == 1
        assert history.items[0].scan_id == result.scan_id
        assert service.get_result(result.scan_id) is not None
        assert service.get_result("does-not-exist") is None

    async def test_health(self, service: URLScannerService):
        health = service.health()
        assert health.status == "healthy"


class TestURLScannerAPI:
    async def test_scan_endpoint(self, client):
        response = await client.post(
            "/api/url-scanner/scan",
            json={"url": "https://example.com", "include_domain_intel": False},
        )
        assert response.status_code == 200
        body = response.json()
        assert body["url"] == "https://example.com"
        assert "risk_percentage" in body
        assert "extracted_features" in body

    async def test_scan_endpoint_rejects_bad_scheme(self, client):
        response = await client.post(
            "/api/url-scanner/scan",
            json={"url": "file:///etc/passwd", "include_domain_intel": False},
        )
        assert response.status_code == 422

    async def test_scan_endpoint_rejects_localhost(self, client):
        response = await client.post(
            "/api/url-scanner/scan",
            json={"url": "http://localhost:8000/", "include_domain_intel": True},
        )
        assert response.status_code == 422

    async def test_scan_endpoint_rejects_empty(self, client):
        response = await client.post("/api/url-scanner/scan", json={"url": ""})
        assert response.status_code == 422

    async def test_history_endpoint(self, client):
        response = await client.get("/api/url-scanner/history")
        assert response.status_code == 200
        body = response.json()
        assert "total" in body and "items" in body

    async def test_result_not_found(self, client):
        response = await client.get("/api/url-scanner/result/nonexistent")
        assert response.status_code == 404

    async def test_health_endpoint(self, client):
        response = await client.get("/api/url-scanner/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
