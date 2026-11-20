import type { AnalysisConfig, DetectResult } from '../types/detect';

export const defaultAnalysisConfig: AnalysisConfig = {
  verificationMode: 'standard',
  evidenceSource: 'both',
  claimGranularity: 'claim',
  confidenceThreshold: 70,
};

export const detectExamples = [
  { label: 'Historical Claims', text: 'The printing press was invented by Johannes Gutenberg around 1440. The first book printed with movable type was the Bible. The printing press immediately made books affordable for everyone.' },
  { label: 'Scientific Claims', text: 'The Earth revolves around the Sun. Earth takes exactly 360 days to orbit the Sun. Earth has two natural satellites.' },
  { label: 'General Knowledge', text: 'Water freezes at 0 degrees Celsius at standard pressure. The Pacific Ocean is the largest ocean on Earth. Humans use only 10 percent of their brains.' },
];

export const mockDetectResult: DetectResult = {
  originalResponse: 'The Earth revolves around the Sun. Earth takes exactly 360 days to orbit the Sun. Earth has two natural satellites. Mars has two moons. Water boils at 100 degrees Celsius at sea level. The Great Wall of China is visible from the Moon.',
  reliabilityScore: 78,
  hallucinationProbability: 22,
  analyzedAt: '2026-10-05T10:30:00.000Z',
  claims: [
    { id: 'detect-1', text: 'The Earth revolves around the Sun.', category: 'supported', confidence: 0.98, explanation: 'Retrieved evidence agrees with the claim.', evidence: [{ id: 'e-1', source: 'Trusted Knowledge Source', sourceType: 'Knowledge Base', relevanceScore: 0.98, text: 'Earth orbits the Sun once approximately every 365.25 days.', url: 'https://demo.local/evidence/earth-orbit' }] },
    { id: 'detect-2', text: 'Earth takes exactly 360 days to orbit the Sun.', category: 'uncertain', confidence: 0.64, explanation: 'The claim is close to a known fact but the exact figure is imprecise.', evidence: [{ id: 'e-2', source: 'Reference Documents', sourceType: 'Reference', relevanceScore: 0.87, text: 'One complete orbit takes approximately 365.25 days.', url: 'https://demo.local/evidence/orbit-period' }] },
    { id: 'detect-3', text: 'Earth has two natural satellites.', category: 'contradicted', confidence: 0.99, explanation: 'The retrieved evidence conflicts with this claim.', evidence: [{ id: 'e-3', source: 'Trusted Knowledge Source', sourceType: 'Knowledge Base', relevanceScore: 0.97, text: 'Earth has one known natural satellite, the Moon.', url: 'https://demo.local/evidence/earth-moon' }] },
    { id: 'detect-4', text: 'Mars has two moons.', category: 'supported', confidence: 0.96, explanation: 'Evidence confirms the statement.', evidence: [{ id: 'e-4', source: 'Reference Documents', sourceType: 'Reference', relevanceScore: 0.95, text: 'Mars has two small moons, Phobos and Deimos.', url: 'https://demo.local/evidence/mars-moons' }] },
    { id: 'detect-5', text: 'Water boils at 100 degrees Celsius at sea level.', category: 'supported', confidence: 0.91, explanation: 'The statement is supported at standard atmospheric pressure.', evidence: [{ id: 'e-5', source: 'Trusted Knowledge Source', sourceType: 'Knowledge Base', relevanceScore: 0.93, text: 'Water boils at approximately 100 degrees Celsius at standard atmospheric pressure.', url: 'https://demo.local/evidence/boiling-point' }] },
    { id: 'detect-6', text: 'The Great Wall of China is visible from the Moon.', category: 'contradicted', confidence: 0.94, explanation: 'Available evidence conflicts with the statement.', evidence: [{ id: 'e-6', source: 'Web Evidence', sourceType: 'Web', relevanceScore: 0.89, text: 'The Great Wall is not visible to the naked eye from the Moon.', url: 'https://demo.local/evidence/great-wall' }] },
  ],
};

export function createDetectResult(text: string, config: AnalysisConfig): DetectResult {
  if (text.trim() === mockDetectResult.originalResponse.trim()) return mockDetectResult;
  const claim = { ...mockDetectResult.claims[0], id: 'custom-1', text: text.trim(), category: 'unverifiable' as const, confidence: Math.max(0.2, config.confidenceThreshold / 100 - 0.3), explanation: 'This frontend-only demo has no connected evidence source for custom input.', evidence: [{ id: 'custom-evidence', source: 'Demo Evidence', sourceType: 'Mock', relevanceScore: 0.1, text: 'No live evidence is connected in this frontend demonstration.', url: 'https://demo.local/evidence/unavailable' }] };
  return { originalResponse: text.trim(), reliabilityScore: 0, hallucinationProbability: 100, analyzedAt: new Date().toISOString(), claims: [claim] };
}
