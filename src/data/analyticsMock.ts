import { mockHistory } from './mockHistory';
import type { HistoryRecord } from '../types/history';
import { getAnalysisHistory } from '../services/historyService';

export type AnalyticsRange = '7' | '30' | '3m' | '6m' | 'all';

export interface AnalyticsPoint { date: string; reliability: number; analyses: number }
export interface AnalyticsClaimBreakdown { name: string; value: number; color: string }
export interface AnalyticsSource { name: string; percentage: number; analyses: number }
export interface AnalyticsCategory { name: string; analyses: number; reliability: number }
export interface AnalyticsInsight { title: string; text: string; kind: 'trend' | 'category' | 'claims' | 'source' }

export interface AnalyticsSnapshot {
  rangeLabel: string;
  totalAnalyses: number;
  averageReliability: number;
  hallucinationRate: number;
  claimsVerified: number;
  reliabilityTrend: AnalyticsPoint[];
  overview: { name: string; value: number; color: string }[];
  riskDistribution: { name: string; value: number; color: string }[];
  claimBreakdown: AnalyticsClaimBreakdown[];
  sourceBreakdown: AnalyticsSource[];
  categories: AnalyticsCategory[];
  insights: AnalyticsInsight[];
  highRisk: HistoryRecord[];
}

const rangeLabels: Record<AnalyticsRange, string> = { '7': 'Last 7 Days', '30': 'Last 30 Days', '3m': 'Last 3 Months', '6m': 'Last 6 Months', all: 'All Time' };
const trendSeeds: Record<AnalyticsRange, number[]> = {
  '7': [72, 75, 71, 79, 76, 82, 78],
  '30': [68, 72, 70, 74, 73, 77, 75, 79, 76, 78, 80, 77, 81, 79, 83, 80, 82, 84, 81, 85, 83, 86, 84, 87, 85, 88, 86, 87, 89, 88],
  '3m': [67, 70, 72, 71, 75, 74, 78, 77, 80, 79, 82, 81],
  '6m': [61, 65, 64, 68, 70, 69, 73, 72, 76, 75, 79, 78],
  all: [58, 62, 60, 64, 63, 67, 66, 70, 69, 72, 71, 75, 74, 78, 76, 79, 78, 82, 80, 84, 83, 86, 85, 88],
};

function dateLabels(range: AnalyticsRange, count: number) {
  const end = new Date('2026-10-06T12:00:00');
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(end);
    const offset = range === '3m' ? (count - index - 1) * 7 : range === '6m' || range === 'all' ? (count - index - 1) * 8 : count - index - 1;
    date.setDate(end.getDate() - offset);
    return range === '3m' || range === '6m' || range === 'all' ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
}

function recordsFor(range: AnalyticsRange) {
  if (range === 'all') return mockHistory;
  const days = range === '3m' ? 90 : range === '6m' ? 180 : Number(range);
  return mockHistory.filter((record) => (Date.parse('2026-10-06T23:59:59') - new Date(record.createdAt).getTime()) / 86400000 <= days);
}

function calculateCategories(records: HistoryRecord[]): AnalyticsCategory[] {
  const groups: Record<string, HistoryRecord[]> = { Technology: [], Science: [], History: [], Healthcare: [], Education: [], 'General Knowledge': [] };
  records.forEach((record) => {
    const title = record.title.toLowerCase();
    const category = title.includes('ai') || title.includes('software') || title.includes('quantum') ? 'Technology' : title.includes('solar') || title.includes('climate') || title.includes('ocean') || title.includes('nutrition') ? 'Science' : title.includes('history') || title.includes('printing') ? 'History' : title.includes('health') ? 'Healthcare' : title.includes('education') ? 'Education' : 'General Knowledge';
    groups[category].push(record);
  });
  return Object.entries(groups).filter(([, items]) => items.length).map(([name, items]) => ({ name, analyses: items.length, reliability: Math.round(items.reduce((sum, item) => sum + item.reliabilityScore, 0) / items.length) })).sort((a, b) => b.analyses - a.analyses);
}

