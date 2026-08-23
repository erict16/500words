"use client";

import { BadgeArt } from "@/components/BadgeArt";
import { useApp } from "@/components/AppProvider";
import { BADGE_MAP } from "@/lib/badges";
import { datesInMonth, monthKey, monthLabel } from "@/lib/dates";
import { WORD_GOAL } from "@/lib/types";

export default function ChallengePage() {
  const { today, challenge, joinedChallenge, joinThisMonth, user } = useApp();
  const awesome = challenge.filter((p) => p.status === "won" || (p.status === "in" && p.missedDays === 0));
  const shame = challenge.filter((p) => p.status === "shame");
  const horse = BADGE_MAP["turquoise-horse"];
  const you = challenge.find((p) => p.uid === user?.uid);
  const monthDates = datesInMonth(monthKey(today));
  const daysLeft = monthDates.filter((d) => d >= today).length;

  return (
    <main className="page-wide">
      <div className="flex items-start gap-5">
        {horse ? <BadgeArt badge={horse} earned /> : null}
        <div>
          <h1 className="page-title">One month</h1>
          <p className="mt-3 max-w-xl text-[16px] leading-relaxed">
            Write {WORD_GOAL} words every day in {monthLabel(today)}. Free. Miss a day after you
            join and your name goes on the wall of shame. Finish the month: wall of awesomeness,
            and a turquoise horse. Days before you joined don’t count against you.
          </p>
        </div>
      </div>
      {!joinedChallenge ? (
        <button
          type="button"
          onClick={() => void joinThisMonth()}
          className="btn-ink mt-6"
          data-testid="join-challenge"
        >
          I’m in
        </button>
      ) : (
        <p className="mt-6 text-[15px]" data-testid="joined-challenge">
          You’re in this month.
        </p>
      )}
      {joinedChallenge ? (
        <p className="mt-2 text-[14px] text-[var(--muted)]" data-testid="challenge-progress">
          {you?.completedDays ?? 0} {(you?.completedDays ?? 0) === 1 ? "day" : "days"} done ·{" "}
          {daysLeft} left in {monthLabel(today)}. Days before you joined don’t count against you.
        </p>
      ) : null}

      <div className="walls mt-4">
        <section>
          <h2 className="page-h2">Wall of awesomeness</h2>
          {awesome.length === 0 ? (
            <p className="mt-2 text-[14px] text-[var(--muted)]">Nobody here yet.</p>
          ) : (
            <ul className="wall-list">
              {awesome.map((p) => (
                <li key={p.uid} className={p.uid === user?.uid ? "font-medium" : ""}>
                  {p.displayName} · {p.completedDays} days
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="page-h2">Wall of shame</h2>
          {shame.length === 0 ? (
            <p className="mt-2 text-[14px] text-[var(--muted)]">Empty. Keep it that way.</p>
          ) : (
            <ul className="wall-list">
              {shame.map((p) => (
                <li key={p.uid}>
                  {p.displayName} · missed {p.missedDays}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
