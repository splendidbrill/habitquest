// ============================================================
// Weekly Plan Store — single source of truth for the family's
// 7-day meal + activity plan.
//
// WeeklyPlan.tsx generates the plan (AI-personalised, 70/20/10) and caches it
// under `WEEKLY_PLAN_KEY`. Everything else that needs to show "the plan" —
// the parent Home "Today's plan", and every child "choose dinner" screen —
// reads it back through here, so parent and child never disagree.
//
// If no plan has been generated yet (e.g. child opens the app before the parent
// visits the Plan tab), readers fall back to FALLBACK_PLAN so the same content
// still shows everywhere.
// ============================================================

import { storage } from '../utils/storage';

export type DayMeal = {
  name: string;
  reason: string;
  time: string;
  cost: string;
  ingredients: string[];
  leftoverNote?: string;
  why?: string[]; // Phase 7 transparency ("Why am I seeing this?")
  // Phase 7 healthy-swap rationale (AI-provided, optional).
  whyHealthier?: string;
  familyTakeaway?: string;
};

export type DayActivity = {
  name: string;
  description: string;
  duration: string;
  pillar: string;
  why?: string[]; // Phase 7 transparency
};

export type DayPlan = {
  day: string;
  meal: DayMeal;
  activity: DayActivity;
};

export const WEEKLY_PLAN_KEY = 'weeklyPlan';
export const WEEKLY_PLAN_DATE_KEY = 'weeklyPlanDate';

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const FALLBACK_PLAN: DayPlan[] = [
  {
    day: 'Monday',
    meal: {
      name: 'Quick Veggie Pasta',
      reason: 'Fast, filling, child-friendly',
      time: '15 min',
      cost: '£3-4',
      ingredients: [
        'Pasta',
        'Tinned tomatoes',
        'Courgette',
        'Garlic',
        'Cheese',
      ],
    },
    activity: {
      name: 'Kick Around',
      description: 'Take a ball outside and practice keepy-uppies or shooting',
      duration: '20 min',
      pillar: 'movement',
    },
  },
  {
    day: 'Tuesday',
    meal: {
      name: 'Pasta Bake (using leftovers)',
      reason: "Transforms Monday's pasta into a new meal, saves money",
      time: '20 min',
      cost: '£1-2',
      ingredients: ['Leftover pasta', 'Extra cheese', 'Tinned tomatoes'],
      leftoverNote: 'Uses leftover pasta from Monday',
    },
    activity: {
      name: 'Indoor Dance Challenge',
      description: 'Pick 3 songs and dance together as a family',
      duration: '15 min',
      pillar: 'confidence',
    },
  },
  {
    day: 'Wednesday',
    meal: {
      name: 'Chicken & Rice One-Pot',
      reason: 'High protein, one pan, minimal washing up',
      time: '30 min',
      cost: '£4-6',
      ingredients: ['Chicken thighs', 'Rice', 'Frozen peas', 'Onion', 'Stock'],
    },
    activity: {
      name: 'Park Explorer Mission',
      description:
        'Walk to the park and try to find 5 different things in nature',
      duration: '30 min',
      pillar: 'movement',
    },
  },
  {
    day: 'Thursday',
    meal: {
      name: 'Rice Bowl (leftovers)',
      reason: 'Leftover chicken and rice with a fresh twist',
      time: '10 min',
      cost: '£1',
      ingredients: ['Leftover chicken & rice', 'Cucumber', 'Yogurt', 'Lemon'],
      leftoverNote: 'Uses leftover chicken & rice from Wednesday',
    },
    activity: {
      name: 'Skill Drills',
      description:
        'Practice a sport skill for 5 minutes each: shooting, balancing, jumping',
      duration: '20 min',
      pillar: 'movement',
    },
  },
  {
    day: 'Friday',
    meal: {
      name: 'Homemade Wraps',
      reason: 'Fun to assemble, everyone chooses their own fillings',
      time: '15 min',
      cost: '£3-5',
      ingredients: ['Wraps', 'Chicken', 'Lettuce', 'Cheese', 'Salsa'],
    },
    activity: {
      name: 'Friday Free Play',
      description: 'Let the child choose any active game they want',
      duration: '30 min',
      pillar: 'confidence',
    },
  },
  {
    day: 'Saturday',
    meal: {
      name: 'Cook Together Meal',
      reason: 'Weekend cooking together builds life skills and confidence',
      time: '45 min',
      cost: '£5-8',
      ingredients: [
        'Choose based on what you have',
        'Make it a family project',
      ],
    },
    activity: {
      name: 'Weekend Quest',
      description:
        'Set a family challenge: who can score the most goals, jump the furthest, etc.',
      duration: '45 min',
      pillar: 'movement',
    },
  },
  {
    day: 'Sunday',
    meal: {
      name: 'Big Family Lunch',
      reason: 'Sunday together, prep for the week ahead',
      time: '40 min',
      cost: '£6-10',
      ingredients: ['Family favourite meal', 'Enough for leftovers Monday'],
    },
    activity: {
      name: 'Prep & Chill',
      description:
        'Prep lunches for next week together, then relax as a family',
      duration: '30 min',
      pillar: 'nutrition',
    },
  },
];

/** Today's weekday name, e.g. "Monday". */
export function todayName(): string {
  return WEEKDAYS[new Date().getDay()];
}

/**
 * The cached weekly plan if the parent has generated one, otherwise the shared
 * FALLBACK_PLAN. Always returns a full 7-day plan so callers never have to
 * handle an empty state.
 */
export async function getWeeklyPlan(): Promise<DayPlan[]> {
  try {
    const cached = await storage.getItem(WEEKLY_PLAN_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as DayPlan[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return FALLBACK_PLAN;
}

/** Today's entry from the shared weekly plan (matched by weekday name). */
export async function getTodaysPlan(): Promise<DayPlan> {
  const plan = await getWeeklyPlan();
  const name = todayName();
  return plan.find(d => d.day === name) ?? plan[0];
}

/**
 * Meal options for a child "choose dinner" screen. The first item is today's
 * planned dinner (so it matches the parent's plan); the rest are other days'
 * meals from the same week, de-duped, to give the child a real choice while
 * staying inside the family's plan.
 */
export async function getTodaysMealOptions(
  max = 4,
): Promise<{ today: DayPlan; options: DayMeal[] }> {
  const plan = await getWeeklyPlan();
  const today = await getTodaysPlan();
  const seen = new Set<string>();
  const options: DayMeal[] = [];
  for (const meal of [today.meal, ...plan.map(d => d.meal)]) {
    if (seen.has(meal.name)) continue;
    seen.add(meal.name);
    options.push(meal);
    if (options.length >= max) break;
  }
  return { today, options };
}
