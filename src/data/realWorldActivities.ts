import type { Pillar } from '../services/syncService';

// ─── Real-world activity catalog ──────────────────────────────────────────────
// Parents log things their child did away from the app (played football, tried a
// new vegetable, went to bed on time…). Each one feeds the same pillar scores /
// streak / XP pipeline as in-app missions via services/realWorldLog.ts.
export type RealWorldActivity = {
  id: string;
  label: string;
  emoji: string;
  pillar: Pillar;
  xp: number;
};

export const REAL_WORLD_ACTIVITIES: RealWorldActivity[] = [
  // ─── Nutrition ───────────────────────────────────────────────────────────
  {
    id: 'rw-nutr-1',
    label: 'Tried a new fruit or vegetable',
    emoji: '🥦',
    pillar: 'nutrition',
    xp: 10,
  },
  {
    id: 'rw-nutr-2',
    label: 'Ate 5 a day',
    emoji: '🌈',
    pillar: 'nutrition',
    xp: 10,
  },
  {
    id: 'rw-nutr-3',
    label: 'Helped cook a meal',
    emoji: '👩‍🍳',
    pillar: 'nutrition',
    xp: 8,
  },
  {
    id: 'rw-nutr-4',
    label: 'Water instead of a sugary drink',
    emoji: '💧',
    pillar: 'nutrition',
    xp: 6,
  },
  {
    id: 'rw-nutr-5',
    label: 'Ate together as a family',
    emoji: '🍽️',
    pillar: 'nutrition',
    xp: 6,
  },

  // ─── Movement ────────────────────────────────────────────────────────────
  {
    id: 'rw-move-1',
    label: 'Played a sport',
    emoji: '⚽',
    pillar: 'movement',
    xp: 10,
  },
  {
    id: 'rw-move-2',
    label: 'Active outdoor play',
    emoji: '🌳',
    pillar: 'movement',
    xp: 8,
  },
  {
    id: 'rw-move-3',
    label: 'Walked or cycled somewhere',
    emoji: '🚲',
    pillar: 'movement',
    xp: 8,
  },
  {
    id: 'rw-move-4',
    label: 'Went swimming',
    emoji: '🏊',
    pillar: 'movement',
    xp: 10,
  },
  {
    id: 'rw-move-5',
    label: 'Danced or did a workout',
    emoji: '💃',
    pillar: 'movement',
    xp: 6,
  },

  // ─── Sleep ───────────────────────────────────────────────────────────────
  {
    id: 'rw-sleep-1',
    label: 'Went to bed on time',
    emoji: '😴',
    pillar: 'sleep',
    xp: 8,
  },
  {
    id: 'rw-sleep-2',
    label: 'No screens before bed',
    emoji: '📵',
    pillar: 'sleep',
    xp: 8,
  },
  {
    id: 'rw-sleep-3',
    label: 'Calm bedtime routine',
    emoji: '🛁',
    pillar: 'sleep',
    xp: 6,
  },
  {
    id: 'rw-sleep-4',
    label: 'Woke up rested',
    emoji: '☀️',
    pillar: 'sleep',
    xp: 6,
  },

  // ─── Confidence ──────────────────────────────────────────────────────────
  {
    id: 'rw-conf-1',
    label: 'Tried something new or brave',
    emoji: '💪',
    pillar: 'confidence',
    xp: 10,
  },
  {
    id: 'rw-conf-2',
    label: 'Helped someone',
    emoji: '🤝',
    pillar: 'confidence',
    xp: 8,
  },
  {
    id: 'rw-conf-3',
    label: 'Joined in with a group',
    emoji: '🎯',
    pillar: 'confidence',
    xp: 8,
  },
  {
    id: 'rw-conf-4',
    label: 'Talked about their feelings',
    emoji: '💬',
    pillar: 'confidence',
    xp: 6,
  },
  {
    id: 'rw-conf-5',
    label: 'Stuck with something tricky',
    emoji: '🌟',
    pillar: 'confidence',
    xp: 8,
  },
];

export function activitiesForPillar(pillar: Pillar): RealWorldActivity[] {
  return REAL_WORLD_ACTIVITIES.filter(a => a.pillar === pillar);
}
