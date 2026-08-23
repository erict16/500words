import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { badgesToAward, type BadgeStats } from "./badges";
import { addDays, datesInMonth, hourInZone, monthKey, todayInZone } from "./dates";
import {
  applyChallenge,
  applyLifetime,
  applySave,
  emptyLifetime,
  publicScore,
  type Lifetime,
} from "./engine";
import { getDb } from "./firebase";
import {
  defaultSettings,
  emptyEntry,
  type ChallengeEntrant,
  type ChallengeStatus,
  type DayEntry,
  type DayMark,
  type EarnedBadge,
  type MonthDay,
  type SessionStats,
  type Settings,
  type UserProfile,
} from "./types";
import { filterHits, type SearchHit } from "./search";
import { markForWords } from "./words";

const asNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

export function userRef(uid: string) {
  return doc(getDb(), "users", uid);
}

export function dayRef(uid: string, date: string) {
  return doc(getDb(), "users", uid, "days", date);
}

export function badgeRef(uid: string, id: string) {
  return doc(getDb(), "users", uid, "badges", id);
}

export function lifetimeRef(uid: string) {
  return doc(getDb(), "users", uid, "meta", "lifetime");
}

export function challengeRef(month: string, uid: string) {
  return doc(getDb(), "challenges", month, "entrants", uid);
}

export function publicMonthRef(month: string, uid: string) {
  return doc(getDb(), "public", month, "people", uid);
}

export async function ensureUser(user: User, timezone: string): Promise<UserProfile> {
  const ref = userRef(user.uid);
  const snap = await getDoc(ref);
  const settings = defaultSettings();
  settings.timezone = timezone;
  if (!snap.exists()) {
    const profile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || "Anonymous",
      email: user.email || "",
      photoURL: user.photoURL || "",
      createdAt: Date.now(),
      timezone,
      settings,
      daysWithAccount: 1,
    };
    await setDoc(ref, {
      ...profile,
      createdAt: Date.now(),
      serverCreatedAt: serverTimestamp(),
    });
    await setDoc(lifetimeRef(user.uid), {
      totalWords: 0,
      completedEver: 0,
      showedUpEver: 0,
      fastDays: 0,
      nightDays: 0,
      morningDays: 0,
      currentStreak: 0,
      showUpStreak: 0,
      lastCompleted: null,
      lastShowedUp: null,
      monthChallengeWins: 0,
    });
    return profile;
  }
  const data = snap.data();
  return {
    uid: user.uid,
    displayName: data.displayName || user.displayName || "Anonymous",
    email: data.email || user.email || "",
    photoURL: data.photoURL || user.photoURL || "",
    createdAt: asNumber(data.createdAt, Date.now()),
    timezone: data.timezone || timezone,
    settings: { ...settings, ...(data.settings ?? {}) },
    daysWithAccount: Math.max(
      1,
      Math.floor((Date.now() - asNumber(data.createdAt, Date.now())) / 86400000) + 1,
    ),
  };
}

export async function saveSettings(
  uid: string,
  settings: Settings,
  extra?: Partial<UserProfile>,
) {
  await setDoc(
    userRef(uid),
    { settings, timezone: settings.timezone, ...extra, updatedAt: Date.now() },
    { merge: true },
  );
}

function entryFromSnap(date: string, data: Record<string, unknown> | undefined): DayEntry {
  const base = emptyEntry(date);
  if (!data) return base;
  return {
    ...base,
    text: typeof data.text === "string" ? data.text : "",
    wordCount: asNumber(data.wordCount),
    basePoints: asNumber(data.basePoints),
    points: asNumber(data.points),
    mark: (data.mark as DayMark) || markForWords(asNumber(data.wordCount)),
    locked: Boolean(data.locked),
    celebrated: Boolean(data.celebrated),
    completedAt: data.completedAt ? asNumber(data.completedAt) : null,
    updatedAt: asNumber(data.updatedAt, Date.now()),
    session: { ...base.session, ...(data.session as SessionStats | undefined) },
    madeUp: Boolean(data.madeUp),
    tags: (data.tags as Record<string, string>) || {},
  };
}

export async function loadDay(uid: string, date: string): Promise<DayEntry> {
  const snap = await getDoc(dayRef(uid, date));
  return entryFromSnap(date, snap.data());
}

