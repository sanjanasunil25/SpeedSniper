const BASE_POINTS = 100;

export const COMBO_THRESHOLDS = {
  LOW: 3,    // ×1.5 starts
  HIGH: 5,   // ×2.0 starts
};

export function getMultiplier(comboCount: number): number {
  if (comboCount >= COMBO_THRESHOLDS.HIGH) return 2.0;
  if (comboCount >= COMBO_THRESHOLDS.LOW) return 1.5;
  return 1.0;
}

export function calculateRoundScore(hit: boolean, comboCount: number): number {
  if (!hit) return 0;
  return Math.round(BASE_POINTS * getMultiplier(comboCount));
}

export function getMultiplierLabel(combo: number): string {
  if (combo >= 5) return '×2.0 🔥🔥';
  if (combo >= 3) return '×1.5 🔥';
  return '×1.0';
}

export const SPEED_BY_ROUND: Record<number, number> = {
  1: 6,    // %/s
  2: 7,
  3: 8,
  4: 9,
  5: 10,
  6: 12,
  7: 14,
  8: 16,
};
