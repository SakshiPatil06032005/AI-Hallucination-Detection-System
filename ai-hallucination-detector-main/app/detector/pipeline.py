import asyncio
import re
import time

from app.detector.citation_check import citation_score_async
from app.detector.claims import extract_claims
from app.detector.confidence import confidence_score
from app.detector.cross_model import cross_model_score_async
from app.detector.fact_check import fact_check_claims
from app.detector.logic_check import logic_score_async
from app.detector.scoring import (
    aggregate_claim_scores,
    compute_final_score,
    score_claim,
    SCORING_METHODOLOGY_VERSION,
)
from app.utils.timing import Timer

# Mode configuration -- this is what "Quick / Standard / Deep" actually
# does, kept explicit and centralized here so the behavior is easy to audit.
MODE_CONFIG = {
    "quick": {
        "max_concurrent_claims": 8,
        "use_web_search": False,   # KB-only fact checking, no network search
        "run_logic_check": False,  # skip the extra LLM call
        "run_cross_model": False,  # skip the two extra LLM calls
    },
    "standard": {
        "max_concurrent_claims": 5,
        "use_web_search": True,
        "run_logic_check": True,
        "run_cross_model": True,
    },
    "deep": {
        "max_concurrent_claims": 3,  # lower concurrency, gentler on rate limits
        "use_web_search": True,
        "run_logic_check": True,
        "run_cross_model": True,
    },
}


def _sentence_claims(answer: str) -> list[str]:
    return [part.strip() for part in re.split(r"(?<=[.!?])\s+", answer.strip()) if part.strip()]


async def run_detection(
    prompt: str,
    answer: str,
    mode: str = "standard",
    evidence_source: str = "both",
    claim_granularity: str = "claim",
) -> dict:
    cfg = MODE_CONFIG.get(mode, MODE_CONFIG["standard"])
    timer = Timer()
    wall_start = time.perf_counter()

    with timer.measure("claim_extraction_ms"):
        claims = (
            _sentence_claims(answer)
            if claim_granularity == "sentence"
            else await asyncio.to_thread(extract_claims, answer)
        )

    with timer.measure("confidence_ms"):
        confidence = confidence_score(answer)

    async def run_fact_check():
        with timer.measure("evidence_and_verification_ms"):
            # Evidence gathering and verification happen together per claim
            # (parallelized across claims) -- see fact_check.py. Not split
            # into separate evidence_ms/verification_ms buckets since that
            # would mean serializing what's currently concurrent work.
            return await fact_check_claims(
                claims,
                max_concurrent=cfg["max_concurrent_claims"],
                use_web_search=cfg["use_web_search"] and evidence_source in ("web", "both"),
                use_knowledge_base=evidence_source in ("knowledge-base", "both"),
            )

    async def run_logic():
        if not cfg["run_logic_check"]:
            return 1.0
        with timer.measure("logic_ms"):
            return await logic_score_async(answer)

    async def run_cross_model():
        if not cfg["run_cross_model"]:
            return 1.0
        with timer.measure("cross_model_ms"):
            return await cross_model_score_async(prompt)

    async def run_citations():
        with timer.measure("citation_ms"):
            return await citation_score_async(answer)

    # Independent of each other given the answer text -- run concurrently.
    (claim_reports, fact), logic, cross, (citation, citation_reports) = await asyncio.gather(
        run_fact_check(), run_logic(), run_cross_model(), run_citations()
    )

    scores = {
        "fact": fact,
        "logic": logic,
        "citation": citation,
        "confidence": confidence,
        "cross": cross,
    }

    with timer.measure("scoring_ms"):
        risk = compute_final_score(scores)

    enriched_claims = []
    for index, report in enumerate(claim_reports, start=1):
        claim_score = score_claim(report, logic_score=logic)
        evidence_items = report.get("evidence_items", [])
        is_contradicted = report.get("verdict") == "CONTRADICTED"
        enriched_claims.append(
            {
                **report,
                "claim_id": f"claim-{index}",
                "hallucination_risk": claim_score["hallucination_risk"],
                "decision_confidence": claim_score["decision_confidence"],
                "supporting_evidence": [] if is_contradicted else evidence_items,
                "contradicting_evidence": evidence_items if is_contradicted else [],
                "semantic_similarity_signals": [
                    item["semantic_similarity"]
                    for item in evidence_items
                    if item.get("semantic_similarity") is not None
                ],
                "evidence_availability": claim_score["evidence_availability"],
                "verification_reasoning": claim_score["verification_reasoning"],
                "signals": claim_score["signals"],
            }
        )

    aggregate = aggregate_claim_scores(enriched_claims)
    counts = {
        "supported": sum(c["verdict"] == "SUPPORTED" for c in enriched_claims),
        "contradicted": sum(c["verdict"] == "CONTRADICTED" for c in enriched_claims),
        "uncertain": sum(
            c["verdict"] in {"UNCERTAIN", "PARTIALLY_SUPPORTED"} for c in enriched_claims
        ),
        "unverifiable": sum(
            c["verdict"] in {"NO_RELEVANT_EVIDENCE", "INSUFFICIENT_EVIDENCE"}
            for c in enriched_claims
        ),
    }

    total_ms = (time.perf_counter() - wall_start) * 1000

    return {
        "risk_score": risk,
        **aggregate,
        "total_factual_claims": len(enriched_claims),
        "claim_counts": counts,
        "scoring_methodology_version": SCORING_METHODOLOGY_VERSION,
        "module_scores": scores,
        "claims": enriched_claims,
        "citations": citation_reports,
        "mode": mode,
        "latency": {
            "total_ms": round(total_ms, 1),
            **timer.as_dict(),
        },
    }