export async function loadPreviousBase(
  uid: string,
  date: string,
): Promise<[number, number]> {
  const y = addDays(date, -1);
  const y2 = addDays(date, -2);
  const [a, b] = await Promise.all([loadDay(uid, y), loadDay(uid, y2)]);
  return [a.basePoints, b.basePoints];
}

export function listenDay(
  uid: string,
  date: string,
  cb: (entry: DayEntry) => void,
): Unsubscribe {
  return onSnapshot(dayRef(uid, date), (snap) => {
    cb(entryFromSnap(date, snap.data()));
  });
}

export function listenMonth(
  uid: string,
  yearMonth: string,
  cb: (days: MonthDay[]) => void,
): Unsubscribe {
  const col = collection(getDb(), "users", uid, "days");
  return onSnapshot(col, (snap) => {
    const byDate = new Map<string, MonthDay>();
    snap.forEach((docSnap) => {
      if (!docSnap.id.startsWith(yearMonth)) return;
      const data = docSnap.data();
      const day = Number(docSnap.id.slice(-2));
      byDate.set(docSnap.id, {
        date: docSnap.id,
        day,
        wordCount: asNumber(data.wordCount),
        mark: (data.mark as DayMark) || markForWords(asNumber(data.wordCount)),
        points: asNumber(data.points),
        madeUp: Boolean(data.madeUp),
      });
    });
    cb(
      datesInMonth(yearMonth).map((date) => {
        const day = Number(date.slice(-2));
        return (
          byDate.get(date) ?? {
            date,
            day,
            wordCount: 0,
            mark: "none" as const,
            points: 0,
            madeUp: false,
          }
        );
      }),
    );
  });
}

export async function saveDayText(opts: {
  uid: string;
  displayName: string;
  photoURL: string;
  date: string;
  today: string;
  timezone: string;
  text: string;
  session: SessionStats;
}): Promise<{ entry: DayEntry; justFinished: boolean; newBadges: string[] }> {
  const { uid, date, today, timezone, text, session, displayName, photoURL } = opts;
  const existing = await loadDay(uid, date);
  const yesterdayDate = addDays(date, -1);
  const yesterday = await loadDay(uid, yesterdayDate);
  const previousBase = await loadPreviousBase(uid, date);
  const result = applySave({
    existing,
    text,
    previousBase,
    date,
    today,
    session,
    yesterday,
  });
  if (result.makeupYesterday) {
    await setDoc(
      dayRef(uid, yesterdayDate),
      { ...yesterday, madeUp: true, updatedAt: Date.now() },
      { merge: true },
    );
  }
  await setDoc(
    dayRef(uid, date),
    { ...result.entry, serverUpdatedAt: serverTimestamp() },
    { merge: true },
  );

  const life = await updateLifetime(
    uid,
    date,
    result.entry,
    session,
    timezone,
    result.justFinished,
    result.makeupYesterday,
  );
  await syncChallenge(uid, date, displayName, photoURL, result.entry, today);

  const newBadges = await awardBadges(uid, life);
  await syncPublic(uid, date, displayName, photoURL, result.entry, life.currentStreak);
  return { entry: result.entry, justFinished: result.justFinished, newBadges };
}

async function updateLifetime(
  uid: string,
  date: string,
  entry: DayEntry,
  session: SessionStats,
  timezone: string,
  justFinished: boolean,
  makeupYesterday: boolean,
): Promise<Lifetime> {
  const ref = lifetimeRef(uid);
  const snap = await getDoc(ref);
  const prevData = snap.data() ?? {};
  const prev: Lifetime = {
    ...emptyLifetime(),
    currentStreak: asNumber(prevData.currentStreak),
    showUpStreak: asNumber(prevData.showUpStreak),
    completedEver: asNumber(prevData.completedEver),
    showedUpEver: asNumber(prevData.showedUpEver),
    totalWords: asNumber(prevData.totalWords),
    fastDays: asNumber(prevData.fastDays),
    nightDays: asNumber(prevData.nightDays),
    morningDays: asNumber(prevData.morningDays),
    monthChallengeWon: asNumber(prevData.monthChallengeWins) > 0,
    hasWritten: asNumber(prevData.totalWords) > 0,
    lastCompleted: (prevData.lastCompleted as string | null) ?? null,
    lastShowedUp: (prevData.lastShowedUp as string | null) ?? null,
    monthChallengeWins: asNumber(prevData.monthChallengeWins),
    lastWordCount: asNumber(prevData.lastWordCount),
    lastWordDate: (prevData.lastWordDate as string | null) ?? null,
  };
  const next = applyLifetime(
    prev,
    date,
    entry,
    session,
    hourInZone(timezone),
    justFinished,
    makeupYesterday,
  );
  await setDoc(ref, { ...next, updatedAt: Date.now() }, { merge: true });
  return next;
}

