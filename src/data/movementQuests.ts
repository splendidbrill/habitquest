// ============================================================
// Movement Quest library (Phase C.2).
//
// The 100 real, age-banded activities now live in ./activityDatabase.ts
// (generated from "HabitQuest Activity Database.xlsx"): each carries a real
// warm-up / main drill / cool-down, age-specific coaching tips, what-it-builds
// and progression ladders. This module re-exports them as `movementQuests` and
// owns the MovementQuest type + the daily-quest selector.
//
// selectDailyMovementQuest() personalises by the family's favourite sports /
// interests, available equipment, indoor/outdoor space, and 👍/👎 history,
// using the 70% familiar / 20% adjacent / 10% new weighting. It is
// deterministic per day (same quest all day, rotates tomorrow) so the parent
// Weekly Plan and every child's daily mission show the SAME quest.
//
// Guardrail: framed as play/missions — never weight-loss, calories or
// punishment language.
// ============================================================

import type { FamilyProfile } from './familyProfile';
import { activityQuests } from './activityDatabase';

export type AgeBand = '6-8' | '8-10' | '10-12';

export interface MovementQuest {
  id: string;
  ageBands: AgeBand[]; // every band the activity suits (an activity spans several)
  title: string;
  emoji: string;
  theme: string; // the framing/story, e.g. "Football", "Mindful Movement"
  challenge: string; // what to actually do (the real main drill)
  equipment: string; // plain-language kit needed, "None" if bodyweight
  durationMin: number;
  upgrade?: string; // optional "level it up" / next-stage unlock
  xp: number;
  skills: string[]; // what it builds, e.g. ["balance", "ball skill"]
  whyMatters: string; // encouraging, non-shaming explanation of the benefit
  indoor: boolean; // can be done indoors
  outdoor: boolean; // suits outdoor space
  // Matching tags — reuse the activity/mission vocabulary so signals line up
  // with missionCatalog.ts / activityArchetypes.ts.
  tags: string[];
  // ── Rich authored fields (Activity Database) ──────────────────────────────
  warmUp?: string;
  mainDrill?: string;
  coolDown?: string;
  whatBuilds?: string;
  coachingTips?: { age6to8: string; age8to10: string; age10to12: string };
  intensity?: string;
  progressionFamily?: string;
  progressionStep?: number;
  progressionNextId?: string;
  progressionNextName?: string;
  parentSetup?: string;
  safety?: string;
  occasion?: string;
}

// "Want extra inspiration?" — free, trusted UK movement resources (doc).
export interface MovementInspiration {
  label: string;
  url: string;
}

export const MOVEMENT_INSPIRATION: MovementInspiration[] = [
  {
    label: 'NHS Healthier Families — activities',
    url: 'https://www.nhs.uk/healthier-families/activities/',
  },
  { label: 'Cosmic Kids Yoga', url: 'https://www.cosmickids.com/' },
  { label: 'GoNoodle', url: 'https://www.gonoodle.com/' },
  {
    label: 'BBC Super Movers',
    url: 'https://www.bbc.co.uk/teach/supermovers',
  },
];

// ─── The library ──────────────────────────────────────────────────────────────
// The 100 real activities, generated from the Activity Database spreadsheet.
export const movementQuests: MovementQuest[] = activityQuests;

// ─── Selector ─────────────────────────────────────────────────────────────────

export interface MovementSelectOpts {
  /** Tags the child has reacted positively to (👍 / completed). */
  likedTags?: Set<string>;
  /** Tags the child has reacted negatively to (👎 / not-for-us). */
  avoidedTags?: Set<string>;
  /** Override "today" for deterministic testing. */
  date?: Date;
}

