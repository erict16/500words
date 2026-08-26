import { PAGE_COUNT, SPARE_MIN, WORD_GOAL, type DayMark } from "./types.ts";

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function markForWords(wordCount: number): DayMark {
  if (wordCount >= WORD_GOAL) return "strike";
  if (wordCount >= SPARE_MIN) return "spare";
  if (wordCount >= 1) return "dot";
  return "none";
}

export function basePointsForWords(wordCount: number): number {
  if (wordCount >= WORD_GOAL) return 2;
  if (wordCount >= SPARE_MIN) return 1;
  return 0;
}

/** Live 750: Math.floor(words / 250). 250 is 750/3. We use 500/3. */
export function filledPages(wordCount: number, goal = WORD_GOAL): number {
  if (wordCount <= 0) return 0;
  const perPage = goal / PAGE_COUNT;
  return Math.floor(wordCount / perPage);
}

export function pageTooltipWords(pageIndex: number, goal = WORD_GOAL): number {
  return Math.round(pageIndex * (goal / PAGE_COUNT));
}

export function parseTags(text: string): Record<string, string> {
  const tags: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const match = line.trim().match(/^([A-Z][A-Z0-9_ ]{1,24}):\s*(.+)$/);
    if (match) tags[match[1].trim()] = match[2].trim();
  }
  return tags;
}
