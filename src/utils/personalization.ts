import { storage } from './storage';

export interface OnboardingData {
  0?: string;
  1?: string;
  2?: string[];
  3?: string[];
  4?: string[];
  5?: string;
  6?: string[];
  7?: string;
  8?: string[];
  9?: string[];
  10?: string[];
}

export async function getOnboardingData(): Promise<OnboardingData | null> {
  const data = await storage.getItem('onboardingAnswers');
  if (!data) return null;
  try {
    return JSON.parse(data) as OnboardingData;
  } catch {
    return null;
  }
}

export function getChildAge(data: OnboardingData): number | null {
  const ageStr = data[1];
  if (!ageStr) return null;
  const match = ageStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

export function hasCulturalBackground(data: OnboardingData, culture: string): boolean {
  return (data[3] || []).some(c => c.includes(culture));
}

export function hasEquipment(data: OnboardingData, equipment: string): boolean {
  return (data[9] || []).some(e => e.includes(equipment));
}

export function hasSpace(data: OnboardingData, space: string): boolean {
  return (data[8] || []).some(s => s.includes(space));
}

export function needsQuickMeals(data: OnboardingData): boolean {
  const p = data[5];
  return (p?.includes('Under 15') || p?.includes('15-30')) ?? false;
}

export function getActivityLevel(data: OnboardingData): 'low' | 'moderate' | 'high' | 'variable' {
  const l = data[7];
  if (l?.includes('Very active')) return 'high';
  if (l?.includes('Moderately active')) return 'moderate';
  if (l?.includes('Quite still')) return 'low';
  return 'variable';
}
