import { supabase } from '../lib/supabase';

// ─── Reward tiers ─────────────────────────────────────────────────────────────
export type RewardTier = 'common' | 'uncommon' | 'rare' | 'legendary';

export type MysteryReward = {
  tier:        RewardTier;
  emoji:       string;
  headline:    string;
  description: string;
  xpBonus:     number;
  grantFreeze: boolean;
  badgeId:     string | null;
  badgeName:   string | null;
  colors:      [string, string];
};

// ─── XP level thresholds ──────────────────────────────────────────────────────
const LEVEL_THRESHOLDS = [50, 200, 500, 1000]; // Rookie→Starter, Starter→Pro, Pro→All-Star, All-Star→Legend
const XP_CLIFF_BUFFER = 20; // always leave this many XP short of the next level

// ─── Roll a mystery reward ────────────────────────────────────────────────────
export function rollMysteryReward(): MysteryReward {
  const roll = Math.random() * 100;

  if (roll < 5) {
    // Legendary (5%)
    return {
      tier:        'legendary',
      emoji:       '👑',
      headline:    'LEGENDARY!',
      description: 'A streak freeze AND a massive XP boost. You earned this.',
      xpBonus:     100,
      grantFreeze: true,
      badgeId:     null,
      badgeName:   null,
      colors:      ['#f59e0b', '#d97706'],
    };
  }

  if (roll < 15) {
    // Rare (10%)
    const rareBadges = [
      { id: 'mystery-star',    name: 'Mystery Star',    emoji: '🌟' },
      { id: 'mystery-diamond', name: 'Diamond Find',    emoji: '💎' },
      { id: 'mystery-rocket',  name: 'Rocket Kid',      emoji: '🚀' },
    ];
    const badge = rareBadges[Math.floor(Math.random() * rareBadges.length)];
    return {
      tier:        'rare',
      emoji:       badge.emoji,
      headline:    'RARE FIND!',
      description: `You unlocked the ${badge.name} badge. Not everyone gets this one.`,
      xpBonus:     50,
      grantFreeze: false,
      badgeId:     badge.id,
      badgeName:   badge.name,
      colors:      ['#8b5cf6', '#7c3aed'],
    };
  }

  if (roll < 40) {
    // Uncommon (25%)
    return {
      tier:        'uncommon',
      emoji:       '💫',
      headline:    'Nice find!',
      description: 'A solid bonus. Keep completing missions for more.',
      xpBonus:     25,
      grantFreeze: false,
      badgeId:     null,
      badgeName:   null,
      colors:      ['#3b82f6', '#2563eb'],
    };
  }

  // Common (60%)
  return {
    tier:        'common',
    emoji:       '🎁',
    headline:    'Mystery reward!',
    description: 'A little bonus for showing up today.',
    xpBonus:     10,
    grantFreeze: false,
    badgeId:     null,
    badgeName:   null,
    colors:      ['#22c55e', '#16a34a'],
  };
}

// ─── Roll a daily spin reward (lighter) ──────────────────────────────────────
export type DailySpinReward = {
  emoji:       string;
  headline:    string;
  xpBonus:     number;
  grantFreeze: boolean;
  color:       string;
};

export function rollDailySpinReward(): DailySpinReward {
  const roll = Math.random() * 100;

  if (roll < 10) {
    return { emoji: '🧊', headline: 'Streak Freeze!',  xpBonus: 0,  grantFreeze: true,  color: '#06b6d4' };
  }
  if (roll < 30) {
    return { emoji: '⚡', headline: '+15 Bonus XP!',   xpBonus: 15, grantFreeze: false, color: '#f59e0b' };
  }
  return   { emoji: '🎯', headline: '+5 Daily XP',     xpBonus: 5,  grantFreeze: false, color: '#22c55e' };
}

// ─── XP cliff: cap XP so the child is always ~20 short of the next level ──────
export function applyXPCliff(currentXP: number, xpToAdd: number): number {
  const newXP = currentXP + xpToAdd;

  for (const threshold of LEVEL_THRESHOLDS) {
    if (currentXP < threshold) {
      // This is the relevant threshold
      const cliffPoint = threshold - XP_CLIFF_BUFFER;

      if (currentXP < cliffPoint && newXP >= cliffPoint) {
        // Cap at the cliff point — they can see the level is close but won't reach it this session
        return cliffPoint;
      }
      break;
    }
  }

  return newXP;
}

// ─── Apply a mystery reward to a child in Supabase ───────────────────────────
export async function applyMysteryReward(
  childId: string,
  reward: MysteryReward,
): Promise<void> {
  const { data: child } = await supabase
    .from('children')
    .select('xp, streak_freezes')
    .eq('id', childId)
    .single();

  if (!child) return;

  const newXP = applyXPCliff(child.xp, reward.xpBonus);
  const updates: Record<string, any> = { xp: newXP };

  if (reward.grantFreeze) {
    updates.streak_freezes = child.streak_freezes + 1;
  }

  await supabase.from('children').update(updates).eq('id', childId);

  if (reward.badgeId && reward.badgeName) {
    await supabase.from('badges').upsert(
      { child_id: childId, badge_id: reward.badgeId, badge_name: reward.badgeName },
      { onConflict: 'child_id,badge_id' },
    );
  }
}

// ─── Apply daily spin reward ──────────────────────────────────────────────────
export async function applyDailySpinReward(
  childId: string,
  reward: DailySpinReward,
): Promise<void> {
  if (reward.xpBonus === 0 && !reward.grantFreeze) return;

  const { data: child } = await supabase
    .from('children')
    .select('xp, streak_freezes')
    .eq('id', childId)
    .single();

  if (!child) return;

  const updates: Record<string, any> = {};
  if (reward.xpBonus > 0) updates.xp = applyXPCliff(child.xp, reward.xpBonus);
  if (reward.grantFreeze) updates.streak_freezes = child.streak_freezes + 1;

  await supabase.from('children').update(updates).eq('id', childId);
}
