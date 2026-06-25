// ============================================================
// Healthier Meal engine (Phase C.1, from *Optimal Meal Plans* docx).
//
// Deterministic, static-first: every meal gains the parent meal-details
// content WITHOUT a network call — derived from the meal's existing
// classification signals (cuisine / tags / ingredients / vegetarian) plus a
// small curated override table for the most common meals.
//
//   1. whyHealthier   — ≤60 words, vs the common/takeaway version, never shaming
//   2. portions       — age-adjusted, hand-based (fists / palms / handfuls)
//   3. smallWins      — 2–3 "add peas" / "wholewheat" style upgrades
//   4. nutrition      — icon-only snapshot (🟢/🟡 — never a shaming red)
//
// The 👍/👌/👎 family feedback loop already lives in feedbackService.ts and is
// rendered alongside this content in WeeklyPlan.tsx.
//
// Framed on NHS Healthier Families / Eatwell hand-portion guidance. No
// calories, no weight-loss language (doc guardrail).
// ============================================================

import {
  mealDatabase,
  mealLibrary,
  type LibraryMeal,
  type DatabaseMeal,
} from '../data/mealDatabase';

export type NutritionLevel = 'green' | 'amber';

export interface NutritionSnapshot {
  protein: NutritionLevel;
  veg: NutritionLevel;
  fibre: NutritionLevel;
  fats: NutritionLevel;
}

// One row of the hand-based portion guide. Child columns use the CHILD's own
// hand (NHS guidance) — naturally smaller than an adult's, no calorie counting.
export interface PortionRow {
  label: string; // e.g. "Carbs (rice, pasta, potato)"
  icon: string; // emoji for the component
  adult: string;
  age6to8: string;
  age8to10: string;
  age10to12: string;
}

export interface HealthierInfo {
  whyHealthier: string;
  smallWins: string[];
  nutrition: NutritionSnapshot;
  portions: PortionRow[];
}

// What the engine needs to reason about a meal. The weekly plan returns meals
// as freeform names, so callers can pass just a name and we recover the rest
// from the library where possible.
export interface HealthierInput {
  name: string;
  cuisine?: string;
  tags?: string[];
  ingredients?: string[];
  vegetarian?: boolean;
}

// ─── Signal helpers ───────────────────────────────────────────────────────────

const PROTEIN_WORDS = [
  'protein',
  'chicken',
  'fish',
  'egg',
  'eggs',
  'bean',
  'beans',
  'lentil',
  'lentils',
  'chickpea',
  'chickpeas',
  'lamb',
  'beef',
  'mince',
  'tofu',
  'dal',
  'sausage',
  'salmon',
];
const VEG_WORDS = [
  'veg',
  'vegetable',
  'vegetables',
  'salad',
  'pea',
  'peas',
  'tomato',
  'spinach',
  'courgette',
  'pepper',
  'carrot',
  'onion',
  'sweetcorn',
  'broccoli',
  'greens',
];
const FIBRE_WORDS = [
  'wholewheat',
  'wholegrain',
  'wholemeal',
  'brown rice',
  'bean',
  'beans',
  'lentil',
  'lentils',
  'chickpea',
  'chickpeas',
  'oat',
  'oats',
  'veg',
  'vegetable',
];
// Signals that tip "fats" from green to amber (fried / cheese-heavy).
const RICH_FAT_WORDS = ['fry', 'fried', 'cheese', 'cream', 'butter', 'pastry'];

