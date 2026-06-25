// ============================================================
// Compatibility shim.
//
// The real meal data now lives in ./mealDatabase.ts (generated from
// "HabitQuest Meal Database.xlsx" — full recipes, age portions, nutrition,
// authored healthier-swap copy). This module is kept only so existing imports
// of `mealLibrary` / `LibraryMeal` keep resolving; prefer importing from
// ./mealDatabase directly in new code.
// ============================================================

export { mealLibrary, mealDatabase } from './mealDatabase';
export type {
  LibraryMeal,
  DatabaseMeal,
  MealOccasion,
  MealPortions,
  MealNutrition,
} from './mealDatabase';
