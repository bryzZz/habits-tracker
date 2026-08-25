/** 0 (critical) → 5 (warning) → 10 (good), from the design canvas's status palette. */
export const SCORE_RAMP: readonly string[] = [
  "#d03b3b",
  "#d85334",
  "#e16b2d",
  "#e98227",
  "#f29a20",
  "#fab219",
  "#caaf16",
  "#9bac14",
  "#6ba911",
  "#3ca60f",
  "#0ca30c",
];

/** score is 0..1; returns the ramp's hex for its nearest 0–10 step. */
export function colorForScore(score: number): string {
  const step = Math.round(Math.max(0, Math.min(1, score)) * 10);
  return SCORE_RAMP[step];
}

export function scoreToStep(score: number): number {
  return Math.round(Math.max(0, Math.min(1, score)) * 10);
}

export function stepToScore(step: number): number {
  return Math.max(0, Math.min(10, step)) / 10;
}
