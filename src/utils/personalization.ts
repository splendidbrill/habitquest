import { storage } from './storage';
import {
  mapAnswersToProfile,
  type ActivityLevel,
  type FamilyProfile,
  type RawAnswers,
} from '../data/familyProfile';

// OnboardingData is the raw, non-contiguous answer map as persisted to
// AsyncStorage. All field-level reads go through the canonical
// mapAnswersToProfile() so the id mapping (incl. budget id 11) lives in
// one place (src/data/familyProfile.ts).
export type OnboardingData = RawAnswers;

export async function getOnboardingData(): Promise<OnboardingData | null> {
  const data = await storage.getItem('onboardingAnswers');
  if (!data) return null;
  try {
    return JSON.parse(data) as OnboardingData;
  } catch {
    return null;
  }
}

function profileOf(data: OnboardingData): FamilyProfile {
  return mapAnswersToProfile(data);
}

export function getChildAge(data: OnboardingData): number | null {
  return profileOf(data).childAge;
}

export function hasCulturalBackground(
  data: OnboardingData,
  culture: string,
): boolean {
  return profileOf(data).cultures.some(c => c.includes(culture));
}

export function hasEquipment(data: OnboardingData, equipment: string): boolean {
  return profileOf(data).equipment.some(e => e.includes(equipment));
}

export function hasSpace(data: OnboardingData, space: string): boolean {
  return profileOf(data).spaces.some(s => s.includes(space));
}

export function needsQuickMeals(data: OnboardingData): boolean {
  const p = profileOf(data).prepTime;
  return p.includes('Under 15') || p.includes('15-30');
}

export function getActivityLevel(data: OnboardingData): ActivityLevel {
  return profileOf(data).activityLevel;
}

export function getBudget(data: OnboardingData): string {
  return profileOf(data).budget;
}
