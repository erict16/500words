"use client";

import Link from "next/link";
import { BowlingMark } from "@/components/BowlingMark";
import { useApp } from "@/components/AppProvider";
import { formatDuration, wordsPerMinute } from "@/lib/session";
import { countWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { Leaderboard } from "./Leaderboard";

export default function StatsPage() {
  const { entry, monthDays, monthPoints, lifetime, profile, today } = useApp();
  const words = countWords(entry.text);
  const wpm = wordsPerMinute(words, entry.session.activeMs);
  const tags = Object.entries(entry.tags);
  const completed = monthDays.filter((d) => d.mark === "strike").length;
  const started = monthDays.filter((d) => d.wordCount > 0).length;
  const done = words >= WORD_GOAL || entry.locked;

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-georgia text-3xl">Stats</h1>
      <p className="mt-2 text-[14px] text-[var(--muted)]">
        Time, words, points. Not what the words were about.
      </p>

      <section className="mt-8">
        <h2 className="text-[13px] uppercase tracking-wide text-[var(--muted)]">Today</h2>
        <p className={`mt-3 font-georgia text-5xl tabular-nums ${done ? "word-good" : ""}`} data-testid="stat-words">
          {words}
        </p>
        <p className="mt-1 text-[15px] text-[var(--muted)]" data-testid="stat-goal">
          {done ? "Strike" : `${WORD_GOAL - words} to go`}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-[16px]">
          <div>
            <dt className="text-[13px] text-[var(--muted)]">Active time</dt>
            <dd data-testid="stat-time">{formatDuration(entry.session.activeMs)}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-[var(--muted)]">Breaks</dt>
            <dd data-testid="stat-pauses">{entry.session.pauseCount}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-[var(--muted)]">Words / min</dt>
            <dd data-testid="stat-wpm">{wpm || "—"}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-[var(--muted)]">Points</dt>
            <dd data-testid="stat-points">{entry.points}</dd>
          </div>
        </dl>
      </section>

      {tags.length ? (
        <section className="mt-8">
          <h2 className="text-[13px] uppercase tracking-wide text-[var(--muted)]">Notes you tagged</h2>
          <ul className="mt-3 space-y-1 text-[15px]">
            {tags.map(([k, v]) => (
              <li key={k}>
                <span className="text-[var(--muted)]">{k}:</span> {v}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="mt-8 text-[14px] text-[var(--muted)]">
          Put a line like <code>MOOD: 7</code> or <code>TODO: call mom</code> on its own line if you
          want to track something. We save the tag. We don’t analyze the rest.
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-[13px] uppercase tracking-wide text-[var(--muted)]">This month</h2>
        <p className="mt-3 text-[16px]" data-testid="stat-month">
          {monthPoints} points · {completed} strikes · {started} days started
        </p>
        <div className="scorecard mt-4" data-testid="stats-month">
          {monthDays.map((day) => (
            <div key={day.date} className="score-cell">
              <span
                className={`day-box ${day.mark} ${day.date === today ? "today" : ""}`}
                data-mark={day.mark}
                title={`${day.date}: ${day.wordCount} words`}
              >
                <span className="num">{day.day}</span>
                <BowlingMark mark={day.mark} />
              </span>
              <span className="score-pts">{day.points || ""}</span>
            </div>
          ))}
        </div>
        <div className="score-bars mt-6" data-testid="word-bars">
          {monthDays.map((day) => (
            <span
              key={day.date}
              className="score-bar"
              title={`${day.date}: ${day.wordCount} words`}
              style={{
                height: `${Math.min(100, (day.wordCount / WORD_GOAL) * 100)}%`,
                opacity: day.wordCount >= WORD_GOAL ? 1 : 0.45,
              }}
            />
          ))}
        </div>
        <p className="mt-1 text-[12px] text-[var(--muted)]">Words per day. Height is 500.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-[13px] uppercase tracking-wide text-[var(--muted)]">All time</h2>
        <p className="mt-3 text-[16px]" data-testid="stat-alltime">
          {lifetime?.totalWords ?? 0} words · {lifetime?.completedEver ?? 0} days finished ·{" "}
          {lifetime?.currentStreak ?? 0} day streak
        </p>
        {profile ? (
          <p className="mt-4 text-[14px]">
            <Link href={`/person/${profile.uid}`} className="underline" data-testid="public-link">
              Public page
            </Link>{" "}
            (words and badges, never the writing)
          </p>
        ) : null}
      </section>
      <Leaderboard />
    </main>
  );
}
