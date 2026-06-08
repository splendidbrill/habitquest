// ============================================================
// Meal Engine (Phase 5).
//
// selectMeals() turns the family's PreferenceModel ("Health DNA") + the
// canonical FamilyProfile into a balanced set of real meals, following the
// doc's core rule: 70% FAMILIAR / 20% ADJACENT / 10% NEW.
//   - familiar = top cuisines in the preference model
//   - adjacent = cuisines neighbouring the familiar ones (CUISINE_ADJACENCY)
//   - new      = everything else (gentle exploration)
//
// Guardrail (doc lines 199-201): the engine picks the meal MOST LIKELY TO
// SUCCEED for this family, not the "healthiest" one. Dietary/allergy fields
// from FamilyProfile are applied as HARD FILTERS *first* (mirrors the allergy
// filter in HealthySwaps.tsx).
//
// `why[]` is built deterministically from profile + model so Phase 7
// ("Why am I seeing this?") can surface real, non-fabricated reasons.
// ============================================================

import type { Cuisine } from '../data/mealArchetypes';
import { mealLibrary, type LibraryMeal } from '../data/mealLibrary';
import type { FamilyProfile } from '../data/familyProfile';
import type { PreferenceModel } from './preferenceEngine';

export type MealBucket = 'familiar' | 'adjacent' | 'new';

export interface MealPick {
  meal: LibraryMeal;
  bucket: MealBucket;
  why: string[];
}

// Which cuisines feel like a natural "next step" from a familiar one.
// Used to build the 20% adjacent band — close enough to stay safe,
// different enough to widen the family's palette.
export const CUISINE_ADJACENCY: Record<Cuisine, Cuisine[]> = {
  British: ['Italian', 'Caribbean'],
  Caribbean: ['African', 'British'],
  Indian: ['Pakistani', 'Middle Eastern'],
  Pakistani: ['Indian', 'Middle Eastern'],
  Chinese: ['Indian', 'Mediterranean'],
  Mediterranean: ['Middle Eastern', 'Italian'],
  'Middle Eastern': ['Mediterranean', 'Indian'],
  African: ['Caribbean', 'Middle Eastern'],
  Italian: ['Mediterranean', 'British'],
  Mexican: ['Caribbean', 'Mediterranean'],
};

// A cuisine counts as "familiar" once the model scores it at/above this.
export const FAMILIAR_THRESHOLD = 58;
// A tag counts as a liked signal at/above this score.
export const LIKED_TAG_THRESHOLD = 60;

// ─── Dietary hard filter (mirrors HealthySwaps.tsx allergy logic) ─────────────
export function passesDietary(meal: LibraryMeal, dietary: string[]): boolean {
  for (const d of dietary) {
    if (d.includes('Dairy') && meal.containsDairy) return false;
    if (d.includes('Nut') && meal.containsNuts) return false;
    if ((d.includes('Gluten') || d.includes('coeliac')) && meal.containsGluten)
      return false;
    if (d.includes('Vegetarian') && !meal.vegetarian) return false;
    if (d.includes('Vegan') && (!meal.vegetarian || meal.containsDairy))
      return false;
    if (d.includes('Halal') && meal.containsPork) return false;
  }
  return true;
}

// 70 / 20 / 10 split of `total` into whole-number bucket counts.
function bucketCounts(total: number): Record<MealBucket, number> {
  const familiar = Math.round(total * 0.7);
  const adjacent = Math.round(total * 0.2);
  return { familiar, adjacent, new: Math.max(0, total - familiar - adjacent) };
}

// Does this family lean toward quick weeknight meals?
export function prefersQuick(profile: FamilyProfile): boolean {
  const t = profile.prepTime.toLowerCase();
  return (
    /under|15|20|30|quick|less/.test(t) || (profile.weekdayBusyness ?? 0) >= 4
  );
}

export function prefersLowBudget(profile: FamilyProfile): boolean {
  const b = profile.budget.toLowerCase();
  return /low|tight|budget|under|£?2|£?3/.test(b);
}

// Deterministic ranking score within a bucket.
function mealScore(
  m: LibraryMeal,
  model: PreferenceModel,
  profile: FamilyProfile,
): number {
  let s = m.childFriendliness * 2;
  s += (model.cuisineScores[m.cuisine] ?? 50) / 10;
  for (const t of m.tags) s += ((model.tagScores[t] ?? 50) - 50) / 20;
  if (
    prefersQuick(profile) &&
    (m.prepBand === 'under15' || m.prepBand === '15-30')
  )
    s += 3;
  if (prefersLowBudget(profile) && m.budget === 'low') s += 1.5;
  return s;
}

