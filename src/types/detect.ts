import type { DetectionCategory } from './analysis';

export type VerificationMode = 'standard' | 'strict';
export type EvidenceSource = 'knowledge-base' | 'web' | 'both';
export type ClaimGranularity = 'sentence' | 'claim';

export interface AnalysisConfig {
  verificationMode: VerificationMode;
  evidenceSource: EvidenceSource;
  claimGranularity: ClaimGranularity;
  confidenceThreshold: number;
}

export interface EvidenceItem {
  id: string;
  source: string;
  sourceType: string;
  relevanceScore: number;
  text: string;
  url: string;
}

export interface DetectClaim {
  id: string;
  text: string;
  category: DetectionCategory;
  confidence: number;
  explanation: string;
  evidence: EvidenceItem[];
  hallucinationRisk?: number;
  decisionConfidence?: number;
  supportingEvidence?: EvidenceItem[];
  contradictingEvidence?: EvidenceItem[];
  evidenceAvailability?: string;
  verificationReasoning?: string;
}

export interface DetectResult {
  originalResponse: string;
  reliabilityScore: number;
  hallucinationProbability: number;
  claims: DetectClaim[];
  analyzedAt: string;
  overallDecisionConfidence?: number;
  scoringMethodologyVersion?: string;
  source?: 'live' | 'demo';
}
