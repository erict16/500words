import { addDays, datesInMonth } from "./dates.ts";
import { scoreDay } from "./points.ts";
import {
  emptyEntry,
  WORD_GOAL,
  type ChallengeStatus,
  type DayEntry,
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

export function missedYesterday(today: string, lastCompleted: string | null): boolean {
  if (!lastCompleted) return false;
  return lastCompleted < addDays(today, -1);
}

export { emptyEntry, WORD_GOAL };
