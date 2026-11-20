import { motion } from 'framer-motion';

const stages = ['Reading input', 'Extracting claims', 'Generating verification queries', 'Retrieving evidence', 'Comparing claims with evidence', 'Calculating confidence', 'Generating report'];
export function AnalysisProgress({ stage }: { stage: number }) {
  return <div className="detect-progress" aria-live="polite"><div className="progress-heading"><div><span className="demo-kicker">Processing</span><h2>Analyzing your response...</h2></div><span>{Math.min(100, Math.round(((stage + 1) / stages.length) * 100))}%</span></div><div className="progress-track"><motion.i animate={{ width: `${Math.min(100, ((stage + 1) / stages.length) * 100)}%` }} /></div><div className="progress-stages">{stages.map((item, index) => <div className={index < stage ? 'done' : index === stage ? 'active' : ''} key={item}><b>{index < stage ? '✓' : index === stage ? '●' : '○'}</b><span>{item}{index === stage ? '...' : ''}</span></div>)}</div></div>;
}
