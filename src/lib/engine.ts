import { addDays, datesInMonth } from "./dates.ts";
import { scoreDay } from "./points.ts";
import {
  emptyEntry,
  WORD_GOAL,
  type ChallengeStatus,
  type DayEntry,
  type EarnedBadge,
  type MonthDay,
  type SessionStats,
} from "./types.ts";
import { countWords, markForWords, parseTags } from "./words.ts";
import { isFastFinish, type BadgeStats } from "./badges.ts";

export type Lifetime = BadgeStats & {
  lastCompleted: string | null;
  lastShowedUp: string | null;
  monthChallengeWins: number;
  lastWordCount: number;
  lastWordDate: string | null;
};

export const emptyLifetime = (): Lifetime => ({
  currentStreak: 0,
  showUpStreak: 0,
  completedEver: 0,
  showedUpEver: 0,
  totalWords: 0,
  fastDays: 0,
  nightDays: 0,
  morningDays: 0,
  monthChallengeWon: false,
  hasWritten: false,
  lastCompleted: null,
  lastShowedUp: null,
  monthChallengeWins: 0,
  lastWordCount: 0,
  lastWordDate: null,
});

export function emptyMonth(yearMonth: string): MonthDay[] {
  return datesInMonth(yearMonth).map((date) => ({
    date,
    day: Number(date.slice(-2)),
    wordCount: 0,
    mark: "none" as const,
    points: 0,
    madeUp: false,
  }));
}

export function applySave(opts: {
  existing: DayEntry;
  text: string;
  previousBase: [number, number];
  date: string;
  today: string;
  session: SessionStats;
  yesterday: DayEntry | null;
}): { entry: DayEntry; justFinished: boolean; makeupYesterday: boolean } {
  const { existing, text, previousBase, date, today, session, yesterday } = opts;
  if (date < today) {
    throw new Error("Yesterday is closed. You can’t add words to a past day.");
  }
  const wordCount = countWords(text);
  const scored = scoreDay(
    wordCount,
    previousBase,
    existing.locked,
    existing.points,
    existing.basePoints,
  );
  const justFinished = !existing.locked && wordCount >= WORD_GOAL;
  const makeupYesterday = Boolean(
    wordCount >= WORD_GOAL * 2 &&
      yesterday &&
      yesterday.wordCount < WORD_GOAL &&
      !yesterday.madeUp,
  );
  const entry: DayEntry = {
    ...existing,
    date,
    text,
    wordCount,
    basePoints: scored.basePoints,
    points: scored.points,
    mark: existing.locked || justFinished ? "strike" : markForWords(wordCount),
    locked: existing.locked || justFinished,
    celebrated: existing.celebrated || justFinished,
    completedAt: existing.completedAt ?? (justFinished ? Date.now() : null),
    updatedAt: Date.now(),
    session,
    tags: parseTags(text),
  };
  return { entry, justFinished, makeupYesterday };
}

export function applyLifetime(
  prev: Lifetime,
  date: string,
  entry: DayEntry,
  session: SessionStats,
  hour: number,
  justFinished: boolean,
  makeupYesterday: boolean,
): Lifetime {
  const yesterday = addDays(date, -1);
  let currentStreak = prev.currentStreak;
  let showUpStreak = prev.showUpStreak;
  let completedEver = prev.completedEver;
  let showedUpEver = prev.showedUpEver;
  let totalWords = prev.totalWords;
  let fastDays = prev.fastDays;
  let nightDays = prev.nightDays;
  let morningDays = prev.morningDays;

  if (prev.lastWordDate === date) {
    totalWords += entry.wordCount - prev.lastWordCount;
  } else {
    totalWords += entry.wordCount;
  }

  if (entry.wordCount >= 1 && prev.lastShowedUp !== date) {
    showedUpEver += 1;
    showUpStreak = prev.lastShowedUp === yesterday ? showUpStreak + 1 : 1;
  }

  if (justFinished) {
    completedEver += 1;
    const yesterdayCounts =
      prev.lastCompleted === yesterday || makeupYesterday;
    currentStreak = yesterdayCounts ? currentStreak + 1 : 1;
    if (isFastFinish(session.activeMs)) fastDays += 1;
    if (hour >= 22) nightDays += 1;
    if (hour < 8) morningDays += 1;
  }

  return {
    currentStreak,
    showUpStreak,
    completedEver,
    showedUpEver,
    totalWords: Math.max(0, totalWords),
    fastDays,
    nightDays,
    morningDays,
    monthChallengeWon: prev.monthChallengeWins > 0,
    hasWritten: true,
    lastCompleted: justFinished ? date : prev.lastCompleted,
    lastShowedUp: entry.wordCount >= 1 ? date : prev.lastShowedUp,
    monthChallengeWins: prev.monthChallengeWins,
    lastWordCount: entry.wordCount,
    lastWordDate: date,
  };
}

