// ============================================================
// Recipe-from-plan — pure mapping behind the Recipe Library screen.
//
// Extracted from Recipes.tsx so it can be unit-tested without React Native.
// Turns a meal from the weekly plan into the Recipe shape the card renders,
// enriched with the full database recipe (ingredients + method + cook time)
// when the planned meal resolves to a database meal.
// ============================================================

import type { Recipe } from '../data/recipes';
import type { DayMeal } from './weeklyPlanStore';
import { getRecipe } from './healthierMeal';

export function planMealToRecipe(meal: DayMeal, index: number): Recipe {
  const full = getRecipe(meal.name);
  return {
    id: `${index}-${meal.name}`,
    title: meal.name,
    description: meal.reason || 'From your family’s weekly plan.',
    prepTime: full ? `${full.cookTimeMin} mins` : meal.time || '—',
    servings: 'Family portions',
    ingredients:
      (full?.ingredients?.length ? full.ingredients : meal.ingredients) ?? [],
    instructions: full?.method?.length
      ? full.method
      : meal.familyTakeaway
      ? [meal.familyTakeaway]
      : [
          'A simple, family-friendly meal — combine the ingredients above and cook together.',
        ],
    tips: meal.familyTakeaway || meal.whyHealthier || undefined,
  };
}