// Map the onboarding interest/equipment/space labels onto quest tags.
function profileTags(profile: FamilyProfile | null): {
  interest: Set<string>;
  hasOutdoor: boolean;
  hasIndoor: boolean;
  equipment: { ball: boolean; rope: boolean; bike: boolean };
} {
  const interest = new Set<string>();
  const text = (profile?.childInterests ?? []).join(' ').toLowerCase();
  if (text.includes('football')) interest.add('football');
  if (text.includes('sport')) interest.add('sport');
  if (text.includes('danc')) interest.add('dance');
  if (text.includes('outdoor')) interest.add('outdoor');
  if (text.includes('music')) interest.add('music');

  const spaces = (profile?.spaces ?? []).join(' ').toLowerCase();
  const hasOutdoor =
    spaces.includes('garden') ||
    spaces.includes('park') ||
    spaces.includes('outdoor') ||
    spaces.includes('sports');
  const hasIndoor =
    spaces.includes('living') ||
    spaces.includes('indoor') ||
    spaces.includes('limited') ||
    spaces === '';

  const equip = (profile?.equipment ?? []).join(' ').toLowerCase();
  return {
    interest,
    hasOutdoor,
    hasIndoor,
    equipment: {
      ball: equip.includes('ball') || equip.includes('sports equipment'),
      rope: equip.includes('skipping') || equip.includes('rope'),
      bike: equip.includes('bike') || equip.includes('scooter'),
    },
  };
}

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000);
}

function scoreQuest(
  q: MovementQuest,
  ctx: ReturnType<typeof profileTags>,
  opts: MovementSelectOpts,
): number {
  let s = 50;
  // Favourite sports / interests.
  for (const t of q.tags) if (ctx.interest.has(t)) s += 12;
  // Space fit.
  if (q.outdoor && !q.indoor && !ctx.hasOutdoor) s -= 15;
  if (q.indoor && !q.outdoor && !ctx.hasIndoor) s -= 8;
  if (q.indoor && ctx.hasIndoor) s += 4;
  if (q.outdoor && ctx.hasOutdoor) s += 4;
  // Equipment fit — penalise quests needing kit the family doesn't have.
  const needsBall = q.tags.includes('ball');
  const needsRope = q.tags.includes('skipping');
  if (needsBall && !ctx.equipment.ball) s -= 10;
  if (needsRope && !ctx.equipment.rope) s -= 10;
  // 👍 / 👎 history.
  for (const t of q.tags) {
    if (opts.likedTags?.has(t)) s += 10;
    if (opts.avoidedTags?.has(t)) s -= 12;
  }
  return s;
}

/**
 * The day's Movement Quest for a child age band, personalised + deterministic.
 *
 * Ranks the band's quests by fit, then applies the doc's 70/20/10 weighting to
 * the DAILY pick: most days draw from the best-fit "familiar" third, some days
 * from "adjacent", occasionally something "new" — seeded by the date so it is
 * stable for the whole day and rotates tomorrow.
 */
export function selectDailyMovementQuest(
  ageBand: AgeBand,
  profile: FamilyProfile | null,
  opts: MovementSelectOpts = {},
): MovementQuest {
  const today = opts.date ?? new Date();
  const ctx = profileTags(profile);

  const ranked = movementQuests
    .filter(q => q.ageBands.includes(ageBand))
    .map(q => ({ q, score: scoreQuest(q, ctx, opts) }))
    .sort((a, b) => b.score - a.score)
    .map(r => r.q);

  if (ranked.length === 0) return movementQuests[0];

  const third = Math.max(1, Math.ceil(ranked.length / 3));
  const familiar = ranked.slice(0, third);
  const adjacent = ranked.slice(third, third * 2);
  const fresh = ranked.slice(third * 2);

  const seed = dayOfYear(today);
  const roll = seed % 10; // 0–9 → 70/20/10
  let pool = familiar;
  if (roll === 9 && fresh.length) pool = fresh; // ~10% new
  else if (roll >= 7 && adjacent.length) pool = adjacent; // ~20% adjacent

  // Rotate within the chosen pool day-by-day so it doesn't repeat.
  return pool[seed % pool.length];
}

/** Map a numeric age to the quest age band. */
export function ageToBand(age: number | null | undefined): AgeBand {
  if (age == null) return '8-10';
  if (age <= 7) return '6-8';
  if (age <= 9) return '8-10';
  return '10-12';
}
