import { InfoCard } from './InfoCard';

const features = [
  { icon: 'CL', title: 'Claim-level analysis', description: 'Break a response into individual statements so each fact can be reviewed independently.', tone: 'blue' as const },
  { icon: 'EV', title: 'Evidence retrieval', description: 'Connect claims to relevant sources instead of returning an unexplained confidence label.', tone: 'green' as const },
  { icon: 'SC', title: 'Semantic comparison', description: 'Compare meaning and context, not just matching words, when evaluating a claim.', tone: 'amber' as const },
  { icon: 'ER', title: 'Explainable reports', description: 'Give reviewers a clear path from the original response to the final detection result.', tone: 'gray' as const },
  { icon: 'CS', title: 'Confidence scoring', description: 'Represent how strongly the available evidence supports each classification.', tone: 'blue' as const },
  { icon: 'AR', title: 'Audit-ready results', description: 'Keep decisions structured so teams can inspect, compare, and learn from analysis.', tone: 'green' as const },
];

export function FeaturesSection() {
  return (
    <section className="features-section" id="features" aria-labelledby="features-title">
      <div className="features-inner">
        <div className="features-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Built for verification</p><h2 id="features-title">A clearer way to work with AI-generated answers.</h2><p>Every capability is designed around the same goal: make an AI response easier to inspect, challenge, and trust.</p></div>
        <div className="info-card-grid">{features.map((feature, index) => <InfoCard key={feature.title} {...feature} index={`0${index + 1}`} />)}</div>
      </div>
    </section>
  );
}
