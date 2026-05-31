import { supabase } from '../lib/supabase';
import type { Pillar } from './syncService';

export type FamilyChallenge = {
  id: string;
  parent_id: string;
  title: string;
  description: string | null;
  pillar: Pillar | null;
  active: boolean;
  created_at: string;
  parent_supported_at: string | null;
  completions: { child_id: string; child_name: string; completed_at: string }[];
};

export type FamilyLeaderboardEntry = {
  id: string;
  name: string;
  age_group: string;
  xp: number;
  streak: number;
  level: string;
};

// ─── Load active challenges for a family ──────────────────────────────────────
export async function loadFamilyChallenges(parentId: string): Promise<FamilyChallenge[]> {
  const { data: challenges } = await supabase
    .from('family_challenges')
    .select('*')
    .eq('parent_id', parentId)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (!challenges?.length) return [];

  // Load completions for all challenges
  const challengeIds = challenges.map(c => c.id);
  const { data: completions } = await supabase
    .from('family_challenge_completions')
    .select('challenge_id, child_id, completed_at, children(name)')
    .in('challenge_id', challengeIds);

  return challenges.map(c => ({
    ...c,
    completions: (completions ?? [])
      .filter(comp => comp.challenge_id === c.id)
      .map(comp => ({
        child_id: comp.child_id,
        child_name: (comp.children as any)?.name ?? '',
        completed_at: comp.completed_at,
      })),
  }));
}

// ─── Load challenges visible to a child ───────────────────────────────────────
export async function loadChallengesForChild(childId: string): Promise<FamilyChallenge[]> {
  // Get parent_id from child
  const { data: child } = await supabase
    .from('children')
    .select('parent_id')
    .eq('id', childId)
    .single();

  if (!child) return [];
  return loadFamilyChallenges(child.parent_id);
}

// ─── Create a new challenge ───────────────────────────────────────────────────
export async function createChallenge(
  parentId: string,
  title: string,
  description: string,
  pillar: Pillar | null,
): Promise<void> {
  await supabase.from('family_challenges').insert({
    parent_id: parentId,
    title,
    description,
    pillar,
    active: true,
  });
}

// ─── Child completes a challenge ──────────────────────────────────────────────
// Awards +50 XP to the family pool and +10 to the child
export async function childCompleteChallenge(
  challengeId: string,
  childId: string,
): Promise<void> {
  // Record completion (ignore if already done — unique constraint)
  const { error } = await supabase
    .from('family_challenge_completions')
    .insert({ challenge_id: challengeId, child_id: childId });

  if (error) return; // already completed

  // Add XP to child
  const { data: child } = await supabase
    .from('children')
    .select('xp, parent_id')
    .eq('id', childId)
    .single();

  if (child) {
    await supabase
      .from('children')
      .update({ xp: child.xp + 50 })
      .eq('id', childId);

    // Add XP to family pool
    await addFamilyXP(childId, 50);
  }
}

// ─── Parent supports a challenge ──────────────────────────────────────────────
// Awards +20 XP to the family pool
export async function parentSupportChallenge(challengeId: string, childId: string): Promise<void> {
  await supabase
    .from('family_challenges')
    .update({ parent_supported_at: new Date().toISOString() })
    .eq('id', challengeId);

  await addFamilyXP(childId, 20);
}

// ─── Archive a challenge (soft delete) ───────────────────────────────────────
export async function archiveChallenge(challengeId: string): Promise<void> {
  await supabase
    .from('family_challenges')
    .update({ active: false })
    .eq('id', challengeId);
}

// ─── Family leaderboard — all children ranked by XP ─────────────────────────
export async function loadFamilyLeaderboard(parentId: string): Promise<FamilyLeaderboardEntry[]> {
  const { data } = await supabase
    .from('children')
    .select('id, name, age_group, xp, streak, level')
    .eq('parent_id', parentId)
    .order('xp', { ascending: false });

  return (data ?? []) as FamilyLeaderboardEntry[];
}

// ─── Family XP total ──────────────────────────────────────────────────────────
export async function getFamilyXP(childId: string): Promise<number> {
  const { data: child } = await supabase
    .from('children')
    .select('parent_id')
    .eq('id', childId)
    .single();

  if (!child) return 0;

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_code')
    .eq('id', child.parent_id)
    .single();

  if (!profile?.family_code) return 0;

  const { data: familyXP } = await supabase
    .from('family_xp')
    .select('total_xp')
    .eq('family_code', profile.family_code)
    .single();

  return familyXP?.total_xp ?? 0;
}

// ─── Internal: add XP to the family pool ─────────────────────────────────────
async function addFamilyXP(childId: string, amount: number): Promise<void> {
  const { data: child } = await supabase
    .from('children')
    .select('parent_id')
    .eq('id', childId)
    .single();

  if (!child) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('family_code')
    .eq('id', child.parent_id)
    .single();

  if (!profile?.family_code) return;

  // Upsert family_xp row
  const { data: existing } = await supabase
    .from('family_xp')
    .select('total_xp')
    .eq('family_code', profile.family_code)
    .single();

  if (existing) {
    await supabase
      .from('family_xp')
      .update({ total_xp: existing.total_xp + amount, updated_at: new Date().toISOString() })
      .eq('family_code', profile.family_code);
  } else {
    await supabase
      .from('family_xp')
      .insert({ family_code: profile.family_code, total_xp: amount });
  }
}
