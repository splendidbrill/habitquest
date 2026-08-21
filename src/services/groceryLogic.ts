// ============================================================
// Grocery logic — pure functions behind the Grocery List screen.
//
// Extracted from GroceryList.tsx so it can be unit-tested without pulling in
// React Native. Turns the weekly plan's meals into a de-duped, aisle-grouped
// shopping list.
// ============================================================

import type { DayPlan } from './weeklyPlanStore';
import { getRecipe } from './healthierMeal';

export interface GroceryItem {
  id: string;
  item: string;
  category: string;
  checked: boolean;
}

// Rough aisle so the list groups sensibly. Order = the order sections render in.
export const CATEGORY_ORDER = [
  'Fresh Produce',
  'Fruit',
  'Meat & Fish',
  'Dairy & Eggs',
  'Bakery',
  'Frozen',
  'Pantry',
  'Spices & Herbs',
  'Other',
];

/** Best-guess supermarket aisle for an ingredient name. */
export function categorize(name: string): string {
  const n = name.toLowerCase();
  if (/frozen|peas|sweetcorn/.test(n)) return 'Frozen';
  if (
    /chicken|beef|pork|lamb|mince|turkey|sausage|bacon|fish|salmon|prawn|tuna|cod|haddock/.test(
      n,
    )
  )
    return 'Meat & Fish';
  if (/milk|cheese|yogurt|yoghurt|butter|cream|egg|paneer/.test(n))
    return 'Dairy & Eggs';
  if (/bread|wrap|chapati|roti|naan|tortilla|bun|bagel|pitta|pita|bap/.test(n))
    return 'Bakery';
  if (
    /cumin|turmeric|curry powder|paprika|cinnamon|garam|chilli|chili|spice|masala|oregano|basil|thyme|stock cube|bay leaf|clove|cardamom|coriander seed/.test(
      n,
    )
  )
    return 'Spices & Herbs';
  if (
    /apple|banana|orange|berry|grape|melon|mango|pear|peach|plum|kiwi/.test(n)
  )
    return 'Fruit';
  if (
    /rice|pasta|noodle|flour|lentil|dal|dhal|bean|chickpea|oat|stock|oil|tinned|canned|tomato paste|sugar|honey|couscous|quinoa|sauce|coconut milk|passata|breadcrumb/.test(
      n,
    )
  )
    return 'Pantry';
  // Default: assume a fresh vegetable / aromatic.
  return 'Fresh Produce';
}

/**
 * Aggregate every ingredient across the week's meals into a de-duped list.
 * Prefers the plan meal's own ingredient names (clean, dedupe-friendly); falls
 * back to the full database recipe when the plan meal carries none.
 */
export function buildItems(plan: DayPlan[]): GroceryItem[] {
  const seen = new Map<string, GroceryItem>();
  for (const day of plan) {
    const meal = day.meal;
    if (!meal) continue;
    const ings =
      (meal.ingredients?.length
        ? meal.ingredients
        : getRecipe(meal.name)?.ingredients) ?? [];
    for (const raw of ings) {
      const item = raw.trim();
      if (!item) continue;
      const key = item.toLowerCase();
      if (seen.has(key)) continue;
      seen.set(key, {
        id: key,
        item,
        category: categorize(item),
        checked: false,
      });
    }
  }
  return Array.from(seen.values());
}
