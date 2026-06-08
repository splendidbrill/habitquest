// ============================================================
// Preference Signals (Phase 3) — records the 3-state swipe reactions
// from onboarding into local, offline-first preference maps that the
// Phase 4 preference engine turns into scores.
//
// Persistence here is LOCAL ONLY (AsyncStorage). The child-scoped
// `preference_signals` DB table + per-child mirror land in Phase 4,
// where completion signals (not just onboarding swipes) feed the model.
// ============================================================

import { storage } from '../utils/storage';
import { mealArchetypes } from '../data/mealArchetypes';
import { activityArchetypes } from '../data/activityArchetypes';

export type Reaction = 'loved' | 'okay' | 'not_for_us';

// Behaviour > stated preference (doc): loved counts strongly positive,
// "not for us" subtracts. Phase 4 will additionally out-weight real
// completion signals over these stated swipes.
export const REACTION_WEIGHT: Record<Reaction, number> = {
  loved: 2,
  okay: 1,
  not_for_us: -1,
};

// Storage keys are also read by loadFamilyProfile() in
// src/data/familyProfile.ts — keep the string literals in sync.
export const PREF_KEYS = {
  reactions: 'swipeReactions',
  cuisine: 'cuisinePrefs',
  activity: 'activityPrefs',
} as const;

type RawReactions = {
  meals: Record<string, Reaction>;
  activities: Record<string, Reaction>;
};

async function loadRaw(): Promise<RawReactions> {
  const raw = await storage.getItem(PREF_KEYS.reactions);
  if (!raw) return { meals: {}, activities: {} };
  try {
    const parsed = JSON.parse(raw) as Partial<RawReactions>;
    return { meals: parsed.meals ?? {}, activities: parsed.activities ?? {} };
  } catch {
    return { meals: {}, activities: {} };
  }
}

/** Record meal swipe reactions and re-aggregate cuisine preferences. */
export async function recordMealReactions(
  reactions: Record<string, Reaction>,
): Promise<void> {
  const raw = await loadRaw();
  raw.meals = { ...raw.meals, ...reactions };
  await storage.setItem(PREF_KEYS.reactions, JSON.stringify(raw));

  const cuisine: Record<string, number> = {};
  for (const [id, r] of Object.entries(raw.meals)) {
    const meal = mealArchetypes.find(m => m.id === id);
    if (!meal) continue;
    cuisine[meal.cuisine] = (cuisine[meal.cuisine] ?? 0) + REACTION_WEIGHT[r];
  }
  await storage.setItem(PREF_KEYS.cuisine, JSON.stringify(cuisine));
}

/** Record activity swipe reactions and re-aggregate activity preferences. */
export async function recordActivityReactions(
  reactions: Record<string, Reaction>,
): Promise<void> {
  const raw = await loadRaw();
  raw.activities = { ...raw.activities, ...reactions };
  await storage.setItem(PREF_KEYS.reactions, JSON.stringify(raw));

  const activity: Record<string, number> = {};
  for (const [id, r] of Object.entries(raw.activities)) {
    const act = activityArchetypes.find(a => a.id === id);
    if (!act) continue;
    activity[act.category] = (activity[act.category] ?? 0) + REACTION_WEIGHT[r];
  }
  await storage.setItem(PREF_KEYS.activity, JSON.stringify(activity));
}
