// ============================================================
// Activity Archetypes — identity-based activity patterns the family
// swipes on during onboarding. Feeds the preference engine (Phase 4)
// and the Activity Engine (Phase 5). Pillar + tags reuse the
// missionCatalog.ts vocabulary so signals are interoperable.
// ============================================================

import type { Pillar } from '../services/syncService';

export type ActivityCategory =
  | 'ball_sport'
  | 'dance'
  | 'running'
  | 'cycling'
  | 'strength'
  | 'outdoor_play'
  | 'mindfulness'
  | 'creative'
  | 'water'
  | 'martial_arts';

export interface ActivityArchetype {
  id: string;
  title: string;
  emoji: string;
  category: ActivityCategory;
  indoor: boolean;
  competitive: boolean;
  solo: boolean;
  pillar: Pillar;
  tags: string[];
}

export const activityArchetypes: ActivityArchetype[] = [
  {
    id: 'act-football',
    title: 'Football in the Park',
    emoji: '⚽',
    category: 'ball_sport',
    indoor: false,
    competitive: true,
    solo: false,
    pillar: 'movement',
    tags: ['football', 'sport', 'outdoor'],
  },
  {
    id: 'act-basketball',
    title: 'Basketball Shooting',
    emoji: '🏀',
    category: 'ball_sport',
    indoor: false,
    competitive: true,
    solo: true,
    pillar: 'movement',
    tags: ['basketball', 'sport', 'outdoor'],
  },
  {
    id: 'act-tennis',
    title: 'Tennis / Racket Games',
    emoji: '🎾',
    category: 'ball_sport',
    indoor: false,
    competitive: true,
    solo: false,
    pillar: 'movement',
    tags: ['racket', 'sport', 'coordination'],
  },
  {
    id: 'act-cricket',
    title: 'Garden Cricket',
    emoji: '🏏',
    category: 'ball_sport',
    indoor: false,
    competitive: true,
    solo: false,
    pillar: 'movement',
    tags: ['cricket', 'family', 'outdoor'],
  },
  {
    id: 'act-dance',
    title: 'Dance Party',
    emoji: '💃',
    category: 'dance',
    indoor: true,
    competitive: false,
    solo: false,
    pillar: 'confidence',
    tags: ['dance', 'music', 'indoor'],
  },
  {
    id: 'act-just-dance',
    title: 'Follow-the-Moves',
    emoji: '🕺',
    category: 'dance',
    indoor: true,
    competitive: false,
    solo: true,
    pillar: 'movement',
    tags: ['dance', 'indoor', 'fun'],
  },
  {
    id: 'act-running',
    title: 'Running & Sprints',
    emoji: '🏃',
    category: 'running',
    indoor: false,
    competitive: true,
    solo: true,
    pillar: 'movement',
    tags: ['running', 'speed', 'outdoor'],
  },
  {
    id: 'act-scavenger',
    title: 'Park Scavenger Hunt',
    emoji: '🔍',
    category: 'outdoor_play',
    indoor: false,
    competitive: false,
    solo: false,
    pillar: 'movement',
    tags: ['outdoor', 'exploring', 'family'],
  },
  {
    id: 'act-cycling',
    title: 'Bike Ride',
    emoji: '🚲',
    category: 'cycling',
    indoor: false,
    competitive: false,
    solo: false,
    pillar: 'movement',
    tags: ['cycling', 'outdoor', 'family'],
  },
  {
    id: 'act-scooter',
    title: 'Scooter Skills',
    emoji: '🛴',
    category: 'cycling',
    indoor: false,
    competitive: false,
    solo: true,
    pillar: 'movement',
    tags: ['scooter', 'outdoor', 'balance'],
  },
  {
    id: 'act-skipping',
    title: 'Skipping Challenge',
    emoji: '🪢',
    category: 'strength',
    indoor: true,
    competitive: true,
    solo: true,
    pillar: 'movement',
    tags: ['cardio', 'coordination', 'indoor'],
  },
  {
    id: 'act-bodyweight',
    title: 'Superhero Workout',
    emoji: '💪',
    category: 'strength',
    indoor: true,
    competitive: false,
    solo: true,
    pillar: 'movement',
    tags: ['strength', 'bodyweight', 'indoor'],
  },
  {
    id: 'act-obstacle',
    title: 'Living-Room Obstacle',
    emoji: '🤸',
    category: 'outdoor_play',
    indoor: true,
    competitive: true,
    solo: true,
    pillar: 'movement',
    tags: ['indoor', 'fun', 'agility'],
  },
  {
    id: 'act-trampoline',
    title: 'Trampoline / Jumping',
    emoji: '🦘',
    category: 'outdoor_play',
    indoor: false,
    competitive: false,
    solo: true,
    pillar: 'movement',
    tags: ['jumping', 'outdoor', 'fun'],
  },
  {
    id: 'act-yoga',
    title: 'Kids Yoga & Stretch',
    emoji: '🧘',
    category: 'mindfulness',
    indoor: true,
    competitive: false,
    solo: true,
    pillar: 'sleep',
    tags: ['calm', 'wind-down', 'indoor'],
  },
  {
    id: 'act-breathing',
    title: 'Calm-Down Breathing',
    emoji: '🌬️',
    category: 'mindfulness',
    indoor: true,
    competitive: false,
    solo: true,
    pillar: 'confidence',
    tags: ['calm', 'mindful', 'routine'],
  },
  {
    id: 'act-nature-walk',
    title: 'Nature Walk',
    emoji: '🚶',
    category: 'outdoor_play',
    indoor: false,
    competitive: false,
    solo: false,
    pillar: 'movement',
    tags: ['walking', 'outdoor', 'calm'],
  },
  {
    id: 'act-gardening',
    title: 'Gardening Together',
    emoji: '🪴',
    category: 'creative',
    indoor: false,
    competitive: false,
    solo: false,
    pillar: 'confidence',
    tags: ['outdoor', 'family', 'growing'],
  },
  {
    id: 'act-crafts',
    title: 'Active Craft Challenge',
    emoji: '🎨',
    category: 'creative',
    indoor: true,
    competitive: false,
    solo: true,
    pillar: 'confidence',
    tags: ['creative', 'indoor', 'making'],
  },
  {
    id: 'act-cooking',
    title: 'Cook-Together Mission',
    emoji: '🍳',
    category: 'creative',
    indoor: true,
    competitive: false,
    solo: false,
    pillar: 'nutrition',
    tags: ['cook-together', 'family', 'kitchen'],
  },
  {
    id: 'act-swimming',
    title: 'Swimming',
    emoji: '🏊',
    category: 'water',
    indoor: true,
    competitive: false,
    solo: false,
    pillar: 'movement',
    tags: ['swimming', 'water', 'sport'],
  },
  {
    id: 'act-water-play',
    title: 'Garden Water Play',
    emoji: '💦',
    category: 'water',
    indoor: false,
    competitive: false,
    solo: false,
    pillar: 'movement',
    tags: ['water', 'outdoor', 'fun'],
  },
  {
    id: 'act-martial',
    title: 'Martial Arts Moves',
    emoji: '🥋',
    category: 'martial_arts',
    indoor: true,
    competitive: true,
    solo: true,
    pillar: 'confidence',
    tags: ['discipline', 'strength', 'focus'],
  },
  {
    id: 'act-balance',
    title: 'Balance & Reflex Games',
    emoji: '🎯',
    category: 'martial_arts',
    indoor: true,
    competitive: true,
    solo: true,
    pillar: 'movement',
    tags: ['balance', 'reaction', 'game'],
  },
];
