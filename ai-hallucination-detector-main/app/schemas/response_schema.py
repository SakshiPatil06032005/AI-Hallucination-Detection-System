from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator, model_validator

MAX_PROMPT_CHARS = 4000


class Query(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=MAX_PROMPT_CHARS)
    mode: Literal["quick", "standard", "deep"] = "standard"

    @field_validator("prompt")
    @classmethod
    def prompt_must_not_be_blank(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("prompt must not be blank")
        return stripped


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    mode: Literal["quick", "standard", "deep"] = "standard"
    evidence_source: Literal["knowledge-base", "web", "both"] = "both"
    claim_granularity: Literal["sentence", "claim"] = "claim"
    confidence_threshold: int = Field(default=70, ge=0, le=100)
    save_history: bool = True
    save_input_text: bool = False

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("text must not be blank")
        return stripped


class Source(BaseModel):
    title: str | None = None
    url: str | None = None


class EvidenceItem(BaseModel):
    text: str
    source_type: str
    title: str | None = None
    url: str | None = None
    semantic_similarity: float | None = Field(default=None, ge=0, le=1)


class ClaimReport(BaseModel):
    claim_id: str
    claim: str
    verdict: str
    score: float = Field(ge=0, le=1)
    evidence: str | None = None
    sources: list[Source] = Field(default_factory=list)
    error: str | None = None
    hallucination_risk: int = Field(ge=0, le=100)
    decision_confidence: int = Field(ge=0, le=100)
    supporting_evidence: list[EvidenceItem] = Field(default_factory=list)
    contradicting_evidence: list[EvidenceItem] = Field(default_factory=list)
    semantic_similarity_signals: list[float] = Field(default_factory=list)
    verification_reasoning: str
    evidence_availability: str
    signals: dict[str, float | None] = Field(default_factory=dict)


class CitationReport(BaseModel):
    type: str
    text: str
    verdict: str


class AnalysisResponse(BaseModel):
    answer: str
    risk_score: int = Field(ge=0, le=100)
    overall_reliability: int = Field(ge=0, le=100)
    overall_hallucination_risk: int = Field(ge=0, le=100)
    overall_decision_confidence: int = Field(ge=0, le=100)
    total_factual_claims: int = Field(ge=0)
    claim_counts: dict[str, int]
    analysis_summary: str
    scoring_methodology_version: str
    module_scores: dict[str, float]
    claims: list[ClaimReport]
    citations: list[CitationReport]
    mode: str
    evidence_source: str | None = None
    claim_granularity: str | None = None
    confidence_threshold: int | None = Field(default=None, ge=0, le=100)
    latency: dict[str, Any]


class PublicEvidence(BaseModel):
    text: str
    url: str | None = None
    relation: Literal["supports", "contradicts", "context"] = "context"


class PublicClaim(BaseModel):
    id: str
    text: str
    status: Literal["supported", "contradicted", "uncertain", "unverifiable"]
    hallucinationRiskScore: int = Field(ge=0, le=100)
    decisionConfidence: int = Field(ge=0, le=100)
    explanation: str
    evidence: list[PublicEvidence] = Field(default_factory=list)


class PublicAnalysisResponse(BaseModel):
    analysisId: str
    reliabilityScore: int = Field(ge=0, le=100)
    hallucinationRiskScore: int = Field(ge=0, le=100)
    decisionConfidence: int = Field(ge=0, le=100)
    scoreType: Literal["heuristic"] = "heuristic"
    totalClaims: int = Field(ge=0)
    supportedClaims: int = Field(ge=0)
    contradictedClaims: int = Field(ge=0)
    uncertainClaims: int = Field(ge=0)
    unverifiableClaims: int = Field(ge=0)
    claims: list[PublicClaim]

    @model_validator(mode="after")
    def counts_match_claims(self) -> "PublicAnalysisResponse":
        counts = {
            "supported": self.supportedClaims,
            "contradicted": self.contradictedClaims,
            "uncertain": self.uncertainClaims,
            "unverifiable": self.unverifiableClaims,
        }
        actual = {
            status: sum(claim.status == status for claim in self.claims)
            for status in counts
        }
        if self.totalClaims != len(self.claims) or counts != actual:
            raise ValueError("claim totals and classification counts must match claims")
        return self


class HistoryRecordResponse(BaseModel):
    id: str
    title: str
    preview: str
    reliabilityScore: int
    hallucinationProbability: int
    totalClaims: int
    supportedClaims: int
    uncertainClaims: int
    contradictedClaims: int
    unverifiableClaims: int
    status: str
    createdAt: str
    sourceType: str
    verificationMode: str
    originalResponse: str
    inputSaved: bool
    claims: list[PublicClaim]


class AnalyticsResponse(BaseModel):
    totalAnalyses: int
    averageReliability: float
    hallucinationRate: float
    claimsVerified: int
    reliabilityTrend: list[dict[str, Any]]
    claimBreakdown: list[dict[str, Any]]
    records: list[HistoryRecordResponse]
