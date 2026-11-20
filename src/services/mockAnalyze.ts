import { createDetectResult } from '../data/detectMock';
import type { AnalysisConfig, DetectResult } from '../types/detect';

export async function mockAnalyze(text: string, config: AnalysisConfig): Promise<DetectResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 1800));
  return createDetectResult(text, config);
}
