// ============================================================
// Canonical Family Profile
// Single source of truth for turning the non-contiguous
// AsyncStorage['onboardingAnswers'] map into a typed profile.
//
// Onboarding question IDs are NON-CONTIGUOUS (see Onboarding.tsx):
//   0 welcome · 1 childAge · 2 goals · 3 cultures · 4 foodGroups
//   5 prepTime · 11 budget · 6 dietary · 7 activityLevel
//   8 spaces · 9 equipment · 10 supportNeeds
// Every reader of onboarding answers should go through
// mapAnswersToProfile() rather than re-parsing raw ids.
// ============================================================

import { supabase } from '../lib/supabase';
import { storage } from '../utils/storage';

export type RawAnswers = Record<number, string | string[]>;

export type ActivityLevel = 'low' | 'moderate' | 'high' | 'variable';

/** Family Personality mini-quiz (populated in Phase 2). */
export interface FamilyPersonality {
  organisation?: string; // organised | flexible | chaotic
  structure?: string; // structure | variety | mix
  rewardTiming?: string; // immediate | end-of-day | weekly
}

export interface FamilyProfile {
  goals: string[];
  childAge: number | null;
  cultures: string[];
  foodGroups: string[];
  prepTime: string;
  budget: string;
  dietary: string[];
  activityLevel: ActivityLevel;
  spaces: string[];
  equipment: string[];
  supportNeeds: string[];
  // Layer-1 redesign fields (Phase 2). Empty/null until the question is answered.
  familyStructure: string;
  weekdayBusyness: number | null;
  difficultFoods: string[];
  childInterests: string[];
  barriers: string[];
  threeMonthGoal: string;
  // Outward (partial) postcode, e.g. "SE15". Captured for local context
  // (green space / nearby parks / area). Optional — empty until answered.
  postcode: string;
  familyPersonality: FamilyPersonality;
  // Populated by later phases (3 swipe / 4 preference engine).
  // Default to empty so consumers can rely on the field existing.
  cuisinePrefs: Record<string, number>;
  activityPrefs: Record<string, number>;
}

/**
 * Canonical onboarding question id map. The single place the
 * non-contiguous ids are named — do NOT invent new ids elsewhere.
 */
export const ONBOARDING_IDS = {
  childAge: 1,
  goals: 2,
  cultures: 3,
  foodGroups: 4,
  prepTime: 5,
  budget: 11,
  dietary: 6,
  activityLevel: 7,
  spaces: 8,
  equipment: 9,
  supportNeeds: 10,
  // Phase 2 additions (non-contiguous continues at 12+)
  familyStructure: 12,
  difficultFoods: 13,
  childInterests: 14,
  barriers: 15,
  threeMonthGoal: 16,
  weekdayBusyness: 17,
  postcode: 21,
  personalityOrganisation: 18,
  personalityStructure: 19,
  personalityRewardTiming: 20,
} as const;

function readMulti(answers: RawAnswers, id: number): string[] {
  const v = answers[id];
  if (v === undefined || v === null) return [];
  return [v].flat().filter(Boolean) as string[];
}

function readSingle(answers: RawAnswers, id: number): string {
  const v = answers[id];
  if (v === undefined || v === null) return '';
  return Array.isArray(v) ? v[0] ?? '' : v;
}

function readNumber(answers: RawAnswers, id: number): number | null {
  const raw = readSingle(answers, id);
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? null : n;
}

function deriveActivityLevel(raw: string): ActivityLevel {
  if (raw.includes('Very active')) return 'high';
  if (raw.includes('Moderately active')) return 'moderate';
  if (raw.includes('Quite still')) return 'low';
  return 'variable';
}

function deriveChildAge(raw: string): number | null {
  if (!raw) return null;
  const match = raw.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/** Single source of truth: raw onboarding answers -> typed FamilyProfile. */
export function mapAnswersToProfile(answers: RawAnswers): FamilyProfile {
  return {
    goals: readMulti(answers, ONBOARDING_IDS.goals),
    childAge: deriveChildAge(readSingle(answers, ONBOARDING_IDS.childAge)),
    cultures: readMulti(answers, ONBOARDING_IDS.cultures),
    foodGroups: readMulti(answers, ONBOARDING_IDS.foodGroups),
    prepTime: readSingle(answers, ONBOARDING_IDS.prepTime),
    budget: readSingle(answers, ONBOARDING_IDS.budget),
    dietary: readMulti(answers, ONBOARDING_IDS.dietary),
    activityLevel: deriveActivityLevel(
      readSingle(answers, ONBOARDING_IDS.activityLevel),
    ),
    spaces: readMulti(answers, ONBOARDING_IDS.spaces),
    equipment: readMulti(answers, ONBOARDING_IDS.equipment),
    supportNeeds: readMulti(answers, ONBOARDING_IDS.supportNeeds),
    familyStructure: readSingle(answers, ONBOARDING_IDS.familyStructure),
    weekdayBusyness: readNumber(answers, ONBOARDING_IDS.weekdayBusyness),
    difficultFoods: readMulti(answers, ONBOARDING_IDS.difficultFoods),
    childInterests: readMulti(answers, ONBOARDING_IDS.childInterests),
    barriers: readMulti(answers, ONBOARDING_IDS.barriers),
    threeMonthGoal: readSingle(answers, ONBOARDING_IDS.threeMonthGoal),
    postcode: readSingle(answers, ONBOARDING_IDS.postcode).trim().toUpperCase(),
    familyPersonality: {
      organisation:
        readSingle(answers, ONBOARDING_IDS.personalityOrganisation) ||
        undefined,
      structure:
        readSingle(answers, ONBOARDING_IDS.personalityStructure) || undefined,
      rewardTiming:
        readSingle(answers, ONBOARDING_IDS.personalityRewardTiming) ||
        undefined,
    },
    cuisinePrefs: {},
    activityPrefs: {},
  };
}

/** True when the profile has at least one meaningful onboarding answer. */
export function hasProfileData(p: FamilyProfile): boolean {
  return (
    p.goals.length > 0 ||
    p.cultures.length > 0 ||
    p.foodGroups.length > 0 ||
    p.prepTime !== '' ||
    p.childAge !== null
  );
}

async function readPrefMap(key: string): Promise<Record<string, number>> {
  const raw = await storage.getItem(key);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

/** Load the canonical profile from offline-first AsyncStorage. */
export async function loadFamilyProfile(): Promise<FamilyProfile | null> {
  const raw = await storage.getItem('onboardingAnswers');
  if (!raw) return null;
  try {
    const profile = mapAnswersToProfile(JSON.parse(raw) as RawAnswers);
    // Merge in swipe-derived preferences (written by preferenceSignals.ts).
    // Key strings mirror PREF_KEYS there.
    profile.cuisinePrefs = await readPrefMap('cuisinePrefs');
    profile.activityPrefs = await readPrefMap('activityPrefs');
    return profile;
  } catch {
    return null;
  }
}

/**
 * Mirror the canonical profile to the synced `family_profiles` row.
 * AsyncStorage remains the offline-first source of truth; the DB row
 * is a best-effort mirror, so failures are swallowed (offline / signed-out).
 */
export async function syncFamilyProfile(profile: FamilyProfile): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('family_profiles')
      .upsert(
        { parent_id: user.id, profile, updated_at: new Date().toISOString() },
        { onConflict: 'parent_id' },
      );
  } catch {
    // best-effort sync; offline-first storage already holds the answers
  }
}
