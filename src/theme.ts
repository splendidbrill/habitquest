export const colors = {
  background: '#F0F7FF',
  foreground: '#1E3A5F',
  card: '#FFFFFF',
  cardForeground: '#1E3A5F',
  primary: '#4A90E2',
  primaryForeground: '#FFFFFF',
  secondary: '#52C9A5',
  secondaryForeground: '#FFFFFF',
  muted: '#D4E8FF',
  mutedForeground: '#5B7A9E',
  accent: '#E1F5F0',
  accentForeground: '#1E5B4B',
  destructive: '#E85D75',
  destructiveForeground: '#FFFFFF',
  border: '#C5DEFF',
};

export const withOpacity = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

export const radius = 12;

export const typography = {
  h1: { fontSize: 24, fontWeight: '500' as const, color: colors.foreground },
  h2: { fontSize: 20, fontWeight: '500' as const, color: colors.foreground },
  h3: { fontSize: 18, fontWeight: '500' as const, color: colors.foreground },
  h4: { fontSize: 16, fontWeight: '500' as const, color: colors.foreground },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.foreground },
  sm: { fontSize: 14, fontWeight: '400' as const, color: colors.foreground },
  xs: { fontSize: 12, fontWeight: '400' as const, color: colors.foreground },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};
