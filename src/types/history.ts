import type { DetectClaim, DetectResult } from './detect';

export type HistoryStatus = 'Reliable' | 'Mostly Reliable' | 'Uncertain' | 'High Risk';
export type HallucinationLevel = 'low' | 'medium' | 'high';

export interface HistoryRecord {
  id: string;
  title: string;
  preview: string;
  reliabilityScore: number;
  hallucinationProbability: number;
  totalClaims: number;
  supportedClaims: number;
  uncertainClaims: number;
  contradictedClaims: number;
  unverifiableClaims: number;
  status: HistoryStatus;
  createdAt: string;
  sourceType: string;
  verificationMode: string;
  claims: DetectClaim[];
  originalResponse: string;
  inputSaved?: boolean;
}

export type HistoryResult = HistoryRecord | null;
export type HistoryDetailResult = DetectResult;
