import { supabase } from '../lib/supabase';
import { checkStreakMilestone, checkAndGrantWeeklyFreeze, StreakMilestone } from './streakService';
import {
  cancelStreakAtRiskWarning,
  scheduleStreakAtRiskWarning,
  notifyParentMissionComplete,
  showStreakMilestoneNotification,
} from './notificationService';

export type Pillar = 'nutrition' | 'movement' | 'sleep' | 'confidence';

// ─── Mission completion ───────────────────────────────────────────────────────
// Returns a StreakMilestone if the child just hit 7, 30, or 100 days
export async function syncMissionComplete(
  childId: string,
  missionId: string,
  missionTitle: string,
  pillar: Pillar,
  xpEarned: number,
): Promise<StreakMilestone | null> {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // 1. Write mission completion row
  await supabase.from('mission_completions').insert({
    child_id: childId,
    mission_id: missionId,
    mission_title: missionTitle,
    pillar,
    xp_earned: xpEarned,
  });

  // 2. Fetch current child data for streak + XP calculation
  const { data: child } = await supabase
    .from('children')
    .select('xp, streak, last_active_date, streak_freezes')
    .eq('id', childId)
    .single();

  if (!child) return;

  const lastActive = child.last_active_date;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = child.streak;

  if (lastActive === today) {
    // Already active today — just add XP, don't change streak
  } else if (lastActive === yesterdayStr) {
    // Consecutive day — increment streak
    newStreak = child.streak + 1;
  } else {
    // Streak broken — reset to 1
    newStreak = 1;
  }

  const newXP = child.xp + xpEarned;
  const newLevel = calculateLevel(newXP);

  // 3. Update child row
  await supabase
    .from('children')
    .update({
      xp: newXP,
      level: newLevel,
      streak: newStreak,
      last_active_date: today,
    })
    .eq('id', childId);

  // 4. Grant weekly freeze if new week
  await checkAndGrantWeeklyFreeze(childId);

  // 5. Check if this streak just hit a milestone
  const milestone = await checkStreakMilestone(childId, newStreak);

  // 6. Cancel any streak-at-risk warning (mission done today)
  cancelStreakAtRiskWarning().catch(() => {});

  // 7. Schedule tomorrow's streak-at-risk warning
  const { data: childRow } = await supabase
    .from('children')
    .select('name, parent_id')
    .eq('id', childId)
    .single();

  if (childRow) {
    scheduleStreakAtRiskWarning(childRow.name, newStreak).catch(() => {});

    // 8. Notify parent that mission was completed
    notifyParentMissionComplete(childRow.parent_id, childRow.name, missionTitle).catch(() => {});
  }

  // 9. Show local milestone notification if one was hit
  if (milestone && childRow) {
    showStreakMilestoneNotification(childRow.name, milestone.days, milestone.reward).catch(() => {});
  }

  return milestone;
}

// ─── Badge earned ─────────────────────────────────────────────────────────────
export async function syncBadgeEarned(
  childId: string,
  badgeId: string,
  badgeName: string,
): Promise<void> {
  // upsert — silently ignores if badge already earned (unique constraint)
  await supabase
    .from('badges')
    .upsert({ child_id: childId, badge_id: badgeId, badge_name: badgeName }, { onConflict: 'child_id,badge_id' });
}

// ─── Food log ─────────────────────────────────────────────────────────────────
export async function syncFoodLog(
  childId: string,
  foodItem: string,
  action: 'tried' | 'liked' | 'skipped' | 'repeated',
): Promise<void> {
  await supabase.from('food_logs').insert({ child_id: childId, food_item: foodItem, action });
}

// ─── Mood log (10-12 only — private) ─────────────────────────────────────────
export async function syncMoodLog(
  childId: string,
  moodLevel: number,
  energyLevel: number,
): Promise<void> {
  await supabase.from('mood_logs').insert({ child_id: childId, mood_level: moodLevel, energy_level: energyLevel });
}

// ─── Game score ───────────────────────────────────────────────────────────────
export async function syncGameScore(
  childId: string,
  gameId: string,
  score: number,
): Promise<void> {
  await supabase.from('game_scores').insert({ child_id: childId, game_id: gameId, score });
}

// ─── Streak freeze usage ──────────────────────────────────────────────────────
export async function useStreakFreeze(childId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];

  const { data: child } = await supabase
    .from('children')
    .select('streak_freezes')
    .eq('id', childId)
    .single();

  if (!child || child.streak_freezes < 1) return false;

  const { error } = await supabase
    .from('streak_freeze_usage')
    .insert({ child_id: childId, used_on: today });

  if (error) return false;

  await supabase
    .from('children')
    .update({ streak_freezes: child.streak_freezes - 1, last_active_date: today })
    .eq('id', childId);

  return true;
}

// ─── Load full child snapshot ─────────────────────────────────────────────────
export async function loadChildSnapshot(childId: string) {
  const [childRes, badgesRes, missionsRes] = await Promise.all([
    supabase.from('children').select('*').eq('id', childId).single(),
    supabase.from('badges').select('badge_id, badge_name, earned_at').eq('child_id', childId),
    supabase
      .from('mission_completions')
      .select('mission_id, pillar, xp_earned, completed_at')
      .eq('child_id', childId)
      .order('completed_at', { ascending: false })
      .limit(50),
  ]);

  return {
    child: childRes.data,
    badges: badgesRes.data ?? [],
    recentMissions: missionsRes.data ?? [],
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calculateLevel(xp: number): string {
  if (xp >= 500) return 'All-Star';
  if (xp >= 200) return 'Pro';
  if (xp >= 50)  return 'Starter';
  return 'Rookie';
}
