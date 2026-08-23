"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { EntryArchive } from "@/components/EntryArchive";
import { useApp } from "@/components/AppProvider";
import { parseDate } from "@/lib/dates";
import { formatDuration, wordsPerMinute } from "@/lib/session";
import { countWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { Leaderboard } from "./Leaderboard";

function leadingBlanks(dateStr: string): number {
  const { year, month } = parseDate(dateStr);
  return new Date(year, month - 1, 1).getDay();
}

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
      <p className="page-description">Time, words, points. Not what the words were about.</p>

      <h2 className="page-h2">Today</h2>
      <div className="person-stat-row entry-stats" role="group" aria-label="Today’s words, time, pauses, pace, and points">
        <div className="stats-cell">
          <div className="stat-head">Words</div>
          <strong className="stat-hero" data-testid="stat-words">
            {words}
          </strong>
          <span className="stat-goal" data-testid="stat-goal">
            {done ? "Strike" : `${WORD_GOAL - words} to go`}
          </span>
        </div>
        <div className="stats-cell">
          <div className="stat-head">Active time</div>
          <strong className="stat-hero" data-testid="stat-time">
            {formatDuration(entry.session.activeMs)}
          </strong>
          <span className="stat-goal">this session</span>
        </div>
        <div className="stats-cell">
          <div className="stat-head">Breaks</div>
          <strong className="stat-hero" data-testid="stat-pauses">
            {entry.session.pauseCount}
          </strong>
          <span className="stat-goal">pauses</span>
        </div>
        <div className="stats-cell">
          <div className="stat-head">Words / min</div>
          <strong className="stat-hero" data-testid="stat-wpm">
            {wpm || "—"}
          </strong>
          <span className="stat-goal">pace</span>
        </div>
        <div className="stats-cell">
          <div className="stat-head">Points</div>
          <strong className="stat-hero" data-testid="stat-points">
            {entry.points}
          </strong>
          <span className="stat-goal">today</span>
        </div>
      </div>

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
        <div className="mini-calendar" data-testid="stats-month">
          <div className="calendar-grid">
            {Array.from({ length: monthDays[0] ? leadingBlanks(monthDays[0].date) : 0 }).map((_, i) => (
              <span key={`blank-${i}`} className="calendar-day isEmpty" />
            ))}
            {monthDays.map((day) => {
              const future = day.date > today;
              const cls = [
                "calendar-day",
                day.mark === "strike" ? "completed" : "",
                day.wordCount > 0 && day.mark !== "strike" ? "has-writing" : "",
                day.date === today ? "today" : "",
                future ? "future" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <button
                  key={day.date}
                  type="button"
                  className={cls}
                  data-mark={day.mark}
                  disabled={future}
                  title={`${day.date}: ${day.wordCount} words`}
                  aria-label={`${day.date}: ${day.wordCount} words`}
                  onClick={() => {
                    setDate(day.date);
                    router.push("/");
                  }}
                >
                  <span className="day-dot" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="score-bars" data-testid="word-bars">
          {monthDays.map((day) => (
            <span
              key={day.date}
              className={`score-bar ${day.wordCount >= WORD_GOAL ? "is-active" : ""}`}
              title={`${day.date}: ${day.wordCount} words`}
              style={{
                height: `${Math.min(100, (day.wordCount / WORD_GOAL) * 100)}%`,
              }}
            />
          ))}
        </div>
        <p className="muted">Words per day. Height is 500.</p>
      </section>

      <section>
        <h2 className="page-h2">All time</h2>
        <div className="person-stat-row lifetime-stats" data-testid="stat-alltime" role="group" aria-label="All-time words, days finished, and streak">
          <div className="stats-cell">
            <div className="stat-key">words</div>
            <div className="score">{lifetime?.totalWords ?? 0}</div>
          </div>
          <div className="stats-cell">
            <div className="stat-key">days finished</div>
            <div className="score">{lifetime?.completedEver ?? 0}</div>
          </div>
          <div className="stats-cell">
            <div className="stat-key">day streak</div>
            <div className="score">{lifetime?.currentStreak ?? 0}</div>
          </div>
        </div>
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
