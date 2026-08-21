// Unit tests for the recipe-from-plan mapping — the Recipe Library is built
// from the weekly plan's meals, so this mapping must always produce a usable
// card (title, ingredients, at least one instruction, a prep time).

import { planMealToRecipe } from '../src/services/recipeFromPlan';
import type { DayMeal } from '../src/services/weeklyPlanStore';

const meal = (over: Partial<DayMeal>): DayMeal => ({
  name: 'Quick Veggie Pasta',
  reason: 'Fast and filling',
  time: '15 min',
  ingredients: ['Pasta', 'Tomatoes'],
  ...over,
});

describe('planMealToRecipe', () => {
  test('maps a plan meal to the card Recipe shape', () => {
    const r = planMealToRecipe(meal({}), 0);

    expect(r.title).toBe('Quick Veggie Pasta');
    expect(r.ingredients).toEqual(['Pasta', 'Tomatoes']);
    expect(r.instructions.length).toBeGreaterThan(0);
    expect(r.prepTime).toBeTruthy();
  });

  test('falls back to plan fields when the meal is not in the recipe DB', () => {
    const r = planMealToRecipe(meal({ name: 'Totally Made Up Meal 123' }), 1);

    expect(r.ingredients).toEqual(['Pasta', 'Tomatoes']);
    // No DB recipe and no takeaway → a single generic instruction.
    expect(r.instructions).toHaveLength(1);
  });
});
