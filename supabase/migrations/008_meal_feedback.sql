-- ============================================================
-- Migration 008 — Meal Feedback
-- Run in Supabase SQL Editor after 007_preference_signals.sql
-- ============================================================

-- The doc's single most important signal: "Did everyone actually eat it?"
-- This is a DISTINCT 5-state* reaction and must NOT overload
-- food_logs.action (which is fixed: tried|liked|skipped|repeated).
-- Each reaction is also mirrored into preference_signals (source='completion')
-- by the app so it feeds the Phase 4 preference engine directly.
--
-- *4 stored states; "mixed" is the neutral middle, "disaster" is internal
--  only (UI shows a warm 😬, never the word).
CREATE TABLE meal_feedback (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id    UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  meal_ref    TEXT NOT NULL,              -- meal name / library id from the plan
  reaction    TEXT NOT NULL CHECK (reaction IN ('everyone_ate', 'most_ate', 'mixed', 'disaster')),
  logged_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX meal_feedback_child_idx ON meal_feedback (child_id);

ALTER TABLE meal_feedback ENABLE ROW LEVEL SECURITY;

-- Parent sees/writes their children's feedback (child -> parent pattern).
CREATE POLICY "meal_feedback_own" ON meal_feedback
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );
