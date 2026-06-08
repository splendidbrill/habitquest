-- ============================================================
-- Migration 007 — Preference Signals
-- Run in Supabase SQL Editor after 006_family_profiles.sql
-- ============================================================

-- Unified preference event log. Onboarding swipes (source='swipe'),
-- meal/quest completions (source='completion') and progressive
-- profiling answers (source='micro_q') all feed ONE model so the
-- Phase 4 preference engine can weight behaviour over stated intent.
CREATE TABLE preference_signals (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id    UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('meal', 'activity')),
  ref_id      TEXT,                       -- archetype/meal/mission id
  attribute   TEXT NOT NULL,              -- e.g. 'cuisine', 'category', 'tag'
  value       TEXT NOT NULL,              -- e.g. 'Indian', 'ball_sport'
  weight      INT  NOT NULL DEFAULT 1,    -- signed: positive = liked
  source      TEXT NOT NULL CHECK (source IN ('swipe', 'completion', 'micro_q')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX preference_signals_child_idx ON preference_signals (child_id);

ALTER TABLE preference_signals ENABLE ROW LEVEL SECURITY;

-- Parent sees/writes their children's signals (child -> parent pattern).
CREATE POLICY "preference_signals_own" ON preference_signals
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );
