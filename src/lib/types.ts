export const WORD_GOAL = 500;
export const SPARE_MIN = 100;
export const FAST_MINUTES = 14;

export type DayMark = "none" | "dot" | "spare" | "strike";

export type FontId = "georgia" | "palatino" | "times" | "helvetica" | "courier";

export type ThemeId = "light" | "dark" | "sepia";

export type Settings = {
  font: FontId;
  fontSize: number;
  paragraphSpacing: number;
  lineHeight: number;
  theme: ThemeId;
  timezone: string;
  hideChrome: boolean;
  lockEdits: boolean;
};

export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: number;
  timezone: string;
  settings: Settings;
  daysWithAccount: number;
};

export type SessionStats = {
  startedAt: number | null;
  activeMs: number;
  pauseCount: number;
  pauseMs: number;
  lastTypedAt: number | null;
  hiddenAt: number | null;
};

export type DayEntry = {
  date: string;
  text: string;
  wordCount: number;
  basePoints: number;
  points: number;
  mark: DayMark;
  locked: boolean;
  celebrated: boolean;
  completedAt: number | null;
  updatedAt: number;
  session: SessionStats;
  madeUp: boolean;
  tags: Record<string, string>;
};

export type MonthDay = {
  date: string;
  day: number;
  wordCount: number;
  mark: DayMark;
  points: number;
  madeUp: boolean;
};

export type EarnedBadge = {
  id: string;
  earnedAt: number;
  times: number;
};

export type ChallengeStatus = "in" | "out" | "won" | "shame";

export type ChallengeEntrant = {
  uid: string;
  displayName: string;
  photoURL: string;
  completedDays: number;
  missedDays: number;
  status: ChallengeStatus;
};

export const defaultSettings = (): Settings => ({
  font: "georgia",
  fontSize: 18,
  paragraphSpacing: 0,
  lineHeight: 1.6,
  theme: "light",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  hideChrome: false,
  lockEdits: false,
});

export const emptySession = (): SessionStats => ({
  startedAt: null,
  activeMs: 0,
  pauseCount: 0,
  pauseMs: 0,
  lastTypedAt: null,
  hiddenAt: null,
});

export const emptyEntry = (date: string): DayEntry => ({
  date,
  text: "",
  wordCount: 0,
  basePoints: 0,
  points: 0,
  mark: "none",
  locked: false,
  celebrated: false,
  completedAt: null,
  updatedAt: Date.now(),
  session: emptySession(),
  madeUp: false,
  tags: {},
});
