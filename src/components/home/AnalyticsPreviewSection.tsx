import { motion } from 'framer-motion';

const trendBars = [42, 57, 49, 68, 61, 76, 72, 84, 78, 91, 86, 94];
const verdicts = [
  { label: 'Supported', value: '48%', tone: 'supported' },
  { label: 'Uncertain', value: '19%', tone: 'uncertain' },
  { label: 'Contradicted', value: '21%', tone: 'contradicted' },
  { label: 'Unverifiable', value: '12%', tone: 'unverifiable' },
];

export function AnalyticsPreviewSection() {
  return (
    <section className="analytics-section" id="analytics" aria-labelledby="analytics-title">
      <div className="analytics-inner">
        <div className="analytics-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> Observability layer</p><h2 id="analytics-title">See patterns across every analyzed response.</h2></div><span className="mock-data-badge"><i /> Illustrative mock data</span></div>
        <p className="analytics-description">A future analytics view can help teams understand where uncertainty accumulates, which topics need review, and how evidence-backed responses change over time.</p>
        <motion.div className="analytics-dashboard" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5 }}>
          <div className="analytics-dashboard-top"><div><span className="dashboard-kicker">Demo workspace</span><h3>Verification overview</h3></div><span className="dashboard-period">Sample period: 12 weeks</span></div>
          <div className="analytics-main-grid">
            <div className="trend-panel"><div className="trend-panel-heading"><span>Reliability trend</span><span className="trend-value">+18% <small>illustrative</small></span></div><div className="chart-area"><div className="chart-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-bars">{trendBars.map((height, index) => <motion.span key={`${height}-${index}`} initial={{ height: 0 }} whileInView={{ height: `${height}%` }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.04 }}><i /></motion.span>)}</div></div><div className="chart-x-labels"><span>Week 1</span><span>Week 6</span><span>Week 12</span></div></div>
            <div className="verdict-panel"><div className="trend-panel-heading"><span>Claim distribution</span><span className="mock-label">Demo only</span></div><div className="verdict-list">{verdicts.map((verdict) => <div className="verdict-row" key={verdict.label}><span className={`verdict-dot ${verdict.tone}`} /><span>{verdict.label}</span><strong>{verdict.value}</strong></div>)}</div><div className="verdict-total"><span>Illustrative claims analyzed</span><strong>1,248</strong></div></div>
          </div>
          <div className="analytics-dashboard-footer"><span><i /> No live system data connected</span><span>FastAPI metrics connection planned</span></div>
        </motion.div>
      </div>
    </section>
  );
}
