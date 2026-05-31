-- ============================================================
-- Migration 003 — Streak Rewards
-- Run in Supabase SQL Editor after 002_pillar_checkins.sql
-- ============================================================

-- Track when the weekly streak freeze was last granted per child
ALTER TABLE children ADD COLUMN IF NOT EXISTS last_freeze_reset DATE;

-- Track which milestone badges have been awarded (stored in badges table)
-- badge_id values used: 'streak-7', 'streak-30', 'streak-100'
-- No schema change needed — uses existing badges table

-- Cosmetic titles table — unlocked by milestones and other achievements
CREATE TABLE IF NOT EXISTS cosmetic_titles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id    UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  title_id    TEXT NOT NULL,
  title_label TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (child_id, title_id)
);

ALTER TABLE cosmetic_titles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cosmetic_titles_own" ON cosmetic_titles
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );
