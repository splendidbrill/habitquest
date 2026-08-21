-- ============================================================
-- Migration 012 — Streak Revival System
-- Run in Supabase SQL Editor after 011_weekly_focus_cascade.sql
-- ============================================================
--
-- Allow users to revive a broken streak up to twice per account.
-- After 7 days without completing a task (streak broken), they can
-- revive once (restore the streak count to what it was). Max 2 revivals.

-- Track remaining revivals per child (starts at 2, decrements on use)
ALTER TABLE children
  ADD COLUMN IF NOT EXISTS streak_revivals INTEGER DEFAULT 2;

-- Track the date when the streak was last broken (0-reset)
ALTER TABLE children
  ADD COLUMN IF NOT EXISTS streak_broken_date DATE;

-- The streak count BEFORE it was broken (so we can restore it on revival)
ALTER TABLE children
  ADD COLUMN IF NOT EXISTS previous_streak_count INTEGER DEFAULT 0;

-- Log of each revival used: when, which child
CREATE TABLE IF NOT EXISTS streak_revival_usage (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id    UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  used_on     DATE NOT NULL,
  revived_streak_count INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (child_id, used_on)
);

ALTER TABLE streak_revival_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "streak_revival_own" ON streak_revival_usage
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );
