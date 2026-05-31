import type { Pillar } from '../services/syncService';

export type Barrier =
  | 'no_time'
  | 'child_refused'
  | 'forgot'
  | 'no_ingredients'
  | 'too_tired'
  | 'other';

export type BarrierResponse = {
  empathy: string;
  alternative: string;
  tomorrowStrategy: string;
  parentTip: string;
};

// ─── Barrier metadata ─────────────────────────────────────────────────────────
export const BARRIERS: { id: Barrier; label: string; emoji: string }[] = [
  { id: 'no_time',        label: 'No time today',       emoji: '⏰' },
  { id: 'child_refused',  label: 'Child refused',        emoji: '😤' },
  { id: 'forgot',         label: 'We forgot',            emoji: '🤦' },
  { id: 'no_ingredients', label: 'Missing ingredients',  emoji: '🛒' },
  { id: 'too_tired',      label: 'Too tired',            emoji: '😴' },
  { id: 'other',          label: 'Something else',       emoji: '💭' },
];

// ─── Responses by barrier × pillar ───────────────────────────────────────────
// Each barrier has a base response + pillar-specific alternative
const BASE: Record<Barrier, Omit<BarrierResponse, 'alternative'>> = {
  no_time: {
    empathy:         "Busy days happen — you haven't failed anything.",
    tomorrowStrategy: "Block 10 minutes after school tomorrow before anything else starts.",
    parentTip:       "The quickest wins build the same habits as longer ones. A 2-minute version still counts.",
  },
  child_refused: {
    empathy:         "Resistance is normal — it doesn't mean the habit isn't forming.",
    tomorrowStrategy: "Tomorrow, let them choose between two options rather than presenting one. Choice reduces resistance.",
    parentTip:       "Never force or bribe. Curiosity works better — 'I wonder what would happen if...' beats 'you have to.'",
  },
  forgot: {
    empathy:         "Forgetting isn't failure — it means the habit isn't automatic yet. That's fine at this stage.",
    tomorrowStrategy: "Attach it to something that already happens tomorrow — after breakfast, after school pickup, after teeth brushing.",
    parentTip:       "Habit stacking is the most reliable reminder. Pick one existing routine and attach the mission to it.",
  },
  no_ingredients: {
    empathy:         "Real life gets in the way of the plan sometimes. That's okay.",
    tomorrowStrategy: "Add the one or two missing items to your shopping list tonight so tomorrow is set up.",
    parentTip:       "Keep 3-4 fallback foods in the house that cover your most common missions — it removes the planning friction.",
  },
  too_tired: {
    empathy:         "Tired days are real. Pushing through exhaustion isn't the goal here.",
    tomorrowStrategy: "Tomorrow, try first thing in the morning when energy is higher rather than end of day.",
    parentTip:       "Energy follows movement for kids. A very gentle version of the activity often leads to engagement — start tiny.",
  },
  other: {
    empathy:         "Life is unpredictable. One missed day doesn't break a habit.",
    tomorrowStrategy: "Reset tomorrow with the simplest possible version of today's mission.",
    parentTip:       "Consistency over weeks matters more than perfection on any single day. Missing occasionally is built into the plan.",
  },
};

// Pillar-specific 5-minute alternatives
const ALTERNATIVES: Record<Barrier, Record<Pillar, string>> = {
  no_time: {
    nutrition:  "Quick win: put one piece of fruit on the table right now. No prep needed.",
    movement:   "Quick win: 5 jumping jacks together before bed — takes 30 seconds.",
    sleep:      "Quick win: dim the lights now. That alone starts the sleep signal.",
    confidence: "Quick win: one genuine specific compliment to your child before they sleep.",
  },
  child_refused: {
    nutrition:  "Try a taste challenge instead — just one lick, no commitment to eating it.",
    movement:   "Make it a race or a game. 'Can you do 5 hops before I count to 3?'",
    sleep:      "Let them pick the bedtime story or the pyjamas — ownership reduces resistance.",
    confidence: "Back off today. Forced participation kills confidence. Try again tomorrow with a lower bar.",
  },
  forgot: {
    nutrition:  "Still time tonight: swap one thing on the dinner table for a vegetable.",
    movement:   "Walk to the car or the corner shop together — movement doesn't need a session.",
    sleep:      "Start the wind-down now, even if it's late. Routine matters more than timing.",
    confidence: "Ask one open question at dinner: 'What was the best part of today?'",
  },
  no_ingredients: {
    nutrition:  "Frozen veg counts. Tinned fruit counts. Check the cupboard before giving up.",
    movement:   "No equipment needed — the floor is enough for jumping, crawling, planking.",
    sleep:      "Sleep missions don't need ingredients — just consistency with lights and screens.",
    confidence: "Confidence missions are always available — they're about connection, not stuff.",
  },
  too_tired: {
    nutrition:  "Simplest version: everyone drinks a glass of water together. That counts.",
    movement:   "Stretch together for 2 minutes. YouTube has dozens of 2-minute kids stretches.",
    sleep:      "Early to bed IS the mission on a tired day. Let it be that simple.",
    confidence: "A hug and 'I'm proud of you' takes 5 seconds and hits the goal completely.",
  },
  other: {
    nutrition:  "Tomorrow: pick the simplest food mission on the list and do just that one.",
    movement:   "Tomorrow: pick a movement that takes under 5 minutes and commit to just that.",
    sleep:      "Tomorrow: pick one consistent bedtime and stick to it — even by 15 minutes.",
    confidence: "Tomorrow: one moment of undivided attention, phone away, fully present.",
  },
};

// ─── Main resolver function ───────────────────────────────────────────────────
export function resolveBarrier(barrier: Barrier, pillar: Pillar): BarrierResponse {
  return {
    ...BASE[barrier],
    alternative: ALTERNATIVES[barrier][pillar],
  };
}