function buildWhy(
  m: LibraryMeal,
  bucket: MealBucket,
  model: PreferenceModel,
  profile: FamilyProfile,
): string[] {
  const why: string[] = [];
  const cuisinePct = model.cuisineScores[m.cuisine];

  if (
    bucket === 'familiar' &&
    cuisinePct !== undefined &&
    cuisinePct >= FAMILIAR_THRESHOLD
  ) {
    why.push(`Your family loves ${m.cuisine} food (${cuisinePct}%)`);
  } else if (bucket === 'adjacent') {
    why.push(`A fresh twist on the cuisines you already enjoy`);
  } else if (bucket === 'new') {
    why.push(`Something new to try this week`);
  }

  const likedTag = m.tags.find(
    t => (model.tagScores[t] ?? 0) >= LIKED_TAG_THRESHOLD,
  );
  if (likedTag) why.push(`Your child enjoys ${likedTag}`);

  if (
    prefersQuick(profile) &&
    (m.prepBand === 'under15' || m.prepBand === '15-30')
  )
    why.push(`Quick on a busy weeknight`);
  if (prefersLowBudget(profile) && m.budget === 'low')
    why.push(`Budget-friendly`);
  else if (m.childFriendliness >= 4) why.push(`Kid-approved`);

  // No signal at all yet → population-level honesty (doc's transition).
  if (!model.hasSignal && why.length <= 1) {
    why.push(`Based on families like yours`);
  }

  return why.slice(0, 3);
}

/**
 * Select `count` meals balanced 70% familiar / 20% adjacent / 10% new.
 * Dietary/allergy filters are applied FIRST as hard exclusions.
 */
export function selectMeals(
  model: PreferenceModel,
  profile: FamilyProfile,
  count: number,
): MealPick[] {
  // 1 — hard dietary filter.
  const eligible = mealLibrary.filter(m => passesDietary(m, profile.dietary));
  if (eligible.length === 0) return [];

  // 2 — which cuisines are familiar / adjacent for this family.
  const rankedCuisines = Object.entries(model.cuisineScores)
    .filter(([, pct]) => pct >= FAMILIAR_THRESHOLD)
    .sort(([, a], [, b]) => b - a)
    .map(([c]) => c as Cuisine);
  const familiarCuisines = new Set<Cuisine>(rankedCuisines.slice(0, 4));

  const adjacentCuisines = new Set<Cuisine>();
  for (const c of familiarCuisines) {
    for (const adj of CUISINE_ADJACENCY[c] ?? []) {
      if (!familiarCuisines.has(adj)) adjacentCuisines.add(adj);
    }
  }

  // 3 — partition eligible meals into buckets, each sorted by score.
  const byScore = (a: LibraryMeal, b: LibraryMeal) =>
    mealScore(b, model, profile) - mealScore(a, model, profile);
  const familiarPool = eligible
    .filter(m => familiarCuisines.has(m.cuisine))
    .sort(byScore);
  const adjacentPool = eligible
    .filter(m => adjacentCuisines.has(m.cuisine))
    .sort(byScore);
  const newPool = eligible
    .filter(
      m => !familiarCuisines.has(m.cuisine) && !adjacentCuisines.has(m.cuisine),
    )
    .sort(byScore);

  // 4 — fill the 70/20/10 quotas, spilling to leftovers if a bucket is short.
  const want = bucketCounts(count);
  const used = new Set<string>();
  const picks: MealPick[] = [];

  const drawFrom = (pool: LibraryMeal[], n: number, bucket: MealBucket) => {
    for (const m of pool) {
      if (picks.length >= count || n <= 0) break;
      if (used.has(m.id)) continue;
      used.add(m.id);
      picks.push({ meal: m, bucket, why: buildWhy(m, bucket, model, profile) });
      n--;
    }
  };

  drawFrom(familiarPool, want.familiar, 'familiar');
  drawFrom(adjacentPool, want.adjacent, 'adjacent');
  drawFrom(newPool, want.new, 'new');

  // 5 — top up to `count` from whatever remains (preserves bucket label).
  if (picks.length < count) {
    const remainder = [
      ...familiarPool.map(m => ['familiar', m] as const),
      ...adjacentPool.map(m => ['adjacent', m] as const),
      ...newPool.map(m => ['new', m] as const),
    ];
    for (const [bucket, m] of remainder) {
      if (picks.length >= count) break;
      if (used.has(m.id)) continue;
      used.add(m.id);
      picks.push({ meal: m, bucket, why: buildWhy(m, bucket, model, profile) });
    }
  }

  return picks;
}
