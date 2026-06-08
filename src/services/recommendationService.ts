import { supabase } from '../lib/supabase';
import missions, {
  type CatalogMission,
  type AgeGroup,
} from '../data/missionCatalog';
import { getCurrentFocusPillar } from './pillarScore';
import type { Pillar } from './syncService';
// Type-only import keeps preferenceEngine out of the module graph at load
// time (it imports back from here) — the value is fetched lazily below.
import type { PreferenceModel } from './preferenceEngine';

// ─── Scoring weights ──────────────────────────────────────────────────────────
const W = {
  FOCUS_PILLAR: 30, // matches current week's focus pillar
  WEAK_PILLAR: 20, // matches child's lowest-scoring pillar
  EASY_BONUS: 8, // easy missions get a small boost for engagement
  RECENT_PENALTY: -25, // completed in last 3 days — avoid repetition
  FOOD_MATCH: 15, // tags match child's liked foods/activities
  FOOD_AVOID: -15, // tags match child's skipped/avoided items
  ACTIVITY_MATCH: 25, // tags align with the preference model's activity DNA
};

// A mission tag is a strong "familiar" signal at/above this model score.
const FAMILIAR_TAG_THRESHOLD = 65;

export type Recommendation = CatalogMission & { score: number; reason: string };

type ActivityBucket = 'familiar' | 'adjacent' | 'new';

// 70 / 20 / 10 split of `total` into whole-number bucket counts.
function activityBucketCounts(total: number): Record<ActivityBucket, number> {
  const familiar = Math.round(total * 0.7);
  const adjacent = Math.round(total * 0.2);
  return { familiar, adjacent, new: Math.max(0, total - familiar - adjacent) };
}

// ─── Main: get top recommended missions for a child ───────────────────────────
export async function getRecommendedMissions(
  childId: string,
  ageGroup: AgeGroup,
  startDate: string,
  model?: PreferenceModel,
): Promise<Recommendation[]> {
  const [focusPillar, weakPillar, recentIds, likedTags, avoidedTags] =
    await Promise.all([
      getFocusPillar(childId, startDate),
      getWeakestPillar(childId),
      getRecentlyCompletedIds(childId),
      getLikedTags(childId),
      getAvoidedTags(childId),
    ]);

  // Fetch the preference model internally when the caller didn't supply one,
  // so existing callers (RecommendedMissions.tsx) keep working unchanged.
  // Lazy import avoids a static cycle with preferenceEngine.
  let prefModel = model;
  if (!prefModel) {
    try {
      const { computePreferenceModel } = await import('./preferenceEngine');
      prefModel = await computePreferenceModel(childId);
    } catch {
      prefModel = undefined;
    }
  }

  const pool = missions.filter(m => m.ageGroup === ageGroup);

  type Scored = { rec: Recommendation; bucket: ActivityBucket };
  const scored: Scored[] = pool.map(mission => {
    let score = 50; // baseline
    let reason = '';

    // Focus pillar bonus
    if (mission.pillar === focusPillar) {
      score += W.FOCUS_PILLAR;
      reason = `Focus pillar this week`;
    }

    // Weak pillar bonus
    if (mission.pillar === weakPillar && mission.pillar !== focusPillar) {
      score += W.WEAK_PILLAR;
      reason = reason || `Needs work on ${weakPillar}`;
    }

    // Easy bonus (helps new users build momentum)
    if (mission.difficulty === 'easy') score += W.EASY_BONUS;

    // Penalise recently completed missions
    if (recentIds.has(mission.id)) {
      score += W.RECENT_PENALTY;
    }

    // Food/activity engagement matching
    const matchedLiked = mission.tags.filter(t => likedTags.has(t)).length;
    const matchedAvoided = mission.tags.filter(t => avoidedTags.has(t)).length;
    score += matchedLiked * W.FOOD_MATCH;
    score += matchedAvoided * W.FOOD_AVOID;

    if (matchedLiked > 0 && !reason) reason = `Matches what you enjoy`;

    // Phase 5 activity engine: align with the preference model's activity DNA
    // and classify into familiar / adjacent / new for the 70/20/10 split.
    let bucket: ActivityBucket = 'new';
    if (prefModel) {
      let activitySignal = 0;
      let hasSignal = false;
      let strong = false;
      for (const t of mission.tags) {
        const ts = prefModel.tagScores[t];
        if (ts !== undefined) {
          activitySignal += ts - 50;
          hasSignal = true;
          if (ts >= FAMILIAR_TAG_THRESHOLD) strong = true;
        }
      }
      score += (activitySignal / 50) * W.ACTIVITY_MATCH;
      if (strong) {
        bucket = 'familiar';
        if (!reason) reason = `Matches what your child loves`;
      } else if (hasSignal) {
        bucket = 'adjacent';
      }
    }

    return {
      rec: { ...mission, score, reason: reason || 'Good for you today' },
      bucket,
    };
  });

  scored.sort((a, b) => b.rec.score - a.rec.score);

  // Apply 70/20/10 across the ranked pool, spilling to top-scored leftovers
  // so we always return 3 (and stay backward-compatible when there's no signal).
  const TOP = 3;
  const want = activityBucketCounts(TOP);
  const used = new Set<string>();
  const result: Recommendation[] = [];

  const draw = (bucket: ActivityBucket, n: number) => {
    for (const s of scored) {
      if (result.length >= TOP || n <= 0) break;
      if (s.bucket !== bucket || used.has(s.rec.id)) continue;
      used.add(s.rec.id);
      result.push(s.rec);
      n--;
    }
  };

  draw('familiar', want.familiar);
  draw('adjacent', want.adjacent);
  draw('new', want.new);

  for (const s of scored) {
    if (result.length >= TOP) break;
    if (used.has(s.rec.id)) continue;
    used.add(s.rec.id);
    result.push(s.rec);
  }

  return result.slice(0, TOP);
}

