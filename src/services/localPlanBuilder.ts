// ============================================================
// Local Plan Builder — deterministic, offline, personalised weekly plan.
//
// The weekly plan used to depend ENTIRELY on the Supabase `ai-proxy` edge
// function (→ Azure). Whenever that was unreachable (Supabase paused, auth
// expired, Azure down) the app silently fell back to a hard-coded generic week
// that ignored onboarding. This builder removes that single point of failure:
// it assembles a personalised, sheet-driven 7-day plan with NO network call,
// reusing the same engines the rest of the app already trusts:
//   - selectMeals()            → 70/20/10 personalised meals from mealDatabase
//   - selectDailyMovementQuest → personalised daily activity from activityDatabase
//   - getHealthierInfo()       → the dietitian's authored "why healthier" copy
//
// When there is no behavioural signal yet (fresh family), we seed the family's
// onboarding CULTURES as familiar cuisines so the very first plan still reflects
// what they told us during onboarding.
// ============================================================

import type { FamilyProfile } from '../data/familyProfile';
import type { PreferenceModel } from './preferenceEngine';
import type { Cuisine } from '../data/mealArchetypes';
import { selectMeals } from './mealEngine';
import { mealDatabase } from '../data/mealDatabase';
import { selectDailyMovementQuest, ageToBand } from '../data/movementQuests';
import type { DayPlan, DayMeal, DayActivity } from './weeklyPlanStore';

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Dinner-first ordering so the plan's "Dinner" slots aren't filled by snacks.
const OCCASION_RANK: Record<string, number> = {
  Dinner: 0,
  Lunch: 1,
  Breakfast: 2,
  Snack: 3,
};

/** An empty preference model (no behavioural signal yet). */
export function emptyPreferenceModel(): PreferenceModel {
  return {
    cuisineScores: {},
    activityScores: {},
    tagScores: {},
    topCuisines: [],
    topActivities: [],
    timePatterns: { weekday: null, weekend: null, hasTimeSignal: false },
    hasSignal: false,
  };
}

// Map an onboarding culture label onto a meal Cuisine, by keyword.
function cultureToCuisine(culture: string): Cuisine | null {
  const c = culture.toLowerCase();
  if (/caribbean|jamaic/.test(c)) return 'Caribbean';
  if (/africa|nigeri|ghana|ethiop|somali/.test(c)) return 'African';
  if (/mexic|latin|brazil/.test(c)) return 'Mexican';
  if (/pakistan/.test(c)) return 'Pakistani';
  if (/india|south asian|punjab|sri lanka|bangladesh|desi/.test(c))
    return 'Indian';
  if (
    /chinese|east asian|japan|viet|thai|filipino|korea|indonesi|malay/.test(c)
  )
    return 'Chinese';
  if (
    /middle east|persia|iran|turk|arab|lebanese|moroc|north african|egypt/.test(
      c,
    )
  )
    return 'Middle Eastern';
  if (/ital/.test(c)) return 'Italian';
  if (/mediterran|greek|spanish|french|portug/.test(c)) return 'Mediterranean';
  if (/brit|english|irish|scott|welsh|european/.test(c)) return 'British';
  return null;
}

// When there's no learned signal yet, treat the family's stated cultures as
// "familiar" cuisines so the first plan reflects onboarding.
function seedModelFromProfile(
  model: PreferenceModel,
  profile: FamilyProfile,
): PreferenceModel {
  if (model.hasSignal) return model;
  const cuisineScores: Record<string, number> = { ...model.cuisineScores };
  for (const culture of profile.cultures ?? []) {
    const cuisine = cultureToCuisine(culture);
    if (cuisine)
      cuisineScores[cuisine] = Math.max(cuisineScores[cuisine] ?? 0, 80);
  }
  return { ...model, cuisineScores };
}

/**
 * Build a personalised, offline 7-day plan (Mon–Sun) from the spreadsheets.
 * Always returns 7 days. `weekSeed` rotates the picks so "Generate new plan"
 * and successive weeks don't repeat the same meals.
 */
export function buildLocalPlan(
  profile: FamilyProfile,
  model: PreferenceModel,
  weekSeed = 0,
): DayPlan[] {
  const seeded = seedModelFromProfile(model, profile);

  // Pull more than 7 so we can prefer dinners and still have variety.
  const picks = selectMeals(seeded, profile, 16);
  const ordered = picks
    .map(p => ({
      pick: p,
      full: mealDatabase.find(m => m.id === p.meal.id),
    }))
    .filter(x => x.full)
    .sort(
      (a, b) =>
        (OCCASION_RANK[a.full!.occasion] ?? 9) -
        (OCCASION_RANK[b.full!.occasion] ?? 9),
    );

  // Rotate the start point by the week seed for variety, then take 7.
  const meals =
    ordered.length > 0
      ? Array.from(
          { length: 7 },
          (_, i) => ordered[(i + weekSeed) % ordered.length],
        )
      : [];

  const band = ageToBand(profile.childAge);
  const baseDate = new Date();

  return WEEKDAYS.map((day, i): DayPlan => {
    const m = meals[i];
    let meal: DayMeal;
    if (m && m.full) {
      const f = m.full;
      meal = {
        name: f.name,
        reason: m.pick.why[0] ?? 'A balanced, family-friendly choice',
        time: `${f.cookTimeMin} min`,
        ingredients: f.ingredients.slice(0, 6),
        whyHealthier: f.whyHealthier,
      };
    } else {
      meal = {
        name: 'Family favourite',
        reason: 'A balanced, family-friendly choice',
        time: '30 min',
        ingredients: [],
      };
    }

    // Deterministic, personalised activity that differs day to day.
    const quest = selectDailyMovementQuest(band, profile, {
      date: new Date(baseDate.getTime() + i * 86_400_000),
    });
    const activity: DayActivity = {
      name: quest.title,
      description: quest.whyMatters,
      duration: `${quest.durationMin} min`,
      pillar: 'movement',
    };

    return { day, meal, activity };
  });
}
