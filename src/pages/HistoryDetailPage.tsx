import { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { AnalysisSummary } from '../components/detect/AnalysisSummary';
import { getAnalysisById } from '../services/historyService';
import type { HistoryRecord } from '../types/history';

export function HistoryDetailPage({ id }: { id: string }) {
  const [record, setRecord] = useState<HistoryRecord | null | undefined>(undefined);
  useEffect(() => { void getAnalysisById(id).then(setRecord); }, [id]);
  if (record === undefined) return <div className="history-page"><Navbar /><main className="history-main"><div className="history-detail-loading">Loading analysis...</div></main></div>;
  if (!record) return <div className="history-page"><Navbar /><main className="history-main"><div className="history-error"><span>!</span><h2>Analysis not found</h2><p>This history record is no longer available.</p><a className="primary-button" href="/history">Back to History</a></div></main></div>;
  return <div className="history-page"><Navbar /><main className="history-main"><a className="history-back-link" href="/history">&lt;- Back to Analysis History</a><div className="history-detail-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Previous analysis</p><h1>{record.title}</h1><p>{record.preview}</p>{record.inputSaved === false && <small>The original input was not saved by your privacy preference.</small>}</div><AnalysisSummary result={{ originalResponse: record.originalResponse, reliabilityScore: record.reliabilityScore, hallucinationProbability: record.hallucinationProbability, claims: record.claims, analyzedAt: record.createdAt }} onNew={() => { window.location.href = '/detect'; }} /></main></div>;
}
