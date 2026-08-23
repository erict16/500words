import { addDays, datesInMonth, hourInZone, monthKey } from "./dates";
import { badgesToAward, type BadgeStats } from "./badges";
import {
  applyChallenge,
  applyLifetime,
  applySave,
  emptyLifetime,
  type Lifetime,
} from "./engine";
import {
  defaultSettings,
  emptyEntry,
  emptySession,
  type ChallengeEntrant,
  type DayEntry,
  type EarnedBadge,
  type MonthDay,
  type SessionStats,
  type Settings,
  type UserProfile,
} from "./types";
import { markForWords } from "./words";

const KEY = "fivehundred-local-v1";

type DB = {
  profile: UserProfile;
  days: Record<string, DayEntry>;
  lifetime: Lifetime;
  badges: Record<string, EarnedBadge>;
  challenges: Record<string, ChallengeEntrant & { joinDate: string }>;
};

function load(): DB {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as DB;
  } catch {
    return seed();
  }
}

function seed(): DB {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return {
    profile: {
      uid: "local",
      displayName: "You",
      email: "you@local",
      photoURL: "",
      createdAt: Date.now(),
      timezone: tz,
      settings: { ...defaultSettings(), timezone: tz },
      daysWithAccount: 1,
    },
    days: {},
    lifetime: emptyLifetime(),
    badges: {},
    challenges: {},
  };
}

function persist(db: DB) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(db));
  }
}

export const localUser = {
  uid: "local",
  displayName: "You",
  email: "you@local",
  photoURL: "",
} as const;

export function localEnsureUser(): UserProfile {
  const db = load();
  persist(db);
  return db.profile;
}

export function localSaveSettings(settings: Settings) {
  const db = load();
  db.profile.settings = settings;
  db.profile.timezone = settings.timezone;
  persist(db);
}

export function localLoadDay(date: string): DayEntry {
  return load().days[date] ?? emptyEntry(date);
}

export function localMonth(yearMonth: string): MonthDay[] {
  const db = load();
  return datesInMonth(yearMonth).map((date) => {
    const day = db.days[date];
    return {
      date,
      day: Number(date.slice(-2)),
      wordCount: day?.wordCount ?? 0,
      mark: day?.mark ?? markForWords(day?.wordCount ?? 0),
      points: day?.points ?? 0,
      madeUp: day?.madeUp ?? false,
    };
  });
}

export function localSaveDay(opts: {
  date: string;
  today: string;
  timezone: string;
  text: string;
  session: SessionStats;
}): { entry: DayEntry; justFinished: boolean; newBadges: string[] } {
  const db = load();
  const existing = db.days[opts.date] ?? emptyEntry(opts.date);
  const yesterdayDate = addDays(opts.date, -1);
  const yesterday = db.days[yesterdayDate] ?? null;
  const previousBase: [number, number] = [
    db.days[yesterdayDate]?.basePoints ?? 0,
    db.days[addDays(opts.date, -2)]?.basePoints ?? 0,
  ];
  const result = applySave({
    existing,
    text: opts.text,
    previousBase,
    date: opts.date,
    today: opts.today,
    session: opts.session,
    yesterday,
  });
  if (result.makeupYesterday && yesterday) {
    db.days[yesterdayDate] = { ...yesterday, madeUp: true };
  }
  db.days[opts.date] = result.entry;
  db.lifetime = applyLifetime(
    db.lifetime,
    opts.date,
    result.entry,
    opts.session,
    hourInZone(opts.timezone),
    result.justFinished,
    result.makeupYesterday,
  );
  const stats: BadgeStats = db.lifetime;
  const newBadges = badgesToAward(stats, db.badges);
  for (const id of newBadges) {
    db.badges[id] = { id, earnedAt: Date.now(), times: 1 };
  }
  const month = monthKey(opts.date);
  const chal = db.challenges[month];
  if (chal) {
    const wordsByDate: Record<string, number> = {};
    for (const [d, entry] of Object.entries(db.days)) {
      if (d.startsWith(month)) wordsByDate[d] = entry.wordCount;
    }
    const next = applyChallenge({
      monthDates: datesInMonth(month),
      today: opts.today,
      joinDate: chal.joinDate,
      wordsByDate,
    });
    db.challenges[month] = { ...chal, ...next };
    if (next.status === "won") {
      db.lifetime.monthChallengeWins += 1;
      db.lifetime.monthChallengeWon = true;
      db.badges["turquoise-horse"] = {
        id: "turquoise-horse",
        earnedAt: Date.now(),
        times: 1,
      };
    }
  }
  persist(db);
  return { entry: result.entry, justFinished: result.justFinished, newBadges };
}

export function localBadges(): EarnedBadge[] {
  return Object.values(load().badges).sort((a, b) => a.earnedAt - b.earnedAt);
}

export function localLifetime(): Lifetime {
  return load().lifetime;
}

export function localJoinChallenge(month: string, today: string) {
  const db = load();
  db.challenges[month] = {
    uid: "local",
    displayName: db.profile.displayName,
    photoURL: "",
    completedDays: 0,
    missedDays: 0,
    status: "in",
    joinDate: today,
  };
  persist(db);
}

export function localChallenge(month: string): ChallengeEntrant[] {
  const row = load().challenges[month];
  return row ? [row] : [];
}

export function localExport(): string {
  const db = load();
  const days = Object.values(db.days).sort((a, b) => a.date.localeCompare(b.date));
  return days
    .map((d) => `===== ${d.date} (${d.wordCount} words) =====\n${d.text}\n`)
    .join("\n");
}

export { emptySession };
