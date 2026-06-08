// ============================================================
// Feedback Service (Phase 6) — meal + activity completion loops.
//
// The doc's single most important signal: "Did everyone actually eat it?"
// Meal reactions are a DISTINCT 4-state value stored in `meal_feedback`
// (NOT overloading food_logs.action). Every reaction is ALSO mirrored into
// `preference_signals` (source='completion') so it feeds the Phase 4
// preference engine — behaviour weighted above stated swipes.
//
// Activity/quest reactions reuse `preference_signals` directly
// (kind='activity', source='completion').
//
// All writes are best-effort: they swallow errors so offline / signed-out
// never blocks the UI, and they no-op without a child id.
// ============================================================

import { mealLibrary } from '../data/mealLibrary';
import { recordPreferenceSignal } from './preferenceEngine';
import { supabase } from '../lib/supabase';

// Stored 4-state. "disaster" is internal only — the UI shows a warm 😬.
export type MealReaction = 'everyone_ate' | 'most_ate' | 'mixed' | 'disaster';

// 3-state quest reaction (loved → not-for-us), mirrors the swipe vocabulary.
export type ActivityReaction = 'loved' | 'okay' | 'not_for_us';

// Base weights; the engine multiplies completion signals by SOURCE_WEIGHT.
// "mixed" is neutral → no preference signal (only the meal_feedback row).
const MEAL_WEIGHT: Record<MealReaction, number> = {
  everyone_ate: 2,
  most_ate: 1,
  mixed: 0,
  disaster: -2,
};

const ACTIVITY_WEIGHT: Record<ActivityReaction, number> = {
  loved: 2,
  okay: 1,
  not_for_us: -1,
};

/**
 * Record a meal reaction: writes the `meal_feedback` row AND, when the
 * reaction carries signal, mirrors it into `preference_signals` keyed by the
 * meal's cuisine (and a couple of tags) so next week's plan adapts.
 */
export async function recordMealFeedback(
  childId: string | null | undefined,
  mealRef: string,
  reaction: MealReaction,
): Promise<void> {
  if (!childId) return;

  // 1 — the dedicated feedback row.
  try {
    await supabase.from('meal_feedback').insert({
      child_id: childId,
      meal_ref: mealRef,
      reaction,
    });
  } catch {
    // best-effort
  }

  // 2 — mirror into the preference model (skip the neutral "mixed").
  const weight = MEAL_WEIGHT[reaction];
  if (weight === 0) return;

  // Match the AI-generated meal name back to the library to learn cuisine/tags.
  const match = mealLibrary.find(
    m => m.name.toLowerCase() === mealRef.trim().toLowerCase(),
  );

  if (match) {
    await recordPreferenceSignal(childId, {
      kind: 'meal',
      attribute: 'cuisine',
      value: match.cuisine,
      weight,
      source: 'completion',
      refId: match.id,
    });
    for (const tag of match.tags.slice(0, 2)) {
      await recordPreferenceSignal(childId, {
        kind: 'meal',
        attribute: 'tag',
        value: tag,
        weight,
        source: 'completion',
        refId: match.id,
      });
    }
  } else {
    // Unknown meal name — still capture a generic signal so it isn't lost.
    await recordPreferenceSignal(childId, {
      kind: 'meal',
      attribute: 'tag',
      value: mealRef.trim().toLowerCase(),
      weight,
      source: 'completion',
    });
  }
}

/**
 * Record an activity/quest reaction into `preference_signals`
 * (kind='activity', source='completion'). Pass `category` and/or `tags`
 * when known (real quests) so the signal maps onto the model's
 * activityScores/tagScores; the freeform weekly-plan activity passes just
 * a name, recorded as a tag.
 */
export async function recordActivityFeedback(
  childId: string | null | undefined,
  activity: {
    refId?: string;
    name: string;
    category?: string;
    tags?: string[];
  },
  reaction: ActivityReaction,
): Promise<void> {
  if (!childId) return;
  const weight = ACTIVITY_WEIGHT[reaction];

  if (activity.category) {
    await recordPreferenceSignal(childId, {
      kind: 'activity',
      attribute: 'category',
      value: activity.category,
      weight,
      source: 'completion',
      refId: activity.refId,
    });
  }

  const tags =
    activity.tags && activity.tags.length
      ? activity.tags
      : [activity.name.trim().toLowerCase()];
  for (const tag of tags.slice(0, 3)) {
    await recordPreferenceSignal(childId, {
      kind: 'activity',
      attribute: 'tag',
      value: tag,
      weight,
      source: 'completion',
      refId: activity.refId,
    });
  }
}
