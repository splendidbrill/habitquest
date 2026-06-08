-- ============================================================
-- Migration 006 — Family Profiles
-- Run in Supabase SQL Editor after 005_push_tokens.sql
-- ============================================================

-- Synced mirror of the canonical FamilyProfile (offline-first source
-- of truth remains AsyncStorage['onboardingAnswers'] on-device).
-- Stored as JSONB to avoid a column-per-answer migration treadmill.
CREATE TABLE family_profiles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  profile     JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE family_profiles ENABLE ROW LEVEL SECURITY;

-- Parent-owned table: parent sees and manages only their own row.
CREATE POLICY "family_profiles_own" ON family_profiles
  FOR ALL USING (parent_id = auth.uid());
