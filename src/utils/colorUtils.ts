export interface ColorDotConfig {
  bg: string;
  border?: string;
}

export const COMMON_COLORS: Record<string, ColorDotConfig> = {
  black: { bg: '#171717' },
  white: { bg: '#FFFFFF', border: '#D4D4D8' },
  red: { bg: '#DC2626' },
  blue: { bg: '#2563EB' },
  navy: { bg: '#0F172A' },
  'navy blue': { bg: '#0F172A' },
  green: { bg: '#16A34A' },
  olive: { bg: '#556B2F' },
  'olive green': { bg: '#556B2F' },
  grey: { bg: '#6B7280' },
  gray: { bg: '#6B7280' },
  beige: { bg: '#D4C5B9', border: '#B8A89A' },
  brown: { bg: '#78350F' },
  maroon: { bg: '#800000' },
  pink: { bg: '#EC4899' },
  yellow: { bg: '#EAB308' },
  orange: { bg: '#F97316' },
  purple: { bg: '#9333EA' },
  gold: { bg: '#D4AF37' },
  silver: { bg: '#C0C0C0', border: '#A8A8A8' },
};

/**
 * Returns dot styling if the name matches one of the specified common colors:
 * (black, white, red, blue, navy, green, olive, grey, beige, brown, maroon, pink, yellow, orange, purple, gold, silver).
 * For unrecognized names (like cosmetic shades), returns null so a plain text chip with no dot is shown.
 */
export function getCommonColorDot(colorName?: string): ColorDotConfig | null {
  if (!colorName) return null;
  const clean = colorName.trim().toLowerCase();

  // Direct match
  if (COMMON_COLORS[clean]) {
    return COMMON_COLORS[clean];
  }

  // Common single-word check if preceded by dark/light/deep (e.g. "dark green", "light blue", "dark grey")
  const parts = clean.split(/\s+/);
  if (parts.length === 2 && (parts[0] === 'dark' || parts[0] === 'light' || parts[0] === 'deep')) {
    if (COMMON_COLORS[parts[1]]) {
      return COMMON_COLORS[parts[1]];
    }
  }

  return null;
}
