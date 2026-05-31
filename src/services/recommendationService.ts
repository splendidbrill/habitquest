import { supabase } from '../lib/supabase';
import missions, { type CatalogMission, type AgeGroup } from '../data/missionCatalog';
import { getCurrentFocusPillar } from './pillarScore';
import type { Pillar } from './syncService';

// ─── Scoring weights ──────────────────────────────────────────────────────────
const W = {
  FOCUS_PILLAR:    30,   // matches current week's focus pillar
  WEAK_PILLAR:     20,   // matches child's lowest-scoring pillar
  EASY_BONUS:      8,    // easy missions get a small boost for engagement
  RECENT_PENALTY: -25,   // completed in last 3 days — avoid repetition
  FOOD_MATCH:      15,   // tags match child's liked foods/activities
  FOOD_AVOID:     -15,   // tags match child's skipped/avoided items
};

export type Recommendation = CatalogMission & { score: number; reason: string };

// ─── Main: get top recommended missions for a child ───────────────────────────
export async function getRecommendedMissions(
  childId: string,
  ageGroup: AgeGroup,
  startDate: string,
): Promise<Recommendation[]> {
  const [focusPillar, weakPillar, recentIds, likedTags, avoidedTags] = await Promise.all([
    getFocusPillar(childId, startDate),
    getWeakestPillar(childId),
    getRecentlyCompletedIds(childId),
    getLikedTags(childId),
    getAvoidedTags(childId),
  ]);

  const pool = missions.filter(m => m.ageGroup === ageGroup);

  const scored: Recommendation[] = pool.map(mission => {
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
    score += matchedLiked  * W.FOOD_MATCH;
    score += matchedAvoided * W.FOOD_AVOID;

    if (matchedLiked > 0 && !reason) reason = `Matches what you enjoy`;

    return { ...mission, score, reason: reason || 'Good for you today' };
  });

  // Sort descending, take top 3
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
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
  const healthy = ['broccoli', 'carrots', 'spinach', 'apple', 'banana', 'chicken',
    'eggs', 'rice', 'oats', 'sweet potato', 'cucumber', 'tomatoes'];

  const encourage = liked.slice(0, 3);
  const reintroduce = skipped
    .filter(f => !liked.includes(f))
    .slice(0, 2);

  return { encourage, reintroduce };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function getFocusPillar(childId: string, startDate: string): Promise<Pillar> {
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
    nutrition:  data.nutrition_score,
    movement:   data.movement_score,
    sleep:      data.sleep_score,
    confidence: data.confidence_score,
  };

  return (Object.entries(scores).sort(([, a], [, b]) => a - b)[0][0] as Pillar);
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

async function getLikedTags(childId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from('food_logs')
    .select('food_item')
    .eq('child_id', childId)
    .in('action', ['liked', 'repeated'])
    .limit(20);

  const items = (data ?? []).map(r => r.food_item.toLowerCase());
  return new Set(items);
}

async function getAvoidedTags(childId: string): Promise<Set<string>> {
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
