// ============================================================
// kids12 theme tokens (Phase D.3) — the 10–12 skin of the unified template.
//
// Same structure as the canonical kids8 template, re-themed for the older band:
// "autonomy / identity / mastery" — less cute, more epic. A dark, mature base
// (near-black + deep violet) with electric violet / cyan / gold accents,
// mirroring the existing kids12 visual language so the rest of the kids12
// screens already line up.
// ============================================================

export const kids12Theme = {
  // Dark, mature base.
  bgTop: '#0B0B14',
  bgMid: '#1A1430',
  card: '#16121F',
  cardBorder: 'rgba(255,255,255,0.1)',

  foreground: '#FFFFFF',
  muted: '#9CA3AF',
  mutedDim: '#6B7280',

  primary: '#A855F7', // electric violet
  primaryDeep: '#7C3AED',
  accent: '#22D3EE', // cyan
  pink: '#EC4899',
  gold: '#FCD34D',

  // Pillar / region colours (shared with the rest of the app).
  nutrition: '#10B981',
  activity: '#3B82F6',
  sleep: '#8B5CF6',
  confidence: '#F59E0B',
  xpBar: '#A855F7',

  radius: 18,
} as const;

// Page background gradient (deep void → violet).
export const KIDS12_BG_GRADIENT: [string, string, string] = [
  '#0B0B14',
  '#1A1430',
  '#0B0B14',
];

// Reusable tile gradients keyed by section.
export const KIDS12_GRADIENTS = {
  identity: ['#7C3AED', '#22D3EE'] as [string, string],
  cta: ['#7C3AED', '#EC4899'] as [string, string],
  // Games & Moves
  runner: ['#3B82F6', '#1D4ED8'] as [string, string],
  reflex: ['#A855F7', '#9333EA'] as [string, string],
  micro: ['#06B6D4', '#0891B2'] as [string, string],
  movement: ['#EC4899', '#BE185D'] as [string, string],
  // Food & Energy
  foodSwaps: ['#10B981', '#059669'] as [string, string],
  eating: ['#F59E0B', '#D97706'] as [string, string],
  // Your Space (wellbeing)
  checkIn: ['#8B5CF6', '#6D28D9'] as [string, string],
  reflection: ['#6366F1', '#4F46E5'] as [string, string],
  wellbeing: ['#0EA5E9', '#0284C7'] as [string, string],
  planner: ['#A78BFA', '#7C3AED'] as [string, string],
  resources: ['#F472B6', '#DB2777'] as [string, string],
} as const;
