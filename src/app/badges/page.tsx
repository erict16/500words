"use client";

import { BadgeArt } from "@/components/BadgeArt";
import { useApp } from "@/components/AppProvider";
import { BADGES } from "@/lib/badges";

const GROUPS: { ids: (typeof BADGES)[number]["group"][]; label: string }[] = [
  { ids: ["streak"], label: "Streak badges" },
  { ids: ["spirit"], label: "Spirit animals" },
  { ids: ["speed", "clock", "challenge"], label: "Behavior badges" },
  { ids: ["habit"], label: "Showing up" },
  { ids: ["words"], label: "Word count" },
];

export default function BadgesPage() {
  const { badges, newBadges } = useApp();
  const earned = new Set(badges.map((b) => b.id));

  return (
    <main className="page site-col">
      <h1 className="page-title">Badges</h1>
      <p className="subdued">
        Here’s an incomplete and frequently outdated annotated list. Little animals for showing up.
        They don’t mean you’re a good writer. They mean you wrote.
      </p>
      {newBadges.length ? (
        <p className="page-kicker" data-testid="new-badges">
          New: {newBadges.join(", ")}
        </p>
      ) : null}
      {GROUPS.map((group) => (
        <section key={group.label}>
          <h2 className="page-h2">{group.label}</h2>
          <ul className="badge-list">
            {BADGES.filter((b) => group.ids.includes(b.group)).map((badge) => {
              const got = earned.has(badge.id);
              const when = badges.find((b) => b.id === badge.id);
              return (
                <li
                  key={badge.id}
                  data-testid={`badge-${badge.id}`}
                  className={`badge-row ${got ? "" : "is-dim"}`}
                >
                  <BadgeArt badge={badge} earned={got} />
                  <div className="badge-copy">
                    <h3>{badge.name}</h3>
                    <p>{badge.how}</p>
                    {when ? (
                      <p className="badge-when">{new Date(when.earnedAt).toLocaleDateString()}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
