import type { DayEntry } from "./types.ts";

export type SearchHit = {
  date: string;
  wordCount: number;
  snippet: string;
  activeMs: number;
};

export type SortId = "relevance" | "newest" | "oldest" | "word_count";

export const SORTS: { id: SortId; label: string }[] = [
  { id: "relevance", label: "Best match" },
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "word_count", label: "Longest first" },
];

export type QueryParts = {
  required: string[];
  excluded: string[];
  orGroups: string[][];
};

const SNIP = 90;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function parseQuery(raw: string): QueryParts {
  const required: string[] = [];
  const excluded: string[] = [];
  const orGroups: string[][] = [];
  const tokens: string[] = [];
  const re = /"([^"]+)"|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw.trim()))) {
    const tok = (m[1] ?? m[2] ?? "").trim();
    if (tok) tokens.push(tok);
  }
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok.toLowerCase() === "or") {
      i += 1;
      continue;
    }
    if (tok.startsWith("-") && tok.length > 1) {
      excluded.push(tok.slice(1).toLowerCase());
      i += 1;
      continue;
    }
    const group = [tok.toLowerCase()];
    while (i + 2 < tokens.length && tokens[i + 1].toLowerCase() === "or") {
      const next = tokens[i + 2];
      if (!next || next.toLowerCase() === "or" || (next.startsWith("-") && next.length > 1)) break;
      group.push(next.toLowerCase());
      i += 2;
    }
    if (group.length > 1) orGroups.push(group);
    else required.push(group[0]);
    i += 1;
  }
  return { required, excluded, orGroups };
}

export function matchesQuery(text: string, date: string, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  const hay = `${text} ${date}`.toLowerCase();
  const { required, excluded, orGroups } = parseQuery(q);
  for (const ex of excluded) {
    if (ex && hay.includes(ex)) return false;
  }
  for (const req of required) {
    if (req && !hay.includes(req)) return false;
  }
  for (const group of orGroups) {
    if (!group.some((t) => t && hay.includes(t))) return false;
  }
  if (!required.length && !orGroups.length && !excluded.length) return hay.includes(q.toLowerCase());
  return true;
}

function snippetNeedle(text: string, query: string): string {
  const q = query.trim().toLowerCase();
  if (!q) return "";
  const lower = text.toLowerCase();
  if (lower.includes(q)) return q;
  const { required, orGroups } = parseQuery(query);
  for (const t of [...required, ...orGroups.flat()]) {
    if (t && lower.includes(t)) return t;
  }
  return q;
}

export function filterHits(days: DayEntry[], query: string): SearchHit[] {
  const q = query.trim();
  const sorted = [...days]
    .filter((d) => d.wordCount > 0 && d.text.trim())
    .sort((a, b) => b.date.localeCompare(a.date));
  const matched = q ? sorted.filter((d) => matchesQuery(d.text, d.date, q)) : sorted;
  return matched.map((d) => ({
    date: d.date,
    wordCount: d.wordCount,
    snippet: snippet(d.text, snippetNeedle(d.text, q)),
    activeMs: d.session?.activeMs ?? 0,
  }));
}

/** Whole-diary .txt. Oldest first. */
export function formatExport(days: DayEntry[]): string {
  return [...days]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => `===== ${d.date} (${d.wordCount} words) =====\n${d.text}\n`)
    .join("\n");
}

export function sortHits(hits: SearchHit[], sort: SortId): SearchHit[] {
  const next = [...hits];
  if (sort === "oldest") next.sort((a, b) => a.date.localeCompare(b.date));
  else if (sort === "word_count") {
    next.sort((a, b) => b.wordCount - a.wordCount || b.date.localeCompare(a.date));
  } else {
    next.sort((a, b) => b.date.localeCompare(a.date));
  }
  return next;
}

export type SparkMonth = {
  key: string;
  label: string;
  count: number;
  heightPct: number;
};

export function monthSparkline(hits: SearchHit[]): SparkMonth[] {
  if (hits.length < 2) return [];
  const months = new Map<string, number>();
  for (const h of hits) {
    const key = h.date.slice(0, 7);
    months.set(key, (months.get(key) ?? 0) + 1);
  }
  const keys = [...months.keys()].sort();
  if (keys.length < 2) return [];
  const start = keys[0];
  const end = keys[keys.length - 1];
  let year = Number(start.slice(0, 4));
  let month = Number(start.slice(5, 7));
  const endYear = Number(end.slice(0, 4));
  const endMonth = Number(end.slice(5, 7));
  const bars: { key: string; label: string; count: number }[] = [];
  while (year < endYear || (year === endYear && month <= endMonth)) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    bars.push({
      key,
      label: `${MONTHS[month - 1]} ${year}`,
      count: months.get(key) ?? 0,
    });
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  const max = Math.max(...bars.map((b) => b.count), 0);
  return bars.map((b) => ({
    ...b,
    heightPct: b.count > 0 && max > 0 ? Math.max((b.count / max) * 100, 4) : 0,
  }));
}

export function highlightParts(text: string, query: string): { t: string; hit?: boolean }[] {
  const { required, orGroups } = parseQuery(query);
  const terms = [...required, ...orGroups.flat()].filter((t) => t.length > 0);
  if (!terms.length || !text) return [{ t: text }];
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const parts: { t: string; hit?: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > last) parts.push({ t: text.slice(last, at) });
    parts.push({ t: m[0], hit: true });
    last = at + m[0].length;
  }
  if (last < text.length) parts.push({ t: text.slice(last) });
  return parts.length ? parts : [{ t: text }];
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function snippet(text: string, query: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!query) return flat.slice(0, SNIP) + (flat.length > SNIP ? "…" : "");
  const lower = flat.toLowerCase();
  const at = lower.indexOf(query.toLowerCase());
  if (at < 0) return flat.slice(0, SNIP) + (flat.length > SNIP ? "…" : "");
  const start = Math.max(0, at - 24);
  const end = Math.min(flat.length, at + query.length + 64);
  const chunk = (start > 0 ? "…" : "") + flat.slice(start, end) + (end < flat.length ? "…" : "");
  return chunk;
}
