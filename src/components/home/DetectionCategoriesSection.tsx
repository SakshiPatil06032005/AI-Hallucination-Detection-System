import { motion } from 'framer-motion';
import type { DetectionCategory } from '../../types/analysis';

const categories: Array<{ category: DetectionCategory; title: string; description: string; example: string }> = [
  { category: 'supported', title: 'Supported', description: 'The evidence agrees with the claim and provides a clear basis for trust.', example: 'Evidence confirms the statement.' },
  { category: 'uncertain', title: 'Uncertain', description: 'The claim may be plausible, but the available evidence is incomplete or ambiguous.', example: 'More context is needed.' },
  { category: 'contradicted', title: 'Contradicted', description: 'Reliable evidence conflicts with what the AI response says.', example: 'Evidence directly disagrees.' },
  { category: 'unverifiable', title: 'Unverifiable', description: 'The claim cannot be responsibly confirmed from the evidence that was retrieved.', example: 'No reliable source found.' },
];

export function DetectionCategoriesSection() {
  return (
    <section className="categories-section" id="detection-categories" aria-labelledby="categories-title">
      <div className="categories-inner">
        <div className="categories-heading">
          <p className="eyebrow"><span className="eyebrow-dot" /> Transparent verdicts</p>
          <h2 id="categories-title">Every claim gets a clear classification.</h2>
          <p>HalluciDetect replaces a vague pass or fail with an explainable status that shows what the evidence actually says.</p>
        </div>
        <div className="category-grid">
          {categories.map((item, index) => (
            <motion.article
              className={`category-card ${item.category}`}
              key={item.category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
            >
              <div className="category-card-top"><span className="category-symbol">{item.category === 'supported' ? '+' : item.category === 'uncertain' ? '?' : item.category === 'contradicted' ? '!' : '-'}</span><span className="category-index">0{index + 1}</span></div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="category-example"><span />{item.example}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
