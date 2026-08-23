"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BadgeArt } from "@/components/BadgeArt";
import { useApp } from "@/components/AppProvider";
import { BADGE_MAP } from "@/lib/badges";
import { monthKey, todayInZone } from "@/lib/dates";
import { isFirebaseConfigured } from "@/lib/firebase";
import { loadPublicPerson } from "@/lib/db";
import { publicScore } from "@/lib/engine";

type Score = ReturnType<typeof publicScore>;

export default function PersonPage() {
  const params = useParams<{ id: string }>();
  const { settings, user, profile, badges, monthDays, lifetime } = useApp();
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
      <main className="px-6 py-10">
        <p>No public stats for this person this month.</p>
      </main>
    );
  }

  if (!score) {
    return <main className="px-6 py-10 text-[var(--muted)]">Loading…</main>;
  }

  const earned = score.badgeIds
    .map((id) => BADGE_MAP[id])
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-georgia text-3xl">{score.displayName}</h1>
      <p className="mt-4 text-[16px] leading-relaxed" data-testid="person-score">
        {score.monthPoints} points this month · {score.daysCompleted}{" "}
        {score.daysCompleted === 1 ? "day" : "days"} of 500 · {score.monthWords} words · streak{" "}
        {score.streak}
      </p>
      {earned.length ? (
        <ul className="mt-8 flex flex-wrap gap-4" data-testid="person-badges">
          {earned.map((badge) => (
            <li key={badge.id}>
              <BadgeArt badge={badge} earned />
              <p className="mt-1 text-[13px]">{badge.name}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-6 text-[13px] text-[var(--muted)]">
        Writing stays private. This page is only the scoreboard.
      </p>
    </main>
  );
}
