// ============================================================
// kids8 theme tokens (Phase D.2) — the canonical 8–10 "adventure" palette,
// ported from the Figma bundle's /8-10yo/src/styles/theme.css.
//
// This is the single source of truth for the unified kids8 template. As the
// other kids8 screens are reworked (and later kids / kids12 are re-skinned),
// they should pull colours/gradients from here rather than re-inventing them.
// ============================================================

export const kids8Theme = {
  background: '#FFF5F0',
  foreground: '#2D1B4E',
  card: '#FFFFFF',
  primary: '#8B5CF6', // purple
  primaryForeground: '#FFFFFF',
  secondary: '#FCD34D', // gold
  secondaryForeground: '#2D1B4E',
  muted: '#F3E8FF',
  mutedForeground: '#8B5CF6',
  accent: '#F472B6', // pink
  accentForeground: '#FFFFFF',
  border: 'rgba(139, 92, 246, 0.2)',
  purple900: '#4C1D95',
  purple700: '#6D28D9',

  // Pillar / region colours.
  nutrition: '#10B981',
  activity: '#3B82F6',
  sleep: '#8B5CF6',
  confidence: '#F59E0B',
  gold: '#FCD34D',
  xpBar: '#EC4899',

  radius: 16, // --radius: 1rem
} as const;

// Page background gradient (purple → pink → yellow), matching the bundle Home.
export const KIDS8_BG_GRADIENT: [string, string, string] = [
  '#F3E8FF',
  '#FCE7F3',
  '#FEF9C3',
];

// Reusable card gradients keyed to the canonical tile colours.
export const KIDS8_GRADIENTS = {
  buddy: ['#8B5CF6', '#EC4899'] as [string, string],
  cta: ['#7C3AED', '#DB2777'] as [string, string],
  games: ['#A78BFA', '#F472B6'] as [string, string],
  energy: ['#FBBF24', '#FB923C'] as [string, string],
  foodsTried: ['#34D399', '#10B981'] as [string, string],
  dinner: ['#FB923C', '#EF4444'] as [string, string],
  veggie: ['#A3E635', '#22C55E'] as [string, string],
  kitchen: ['#FBBF24', '#FB923C'] as [string, string],
  lunch: ['#60A5FA', '#22D3EE'] as [string, string],
  snack: ['#A78BFA', '#F472B6'] as [string, string],
  school: ['#818CF8', '#3B82F6'] as [string, string],
} as const;