function haystack(input: HealthierInput): string {
  return [
    input.name,
    input.cuisine,
    ...(input.tags ?? []),
    ...(input.ingredients ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function matchesAny(text: string, words: string[]): boolean {
  return words.some(w => text.includes(w));
}

function deriveNutrition(
  input: HealthierInput,
  text: string,
): NutritionSnapshot {
  return {
    protein: input.vegetarian
      ? matchesAny(text, ['bean', 'lentil', 'chickpea', 'egg', 'tofu', 'dal'])
        ? 'green'
        : 'amber'
      : matchesAny(text, PROTEIN_WORDS)
      ? 'green'
      : 'amber',
    veg: matchesAny(text, VEG_WORDS) ? 'green' : 'amber',
    fibre: matchesAny(text, FIBRE_WORDS) ? 'green' : 'amber',
    fats: matchesAny(text, RICH_FAT_WORDS) ? 'amber' : 'green',
  };
}

// ─── Small Wins ─────────────────────────────────────────────────────────────

// Gap-driven first (fix amber pillars), then top up from gentle universals so
// every meal shows 2–3. Order = priority.
const UNIVERSAL_WINS = [
  'Serve the veg first, while they’re hungriest',
  'Add a side of chopped cucumber, carrot or cherry tomatoes',
  'Go easy on the salt — finish with herbs, lemon or a little pepper',
  'Offer water on the table instead of a sugary drink',
];

function deriveSmallWins(n: NutritionSnapshot, text: string): string[] {
  const wins: string[] = [];
  if (n.veg === 'amber')
    wins.push('Stir in a handful of frozen peas, sweetcorn or spinach');
  if (
    n.fibre === 'amber' &&
    matchesAny(text, ['pasta', 'bread', 'wrap', 'rice', 'noodle'])
  )
    wins.push('Swap to wholewheat pasta/bread or brown rice to add fibre');
  if (n.protein === 'amber')
    wins.push('Add beans, lentils or an egg for a protein boost');
  for (const w of UNIVERSAL_WINS) {
    if (wins.length >= 3) break;
    wins.push(w);
  }
  return wins.slice(0, 3);
}

// ─── Why healthier ────────────────────────────────────────────────────────────

// Curated, meal-specific lines for the most common meals (keyed by lower-cased
// name). Each ≤60 words, framed vs the common/shop-bought version, never shaming.
const WHY_OVERRIDES: Record<string, string> = {
  'spaghetti bolognese':
    'Made at home, the sauce is packed with hidden veg and lean mince — so it’s lighter on salt and saturated fat than a jarred or takeaway version, while keeping the comforting taste kids already love.',
  'homemade pizza':
    'A homemade base lets you load on veg and go easy on the cheese, so it has less salt and fat than a shop-bought or delivery pizza — and your child gets the fun of building their own.',
  'chicken curry':
    'Cooking from scratch means a tomato-and-spice base instead of a creamy takeaway sauce — less saturated fat and salt, plus extra veg stirred through, with all the warmth and flavour kept in.',
  'fish fingers & chips':
    'Oven-baked rather than deep-fried, with a portion of peas or salad alongside — that’s less oil and salt than the chip-shop version, while staying a firm family favourite.',
  'chicken fajitas':
    'Loaded with peppers and onions and cooked in a little oil, fajitas are a colourful, build-your-own meal with far less salt than a ready-made kit — and kids love assembling their own.',
};

function deriveWhyHealthier(input: HealthierInput, text: string): string {
  const key = input.name.trim().toLowerCase();
  if (WHY_OVERRIDES[key]) return WHY_OVERRIDES[key];

  const veggie =
    input.vegetarian ||
    matchesAny(text, ['vegetarian', 'bean', 'lentil', 'chickpea']);
  const lead = veggie
    ? 'Built around veg, beans or lentils'
    : 'Made fresh at home';
  return `${lead}, this keeps the flavours your family enjoys while using less salt, sugar and saturated fat than a shop-bought or takeaway version — and it’s easy to add extra veg to bulk it out.`;
}

// ─── Portion guide ────────────────────────────────────────────────────────────

// Hand-based portions (NHS Eatwell). Child columns use the CHILD's OWN hand,
// which naturally scales the portion to their age — no calories, no scales.
function derivePortions(input: HealthierInput, text: string): PortionRow[] {
  const rows: PortionRow[] = [];

  if (
    matchesAny(text, [
      'rice',
      'pasta',
      'potato',
      'noodle',
      'bread',
      'wrap',
      'chapati',
      'flatbread',
    ])
  ) {
    rows.push({
      label: 'Carbs (rice, pasta, potato)',
      icon: '🍚',
      adult: '1 clenched fist',
      age6to8: 'their own small fist',
      age8to10: 'their own fist',
      age10to12: 'their own fist (a little more)',
    });
  }

  const veggie =
    input.vegetarian ||
    matchesAny(text, ['bean', 'lentil', 'chickpea', 'tofu', 'egg', 'dal']);
  rows.push({
    label: veggie ? 'Protein (beans, lentils, egg)' : 'Protein (meat, fish)',
    icon: '🍗',
    adult: '1 palm',
    age6to8: 'their own palm',
    age8to10: 'their own palm',
    age10to12: 'their own palm',
  });

  rows.push({
    label: 'Vegetables',
    icon: '🥦',
    adult: '2 cupped handfuls',
    age6to8: 'their own 2 handfuls',
    age8to10: 'their own 2 handfuls',
    age10to12: 'their own 2+ handfuls',
  });

  rows.push({
    label: 'Healthy fats (oil, cheese)',
    icon: '🧀',
    adult: '1 thumb',
    age6to8: 'their own thumb',
    age8to10: 'their own thumb',
    age10to12: 'their own thumb',
  });

  return rows;
}

// ─── Database match (real authored content) ─────────────────────────────────

// Normalise a freeform meal name so an AI-generated plan name still resolves to
// the spreadsheet record: lower-case, drop parenthetical qualifiers like
// "(Lighter Version)" / "(No-Cook)", collapse punctuation/whitespace.
function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ') // drop "(lighter version)" etc.
    .replace(/[^a-z0-9 ]+/g, ' ') // punctuation → space
    .replace(/\s+/g, ' ')
    .trim();
}

/** Resolve a freeform meal name to its DatabaseMeal, if we have one. */
export function findDatabaseMeal(name: string): DatabaseMeal | undefined {
  const key = normaliseName(name);
  if (!key) return undefined;
  // 1 — exact normalised match.
  const exact = mealDatabase.find(m => normaliseName(m.name) === key);
  if (exact) return exact;
  // 2 — tolerant contains either direction (handles "Healthier X" / extra words).
  return mealDatabase.find(m => {
    const mk = normaliseName(m.name);
    return mk.includes(key) || key.includes(mk);
  });
}

// Real nutrition figures → the icon-only 🟢/🟡 snapshot. Numbers are NEVER
// surfaced (guardrail); they only decide which dot shows. Veg is read from the
// ingredient text since the sheet has no veg-grams column.
function nutritionFromMeal(m: DatabaseMeal): NutritionSnapshot {
  const text = m.ingredients.join(' ').toLowerCase();
  return {
    protein: m.nutrition.protein >= 12 ? 'green' : 'amber',
    veg: matchesAny(text, VEG_WORDS) ? 'green' : 'amber',
    fibre: m.nutrition.fibre >= 5 ? 'green' : 'amber',
    fats: m.nutrition.satFat <= 5 ? 'green' : 'amber',
  };
}

// Authored "small wins" = the dietitian's healthy-swap + further-swap, topped
// up from the gentle universals so the card always shows 2–3.
function smallWinsFromMeal(m: DatabaseMeal): string[] {
  const wins = [m.healthySwap, m.furtherSwap].filter(Boolean) as string[];
  for (const w of UNIVERSAL_WINS) {
    if (wins.length >= 3) break;
    wins.push(w);
  }
  return wins.slice(0, 3);
}

// ─── Recipe (ingredients + method + age servings) ───────────────────────────

export interface Recipe {
  name: string;
  ingredients: string[];
  method: string[];
  servings: { age6to8: string; age8to10: string; age10to12: string; adult: string };
  cookTimeMin: number;
  occasion: string;
}

/** Full recipe for a meal name, or null if it isn't in the database. */
export function getRecipe(name: string): Recipe | null {
  const m = findDatabaseMeal(name);
  if (!m) return null;
  return {
    name: m.name,
    ingredients: m.ingredients,
    method: m.method,
    servings: {
      age6to8: m.portions.age6to8,
      age8to10: m.portions.age8to10,
      age10to12: m.portions.age10to12,
      adult: m.portions.adult,
    },
    cookTimeMin: m.cookTimeMin,
    occasion: m.occasion,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Recover the library record for a freeform meal name, if we have one. */
function libraryMatch(name: string): LibraryMeal | undefined {
  return findDatabaseMeal(name) ?? mealLibrary.find(m => m.name === name);
}

/**
 * All parent meal-details content for a meal. Accepts either a freeform name
 * (recovered against the database) or a fuller HealthierInput. When the meal is
 * one of the 100 spreadsheet meals it returns the dietitian's AUTHORED content;
 * otherwise it falls back to the deterministic heuristic so the UI never has to
 * handle a missing state.
 */
export function getHealthierInfo(meal: string | HealthierInput): HealthierInfo {
  const base: HealthierInput =
    typeof meal === 'string' ? { name: meal } : { ...meal };

  // Prefer the real authored record when the name resolves to the database.
  const db = findDatabaseMeal(base.name);
  if (db) {
    return {
      whyHealthier: db.whyHealthier,
      smallWins: smallWinsFromMeal(db),
      nutrition: nutritionFromMeal(db),
      portions: derivePortions(
        { name: db.name, ingredients: db.ingredients, vegetarian: db.vegetarian },
        haystack({ name: db.name, ingredients: db.ingredients }),
      ),
    };
  }

  // Enrich a bare name from the library where possible (heuristic fallback).
  if (!base.tags || !base.ingredients) {
    const match = libraryMatch(base.name);
    if (match) {
      base.cuisine = base.cuisine ?? match.cuisine;
      base.tags = base.tags ?? match.tags;
      base.ingredients = base.ingredients ?? match.ingredients;
      base.vegetarian = base.vegetarian ?? match.vegetarian;
    }
  }

  const text = haystack(base);
  const nutrition = deriveNutrition(base, text);

  return {
    whyHealthier: deriveWhyHealthier(base, text),
    smallWins: deriveSmallWins(nutrition, text),
    nutrition,
    portions: derivePortions(base, text),
  };
}

// Labels + emoji for the icon-only nutrition snapshot row.
export const NUTRITION_PILLARS: {
  key: keyof NutritionSnapshot;
  label: string;
  icon: string;
}[] = [
  { key: 'protein', label: 'Protein', icon: '💪' },
  { key: 'veg', label: 'Veg', icon: '🥦' },
  { key: 'fibre', label: 'Fibre', icon: '🌾' },
  { key: 'fats', label: 'Fats', icon: '🫒' },
];

export const NUTRITION_DOT: Record<NutritionLevel, string> = {
  green: '🟢',
  amber: '🟡',
};
