-- ============================================================
-- Migration 011 — weekly_focus cascade fix (account-deletion)
-- Run in Supabase SQL Editor after 010_user_app_state.sql
-- ============================================================
--
-- weekly_focus was created with a bare `family_code TEXT NOT NULL` and no
-- foreign key, so it was the ONE table that did not get removed when an
-- account is deleted (auth.users → profiles → ... cascade). Its rows were
-- orphaned and survived deletion — a leak the in-app "Delete my account"
-- flow (Google Play requirement) must not leave behind.
--
-- Fix: point family_code at profiles.family_code (UNIQUE) with ON DELETE
-- CASCADE, mirroring how family_xp already references profiles.

-- 1. Remove any rows already orphaned (family_code no longer maps to a
--    profile) so the constraint can be added cleanly.
DELETE FROM weekly_focus
WHERE family_code NOT IN (SELECT family_code FROM profiles WHERE family_code IS NOT NULL);

-- 2. Add the cascading foreign key.
ALTER TABLE weekly_focus
  ADD CONSTRAINT weekly_focus_family_code_fkey
  FOREIGN KEY (family_code)
  REFERENCES profiles(family_code)
  ON DELETE CASCADE;
