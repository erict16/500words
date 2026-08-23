"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BadgeArt } from "@/components/BadgeArt";
import { useApp } from "@/components/AppProvider";
import { BADGE_MAP } from "@/lib/badges";
import { monthKey, parseDate, todayInZone } from "@/lib/dates";
import { isFirebaseConfigured } from "@/lib/firebase";
import { loadPublicPerson } from "@/lib/db";
import { publicScore } from "@/lib/engine";

type Score = ReturnType<typeof publicScore>;

export default function PersonPage() {
  const params = useParams<{ id: string }>();
  const { settings, user, profile, badges, monthDays, lifetime, today } = useApp();
  const self = Boolean(user && user.uid === params.id);
  const [row, setRow] = useState<Record<string, unknown> | null>(null);
  const [missing, setMissing] = useState(false);

  const selfScore: Score | null = useMemo(() => {
    if (!self) return null;
    return publicScore({
      displayName: profile?.displayName || "You",
      monthDays,
      streak: lifetime?.currentStreak ?? 0,
      badges,
    });
  }, [self, profile?.displayName, monthDays, lifetime?.currentStreak, badges]);

  useEffect(() => {
    if (self) return;
    if (!isFirebaseConfigured()) return;
    const month = monthKey(todayInZone(settings.timezone));
    void loadPublicPerson(month, params.id).then((data) => {
      if (!data) setMissing(true);
      else setRow(data);
    });
  }, [params.id, settings.timezone, self]);

  const score: Score | null = selfScore
    ? selfScore
    : row
      ? {
          displayName: String(row.displayName || "Anonymous"),
          monthPoints: Number(row.monthPoints ?? 0),
          monthWords: Number(row.monthWords ?? 0),
          daysStarted: Number(row.daysStarted ?? 0),
          daysCompleted: Number(row.daysCompleted ?? 0),
          streak: Number(row.streak ?? 0),
          badgeIds: Array.isArray(row.badgeIds) ? (row.badgeIds as string[]) : [],
        }
      : null;

  if (!self && (missing || !isFirebaseConfigured())) {
    return (
      <main className="page site-col">
        <p className="notice">No public stats for this person this month.</p>
      </main>
    );
  }

  if (!score) {
    return (
      <main className="page site-col" data-testid="person-waiting">
        <p className="notice">Looking up this month’s score…</p>
      </main>
    );
  }

  const earned = score.badgeIds
    .map((id) => BADGE_MAP[id])
    .filter((b): b is NonNullable<typeof b> => Boolean(b));
  const todayParts = parseDate(today);
  const monthName = new Date(todayParts.year, todayParts.month - 1, 1)
    .toLocaleString("en-US", { month: "long" })
    .toUpperCase();

  return (
    <main className="page site-col" id="handle-info">
      <div className="persons-header">
        <h1 className="page-title">{score.displayName}</h1>
      </div>
      <p className="person-kicker">DAY {todayParts.day} OF {monthName}</p>
      <p className="person-summary" data-testid="person-score">
        {score.daysStarted ? (
          <>
            This month, <strong>{score.displayName}</strong> has written {score.monthWords} words,
            started writing on {score.daysStarted} {score.daysStarted === 1 ? "day" : "days"}, and
            completed 500 words on {score.daysCompleted}{" "}
            {score.daysCompleted === 1 ? "day" : "days"}.
          </>
        ) : (
          <>
            <strong>{score.displayName}</strong> hasn’t written this month… yet.
          </>
        )}
      </p>
      <div className="person-stat-row" data-testid="person-stats">
        <div className="stats-cell">
          <div className="stat-key">Days of 500</div>
          <div className="score">{score.daysCompleted}</div>
        </div>
        <div className="stats-cell">
          <div className="stat-key">Words</div>
          <div className="score">{score.monthWords}</div>
        </div>
        <div className="stats-cell">
          <div className="stat-key">Streak</div>
          <div className="score">{score.streak}</div>
        </div>
      </div>
      {earned.length ? (
        <section>
          <h2 className="badge-group-label">CURRENT BADGES</h2>
          <ul className="badge-sheet" data-testid="person-badges">
            {earned.map((badge) => (
              <li key={badge.id} className="badge-tile">
                <BadgeArt badge={badge} earned />
                <h3>{badge.name}</h3>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <p className="page-kicker">Writing stays private. This page is only the scoreboard.</p>
    </main>
  );
}
