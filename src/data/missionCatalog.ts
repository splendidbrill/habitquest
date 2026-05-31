import type { Pillar } from '../services/syncService';

export type AgeGroup = '6-8' | '8-10' | '10-12';

export type CatalogMission = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  pillar: Pillar;
  ageGroup: AgeGroup;
  difficulty: 'easy' | 'medium' | 'hard';
  durationMin: number;
  tags: string[];          // used for matching food/activity preferences
  screen: string;          // navigation target
};

const missions: CatalogMission[] = [

  // ─── 6-8 — Movement ──────────────────────────────────────────────────────
  { id: '68-move-1', title: 'Jump Like 5 Animals!', subtitle: 'Kangaroo, frog, bunny, monkey, tiger!', emoji: '🦘', pillar: 'movement', ageGroup: '6-8', difficulty: 'easy',   durationMin: 5,  tags: ['jumping', 'indoor', 'fun'],          screen: 'KidsDailyMission' },
  { id: '68-move-2', title: 'Dance for 5 Minutes!', subtitle: 'Put on your favourite song',            emoji: '💃', pillar: 'movement', ageGroup: '6-8', difficulty: 'easy',   durationMin: 5,  tags: ['dance', 'indoor', 'music'],          screen: 'KidsDailyMission' },
  { id: '68-move-3', title: 'Play at the Park!',    subtitle: 'Run, swing, or kick a ball',            emoji: '⚽', pillar: 'movement', ageGroup: '6-8', difficulty: 'easy',   durationMin: 30, tags: ['outdoor', 'sport', 'running'],       screen: 'KidsDailyMission' },
  { id: '68-move-4', title: 'Bike Ride Adventure!', subtitle: 'Go for a bike ride with family',        emoji: '🚲', pillar: 'movement', ageGroup: '6-8', difficulty: 'medium', durationMin: 20, tags: ['outdoor', 'cycling', 'family'],      screen: 'KidsDailyMission' },
  { id: '68-move-5', title: '10 Star Jumps!',       subtitle: 'Count them out loud',                   emoji: '⭐', pillar: 'movement', ageGroup: '6-8', difficulty: 'easy',   durationMin: 2,  tags: ['indoor', 'jumping', 'quick'],        screen: 'KidsDailyMission' },

  // ─── 6-8 — Nutrition ─────────────────────────────────────────────────────
  { id: '68-nutr-1', title: 'Try One New Fruit!',     subtitle: 'Ask a grown-up to help you pick',     emoji: '🍎', pillar: 'nutrition', ageGroup: '6-8', difficulty: 'easy',   durationMin: 5,  tags: ['fruit', 'trying', 'new_food'],       screen: 'KidsFoodDiscovery' },
  { id: '68-nutr-2', title: 'Drink Water with Lunch', subtitle: 'Instead of juice or squash',          emoji: '💧', pillar: 'nutrition', ageGroup: '6-8', difficulty: 'easy',   durationMin: 1,  tags: ['water', 'hydration', 'drinks'],      screen: 'KidsDinnerChoice'  },
  { id: '68-nutr-3', title: 'Help Set the Table!',    subtitle: 'Get the family meal ready together',  emoji: '🍽️', pillar: 'nutrition', ageGroup: '6-8', difficulty: 'easy',   durationMin: 5,  tags: ['family', 'helping', 'mealtime'],     screen: 'KidsKitchenHelper' },
  { id: '68-nutr-4', title: 'Pick a Veggie Tonight',  subtitle: 'Choose one vegetable for dinner',     emoji: '🥦', pillar: 'nutrition', ageGroup: '6-8', difficulty: 'easy',   durationMin: 5,  tags: ['vegetables', 'choice', 'dinner'],    screen: 'KidsVeggieSelector'},
  { id: '68-nutr-5', title: 'Eat a Rainbow Plate!',   subtitle: '3 different colours on your plate',  emoji: '🌈', pillar: 'nutrition', ageGroup: '6-8', difficulty: 'medium', durationMin: 10, tags: ['vegetables', 'fruit', 'variety'],    screen: 'KidsDinnerChoice'  },

  // ─── 6-8 — Sleep ─────────────────────────────────────────────────────────
  { id: '68-sleep-1', title: 'In Bed on Time Tonight', subtitle: 'Lights out at your normal time',    emoji: '😴', pillar: 'sleep', ageGroup: '6-8', difficulty: 'easy',   durationMin: 5,  tags: ['bedtime', 'routine', 'calm'],        screen: 'KidsDailyMission' },
  { id: '68-sleep-2', title: 'No Screens After 7pm',   subtitle: 'Read or draw instead',              emoji: '📵', pillar: 'sleep', ageGroup: '6-8', difficulty: 'medium', durationMin: 60, tags: ['screens', 'wind-down', 'calm'],      screen: 'KidsDailyMission' },

  // ─── 6-8 — Confidence ────────────────────────────────────────────────────
  { id: '68-conf-1', title: 'Tell Someone Something!', subtitle: 'Share something you\'re proud of', emoji: '🌟', pillar: 'confidence', ageGroup: '6-8', difficulty: 'easy', durationMin: 2,  tags: ['sharing', 'pride', 'family'],        screen: 'KidsDailyMission' },
  { id: '68-conf-2', title: 'Try Something New Today', subtitle: 'Anything counts — be brave!',      emoji: '💪', pillar: 'confidence', ageGroup: '6-8', difficulty: 'easy', durationMin: 10, tags: ['bravery', 'new', 'trying'],          screen: 'KidsDailyMission' },

  // ─── 8-10 — Movement ─────────────────────────────────────────────────────
  { id: '810-move-1', title: 'Speed & Agility Drills',   subtitle: 'Reaction & agility training',    emoji: '⚡', pillar: 'movement', ageGroup: '8-10', difficulty: 'medium', durationMin: 20, tags: ['sport', 'speed', 'agility'],         screen: 'Kids8DailyMission'    },
  { id: '810-move-2', title: 'Football Skills Training', subtitle: 'Dribbling & shooting practice',  emoji: '⚽', pillar: 'movement', ageGroup: '8-10', difficulty: 'medium', durationMin: 30, tags: ['football', 'sport', 'outdoor'],      screen: 'Kids8DailyMission'    },
  { id: '810-move-3', title: 'Jump Rope Challenge',      subtitle: 'Cardio & coordination',          emoji: '🪢', pillar: 'movement', ageGroup: '8-10', difficulty: 'easy',   durationMin: 15, tags: ['cardio', 'coordination', 'indoor'],  screen: 'Kids8DailyMission'    },
  { id: '810-move-4', title: 'Bodyweight Strength',      subtitle: 'Push-ups, planks, squats',       emoji: '💪', pillar: 'movement', ageGroup: '8-10', difficulty: 'medium', durationMin: 15, tags: ['strength', 'indoor', 'bodyweight'],  screen: 'Kids8TrainLikePro'    },
  { id: '810-move-5', title: 'Stadium Sprint',           subtitle: 'Endless runner challenge',       emoji: '🏃', pillar: 'movement', ageGroup: '8-10', difficulty: 'hard',   durationMin: 10, tags: ['running', 'speed', 'game'],          screen: 'Kids8RunnerChallenge' },
  { id: '810-move-6', title: 'Basketball Shooting',      subtitle: 'Work on your shooting game',     emoji: '🏀', pillar: 'movement', ageGroup: '8-10', difficulty: 'medium', durationMin: 25, tags: ['basketball', 'sport', 'outdoor'],    screen: 'Kids8DailyMission'    },

  // ─── 8-10 — Nutrition ────────────────────────────────────────────────────
  { id: '810-nutr-1', title: 'Protein Breakfast',      subtitle: 'Eggs, yogurt or beans at breakfast', emoji: '🥚', pillar: 'nutrition', ageGroup: '8-10', difficulty: 'easy',   durationMin: 10, tags: ['protein', 'breakfast', 'fuel'],      screen: 'Kids8FuelStation'  },
  { id: '810-nutr-2', title: 'Hydration Challenge',    subtitle: 'Drink 6 glasses of water today',    emoji: '💧', pillar: 'nutrition', ageGroup: '8-10', difficulty: 'easy',   durationMin: 1,  tags: ['water', 'hydration', 'daily'],       screen: 'Kids8FuelStation'  },
  { id: '810-nutr-3', title: 'Athlete Snack Swap',     subtitle: 'Swap one snack for a better one',   emoji: '🔄', pillar: 'nutrition', ageGroup: '8-10', difficulty: 'easy',   durationMin: 5,  tags: ['snack', 'swap', 'healthy'],          screen: 'Kids8SnackSwap'    },
  { id: '810-nutr-4', title: 'Build Your Lunch Box',   subtitle: 'Balance protein, carbs and veg',    emoji: '🍱', pillar: 'nutrition', ageGroup: '8-10', difficulty: 'medium', durationMin: 10, tags: ['lunch', 'balance', 'school'],        screen: 'Kids8LunchBuilder' },
  { id: '810-nutr-5', title: 'Try a New Vegetable',    subtitle: 'One new veg — taste counts!',       emoji: '🥦', pillar: 'nutrition', ageGroup: '8-10', difficulty: 'easy',   durationMin: 5,  tags: ['vegetables', 'trying', 'new_food'],  screen: 'Kids8DinnerChoice' },

  // ─── 8-10 — Sleep ────────────────────────────────────────────────────────
  { id: '810-sleep-1', title: 'Early Bed Tonight',    subtitle: 'Asleep by 9pm — recovery matters', emoji: '😴', pillar: 'sleep', ageGroup: '8-10', difficulty: 'easy',   durationMin: 5,  tags: ['bedtime', 'recovery', 'athlete'],    screen: 'Kids8DailyMission' },
  { id: '810-sleep-2', title: 'No Screens Before Bed', subtitle: '30 mins wind-down before sleep',  emoji: '📵', pillar: 'sleep', ageGroup: '8-10', difficulty: 'medium', durationMin: 30, tags: ['screens', 'wind-down', 'routine'],   screen: 'Kids8DailyMission' },

  // ─── 8-10 — Confidence ───────────────────────────────────────────────────
  { id: '810-conf-1', title: 'Ask Coach a Question',   subtitle: 'Learn something about nutrition',  emoji: '🎯', pillar: 'confidence', ageGroup: '8-10', difficulty: 'easy',   durationMin: 5,  tags: ['learning', 'knowledge', 'coach'],    screen: 'Kids8AskCoach'       },
  { id: '810-conf-2', title: 'Beat Your Personal Best', subtitle: 'Any activity — just beat it!',   emoji: '🏆', pillar: 'confidence', ageGroup: '8-10', difficulty: 'hard',   durationMin: 20, tags: ['achievement', 'competition', 'pb'],  screen: 'Kids8ProgressTracker'},

  // ─── 10-12 — Movement ────────────────────────────────────────────────────
  { id: '1012-move-1', title: '15-Minute Walk',          subtitle: 'Outside, no phone',             emoji: '🚶', pillar: 'movement', ageGroup: '10-12', difficulty: 'easy',   durationMin: 15, tags: ['walking', 'outdoor', 'calm'],        screen: 'Kids12Movement'       },
  { id: '1012-move-2', title: 'Micro Workout',           subtitle: '4 exercises, 30 sec each',      emoji: '⚡', pillar: 'movement', ageGroup: '10-12', difficulty: 'easy',   durationMin: 5,  tags: ['workout', 'indoor', 'quick'],        screen: 'Kids12MicroWorkouts'  },
  { id: '1012-move-3', title: '20-Min Outdoor Activity', subtitle: 'Walk, run, cycle — your choice',emoji: '🏃', pillar: 'movement', ageGroup: '10-12', difficulty: 'medium', durationMin: 20, tags: ['outdoor', 'cardio', 'choice'],       screen: 'Kids12Movement'       },
  { id: '1012-move-4', title: 'Urban Runner Game',       subtitle: 'Beat your high score',          emoji: '🎮', pillar: 'movement', ageGroup: '10-12', difficulty: 'easy',   durationMin: 5,  tags: ['game', 'fun', 'score'],              screen: 'Kids12UrbanRunner'    },
  { id: '1012-move-5', title: 'Reflex Rhythm',           subtitle: 'Reaction training game',        emoji: '🎯', pillar: 'movement', ageGroup: '10-12', difficulty: 'easy',   durationMin: 5,  tags: ['game', 'reaction', 'fun'],           screen: 'Kids12ReflexRhythm'   },

  // ─── 10-12 — Nutrition ───────────────────────────────────────────────────
  { id: '1012-nutr-1', title: 'No Sugary Drinks Today', subtitle: 'Water or milk only',            emoji: '💧', pillar: 'nutrition', ageGroup: '10-12', difficulty: 'easy',   durationMin: 1,  tags: ['drinks', 'sugar', 'water'],          screen: 'Kids12HealthyEating'  },
  { id: '1012-nutr-2', title: 'Healthy Breakfast Swap', subtitle: 'Swap one thing for better fuel',emoji: '🥣', pillar: 'nutrition', ageGroup: '10-12', difficulty: 'easy',   durationMin: 10, tags: ['breakfast', 'swap', 'fuel'],         screen: 'Kids12FoodSwaps'      },
  { id: '1012-nutr-3', title: 'Veg with Lunch',         subtitle: 'Any vegetable counts',          emoji: '🥗', pillar: 'nutrition', ageGroup: '10-12', difficulty: 'easy',   durationMin: 5,  tags: ['vegetables', 'lunch', 'school'],     screen: 'Kids12HealthyEating'  },
  { id: '1012-nutr-4', title: 'Food Swaps Challenge',   subtitle: 'Find a smarter alternative',    emoji: '🔄', pillar: 'nutrition', ageGroup: '10-12', difficulty: 'easy',   durationMin: 5,  tags: ['swap', 'smart', 'choice'],           screen: 'Kids12FoodSwaps'      },

  // ─── 10-12 — Sleep ───────────────────────────────────────────────────────
  { id: '1012-sleep-1', title: 'Consistent Bedtime',   subtitle: 'Same time as last night',       emoji: '😴', pillar: 'sleep', ageGroup: '10-12', difficulty: 'easy',   durationMin: 5,  tags: ['bedtime', 'consistent', 'routine'],  screen: 'Kids12Reflection'     },
  { id: '1012-sleep-2', title: 'Phone-Free Wind-Down', subtitle: '30 mins before bed, no screens',emoji: '📵', pillar: 'sleep', ageGroup: '10-12', difficulty: 'medium', durationMin: 30, tags: ['screens', 'wind-down', 'phone'],     screen: 'Kids12Reflection'     },

  // ─── 10-12 — Confidence ──────────────────────────────────────────────────
  { id: '1012-conf-1', title: '3 Things You\'re Grateful For', subtitle: 'Write them down',      emoji: '✍️', pillar: 'confidence', ageGroup: '10-12', difficulty: 'easy',   durationMin: 5,  tags: ['gratitude', 'journaling', 'mindset'], screen: 'Kids12Reflection'      },
  { id: '1012-conf-2', title: 'Mood Check-in',        subtitle: 'How are you actually feeling?',  emoji: '💭', pillar: 'confidence', ageGroup: '10-12', difficulty: 'easy',   durationMin: 3,  tags: ['mood', 'self-awareness', 'honest'],   screen: 'Kids12CheckIn'         },
  { id: '1012-conf-3', title: 'Try Something That Scares You a Little', subtitle: 'Small acts of courage', emoji: '🦁', pillar: 'confidence', ageGroup: '10-12', difficulty: 'hard', durationMin: 10, tags: ['bravery', 'growth', 'courage'], screen: 'Kids12WellbeingTracker'},
];

export default missions;