export function getAnalytics(range: AnalyticsRange): AnalyticsSnapshot {
  const records = recordsFor(range);
  const totalAnalyses = records.length;
  const claimsVerified = records.reduce((sum, record) => sum + record.totalClaims, 0);
  const averageReliability = totalAnalyses ? Math.round(records.reduce((sum, record) => sum + record.reliabilityScore, 0) / totalAnalyses * 10) / 10 : 0;
  const hallucinationRate = totalAnalyses ? Math.round(records.reduce((sum, record) => sum + record.hallucinationProbability, 0) / totalAnalyses * 10) / 10 : 0;
  const claimBreakdown = [
    { name: 'Supported', value: records.reduce((sum, item) => sum + item.supportedClaims, 0), color: '#2c9b6c' },
    { name: 'Uncertain', value: records.reduce((sum, item) => sum + item.uncertainClaims, 0), color: '#d99524' },
    { name: 'Contradicted', value: records.reduce((sum, item) => sum + item.contradictedClaims, 0), color: '#e34850' },
    { name: 'Unverifiable', value: records.reduce((sum, item) => sum + item.unverifiableClaims, 0), color: '#8793a8' },
  ];
  const trend = trendSeeds[range].map((reliability, index) => ({ date: dateLabels(range, trendSeeds[range].length)[index], reliability, analyses: Math.max(1, Math.round((reliability - 60) / 5) + (index % 3)) }));
  const sourceBreakdown = [{ name: 'Knowledge Base', percentage: 30, analyses: Math.round(totalAnalyses * .3) }, { name: 'Web Sources', percentage: 25, analyses: Math.round(totalAnalyses * .25) }, { name: 'Both', percentage: 45, analyses: Math.max(0, totalAnalyses - Math.round(totalAnalyses * .3) - Math.round(totalAnalyses * .25)) }];
  const categories = calculateCategories(records);
  const highRisk = records.filter((record) => record.status === 'High Risk').slice(0, 4);
  const topCategory = categories[0]?.name ?? 'your most analyzed category';
  const riskDistribution = [{ name: 'Low Risk', value: 68, color: '#2c9b6c' }, { name: 'Medium Risk', value: 22, color: '#d99524' }, { name: 'High Risk', value: 10, color: '#e34850' }];
  return {
    rangeLabel: rangeLabels[range], totalAnalyses, averageReliability, hallucinationRate, claimsVerified, reliabilityTrend: trend,
    overview: [{ name: 'Reliable', value: 45, color: '#2c9b6c' }, { name: 'Mostly Reliable', value: 30, color: '#315be7' }, { name: 'Uncertain', value: 15, color: '#d99524' }, { name: 'High Risk', value: 10, color: '#e34850' }],
    riskDistribution, claimBreakdown, sourceBreakdown, categories, highRisk,
    insights: [
      { kind: 'trend', title: 'Reliability is moving up', text: `Average reliability is ${averageReliability}% for ${rangeLabels[range].toLowerCase()}, based on your analyzed responses.` },
      { kind: 'category', title: `${topCategory} leads your workspace`, text: `${topCategory} has the highest volume among the categories represented in this period.` },
      { kind: 'claims', title: 'Supported claims lead', text: `${claimBreakdown[0].value} claims were supported, while contradicted claims account for ${claimsVerified ? Math.round(claimBreakdown[2].value / claimsVerified * 100) : 0}% of claims.` },
      { kind: 'source', title: 'Combined evidence is common', text: 'Both knowledge-base and web evidence are the most common verification pattern in this demo workspace.' },
    ],
  };
}

