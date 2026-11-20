import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { createMockAnalysis, mockAnalysisResult } from '../../data/mockAnalysis';
import type { AnalysisClaim, AnalysisResult, DetectionCategory } from '../../types/analysis';

const analysisStages = [
  'Extracting claims...',
  'Searching evidence...',
  'Comparing evidence...',
  'Calculating confidence...',
  'Analysis complete',
];

const categoryLabels: Record<DetectionCategory, string> = {
  supported: 'Supported',
  uncertain: 'Uncertain',
  contradicted: 'Contradicted',
  unverifiable: 'Unverifiable',
};

const categoryColors: Record<DetectionCategory, string> = {
  supported: 'supported',
  uncertain: 'uncertain',
  contradicted: 'contradicted',
  unverifiable: 'unverifiable',
};

function getClaimCounts(claims: AnalysisClaim[]) {
  return claims.reduce<Record<DetectionCategory, number>>((counts, claim) => {
    counts[claim.category] += 1;
    return counts;
  }, { supported: 0, uncertain: 0, contradicted: 0, unverifiable: 0 });
}

function HighlightedResponse({ analysis, selectedClaimId, onSelectClaim }: { analysis: AnalysisResult; selectedClaimId: string | null; onSelectClaim: (claimId: string) => void }) {
  let cursor = 0;
  const fragments = analysis.claims.flatMap((claim) => {
    const start = analysis.originalResponse.indexOf(claim.text, cursor);
    if (start < 0) return [];
    const before = analysis.originalResponse.slice(cursor, start);
    cursor = start + claim.text.length;
    return [
      before,
      <button className={`claim-highlight ${categoryColors[claim.category]} ${selectedClaimId === claim.id ? 'is-selected' : ''}`} key={claim.id} type="button" onClick={() => onSelectClaim(claim.id)}>
        {claim.text}
      </button>,
    ];
  });

  return <p className="highlighted-response">{[...fragments, analysis.originalResponse.slice(cursor)]}</p>;
}