async function awardBadges(uid: string, stats: BadgeStats): Promise<string[]> {
  const col = collection(getDb(), "users", uid, "badges");
  const snap = await getDocs(col);
  const already: Record<string, EarnedBadge> = {};
  snap.forEach((d) => {
    const data = d.data();
    already[d.id] = {
      id: d.id,
      earnedAt: asNumber(data.earnedAt, Date.now()),
      times: asNumber(data.times, 1),
    };
  });
  const ids = badgesToAward(stats, already);
  await Promise.all(
    ids.map((id) =>
      setDoc(badgeRef(uid, id), {
        id,
        earnedAt: Date.now(),
        times: 1,
      }),
    ),
  );
  return ids;
}

async function syncPublic(
  uid: string,
  date: string,
  displayName: string,
  photoURL: string,
  entry: DayEntry,
  streak: number,
) {
  const month = monthKey(date);
  const monthDaysSnap = await getDocs(collection(getDb(), "users", uid, "days"));
  const byDate = new Map<string, MonthDay>();
  monthDaysSnap.forEach((d) => {
    if (!d.id.startsWith(month)) return;
    const data = d.data();
    byDate.set(d.id, {
      date: d.id,
      day: Number(d.id.slice(-2)),
      wordCount: asNumber(data.wordCount),
      mark: (data.mark as DayMark) || markForWords(asNumber(data.wordCount)),
      points: asNumber(data.points),
      madeUp: Boolean(data.madeUp),
    });
  });
  byDate.set(date, {
    date,
    day: Number(date.slice(-2)),
    wordCount: entry.wordCount,
    mark: entry.mark,
    points: entry.points,
    madeUp: entry.madeUp,
  });
  const monthDays = datesInMonth(month).map((d) => {
    const day = Number(d.slice(-2));
    return (
      byDate.get(d) ?? {
        date: d,
        day,
        wordCount: 0,
        mark: "none" as const,
        points: 0,
        madeUp: false,
      }
    );
  });
  const badgeSnap = await getDocs(collection(getDb(), "users", uid, "badges"));
  const badges: EarnedBadge[] = [];
  badgeSnap.forEach((d) => {
    const data = d.data();
    badges.push({
      id: d.id,
      earnedAt: asNumber(data.earnedAt, Date.now()),
      times: asNumber(data.times, 1),
    });
  });
  const score = publicScore({ displayName, monthDays, streak, badges });
  await setDoc(
    publicMonthRef(month, uid),
    {
      uid,
      photoURL,
      ...score,
      updatedAt: Date.now(),
    },
    { merge: true },
  );
}

