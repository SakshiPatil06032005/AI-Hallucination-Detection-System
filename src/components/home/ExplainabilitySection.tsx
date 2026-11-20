import { motion } from 'framer-motion';

export function ExplainabilitySection() {
  return (
    <section className="explainability-section" id="explainability" aria-labelledby="explainability-title">
      <div className="explainability-inner">
        <motion.div
          className="explainability-intro"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
        >
          <p className="eyebrow"><span className="eyebrow-dot" /> Evidence you can inspect</p>
          <h2 id="explainability-title">We don&apos;t just flag claims. <span>We show why.</span></h2>
          <p>Every detection is connected to the evidence and reasoning that produced it, so a reviewer can move from a claim to a decision without guessing what happened in between.</p>
        </motion.div>

        <div className="explainability-visual" aria-label="Claim to evidence to decision explanation">
          <motion.div className="explainability-column claim-column" initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45 }}>
            <span className="explainability-label">01 / Claim</span>
            <div className="explainability-card claim-explain-card"><span className="explainability-card-icon">AI</span><span className="explainability-card-title">Statement under review</span><p>&ldquo;The Great Wall of China is visible from the Moon.&rdquo;</p><span className="claim-tag">Extracted claim</span></div>
          </motion.div>

          <motion.div className="explainability-bridge" aria-hidden="true" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.4, delay: 0.2 }}><span className="bridge-line" /><span className="bridge-label">compared against</span><span className="bridge-arrow">-&gt;</span></motion.div>

          <motion.div className="explainability-column evidence-column" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: 0.12 }}>
            <span className="explainability-label">02 / Evidence</span>
            <div className="explainability-card evidence-explain-card"><div className="source-row"><span className="source-icon">S</span><span><strong>Source evidence</strong><small>Reference context retrieved</small></span><span className="source-check">+</span></div><p>Researchers and astronauts have confirmed that the Great Wall is not visible to the naked eye from the Moon.</p><div className="evidence-match"><span>Semantic match</span><strong>0.96</strong></div></div>
          </motion.div>

          <motion.div className="explainability-bridge second-bridge" aria-hidden="true" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.4, delay: 0.38 }}><span className="bridge-line" /><span className="bridge-label">reasoned decision</span><span className="bridge-arrow">-&gt;</span></motion.div>

          <motion.div className="explainability-column decision-column" initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, delay: 0.24 }}>
            <span className="explainability-label">03 / Decision</span>
            <div className="explainability-card decision-explain-card"><div className="decision-header"><span className="decision-status">Contradicted</span><span className="decision-confidence">98% confidence</span></div><strong className="decision-title">Claim needs correction</strong><p>The evidence conflicts with the generated statement.</p><div className="decision-footer"><span>Reliability impact</span><strong>-12 points</strong></div></div>
          </motion.div>
        </div>

        <div className="explainability-footnote"><span className="footnote-icon">i</span><span>The evidence chain makes each result reviewable: what was said, what was found, and how the decision was reached.</span></div>
      </div>
    </section>
  );
}
