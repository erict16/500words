import { addDays, datesInMonth, hourInZone, monthKey } from "./dates.ts";
import { badgesToAward, type BadgeStats } from "./badges.ts";
import {
  applyChallenge,
  applyLifetime,
  applySave,
  emptyLifetime,
  type Lifetime,
} from "./engine.ts";
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
} from "./types.ts";
import { filterHits, formatExport, type SearchHit } from "./search.ts";
import { countWords, markForWords } from "./words.ts";
import { LOCAL_UID } from "./identity.ts";

const KEY = "fivehundred-local-v1";
export const SESSION_KEY = "fivehundred-local-session";

export function hasLocalSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function setLocalSession(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (on) window.localStorage.setItem(SESSION_KEY, "1");
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

type DB = {
  profile: UserProfile;
  days: Record<string, DayEntry>;
  lifetime: Lifetime;
  badges: Record<string, EarnedBadge>;
  challenges: Record<string, ChallengeEntrant & { joinDate: string }>;
  cloudUid: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function parseLocalDb(raw: unknown): DB {
  const base = seed();
  if (!isRecord(raw)) return base;
  return {
    profile: parseProfile(raw.profile, base.profile),
    days: parseDays(raw.days),
    lifetime: isRecord(raw.lifetime) ? { ...base.lifetime, ...raw.lifetime } : base.lifetime,
    badges: parseBadges(raw.badges),
    challenges: parseChallenges(raw.challenges),
    cloudUid: typeof raw.cloudUid === "string" && raw.cloudUid ? raw.cloudUid : null,
  };
}

function parseProfile(value: unknown, fallback: UserProfile): UserProfile {
  if (!isRecord(value)) return fallback;
  const settings = isRecord(value.settings)
    ? { ...fallback.settings, ...value.settings }
    : fallback.settings;
  const email = asString(value.email, "");
  return {
    uid: LOCAL_UID,
    displayName: asString(value.displayName, fallback.displayName) || "You",
    email: email === "you@local" ? "" : email,
    photoURL: asString(value.photoURL, ""),
    createdAt: asNumber(value.createdAt, fallback.createdAt),
    timezone: asString(value.timezone, fallback.timezone),
    settings,
    daysWithAccount: Math.max(1, asNumber(value.daysWithAccount, fallback.daysWithAccount)),
  };
}

function parseDays(value: unknown): Record<string, DayEntry> {
  if (!isRecord(value)) return {};
  const days: Record<string, DayEntry> = {};
  for (const [date, entry] of Object.entries(value)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isRecord(entry)) continue;
    const base = emptyEntry(date);
    const text = asString(entry.text, "");
    const wordCount = asNumber(entry.wordCount, countWords(text));
    days[date] = {
      ...base,
      text,
      wordCount,
      basePoints: asNumber(entry.basePoints, 0),
      points: asNumber(entry.points, 0),
      mark:
        entry.mark === "none" || entry.mark === "dot" || entry.mark === "spare" || entry.mark === "strike"
          ? entry.mark
          : markForWords(wordCount),
      locked: Boolean(entry.locked),
      celebrated: Boolean(entry.celebrated),
      completedAt: entry.completedAt == null ? null : asNumber(entry.completedAt, 0),
      updatedAt: asNumber(entry.updatedAt, Date.now()),
      session: isRecord(entry.session) ? { ...base.session, ...entry.session } : base.session,
      madeUp: Boolean(entry.madeUp),
      tags: isRecord(entry.tags)
        ? Object.fromEntries(
            Object.entries(entry.tags).filter(
              (pair): pair is [string, string] => typeof pair[1] === "string",
            ),
          )
        : {},
    };
  }
  return days;
}

function parseBadges(value: unknown): Record<string, EarnedBadge> {
  if (!isRecord(value)) return {};
  const badges: Record<string, EarnedBadge> = {};
  for (const [id, badge] of Object.entries(value)) {
    if (!isRecord(badge)) continue;
    badges[id] = {
      id: asString(badge.id, id),
      earnedAt: asNumber(badge.earnedAt, Date.now()),
      times: Math.max(1, asNumber(badge.times, 1)),
    };
  }
  return badges;
}

function parseChallenges(value: unknown): DB["challenges"] {
  if (!isRecord(value)) return {};
  const challenges: DB["challenges"] = {};
  for (const [month, row] of Object.entries(value)) {
    if (!isRecord(row)) continue;
    const status = row.status;
    challenges[month] = {
      uid: LOCAL_UID,
      displayName: asString(row.displayName, "You"),
      photoURL: asString(row.photoURL, ""),
      completedDays: asNumber(row.completedDays, 0),
      missedDays: asNumber(row.missedDays, 0),
      status:
        status === "in" || status === "out" || status === "won" || status === "shame"
          ? status
          : "in",
      joinDate: asString(row.joinDate, ""),
    };
  }
  return challenges;
}

function load(): DB {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seed();
    return parseLocalDb(JSON.parse(raw));
  } catch {
    return seed();
  }
}

function seed(): DB {
  const tz =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
      : "UTC";
  return {
    profile: {
      uid: LOCAL_UID,
      displayName: "You",
      email: "",
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
    cloudUid: null,
  };
}

function persist(db: DB) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(db));
  }
}

export function localEntriesWithText(): DayEntry[] {
  return Object.values(load().days).filter((day) => day.text.trim().length > 0);
}

export function localDaysMap(): Record<string, DayEntry> {
  return { ...load().days };
}

export function localPutDays(days: DayEntry[]) {
  const db = load();
  for (const day of days) {
    db.days[day.date] = day;
  }
  persist(db);
}

export function localReplaceDays(days: Record<string, DayEntry>) {
  const db = load();
  db.days = { ...days };
  persist(db);
}

export function localCloudUid(): string | null {
  return load().cloudUid ?? null;
}

export function localSetCloudUid(uid: string | null) {
  const db = load();
  db.cloudUid = uid;
  persist(db);
}

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
  const wordsByDate: Record<string, number> = {};
  for (const [d, entry] of Object.entries(db.days)) {
    if (d.startsWith(month)) wordsByDate[d] = entry.wordCount;
  }
  const next = applyChallenge({
    monthDates: datesInMonth(month),
    today,
    joinDate: today,
    wordsByDate,
  });
  db.challenges[month] = {
    uid: LOCAL_UID,
    displayName: db.profile.displayName,
    photoURL: "",
    ...next,
    joinDate: today,
  };
  persist(db);
}

export function localChallenge(month: string): ChallengeEntrant[] {
  const row = load().challenges[month];
  return row ? [row] : [];
}

export function localSearch(query: string): SearchHit[] {
  return filterHits(Object.values(load().days), query);
}

export function localSetName(displayName: string) {
  const db = load();
  db.profile.displayName = displayName.trim() || db.profile.displayName;
  persist(db);
  return db.profile;
}

export function localExport(): string {
  return formatExport(Object.values(load().days));
}

export { emptySession };
