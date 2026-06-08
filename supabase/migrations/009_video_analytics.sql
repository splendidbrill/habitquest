-- ============================================================
-- Migration 009 — Onboarding Intro Video analytics
-- Run in Supabase SQL Editor after 008_meal_feedback.sql
-- ============================================================

-- Phase 9 stored videoWatched / videoSkipped / videoPercentWatched in
-- AsyncStorage ("table later"). This is that table: a single row per parent
-- capturing whether they watched or skipped the onboarding explainer and how
-- far they got — for retention correlation. Parent-owned (the intro runs
-- before any child exists), mirroring the family_profiles RLS pattern.
CREATE TABLE video_analytics (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id       UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  watched         BOOLEAN NOT NULL DEFAULT FALSE,
  skipped         BOOLEAN NOT NULL DEFAULT FALSE,
  percent_watched INT     NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX video_analytics_parent_idx ON video_analytics (parent_id);

ALTER TABLE video_analytics ENABLE ROW LEVEL SECURITY;

-- Parent sees/writes only their own analytics row.
CREATE POLICY "video_analytics_own" ON video_analytics
  FOR ALL USING (parent_id = auth.uid());
