import pytest

from app.detector.scoring import aggregate_claim_scores, score_claim


def test_clearly_supported_claim_has_low_risk_and_evidence_confidence():
    result = score_claim(
        {
            "verdict": "SUPPORTED",
            "evidence_availability": "available",
            "evidence_items": [
                {
                    "source_type": "LOCAL KNOWLEDGE BASE",
                    "semantic_similarity": 0.95,
                    "url": None,
                },
                {
                    "source_type": "WEB SOURCE",
                    "semantic_similarity": None,
                    "url": "https://www.example.gov/fact",
                },
            ],
            "verification_reasoning": "Direct evidence supports the claim.",
        }
    )
    assert result["hallucination_risk"] == 0
    assert result["decision_confidence"] >= 70


def test_clearly_contradicted_claim_has_high_risk():
    result = score_claim(
        {
            "verdict": "CONTRADICTED",
            "evidence_availability": "available",
            "evidence_items": [
                {
                    "source_type": "WEB SOURCE",
                    "semantic_similarity": None,
                    "url": "https://www.example.edu/fact",
                }
            ],
        }
    )
    assert result["hallucination_risk"] == 100
    assert result["decision_confidence"] >= 50


def test_missing_evidence_is_not_scored_as_hallucinated():
    result = score_claim(
        {
            "verdict": "INSUFFICIENT_EVIDENCE",
            "evidence_availability": "none",
            "evidence_items": [],
        }
    )
    assert result["hallucination_risk"] == 50
    assert result["decision_confidence"] < 30


def test_conflicting_evidence_remains_separate_from_confidence():
    result = score_claim(
        {
            "verdict": "UNCERTAIN",
            "evidence_availability": "available",
            "evidence_items": [
                {"source_type": "WEB SOURCE", "semantic_similarity": 0.8, "url": "https://a.org"},
                {"source_type": "WEB SOURCE", "semantic_similarity": 0.8, "url": "https://b.org"},
            ],
        }
    )
    assert result["hallucination_risk"] == 50
    assert 0 < result["decision_confidence"] < 100


def test_multiple_claims_are_aggregated_and_countable():
    claims = [
        {"hallucination_risk": 0, "decision_confidence": 90},
        {"hallucination_risk": 100, "decision_confidence": 80},
        {"hallucination_risk": 50, "decision_confidence": 15},
    ]
    aggregate = aggregate_claim_scores(claims)
    assert aggregate["overall_hallucination_risk"] == 47
    assert aggregate["overall_reliability"] == 53


def test_invalid_module_score_is_rejected():
    from app.detector.scoring import compute_final_score

    with pytest.raises(ValueError):
        compute_final_score(
            {"fact": 2, "logic": 1, "citation": 1, "confidence": 1, "cross": 1}
        )


def test_external_verification_failure_can_be_unverifiable():
    result = score_claim(
        {
            "verdict": "UNCERTAIN",
            "evidence_availability": "none",
            "evidence_items": [],
            "verification_reasoning": "Verifier failed before evidence could be assessed.",
        }
    )
    assert result["hallucination_risk"] == 50
    assert "failed" in result["verification_reasoning"]
