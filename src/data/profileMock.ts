import type { AnalysisConfig } from '../types/detect';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
  bio: string;
  avatar: string | null;
  accountStatus: 'Active';
}

export interface ProfilePreferences extends AnalysisConfig {
  theme: 'light' | 'dark' | 'system';
  analysisNotifications: boolean;
  historyNotifications: boolean;
  language: 'English';
  saveAnalysisHistory: boolean;
  saveInputText: boolean;
  anonymousAnalytics: boolean;
}

export const mockUser: MockUser = {
  id: 'user-demo',
  name: 'Your Name',
  email: 'your.email@example.com',
  role: 'Student / Researcher',
  institution: 'Your Institution',
  bio: 'Interested in AI, Machine Learning, NLP, and trustworthy AI systems.',
  avatar: null,
  accountStatus: 'Active',
};

export const defaultPreferences: ProfilePreferences = {
  theme: 'light',
  verificationMode: 'standard',
  evidenceSource: 'both',
  claimGranularity: 'claim',
  confidenceThreshold: 70,
  analysisNotifications: true,
  historyNotifications: false,
  language: 'English',
  saveAnalysisHistory: true,
  saveInputText: false,
  anonymousAnalytics: false,
};

export const mockActivity = [
  { title: 'Analysis completed', description: 'Impact of Artificial Intelligence on Employment', time: 'Today', kind: 'analysis' },
  { title: 'Profile updated', description: 'Personal information was saved locally.', time: 'Today', kind: 'profile' },
  { title: 'Analysis completed', description: 'History of the Internet', time: 'Yesterday', kind: 'analysis' },
  { title: 'Preferences changed', description: 'Default verification settings were adjusted.', time: '3 days ago', kind: 'settings' },
];

export const profileOverview = { totalAnalyses: 24, averageReliability: '78.4%', claimsVerified: 142, accountCreated: 'October 2026' };