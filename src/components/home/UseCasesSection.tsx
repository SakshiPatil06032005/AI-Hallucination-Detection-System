import { InfoCard } from './InfoCard';

const useCases = [
  { icon: 'RS', title: 'Research teams', description: 'Review generated summaries and surface claims that need a source check before publication.', tone: 'blue' as const },
  { icon: 'CX', title: 'AI product teams', description: 'Add a reasoning layer to assistants where answer quality matters as much as response speed.', tone: 'green' as const },
  { icon: 'ED', title: 'Education', description: 'Help learners distinguish a well-written answer from one supported by reliable evidence.', tone: 'amber' as const },
  { icon: 'OP', title: 'Operations', description: 'Create a review trail for AI-assisted decisions that need a human-readable explanation.', tone: 'gray' as const },
];

export function UseCasesSection() {
  return (
    <section className="use-cases-section" id="use-cases" aria-labelledby="use-cases-title">
      <div className="use-cases-inner">
        <div className="use-cases-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Where it fits</p><h2 id="use-cases-title">For teams that depend on accurate answers.</h2><p>Different workflows, same need: know which parts of an AI response deserve confidence and which need a closer look.</p></div>
        <div className="use-case-grid">{useCases.map((useCase, index) => <InfoCard key={useCase.title} {...useCase} index={`0${index + 1}`}><a className="use-case-link" href="#analysis-demo">Explore workflow <span aria-hidden="true">-&gt;</span></a></InfoCard>)}</div>
      </div>
    </section>
  );
}
