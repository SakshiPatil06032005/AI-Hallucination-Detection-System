import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { AnalysisDemo } from '../components/home/AnalysisDemo';
import { ProblemSection } from '../components/home/ProblemSection';
import { DetectionCategoriesSection } from '../components/home/DetectionCategoriesSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { ExplainabilitySection } from '../components/home/ExplainabilitySection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { UseCasesSection } from '../components/home/UseCasesSection';
import { AnalyticsPreviewSection } from '../components/home/AnalyticsPreviewSection';
import { TechnologySection } from '../components/home/TechnologySection';
import { FaqSection } from '../components/home/FaqSection';
import { FinalCtaSection } from '../components/home/FinalCtaSection';
import { Footer } from '../components/layout/Footer';

export function HomePage() {
  return (
    <div id="top">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <AnalysisDemo />
        <HowItWorksSection />
        <DetectionCategoriesSection />
        <ExplainabilitySection />
        <FeaturesSection />
        <UseCasesSection />
        <AnalyticsPreviewSection />
        <TechnologySection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
