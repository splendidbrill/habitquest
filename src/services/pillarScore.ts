import { supabase } from '../lib/supabase';
import { Pillar } from './syncService';

// Missions are worth 50% of the score, check-ins are worth 50%
const MISSION_WEIGHT   = 0.5;
const CHECKIN_WEIGHT   = 0.5;
const TARGET_MISSIONS  = 5; // per pillar per week for full mission score

// ─── Calculate full pillar scores ─────────────────────────────────────────────
// Blends mission completions (engagement) with check-in behaviour data (real world)
export async function calculatePillarScores(childId: string): Promise<Record<Pillar, number>> {
  const weekStart = getWeekStart();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [missionsRes, checkinRes] = await Promise.all([
    supabase
      .from('mission_completions')
      .select('pillar')
      .eq('child_id', childId)
      .gte('completed_at', sevenDaysAgo.toISOString()),
    supabase
      .from('pillar_checkins')
      .select('*')
      .eq('child_id', childId)
      .eq('week_start', weekStart)
      .single(),
  ]);

  const missions = missionsRes.data ?? [];
  const checkin  = checkinRes.data;

  // Mission scores (0-100)
  const missionCounts: Record<Pillar, number> = {
    nutrition: 0, movement: 0, sleep: 0, confidence: 0,
  };
  missions.forEach(m => {
    if (m.pillar in missionCounts) missionCounts[m.pillar as Pillar]++;
  });
  const missionScores: Record<Pillar, number> = {
    nutrition:  toScore(missionCounts.nutrition,  TARGET_MISSIONS),
    movement:   toScore(missionCounts.movement,   TARGET_MISSIONS),
    sleep:      toScore(missionCounts.sleep,       TARGET_MISSIONS),
    confidence: toScore(missionCounts.confidence, TARGET_MISSIONS),
  };

  // Check-in scores (0-100) — only if check-in exists this week
  const checkinScores: Record<Pillar, number> = checkin
    ? {
        nutrition:  calcNutritionScore(checkin),
        movement:   calcMovementScore(checkin),
        sleep:      calcSleepScore(checkin),
        confidence: calcConfidenceScore(checkin),
      }
    : { nutrition: 0, movement: 0, sleep: 0, confidence: 0 };

  // If no check-in yet, fall back to missions only
  const hasCheckin = !!checkin;

  return {
    nutrition:  blend(missionScores.nutrition,  checkinScores.nutrition,  hasCheckin),
    movement:   blend(missionScores.movement,   checkinScores.movement,   hasCheckin),
    sleep:      blend(missionScores.sleep,       checkinScores.sleep,      hasCheckin),
    confidence: blend(missionScores.confidence, checkinScores.confidence, hasCheckin),
  };
}

// ─── Write weekly snapshot ────────────────────────────────────────────────────
export async function writeWeeklyPillarSnapshot(childId: string): Promise<void> {
  const scores = await calculatePillarScores(childId);
  const weekStart = getWeekStart();

  await supabase
    .from('pillar_scores')
    .upsert(
      {
        child_id:         childId,
        nutrition_score:  scores.nutrition,
        movement_score:   scores.movement,
        sleep_score:      scores.sleep,
        confidence_score: scores.confidence,
        week_start:       weekStart,
      },
      { onConflict: 'child_id,week_start' },
    );
}

// ─── Load historical scores ───────────────────────────────────────────────────
export async function loadPillarHistory(childId: string) {
  const { data } = await supabase
    .from('pillar_scores')
    .select('*')
    .eq('child_id', childId)
    .order('week_start', { ascending: false })
    .limit(12);

  return data ?? [];
}

// ─── Check if this week's check-in is done ───────────────────────────────────
export async function hasCompletedCheckInThisWeek(childId: string): Promise<boolean> {
  const { data } = await supabase
    .from('pillar_checkins')
    .select('id')
    .eq('child_id', childId)
    .eq('week_start', getWeekStart())
    .single();
  return !!data;
}

// ─── Focus pillar rotation ────────────────────────────────────────────────────
export function getCurrentFocusPillar(referenceDate: string): Pillar {
  const pillars: Pillar[] = ['nutrition', 'movement', 'sleep', 'confidence'];
  const start = new Date(referenceDate);
  const now   = new Date();
  const weeks = Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return pillars[Math.abs(weeks) % pillars.length];
}

// ─── Phase calculation ────────────────────────────────────────────────────────
export function getCurrentPhase(referenceDate: string): 1 | 2 | 3 {
  const start = new Date(referenceDate);
  const now   = new Date();
  const weeks = Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
  if (weeks < 4) return 1;
  if (weeks < 8) return 2;
  return 3;
}

// ─── Per-pillar score formulas ────────────────────────────────────────────────
function calcNutritionScore(c: any): number {
  return Math.round(
    (c.fruit_days / 7)              * 25 +
    (c.veg_days / 7)                * 25 +
    (c.sugary_drinks_avoided / 7)   * 25 +
    (c.family_meals / 7)            * 25,
  );
}

function calcMovementScore(c: any): number {
  return Math.round(
    (c.active_days / 7)             * 40 +
    (Math.min(c.sport_sessions, 5) / 5) * 30 +
    (Math.min(c.outdoor_minutes, 300) / 300) * 30,
  );
}

function calcSleepScore(c: any): number {
  return Math.round(
    (c.consistent_bedtime / 7)      * 40 +
    (c.morning_energy / 5)          * 30 +
    (Math.min(c.sleep_hours_avg, 10) / 10) * 30,
  );
}

function calcConfidenceScore(c: any): number {
  return Math.round(
    (c.mood_avg / 5)                * 40 +
    (c.self_confidence / 5)         * 40 +
    (c.participation_days / 7)      * 20,
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toScore(count: number, target: number): number {
  return Math.min(100, Math.round((count / target) * 100));
}

function blend(missionScore: number, checkinScore: number, hasCheckin: boolean): number {
  if (!hasCheckin) return missionScore;
  return Math.round(missionScore * MISSION_WEIGHT + checkinScore * CHECKIN_WEIGHT);
}

export function getWeekStart(): string {
  const d   = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(new Date().setDate(diff)).toISOString().split('T')[0];
}
