// ============================================================
// Transparency (Phase 7) — "Why am I seeing this?"
//
// Builds the deterministic `why: string[]` shown on every meal/activity
// recommendation. Reasons cite REAL stored values from the preference model
// + family profile — never fabricated history (doc guardrail). When there is
// no signal yet it falls back to the honest "based on families like yours".
//
// The weekly plan's meals/activities come back from the AI as freeform names,
// so we match the meal name to the library to recover cuisine/tags, and
// reason about activities from pillar + profile interests.
// ============================================================

import type { Cuisine } from '../data/mealArchetypes';
import { mealLibrary } from '../data/mealLibrary';
import type { FamilyProfile } from '../data/familyProfile';
import type { PreferenceModel } from './preferenceEngine';
import {
  CUISINE_ADJACENCY,
  FAMILIAR_THRESHOLD,
  LIKED_TAG_THRESHOLD,
  prefersQuick,
  prefersLowBudget,
} from './mealEngine';

function isAdjacentCuisine(cuisine: Cuisine, model: PreferenceModel): boolean {
  return Object.entries(model.cuisineScores).some(
    ([c, pct]) =>
      pct >= FAMILIAR_THRESHOLD &&
      (CUISINE_ADJACENCY[c as Cuisine] ?? []).includes(cuisine),
  );
}

/**
 * Reasons for a planned meal, by name. Cites cuisine %, a liked tag, and
 * prep/budget/kid fit drawn from the family's real profile + model.
 */
export function buildMealWhy(
  mealName: string,
  model: PreferenceModel,
  profile: FamilyProfile,
): string[] {
  const why: string[] = [];
  const match = mealLibrary.find(
    m => m.name.toLowerCase() === mealName.trim().toLowerCase(),
  );

  if (match) {
    const cuisinePct = model.cuisineScores[match.cuisine];
    if (cuisinePct !== undefined && cuisinePct >= FAMILIAR_THRESHOLD) {
      why.push(`Your family loves ${match.cuisine} food (${cuisinePct}%)`);
    } else if (isAdjacentCuisine(match.cuisine, model)) {
      why.push(`A fresh twist on the cuisines you already enjoy`);
    }

    const likedTag = match.tags.find(
      t => (model.tagScores[t] ?? 0) >= LIKED_TAG_THRESHOLD,
    );
    if (likedTag) why.push(`Your child enjoys ${likedTag}`);

    if (
      prefersQuick(profile) &&
      (match.prepBand === 'under15' || match.prepBand === '15-30')
    )
      why.push(`Quick on a busy weeknight`);
    if (prefersLowBudget(profile) && match.budget === 'low')
      why.push(`Budget-friendly`);
    else if (match.childFriendliness >= 4) why.push(`Kid-approved`);
  } else {
    // Unknown meal — lean on the profile values we do have.
    if (prefersQuick(profile)) why.push(`Fits your prep time`);
    if (prefersLowBudget(profile)) why.push(`Budget-friendly`);
    if (profile.cultures.length)
      why.push(`Reflects your ${profile.cultures[0]} background`);
  }

  if (!model.hasSignal && why.length <= 1) {
    why.push(`Based on families like yours`);
  }
  return why.slice(0, 4);
}

/**
 * Reasons for a planned activity. Cites the focus pillar, the child's top
 * activity from the model, and stored interests/spaces from the profile.
 */
export function buildActivityWhy(
  activity: { name: string; pillar: string },
  model: PreferenceModel,
  profile: FamilyProfile,
): string[] {
  const why: string[] = [];

  const topActivity = model.topActivities[0];
  if (topActivity && topActivity.pct >= FAMILIAR_THRESHOLD) {
    why.push(`Matches what your child enjoys (${topActivity.label})`);
  }

  if (profile.childInterests.length) {
    why.push(`Builds on their interest in ${profile.childInterests[0]}`);
  }

  if (activity.pillar) {
    const PILLAR_REASON: Record<string, string> = {
      movement: `Keeps them active and moving`,
      nutrition: `Builds healthy food habits`,
      sleep: `Helps wind down for better sleep`,
      confidence: `Grows their confidence`,
    };
    if (PILLAR_REASON[activity.pillar])
      why.push(PILLAR_REASON[activity.pillar]);
  }

  if (profile.spaces.length && why.length < 3) {
    why.push(`Works with your ${profile.spaces[0].toLowerCase()}`);
  }

  if (!model.hasSignal && why.length <= 1) {
    why.push(`Based on families like yours`);
  }
  return why.slice(0, 4);
}
