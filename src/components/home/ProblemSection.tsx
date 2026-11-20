import { motion } from 'framer-motion';

export function ProblemSection() {
  return (
    <section className="problem-section" id="problem" aria-labelledby="problem-title">
      <div className="problem-inner">
        <motion.div
          className="problem-copy"
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow"><span className="eyebrow-dot" /> The reliability gap</p>
          <h2 id="problem-title">Fluent answers are not the same as factual answers.</h2>
          <p>AI systems can produce persuasive statements without understanding whether they are true. When every sentence sounds equally confident, the risk hides in plain sight.</p>
          <div className="problem-quote"><span className="quote-mark">&ldquo;</span><span>Confidence without evidence is just a convincing guess.</span></div>
        </motion.div>

        <motion.div
          className="problem-signal-card"
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="signal-card-header"><span className="demo-kicker">Unverified output</span><span className="signal-warning"><i /> Risk detected</span></div>
          <div className="signal-response"><span className="signal-avatar">AI</span><p>“The answer sounds complete, so it must be reliable.”</p></div>
          <div className="signal-divider"><span>Without verification</span></div>
          <div className="signal-outcomes">
            <div><span className="outcome-icon outcome-red">!</span><span><strong>Unsupported claims</strong><small>No evidence trail to inspect</small></span></div>
            <div><span className="outcome-icon outcome-amber">?</span><span><strong>Hidden uncertainty</strong><small>Ambiguous facts appear certain</small></span></div>
            <div><span className="outcome-icon outcome-gray">-</span><span><strong>Costly decisions</strong><small>Errors travel downstream</small></span></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
