// ============================================================
// Movement Quest library (Phase C.2, from *Optimal Exercise Plans* docx).
//
// Structured movement quests keyed by age band (6–8 / 8–10 / 10–12). Each
// quest carries the doc's fields: title, theme, challenge, equipment,
// duration, optional upgrade, XP, skills, and "why this matters".
//
// selectDailyMovementQuest() personalises by the family's favourite sports /
// interests, available equipment, indoor/outdoor space, and 👍/👎 history,
// using the doc's 70% familiar / 20% adjacent / 10% new weighting. It is
// deterministic per day (same quest all day, rotates tomorrow) so the parent
// Weekly Plan and every child's daily mission show the SAME quest.
//
// Guardrail (doc): framed as play/missions — never weight-loss, calories or
// punishment language.
// ============================================================

import type { FamilyProfile } from './familyProfile';

export type AgeBand = '6-8' | '8-10' | '10-12';

export interface MovementQuest {
  id: string;
  ageBand: AgeBand;
  title: string;
  emoji: string;
  theme: string; // the framing/story, e.g. "Jungle Explorer"
  challenge: string; // what to actually do
  equipment: string; // plain-language kit needed, "None" if bodyweight
  durationMin: number;
  upgrade?: string; // optional "level it up" extension
  xp: number;
  skills: string[]; // what it builds, e.g. ["balance", "coordination"]
  whyMatters: string; // ≤ ~25 words, encouraging, non-shaming
  indoor: boolean; // can be done indoors
  outdoor: boolean; // suits outdoor space
  // Matching tags — reuse the activity/mission vocabulary so signals line up
  // with missionCatalog.ts / activityArchetypes.ts.
  tags: string[];
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

export const movementQuests: MovementQuest[] = [
  // ─── 6–8 — adventure & imagination ──────────────────────────────────────
  {
    id: 'mq-68-animal-moves',
    ageBand: '6-8',
    title: 'Animal Moves Safari',
    emoji: '🦘',
    theme: 'Jungle Explorer',
    challenge:
      'Hop like a kangaroo, stomp like an elephant and slither like a snake — 5 animals, 1 minute each.',
    equipment: 'None',
    durationMin: 6,
    upgrade: 'Let your child invent a 6th animal and teach you the move.',
    xp: 15,
    skills: ['coordination', 'imagination'],
    whyMatters:
      'Playful big movements build strong muscles and balance without it ever feeling like exercise.',
    indoor: true,
    outdoor: true,
    tags: ['indoor', 'fun', 'imagination', 'jumping'],
  },
  {
    id: 'mq-68-dance-party',
    ageBand: '6-8',
    title: 'Living-Room Dance Party',
    emoji: '💃',
    theme: 'Pop Star',
    challenge:
      'Pick 3 favourite songs and dance freestyle — freeze when the music stops!',
    equipment: 'Music',
    durationMin: 10,
    upgrade: 'Add a "copy my move" round where everyone takes a turn to lead.',
    xp: 15,
    skills: ['rhythm', 'confidence'],
    whyMatters:
      'Dancing gets hearts pumping and lets kids express themselves — great for mood and confidence.',
    indoor: true,
    outdoor: false,
    tags: ['indoor', 'dance', 'music', 'fun'],
  },
  {
    id: 'mq-68-park-explorer',
    ageBand: '6-8',
    title: 'Park Explorer Mission',
    emoji: '🌳',
    theme: 'Nature Detective',
    challenge:
      'Walk to the park and find 5 things in nature — then race to the next tree.',
    equipment: 'None',
    durationMin: 30,
    upgrade: 'Bring a ball and add 10 minutes of kick-around.',
    xp: 25,
    skills: ['stamina', 'curiosity'],
    whyMatters:
      'Outdoor play and a bit of walking build everyday fitness and a love of being active.',
    indoor: false,
    outdoor: true,
    tags: ['outdoor', 'walking', 'nature', 'park'],
  },
  {
    id: 'mq-68-ball-skills',
    ageBand: '6-8',
    title: 'Ball Skills Challenge',
    emoji: '⚽',
    theme: 'Football Star',
    challenge: 'Practice 10 kicks, 10 throws-and-catches and 10 bounces.',
    equipment: 'A ball',
    durationMin: 15,
    upgrade: 'Set up two jumpers as a goal and take penalty shots.',
    xp: 20,
    skills: ['coordination', 'ball control'],
    whyMatters:
      'Throwing, catching and kicking build the coordination kids use in every sport and game.',
    indoor: false,
    outdoor: true,
    tags: ['outdoor', 'football', 'sport', 'ball'],
  },
  {
    id: 'mq-68-superhero-circuit',
    ageBand: '6-8',
    title: 'Superhero Training Circuit',
    emoji: '🦸',
    theme: 'Superhero Academy',
    challenge:
      '5 star jumps, 5 big squats, a 10-second plank — then "fly" around the room.',
    equipment: 'None',
    durationMin: 8,
    upgrade: 'Do two rounds and time how fast you can finish.',
    xp: 15,
    skills: ['strength', 'balance'],
    whyMatters:
      'Simple bodyweight moves build strength and balance — and pretending to be a superhero makes it fun.',
    indoor: true,
    outdoor: true,
    tags: ['indoor', 'strength', 'bodyweight', 'fun'],
  },

  // ─── 8–10 — train like an athlete ───────────────────────────────────────
  {
    id: 'mq-810-football-skills',
    ageBand: '8-10',
    title: 'Football Skills Session',
    emoji: '⚽',
    theme: 'Academy Player',
    challenge: 'Dribble around 5 markers, then 10 shots and 10 keepy-uppies.',
    equipment: 'A ball (cones or shoes as markers)',
    durationMin: 25,
    upgrade: 'Time your dribble run and beat it by 2 seconds.',
    xp: 25,
    skills: ['agility', 'ball control'],
    whyMatters:
      'Sport-specific drills sharpen coordination and stamina while feeling like real training.',
    indoor: false,
    outdoor: true,
    tags: ['outdoor', 'football', 'sport', 'agility'],
  },
  {
    id: 'mq-810-agility-ladder',
    ageBand: '8-10',
    title: 'Speed & Agility Drills',
    emoji: '⚡',
    theme: 'Sprint Squad',
    challenge:
      'Quick feet for 20 seconds, side-shuffles, then 3 short sprints. Rest between each.',
    equipment: 'None (chalk or tape optional)',
    durationMin: 15,
    upgrade: 'Add a reaction round: sprint when a partner shouts "go".',
    xp: 20,
    skills: ['speed', 'agility'],
    whyMatters:
      'Short bursts of fast movement build the speed and quick reactions used across every sport.',
    indoor: false,
    outdoor: true,
    tags: ['outdoor', 'running', 'speed', 'agility'],
  },
  {
    id: 'mq-810-jump-rope',
    ageBand: '8-10',
    title: 'Jump Rope Challenge',
    emoji: '🪢',
    theme: 'Cardio Champ',
    challenge:
      'How many skips in a row? Try 3 sets and beat your best each time.',
    equipment: 'Skipping rope',
    durationMin: 12,
    upgrade: 'Mix in criss-cross or one-foot skips.',
    xp: 20,
    skills: ['cardio', 'coordination'],
    whyMatters:
      'Skipping is brilliant cardio and rhythm training — a few minutes really gets the heart going.',
    indoor: true,
    outdoor: true,
    tags: ['indoor', 'cardio', 'coordination', 'skipping'],
  },
  {
    id: 'mq-810-strength-circuit',
    ageBand: '8-10',
    title: 'Bodyweight Strength Circuit',
    emoji: '💪',
    theme: 'Strong Athlete',
    challenge: '3 rounds: 8 push-ups (knees ok), 10 squats, 20-second plank.',
    equipment: 'None',
    durationMin: 15,
    upgrade: 'Add 5 lunges on each leg to every round.',
    xp: 25,
    skills: ['strength', 'core'],
    whyMatters:
      'Bodyweight strength builds healthy muscles and bones and supports every other sport.',
    indoor: true,
    outdoor: true,
    tags: ['indoor', 'strength', 'bodyweight', 'core'],
  },
  {
    id: 'mq-810-basketball',
    ageBand: '8-10',
    title: 'Basketball Shooting Practice',
    emoji: '🏀',
    theme: 'Court Star',
    challenge: '20 shots from different spots — count how many you sink.',
    equipment: 'Basketball & hoop',
    durationMin: 20,
    upgrade: 'Add 10 dribble figure-of-eights between your legs.',
    xp: 20,
    skills: ['aim', 'coordination'],
    whyMatters:
      'Shooting and dribbling build coordination and focus while keeping you moving.',
    indoor: false,
    outdoor: true,
    tags: ['outdoor', 'basketball', 'sport', 'ball'],
  },
  {
    id: 'mq-810-dance-fit',
    ageBand: '8-10',
    title: 'Dance Fitness Routine',
    emoji: '🎶',
    theme: 'Dance Crew',
    challenge:
      'Learn a short routine from a video and perform it twice through.',
    equipment: 'Music / screen',
    durationMin: 15,
    upgrade: 'Choreograph an 8-count of your own to add on.',
    xp: 20,
    skills: ['rhythm', 'stamina'],
    whyMatters:
      'Dance is full-body cardio that builds rhythm, memory and confidence.',
    indoor: true,
    outdoor: false,
    tags: ['indoor', 'dance', 'music', 'cardio'],
  },

  // ─── 10–12 — autonomy, mastery & identity ───────────────────────────────
  {
    id: 'mq-1012-personal-best',
    ageBand: '10-12',
    title: 'Beat Your Personal Best',
    emoji: '🏆',
    theme: 'Self-Coach',
    challenge:
      'Pick one: max push-ups, longest plank, or fastest 200m. Record it and try to beat it.',
    equipment: 'None (timer)',
    durationMin: 15,
    upgrade: 'Log your score weekly and track your progress.',
    xp: 30,
    skills: ['strength', 'goal-setting'],
    whyMatters:
      'Setting and beating your own targets builds fitness and the confidence that comes from real progress.',
    indoor: true,
    outdoor: true,
    tags: ['strength', 'goal-setting', 'bodyweight'],
  },
  {
    id: 'mq-1012-hiit',
    ageBand: '10-12',
    title: 'Quick HIIT Blast',
    emoji: '🔥',
    theme: 'Athlete Mode',
    challenge:
      '30 seconds on / 30 off: high knees, squat jumps, mountain climbers, fast feet. 2 rounds.',
    equipment: 'None',
    durationMin: 12,
    upgrade: 'Add a third round or shorten the rests to 20 seconds.',
    xp: 30,
    skills: ['cardio', 'power'],
    whyMatters:
      'Short intense bursts are an efficient way to build stamina and power — great when time is tight.',
    indoor: true,
    outdoor: true,
    tags: ['indoor', 'cardio', 'strength', 'power'],
  },
  {
    id: 'mq-1012-skill-mastery',
    ageBand: '10-12',
    title: 'Skill Mastery Lab',
    emoji: '🎯',
    theme: 'Specialist',
    challenge:
      'Choose a skill (juggling a ball, a basketball layup, a dance move) and drill it for 15 minutes.',
    equipment: 'Depends on skill',
    durationMin: 15,
    upgrade: 'Film yourself, then try to fix one thing on the next attempt.',
    xp: 25,
    skills: ['focus', 'technique'],
    whyMatters:
      'Deep practice on one skill builds mastery — and the patience and focus that go with it.',
    indoor: true,
    outdoor: true,
    tags: ['sport', 'technique', 'focus'],
  },
  {
    id: 'mq-1012-run-club',
    ageBand: '10-12',
    title: 'Solo Run Club',
    emoji: '🏃',
    theme: 'Endurance',
    challenge:
      'Run/walk intervals: 2 min run, 1 min walk × 4. Note how far you got.',
    equipment: 'None',
    durationMin: 15,
    upgrade: 'Next time, add an extra run interval or pick a longer route.',
    xp: 25,
    skills: ['endurance', 'pacing'],
    whyMatters:
      'Building endurance gradually gives you energy for everything else — and it’s yours to own.',
    indoor: false,
    outdoor: true,
    tags: ['outdoor', 'running', 'endurance', 'cardio'],
  },
  {
    id: 'mq-1012-team-game',
    ageBand: '10-12',
    title: 'Pick-Up Team Game',
    emoji: '🤝',
    theme: 'Captain',
    challenge:
      'Organise a game with friends or family — football, basketball, rounders. You set the rules.',
    equipment: 'A ball',
    durationMin: 30,
    upgrade: 'Rotate captains so everyone leads a round.',
    xp: 30,
    skills: ['teamwork', 'leadership'],
    whyMatters:
      'Team games build fitness, social skills and the buzz of playing together — and you’re in charge.',
    indoor: false,
    outdoor: true,
    tags: ['outdoor', 'sport', 'team', 'ball'],
  },
  {
    id: 'mq-1012-mobility',
    ageBand: '10-12',
    title: 'Mobility & Stretch Flow',
    emoji: '🧘',
    theme: 'Recovery Day',
    challenge:
      'A 10-minute flow: lunges, shoulder rolls, hamstring and back stretches, deep breaths.',
    equipment: 'None',
    durationMin: 10,
    upgrade: 'Hold each stretch 5 seconds longer and add a balance pose.',
    xp: 20,
    skills: ['flexibility', 'recovery'],
    whyMatters:
      'Stretching keeps you moving well, prevents aches and helps you wind down — recovery is training too.',
    indoor: true,
    outdoor: false,
    tags: ['indoor', 'flexibility', 'mindfulness', 'recovery'],
  },
];

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
    .filter(q => q.ageBand === ageBand)
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
