import type { AnalysisConfig, DetectResult } from '../types/detect';

interface ApiClaim {
  id: string;
  text: string;
  status: 'supported' | 'contradicted' | 'uncertain' | 'unverifiable';
  hallucinationRiskScore: number;
  decisionConfidence: number;
  explanation: string;
  evidence: ApiEvidence[];
}

interface ApiEvidence {
  text: string;
  url: string | null;
  relation: 'supports' | 'contradicts' | 'context';
}

interface AnalyzeResponse {
  analysisId: string;
  reliabilityScore: number;
  hallucinationRiskScore: number;
  decisionConfidence: number;
  scoreType: 'heuristic';
  totalClaims: number;
  claims: ApiClaim[];
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001').replace(/\/+$/, '');

function apiError(status: number, detail?: string): Error {
  if (status === 413) return new Error('The submitted text is too large for the backend.');
  if (status === 422) return new Error(detail || 'Please check the analysis input and settings.');
  if (status === 429) return new Error('The backend rate limit was reached. Please wait and try again.');
  if (status >= 500) return new Error('The analysis backend is temporarily unavailable. Please try again.');
  return new Error(detail || `Backend request failed (${status}).`);
}

export async function analyzeText(text: string, config: AnalysisConfig): Promise<DetectResult> {
  let preferences: { saveAnalysisHistory?: boolean; saveInputText?: boolean } = {};
  try {
    preferences = JSON.parse(localStorage.getItem('hallucidetect-profile-preferences') || '{}');
  } catch {
    preferences = {};
  }
  const mode = config.verificationMode === 'strict' ? 'deep' : 'standard';
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 65000);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        text,
        mode,
        evidence_source: config.evidenceSource,
        claim_granularity: config.claimGranularity,
        confidence_threshold: config.confidenceThreshold,
        save_history: preferences.saveAnalysisHistory !== false,
        save_input_text: preferences.saveInputText === true,
      }),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The analysis timed out. Please try again.');
    }
    throw new Error('The analysis backend could not be reached. Check that FastAPI is running and try again.');
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) {
    let detail = `Backend request failed (${response.status}).`;
    try {
      const body = await response.json() as { detail?: string; error?: string };
      detail = body.detail || body.error || detail;
    } catch {
      // Preserve the status-based error when the server did not return JSON.
    }
    throw apiError(response.status, detail);
  }

  const data = await response.json() as AnalyzeResponse;
  return {
    originalResponse: text,
    reliabilityScore: data.reliabilityScore,
    hallucinationProbability: data.hallucinationRiskScore,
    analyzedAt: new Date().toISOString(),
    overallDecisionConfidence: data.decisionConfidence,
    scoringMethodologyVersion: data.scoreType,
    source: 'live',
    claims: data.claims.map((claim, index) => ({
      id: claim.id || `claim-${index + 1}`,
      text: claim.text,
      category: claim.status,
      confidence: claim.decisionConfidence / 100,
      hallucinationRisk: claim.hallucinationRiskScore,
      decisionConfidence: claim.decisionConfidence,
      evidenceAvailability: claim.evidence.length ? 'available' : 'none',
      verificationReasoning: claim.explanation,
      explanation: claim.explanation,
      evidence: claim.evidence.map((item, itemIndex) => ({
        id: `${claim.id}-evidence-${itemIndex + 1}`,
        source: item.url || 'Retrieved evidence',
        sourceType: item.relation,
        relevanceScore: claim.decisionConfidence / 100,
        text: item.text,
        url: item.url || '',
      })),
    })),
  };
}
