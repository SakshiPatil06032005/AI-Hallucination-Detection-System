const faqs = [
  { question: 'What does HalluciDetect analyze?', answer: 'The planned product analyzes AI-generated responses at the claim level. It is designed to identify factual statements, compare them with retrieved evidence, and present an explainable classification.' },
  { question: 'Does a contradicted claim always mean the entire response is wrong?', answer: 'No. A response can contain a mix of supported, uncertain, contradicted, and unverifiable claims. The planned report keeps those judgments separate so reviewers can see exactly where the risk is.' },
  { question: 'How will evidence be shown?', answer: 'Each claim is intended to have an evidence panel containing the supporting context, source information, relevance, and confidence used to form the decision.' },
  { question: 'Is the current website connected to a backend?', answer: 'Not yet. The current experience uses mock data to demonstrate the product workflow. A FastAPI service can be connected later using the typed analysis result structure.' },
  { question: 'Can the system detect every hallucination?', answer: 'No verification system can guarantee that every error will be found. The intended design makes uncertainty visible and shows the evidence behind each classification instead of presenting certainty where evidence is incomplete.' },
];

export function FaqSection() {
  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <div className="faq-inner">
        <div className="faq-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Clear answers</p><h2 id="faq-title">Frequently asked questions.</h2><p>What the planned product is designed to do, and where the current mock experience stops.</p></div>
        <div className="faq-list">{faqs.map((faq, index) => <details className="faq-item" key={faq.question} open={index === 0}><summary><span>{faq.question}</span><b aria-hidden="true">+</b></summary><p>{faq.answer}</p></details>)}</div>
      </div>
    </section>
  );
}
