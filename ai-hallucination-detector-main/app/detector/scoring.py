"""Transparent heuristic scoring for claim and response verification.

Claim risk and decision confidence are intentionally separate:

* Risk estimates how concerning the available verification result is.
* Confidence estimates how much relevant, credible, and independent evidence
  supports the decision.

These are heuristic signals, not calibrated probabilities. The methodology
version must change when formulas or thresholds change.
"""

from __future__ import annotations

from math import isfinite
from urllib.parse import urlparse

"""Combines module-level signals (0.0-1.0 each, higher = better/safer) into
a single risk score (0-100, higher = riskier).

IMPORTANT: DEFAULT_WEIGHTS below are HEURISTIC, chosen by intuitive
priority (fact-checking matters most, logic/citation/confidence/cross
roughly equal), NOT statistically validated against a labeled dataset.
Until an evaluation dataset exists and these are calibrated against it
(see the planned evaluation framework), treat the risk score as a
relative signal for comparing answers, not a calibrated probability of
"this answer is wrong."
"""

DEFAULT_WEIGHTS = {
    "fact": 0.35,
    "logic": 0.20,
    "citation": 0.15,
    "confidence": 0.15,
    "cross": 0.15,
}

SCORING_METHODOLOGY_VERSION = "claim-heuristic-v1"

_VERDICT_SUPPORT = {
    "SUPPORTED": 1.0,
    "PARTIALLY_SUPPORTED": 0.65,
    "CONTRADICTED": 0.0,
    "UNCERTAIN": 0.5,
    "NO_RELEVANT_EVIDENCE": 0.5,
    "INSUFFICIENT_EVIDENCE": 0.5,
}


def _bounded(value: float, default: float = 0.0) -> float:
    return max(0.0, min(1.0, value)) if isfinite(value) else default


def _source_credibility(item: dict) -> float:
    if item.get("source_type") == "LOCAL KNOWLEDGE BASE":
        return 0.9
    host = urlparse(item.get("url") or "").hostname or ""
    if host.endswith((".gov", ".edu")):
        return 0.9
    if host.endswith(".org"):
        return 0.75
    return 0.6 if host else 0.35


def score_claim(report: dict, logic_score: float = 1.0) -> dict:
    """Return claim risk/confidence and explainable signal breakdown.

    Risk is ``100 * (1 - support_signal)``. With no useful evidence, the
    verdict remains uncertain/unverifiable and risk is neutral at 50 rather
    than being treated as proof of hallucination.

    Confidence is based on evidence availability, average source credibility,
    semantic relevance when available, independent-source agreement, and the
    response-level logic signal. Semantic similarity is never used as a
    correctness decision by itself.
    """
    verdict = str(report.get("verdict", "UNCERTAIN"))
    items = report.get("evidence_items") or []
    useful = report.get("evidence_availability") == "available" and bool(items)
    support_signal = _VERDICT_SUPPORT.get(verdict, 0.5)

    if not useful:
        confidence = 0.15 if verdict in {"INSUFFICIENT_EVIDENCE", "NO_RELEVANT_EVIDENCE"} else 0.25
        risk = 50
        evidence_status = "none" if not items else "irrelevant"
        semantic_relevance = None
        source_credibility = None
        agreement = 0.0
    else:
        similarities = [
            _bounded(float(item["semantic_similarity"]))
            for item in items
            if item.get("semantic_similarity") is not None
        ]
        semantic_relevance = sum(similarities) / len(similarities) if similarities else None
        source_credibility = sum(_source_credibility(item) for item in items) / len(items)
        source_keys = {
            item.get("url") or item.get("source_type") for item in items
        }
        agreement = 1.0 if len(source_keys) >= 2 else 0.65
        relevance_signal = semantic_relevance if semantic_relevance is not None else 0.6
        confidence = (
            0.35 * source_credibility
            + 0.25 * relevance_signal
            + 0.25 * agreement
            + 0.15 * _bounded(float(logic_score))
        )
        risk = round(100 * (1 - support_signal))
        evidence_status = "available"

    if verdict == "CONTRADICTED" and useful:
        risk = 100
    return {
        "hallucination_risk": max(0, min(100, int(risk))),
        "decision_confidence": max(0, min(100, round(confidence * 100))),
        "evidence_availability": evidence_status,
        "signals": {
            "evidence_support": support_signal,
            "evidence_contradiction": 1.0 if verdict == "CONTRADICTED" else 0.0,
            "semantic_relevance": semantic_relevance,
            "source_credibility": source_credibility,
            "source_agreement": agreement,
            "logical_consistency": _bounded(float(logic_score)),
        },
        "verification_reasoning": report.get("verification_reasoning")
        or "Classification was produced from the available verification signals.",
    }


def aggregate_claim_scores(claims: list[dict]) -> dict:
    """Aggregate claim risk using confidence floors for missing evidence.

    Each claim contributes at least 0.25 weight so an unverifiable claim
    cannot disappear from the overall result. Empty claim sets return a
    neutral risk and zero decision confidence.
    """
    if not claims:
        return {
            "overall_hallucination_risk": 50,
            "overall_reliability": 50,
            "overall_decision_confidence": 0,
        }
    weights = [max(0.25, _bounded(c["decision_confidence"] / 100)) for c in claims]
    total = sum(weights)
    risk = round(sum(c["hallucination_risk"] * w for c, w in zip(claims, weights)) / total)
    confidence = round(sum(c["decision_confidence"] * w for c, w in zip(claims, weights)) / total)
    return {
        "overall_hallucination_risk": max(0, min(100, risk)),
        "overall_reliability": 100 - max(0, min(100, risk)),
        "overall_decision_confidence": max(0, min(100, confidence)),
    }


def compute_final_score(scores: dict, weights: dict | None = None) -> int:
    weights = weights or DEFAULT_WEIGHTS

    missing = set(weights) - set(scores)
    if missing:
        raise ValueError(f"scores missing required keys: {missing}")

    weight_sum = sum(weights.values())
    if abs(weight_sum - 1.0) > 1e-6:
        raise ValueError(f"scoring weights must sum to 1.0, got {weight_sum}")

    for key in weights:
        value = scores[key]
        if not isinstance(value, (int, float)) or not isfinite(value) or not 0 <= value <= 1:
            raise ValueError(f"score {key!r} must be a finite number between 0 and 1")

    final = sum(weights[k] * scores[k] for k in weights)
    risk = int(round((1 - final) * 100))
    return max(0, min(100, risk))