export function applyChallenge(opts: {
  monthDates: string[];
  today: string;
  joinDate: string;
  wordsByDate: Record<string, number>;
}): { completedDays: number; missedDays: number; status: ChallengeStatus } {
  const { monthDates, today, joinDate, wordsByDate } = opts;
  let completedDays = 0;
  let missedDays = 0;
  for (const d of monthDates) {
    if (d > today || d < joinDate) continue;
    const words = wordsByDate[d] ?? 0;
    if (words >= WORD_GOAL) completedDays += 1;
    else if (d < today) missedDays += 1;
  }
  const last = monthDates[monthDates.length - 1];
  let status: ChallengeStatus = "in";
  if (missedDays > 0) status = "shame";
  const required = monthDates.filter((d) => d >= joinDate).length;
  if (today >= last && missedDays === 0 && completedDays === required && required > 0) {
    status = "won";
  }
  return { completedDays, missedDays, status };
}

/** Midnight in Settings timezone. Makeup covers yesterday only, at 1000 words. */
export const STREAK_POLICY_TEXT =
  "A day starts at midnight in your timezone. Miss yesterday? Write 1000 words today to keep the streak. Older misses break it.";

export const MAKEUP_WORDS = WORD_GOAL * 2;

export function missedYesterday(
  today: string,
  lastCompleted: string | null,
  yesterday?: { wordCount: number; madeUp?: boolean } | null,
): boolean {
  const y = addDays(today, -1);
  if (yesterday?.madeUp) return false;
  if (yesterday && yesterday.wordCount >= WORD_GOAL) return false;
  if (lastCompleted === y) return false;
  if (lastCompleted && lastCompleted < y) return true;
  if (yesterday && yesterday.wordCount > 0 && yesterday.wordCount < WORD_GOAL) return true;
  return false;
}

export const PUBLIC_FORBIDDEN_KEYS = ["text", "body", "writing", "entry", "snippet"] as const;

export const PUBLIC_SCORE_KEYS = [
  "displayName",
  "monthPoints",
  "monthWords",
  "daysStarted",
  "daysCompleted",
  "streak",
  "badgeIds",
] as const;

export function hasDiaryBody(data: Record<string, unknown>): boolean {
  return PUBLIC_FORBIDDEN_KEYS.some((key) => key in data);
}

export function stripDiaryBody<T extends Record<string, unknown>>(data: T): T {
  const next: Record<string, unknown> = { ...data };
  for (const key of PUBLIC_FORBIDDEN_KEYS) {
    delete next[key];
  }
  return next as T;
}

/** Public scoreboard. Never includes the writing. */
export function publicScore(opts: {
  displayName: string;
  monthDays: MonthDay[];
  streak: number;
  badges: EarnedBadge[];
}) {
  const { displayName, monthDays, streak, badges } = opts;
  return {
    displayName,
    monthPoints: monthDays.reduce((sum, d) => sum + d.points, 0),
    monthWords: monthDays.reduce((sum, d) => sum + d.wordCount, 0),
    daysStarted: monthDays.filter((d) => d.wordCount > 0).length,
    daysCompleted: monthDays.filter((d) => d.mark === "strike" || d.wordCount >= WORD_GOAL).length,
    streak,
    badgeIds: badges.map((b) => b.id),
  };
}

export type PublicScore = ReturnType<typeof publicScore>;

/** Read a public person row without ever taking diary body fields. */
export function readPublicScore(row: Record<string, unknown>): PublicScore {
  return {
    displayName: String(row.displayName || "Anonymous"),
    monthPoints: Number(row.monthPoints ?? 0),
    monthWords: Number(row.monthWords ?? 0),
    daysStarted: Number(row.daysStarted ?? 0),
    daysCompleted: Number(row.daysCompleted ?? 0),
    streak: Number(row.streak ?? 0),
    badgeIds: Array.isArray(row.badgeIds)
      ? row.badgeIds.filter((id): id is string => typeof id === "string")
      : [],
  };
}

export { emptyEntry, WORD_GOAL };
