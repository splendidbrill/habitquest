import { supabase } from '../lib/supabase';
import type { Pillar } from './syncService';
import { writeWeeklyPillarSnapshot } from './pillarScore';

// ─── Milestone definitions ────────────────────────────────────────────────────
export type StreakMilestone = {
  days: number;
  badgeId: string;
  badgeName: string;
  titleId: string;
  titleLabel: string;
  emoji: string;
  reward: string;
  color: [string, string];
};

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 7,
    badgeId: 'streak-7',
    badgeName: '7-Day Streak',
    titleId: 'streak-starter',
    titleLabel: 'Streak Starter',
    emoji: '🔥',
    reward: 'Flame Badge + "Streak Starter" title',
    color: ['#f97316', '#ea580c'],
  },
  {
    days: 30,
    badgeId: 'streak-30',
    badgeName: '30-Day Streak',
    titleId: 'streak-master',
    titleLabel: 'Streak Master',
    emoji: '💎',
    reward: 'Diamond Badge + "Streak Master" title',
    color: ['#3b82f6', '#2563eb'],
  },
  {
    days: 100,
    badgeId: 'streak-100',
    badgeName: '100-Day Streak',
    titleId: 'streak-legend',
    titleLabel: 'Streak Legend',
    emoji: '👑',
    reward: 'Crown Badge + "Streak Legend" title — exclusive forever',
    color: ['#f59e0b', '#d97706'],
  },
];

// ─── Grant weekly freeze if new week ─────────────────────────────────────────
// Called every time a child opens the app or completes a mission
export async function checkAndGrantWeeklyFreeze(
  childId: string,
): Promise<void> {
  const weekStart = getWeekStart();

  const { data: child } = await supabase
    .from('children')
    .select('streak_freezes, last_freeze_reset')
    .eq('id', childId)
    .single();

  if (!child) return;

  // Already granted a freeze this week
  if (child.last_freeze_reset === weekStart) return;

  // New week — restore one freeze (cap at 1, they don't stack)
  await supabase
    .from('children')
    .update({ streak_freezes: 1, last_freeze_reset: weekStart })
    .eq('id', childId);
}

