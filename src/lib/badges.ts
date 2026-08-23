import { FAST_MINUTES, WORD_GOAL, type EarnedBadge } from "./types.ts";

export type BadgeDef = {
  id: string;
  name: string;
  how: string;
  group: "streak" | "spirit" | "speed" | "clock" | "words" | "habit" | "challenge";
};

export const BADGES: BadgeDef[] = [
  { id: "egg", name: "The Egg", how: "You showed up. This is how everyone starts.", group: "habit" },
  { id: "turkey", name: "The Turkey", how: "Write 500 words 3 days in a row.", group: "streak" },
  { id: "penguin", name: "The Penguin", how: "5 days in a row.", group: "streak" },
  { id: "flamingo", name: "The Flamingo", how: "10 days in a row.", group: "streak" },
  { id: "albatross", name: "The Albatross", how: "30 days in a row.", group: "streak" },
  { id: "phoenix", name: "The Phoenix", how: "100 days in a row.", group: "streak" },
  { id: "pterodactyl", name: "The Pterodactyl", how: "200 days in a row.", group: "streak" },
  { id: "spacebird", name: "The Spacebird", how: "365 days in a row.", group: "streak" },
  { id: "spirit-turkey", name: "Spirit Turkey", how: "3 days completed, ever.", group: "spirit" },
  { id: "spirit-penguin", name: "Spirit Penguin", how: "5 days completed, ever.", group: "spirit" },
  { id: "spirit-flamingo", name: "Spirit Flamingo", how: "10 days completed, ever.", group: "spirit" },
  { id: "spirit-albatross", name: "Spirit Albatross", how: "30 days completed, ever.", group: "spirit" },
  { id: "spirit-phoenix", name: "Spirit Phoenix", how: "100 days completed, ever.", group: "spirit" },
  { id: "spirit-pterodactyl", name: "Spirit Pterodactyl", how: "200 days completed, ever.", group: "spirit" },
  { id: "spirit-spacebird", name: "Spirit Spacebird", how: "365 days completed, ever.", group: "spirit" },
  { id: "cheetah", name: "The Cheetah", how: `Finish in under ${FAST_MINUTES} minutes, 10 days.`, group: "speed" },
  { id: "night-bat", name: "The Night Bat", how: "Finish after 10pm, 10 days.", group: "clock" },
  { id: "early-bird", name: "The Early Bird", how: "Finish before 8am, 10 days.", group: "clock" },
  { id: "hamster", name: "The Hamster", how: "Show up (any words) 10 days in a row.", group: "habit" },
  { id: "oxalis", name: "Oxalis", how: "Show up on 100 different days.", group: "habit" },
  { id: "novella", name: "Novella", how: "10,000 words written.", group: "words" },
  { id: "short-story", name: "Short Story", how: "25,000 words written.", group: "words" },
  { id: "novel", name: "Novel", how: "50,000 words written.", group: "words" },
  { id: "anthology", name: "Anthology", how: "100,000 words written.", group: "words" },
  { id: "sequel", name: "Thrilling Sequel", how: "250,000 words written.", group: "words" },
  { id: "library", name: "Library", how: "500,000 words written.", group: "words" },
  { id: "turquoise-horse", name: "Turquoise Horse", how: "Finish a one-month challenge.", group: "challenge" },
];

export const BADGE_MAP = Object.fromEntries(BADGES.map((b) => [b.id, b]));

const STREAK_BADGES: [number, string][] = [
  [3, "turkey"],
  [5, "penguin"],
  [10, "flamingo"],
  [30, "albatross"],
  [100, "phoenix"],
  [200, "pterodactyl"],
  [365, "spacebird"],
];

const SPIRIT_BADGES: [number, string][] = [
  [3, "spirit-turkey"],
  [5, "spirit-penguin"],
  [10, "spirit-flamingo"],
  [30, "spirit-albatross"],
  [100, "spirit-phoenix"],
  [200, "spirit-pterodactyl"],
  [365, "spirit-spacebird"],
];

const WORD_BADGES: [number, string][] = [
  [10_000, "novella"],
  [25_000, "short-story"],
  [50_000, "novel"],
  [100_000, "anthology"],
  [250_000, "sequel"],
  [500_000, "library"],
];

export type BadgeStats = {
  currentStreak: number;
  showUpStreak: number;
  completedEver: number;
  showedUpEver: number;
  totalWords: number;
  fastDays: number;
  nightDays: number;
  morningDays: number;
  monthChallengeWon: boolean;
  hasWritten: boolean;
};

export function badgesToAward(
  stats: BadgeStats,
  already: Record<string, EarnedBadge>,
): string[] {
  const next: string[] = [];
  const has = (id: string) => Boolean(already[id]);
  const add = (id: string) => {
    if (!has(id)) next.push(id);
  };

  if (stats.hasWritten) add("egg");
  for (const [n, id] of STREAK_BADGES) if (stats.currentStreak >= n) add(id);
  for (const [n, id] of SPIRIT_BADGES) if (stats.completedEver >= n) add(id);
  for (const [n, id] of WORD_BADGES) if (stats.totalWords >= n) add(id);
  if (stats.fastDays >= 10) add("cheetah");
  if (stats.nightDays >= 10) add("night-bat");
  if (stats.morningDays >= 10) add("early-bird");
  if (stats.showUpStreak >= 10) add("hamster");
  if (stats.showedUpEver >= 100) add("oxalis");
  if (stats.monthChallengeWon) add("turquoise-horse");
  return next;
}

export function isFastFinish(activeMs: number): boolean {
  return activeMs > 0 && activeMs <= FAST_MINUTES * 60 * 1000;
}

export function wordsRemaining(wordCount: number): number {
  return Math.max(0, WORD_GOAL - wordCount);
}
