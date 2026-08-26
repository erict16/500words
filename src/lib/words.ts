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

/** Bunny calendar fill from live 750 `colorScale.DKDCDld5.js`. Index is word count on a 750-word scale. */
const BUNNY_STOPS: Array<[number, string]> = [
  [1, "#b9f6ca"],
  [100, "#a0f0bd"],
  [250, "#7be8a9"],
  [500, "#3eda87"],
  [750, "#00cc66"],
  [1000, "#00aa55"],
  [1500, "#006633"],
];

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(
    Math.round(ar + (br - ar) * t),
    Math.round(ag + (bg - ag) * t),
    Math.round(ab + (bb - ab) * t),
  );
}

export function dayFillColor(wordCount: number, goal = WORD_GOAL): string | undefined {
  if (wordCount <= 0) return undefined;
  const idx = Math.min(1500, Math.round(wordCount * (750 / goal)));
  if (idx <= BUNNY_STOPS[0][0]) return BUNNY_STOPS[0][1];
  for (let i = 1; i < BUNNY_STOPS.length; i++) {
    const [x1, c1] = BUNNY_STOPS[i - 1];
    const [x2, c2] = BUNNY_STOPS[i];
    if (idx <= x2) return lerpHex(c1, c2, (idx - x1) / (x2 - x1));
  }
  return BUNNY_STOPS[BUNNY_STOPS.length - 1][1];
}

export function dayWordBand(wordCount: number, goal = WORD_GOAL): "high" | "medium" | "low" | undefined {
  if (wordCount <= 0) return undefined;
  if (wordCount >= goal) return "high";
  if (wordCount >= goal / PAGE_COUNT) return "medium";
  return "low";
}

export function parseTags(text: string): Record<string, string> {
  const tags: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const match = line.trim().match(/^([A-Z][A-Z0-9_ ]{1,24}):\s*(.+)$/);
    if (match) tags[match[1].trim()] = match[2].trim();
  }
  return tags;
}