// ─── Record a completed mission (server-side) ────────────────────────────────
// The single place a child mission completion is persisted to Supabase. It:
//   1. logs the completion to `mission_completions` (feeds the parent Progress
//      tab via calculatePillarScores), and
//   2. advances `children.streak` + `last_active_date` + `xp`.
// Self-guards to once per day per child, so re-mounting the celebration screen
// (or doing a second mission the same day) can't inflate the streak or scores.
// Callers should refreshChild() afterwards so the child UI reflects the change.
export async function recordMissionComplete(
  childId: string,
  pillar: Pillar = 'movement',
  xpReward = 5,
  missionTitle = 'Daily mission',
): Promise<{ newStreak: number; milestone: StreakMilestone | null }> {
  const today = new Date().toISOString().split('T')[0];

  const { data: child } = await supabase
    .from('children')
    .select('streak, last_active_date, xp')
    .eq('id', childId)
    .single();
  if (!child) return { newStreak: 0, milestone: null };

  // The completion row is logged every time (drives pillar scores + the parent
  // Progress "Recent missions" list); streak/XP only advance once per day.
  await supabase.from('mission_completions').insert({
    child_id: childId,
    pillar,
    mission_title: missionTitle,
    xp_earned: xpReward,
  });

  // Re-snapshot this week's pillar scores so the parent Progress tab reflects
  // the new mission immediately (§1.5 / §2.4), not just after a weekly check-in.
  await writeWeeklyPillarSnapshot(childId);

  // Already active today — streak/XP are idempotent per day.
  if (child.last_active_date === today) {
    return { newStreak: child.streak ?? 0, milestone: null };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const newStreak =
    child.last_active_date === yesterdayStr ? (child.streak ?? 0) + 1 : 1;

  const streakBroken =
    child.last_active_date !== yesterdayStr && child.streak > 0;
  const updateData: any = {
    streak: newStreak,
    last_active_date: today,
    xp: (child.xp ?? 0) + xpReward,
  };

  // If streak was broken (skipped a day), store the previous count for revival
  if (streakBroken) {
    updateData.previous_streak_count = child.streak;
    updateData.streak_broken_date = yesterdayStr; // yesterday is when it broke
  }

  await supabase.from('children').update(updateData).eq('id', childId);

  const milestone = await checkStreakMilestone(childId, newStreak);
  return { newStreak, milestone };
}

// ─── Check if a streak just hit a milestone ───────────────────────────────────
// Returns the milestone if newly hit, null otherwise
export async function checkStreakMilestone(
  childId: string,
  newStreak: number,
): Promise<StreakMilestone | null> {
  const milestone = STREAK_MILESTONES.find(m => m.days === newStreak);
  if (!milestone) return null;

  // Check it hasn't already been awarded
  const { data: existing } = await supabase
    .from('badges')
    .select('id')
    .eq('child_id', childId)
    .eq('badge_id', milestone.badgeId)
    .single();

  if (existing) return null; // already earned

  // Award badge
  await supabase.from('badges').insert({
    child_id: childId,
    badge_id: milestone.badgeId,
    badge_name: milestone.badgeName,
  });

  // Award cosmetic title
  await supabase.from('cosmetic_titles').upsert(
    {
      child_id: childId,
      title_id: milestone.titleId,
      title_label: milestone.titleLabel,
    },
    { onConflict: 'child_id,title_id' },
  );

  return milestone;
}

// ─── Check if streak is at risk (no activity today) ──────────────────────────
export async function isStreakAtRisk(childId: string): Promise<boolean> {
  const { data: child } = await supabase
    .from('children')
    .select('last_active_date, streak')
    .eq('id', childId)
    .single();

  if (!child || child.streak === 0) return false;

  const today = new Date().toISOString().split('T')[0];
  return child.last_active_date !== today;
}

// ─── Check if buddy is sad (6-8 — more than 24h inactive) ───────────────────
export async function getBuddyMood(
  childId: string,
): Promise<'happy' | 'sad' | 'worried'> {
  const { data: child } = await supabase
    .from('children')
    .select('last_active_date, streak')
    .eq('id', childId)
    .single();

  if (!child) return 'happy';

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (child.last_active_date === today) return 'happy';
  if (child.last_active_date === yesterdayStr) return 'worried'; // streak at risk
  return 'sad'; // missed more than one day
}

// ─── Load streak freeze status ────────────────────────────────────────────────
export async function loadFreezeStatus(childId: string): Promise<{
  freezesAvailable: number;
  usedThisWeek: boolean;
}> {
  const weekStart = getWeekStart();

  const [childRes, usageRes] = await Promise.all([
    supabase
      .from('children')
      .select('streak_freezes')
      .eq('id', childId)
      .single(),
    supabase
      .from('streak_freeze_usage')
      .select('id')
      .eq('child_id', childId)
      .gte('used_on', weekStart)
      .limit(1),
  ]);

  return {
    freezesAvailable: childRes.data?.streak_freezes ?? 0,
    usedThisWeek: (usageRes.data?.length ?? 0) > 0,
  };
}

// ─── Check if streak revival is available (7 days after break) ───────────────
export async function checkStreakRevivalEligible(
  childId: string,
): Promise<boolean> {
  const { data: child } = await supabase
    .from('children')
    .select('streak_broken_date, streak, streak_revivals')
    .eq('id', childId)
    .single();

  if (!child || !child.streak_broken_date || child.streak !== 0) return false;
  if ((child.streak_revivals ?? 0) <= 0) return false;

  const today = new Date().toISOString().split('T')[0];
  const brokenDate = new Date(child.streak_broken_date);
  const sevenDaysLater = new Date(brokenDate);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const sevenDaysLaterStr = sevenDaysLater.toISOString().split('T')[0];

  return today >= sevenDaysLaterStr;
}

// ─── Get revival status (for UI) ────────────────────────────────────────────
export async function getRevivalStatus(childId: string): Promise<{
  eligible: boolean;
  revivals_remaining: number;
  days_until_eligible: number;
}> {
  const { data: child } = await supabase
    .from('children')
    .select('streak_broken_date, streak, streak_revivals')
    .eq('id', childId)
    .single();

  if (!child || child.streak !== 0 || !child.streak_broken_date) {
    return {
      eligible: false,
      revivals_remaining: child?.streak_revivals ?? 0,
      days_until_eligible: 0,
    };
  }

  const today = new Date().toISOString().split('T')[0];
  const brokenDate = new Date(child.streak_broken_date);
  const sevenDaysLater = new Date(brokenDate);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const sevenDaysLaterStr = sevenDaysLater.toISOString().split('T')[0];

  const daysUntil = Math.ceil(
    (new Date(sevenDaysLaterStr).getTime() - new Date(today).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return {
    eligible: today >= sevenDaysLaterStr && (child.streak_revivals ?? 0) > 0,
    revivals_remaining: child.streak_revivals ?? 0,
    days_until_eligible: Math.max(0, daysUntil),
  };
}

// ─── Perform streak revival (tap the button) ────────────────────────────────
export async function reviveStreak(
  childId: string,
): Promise<{ success: boolean; error?: string }> {
  const { data: child } = await supabase
    .from('children')
    .select('previous_streak_count, streak_revivals')
    .eq('id', childId)
    .single();

  if (!child) return { success: false, error: 'Child not found' };
  if ((child.streak_revivals ?? 0) <= 0) {
    return { success: false, error: 'No revivals remaining' };
  }

  const today = new Date().toISOString().split('T')[0];
  const restoredStreak = child.previous_streak_count ?? 0;

  // Restore streak and log the revival
  await supabase
    .from('children')
    .update({
      streak: restoredStreak,
      streak_revivals: (child.streak_revivals ?? 0) - 1,
      streak_broken_date: null,
      previous_streak_count: 0,
    })
    .eq('id', childId);

  // Log the usage
  await supabase.from('streak_revival_usage').insert({
    child_id: childId,
    used_on: today,
    revived_streak_count: restoredStreak,
  });

  return { success: true };
}

// ─── Check and notify if revival just became eligible ────────────────────
// Call this on app start/focus for each child. Shows once per revival window.
export async function checkAndNotifyRevivalEligible(
  childId: string,
): Promise<void> {
  const eligible = await checkStreakRevivalEligible(childId);
  if (!eligible) return;

  const notificationKey = `streakRevivalNotified:${childId}`;
  const notified = await (
    await import('../utils/storage')
  ).storage.getItem(notificationKey);
  if (notified === '1') return; // Already notified this revival window

  // Mark as notified and show local notification
  await (
    await import('../utils/storage')
  ).storage.setItem(notificationKey, '1');

  // Import Alert here to avoid circular dependencies
  const { Alert } = await import('react-native');
  Alert.alert(
    'Fire Your Streak Can Revive!',
    "You've waited 7 days - tap 'Revive Your Streak' on your home screen to bring it back!",
    [{ text: 'Got it!', style: 'default' }],
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(new Date().setDate(diff)).toISOString().split('T')[0];
}
