-- ============================================================
-- Migration 005 — Push Tokens
-- Run in Supabase SQL Editor after 004_family_challenges.sql
-- ============================================================

-- Store device push tokens per user (parent or child device)
CREATE TABLE push_tokens (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token       TEXT NOT NULL,
  platform    TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  child_id    UUID REFERENCES children(id) ON DELETE SET NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, platform)
);

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "push_tokens_own" ON push_tokens
  FOR ALL USING (user_id = auth.uid());

-- Notification log — track what was sent to avoid duplicates
CREATE TABLE notification_log (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type          TEXT NOT NULL,
  payload       JSONB,
  sent_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_log_own" ON notification_log
  FOR ALL USING (recipient_id = auth.uid());
