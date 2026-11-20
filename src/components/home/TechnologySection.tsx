import { motion } from 'framer-motion';

const architectureLayers = [
  { label: 'Input layer', title: 'AI response', detail: 'A response enters as text for claim-level analysis.', tone: 'blue' },
  { label: 'Understanding layer', title: 'Claim extraction', detail: 'Individual factual statements are identified and structured.', tone: 'green' },
  { label: 'Evidence layer', title: 'Retrieval + verification', detail: 'Relevant evidence is compared with each claim semantically.', tone: 'amber' },
  { label: 'Output layer', title: 'Explainable report', detail: 'Statuses, confidence, and source context form the final view.', tone: 'gray' },
];

export function TechnologySection() {
  return (
    <section className="technology-section" id="technology" aria-labelledby="technology-title">
      <div className="technology-inner">
        <div className="technology-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Planned system architecture</p><h2 id="technology-title">A transparent architecture for verification.</h2><p>The planned system separates language understanding, evidence retrieval, and reporting so every decision has a visible path back to the original claim.</p></div>
        <motion.div className="architecture-board" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5 }}>
          <div className="architecture-board-header"><div><span className="dashboard-kicker">Conceptual system map</span><h3>HalluciDetect verification layers</h3></div><span className="architecture-status"><i /> Planned flow</span></div>
          <div className="architecture-layers">{architectureLayers.map((layer, index) => <div className="architecture-layer" key={layer.title}><div className={`architecture-layer-marker ${layer.tone}`}><span>0{index + 1}</span></div><div><span className="architecture-label">{layer.label}</span><h4>{layer.title}</h4><p>{layer.detail}</p></div>{index < architectureLayers.length - 1 && <span className="architecture-arrow" aria-hidden="true">-&gt;</span>}</div>)}</div>
          <div className="architecture-board-footer"><span><i>i</i> Conceptual representation only</span><span>Backend services will be connected in a later phase.</span></div>
        </motion.div>
      </div>
    </section>
  );
}
