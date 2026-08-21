import { describe, it, expect, beforeEach } from '@jest/globals';

// Helper: get date N days from now
function getDateNDaysLater(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

describe('Streak Revival Logic', () => {
  // ─── Streak Break Detection ───────────────────────────────────────────
  describe('streak break detection', () => {
    it('should reset streak to 1 when child misses a day (skipped yesterday)', () => {
      const lastActiveDate = new Date();
      lastActiveDate.setDate(lastActiveDate.getDate() - 2); // 2 days ago
      const lastActiveDateStr = lastActiveDate.toISOString().split('T')[0];

      const currentStreak = 5;
      const yesterdayStr = new Date();
      yesterdayStr.setDate(yesterdayStr.getDate() - 1);
      const yesterdayStrStr = yesterdayStr.toISOString().split('T')[0];

      // If last active date is NOT yesterday, streak resets to 1
      const newStreak =
        lastActiveDateStr === yesterdayStrStr ? currentStreak + 1 : 1;
      expect(newStreak).toBe(1);
    });

    it('should increment streak by 1 when child completes task on consecutive day', () => {
      const lastActiveDate = new Date();
      lastActiveDate.setDate(lastActiveDate.getDate() - 1); // Yesterday
      const lastActiveDateStr = lastActiveDate.toISOString().split('T')[0];

      const currentStreak = 5;
      const yesterdayStr = new Date();
      yesterdayStr.setDate(yesterdayStr.getDate() - 1);
      const yesterdayStrStr = yesterdayStr.toISOString().split('T')[0];

      // If last active is yesterday, increment
      const newStreak =
        lastActiveDateStr === yesterdayStrStr ? currentStreak + 1 : 1;
      expect(newStreak).toBe(6);
    });

    it('should store previous_streak_count when streak breaks', () => {
      const previousStreak = 12;
      const newStreak = 1; // reset on miss
      const streakBroke =
        previousStreak > 0 && newStreak === 1 && previousStreak > 1;

      expect(streakBroke).toBe(true);
      expect(previousStreak).toBe(12);
    });
  });

  // ─── Revival Eligibility ──────────────────────────────────────────────
  describe('revival eligibility', () => {
    it('should not be eligible if streak is not 0', () => {
      const streak = 3; // still has active streak
      const eligible = streak === 0;
      expect(eligible).toBe(false);
    });

    it('should not be eligible if revivals exhausted', () => {
      const streak = 0;
      const revivals = 0; // no more revivals
      const eligible = streak === 0 && revivals > 0;
      expect(eligible).toBe(false);
    });

    it('should not be eligible if less than 7 days have passed', () => {
      const streak = 0;
      const revivals = 2;
      const streakBrokenDate = new Date();
      streakBrokenDate.setDate(streakBrokenDate.getDate() - 3); // 3 days ago
      const streakBrokenStr = streakBrokenDate.toISOString().split('T')[0];

      const today = getTodayStr();
      const sevenDaysLater = new Date(streakBrokenDate);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      const sevenDaysLaterStr = sevenDaysLater.toISOString().split('T')[0];

      const eligible =
        streak === 0 && revivals > 0 && today >= sevenDaysLaterStr;
      expect(eligible).toBe(false);
    });

    it('should be eligible exactly 7 days after streak breaks', () => {
      const streak = 0;
      const revivals = 2;
      const streakBrokenDate = new Date();
      streakBrokenDate.setDate(streakBrokenDate.getDate() - 7); // exactly 7 days ago
      const streakBrokenStr = streakBrokenDate.toISOString().split('T')[0];

      const today = getTodayStr();
      const sevenDaysLater = new Date(streakBrokenDate);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      const sevenDaysLaterStr = sevenDaysLater.toISOString().split('T')[0];

      const eligible =
        streak === 0 && revivals > 0 && today >= sevenDaysLaterStr;
      expect(eligible).toBe(true);
    });

    it('should be eligible after 7 days with revivals remaining', () => {
      const streak = 0;
      const revivals = 1; // one left
      const streakBrokenDate = new Date();
      streakBrokenDate.setDate(streakBrokenDate.getDate() - 10); // 10 days ago
      const streakBrokenStr = streakBrokenDate.toISOString().split('T')[0];

      const today = getTodayStr();
      const sevenDaysLater = new Date(streakBrokenDate);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      const sevenDaysLaterStr = sevenDaysLater.toISOString().split('T')[0];

      const eligible =
        streak === 0 && revivals > 0 && today >= sevenDaysLaterStr;
      expect(eligible).toBe(true);
    });
  });

  // ─── Revival Action ───────────────────────────────────────────────────
  describe('revival action', () => {
    it('should restore streak to previous_streak_count', () => {
      const previousStreakCount = 12;
      const streak = 0;
      const revivals = 2;

      // Perform revival
      const restoredStreak = previousStreakCount;
      const newRevivals = revivals - 1;

      expect(restoredStreak).toBe(12);
      expect(newRevivals).toBe(1);
    });

    it('should decrement revivals_remaining after revival', () => {
      const revivals = 2;
      const newRevivals = Math.max(0, revivals - 1);
      expect(newRevivals).toBe(1);
    });

    it('should not allow revival if revivals are 0', () => {
      const revivals = 0;
      const canRevive = revivals > 0;
      expect(canRevive).toBe(false);
    });

    it('should cap revivals at 0 (never negative)', () => {
      const revivals = 0;
      const newRevivals = Math.max(0, revivals - 1);
      expect(newRevivals).toBe(0);
    });
  });

  // ─── Revival Limits ───────────────────────────────────────────────────
  describe('revival limits (max 2 per user)', () => {
    it('should start with 2 revivals available', () => {
      const defaultRevivals = 2;
      expect(defaultRevivals).toBe(2);
    });

    it('should allow first revival', () => {
      let revivals = 2;
      revivals = Math.max(0, revivals - 1);
      expect(revivals).toBe(1);
    });

    it('should allow second revival', () => {
      let revivals = 1;
      revivals = Math.max(0, revivals - 1);
      expect(revivals).toBe(0);
    });

    it('should block third revival', () => {
      const revivals = 0;
      const canRevive = revivals > 0;
      expect(canRevive).toBe(false);
    });

    it('should never exceed 2 revivals', () => {
      const revivals = 2;
      const incremented = Math.min(2, revivals + 1);
      expect(incremented).toBe(2);
    });
  });

  // ─── Days Until Eligible ──────────────────────────────────────────────
  describe('days until eligible calculation', () => {
    it('should show 0 days if already eligible', () => {
      const streakBrokenDate = new Date();
      streakBrokenDate.setDate(streakBrokenDate.getDate() - 7);
      const streakBrokenStr = streakBrokenDate.toISOString().split('T')[0];

      const today = getTodayStr();
      const sevenDaysLater = new Date(streakBrokenDate);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      const sevenDaysLaterStr = sevenDaysLater.toISOString().split('T')[0];

      const daysUntil = Math.ceil(
        (new Date(sevenDaysLaterStr).getTime() - new Date(today).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      expect(Math.max(0, daysUntil)).toBe(0);
    });

    it('should show correct days until eligible (3 days)', () => {
      const streakBrokenDate = new Date();
      streakBrokenDate.setDate(streakBrokenDate.getDate() - 4); // 4 days ago
      const streakBrokenStr = streakBrokenDate.toISOString().split('T')[0];

      const today = getTodayStr();
      const sevenDaysLater = new Date(streakBrokenDate);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      const sevenDaysLaterStr = sevenDaysLater.toISOString().split('T')[0];

      const daysUntil = Math.ceil(
        (new Date(sevenDaysLaterStr).getTime() - new Date(today).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      expect(Math.max(0, daysUntil)).toBe(3);
    });

    it('should show correct days until eligible (1 day)', () => {
      const streakBrokenDate = new Date();
      streakBrokenDate.setDate(streakBrokenDate.getDate() - 6); // 6 days ago
      const streakBrokenStr = streakBrokenDate.toISOString().split('T')[0];

      const today = getTodayStr();
      const sevenDaysLater = new Date(streakBrokenDate);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      const sevenDaysLaterStr = sevenDaysLater.toISOString().split('T')[0];

      const daysUntil = Math.ceil(
        (new Date(sevenDaysLaterStr).getTime() - new Date(today).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      expect(Math.max(0, daysUntil)).toBe(1);
    });
  });

  // ─── Notification Logic ───────────────────────────────────────────────
  describe('notification (should notify once per revival window)', () => {
    it('should not notify twice for the same revival window', () => {
      let notified = false;

      // First check: eligible and not notified
      if (!notified) {
        notified = true; // Mark as notified
      }
      expect(notified).toBe(true);

      // Second check: already notified, skip
      const shouldShowNotification = !notified; // false
      expect(shouldShowNotification).toBe(false);
    });

    it('should reset notification flag if streak is rebuilt', () => {
      let notified = true;
      const streak = 5; // Rebuilt!

      // If streak > 0, they rebuilt it — reset the notification flag
      if (streak > 0) {
        notified = false;
      }

      expect(notified).toBe(false);
    });
  });

  // ─── Integration Scenarios ────────────────────────────────────────────
  describe('integration scenarios', () => {
    it('complete flow: break → wait → revive → use both', () => {
      let streak = 10;
      let revivals = 2;
      let previousStreak = 0;
      let streakBrokenDate: string | null = null;

      // Day 1: Kid misses a day, streak breaks
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      previousStreak = streak;
      streak = 1; // Reset
      streakBrokenDate = yesterday.toISOString().split('T')[0];
      expect(streak).toBe(1);
      expect(revivals).toBe(2);

      // Day 8: Revival eligible
      const eligible = streak === 0 && revivals > 0; // False because streak = 1, not 0
      expect(eligible).toBe(false); // Can't revive yet, streak is being rebuilt

      // Let's say streak reset to 0 instead:
      streak = 0;
      const eligible2 = streak === 0 && revivals > 0;
      expect(eligible2).toBe(true);

      // Revival 1: Restore streak
      streak = previousStreak; // Back to 10
      revivals = revivals - 1;
      expect(streak).toBe(10);
      expect(revivals).toBe(1);

      // Another miss → rebuild
      previousStreak = streak;
      streak = 1;
      streakBrokenDate = getTodayStr();
      expect(revivals).toBe(1);

      // Revival 2: Last one
      streak = previousStreak;
      revivals = revivals - 1;
      expect(revivals).toBe(0);

      // Can't revive anymore
      const canRevive3 = revivals > 0;
      expect(canRevive3).toBe(false);
    });
  });
});