export function AnalysisDemo() {
  const [response, setResponse] = useState(mockAnalysisResult.originalResponse);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [stageIndex, setStageIndex] = useState(-1);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const runId = useRef(0);

  const analyzeResponse = async () => {
    const currentRun = ++runId.current;
    setAnalysis(null);
    setSelectedClaimId(null);
    setStageIndex(0);

    for (let index = 1; index < analysisStages.length; index += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 580));
      if (currentRun !== runId.current) return;
      setStageIndex(index);
    }

    await new Promise((resolve) => window.setTimeout(resolve, 380));
    if (currentRun !== runId.current) return;
    const mockResult = createMockAnalysis(response);
    setAnalysis(mockResult);
    setSelectedClaimId(mockResult.claims[0].id);
  };

  const selectedClaim = analysis?.claims.find((claim) => claim.id === selectedClaimId) ?? null;
  const counts = analysis ? getClaimCounts(analysis.claims) : null;
  const isAnalyzing = stageIndex >= 0 && !analysis;

  return (
    <section className="demo-section" id="analysis-demo" aria-labelledby="analysis-demo-title">
      <div className="demo-heading">
        <p className="eyebrow"><span className="eyebrow-dot" /> Interactive verification workspace</p>
        <h2 id="analysis-demo-title">See exactly where an AI response holds up.</h2>
        <p>Paste a response, run a mock verification, and inspect every claim against its evidence.</p>
      </div>

      <div className="demo-workspace">
        <div className="response-input-panel">
          <div className="demo-panel-header">
            <div><span className="demo-kicker">Input</span><h3>AI-generated response</h3></div>
            <span className="character-count">{response.length} characters</span>
          </div>
          <textarea
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            placeholder="Paste an AI-generated response to begin..."
            aria-label="AI-generated response"
            disabled={isAnalyzing}
          />
          <div className="input-footer">
            <span className="input-hint">Mock analysis uses a fixed evidence set.</span>
            <button className="analyze-button" type="button" onClick={analyzeResponse} disabled={isAnalyzing || !response.trim()}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze Response'} <span aria-hidden="true">-&gt;</span>
            </button>
          </div>
        </div>

        <div className="analysis-stage-panel">
          <div className="demo-panel-header">
            <div><span className="demo-kicker">Pipeline</span><h3>Verification progress</h3></div>
            <span className={`pipeline-status ${isAnalyzing ? 'is-running' : analysis ? 'is-complete' : ''}`}><i /> {analysis ? 'Ready' : isAnalyzing ? 'Running' : 'Idle'}</span>
          </div>
          <div className="stage-list" aria-live="polite" aria-atomic="false">
            {analysisStages.map((stage, index) => {
              const isComplete = stageIndex > index || Boolean(analysis && index === analysisStages.length - 1);
              const isCurrent = stageIndex === index && !analysis;
              return (
                <div className={`demo-stage ${isComplete ? 'is-complete' : ''} ${isCurrent ? 'is-current' : ''}`} key={stage}>
                  <span className="demo-stage-marker">{isComplete ? '+' : String(index + 1).padStart(2, '0')}</span>
                  <span>{stage}</span>
                  {isCurrent && <motion.span className="stage-pulse" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} />}
                </div>
              );
            })}
          </div>
          <div className="pipeline-note"><span aria-hidden="true">i</span> Results are generated from a local mock response.</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {analysis && counts && (
          <motion.div className="result-dashboard" aria-live="polite" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="result-dashboard-header">
              <div><span className="demo-kicker">Analysis report</span><h3>Claim-level verification</h3></div>
              <span className="report-ready"><i /> Analysis complete</span>
            </div>
            <div className="result-summary">
              <div className="reliability-score"><span className="demo-kicker">Reliability score</span><strong>{analysis.reliabilityScore}<small>%</small></strong><span>Based on {analysis.claims.length} extracted claims</span></div>
              <div className="claim-counts">
                {(['supported', 'uncertain', 'contradicted'] as DetectionCategory[]).map((category) => (
                  <div className="count-item" key={category}><span className={`count-dot ${categoryColors[category]}`} /><strong>{counts[category]}</strong><span>{categoryLabels[category]}</span></div>
                ))}
              </div>
            </div>
            <div className="result-columns">
              <div className="original-response-panel"><div className="result-section-heading"><span>Original response</span><span className="result-section-meta">Click a highlight to inspect</span></div><HighlightedResponse analysis={analysis} selectedClaimId={selectedClaimId} onSelectClaim={setSelectedClaimId} /><div className="highlight-legend">{(['supported', 'uncertain', 'contradicted', 'unverifiable'] as DetectionCategory[]).map((category) => <span key={category}><i className={categoryColors[category]} /> {categoryLabels[category]}</span>)}</div></div>
              <EvidencePanel claim={selectedClaim} onSelectClaim={setSelectedClaimId} claims={analysis.claims} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


function EvidencePanel({ claim, claims, onSelectClaim }: { claim: AnalysisClaim | null; claims: AnalysisClaim[]; onSelectClaim: (claimId: string) => void }) {
  return (
    <div className="evidence-panel">
      <div className="result-section-heading"><span>Evidence inspector</span><span className="result-section-meta">{claims.length} claims</span></div>
      <div className="claim-selector-list">{claims.map((item) => <button className={`claim-selector ${item.id === claim?.id ? 'is-selected' : ''}`} key={item.id} type="button" onClick={() => onSelectClaim(item.id)}><i className={categoryColors[item.category]} /><span>{item.text}</span><b>&#8599;</b></button>)}</div>
      {claim && <motion.div className="evidence-detail" key={claim.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
        <div className="evidence-detail-status"><span className={`status-pill ${categoryColors[claim.category]}`}>{categoryLabels[claim.category]}</span><span className="confidence-value">{Math.round(claim.confidence * 100)}% confidence</span></div>
        <dl><div><dt>Claim</dt><dd>{claim.text}</dd></div><div><dt>Evidence</dt><dd>{claim.evidence}</dd></div><div><dt>Source</dt><dd>{claim.source}</dd></div><div><dt>Relevance score</dt><dd><span className="relevance-bar"><i style={{ width: `${claim.relevanceScore * 100}%` }} /></span>{Math.round(claim.relevanceScore * 100)}%</dd></div></dl>
      </motion.div>}
    </div>
  );
}
