"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { formatDuration, wordsPerMinute } from "@/lib/session";
import { countWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { Leaderboard } from "./Leaderboard";

export default function StatsPage() {
  const { entry, monthDays, monthPoints, lifetime, profile } = useApp();
  const words = countWords(entry.text);
  const wpm = wordsPerMinute(words, entry.session.activeMs);
  const tags = Object.entries(entry.tags);
  const completed = monthDays.filter((d) => d.mark === "strike").length;
  const started = monthDays.filter((d) => d.wordCount > 0).length;

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-georgia text-3xl">Stats</h1>
      <p className="mt-2 text-[14px] text-[var(--muted)]">
        Time, words, points. Not what the words were about.
      </p>

      <section className="mt-8">
        <h2 className="text-[13px] uppercase tracking-wide text-[var(--muted)]">
          Today
        </h2>
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-[16px]">
          <div>
            <dt className="text-[13px] text-[var(--muted)]">Words</dt>
            <dd>{words}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-[var(--muted)]">Goal</dt>
            <dd>
              {words >= WORD_GOAL ? "Strike" : `${WORD_GOAL - words} to go`}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-[var(--muted)]">Active time</dt>
            <dd>{formatDuration(entry.session.activeMs)}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-[var(--muted)]">Breaks</dt>
            <dd>{entry.session.pauseCount}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-[var(--muted)]">Words / min</dt>
            <dd>{wpm || "—"}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-[var(--muted)]">Points</dt>
            <dd>{entry.points}</dd>
          </div>
        </dl>
      </section>

      {tags.length ? (
        <section className="mt-8">
          <h2 className="text-[13px] uppercase tracking-wide text-[var(--muted)]">
            Notes you tagged
          </h2>
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
          Put a line like <code>MOOD: 7</code> or <code>TODO: call mom</code> on
          its own line if you want to track something. We save the tag. We don’t
          analyze the rest.
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-[13px] uppercase tracking-wide text-[var(--muted)]">
          This month
        </h2>
        <p className="mt-3 text-[16px]">
          {monthPoints} points · {completed} strikes · {started} days started
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-[13px] uppercase tracking-wide text-[var(--muted)]">
          All time
        </h2>
        <p className="mt-3 text-[16px]">
          {lifetime?.totalWords ?? 0} words · {lifetime?.completedEver ?? 0}{" "}
          days finished · {lifetime?.currentStreak ?? 0} day streak
        </p>
        {profile ? (
          <p className="mt-4 text-[14px]">
            <Link href={`/person/${profile.uid}`} className="underline">
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
