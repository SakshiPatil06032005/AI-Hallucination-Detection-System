import { motion } from 'framer-motion';
import { HeroAnalysisVisualization } from './HeroAnalysisVisualization';

export function HeroSection() {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-title">
      <div className="hero-inner">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <p className="eyebrow"><span className="eyebrow-dot" /> AI reliability infrastructure</p>
          <h1 id="hero-title">Detect AI Hallucinations Before They Become Misinformation.</h1>
          <p className="hero-subtitle">Analyze AI-generated responses, verify factual claims against evidence, and understand exactly why a response may be unreliable.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#analysis-demo">Analyze AI Response <span aria-hidden="true">-&gt;</span></a>
            <a className="secondary-button" href="#how-it-works">How It Works <span aria-hidden="true">&#8599;</span></a>
          </div>
          <div className="trust-indicators" aria-label="Product capabilities">
            <span><b className="trust-check">+</b> Claim-level verification</span>
            <span><b className="trust-check">+</b> Evidence-backed analysis</span>
            <span><b className="trust-check">+</b> Confidence scoring</span>
          </div>
        </motion.div>

        <HeroAnalysisVisualization />
      </div>
    </section>
  );
}
