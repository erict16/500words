"use client";

import { BadgeArt } from "@/components/BadgeArt";
import { useApp } from "@/components/AppProvider";
import { BADGES } from "@/lib/badges";

export default function BadgesPage() {
  const { badges, newBadges } = useApp();
  const earned = new Set(badges.map((b) => b.id));

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="font-georgia text-3xl">Badges</h1>
      <p className="mt-2 text-[14px] text-[var(--muted)]">
        Little animals for showing up. They don’t mean you’re a good writer.
        They mean you wrote.
      </p>
      {newBadges.length ? (
        <p className="mt-4 text-[15px]">New: {newBadges.join(", ")}</p>
      ) : null}
      <ul className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
        {BADGES.map((badge) => {
          const got = earned.has(badge.id);
          const when = badges.find((b) => b.id === badge.id);
          return (
            <li key={badge.id} className={got ? "" : "opacity-70"}>
              <BadgeArt badge={badge} earned={got} />
              <h2 className="mt-2 text-[15px]">{badge.name}</h2>
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
    </main>
  );
}
