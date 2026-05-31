-- ============================================================
-- Migration 002 — Pillar Check-ins
-- Run this in the Supabase SQL Editor after schema.sql
-- ============================================================

CREATE TABLE pillar_checkins (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id                UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  week_start              DATE NOT NULL,

  -- Nutrition (days out of 7)
  fruit_days              INTEGER DEFAULT 0 CHECK (fruit_days        BETWEEN 0 AND 7),
  veg_days                INTEGER DEFAULT 0 CHECK (veg_days          BETWEEN 0 AND 7),
  sugary_drinks_avoided   INTEGER DEFAULT 0 CHECK (sugary_drinks_avoided BETWEEN 0 AND 7),
  family_meals            INTEGER DEFAULT 0 CHECK (family_meals      BETWEEN 0 AND 7),

  -- Movement
  active_days             INTEGER DEFAULT 0 CHECK (active_days       BETWEEN 0 AND 7),
  sport_sessions          INTEGER DEFAULT 0 CHECK (sport_sessions    BETWEEN 0 AND 7),
  outdoor_minutes         INTEGER DEFAULT 0,

  -- Sleep
  consistent_bedtime      INTEGER DEFAULT 0 CHECK (consistent_bedtime BETWEEN 0 AND 7),
  sleep_hours_avg         DECIMAL(3,1) DEFAULT 0,
  morning_energy          INTEGER DEFAULT 3 CHECK (morning_energy    BETWEEN 1 AND 5),

  -- Confidence & Wellbeing
  mood_avg                DECIMAL(3,1) DEFAULT 3,
  self_confidence         INTEGER DEFAULT 3 CHECK (self_confidence   BETWEEN 1 AND 5),
  participation_days      INTEGER DEFAULT 0 CHECK (participation_days BETWEEN 0 AND 7),

  recorded_at             TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (child_id, week_start)
);

-- RLS
ALTER TABLE pillar_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pillar_checkins_own" ON pillar_checkins
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );
