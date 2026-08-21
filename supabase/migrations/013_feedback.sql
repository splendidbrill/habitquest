-- ============================================================
-- Migration 013 — User Feedback & Bug Reports
-- Run in Supabase SQL Editor after 012_streak_revival.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS user_feedback (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('bug', 'feature', 'feedback')),
  message     TEXT NOT NULL,
  status      TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX user_feedback_parent_idx ON user_feedback (parent_id);
CREATE INDEX user_feedback_status_idx ON user_feedback (status);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_own" ON user_feedback
  FOR ALL USING (parent_id = auth.uid());
