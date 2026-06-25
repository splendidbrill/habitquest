import type { Pillar } from './syncService';
import { recordMissionComplete, StreakMilestone } from './streakService';

// ─── Real-world activity logging ──────────────────────────────────────────────
// A parent logs something their child did away from the app. We deliberately
// reuse recordMissionComplete so a real-world log behaves identically to an
// in-app mission: it writes a `mission_completions` row (feeding the parent
// Progress "Recent Activity" list + pillar scores via writeWeeklyPillarSnapshot)
// and advances streak/XP idempotently once per day.
//
// The title is prefixed with a star so the parent Progress feed can be read as
// "logged by a grown-up" rather than completed in-app.
export async function logRealWorldActivity(
  childId: string,
  pillar: Pillar,
  label: string,
  xp: number,
): Promise<{ newStreak: number; milestone: StreakMilestone | null }> {
  const title = `🌟 ${label}`;
  return recordMissionComplete(childId, pillar, xp, title);
}
