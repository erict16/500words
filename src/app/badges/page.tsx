"use client";

import { BadgeArt } from "@/components/BadgeArt";
import { useApp } from "@/components/AppProvider";
import { BADGES } from "@/lib/badges";

const GROUPS: { id: (typeof BADGES)[number]["group"]; label: string }[] = [
  { id: "habit", label: "Showing up" },
  { id: "streak", label: "Streaks" },
  { id: "spirit", label: "Spirit animals" },
  { id: "speed", label: "Speed" },
  { id: "clock", label: "Clock" },
  { id: "words", label: "Words" },
  { id: "challenge", label: "Challenge" },
];

export default function BadgesPage() {
  const { badges, newBadges } = useApp();
  const earned = new Set(badges.map((b) => b.id));

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="font-georgia text-3xl">Badges</h1>
      <p className="mt-2 text-[14px] text-[var(--muted)]">
        Little animals for showing up. They don’t mean you’re a good writer. They mean you wrote.
      </p>
      {newBadges.length ? (
        <p className="mt-4 text-[15px]" data-testid="new-badges">
          New: {newBadges.join(", ")}
        </p>
      ) : null}
      {GROUPS.map((group) => (
        <section key={group.id} className="mt-10">
          <h2 className="font-georgia text-xl">{group.label}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {BADGES.filter((b) => b.group === group.id).map((badge) => {
              const got = earned.has(badge.id);
              const when = badges.find((b) => b.id === badge.id);
              return (
                <li key={badge.id} data-testid={`badge-${badge.id}`} className={got ? "" : "opacity-80"}>
                  <BadgeArt badge={badge} earned={got} />
                  <h3 className="mt-2 text-[15px]">{badge.name}</h3>
                  <p className="text-[13px] text-[var(--muted)]">{badge.how}</p>
                  {when ? (
                    <p className="mt-1 text-[12px] text-[var(--muted)]">
                      {new Date(when.earnedAt).toLocaleDateString()}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
