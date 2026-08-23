import type { DayEntry } from "./types.ts";

export type SearchHit = {
  date: string;
  wordCount: number;
  snippet: string;
  activeMs: number;
};

const SNIP = 90;
const MAX = 40;

export function filterHits(days: DayEntry[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  const sorted = [...days]
    .filter((d) => d.wordCount > 0 && d.text.trim())
    .sort((a, b) => b.date.localeCompare(a.date));
  const matched = q
    ? sorted.filter((d) => d.text.toLowerCase().includes(q) || d.date.includes(q))
    : sorted;
  return matched.slice(0, MAX).map((d) => ({
    date: d.date,
    wordCount: d.wordCount,
    snippet: snippet(d.text, q),
    activeMs: d.session?.activeMs ?? 0,
  }));
}

export function snippet(text: string, query: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!query) return flat.slice(0, SNIP) + (flat.length > SNIP ? "…" : "");
  const lower = flat.toLowerCase();
  const at = lower.indexOf(query);
  if (at < 0) return flat.slice(0, SNIP) + (flat.length > SNIP ? "…" : "");
  const start = Math.max(0, at - 24);
  const end = Math.min(flat.length, at + query.length + 64);
  const chunk = (start > 0 ? "…" : "") + flat.slice(start, end) + (end < flat.length ? "…" : "");
  return chunk;
}
