import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowDown, ArrowRight, BadgeCheck, BarChart3, BrainCircuit, CheckCircle2, CircleHelp, Database, FileCheck2,
  FileQuestion, FileSearch, Fingerprint, Gauge, GitCompareArrows, Globe2, Info, Layers3, Link2, MessageSquareQuote,
  Network, Search, Scale, ShieldCheck, Sparkles, Target, TriangleAlert, Workflow, XCircle, Zap,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

type Icon = LucideIcon;
type CardItem = { title: string; text: string; icon: Icon };

const motivations: CardItem[] = [
  { title: 'AI Is Becoming Everywhere', text: 'AI-generated content is increasingly used for education, research, software development, communication, and decision-making.', icon: Globe2 },
  { title: 'Fluency Does Not Mean Accuracy', text: 'An AI response can sound confident and well-written while still containing incorrect information.', icon: MessageSquareQuote },
  { title: 'Verification Takes Time', text: 'Manually checking every factual statement can be difficult and time-consuming.', icon: Search },
  { title: 'Users Need Explanations', text: 'A useful verification system should show evidence and reasoning instead of only displaying a warning.', icon: FileCheck2 },
];

const objectives: CardItem[] = [
  { title: 'Claim-Level Detection', text: 'Identify individual factual claims within AI-generated responses.', icon: Fingerprint },
  { title: 'Evidence Retrieval', text: 'Retrieve relevant information that can be used to verify claims.', icon: Database },
  { title: 'Semantic Verification', text: 'Compare the meaning of claims and evidence rather than relying only on keyword matching.', icon: GitCompareArrows },
  { title: 'Explainable Results', text: 'Show why a claim was classified as supported, uncertain, contradicted, or unverifiable.', icon: FileCheck2 },
  { title: 'Reliability Assessment', text: 'Provide an overall reliability estimate while preserving claim-level information.', icon: Gauge },
  { title: 'User-Friendly Interface', text: 'Present complex verification results in an understandable and interactive interface.', icon: Workflow },
];

const features: CardItem[] = [
  { title: 'Claim-Level Analysis', text: 'Break a response into factual units for more precise review.', icon: Layers3 },
  { title: 'Evidence-Based Verification', text: 'Connect verification decisions to retrieved evidence.', icon: Database },
  { title: 'Reliability Score', text: 'Summarize claim outcomes as an estimate of response reliability.', icon: ShieldCheck },
  { title: 'Hallucination Probability', text: 'Show the proportion of risk represented in an analyzed response.', icon: TriangleAlert },
  { title: 'Claim Classification', text: 'Use supported, uncertain, contradicted, and unverifiable statuses.', icon: BadgeCheck },
  { title: 'Evidence Visualization', text: 'Make source relationships easier to inspect and understand.', icon: BarChart3 },
  { title: 'Analysis History', text: 'Review previous response analyses and their claim-level results.', icon: FileSearch },
  { title: 'Analytics Dashboard', text: 'Explore trends across the current demo analysis history.', icon: BarChart3 },
  { title: 'Configurable Settings', text: 'Expose verification choices through the analysis workspace.', icon: Workflow },
  { title: 'Explainable Reports', text: 'Keep the evidence and reasoning visible alongside the result.', icon: FileCheck2 },
  { title: 'Responsive Interface', text: 'Support focused review across desktop, tablet, and mobile layouts.', icon: Globe2 },
  { title: 'Dark Mode', text: 'Preserve readable surfaces and contrast in the existing theme.', icon: Sparkles },
];

const stack = [
  ['Frontend', 'React · Vite · Framer Motion · Lucide React · Recharts', FileSearch, 'Current / demo'],
  ['Backend', 'Python · FastAPI', Network, 'Planned'],
  ['AI / NLP', 'Sentence Transformers · Semantic Embeddings · NLI · RAG', BrainCircuit, 'Planned'],
  ['Retrieval', 'FAISS · Chroma · Qdrant', Search, 'Planned'],
  ['Database', 'PostgreSQL · SQLAlchemy', Database, 'Planned'],
  ['Authentication', 'JWT', ShieldCheck, 'Planned'],
  ['Deployment', 'Docker', Workflow, 'Planned'],
];

