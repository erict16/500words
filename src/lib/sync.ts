import type { DayEntry } from "./types.ts";

/** Explicit conflict rule for local ↔ cloud diary days. */
export const CONFLICT_RULE = "last-write-wins" as const;

export function isEmptyDay(day: DayEntry): boolean {
  return !day.text.trim() && day.wordCount <= 0 && !day.madeUp;
}

/**
 * Last-write-wins on `updatedAt`.
 * An empty day never beats a day that has writing.
 * Equal timestamps: more words, then longer text, then the cloud copy.
 */
export function pickWinningDay(local: DayEntry, cloud: DayEntry): DayEntry {
  const localHas = !isEmptyDay(local);
  const cloudHas = !isEmptyDay(cloud);
  if (localHas && !cloudHas) return local;
  if (cloudHas && !localHas) return cloud;
  if (!localHas && !cloudHas) {
    return cloud.updatedAt >= local.updatedAt ? cloud : local;
  }
  if (local.updatedAt !== cloud.updatedAt) {
    return local.updatedAt > cloud.updatedAt ? local : cloud;
  }
  if (local.wordCount !== cloud.wordCount) {
    return local.wordCount > cloud.wordCount ? local : cloud;
  }
  if (local.text.length !== cloud.text.length) {
    return local.text.length > cloud.text.length ? local : cloud;
  }
  return cloud;
}

export function sameDiaryDay(a: DayEntry, b: DayEntry): boolean {
  return (
    a.date === b.date &&
    a.text === b.text &&
    a.wordCount === b.wordCount &&
    a.madeUp === b.madeUp &&
    a.updatedAt === b.updatedAt
  );
}

export type MergeResult = {
  rule: typeof CONFLICT_RULE;
  days: Record<string, DayEntry>;
  toUpload: DayEntry[];
  toCache: DayEntry[];
};

/**
 * Merge two diaries. `toUpload` is what the signed-in cloud is missing
 * (or lost on last-write-wins). `toCache` is what local should copy down.
 */
export function mergeDiaries(
  local: Record<string, DayEntry>,
  cloud: Record<string, DayEntry>,
): MergeResult {
  const dates = new Set([...Object.keys(local), ...Object.keys(cloud)]);
  const days: Record<string, DayEntry> = {};
  const toUpload: DayEntry[] = [];
  const toCache: DayEntry[] = [];
  for (const date of dates) {
    const localDay = local[date];
    const cloudDay = cloud[date];
    if (localDay && cloudDay) {
      const winner = pickWinningDay(localDay, cloudDay);
      days[date] = winner;
      if (sameDiaryDay(localDay, cloudDay)) continue;
      if (winner === localDay) toUpload.push(localDay);
      else toCache.push(cloudDay);
    } else if (localDay && !isEmptyDay(localDay)) {
      days[date] = localDay;
      toUpload.push(localDay);
    } else if (cloudDay && !isEmptyDay(cloudDay)) {
      days[date] = cloudDay;
      toCache.push(cloudDay);
    } else if (localDay) {
      days[date] = localDay;
    } else if (cloudDay) {
      days[date] = cloudDay;
    }
  }
  return { rule: CONFLICT_RULE, days, toUpload, toCache };
}

/** Guest (no prior cloud uid) or the same Google account: merge. A different account: don't. */
export function shouldMergeLocalIntoCloud(
  localCloudUid: string | null | undefined,
  signedInUid: string,
): boolean {
  return !localCloudUid || localCloudUid === signedInUid;
}
