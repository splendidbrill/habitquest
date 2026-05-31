import { supabase } from '../lib/supabase';

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
export async function checkAndGrantWeeklyFreeze(childId: string): Promise<void> {
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
    { child_id: childId, title_id: milestone.titleId, title_label: milestone.titleLabel },
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
export async function getBuddyMood(childId: string): Promise<'happy' | 'sad' | 'worried'> {
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
    supabase.from('children').select('streak_freezes').eq('id', childId).single(),
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

// ─── Helper ───────────────────────────────────────────────────────────────────
function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(new Date().setDate(diff)).toISOString().split('T')[0];
}
