export type DetectionCategory =
  | 'supported'
  | 'uncertain'
  | 'contradicted'
  | 'unverifiable';

export interface AnalysisClaim {
  id: string;
  text: string;
  category: DetectionCategory;
  confidence: number;
  evidence: string;
  source: string;
  relevanceScore: number;
}

export interface AnalysisResult {
  originalResponse: string;
  reliabilityScore: number;
  claims: AnalysisClaim[];
}
