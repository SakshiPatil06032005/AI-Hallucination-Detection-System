import type { DetectClaim } from '../types/detect';
import type { HistoryRecord } from '../types/history';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001').replace(/\/+$/, '');

interface ApiEvidence { text: string; url: string | null; relation: string }
interface ApiClaim { id: string; text: string; status: DetectClaim['category']; hallucinationRiskScore: number; decisionConfidence: number; explanation: string; evidence: ApiEvidence[] }
interface ApiHistoryRecord {
  id: string; title: string; preview: string; reliabilityScore: number; hallucinationProbability: number;
  totalClaims: number; supportedClaims: number; uncertainClaims: number; contradictedClaims: number;
  unverifiableClaims: number; status: HistoryRecord['status']; createdAt: string; sourceType: string;
  verificationMode: string; originalResponse: string; claims: ApiClaim[];
  inputSaved: boolean;
}

function mapClaim(claim: ApiClaim): DetectClaim {
  return {
    id: claim.id,
    text: claim.text,
    category: claim.status,
    confidence: claim.decisionConfidence / 100,
    hallucinationRisk: claim.hallucinationRiskScore,
    decisionConfidence: claim.decisionConfidence,
    explanation: claim.explanation,
    verificationReasoning: claim.explanation,
    evidenceAvailability: claim.evidence.length ? 'available' : 'none',
    evidence: claim.evidence.map((item, index) => ({
      id: `${claim.id}-evidence-${index + 1}`,
      source: item.url || 'Retrieved evidence',
      sourceType: item.relation,
      relevanceScore: claim.decisionConfidence / 100,
      text: item.text,
      url: item.url || '',
    })),
  };
}

function mapRecord(record: ApiHistoryRecord): HistoryRecord {
  return { ...record, claims: record.claims.map(mapClaim) };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } });
  if (!response.ok) throw new Error(`History request failed (${response.status}).`);
  return response.status === 204 ? undefined as T : await response.json() as T;
}

export async function getAnalysisHistory(): Promise<HistoryRecord[]> {
  return (await request<ApiHistoryRecord[]>('/api/history')).map(mapRecord);
}

export async function getAnalysisById(id: string): Promise<HistoryRecord | null> {
  try { return mapRecord(await request<ApiHistoryRecord>(`/api/history/${encodeURIComponent(id)}`)); } catch (error) {
    if (error instanceof Error && error.message.includes('(404)')) return null;
    throw error;
  }
}

export async function deleteAnalysis(id: string): Promise<HistoryRecord[]> {
  await request<void>(`/api/history/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return getAnalysisHistory();
}

export async function deleteAnalyses(ids: string[]): Promise<HistoryRecord[]> {
  return (await request<ApiHistoryRecord[]>('/api/history/delete', { method: 'POST', body: JSON.stringify(ids) })).map(mapRecord);
}

export async function clearAnalysisHistory(): Promise<void> {
  const records = await getAnalysisHistory();
  if (records.length) await deleteAnalyses(records.map((record) => record.id));
}
