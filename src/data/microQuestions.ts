// ============================================================
// Progressive Profiling — Micro-questions (Phase 8).
//
// Lightweight, one-at-a-time questions surfaced on the parent dashboard at
// most once every few days. Each answer becomes a `preference_signal`
// (source='micro_q') so the family's "Health DNA" keeps sharpening over time
// without a heavy onboarding. Values reuse the existing vocabularies:
//   - cuisine  → mealArchetypes.Cuisine
//   - category → activityArchetypes.ActivityCategory
//   - tag      → missionCatalog / mealLibrary tags
// ============================================================

export interface MicroQuestionOption {
  label: string;
  value: string;
  weight?: number; // base weight (engine ×1.5 for micro_q); default 1
}

export interface MicroQuestion {
  id: string;
  prompt: string;
  kind: 'meal' | 'activity';
  attribute: 'cuisine' | 'category' | 'tag';
  options: MicroQuestionOption[];
}

export const microQuestions: MicroQuestion[] = [
  {
    id: 'mq-cuisine-mood',
    prompt: 'Which kind of food is your family most in the mood for lately?',
    kind: 'meal',
    attribute: 'cuisine',
    options: [
      { label: '🍛 Indian', value: 'Indian' },
      { label: '🍝 Italian', value: 'Italian' },
      { label: '🥡 Chinese', value: 'Chinese' },
      { label: '🌮 Mexican', value: 'Mexican' },
      { label: '🍲 Caribbean', value: 'Caribbean' },
    ],
  },
  {
    id: 'mq-meal-easiest',
    prompt: 'What made weeknight dinners easiest this week?',
    kind: 'meal',
    attribute: 'tag',
    options: [
      { label: '⚡ Quick to cook', value: 'quick' },
      { label: '🍲 One-pot meals', value: 'one-pot' },
      { label: '💷 Budget-friendly', value: 'budget' },
      { label: '🧒 Kid favourites', value: 'kids' },
    ],
  },
  {
    id: 'mq-meal-wins',
    prompt: 'Which dinners went down best with the kids?',
    kind: 'meal',
    attribute: 'tag',
    options: [
      { label: '🍗 Protein-rich', value: 'protein' },
      { label: '🥦 Veg-forward', value: 'vegetables' },
      { label: '🫓 Comfort food', value: 'comfort' },
      { label: '🍚 Rice dishes', value: 'rice' },
    ],
  },
  {
    id: 'mq-activity-spark',
    prompt: 'What type of activity does your child light up for?',
    kind: 'activity',
    attribute: 'category',
    options: [
      { label: '⚽ Ball sports', value: 'ball_sport' },
      { label: '💃 Dance', value: 'dance' },
      { label: '🌳 Outdoor play', value: 'outdoor_play' },
      { label: '🎨 Creative', value: 'creative' },
      { label: '🏊 Water', value: 'water' },
    ],
  },
  {
    id: 'mq-activity-when',
    prompt: 'Which quests fit your routine best right now?',
    kind: 'activity',
    attribute: 'tag',
    options: [
      { label: '🏠 Indoor & quick', value: 'indoor' },
      { label: '🌳 Outdoor', value: 'outdoor' },
      { label: '👨‍👩‍👧 Family together', value: 'family' },
      { label: '🧘 Calm & wind-down', value: 'calm' },
    ],
  },
];
