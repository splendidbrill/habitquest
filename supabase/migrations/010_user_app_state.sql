-- ============================================================
-- Migration 010 — User App State (device-local cache mirror)
-- Run in Supabase SQL Editor after 009_video_analytics.sql
-- ============================================================

-- Cloud mirror of the parent's offline-first AsyncStorage cache so a
-- returning user (new device, reinstall, or after the sign-out data wipe)
-- gets their onboarding, swipe preferences and weekly plan restored.
-- AsyncStorage remains the source of truth on-device; this row is a
-- best-effort mirror, written whenever that local data changes.
--
-- Family-level state, so it is keyed by parent_id (not per child).
CREATE TABLE user_app_state (
  parent_id          UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  onboarding_answers JSONB,
  cuisine_prefs      JSONB,
  activity_prefs     JSONB,
  swipe_reactions    JSONB,
  weekly_plan        JSONB,
  weekly_plan_date   TEXT,
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_app_state ENABLE ROW LEVEL SECURITY;

-- Parent-owned table: parent reads/writes only their own row.
CREATE POLICY "user_app_state_own" ON user_app_state
  FOR ALL USING (parent_id = auth.uid());
