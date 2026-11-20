import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DetectHeader } from '../components/detect/DetectHeader';
import { InputWorkspace } from '../components/detect/InputWorkspace';
import { AnalysisProgress } from '../components/detect/AnalysisProgress';
import { AnalysisSummary } from '../components/detect/AnalysisSummary';
import { EmptyState } from '../components/detect/EmptyState';
import { defaultAnalysisConfig } from '../data/detectMock';
import { analyzeText } from '../services/analysisApi';
import type { AnalysisConfig, DetectResult } from '../types/detect';

export function DetectPage() {
  const [text, setText] = useState('');
  const [config, setConfig] = useState<AnalysisConfig>(defaultAnalysisConfig);
  const [result, setResult] = useState<DetectResult | null>(null);
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(-1);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!text.trim()) { setError('Please enter AI-generated content before starting the analysis.'); return; }
    if (text.length > 10000) { setError('Your input exceeds the 10,000 character limit.'); return; }
    setError(''); setRunning(true); setResult(null); setStage(0);
    const interval = window.setInterval(() => setStage((value) => Math.min(value + 1, 6)), 240);
    try { const nextResult = await analyzeText(text, config); window.clearInterval(interval); setStage(6); setResult(nextResult); } catch (analysisError) { window.clearInterval(interval); setStage(6); setError(analysisError instanceof Error ? analysisError.message : "We couldn't complete the analysis. Please try again."); } finally { setRunning(false); }
  };

  const newAnalysis = () => { setResult(null); setStage(-1); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return <div className="detect-page" id="top"><header className="detect-topbar"><a className="brand" href="/"><span className="brand-mark" aria-hidden="true">H</span><span>HalluciDetect</span></a><a className="detect-home-link" href="/">Back to Home <span aria-hidden="true">-&gt;</span></a></header><main className="detect-main"><DetectHeader /><InputWorkspace text={text} config={config} onTextChange={setText} onConfigChange={setConfig} onAnalyze={analyze} running={running} onExample={(example) => { setText(example); setError(''); }} />{error && <div className="detect-error" role="alert"><b>!</b>{error}</div>}<AnimatePresence mode="wait">{running ? <AnalysisProgress stage={stage} /> : result ? <AnalysisSummary result={result} onNew={newAnalysis} /> : <EmptyState />}</AnimatePresence></main></div>;
}
