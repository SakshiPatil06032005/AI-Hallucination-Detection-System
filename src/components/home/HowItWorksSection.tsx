import { motion } from 'framer-motion';

const pipelineStages = [
  { number: '01', title: 'AI Response', description: 'A generated response enters the planned verification flow.', marker: 'AI' },
  { number: '02', title: 'Claim Extraction', description: 'The response is separated into individual factual claims.', marker: 'CL' },
  { number: '03', title: 'Evidence Retrieval', description: 'Relevant sources are identified for each claim.', marker: 'EV' },
  { number: '04', title: 'Semantic Verification', description: 'Claim meaning is compared with the retrieved evidence.', marker: 'SV' },
  { number: '05', title: 'Hallucination Detection', description: 'Each claim receives an interpretable detection status.', marker: 'HD' },
  { number: '06', title: 'Reliability Report', description: 'The result is assembled into an explainable report.', marker: 'RR' },
];

export function HowItWorksSection() {
  return (
    <section className="how-it-works-section" id="how-it-works" aria-labelledby="how-it-works-title">
      <div className="how-it-works-inner">
        <div className="how-it-works-heading">
          <p className="eyebrow"><span className="eyebrow-dot" /> Planned verification architecture</p>
          <h2 id="how-it-works-title">From generated response to explainable result.</h2>
          <p>This conceptual pipeline shows how the planned system will turn an AI response into claim-level evidence and a transparent reliability report.</p>
        </div>

        <div className="pipeline-track" aria-label="Conceptual hallucination detection pipeline">
          {pipelineStages.map((stage, index) => (
            <div className="pipeline-item" key={stage.title}>
              <motion.article
                className="pipeline-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.42, delay: index * 0.08 }}
              >
                <div className="pipeline-card-top"><span className="pipeline-marker">{stage.marker}</span><span className="pipeline-number">{stage.number}</span></div>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </motion.article>
              {index < pipelineStages.length - 1 && (
                <motion.div
                  className="pipeline-connector"
                  aria-hidden="true"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.35, delay: 0.18 + index * 0.08 }}
                >
                  <span />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <div className="pipeline-note-banner"><span className="pipeline-note-icon">i</span><span><strong>Conceptual representation</strong> This section describes the planned architecture. It does not imply that these services are connected yet.</span></div>
      </div>
    </section>
  );
}
