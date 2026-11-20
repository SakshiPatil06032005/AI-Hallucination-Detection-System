import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { DetectionCategory } from '../../types/analysis';
import type { DetectResult } from '../../types/detect';
import { ClaimCard } from './ClaimCard';
import { EvidencePanel } from './EvidencePanel';

const labels: Record<DetectionCategory, string> = {
  supported: 'Supported',
  uncertain: 'Uncertain',
  contradicted: 'Contradicted',
  unverifiable: 'Unverifiable',
};

type Filter = 'all' | DetectionCategory;

export function AnalysisSummary({ result, onNew }: { result: DetectResult; onNew: () => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(result.claims[0]?.id ?? null);
  const selected = result.claims.find((claim) => claim.id === selectedId) ?? null;
  const counts = useMemo(() => result.claims.reduce<Record<DetectionCategory, number>>((acc, claim) => {
    acc[claim.category] += 1;
    return acc;
  }, { supported: 0, uncertain: 0, contradicted: 0, unverifiable: 0 }), [result]);
  const visible = result.claims.filter((claim) => (filter === 'all' || claim.category === filter) && claim.text.toLowerCase().includes(query.toLowerCase()));

  const download = () => {
    const report = `HalluciDetect Analysis Report\nReliability: ${result.reliabilityScore}%\nHallucination risk: ${result.hallucinationProbability}%\nDecision confidence: ${result.overallDecisionConfidence ?? 'Unavailable'}%\n\n${result.claims.map((claim) => `${claim.text}\n${labels[claim.category]} - Risk ${claim.hallucinationRisk ?? 'Unavailable'}% - Confidence ${claim.decisionConfidence ?? Math.round(claim.confidence * 100)}%\n${claim.evidence[0]?.text ?? 'No evidence available.'}`).join('\n\n')}`;
    const url = URL.createObjectURL(new Blob([report], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hallicudetect-analysis-report.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section className="detect-results" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="results-header">
        <div><span className="demo-kicker">{result.source === 'live' ? 'Live Backend Result' : 'Demo Result'}</span><h2>Analysis Results</h2><p>Analyzed {new Date(result.analyzedAt).toLocaleString()}</p></div>
        <div><button className="secondary-button" type="button" onClick={onNew}>New Analysis</button><button className="primary-button" type="button" onClick={download}>Download Report</button></div>
      </div>
      <div className="results-overview">
        <div className="detect-score-card"><span className="demo-kicker">Overall Reliability</span><div className="score-ring" style={{ '--score': `${result.reliabilityScore * 3.6}deg` } as CSSProperties}><strong>{result.reliabilityScore}<small>%</small></strong></div><b>{result.reliabilityScore >= 70 ? 'Mostly Reliable' : result.reliabilityScore >= 40 ? 'Uncertain' : 'High Risk'}</b><span>Hallucination risk: {result.hallucinationProbability}%</span><span>Decision confidence: {result.overallDecisionConfidence ?? 'Unavailable'}%</span><em>{result.source === 'live' ? 'Heuristic score' : 'Demo Result'}</em></div>
        <div className="summary-grid">{(['all', 'supported', 'uncertain', 'contradicted', 'unverifiable'] as const).map((key) => <div className={`summary-stat ${key}`} key={key}><strong>{key === 'all' ? result.claims.length : counts[key]}</strong><span>{key === 'all' ? 'Total Claims' : labels[key]}</span></div>)}</div>
      </div>
      <div className="result-workspace">
        <div className="claims-column">
          <div className="result-section-heading"><span>Claim-Level Analysis</span><span className="result-section-meta">{visible.length} shown</span></div>
          <div className="claim-toolbar"><div className="claim-filters">{(['all', 'supported', 'uncertain', 'contradicted', 'unverifiable'] as const).map((key) => <button className={filter === key ? 'active' : ''} type="button" key={key} onClick={() => setFilter(key)}>{key === 'all' ? 'All' : labels[key]} ({key === 'all' ? result.claims.length : counts[key]})</button>)}</div><input aria-label="Search claims" placeholder="Search claims" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
          <div className="claim-list">{visible.map((claim, index) => <ClaimCard key={claim.id} claim={claim} index={index} selected={claim.id === selectedId} onSelect={() => setSelectedId(claim.id)} />)}</div>
        </div>
        <EvidencePanel claim={selected} onClose={() => setSelectedId(null)} />
      </div>
      <div className="sources-strip"><span>Sources Checked</span><b>Knowledge Base</b><b>Web Evidence</b><b>Reference Documents</b><small>{result.source === 'live' ? 'Evidence returned by the verification backend.' : 'All sources shown are mock data.'}</small></div>
    </motion.section>
  );
}
