import type { AnalysisResult } from '../types/analysis';

export const mockAnalysisResult: AnalysisResult = {
  originalResponse: 'The Earth has one natural satellite, the Moon. Mars has two moons. The Great Wall of China is visible from space. Water boils at 100 degrees Celsius at sea level.',
  reliabilityScore: 72,
  claims: [
    {
      id: 'claim-1',
      text: 'The Earth has one natural satellite, the Moon.',
      category: 'supported',
      confidence: 0.98,
      evidence: 'Earth has one known natural satellite, the Moon.',
      source: 'NASA Solar System Exploration',
      relevanceScore: 0.99,
    },
    {
      id: 'claim-2',
      text: 'Mars has two moons.',
      category: 'supported',
      confidence: 0.96,
      evidence: 'Mars has two small moons, Phobos and Deimos.',
      source: 'NASA Mars Exploration',
      relevanceScore: 0.97,
    },
    {
      id: 'claim-3',
      text: 'The Great Wall of China is visible from space.',
      category: 'uncertain',
      confidence: 0.72,
      evidence: 'Visibility depends on atmospheric conditions, orbit, and the definition of visible detail.',
      source: 'European Space Agency image archive',
      relevanceScore: 0.84,
    },
    {
      id: 'claim-4',
      text: 'Water boils at 100 degrees Celsius at sea level.',
      category: 'contradicted',
      confidence: 0.91,
      evidence: 'The boiling point of water varies with pressure and is approximately 100 degrees Celsius at standard atmospheric pressure.',
      source: 'NIST Chemistry WebBook',
      relevanceScore: 0.93,
    },
  ],
};

export function createMockAnalysis(response: string): AnalysisResult {
  const originalResponse = response.trim();

  if (!originalResponse || originalResponse === mockAnalysisResult.originalResponse) {
    return mockAnalysisResult;
  }

  return {
    originalResponse,
    reliabilityScore: 0,
    claims: [
      {
        id: 'mock-unverifiable-claim',
        text: originalResponse,
        category: 'unverifiable',
        confidence: 0.32,
        evidence: 'No connected evidence source is available in this frontend-only demonstration.',
        source: 'Local mock evidence set',
        relevanceScore: 0.1,
      },
    ],
  };
}
