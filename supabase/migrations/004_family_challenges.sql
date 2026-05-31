-- ============================================================
-- Migration 004 — Family Challenge Completions
-- Run in Supabase SQL Editor after 003_streak_rewards.sql
-- ============================================================

-- Track which child completed which challenge
CREATE TABLE family_challenge_completions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id  UUID REFERENCES family_challenges(id) ON DELETE CASCADE NOT NULL,
  child_id      UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  completed_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (challenge_id, child_id)
);

ALTER TABLE family_challenge_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenge_completions_own" ON family_challenge_completions
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
    OR
    challenge_id IN (SELECT id FROM family_challenges WHERE parent_id = auth.uid())
  );

-- Track when parent supported a challenge
ALTER TABLE family_challenges
  ADD COLUMN IF NOT EXISTS parent_supported_at TIMESTAMPTZ;