export async function getLiveAnalytics(range: AnalyticsRange): Promise<AnalyticsSnapshot> {
  const days = range === 'all' ? undefined : range === '3m' ? 90 : range === '6m' ? 180 : Number(range);
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001').replace(/\/+$/, '');
  const response = await fetch(`${base}/api/analytics${days ? `?days=${days}` : ''}`);
  if (!response.ok) throw new Error(`Analytics request failed (${response.status}).`);
  const summary = await response.json() as {
    totalAnalyses: number; averageReliability: number; hallucinationRate: number; claimsVerified: number;
    reliabilityTrend: AnalyticsPoint[]; claimBreakdown: AnalyticsClaimBreakdown[];
  };
  const records = (await getAnalysisHistory()).filter((record) => {
    if (!days) return true;
    return (Date.now() - Date.parse(record.createdAt)) / 86400000 <= days;
  });
  const totalClaims = summary.claimsVerified;
  const overview = [
    { name: 'Reliable', value: records.filter((r) => r.status === 'Reliable').length, color: '#2c9b6c' },
    { name: 'Mostly Reliable', value: records.filter((r) => r.status === 'Mostly Reliable').length, color: '#315be7' },
    { name: 'Uncertain', value: records.filter((r) => r.status === 'Uncertain').length, color: '#d99524' },
    { name: 'High Risk', value: records.filter((r) => r.status === 'High Risk').length, color: '#e34850' },
  ].map((item) => ({ ...item, value: summary.totalAnalyses ? Math.round(item.value / summary.totalAnalyses * 100) : 0 }));
  const sourceCounts = records.reduce<Record<string, number>>((counts, record) => { counts[record.sourceType] = (counts[record.sourceType] || 0) + 1; return counts; }, {});
  const sourceBreakdown = Object.entries(sourceCounts).map(([name, count]) => ({ name, analyses: count, percentage: records.length ? Math.round(count / records.length * 100) : 0 }));
  const categories = calculateCategories(records);
  const highRisk = records.filter((record) => record.status === 'High Risk').slice(0, 4);
  const topCategory = categories[0]?.name ?? 'your most analyzed category';
  const supported = summary.claimBreakdown.find((item) => item.name === 'Supported')?.value || 0;
  const contradicted = summary.claimBreakdown.find((item) => item.name === 'Contradicted')?.value || 0;
  const riskCounts = records.flatMap((record) => record.claims).reduce((counts, claim) => {
    const bucket = (claim.hallucinationRisk || 50) < 15 ? 'Low Risk' : (claim.hallucinationRisk || 50) < 40 ? 'Medium Risk' : 'High Risk';
    counts[bucket] = (counts[bucket] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  const riskDistribution = ['Low Risk', 'Medium Risk', 'High Risk'].map((name) => ({
    name, value: totalClaims ? Math.round((riskCounts[name] || 0) / totalClaims * 100) : 0,
    color: name === 'Low Risk' ? '#2c9b6c' : name === 'Medium Risk' ? '#d99524' : '#e34850',
  }));
  return {
    rangeLabel: rangeLabels[range], totalAnalyses: summary.totalAnalyses, averageReliability: summary.averageReliability,
    hallucinationRate: summary.hallucinationRate, claimsVerified: totalClaims, reliabilityTrend: summary.reliabilityTrend,
    overview, riskDistribution, claimBreakdown: summary.claimBreakdown, sourceBreakdown, categories, highRisk,
    insights: [
      { kind: 'trend', title: 'Reliability trend', text: `Average reliability is ${summary.averageReliability}% for ${rangeLabels[range].toLowerCase()}, based on saved analyses.` },
      { kind: 'category', title: `${topCategory} leads your workspace`, text: `${topCategory} has the highest volume among the categories represented in this period.` },
      { kind: 'claims', title: 'Claim verification results', text: `${supported} claims were supported and ${contradicted} were contradicted out of ${totalClaims} claims.` },
      { kind: 'source', title: 'Evidence sources used', text: sourceBreakdown.length ? sourceBreakdown.map((item) => `${item.name}: ${item.percentage}%`).join(', ') : 'No evidence source data is available yet.' },
    ],
  };
}