const futureScope: CardItem[] = [
  { title: 'Real-Time Web Verification', text: 'Improve retrieval from trusted and current information sources.', icon: Globe2 },
  { title: 'Multi-Model Verification', text: 'Compare evidence and predictions across multiple language models.', icon: Network },
  { title: 'Source Credibility Scoring', text: 'Estimate the reliability of evidence sources.', icon: Scale },
  { title: 'Domain-Specific Verification', text: 'Optimize verification for healthcare, science, finance, education, and other domains.', icon: Target },
  { title: 'Multilingual Support', text: 'Extend claim detection and verification to multiple languages.', icon: MessageSquareQuote },
  { title: 'Continuous Evaluation', text: 'Evaluate the system against benchmark hallucination datasets.', icon: BarChart3 },
  { title: 'Browser / API Integration', text: 'Allow verification directly from applications that generate AI content.', icon: Link2 },
];

const researchAreas: CardItem[] = [
  { title: 'Natural Language Processing', text: 'Understanding and processing AI-generated text.', icon: BrainCircuit },
  { title: 'Information Retrieval', text: 'Finding relevant evidence for factual claims.', icon: Search },
  { title: 'Natural Language Inference', text: 'Determining whether evidence supports or contradicts a claim.', icon: GitCompareArrows },
  { title: 'Explainable AI', text: 'Presenting understandable reasons behind verification results.', icon: FileCheck2 },
];

const limitations = ['Evidence quality affects verification quality.', 'Relevant evidence may not always be retrieved.', 'Some claims may not have a clear true/false interpretation.', 'Semantic models may make incorrect judgments.', 'External sources can contain inaccurate or outdated information.', 'Specialized domains may require domain-specific verification strategies.'];
const roadmap = ['Research & Problem Definition', 'UI/UX & Frontend', 'Backend API', 'Claim Extraction', 'Evidence Retrieval', 'Semantic Verification', 'Analytics & Explainability', 'Evaluation & Deployment'];
const faqs = [
  ['What is an AI hallucination?', 'An AI hallucination is information generated with confidence that is false, unsupported, or not grounded in reliable evidence.'],
  ['Why do language models hallucinate?', 'Language models generate plausible continuations of text. Plausibility and fluency do not guarantee factual correctness.'],
  ['Does this system guarantee that information is correct?', 'No. It is designed as a verification assistant that provides evidence and estimates, not an unquestionable source of truth.'],
  ['How are claims verified?', 'The planned pipeline extracts claims, retrieves relevant evidence, compares meaning, and classifies the relationship.'],
  ['What does the reliability score mean?', 'It is an estimate that summarizes claim outcomes and confidence information for a response.'],
  ['What happens when no evidence is found?', 'The claim can be marked unverifiable instead of being treated as supported.'],
  ['Is this system a replacement for human verification?', 'No. Human judgment remains important, especially for ambiguous, specialized, or high-impact information.'],
  ['What technologies are used?', 'The current frontend uses React, Vite, Framer Motion, Lucide React, and Recharts. Backend and NLP services are planned.'],
  ['Can the system support different AI models?', 'The workflow is intended to be model-agnostic at the product level, though different models may require different handling.'],
  ['Is the project open source?', 'Open-source availability will depend on the project’s final release.'],
];

