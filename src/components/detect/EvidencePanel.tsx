import { motion } from 'framer-motion';
import type { DetectClaim } from '../../types/detect';

const labels = { supported: '✓ Supported', uncertain: '⚠ Uncertain', contradicted: '✕ Contradicted', unverifiable: '− Unverifiable' };

export function EvidencePanel({ claim, onClose }: { claim: DetectClaim | null; onClose: () => void }) {
  if (!claim) return <aside className="detect-evidence-panel empty"><span>Select a claim to inspect its evidence.</span></aside>;
  return <motion.aside className="detect-evidence-panel" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} key={claim.id}>
    <div className="evidence-panel-top"><div><span className="demo-kicker">{claim.evidence.length ? 'Backend Evidence' : 'Evidence Status'}</span><h2>Claim Verification</h2></div><button type="button" onClick={onClose} aria-label="Close evidence panel">×</button></div>
    <div className="evidence-status-row"><span className={`claim-status ${claim.category}`}>{labels[claim.category]}</span><strong>{claim.decisionConfidence ?? Math.round(claim.confidence * 100)}% decision confidence</strong></div>
    <dl className="evidence-facts"><div><dt>Claim</dt><dd>{claim.text}</dd></div><div><dt>Why?</dt><dd>{claim.explanation}</dd></div><div><dt>Hallucination risk</dt><dd>{claim.hallucinationRisk ?? Math.round((1 - claim.confidence) * 100)}%</dd></div></dl>
    <div className="comparison-flow"><span>Claim</span><b>↓</b><span>Retrieved evidence</span><b>↓</b><span>Verification</span><strong>{claim.category === 'contradicted' ? 'Contradiction' : claim.category === 'supported' ? 'Support' : 'Needs review'}</strong><b>↓</b><span>Final decision</span></div>
    {claim.evidence.length ? claim.evidence.map((evidence) => <div className="evidence-item" key={evidence.id}><div className="evidence-source-row"><span>{evidence.sourceType}</span><strong>{evidence.source}</strong><b>{Math.round(evidence.relevanceScore * 100)}% relevance</b></div><p>{evidence.text}</p>{evidence.url ? <small>Source: {evidence.url}</small> : <small>No source URL was returned.</small>}<div className="evidence-actions">{evidence.url && <a href={evidence.url} target="_blank" rel="noreferrer">View Source</a>}<button type="button" onClick={() => navigator.clipboard?.writeText(evidence.text)}>Copy Evidence</button></div></div>) : <div className="evidence-item"><p>No useful evidence was returned for this claim. The classification remains {claim.category}.</p></div>}
  </motion.aside>;
}
