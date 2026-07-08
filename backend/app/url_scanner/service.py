"""URL Scanner service — ML risk scoring + domain intelligence.

Ported from the standalone ThreatLens URL Scanner (FastAPI + XGBoost).
The XGBoost model is loaded lazily at startup; if the model or its
dependencies are unavailable the service falls back to the original
heuristic scoring so the endpoint keeps working.
"""

import asyncio
import logging
import socket
import ssl
import uuid
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from app.url_scanner.features import extract_features
from app.url_scanner.schemas import (
    DomainIntelligence,
    ScanHistoryEntry,
    ScanHistoryResponse,
    ScannerHealth,
    ScanResult,
)
from app.url_scanner.security import (
    URLValidationError,
    normalize_and_validate_url,
    validate_host_for_network_lookup,
)

logger = logging.getLogger(__name__)

ASSETS_DIR = Path(__file__).resolve().parent / "assets"
MODEL_PATH = ASSETS_DIR / "model.pkl"
FEATURES_PATH = ASSETS_DIR / "feature_columns.pkl"

NETWORK_TIMEOUT = 5.0


class URLScannerService:
    """Analyzes URLs with the bundled XGBoost model and live domain lookups."""

    def __init__(self, history_size: int = 200) -> None:
        self._model = None
        self._feature_columns: list[str] | None = None
        self._model_load_attempted = False
        self._history: deque[ScanResult] = deque(maxlen=history_size)
        self._results: dict[str, ScanResult] = {}
        self._scans_performed = 0

    # ------------------------------------------------------------------
    # Model loading
    # ------------------------------------------------------------------
    def _ensure_model(self) -> None:
        if self._model_load_attempted:
            return
        self._model_load_attempted = True
        try:
            import joblib  # noqa: PLC0415 — optional heavy dependency

            self._model = joblib.load(MODEL_PATH)
            self._feature_columns = list(joblib.load(FEATURES_PATH))
            logger.info(
                "URL Scanner model loaded (%s, %d features)",
                type(self._model).__name__,
                len(self._feature_columns),
            )
        except Exception as exc:  # model missing / version mismatch / dep missing
            self._model = None
            self._feature_columns = None
            logger.warning("URL Scanner ML model unavailable, using heuristic scoring: %s", exc)

    @property
    def model_loaded(self) -> bool:
        self._ensure_model()
        return self._model is not None

    # ------------------------------------------------------------------
    # Risk scoring
    # ------------------------------------------------------------------
    def _score_with_model(self, features: dict) -> float | None:
        if self._model is None or not self._feature_columns:
            return None
        try:
            import pandas as pd  # noqa: PLC0415

            frame = pd.DataFrame([features]).reindex(columns=self._feature_columns, fill_value=0)
            proba = self._model.predict_proba(frame)[0]
            # predict_proba returns [P(class 0), P(class 1)].
            # For this model class 0 = malicious, class 1 = benign.
            # Use sigmoid margin directly for finer discrimination:
            # margin = log(P(1)/P(0)) — more negative = more malicious.
            margin = float(self._model.predict(frame, output_margin=True)[0])
            # Map margin (typical range -15 to -5) to a 0–100 risk.
            # |margin| / 15 * 100 gives reasonable relative ranking.
            return min(100.0, max(0.0, (abs(margin) / 15.0) * 100.0))
        except Exception as exc:
            logger.warning("URL Scanner model inference failed, falling back to heuristic: %s", exc)
            return None

    @staticmethod
    def _score_heuristic(features: dict) -> float:
        """Rule-based URL risk assessment using all 41 extracted features.

        Complements the ML model by scoring social-engineering signals,
        suspicious patterns, and structural anomalies the model may underweight.
        Returns a risk percentage 0–100.
        """
        risk = 10.0  # baseline low

        # --- Social-engineering signals (model underweights these) ---
        if features["suspicious_keyword_count"] > 0:
            risk += features["suspicious_keyword_count"] * 18.0
        if features["brand_keyword_count"] > 0:
            risk += features["brand_keyword_count"] * 10.0
        if features["suspicious_tld"] == 1:
            risk += 20.0
        if features["url_shortener"] == 1:
            risk += 25.0
        if features["has_at_symbol"] == 1:
            risk += 30.0

        # --- Protocol / transport ---
        if features["http"] == 1 and features["https"] == 0:
            risk += 12.0

        # --- Host anomalies ---
        if features["ip_address"] == 1:
            risk += 25.0
        if features["subdomain_count"] >= 3:
            risk += 15.0
        if features["domain_has_digits"] == 1:
            risk += 6.0

        # --- Path / query anomalies ---
        if features["double_slash_count"] > 1:
            risk += 10.0
        if features["percent_count"] > 3:
            risk += 12.0
        if features["equal_count"] > 3:
            risk += 8.0
        if features["question_count"] > 2:
            risk += 6.0
        if features["has_port"] == 1:
            risk += 8.0

        # --- Token / entropy ---
        if features["entropy"] > 4.5:
            risk += 10.0
        if features["max_token_length"] > 35:
            risk += 8.0

        # --- Structural extremes ---
        if features["digit_ratio"] > 0.5:
            risk += 10.0
        if features["letter_ratio"] < 0.3:
            risk += 12.0

        return min(risk, 100.0)

    @staticmethod
    def _verdict_for(risk: float) -> tuple[str, str]:
        if risk >= 75:
            return "Malicious Threat Flagged", "danger"
        if risk >= 40:
            return "Suspicious Metrics Found", "warning"
        return "Verified Clean URL", "safe"

    # ------------------------------------------------------------------
    # Domain intelligence (WHOIS / DNS / IP / SSL) — blocking, run in a thread
    # ------------------------------------------------------------------
    @staticmethod
    def _domain_intelligence_sync(domain: str) -> DomainIntelligence:
        intel = DomainIntelligence()

        try:
            import whois  # noqa: PLC0415 — optional dependency

            info = whois.whois(domain)
            intel.whois_status = "Available"
            if info.registrar:
                intel.registrar = str(info.registrar)
            creation = info.creation_date
            if isinstance(creation, list):
                creation = creation[0] if creation else None
            if creation:
                years = (datetime.now() - creation).days // 365
                intel.age = f"{years} Years"
            expiry = info.expiration_date
            if isinstance(expiry, list):
                expiry = expiry[0] if expiry else None
            if expiry:
                intel.expiration_date = expiry.strftime("%d %b %Y")
        except Exception as exc:
            logger.debug("WHOIS lookup failed for %s: %s", domain, exc)

        try:
            import dns.resolver  # noqa: PLC0415 — optional dependency

            resolver = dns.resolver.Resolver()
            resolver.lifetime = NETWORK_TIMEOUT
            answers = resolver.resolve(domain, "A")
            intel.dns_record_count = len(answers)
        except Exception as exc:
            logger.debug("DNS lookup failed for %s: %s", domain, exc)

        try:
            intel.ip_address = socket.gethostbyname(domain)
        except Exception as exc:
            logger.debug("IP lookup failed for %s: %s", domain, exc)

        try:
            context = ssl.create_default_context()
            with socket.create_connection((domain, 443), timeout=NETWORK_TIMEOUT) as sock:
                with context.wrap_socket(sock, server_hostname=domain):
                    intel.ssl_valid = True
        except Exception as exc:
            logger.debug("SSL check failed for %s: %s", domain, exc)
            intel.ssl_valid = False

        return intel

    async def _domain_intelligence(self, url: str) -> DomainIntelligence | None:
        parsed = urlparse(url)
        domain = (parsed.hostname or "").removeprefix("www.")
        if not domain:
            return None
        # SSRF guard — never probe internal hosts or private ranges.
        validate_host_for_network_lookup(domain)
        return await asyncio.to_thread(self._domain_intelligence_sync, domain)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    async def scan(self, raw_url: str, include_domain_intel: bool = True) -> ScanResult:
        """Validate, feature-extract, score, and optionally enrich a URL."""
        url = normalize_and_validate_url(raw_url)

        features = extract_features(url)

        self._ensure_model()
        model_risk = await asyncio.to_thread(self._score_with_model, features)
        heuristic_risk = self._score_heuristic(features)
        model_used = model_risk is not None
        # The model underweights social-engineering signals (keywords, brand
        # names, suspicious TLDs) while the heuristic specialises in them.
        # Model gives ~50% baseline for clean URLs — only its excess over 50
        # represents genuine risk signal, applied as bonus on top of heuristic.
        if model_risk is not None:
            model_excess = max(0.0, model_risk - 50.0)
            risk = min(100.0, heuristic_risk + model_excess)
        else:
            risk = heuristic_risk
        verdict, status_class = self._verdict_for(risk)

        domain_intel: DomainIntelligence | None = None
        if include_domain_intel:
            try:
                domain_intel = await self._domain_intelligence(url)
            except URLValidationError:
                raise
            except Exception as exc:
                logger.warning("Domain intelligence failed for %s: %s", url, exc)

        result = ScanResult(
            scan_id=uuid.uuid4().hex[:12],
            url=url,
            risk_percentage=round(risk, 2),
            verdict=verdict,
            status_class=status_class,
            model_used=model_used,
            extracted_features=features,
            domain_intelligence=domain_intel,
            scanned_at=datetime.now(timezone.utc),
        )

        self._history.appendleft(result)
        self._results[result.scan_id] = result
        # Keep the result map bounded to the history window.
        while len(self._results) > self._history.maxlen:
            oldest_ids = set(self._results) - {r.scan_id for r in self._history}
            if not oldest_ids:
                break
            for scan_id in oldest_ids:
                self._results.pop(scan_id, None)
        self._scans_performed += 1
        return result

    def get_result(self, scan_id: str) -> ScanResult | None:
        return self._results.get(scan_id)

    def get_history(self, limit: int = 50) -> ScanHistoryResponse:
        items = [
            ScanHistoryEntry(
                scan_id=r.scan_id,
                url=r.url,
                risk_percentage=r.risk_percentage,
                verdict=r.verdict,
                status_class=r.status_class,
                scanned_at=r.scanned_at,
            )
            for r in list(self._history)[:limit]
        ]
        return ScanHistoryResponse(total=len(self._history), items=items)

    def health(self) -> ScannerHealth:
        self._ensure_model()
        return ScannerHealth(
            status="healthy",
            model_loaded=self._model is not None,
            feature_count=len(self._feature_columns) if self._feature_columns else 0,
            scans_performed=self._scans_performed,
        )
