-- ============================================================
-- HabitQuest — Full Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ──────────────────────────────────────────────
-- 1. PARENT PROFILES
-- Extends Supabase auth.users
-- ──────────────────────────────────────────────
CREATE TABLE profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email         TEXT NOT NULL,
  full_name     TEXT,
  family_code   TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, family_code)
  VALUES (
    NEW.id,
    NEW.email,
    UPPER(SUBSTRING(MD5(NEW.id::TEXT), 1, 6))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ──────────────────────────────────────────────
-- 2. CHILDREN
-- Each child belongs to one parent profile
-- ──────────────────────────────────────────────
CREATE TABLE children (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id         UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name              TEXT NOT NULL,
  age_group         TEXT NOT NULL CHECK (age_group IN ('6-8', '8-10', '10-12')),
  avatar            TEXT,
  sport             TEXT,
  xp                INTEGER DEFAULT 0,
  level             TEXT DEFAULT 'Rookie',
  streak            INTEGER DEFAULT 0,
  streak_freezes    INTEGER DEFAULT 1,
  last_active_date  DATE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 3. MISSION COMPLETIONS
-- Every mission a child completes, tagged to a pillar
-- ──────────────────────────────────────────────
CREATE TABLE mission_completions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id        UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  mission_id      TEXT NOT NULL,
  mission_title   TEXT NOT NULL,
  pillar          TEXT NOT NULL CHECK (pillar IN ('nutrition', 'movement', 'sleep', 'confidence')),
  xp_earned       INTEGER DEFAULT 0,
  completed_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 4. BADGES
-- Earned achievements per child, no duplicates
-- ──────────────────────────────────────────────
CREATE TABLE badges (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id    UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  badge_id    TEXT NOT NULL,
  badge_name  TEXT NOT NULL,
  earned_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (child_id, badge_id)
);

-- ──────────────────────────────────────────────
-- 5. PILLAR SCORES
-- Snapshot of all four pillar scores over time
-- One row per child per week
-- ──────────────────────────────────────────────
CREATE TABLE pillar_scores (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id            UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  nutrition_score     INTEGER DEFAULT 0 CHECK (nutrition_score BETWEEN 0 AND 100),
  movement_score      INTEGER DEFAULT 0 CHECK (movement_score BETWEEN 0 AND 100),
  sleep_score         INTEGER DEFAULT 0 CHECK (sleep_score BETWEEN 0 AND 100),
  confidence_score    INTEGER DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 100),
  week_start          DATE NOT NULL,
  recorded_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (child_id, week_start)
);

-- ──────────────────────────────────────────────
-- 6. MOOD LOGS
-- Private to child — parent sees trends only, never raw entries
-- Used by 10-12 flow
-- ──────────────────────────────────────────────
CREATE TABLE mood_logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id      UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  mood_level    INTEGER CHECK (mood_level BETWEEN 1 AND 5),
  energy_level  INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  logged_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 7. FOOD LOGS
-- Tracks what foods a child tries, likes, skips or repeats
-- ──────────────────────────────────────────────
CREATE TABLE food_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id    UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  food_item   TEXT NOT NULL,
  action      TEXT CHECK (action IN ('tried', 'liked', 'skipped', 'repeated')),
  logged_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 8. GAME SCORES
-- High scores per game per child
-- ──────────────────────────────────────────────
CREATE TABLE game_scores (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id    UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  game_id     TEXT NOT NULL,
  score       INTEGER NOT NULL,
  played_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 9. FAMILY XP
-- Shared XP pool for the whole family
-- ──────────────────────────────────────────────
CREATE TABLE family_xp (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_code  TEXT REFERENCES profiles(family_code) ON DELETE CASCADE NOT NULL UNIQUE,
  total_xp     INTEGER DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 10. FAMILY CHALLENGES
-- Challenges set by parent that both parent and child complete together
-- ──────────────────────────────────────────────
CREATE TABLE family_challenges (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id    UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  pillar       TEXT CHECK (pillar IN ('nutrition', 'movement', 'sleep', 'confidence')),
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 11. PARENT REACTIONS
-- Emoji reactions from parent to child mission completions
-- ──────────────────────────────────────────────
CREATE TABLE parent_reactions (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id               UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  child_id                UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  mission_completion_id   UUID REFERENCES mission_completions(id) ON DELETE CASCADE,
  reaction                TEXT NOT NULL CHECK (reaction IN ('fire', 'star', 'highfive', 'bonus_xp')),
  seen                    BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 12. WEEKLY FOCUS
-- Tracks which pillar is the primary focus each week per family
-- ──────────────────────────────────────────────
CREATE TABLE weekly_focus (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_code  TEXT NOT NULL,
  pillar       TEXT NOT NULL CHECK (pillar IN ('nutrition', 'movement', 'sleep', 'confidence')),
  week_start   DATE NOT NULL,
  week_number  INTEGER NOT NULL,
  phase        INTEGER NOT NULL DEFAULT 1 CHECK (phase IN (1, 2, 3)),
  UNIQUE (family_code, week_start)
);

-- ──────────────────────────────────────────────
-- 13. STREAK FREEZE USAGE
-- Tracks when a child used a streak freeze
-- ──────────────────────────────────────────────
CREATE TABLE streak_freeze_usage (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id    UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  used_on     DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (child_id, used_on)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Parents can only see their own data and their children's data
-- ============================================================

ALTER TABLE profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE children               ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_completions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE pillar_scores          ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores            ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_xp              ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_challenges      ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_reactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_focus           ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_freeze_usage    ENABLE ROW LEVEL SECURITY;

-- Profiles: own row only
CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Children: parent sees their own children
CREATE POLICY "children_own" ON children
  FOR ALL USING (parent_id = auth.uid());

-- Mission completions: parent sees their children's missions
CREATE POLICY "missions_own" ON mission_completions
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- Badges: parent sees their children's badges
CREATE POLICY "badges_own" ON badges
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- Pillar scores: parent sees their children's scores
CREATE POLICY "pillar_scores_own" ON pillar_scores
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- Mood logs: parent can NOT read raw entries (select blocked), only child writes
CREATE POLICY "mood_logs_insert" ON mood_logs
  FOR INSERT WITH CHECK (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- Food logs: parent sees their children's food logs
CREATE POLICY "food_logs_own" ON food_logs
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- Game scores: parent sees their children's scores
CREATE POLICY "game_scores_own" ON game_scores
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- Family XP: own family only
CREATE POLICY "family_xp_own" ON family_xp
  FOR ALL USING (
    family_code IN (SELECT family_code FROM profiles WHERE id = auth.uid())
  );

-- Family challenges: parent manages their own challenges
CREATE POLICY "family_challenges_own" ON family_challenges
  FOR ALL USING (parent_id = auth.uid());

-- Parent reactions: parent manages their own reactions
CREATE POLICY "parent_reactions_own" ON parent_reactions
  FOR ALL USING (parent_id = auth.uid());

-- Weekly focus: own family only
CREATE POLICY "weekly_focus_own" ON weekly_focus
  FOR ALL USING (
    family_code IN (SELECT family_code FROM profiles WHERE id = auth.uid())
  );

-- Streak freeze usage: parent sees their children's freeze usage
CREATE POLICY "streak_freeze_own" ON streak_freeze_usage
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- ============================================================
-- FAMILY PROFILES (migration 006)
-- Synced mirror of the on-device canonical FamilyProfile.
-- ============================================================
CREATE TABLE family_profiles (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id   UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  profile     JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE family_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "family_profiles_own" ON family_profiles
  FOR ALL USING (parent_id = auth.uid());

-- ============================================================
-- PREFERENCE SIGNALS (migration 007)
-- Unified preference event log feeding the Phase 4 engine.
-- ============================================================
CREATE TABLE preference_signals (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id    UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('meal', 'activity')),
  ref_id      TEXT,
  attribute   TEXT NOT NULL,
  value       TEXT NOT NULL,
  weight      INT  NOT NULL DEFAULT 1,
  source      TEXT NOT NULL CHECK (source IN ('swipe', 'completion', 'micro_q')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX preference_signals_child_idx ON preference_signals (child_id);

ALTER TABLE preference_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "preference_signals_own" ON preference_signals
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- ============================================================
-- MEAL FEEDBACK (migration 008)
-- "Did everyone actually eat it?" — 4-state reaction, mirrored
-- into preference_signals (source='completion') by the app.
-- Do NOT overload food_logs.action for this.
-- ============================================================
CREATE TABLE meal_feedback (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id    UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  meal_ref    TEXT NOT NULL,
  reaction    TEXT NOT NULL CHECK (reaction IN ('everyone_ate', 'most_ate', 'mixed', 'disaster')),
  logged_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX meal_feedback_child_idx ON meal_feedback (child_id);

ALTER TABLE meal_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meal_feedback_own" ON meal_feedback
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- ============================================================
-- VIDEO ANALYTICS (migration 009)
-- Onboarding intro-video retention signal. Parent-owned (runs
-- before any child exists). AsyncStorage is written during the
-- pre-auth intro; the app flushes it here once authenticated.
-- ============================================================
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

CREATE POLICY "video_analytics_own" ON video_analytics
  FOR ALL USING (parent_id = auth.uid());