function SectionHeading({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) { return <div className="about-section-heading">{eyebrow && <p className="eyebrow"><span className="eyebrow-dot" /> {eyebrow}</p>}<h2>{title}</h2>{text && <p>{text}</p>}</div>; }
function StatusPill({ children }: { children: ReactNode }) { return <span className="about-status-pill">{children}</span>; }
function ArrowFlow({ items }: { items: string[] }) { return <div className="about-arrow-flow">{items.map((item, index) => <div key={item}><span>{index + 1}</span><strong>{item}</strong>{index < items.length - 1 && <ArrowDown size={15} />}</div>)}</div>; }

export function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return <div className="about-page"><Navbar /><main>
    <section className="about-hero"><div className="about-hero-inner"><motion.div className="about-hero-copy" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55 }}><p className="eyebrow"><span className="eyebrow-dot" /> About the project</p><h1>Making AI Responses More Reliable, Explainable, and Verifiable</h1><p>An AI-powered hallucination detection system designed to analyze AI-generated responses at the claim level, retrieve relevant evidence, and provide explainable verification results.</p><div className="about-hero-actions"><a className="primary-button" href="/detect"><Zap size={16} /> Try the Detector</a><a className="secondary-button" href="/how-it-works"><Workflow size={16} /> How It Works</a></div><span className="about-hero-note"><Info size={13} /> Final-year project · frontend demonstration</span></motion.div><motion.div className="about-hero-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .6, delay: .1 }}><div className="about-visual-head"><span className="window-dots"><i /><i /><i /></span><span>project_overview.demo</span><StatusPill>planned architecture</StatusPill></div><ArrowFlow items={['AI Response', 'Claims', 'Evidence', 'Verification', 'Reliable Insights']} /><div className="about-visual-foot"><span>claim-level analysis</span><b>evidence-aware</b></div></motion.div></div></section>

    <section className="about-introduction"><div className="about-wide about-intro-grid"><div><SectionHeading eyebrow="Project introduction" title="What Is This Project?" text="Large Language Models can generate highly fluent and convincing responses, but some responses may contain incorrect, unsupported, or fabricated information. These errors are commonly referred to as AI hallucinations." /><p className="about-lead-note">The goal is not simply to label an entire response as true or false, but to show which claims require attention and why.</p></div><div className="about-approach"><span className="about-approach-label">Our approach</span><ArrowFlow items={['Extract factual claims', 'Retrieve relevant evidence', 'Compare claim and evidence', 'Classify the relationship', 'Produce an explainable assessment']} /></div></div></section>

    <section className="about-motivation"><div className="about-wide"><SectionHeading eyebrow="The motivation" title="Why We Built This" text="AI-generated content is useful, but users need a practical way to examine the facts inside a fluent response." /><div className="about-card-grid four">{motivations.map(({ title, text, icon: Icon }, index) => <motion.article className="about-info-card" key={title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }}><span className="about-card-icon"><Icon size={19} /></span><h3>{title}</h3><p>{text}</p></motion.article>)}</div></div></section>

    <section className="about-problem"><div className="about-wide about-problem-layout"><SectionHeading eyebrow="Problem statement" title="The Problem" text="Modern generative AI systems can produce coherent and informative responses that still contain factual inaccuracies, fabricated details, unsupported claims, or outdated information. Users often lack an efficient way to identify and verify these claims." /><div className="about-problem-flow"><div><span>Input</span><strong>AI-generated response</strong></div><ArrowDown size={17} /><div><span>Problem</span><strong>Potentially incorrect claims</strong></div><ArrowDown size={17} /><div><span>Challenge</span><strong>Manual verification</strong></div><ArrowDown size={17} /><div className="goal"><span>Goal</span><strong>Automated evidence-based verification</strong></div></div></div></section>

    <section className="about-objectives"><div className="about-wide"><SectionHeading eyebrow="Project objectives" title="Our Objectives" text="The system is organized around precise claim analysis, transparent evidence, and a usable review experience." /><div className="about-objectives-grid">{objectives.map(({ title, text, icon: Icon }, index) => <motion.article key={title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }}><span className="about-objective-number">{String(index + 1).padStart(2, '0')}</span><span className="about-card-icon"><Icon size={18} /></span><h3>{title}</h3><p>{text}</p></motion.article>)}</div></div></section>

    <section className="about-explainability"><div className="about-wide"><SectionHeading eyebrow="The central idea" title="Designed for Explainability" text="Instead of treating hallucination detection as a simple binary classification problem, the system focuses on claim-level analysis and evidence." /><div className="about-comparison-grid"><article className="about-simple-approach"><span>Simple detection</span><ArrowFlow items={['Response', 'Hallucination: YES / NO']} /></article><article className="about-highlight-approach"><span>This system</span><ArrowFlow items={['Response', 'Claim Extraction', 'Evidence Retrieval', 'Semantic Verification', 'Claim Classification', 'Confidence', 'Explainable Report']} /></article></div></div></section>

    <section className="about-features"><div className="about-wide"><SectionHeading eyebrow="Product surface" title="Key Features" text="The current interface brings the planned verification experience together in a focused workspace." /><div className="about-card-grid four">{features.map(({ title, text, icon: Icon }, index) => <motion.article className="about-feature-card" key={title} initial={{ opacity: 0, y: 13 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index % 4 * .05 }}><span className="about-card-icon"><Icon size={17} /></span><h3>{title}</h3><p>{text}</p></motion.article>)}</div></div></section>

    <section className="about-process"><div className="about-wide"><div className="about-process-head"><SectionHeading eyebrow="A compact view" title="From Response to Verification" text="The full technical explanation is available on the How It Works page." /><a className="secondary-button" href="/how-it-works">Explore How It Works <ArrowRight size={15} /></a></div><div className="about-process-grid">{['Input', 'Claim Extraction', 'Query Generation', 'Evidence Retrieval', 'Semantic Verification', 'Classification', 'Reliability Score', 'Explainable Report'].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong><p>{['Accept the generated response.', 'Separate factual statements.', 'Prepare a focused retrieval query.', 'Find relevant configured evidence.', 'Compare meaning and relationship.', 'Assign an interpretable status.', 'Estimate response reliability.', 'Show evidence and reasoning.'][index]}</p></div>)}</div></div></section>

    <section className="about-stack"><div className="about-wide"><SectionHeading eyebrow="Implementation plan" title="Technology Stack" text="Technologies used or planned for building the system. Labels distinguish the current frontend demonstration from future services." /><div className="about-stack-grid">{stack.map(([label, value, Icon, status]) => <article key={label as string}><Icon size={18} /><div><span>{label as string}</span><strong>{value as string}</strong><StatusPill>{status as string}</StatusPill></div></article>)}</div></div></section>

    <section className="about-architecture"><div className="about-wide"><SectionHeading eyebrow="System architecture" title="A Simplified Architecture" text="This responsive diagram shows the intended flow from user input to explainable results. Backend and retrieval services are planned." /><div className="about-architecture-flow">{['User', 'React Frontend', 'FastAPI Backend', 'Claim Extraction', 'Verification Pipeline', 'Evidence Retrieval', 'Semantic Verification', 'Claim Classification', 'Reliability Scoring', 'Database', 'Explainable Results', 'User'].map((item, index) => <div key={`${item}-${index}`}><span>{index === 0 || index === 11 ? <MessageSquareQuote size={15} /> : index === 5 ? <Database size={15} /> : index === 6 ? <GitCompareArrows size={15} /> : <Workflow size={15} />}</span><strong>{item}</strong>{index === 5 && <small>Knowledge Base · Web Sources</small>}{index < 11 && <ArrowDown size={14} />}</div>)}</div></div></section>

    <section className="about-scope"><div className="about-wide"><SectionHeading eyebrow="Project status" title="Project Scope" text="These labels make it clear what the current interface demonstrates and what belongs to later implementation phases." /><div className="about-scope-grid"><article className="current"><StatusPill>Current / Demo</StatusPill><h3>Available in this interface</h3>{['Frontend interface', 'Analysis workflow', 'Mock detection results', 'History interface', 'Analytics visualization', 'Interactive explanation'].map((item) => <p key={item}><CheckCircle2 size={14} />{item}</p>)}</article><article className="planned"><StatusPill>Planned</StatusPill><h3>Next implementation layer</h3>{['FastAPI backend', 'Real claim extraction', 'Evidence retrieval', 'Semantic verification', 'Database persistence', 'Authentication', 'Real analytics'].map((item) => <p key={item}><ArrowRight size={14} />{item}</p>)}</article><article className="future"><StatusPill>Future</StatusPill><h3>Longer-term direction</h3>{['Multi-model verification', 'Source credibility scoring', 'Domain-specific verification', 'Advanced retrieval strategies', 'Continuous evaluation', 'API access'].map((item) => <p key={item}><Sparkles size={14} />{item}</p>)}</article></div></div></section>

    <section className="about-research"><div className="about-wide"><SectionHeading eyebrow="Academic motivation" title="Academic & Research Perspective" text="The project explores the intersection of Natural Language Processing, Retrieval-Augmented Generation, semantic similarity, Natural Language Inference, information retrieval, and explainable AI. It does not claim published research or experimental results." /><div className="about-card-grid four">{researchAreas.map(({ title, text, icon: Icon }) => <article className="about-info-card" key={title}><span className="about-card-icon"><Icon size={18} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="about-limitations"><div className="about-wide about-limitations-layout"><SectionHeading eyebrow="Academic honesty" title="Limitations" text="The system is not an absolute truth engine. Its usefulness depends on retrieval coverage, evidence quality, and the behavior of semantic models." /><div className="about-limitations-list">{limitations.map((item) => <p key={item}><TriangleAlert size={15} />{item}</p>)}<strong><Info size={15} /> The system should be viewed as a verification assistant rather than an unquestionable source of truth.</strong></div></div></section>

    <section className="about-future"><div className="about-wide"><SectionHeading eyebrow="Looking ahead" title="Future Scope" text="Future work can expand the breadth, freshness, and domain coverage of evidence-aware verification." /><div className="about-card-grid four">{futureScope.map(({ title, text, icon: Icon }) => <motion.article className="about-info-card" key={title} initial={{ opacity: 0, y: 13 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><span className="about-card-icon"><Icon size={18} /></span><h3>{title}</h3><p>{text}</p></motion.article>)}</div></div></section>

    <section className="about-roadmap"><div className="about-wide"><SectionHeading eyebrow="Project roadmap" title="From Research to Evaluation" text="A phase-based plan keeps the architecture grounded in achievable implementation steps. No dates are implied." /><div className="about-roadmap-grid">{roadmap.map((item, index) => <motion.div key={item} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }}><span>Phase {index + 1}</span><strong>{item}</strong>{index < roadmap.length - 1 && <i />}</motion.div>)}</div></div></section>

    <section className="about-team"><div className="about-wide about-team-grid"><div><SectionHeading eyebrow="Project team" title="About the Developer" text="Developer details were not included in the current project files, so this page intentionally avoids inventing a name, institution, profile, or achievement." /><div className="about-placeholder"><div className="about-avatar"><FileQuestion size={22} /></div><div><strong>[Developer Name]</strong><span>AI / ML & Full-Stack Development</span><p>Contribution details can be added when the project profile is finalized.</p></div></div></div><div className="about-info-panel"><h3>Project Information</h3><dl><div><dt>Project</dt><dd>AI Hallucination Detection System</dd></div><div><dt>Domain</dt><dd>Artificial Intelligence / NLP</dd></div><div><dt>Focus</dt><dd>AI Reliability & Hallucination Detection</dd></div><div><dt>Project Type</dt><dd>Final-Year Academic Project</dd></div><div><dt>Status</dt><dd>In Development</dd></div><div><dt>Version</dt><dd>0.1.0</dd></div></dl></div></div></section>

    <section className="about-faq"><div className="about-wide"><SectionHeading eyebrow="Questions" title="Frequently Asked Questions" text="Clear answers for users, evaluators, and future contributors." /><div className="about-faq-list">{faqs.map(([question, answer], index) => <div className={`about-faq-item${openFaq === index ? ' open' : ''}`} key={question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{question}</span><span aria-hidden="true">+</span></button>{openFaq === index && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>{answer}</motion.p>}</div>)}</div></div></section>

    <section className="about-final-cta"><div className="about-wide"><div><p className="eyebrow"><span className="eyebrow-dot" /> Explore the system</p><h2>Make AI Responses Easier to Trust.</h2><p>Analyze an AI-generated response and explore its claims, evidence, and verification results.</p></div><div><a className="primary-button" href="/detect"><Zap size={16} /> Analyze a Response</a><a className="secondary-button" href="/how-it-works"><Workflow size={16} /> Learn How It Works</a></div></div></section>
  </main><Footer /></div>;
}