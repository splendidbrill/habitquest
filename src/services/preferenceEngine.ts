// ============================================================
// Family Preference Engine (Phase 4) — the "Health DNA".
//
// computePreferenceModel(childId) aggregates THREE signal sources into
// one deterministic, local model (no AI call):
//   1. preference_signals  (swipe / completion / micro_q) — DB
//   2. local swipe prefs    (cuisinePrefs / activityPrefs) — AsyncStorage
//   3. food_logs + mission_completions — behavioural truth
//
// Guardrail: behaviour > stated preference. Completion signals are
// weighted far above swipes (SOURCE_WEIGHT below).
// ============================================================

import { supabase } from '../lib/supabase';
import missions from '../data/missionCatalog';
import { loadFamilyProfile } from '../data/familyProfile';
import { getLikedTags, getAvoidedTags } from './recommendationService';
import { storage } from '../utils/storage';

export type SignalSource = 'swipe' | 'completion' | 'micro_q';

// Behaviour > stated preference: a completed quest/meal counts ~3x a swipe.
const SOURCE_WEIGHT: Record<SignalSource, number> = {
  swipe: 1,
  micro_q: 1.5,
  completion: 3,
};

const FOOD_LOG_WEIGHT = 2; // liked/repeated food_log ~ a strong signal

export interface Percentage {
  label: string;
  pct: number;
}

// When the family actually completes quests, learned from mission_completions
// timestamps. Friendly labels, not raw clock times. (Doc: "6pm weekdays,
// 10am weekends — AI adjusts accordingly.")
export interface TimePatterns {
  weekday: string | null; // peak window on weekdays, e.g. "after school"
  weekend: string | null; // peak window at weekends, e.g. "mornings"
  hasTimeSignal: boolean;
}

export interface PreferenceModel {
  cuisineScores: Record<string, number>; // 0–100
  activityScores: Record<string, number>; // 0–100
  tagScores: Record<string, number>; // 0–100
  topCuisines: Percentage[];
  topActivities: Percentage[];
  timePatterns: TimePatterns;
  hasSignal: boolean;
}

// Bucket an hour-of-day into a friendly window label.
function timeWindow(hour: number): string {
  if (hour < 11) return 'mornings';
  if (hour < 15) return 'around midday';
  if (hour < 18) return 'after school';
  if (hour < 21) return 'evenings';
  return 'late evenings';
}

function topLabel(counts: Record<string, number>): string | null {
  let best: string | null = null;
  let bestN = 0;
  for (const [label, n] of Object.entries(counts)) {
    if (n > bestN) {
      best = label;
      bestN = n;
    }
  }
  return best;
}

function deriveTimePatterns(
  rows: Array<{ completed_at?: string | null }>,
): TimePatterns {
  const weekday: Record<string, number> = {};
  const weekend: Record<string, number> = {};
  for (const row of rows) {
    if (!row.completed_at) continue;
    const d = new Date(row.completed_at);
    if (Number.isNaN(d.getTime())) continue;
    const day = d.getDay(); // 0 Sun … 6 Sat
    const bucket = day === 0 || day === 6 ? weekend : weekday;
    bucket[timeWindow(d.getHours())] =
      (bucket[timeWindow(d.getHours())] ?? 0) + 1;
  }
  const wk = topLabel(weekday);
  const we = topLabel(weekend);
  return {
    weekday: wk,
    weekend: we,
    hasTimeSignal: wk !== null || we !== null,
  };
}

type PrefRow = {
  kind: 'meal' | 'activity';
  attribute: string;
  value: string;
  weight: number;
  source: SignalSource;
};

// Raw weighted score -> 0–100 percentage. A couple of "loved" reactions
// (weight 2 each) lands a cuisine in the ~70–90 band; sustained
// completions push toward the high 90s, matching the doc's "Indian 95%".
function toPct(raw: number): number {
  return Math.max(5, Math.min(99, Math.round(50 + raw * 8)));
}

function add(map: Record<string, number>, key: string, amount: number) {
  if (!key) return;
  map[key] = (map[key] ?? 0) + amount;
}

function toPctMap(raw: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) out[k] = toPct(v);
  return out;
}

