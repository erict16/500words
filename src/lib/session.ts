import { emptySession, type SessionStats } from "./types.ts";

const IDLE_MS = 60_000;

export function touchSession(prev: SessionStats, now = Date.now()): SessionStats {
  const next = { ...prev };
  if (!next.startedAt) next.startedAt = now;
  if (next.lastTypedAt && now - next.lastTypedAt > IDLE_MS) {
    next.pauseCount += 1;
    next.pauseMs += now - next.lastTypedAt;
  } else if (next.lastTypedAt) {
    next.activeMs += now - next.lastTypedAt;
  }
  next.lastTypedAt = now;
  return next;
}

export function hideSession(prev: SessionStats, now = Date.now()): SessionStats {
  return { ...prev, hiddenAt: now };
}

export function showSession(prev: SessionStats, now = Date.now()): SessionStats {
  if (!prev.hiddenAt) return prev;
  const away = now - prev.hiddenAt;
  if (away < 15_000) return { ...prev, hiddenAt: null };
  return {
    ...prev,
    hiddenAt: null,
    pauseCount: prev.pauseCount + 1,
    pauseMs: prev.pauseMs + away,
    lastTypedAt: now,
  };
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function wordsPerMinute(words: number, activeMs: number): number {
  if (activeMs < 5000) return 0;
  return Math.round((words / activeMs) * 60000);
}

export { emptySession };
