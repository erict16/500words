"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DayCheck } from "@/components/MonthGrid";
import { EntryArchive } from "@/components/EntryArchive";
import { useApp } from "@/components/AppProvider";
import { formatDuration, wordsPerMinute } from "@/lib/session";
import { countWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { Leaderboard } from "./Leaderboard";

export default function StatsPage() {
  const { entry, monthDays, monthPoints, lifetime, profile, today, setDate } = useApp();
  const router = useRouter();
  const words = countWords(entry.text);
  const wpm = wordsPerMinute(words, entry.session.activeMs);
  const tags = Object.entries(entry.tags);
  const completed = monthDays.filter((d) => d.mark === "strike").length;
  const started = monthDays.filter((d) => d.wordCount > 0).length;
  const done = words >= WORD_GOAL || entry.locked;

  return (
    <main className="page site-col">
      <h1 className="page-title">Stats</h1>
      <p className="page-kicker">Time, words, points. Not what the words were about.</p>

      <h2 className="page-h2">Today</h2>
      <table className="entry-stats">
        <caption className="sr-only">Today’s words, time, pauses, pace, and points</caption>
        <tbody>
          <tr>
            <td>
              <div className="stat-head">Words</div>
              <strong className="stat-hero" data-testid="stat-words">
                {words}
              </strong>
              <span className="stat-goal" data-testid="stat-goal">
                {done ? "Strike" : `${WORD_GOAL - words} to go`}
              </span>
            </td>
            <td>
              <div className="stat-head">Active time</div>
              <strong data-testid="stat-time">{formatDuration(entry.session.activeMs)}</strong>
              <span>this session</span>
            </td>
            <td>
              <div className="stat-head">Breaks</div>
              <strong data-testid="stat-pauses">{entry.session.pauseCount}</strong>
              <span>pauses</span>
            </td>
            <td>
              <div className="stat-head">Words / min</div>
              <strong data-testid="stat-wpm">{wpm || "—"}</strong>
              <span>pace</span>
            </td>
            <td>
              <div className="stat-head">Points</div>
              <strong data-testid="stat-points">{entry.points}</strong>
              <span>today</span>
            </td>
          </tr>
        </tbody>
      </table>

      {tags.length ? (
        <section>
          <h2 className="page-h2">Notes you tagged</h2>
          <ul className="board">
            {tags.map(([k, v]) => (
              <li key={k}>
                <span className="muted">{k}:</span> {v}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="page-kicker">
          Put a line like <code>MOOD: 7</code> or <code>TODO: call mom</code> on its own line if you
          want to track something. We save the tag. We don’t analyze the rest.
        </p>
      )}

      <section>
        <div className="month-head">
          <h2 className="page-h2">This month</h2>
          <p className="month-pts">{monthPoints} pts</p>
        </div>
        <p className="muted" data-testid="stat-month">
          {monthPoints} points · {completed} strikes · {started} days started
        </p>
        <div className="scorecard" data-testid="stats-month">
          {monthDays.map((day) => {
            const future = day.date > today;
            return (
              <div key={day.date} className="score-cell">
                <button
                  type="button"
                  className={`day-box ${day.mark} ${day.date === today ? "today" : ""} ${future ? "future" : ""}`}
                  data-mark={day.mark}
                  disabled={future}
                  title={`${day.date}: ${day.wordCount} words`}
                  onClick={() => {
                    setDate(day.date);
                    router.push("/");
                  }}
                >
                  {day.mark === "strike" ? <DayCheck /> : null}
                </button>
                <span className="score-pts">{day.points || ""}</span>
              </div>
            );
          })}
        </div>
        <div className="score-bars" data-testid="word-bars">
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
        <p className="muted">Words per day. Height is 500.</p>
      </section>

      <section>
        <h2 className="page-h2">All time</h2>
        <table className="lifetime-stats" data-testid="stat-alltime">
          <caption className="sr-only">All-time words, days finished, and streak</caption>
          <tbody>
            <tr>
              <td>
                words
                <strong>{lifetime?.totalWords ?? 0}</strong>
              </td>
              <td>
                days finished
                <strong>{lifetime?.completedEver ?? 0}</strong>
              </td>
              <td>
                day streak
                <strong>{lifetime?.currentStreak ?? 0}</strong>
              </td>
            </tr>
          </tbody>
        </table>
        {profile ? (
          <p className="page-kicker">
            <Link href={`/person/${profile.uid}`} className="ink-link" data-testid="public-link">
              Public page
            </Link>{" "}
            (words and badges, never the writing)
          </p>
        ) : null}
      </section>
      <EntryArchive />
      <Leaderboard />
    </main>
  );
}
