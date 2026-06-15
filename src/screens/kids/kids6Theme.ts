// ============================================================
// kids6 theme tokens (Phase D.4) — the 6–8 skin of the unified template.
//
// Same hub structure as kids8 / kids12, framed for the youngest band:
// "adventure & imagination" — bright, sunny, big friendly tiles and a buddy
// character. Light sky/sunshine base with bold primary colours.
// ============================================================

export const kids6Theme = {
  foreground: '#1F2937',
  card: '#FFFFFF',
  cardBorder: 'rgba(31,41,55,0.08)',
  muted: '#6B7280',

  primary: '#22C55E', // grass green
  accent: '#FB7185', // coral
  sky: '#38BDF8',
  sunshine: '#FBBF24',
  purple: '#A78BFA',

  radius: 24, // big, friendly rounding for the youngest band
} as const;

// Bright sky → peach → sunshine page background.
export const KIDS6_BG_GRADIENT: [string, string, string] = [
  '#BAE6FD',
  '#FED7AA',
  '#FEF9C3',
];

export const KIDS6_GRADIENTS = {
  buddy: ['#FB923C', '#EC4899'] as [string, string],
  mission: ['#FB923C', '#EF4444'] as [string, string],
  quest: ['#4ADE80', '#10B981'] as [string, string],
  cta: ['#60A5FA', '#818CF8'] as [string, string],
  // Food
  discovery: ['#4ADE80', '#16A34A'] as [string, string],
  dinner: ['#FB923C', '#F59E0B'] as [string, string],
  kitchen: ['#FBBF24', '#F97316'] as [string, string],
  // Games
  games: ['#38BDF8', '#06B6D4'] as [string, string],
  superhero: ['#A78BFA', '#818CF8'] as [string, string],
  // Rewards & map
  rewards: ['#C084FC', '#EC4899'] as [string, string],
  collection: ['#FBBF24', '#FB923C'] as [string, string],
  map: ['#60A5FA', '#818CF8'] as [string, string],
  world: ['#1E3A5F', '#3B82F6'] as [string, string],
  checkin: ['#0D9488', '#0891B2'] as [string, string],
  family: ['#1E3A5F', '#1D4ED8'] as [string, string],
} as const;
