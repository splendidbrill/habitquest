// Comprehensive onboarding data interface - Updated for 10 questions
export interface OnboardingData {
  0?: string;      // Welcome
  1?: string;      // Child age
  2?: string[];    // Main goals
  3?: string[];    // Cultural background
  4?: string[];    // Food groups regularly eaten
  5?: string;      // Time for meal prep
  6?: string[];    // Allergies/dietary requirements
  7?: string;      // Current activity level
  8?: string[];    // Space available
  9?: string[];    // Equipment available
  10?: string[];   // What would help
}

// Parse onboarding data from localStorage
export function getOnboardingData(): OnboardingData | null {
  const data = localStorage.getItem("onboardingAnswers");
  if (!data) return null;
  try {
    return JSON.parse(data) as OnboardingData;
  } catch {
    return null;
  }
}

// Check if user has specific dietary requirements
export function hasDietaryRestriction(data: OnboardingData, restriction: string): boolean {
  const allergies = data[6] || [];
  return allergies.includes(restriction);
}

// Get child's age as a number
export function getChildAge(data: OnboardingData): number | null {
  const ageStr = data[1];
  if (!ageStr) return null;
  const match = ageStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Check if family has cultural background
export function hasCulturalBackground(data: OnboardingData, culture: string): boolean {
  const cultures = data[3] || [];
  return cultures.some(c => c.includes(culture));
}

// Get available equipment
export function hasEquipment(data: OnboardingData, equipment: string): boolean {
  const available = data[9] || [];
  return available.some(e => e.includes(equipment));
}

// Get available space
export function hasSpace(data: OnboardingData, space: string): boolean {
  const available = data[8] || [];
  return available.some(s => s.includes(space));
}

// Get meal prep time available
export function getMealPrepTime(data: OnboardingData): string | null {
  return data[5] || null;
}

// Check if quick meals are needed
export function needsQuickMeals(data: OnboardingData): boolean {
  const prepTime = data[5];
  return prepTime?.includes("Under 15") || prepTime?.includes("15-30") || false;
}

// Get activity level
export function getActivityLevel(data: OnboardingData): "low" | "moderate" | "high" | "variable" {
  const level = data[7];
  if (level?.includes("Very active")) return "high";
  if (level?.includes("Moderately active")) return "moderate";
  if (level?.includes("Quite still")) return "low";
  return "variable";
}

// Check what would help the parent
export function wantsGroceryLists(data: OnboardingData): boolean {
  const help = data[10] || [];
  return help.includes("One-click grocery lists");
}

export function wantsPantryMode(data: OnboardingData): boolean {
  const help = data[10] || [];
  return help.includes("Ideas using ingredients I already have");
}

export function wantsSupportForDifficultMoments(data: OnboardingData): boolean {
  const help = data[10] || [];
  return help.includes("Support for difficult moments");
}

export function wantsBudgetFriendly(data: OnboardingData): boolean {
  const help = data[10] || [];
  return help.includes("Budget-friendly options");
}