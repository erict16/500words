import { basePointsForWords } from "./words.ts";

/**
 * Bowling-style scoring from original 750 Words, with a 500-word strike.
 * Spare (1): add yesterday's base. Strike (2): add the previous two days' base.
 * Three strikes in a row is a turkey: 2+2+2 = 6.
 */
export function scoreDay(
  wordCount: number,
  previousBase: [number, number],
  alreadyLocked: boolean,
  lockedPoints: number,
  lockedBase: number,
): { basePoints: number; points: number } {
  if (alreadyLocked) {
    return { basePoints: lockedBase, points: lockedPoints };
  }
  const basePoints = basePointsForWords(wordCount);
  if (basePoints === 0) return { basePoints: 0, points: 0 };
  if (basePoints === 1) return { basePoints, points: 1 + previousBase[0] };
  return { basePoints, points: 2 + previousBase[0] + previousBase[1] };
}
