"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import {
  ensureUser,
  exportEntries,
  joinChallenge as joinChallengeDb,
  searchEntries,
  listenBadges,
  listenChallenge,
  listenDay,
  listenLifetime,
  listenMonth,
  saveDayText,
  saveSettings,
} from "@/lib/db";
import { monthKey, todayInZone } from "@/lib/dates";
import { emptyMonth, missedYesterday as missedYesterdayFn } from "@/lib/engine";
import { isE2E } from "@/lib/env";
import { getFirebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import {
  localBadges,
  localChallenge,
  localEnsureUser,
  localExport,
  localJoinChallenge,
  localLifetime,
  localLoadDay,
  localMonth,
  localSaveDay,
  localSaveSettings,
  localSearch,
  localSetName,
  localUser,
  hasLocalSession,
  setLocalSession,
} from "@/lib/local-store";
import { hideSession, showSession, touchSession } from "@/lib/session";
import { tipForAccountDay } from "@/lib/tips";
import type { SearchHit } from "@/lib/search";
import type { BadgeStats } from "@/lib/badges";
import {
  defaultSettings,
  emptyEntry,
  emptySession,
  type ChallengeEntrant,
  type DayEntry,
  type EarnedBadge,
  type MonthDay,
  type Settings,
  type UserProfile,
} from "@/lib/types";

type AppContextValue = {
  configured: boolean;
  ready: boolean;
  user: User | null;
  profile: UserProfile | null;
  settings: Settings;
  today: string;
  date: string;
  isToday: boolean;
  entry: DayEntry;
  monthDays: MonthDay[];
  monthPoints: number;
  badges: EarnedBadge[];
  lifetime: (BadgeStats & { lastCompleted: string | null; lastShowedUp: string | null }) | null;
  challenge: ChallengeEntrant[];
  joinedChallenge: boolean;
  missedYesterday: boolean;
  tip: string | null;
  saving: boolean;
  lastSavedAt: number | null;
  savedFlash: boolean;
  justFinished: boolean;
  newBadges: string[];
  error: string | null;
  signIn: () => Promise<void>;
  startLocal: () => void;
  signOut: () => Promise<void>;
  setDate: (date: string) => void;
  setText: (text: string) => void;
  saveNow: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  joinThisMonth: () => Promise<void>;
  downloadExport: () => Promise<void>;
  searchWriting: (query: string) => Promise<SearchHit[]>;
  updateProfile: (patch: { displayName: string }) => void;
  clearCelebration: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const e2e = isE2E();

export function AppProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured() || e2e;
  const [offline, setOffline] = useState(e2e);
  const offlineRef = useRef(e2e);
  const [ready, setReady] = useState(true);
  const [user, setUser] = useState<User | null>(e2e ? (localUser as unknown as User) : null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [date, setDateState] = useState(() =>
    todayInZone(Intl.DateTimeFormat().resolvedOptions().timeZone),
  );
  const [today, setToday] = useState(date);
  const [entry, setEntry] = useState<DayEntry>(() => emptyEntry(date));
  const [monthDays, setMonthDays] = useState<MonthDay[]>(() => emptyMonth(monthKey(date)));
  const [badges, setBadges] = useState<EarnedBadge[]>([]);
  const [lifetime, setLifetime] = useState<AppContextValue["lifetime"]>(null);
  const [challenge, setChallenge] = useState<ChallengeEntrant[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef("");
  const sessionRef = useRef(emptySession());
  const saveTimer = useRef<number | null>(null);
  const dirtyRef = useRef(false);

  useEffect(() => {
    offlineRef.current = offline;
  }, [offline]);

  const bootLocal = useCallback(() => {
    offlineRef.current = true;
    setLocalSession(true);
    setOffline(true);
    setUser(localUser as unknown as User);
    const ensured = localEnsureUser();
    setProfile(ensured);
    setSettings(ensured.settings);
    const t = todayInZone(ensured.settings.timezone);
    setToday(t);
    setDateState(t);
    setEntry(localLoadDay(t));
    setMonthDays(localMonth(monthKey(t)));
    setBadges(localBadges());
    setLifetime(localLifetime());
    setChallenge(localChallenge(monthKey(t)));
    setReady(true);
    setError(null);
  }, []);

  useLayoutEffect(() => {
    if (e2e) return;
    if (!hasLocalSession()) return;
    const id = window.requestAnimationFrame(() => bootLocal());
    return () => window.cancelAnimationFrame(id);
  }, [bootLocal]);

  useEffect(() => {
    if (e2e) {
      const id = window.requestAnimationFrame(() => bootLocal());
      return () => window.cancelAnimationFrame(id);
    }
    if (!isFirebaseConfigured()) return;
    let unsub: (() => void) | undefined;
    try {
      const auth = getFirebaseAuth();
      void getRedirectResult(auth).catch(() => undefined);
      unsub = onAuthStateChanged(auth, async (next) => {
        if (offlineRef.current && !next) return;
        if (next) {
          setLocalSession(false);
          setOffline(false);
        }
        setUser(next);
        if (!next) {
          setProfile(null);
          setReady(true);
          return;
        }
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const ensured = await ensureUser(next, tz);
          setProfile(ensured);
          setSettings(ensured.settings);
          const t = todayInZone(ensured.settings.timezone);
          setToday(t);
          setDateState(t);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not load your account.");
        } finally {
          setReady(true);
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in isn’t available.";
      queueMicrotask(() => {
        setError(message);
        setReady(true);
      });
    }
    return () => unsub?.();
  }, [bootLocal]);

  useEffect(() => {
    if (e2e || offline) {
      if (dirtyRef.current) return;
      setEntry(localLoadDay(date));
      setMonthDays(localMonth(monthKey(date)));
      setBadges(localBadges());
      setLifetime(localLifetime());
      setChallenge(localChallenge(monthKey(today)));
      return;
    }
    if (!user) return;
    const unsubDay = listenDay(user.uid, date, (next) => {
      if (dirtyRef.current) return;
      setEntry(next);
      textRef.current = next.text;
      sessionRef.current = next.session || emptySession();
    });
    const unsubMonth = listenMonth(user.uid, monthKey(date), setMonthDays);
    const unsubBadges = listenBadges(user.uid, setBadges);
    const unsubLife = listenLifetime(user.uid, setLifetime);
    const unsubChal = listenChallenge(monthKey(today), setChallenge);
    return () => {
      unsubDay();
      unsubMonth();
      unsubBadges();
      unsubLife();
      unsubChal();
    };
  }, [user, date, today, offline]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) sessionRef.current = hideSession(sessionRef.current);
      else sessionRef.current = showSession(sessionRef.current);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const persist = useCallback(
    async (text: string) => {
      if (!profile) return;
      if (date !== today) return;
      setSaving(true);
      setError(null);
      try {
        const result = e2e || offline
          ? localSaveDay({
              date,
              today,
              timezone: settings.timezone,
              text,
              session: sessionRef.current,
            })
          : user
            ? await saveDayText({
                uid: user.uid,
                displayName: profile.displayName,
                photoURL: profile.photoURL,
                date,
                today,
                timezone: settings.timezone,
                text,
                session: sessionRef.current,
              })
            : null;
        if (!result) return;
        dirtyRef.current = false;
        setEntry(result.entry);
        setLastSavedAt(Date.now());
        setSavedFlash(true);
        window.setTimeout(() => setSavedFlash(false), 900);
        if (e2e || offline) {
          setMonthDays(localMonth(monthKey(date)));
          setBadges(localBadges());
          setLifetime(localLifetime());
          setChallenge(localChallenge(monthKey(today)));
        }
        if (result.justFinished) {
          setJustFinished(true);
          setNewBadges(result.newBadges);
        } else if (result.newBadges.length) {
          setNewBadges(result.newBadges);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save.");
      } finally {
        setSaving(false);
      }
    },
    [user, profile, date, today, settings.timezone, offline],
  );

  const setText = useCallback(
    (text: string) => {
      if (date !== today) return;
      if (settings.lockEdits && entry.locked) return;
      dirtyRef.current = true;
      textRef.current = text;
      sessionRef.current = touchSession(sessionRef.current);
      setEntry((prev) => ({ ...prev, text, updatedAt: Date.now() }));
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        void persist(text);
      }, 800);
    },
    [date, today, persist, settings.lockEdits, entry.locked],
  );

  const saveNow = useCallback(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    void persist(textRef.current);
  }, [persist]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveNow();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saveNow]);

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        if (e2e || offline) localSaveSettings(next);
        else if (user) void saveSettings(user.uid, next);
        return next;
      });
      if (patch.timezone) {
        const t = todayInZone(patch.timezone);
        setToday(t);
      }
    },
    [user, offline],
  );

  const startLocal = useCallback(() => {
    bootLocal();
  }, [bootLocal]);

  const signIn = useCallback(async () => {
    if (e2e) return;
    if (!isFirebaseConfigured()) {
      setError("Google sign-in needs Firebase. Use “Write on this device” for now.");
      return;
    }
    setError(null);
    try {
      await signInWithPopup(getFirebaseAuth(), googleProvider());
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Google sign-in failed.";
      const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
      if (/popup/i.test(code + raw)) {
        try {
          await signInWithRedirect(getFirebaseAuth(), googleProvider());
          return;
        } catch {
          /* fall through */
        }
      }
      const message = /unauthorized-domain/i.test(raw)
        ? "Google isn’t allowed on this domain yet. Use “Write on this device”."
        : raw;
      setError(message);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLocalSession(false);
    if (offline) {
      setOffline(false);
      setUser(null);
      setProfile(null);
      return;
    }
    if (isFirebaseConfigured()) await firebaseSignOut(getFirebaseAuth());
  }, [offline]);

  const joinThisMonth = useCallback(async () => {
    if (!profile) return;
    if (e2e || offline) {
      localJoinChallenge(monthKey(today), today);
      setChallenge(localChallenge(monthKey(today)));
      return;
    }
    if (!user) return;
    await joinChallengeDb(
      user.uid,
      profile.displayName,
      profile.photoURL,
      monthKey(today),
      today,
    );
  }, [user, profile, today, offline]);

  const searchWriting = useCallback(
    async (query: string): Promise<SearchHit[]> => {
      if (e2e || offline) return localSearch(query);
      if (!user) return [];
      return searchEntries(user.uid, query);
    },
    [user, offline],
  );

  const updateProfile = useCallback(
    (patch: { displayName: string }) => {
      const name = patch.displayName.trim();
      if (!name) return;
      if (e2e || offline) {
        const next = localSetName(name);
        setProfile(next);
        return;
      }
      if (!user) return;
      setProfile((prev) => (prev ? { ...prev, displayName: name } : prev));
      void saveSettings(user.uid, settings, { displayName: name });
    },
    [user, offline, settings],
  );

  const downloadExport = useCallback(async () => {
    const body = e2e || offline
      ? localExport()
      : user
        ? await exportEntries(user.uid)
        : "";
    const blob = new Blob([body || "(empty)"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "500words-export.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [user, offline]);

  const monthPoints = useMemo(
    () => monthDays.reduce((sum, d) => sum + d.points, 0),
    [monthDays],
  );

  const joinedChallenge = Boolean(
    (user || e2e || offline) && challenge.some((p) => p.uid === (user?.uid ?? "local")),
  );

  const value: AppContextValue = {
    configured,
    ready,
    user,
    profile,
    settings,
    today,
    date,
    isToday: date === today,
    entry,
    monthDays,
    monthPoints,
    badges,
    lifetime,
    challenge,
    joinedChallenge,
    missedYesterday: missedYesterdayFn(today, lifetime?.lastCompleted ?? null),
    tip: tipForAccountDay(profile?.daysWithAccount ?? 1),
    saving,
    lastSavedAt,
    savedFlash,
    justFinished,
    newBadges,
    error,
    signIn,
    startLocal,
    signOut,
    setDate: (next) => {
      setDateState(next);
      setMonthDays(emptyMonth(monthKey(next)));
    },
    setText,
    saveNow,
    updateSettings,
    joinThisMonth,
    downloadExport,
    searchWriting,
    updateProfile,
    clearCelebration: () => {
      setJustFinished(false);
      setNewBadges([]);
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

