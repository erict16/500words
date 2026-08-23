import { FAST_MINUTES, WORD_GOAL, type EarnedBadge } from "./types.ts";

export type BadgeDef = {
  id: string;
  name: string;
  how: string;
  group: "streak" | "spirit" | "speed" | "clock" | "words" | "habit" | "challenge";
};

export const BADGES: BadgeDef[] = [
  {
    id: "egg",
    name: "The Egg",
    how: "The egg is how we all start. Where did we come from? Nobody knows. But it's up to you to determine what you will grow up to be.",
    group: "habit",
  },
  {
    id: "turkey",
    name: "The Turkey",
    how: "You get the Turkey badge by writing 3 days in a row. Three strikes — pow!",
    group: "streak",
  },
  {
    id: "penguin",
    name: "The Penguin",
    how: "The Penguin badge is all yours when you write for 5 days in a row.",
    group: "streak",
  },
  {
    id: "flamingo",
    name: "The Flamingo",
    how: "10 days of writing your 500 words in a row, and your feathers turn pink, you think about sunshine and martinis and pools and front lawns, and the world seems to be your shrimp.",
    group: "streak",
  },
  {
    id: "albatross",
    name: "The Albatross",
    how: "What a mighty bird! 30 days in a row and you earn the respect of this largest of all flying birds. Your wingspan can sometimes exceed 11 feet! A good thing because the life of an albatross is long, and lonely. Get comfy and ready to write for another 70 days before your next transformation.",
    group: "streak",
  },
  {
    id: "phoenix",
    name: "The Phoenix",
    how: "100 days in a row! The phoenix is a mythical badge earned only by a few, the brave, the bold, the lucky.",
    group: "streak",
  },
  {
    id: "pterodactyl",
    name: "The Pterodactyl",
    how: "200 days in a row! Scientists thought these were extinct. Think of it as a whole flock of albatrosses, and here you are.",
    group: "streak",
  },
  {
    id: "spacebird",
    name: "The Space Bird",
    how: "365 days in a row. The coveted Space Bird is yours.",
    group: "streak",
  },
  { id: "spirit-turkey", name: "Spirit Turkey", how: "3 days completed, ever. The ghost of the turkey.", group: "spirit" },
  { id: "spirit-penguin", name: "Spirit Penguin", how: "5 days completed, ever.", group: "spirit" },
  { id: "spirit-flamingo", name: "Spirit Flamingo", how: "10 days completed, ever.", group: "spirit" },
  { id: "spirit-albatross", name: "Spirit Albatross", how: "30 days completed, ever.", group: "spirit" },
  { id: "spirit-phoenix", name: "Spirit Phoenix", how: "100 days completed, ever.", group: "spirit" },
  { id: "spirit-pterodactyl", name: "Spirit Pterodactyl", how: "200 days completed, ever.", group: "spirit" },
  { id: "spirit-spacebird", name: "Spirit Space Bird", how: "365 days completed, ever.", group: "spirit" },
  {
    id: "cheetah",
    name: "The Cheetah",
    how: `The cheetah is the fastest land animal. Zoom zoom. 10 days in a row of finishing in under ${FAST_MINUTES} minutes will earn you this badge.`,
    group: "speed",
  },
  {
    id: "night-bat",
    name: "The Night Bat",
    how: "The opposite of the Early Bird is this lovely creature of the night. Finish after 10pm, 10 days.",
    group: "clock",
  },
  {
    id: "early-bird",
    name: "The Early Bird",
    how: "Finish before 8am, 10 days. Worms, coffee, five hundred words.",
    group: "clock",
  },
  {
    id: "hamster",
    name: "The Hamster",
    how: "Once this meek Hamster gets on the wheel, nothing will get him to step off. 10 days in a row of showing up (any words).",
    group: "habit",
  },
  { id: "oxalis", name: "Oxalis", how: "Show up on 100 different days. A little plant that just keeps coming back.", group: "habit" },
  { id: "novella", name: "Novella", how: "10,000 words written.", group: "words" },
  { id: "short-story", name: "Short Story", how: "25,000 words written.", group: "words" },
  { id: "novel", name: "Novel", how: "50,000 words written.", group: "words" },
  { id: "anthology", name: "Anthology", how: "100,000 words written.", group: "words" },
  { id: "sequel", name: "Thrilling Sequel", how: "250,000 words written.", group: "words" },
  { id: "library", name: "Library", how: "500,000 words written.", group: "words" },
  {
    id: "turquoise-horse",
    name: "The Turquoise Horse",
    how: "This sheepish stallion is the reward for anyone with enough zeal to not only sign up for a monthly challenge, but to complete it as well.",
    group: "challenge",
  },
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