function topN(pctMap: Record<string, number>, n: number): Percentage[] {
  return Object.entries(pctMap)
    .map(([label, pct]) => ({ label, pct }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, n);
}

export async function computePreferenceModel(
  childId: string,
): Promise<PreferenceModel> {
  const cuisineRaw: Record<string, number> = {};
  const activityRaw: Record<string, number> = {};
  const tagRaw: Record<string, number> = {};

  // 1 — local swipe-derived prefs (already aggregated reaction weights).
  const profile = await loadFamilyProfile();
  if (profile) {
    for (const [c, v] of Object.entries(profile.cuisinePrefs)) {
      add(cuisineRaw, c, v * SOURCE_WEIGHT.swipe);
    }
    for (const [a, v] of Object.entries(profile.activityPrefs)) {
      add(activityRaw, a, v * SOURCE_WEIGHT.swipe);
    }
  }

  // 2 — DB preference_signals (swipe + completion + micro_q).
  const { data: signals } = await supabase
    .from('preference_signals')
    .select('kind, attribute, value, weight, source')
    .eq('child_id', childId)
    .limit(500);

  for (const row of (signals ?? []) as PrefRow[]) {
    const w = row.weight * (SOURCE_WEIGHT[row.source] ?? 1);
    if (row.attribute === 'cuisine') add(cuisineRaw, row.value, w);
    else if (row.attribute === 'category') add(activityRaw, row.value, w);
    else add(tagRaw, row.value, w);
  }

  // 3 — behavioural truth from food_logs (reuse recommendationService).
  const [likedTags, avoidedTags] = await Promise.all([
    getLikedTags(childId),
    getAvoidedTags(childId),
  ]);
  for (const t of likedTags) add(tagRaw, t, FOOD_LOG_WEIGHT);
  for (const t of avoidedTags) add(tagRaw, t, -FOOD_LOG_WEIGHT);

  // 4 — mission_completions per tag (strong completion signal).
  const { data: completions } = await supabase
    .from('mission_completions')
    .select('mission_id, completed_at')
    .eq('child_id', childId)
    .limit(200);

  for (const row of completions ?? []) {
    const mission = missions.find(m => m.id === row.mission_id);
    if (!mission) continue;
    for (const tag of mission.tags) add(tagRaw, tag, SOURCE_WEIGHT.completion);
  }

  // When this family tends to be active (weekday vs weekend windows).
  const timePatterns = deriveTimePatterns(completions ?? []);

  const cuisineScores = toPctMap(cuisineRaw);
  const activityScores = toPctMap(activityRaw);
  const tagScores = toPctMap(tagRaw);

  return {
    cuisineScores,
    activityScores,
    tagScores,
    topCuisines: topN(cuisineScores, 5),
    topActivities: topN(activityScores, 5),
    timePatterns,
    hasSignal:
      Object.keys(cuisineRaw).length > 0 ||
      Object.keys(activityRaw).length > 0 ||
      Object.keys(tagRaw).length > 0,
  };
}

/**
 * Best-effort write of a single preference signal to the DB.
 * Used by onboarding swipe flush (source='swipe') and, later, meal/quest
 * completion feedback (Phase 6, source='completion'). Swallows errors so
 * offline/sign-out never blocks the UI.
 */
export async function recordPreferenceSignal(
  childId: string,
  signal: {
    kind: 'meal' | 'activity';
    attribute: string;
    value: string;
    weight: number;
    source: SignalSource;
    refId?: string;
  },
): Promise<void> {
  try {
    await supabase.from('preference_signals').insert({
      child_id: childId,
      kind: signal.kind,
      attribute: signal.attribute,
      value: signal.value,
      weight: signal.weight,
      source: signal.source,
      ref_id: signal.refId ?? null,
    });
  } catch {
    // best-effort; local prefs already captured the signal
  }
}

/**
 * Flush locally-stored onboarding swipe reactions into preference_signals
 * for a child once a child row exists (onboarding has no child yet).
 * Idempotent per child via a local flushed flag. Best-effort.
 */
export async function flushSwipeSignals(childId: string): Promise<void> {
  const profile = await loadFamilyProfile();
  if (!profile) return;

  const flushKey = `swipeSignalsFlushed:${childId}`;
  if (await storage.getItem(flushKey)) return;

  const rows: Array<{
    child_id: string;
    kind: 'meal' | 'activity';
    attribute: string;
    value: string;
    weight: number;
    source: SignalSource;
  }> = [];

  for (const [cuisine, weight] of Object.entries(profile.cuisinePrefs)) {
    rows.push({
      child_id: childId,
      kind: 'meal',
      attribute: 'cuisine',
      value: cuisine,
      weight,
      source: 'swipe',
    });
  }
  for (const [category, weight] of Object.entries(profile.activityPrefs)) {
    rows.push({
      child_id: childId,
      kind: 'activity',
      attribute: 'category',
      value: category,
      weight,
      source: 'swipe',
    });
  }
  if (rows.length === 0) return;

  try {
    await supabase.from('preference_signals').insert(rows);
    await storage.setItem(flushKey, 'true');
  } catch {
    // best-effort; retry on next call since flag isn't set
  }
}
