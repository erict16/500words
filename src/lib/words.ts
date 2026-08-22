import { SPARE_MIN, WORD_GOAL, type DayMark } from "./types.ts";

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

export function parseTags(text: string): Record<string, string> {
  const tags: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const match = line.trim().match(/^([A-Z][A-Z0-9_ ]{1,24}):\s*(.+)$/);
    if (match) tags[match[1].trim()] = match[2].trim();
  }
  return tags;
}
