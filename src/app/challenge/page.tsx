"use client";

import { useApp } from "@/components/AppProvider";
import { monthLabel } from "@/lib/dates";
import { WORD_GOAL } from "@/lib/types";

export default function ChallengePage() {
  const { today, challenge, joinedChallenge, joinThisMonth, user } = useApp();
  const awesome = challenge.filter((p) => p.status === "won" || (p.status === "in" && p.missedDays === 0));
  const shame = challenge.filter((p) => p.status === "shame");

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-georgia text-3xl">One month challenge</h1>
      <p className="mt-3 text-[16px] leading-relaxed">
        Write {WORD_GOAL} words every day in {monthLabel(today)}. Free. If you miss
        a day your name goes on the wall of shame. If you finish the month, wall
        of awesomeness, and a turquoise horse.
      </p>
      {!joinedChallenge ? (
        <button
          type="button"
          onClick={() => void joinThisMonth()}
          className="mt-6 border border-[var(--ink)] bg-[var(--ink)] px-4 py-2 text-[14px] text-[var(--paper)] active:scale-[0.97]"
        >
          I’m in
        </button>
      ) : (
        <p className="mt-6 text-[15px]">You’re in this month.</p>
      )}

      <section className="mt-10">
        <h2 className="font-georgia text-2xl">Wall of awesomeness</h2>
        {awesome.length === 0 ? (
          <p className="mt-2 text-[14px] text-[var(--muted)]">Nobody here yet.</p>
        ) : (
          <ul className="mt-3 space-y-1">
            {awesome.map((p) => (
              <li key={p.uid} className={p.uid === user?.uid ? "font-medium" : ""}>
                {p.displayName} · {p.completedDays} days
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-georgia text-2xl">Wall of shame</h2>
        {shame.length === 0 ? (
          <p className="mt-2 text-[14px] text-[var(--muted)]">Empty. Keep it that way.</p>
        ) : (
          <ul className="mt-3 space-y-1">
            {shame.map((p) => (
              <li key={p.uid}>
                {p.displayName} · missed {p.missedDays}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
