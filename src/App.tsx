import { MotionConfig } from 'framer-motion';
import { HomePage } from './pages/HomePage';
import { DetectPage } from './pages/DetectPage';
import { HistoryPage } from './pages/HistoryPage';
import { HistoryDetailPage } from './pages/HistoryDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  const path = window.location.pathname;
  const historyMatch = path.match(/^\/history\/([^/]+)$/);

  return (
    <MotionConfig reducedMotion="user">
      {path === '/detect' ? <DetectPage /> : historyMatch ? <HistoryDetailPage id={historyMatch[1]} /> : path === '/history' ? <HistoryPage /> : path === '/analytics' ? <AnalyticsPage /> : path === '/how-it-works' ? <HowItWorksPage /> : path === '/about' ? <AboutPage /> : path === '/profile' ? <ProfilePage /> : <HomePage />}
    </MotionConfig>
  );
}
