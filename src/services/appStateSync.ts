// ============================================================
// User App State sync — cloud mirror of the parent's offline-first
// AsyncStorage cache (onboarding answers, swipe preferences, weekly plan).
//
// AsyncStorage stays the on-device source of truth. This module mirrors it
// up to the `user_app_state` row (keyed by parent_id) whenever it changes,
// and restores it on sign-in. That is what lets a returning user keep their
// plan/onboarding after the sign-out data wipe (see AuthContext), while a
// brand-new user — who has no row — correctly starts at onboarding.
//
// Everything here is best-effort: failures (offline / signed-out / paused
// project) are swallowed so the app behaves exactly as it did before, just
// without the cross-device restore.
// ============================================================

import { supabase } from '../lib/supabase';
import { storage } from '../utils/storage';

// AsyncStorage key  <->  user_app_state column. JSONB columns hold parsed
// objects; weekly_plan_date is a plain date string.
const JSON_FIELDS: { key: string; column: string }[] = [
  { key: 'onboardingAnswers', column: 'onboarding_answers' },
  { key: 'cuisinePrefs', column: 'cuisine_prefs' },
  { key: 'activityPrefs', column: 'activity_prefs' },
  { key: 'swipeReactions', column: 'swipe_reactions' },
  { key: 'weeklyPlan', column: 'weekly_plan' },
];
const DATE_KEY = 'weeklyPlanDate';
const DATE_COLUMN = 'weekly_plan_date';

function safeParse(raw: string | null): unknown {
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Mirror the full local cache to the parent's `user_app_state` row.
 * Reads every mirrored key from AsyncStorage and upserts the whole row, so a
 * single call from any change-point keeps the mirror complete and consistent.
 */
export async function pushAppState(): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const row: Record<string, unknown> = {
      parent_id: user.id,
      updated_at: new Date().toISOString(),
    };
    for (const { key, column } of JSON_FIELDS) {
      row[column] = safeParse(await storage.getItem(key));
    }
    row[DATE_COLUMN] = await storage.getItem(DATE_KEY);

    await supabase
      .from('user_app_state')
      .upsert(row, { onConflict: 'parent_id' });
  } catch {
    // best-effort; AsyncStorage already holds the authoritative copy
  }
}

/**
 * Restore the parent's mirrored cache into AsyncStorage. Called on sign-in
 * (after the previous account's data has been wiped) so a returning user sees
 * their own plan/onboarding. No row → no-op, leaving the new user empty so the
 * app routes them through onboarding and the shared fallback plan as usual.
 */
export async function hydrateLocalCache(userId: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('user_app_state')
      .select('*')
      .eq('parent_id', userId)
      .maybeSingle();
    if (error || !data) return;

    for (const { key, column } of JSON_FIELDS) {
      const value = (data as Record<string, unknown>)[column];
      if (value !== null && value !== undefined) {
        await storage.setItem(key, JSON.stringify(value));
      }
    }
    const date = (data as Record<string, unknown>)[DATE_COLUMN];
    if (typeof date === 'string' && date) {
      await storage.setItem(DATE_KEY, date);
    }
    // Restoring onboardingAnswers implies onboarding was completed before.
    if (
      (data as Record<string, unknown>).onboarding_answers !== null &&
      (data as Record<string, unknown>).onboarding_answers !== undefined
    ) {
      await storage.setItem('onboardingComplete', 'true');
    }
  } catch {
    // best-effort; an empty cache simply falls back to onboarding + defaults
  }
}
