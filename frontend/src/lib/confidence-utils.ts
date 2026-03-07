/**
 * Maps a confidence score (0–1) to an opacity value for marker rings.
 */
export const confidenceToOpacity = (score: number): number => {
  return Math.max(0.15, Math.min(1, score));
};

/**
 * Maps a confidence score to a label colour CSS variable.
 * < 0.5 → --hip-light
 * 0.5–0.89 → --hip-white
 * ≥ 0.9 → --hip-accent
 */
export const confidenceToColour = (score: number): string => {
  if (score >= 0.9) return 'hsl(var(--hip-accent))';
  if (score >= 0.5) return 'hsl(var(--hip-white))';
  return 'hsl(var(--hip-light))';
};

/**
 * Maps confidence to a CSS class for zone fill opacity.
 * Zone fills use min(confidence, 0.6).
 */
export const confidenceToZoneFill = (score: number): number => {
  return Math.min(score, 0.6);
};

/**
 * Returns a formatted confidence string (e.g., "0.72").
 */
export const formatConfidence = (score: number): string => {
  return score.toFixed(2);
};