// ─── Food recommendations for parent dashboard ────────────────────────────────
export async function getFoodRecommendations(childId: string): Promise<{
  encourage: string[];
  reintroduce: string[];
}> {
  const [liked, skipped] = await Promise.all([
    getLikedFoods(childId),
    getSkippedFoods(childId),
  ]);

  // Suggest foods not yet tried from common healthy foods
  const healthy = [
    'broccoli',
    'carrots',
    'spinach',
    'apple',
    'banana',
    'chicken',
    'eggs',
    'rice',
    'oats',
    'sweet potato',
    'cucumber',
    'tomatoes',
  ];

  const encourage = liked.slice(0, 3);
  const reintroduce = skipped.filter(f => !liked.includes(f)).slice(0, 2);

  return { encourage, reintroduce };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function getFocusPillar(
  childId: string,
  startDate: string,
): Promise<Pillar> {
  return getCurrentFocusPillar(startDate);
}

async function getWeakestPillar(childId: string): Promise<Pillar> {
  const { data } = await supabase
    .from('pillar_scores')
    .select('nutrition_score, movement_score, sleep_score, confidence_score')
    .eq('child_id', childId)
    .order('week_start', { ascending: false })
    .limit(1)
    .single();

  if (!data) return 'nutrition';

  const scores: Record<Pillar, number> = {
    nutrition: data.nutrition_score,
    movement: data.movement_score,
    sleep: data.sleep_score,
    confidence: data.confidence_score,
  };

  return Object.entries(scores).sort(([, a], [, b]) => a - b)[0][0] as Pillar;
}

async function getRecentlyCompletedIds(childId: string): Promise<Set<string>> {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const { data } = await supabase
    .from('mission_completions')
    .select('mission_id')
    .eq('child_id', childId)
    .gte('completed_at', threeDaysAgo.toISOString());

  return new Set((data ?? []).map(r => r.mission_id));
}

export async function getLikedTags(childId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from('food_logs')
    .select('food_item')
    .eq('child_id', childId)
    .in('action', ['liked', 'repeated'])
    .limit(20);

  const items = (data ?? []).map(r => r.food_item.toLowerCase());
  return new Set(items);
}

export async function getAvoidedTags(childId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from('food_logs')
    .select('food_item')
    .eq('child_id', childId)
    .eq('action', 'skipped')
    .limit(20);

  const items = (data ?? []).map(r => r.food_item.toLowerCase());
  return new Set(items);
}

async function getLikedFoods(childId: string): Promise<string[]> {
  const { data } = await supabase
    .from('food_logs')
    .select('food_item')
    .eq('child_id', childId)
    .in('action', ['liked', 'repeated'])
    .order('logged_at', { ascending: false })
    .limit(10);

  return [...new Set((data ?? []).map(r => r.food_item))];
}

async function getSkippedFoods(childId: string): Promise<string[]> {
  const { data } = await supabase
    .from('food_logs')
    .select('food_item')
    .eq('child_id', childId)
    .eq('action', 'skipped')
    .order('logged_at', { ascending: false })
    .limit(10);

  return [...new Set((data ?? []).map(r => r.food_item))];
}
