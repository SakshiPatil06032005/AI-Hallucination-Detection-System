import { motion } from 'framer-motion';

const stages = ['Claim Extraction', 'Evidence Retrieval', 'Verification'];

export function HeroAnalysisVisualization() {
  return (
    <motion.div
      id="analysis-demo"
      className="analysis-visualization"
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
      aria-label="Example AI response analysis"
    >
      <div className="analysis-window-bar">
        <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="window-title">Live verification</span>
        <span className="live-indicator"><i /> Mock analysis</span>
      </div>

      <div className="analysis-content">
        <div className="analysis-response">
          <div className="panel-label"><span className="panel-icon response-icon">AI</span> AI Response <span className="panel-meta">1 claim detected</span></div>
          <p className="response-text">&ldquo;The Earth has two natural satellites.&rdquo;</p>
        </div>

        <div className="analysis-flow" aria-label="Analysis pipeline">
          {stages.map((stage, index) => (
            <motion.div
              className="flow-stage"
              key={stage}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + index * 0.18, duration: 0.35 }}
            >
              <span className="stage-status"><i /></span>
              <span>{stage}</span>
              {index < stages.length - 1 && <span className="stage-line" aria-hidden="true" />}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="verification-result"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.45 }}
        >
          <div className="result-heading">
            <div className="panel-label"><span className="panel-icon result-icon">!</span> Detection Result</div>
            <span className="result-badge">Contradicted</span>
          </div>
          <div className="result-grid">
            <div>
              <span className="result-label">Analyzed claim</span>
              <p className="claim-text">The Earth has two natural satellites.</p>
            </div>
            <div className="confidence-block">
              <span className="result-label">Confidence</span>
              <strong>98%</strong>
              <div className="confidence-track"><motion.span initial={{ width: 0 }} animate={{ width: '98%' }} transition={{ delay: 1.55, duration: 0.6 }} /></div>
            </div>
          </div>
          <div className="evidence-box">
            <span className="evidence-label"><span aria-hidden="true">&#8594;</span> Evidence retrieved</span>
            <p>&ldquo;Earth has one known natural satellite, the Moon.&rdquo;</p>
            <span className="evidence-source">Astronomical reference source <span aria-hidden="true">&#8599;</span></span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}