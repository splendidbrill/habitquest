import type { Pillar } from '../services/syncService';

export type AdventureStage = {
  index: number;
  title: string;
  description: string;
  emoji: string;
  parentTask: string;
  childTask: string;
  xpPerPerson: number;
  pillar: Pillar;
};

export type Adventure = {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  colors: [string, string];
  durationDays: number;
  stages: AdventureStage[];
  completionBadgeId: string;
  completionBadgeName: string;
};

const adventures: Adventure[] = [
  {
    id: 'jungle-expedition',
    title: 'Jungle Expedition',
    tagline: 'Discover new foods in the wild',
    emoji: '🌿',
    colors: ['#16a34a', '#15803d'],
    durationDays: 5,
    completionBadgeId: 'jungle-explorer',
    completionBadgeName: 'Jungle Explorer',
    stages: [
      {
        index: 0, emoji: '🎒',
        title: 'Pack Your Bag',
        description: 'Every expedition needs preparation. Start strong.',
        parentTask: 'Plan this week\'s meals with the family',
        childTask: 'Eat breakfast without skipping today',
        xpPerPerson: 30, pillar: 'nutrition',
      },
      {
        index: 1, emoji: '🌴',
        title: 'Enter the Jungle',
        description: 'The adventure begins. Move through the terrain.',
        parentTask: 'Take a 15-minute walk outside with the family',
        childTask: 'Do 10 minutes of active movement today',
        xpPerPerson: 35, pillar: 'movement',
      },
      {
        index: 2, emoji: '🌱',
        title: 'Discover a New Plant',
        description: 'Explorers try things they\'ve never seen before.',
        parentTask: 'Cook a meal with one vegetable your child hasn\'t tried',
        childTask: 'Taste one new food today — just one bite counts!',
        xpPerPerson: 40, pillar: 'nutrition',
      },
      {
        index: 3, emoji: '🌊',
        title: 'Cross the River',
        description: 'Push through the challenge together.',
        parentTask: 'Do a 20-minute activity alongside your child',
        childTask: 'Complete a movement mission today',
        xpPerPerson: 40, pillar: 'movement',
      },
      {
        index: 4, emoji: '🏕️',
        title: 'Reach Base Camp',
        description: 'Wind down and celebrate as a family.',
        parentTask: 'Have a screen-free dinner together tonight',
        childTask: 'Be in bed on time — rest is part of the adventure',
        xpPerPerson: 50, pillar: 'sleep',
      },
    ],
  },
  {
    id: 'space-mission',
    title: 'Space Mission Alpha',
    tagline: 'Fuel up and launch into orbit',
    emoji: '🚀',
    colors: ['#1e3a5f', '#3b82f6'],
    durationDays: 4,
    completionBadgeId: 'space-pioneer',
    completionBadgeName: 'Space Pioneer',
    stages: [
      {
        index: 0, emoji: '📋',
        title: 'Mission Briefing',
        description: 'Every astronaut knows their mission.',
        parentTask: 'Write down one health goal for the family this week',
        childTask: 'Tell someone one thing you want to get better at',
        xpPerPerson: 30, pillar: 'confidence',
      },
      {
        index: 1, emoji: '⛽',
        title: 'Fuel the Rocket',
        description: 'High-performance fuel for a high-performance mission.',
        parentTask: 'Prepare a protein-rich breakfast for the family',
        childTask: 'Drink water instead of juice all day',
        xpPerPerson: 35, pillar: 'nutrition',
      },
      {
        index: 2, emoji: '🔥',
        title: 'Launch Day',
        description: '3... 2... 1... Everything you\'ve got.',
        parentTask: 'Be active for 30 minutes today — anything counts',
        childTask: 'Complete a hard movement mission today',
        xpPerPerson: 45, pillar: 'movement',
      },
      {
        index: 3, emoji: '🌍',
        title: 'Orbit Complete',
        description: 'Mission accomplished. Rest and recover.',
        parentTask: 'Make sure everyone is in bed on time tonight',
        childTask: 'No screens for 30 minutes before bed tonight',
        xpPerPerson: 50, pillar: 'sleep',
      },
    ],
  },
  {
    id: 'underwater-quest',
    title: 'Underwater Quest',
    tagline: 'Explore the deep and discover hidden treasures',
    emoji: '🐠',
    colors: ['#0891b2', '#0e7490'],
    durationDays: 4,
    completionBadgeId: 'deep-diver',
    completionBadgeName: 'Deep Diver',
    stages: [
      {
        index: 0, emoji: '🤿',
        title: 'Dive In',
        description: 'Take the plunge. The ocean awaits.',
        parentTask: 'Introduce a new fruit or vegetable at dinner tonight',
        childTask: 'Eat at least 2 different coloured foods today',
        xpPerPerson: 30, pillar: 'nutrition',
      },
      {
        index: 1, emoji: '🐟',
        title: 'Swim With the Fish',
        description: 'Fluid movement through the deep.',
        parentTask: 'Go for a walk, swim, or any outdoor activity for 20 minutes',
        childTask: 'Do something active for 15 minutes today',
        xpPerPerson: 35, pillar: 'movement',
      },
      {
        index: 2, emoji: '💎',
        title: 'Find the Treasure',
        description: 'Sometimes the treasure is doing something scary.',
        parentTask: 'Share something you\'re proud of with your child',
        childTask: 'Do something brave today — it doesn\'t have to be big',
        xpPerPerson: 40, pillar: 'confidence',
      },
      {
        index: 3, emoji: '🌅',
        title: 'Surface Together',
        description: 'Come back up stronger than before.',
        parentTask: 'Cook a healthy meal together as a family',
        childTask: 'Help prepare or set the table for dinner',
        xpPerPerson: 50, pillar: 'nutrition',
      },
    ],
  },
  {
    id: 'mountain-summit',
    title: 'Mountain Summit',
    tagline: 'The climb is hard. The view is worth it.',
    emoji: '🏔️',
    colors: ['#4b5563', '#374151'],
    durationDays: 5,
    completionBadgeId: 'summit-champion',
    completionBadgeName: 'Summit Champion',
    stages: [
      {
        index: 0, emoji: '🏘️',
        title: 'Base Village',
        description: 'Every summit starts at the bottom. Get ready.',
        parentTask: 'Plan a healthy snack for the family for tomorrow',
        childTask: 'Eat all your meals today without skipping any',
        xpPerPerson: 25, pillar: 'nutrition',
      },
      {
        index: 1, emoji: '🥾',
        title: 'First Ascent',
        description: 'One step at a time. Keep moving.',
        parentTask: 'Go for a 20-minute walk with your child',
        childTask: 'Walk, run, or bike for at least 10 minutes',
        xpPerPerson: 35, pillar: 'movement',
      },
      {
        index: 2, emoji: '💪',
        title: 'The Hard Part',
        description: 'This is where most people give up. Not you.',
        parentTask: 'Give your child a specific, genuine compliment today',
        childTask: 'Do one thing you\'ve been putting off',
        xpPerPerson: 40, pillar: 'confidence',
      },
      {
        index: 3, emoji: '⛰️',
        title: 'Almost There',
        description: 'Dig deep. The summit is in sight.',
        parentTask: 'Screens off 30 mins before bedtime for everyone tonight',
        childTask: 'Get to bed on time — your body needs the recovery',
        xpPerPerson: 40, pillar: 'sleep',
      },
      {
        index: 4, emoji: '🏆',
        title: 'Summit!',
        description: 'You did it together. Celebrate as a family.',
        parentTask: 'Do something special to celebrate as a family',
        childTask: 'Tell your family one thing you\'re proud of this week',
        xpPerPerson: 60, pillar: 'confidence',
      },
    ],
  },
];

export default adventures;
