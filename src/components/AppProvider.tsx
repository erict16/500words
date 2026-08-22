"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import {
  ensureUser,
  joinChallenge as joinChallengeDb,
  listenBadges,
  listenChallenge,
  listenDay,
  listenLifetime,
  listenMonth,
  saveDayText,
  saveSettings,
} from "@/lib/db";
import { addDays, monthKey, todayInZone } from "@/lib/dates";
import { getFirebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import { hideSession, showSession, touchSession } from "@/lib/session";
import { tipForAccountDay } from "@/lib/tips";
import type { BadgeStats } from "@/lib/badges";
import {
  defaultSettings,
  emptyEntry,
  emptySession,
  WORD_GOAL,
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
  justFinished: boolean;
  newBadges: string[];
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setDate: (date: string) => void;
  setText: (text: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  joinThisMonth: () => Promise<void>;
  clearCelebration: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured();
  const [ready, setReady] = useState(!configured);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [date, setDateState] = useState(() =>
    todayInZone(Intl.DateTimeFormat().resolvedOptions().timeZone),
  );
  const [today, setToday] = useState(date);
  const [entry, setEntry] = useState<DayEntry>(() => emptyEntry(date));
  const [monthDays, setMonthDays] = useState<MonthDay[]>([]);
  const [badges, setBadges] = useState<EarnedBadge[]>([]);
  const [lifetime, setLifetime] = useState<AppContextValue["lifetime"]>(null);
  const [challenge, setChallenge] = useState<ChallengeEntrant[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [justFinished, setJustFinished] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef("");
  const sessionRef = useRef(emptySession());
  const saveTimer = useRef<number | null>(null);
  const entryRef = useRef(entry);

  useEffect(() => {
    entryRef.current = entry;
  }, [entry]);

  useEffect(() => {
    if (!configured) return;
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (next) => {
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
  }, [configured]);

  useEffect(() => {
    if (!user) return;
    const unsubDay = listenDay(user.uid, date, (next) => {
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
  }, [user, date, today]);

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
      if (!user || !profile) return;
      if (date !== today) return;
      setSaving(true);
      setError(null);
      try {
        const result = await saveDayText({
          uid: user.uid,
          displayName: profile.displayName,
          photoURL: profile.photoURL,
          date,
          today,
          timezone: settings.timezone,
          text,
          session: sessionRef.current,
        });
        setEntry(result.entry);
        setLastSavedAt(Date.now());
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
    [user, profile, date, today, settings.timezone],
  );

  const setText = useCallback(
    (text: string) => {
      if (date !== today) return;
      textRef.current = text;
      sessionRef.current = touchSession(sessionRef.current);
      setEntry((prev) => ({ ...prev, text, updatedAt: Date.now() }));
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        void persist(text);
      }, 800);
    },
    [date, today, persist],
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        if (user) void saveSettings(user.uid, next);
        return next;
      });
    },
    [user],
  );

  const signIn = useCallback(async () => {
    if (!configured) {
      setError("Firebase isn’t set up yet.");
      return;
    }
    setError(null);
    await signInWithPopup(getFirebaseAuth(), googleProvider());
  }, [configured]);

  const signOut = useCallback(async () => {
    if (configured) await firebaseSignOut(getFirebaseAuth());
  }, [configured]);

  const joinThisMonth = useCallback(async () => {
    if (!user || !profile) return;
    await joinChallengeDb(user.uid, profile.displayName, profile.photoURL, monthKey(today));
  }, [user, profile, today]);

  const missedYesterday = useMemo(() => {
    const y = addDays(today, -1);
    const row = monthDays.find((d) => d.date === y);
    if (!row) return false;
    return row.wordCount < WORD_GOAL && !row.madeUp;
  }, [monthDays, today]);

  const monthPoints = useMemo(
    () => monthDays.reduce((sum, d) => sum + d.points, 0),
    [monthDays],
  );

  const joinedChallenge = Boolean(user && challenge.some((p) => p.uid === user.uid));
  const daysWithAccount = profile?.daysWithAccount ?? 1;

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
    missedYesterday,
    tip: tipForAccountDay(daysWithAccount),
    saving,
    lastSavedAt,
    justFinished,
    newBadges,
    error,
    signIn,
    signOut,
    setDate: setDateState,
    setText,
    updateSettings,
    joinThisMonth,
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