async function syncChallenge(
  uid: string,
  date: string,
  displayName: string,
  photoURL: string,
  entry: DayEntry,
  today: string,
) {
  const month = monthKey(date);
  const ref = challengeRef(month, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const joinDate =
    typeof snap.data()?.joinDate === "string"
      ? (snap.data()?.joinDate as string)
      : date;
  const daySnaps = await getDocs(collection(getDb(), "users", uid, "days"));
  const wordsByDate: Record<string, number> = {};
  daySnaps.forEach((d) => {
    if (d.id.startsWith(month)) wordsByDate[d.id] = asNumber(d.data().wordCount);
  });
  wordsByDate[date] = entry.wordCount;
  const next = applyChallenge({
    monthDates: datesInMonth(month),
    today,
    joinDate,
    wordsByDate,
  });
  await updateDoc(ref, {
    displayName,
    photoURL,
    ...next,
    updatedAt: Date.now(),
  });
  if (next.status === "won") {
    await setDoc(
      lifetimeRef(uid),
      { monthChallengeWins: 1, monthChallengeWon: true },
      { merge: true },
    );
    await setDoc(
      badgeRef(uid, "turquoise-horse"),
      { id: "turquoise-horse", earnedAt: Date.now(), times: 1 },
      { merge: true },
    );
  }
}

export async function joinChallenge(
  uid: string,
  displayName: string,
  photoURL: string,
  month: string,
  today: string,
) {
  const daySnaps = await getDocs(collection(getDb(), "users", uid, "days"));
  const wordsByDate: Record<string, number> = {};
  daySnaps.forEach((d) => {
    if (d.id.startsWith(month)) wordsByDate[d.id] = asNumber(d.data().wordCount);
  });
  const next = applyChallenge({
    monthDates: datesInMonth(month),
    today,
    joinDate: today,
    wordsByDate,
  });
  await setDoc(challengeRef(month, uid), {
    uid,
    displayName,
    photoURL,
    ...next,
    joinedAt: Date.now(),
    joinDate: today,
  });
}

export async function searchEntries(uid: string, query: string): Promise<SearchHit[]> {
  const snap = await getDocs(collection(getDb(), "users", uid, "days"));
  const days: DayEntry[] = [];
  snap.forEach((d) => days.push(entryFromSnap(d.id, d.data())));
  return filterHits(days, query);
}

export async function exportEntries(uid: string): Promise<string> {
  const snap = await getDocs(collection(getDb(), "users", uid, "days"));
  const days: DayEntry[] = [];
  snap.forEach((d) => days.push(entryFromSnap(d.id, d.data())));
  days.sort((a, b) => a.date.localeCompare(b.date));
  return days
    .map((d) => `===== ${d.date} (${d.wordCount} words) =====\n${d.text}\n`)
    .join("\n");
}

export function listenChallenge(
  month: string,
  cb: (people: ChallengeEntrant[]) => void,
): Unsubscribe {
  return onSnapshot(collection(getDb(), "challenges", month, "entrants"), (snap) => {
    const people: ChallengeEntrant[] = [];
    snap.forEach((d) => {
      const data = d.data();
      people.push({
        uid: d.id,
        displayName: data.displayName || "Anonymous",
        photoURL: data.photoURL || "",
        completedDays: asNumber(data.completedDays),
        missedDays: asNumber(data.missedDays),
        status: (data.status as ChallengeStatus) || "in",
      });
    });
    people.sort((a, b) => b.completedDays - a.completedDays);
    cb(people);
  });
}

export function listenBadges(
  uid: string,
  cb: (badges: EarnedBadge[]) => void,
): Unsubscribe {
  return onSnapshot(collection(getDb(), "users", uid, "badges"), (snap) => {
    const list: EarnedBadge[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        earnedAt: asNumber(data.earnedAt, Date.now()),
        times: asNumber(data.times, 1),
      });
    });
    list.sort((a, b) => a.earnedAt - b.earnedAt);
    cb(list);
  });
}

export function listenLifetime(
  uid: string,
  cb: (stats: BadgeStats & { lastCompleted: string | null; lastShowedUp: string | null }) => void,
): Unsubscribe {
  return onSnapshot(lifetimeRef(uid), (snap) => {
    const data = snap.data() ?? {};
    cb({
      currentStreak: asNumber(data.currentStreak),
      showUpStreak: asNumber(data.showUpStreak),
      completedEver: asNumber(data.completedEver),
      showedUpEver: asNumber(data.showedUpEver),
      totalWords: asNumber(data.totalWords),
      fastDays: asNumber(data.fastDays),
      nightDays: asNumber(data.nightDays),
      morningDays: asNumber(data.morningDays),
      monthChallengeWon: asNumber(data.monthChallengeWins) > 0,
      hasWritten: asNumber(data.totalWords) > 0,
      lastCompleted: (data.lastCompleted as string | null) ?? null,
      lastShowedUp: (data.lastShowedUp as string | null) ?? null,
    });
  });
}

export async function loadPublicPerson(month: string, uid: string) {
  const snap = await getDoc(publicMonthRef(month, uid));
  return snap.data() ?? null;
}

export function listenLeaderboard(
  month: string,
  cb: (rows: Array<Record<string, unknown>>) => void,
): Unsubscribe {
  return onSnapshot(collection(getDb(), "public", month, "people"), (snap) => {
    const rows: Array<Record<string, unknown>> = [];
    snap.forEach((d) => rows.push({ uid: d.id, ...d.data() }));
    rows.sort((a, b) => asNumber(b.monthPoints) - asNumber(a.monthPoints));
    cb(rows);
  });
}

export { todayInZone, monthKey };
