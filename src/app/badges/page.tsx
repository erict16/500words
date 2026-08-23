"use client";

import { BadgeArt } from "@/components/BadgeArt";
import { useApp } from "@/components/AppProvider";
import { BADGES } from "@/lib/badges";

const GROUPS: { ids: (typeof BADGES)[number]["group"][]; label: string; blurb: string }[] = [
  {
    ids: ["streak"],
    label: "Streak Badges",
    blurb:
      "Earn these badges by writing every day and building up an impressive streak. For the adventurous and daring ones out there with a fair amount of consistency in their lives.",
  },
  {
    ids: ["spirit"],
    label: "Spirit Badges",
    blurb:
      "If the streak badges don’t quite fit into your lifestyle, never fear! These badges are awarded when you complete 500 words on a bunch of days even if they aren’t in a row.",
  },
  {
    ids: ["habit"],
    label: "Badges for Showing Up",
    blurb:
      "If writing 500 words isn’t your jam, there’s still an enormous amount of value from sitting down and writing whatever amount you can. These badges will be awarded based on the number of days you showed up and wrote even a little bit.",
  },
  {
    ids: ["speed", "clock", "challenge"],
    label: "Behavior Badges",
    blurb:
      "For the badge-obsessed, these badges are awarded for extraordinary feats of speed, monthly challenges, early birds and night owls, and other quirky tests of spirit and gumption.",
  },
  {
    ids: ["words"],
    label: "Wordcount Badges",
    blurb:
      "After having a private journaling habit for a while, you may be surprised at how many words you’re racking up over time. These badges will help bring attention to your impressive milestones as you pass them.",
  },
];

export default function BadgesPage() {
  const { badges, newBadges } = useApp();
  const earned = new Set(badges.map((b) => b.id));

  return (
    <main className="page site-col" id="badges-info">
      <h1 className="page-title">Badges</h1>
      <p className="page-description">
        Badges are mysterious and colorful artifacts sprinkled across 500 Words. They just showed up
        one day and seem to have no intentions of going away. Nobody can quite explain why they
        sometimes inspire people to write, but some hypothesize that they come from an arcane magic
        that mustn’t be trifled with. There’s a growing sentiment amongst some that they’re kinda
        cute and silly. Here’s an incomplete and frequently outdated list of what we know about
        them.
      </p>
      {newBadges.length ? (
        <p className="page-kicker" data-testid="new-badges">
          New: {newBadges.join(", ")}
        </p>
      ) : null}
      {GROUPS.map((group) => (
        <section key={group.label} className="badge-section">
          <h2 className="page-h2 section-title">{group.label}</h2>
          <p className="section-description">{group.blurb}</p>
          <ul className="badge-grid">
            {BADGES.filter((b) => group.ids.includes(b.group)).map((badge) => {
              const got = earned.has(badge.id);
              const when = badges.find((b) => b.id === badge.id);
              return (
                <li
                  key={badge.id}
                  data-testid={`badge-${badge.id}`}
                  className={`badge-card ${got ? "is-earned" : "is-dim"}`}
                >
                  <div className="badge-image-container">
                    <BadgeArt badge={badge} earned={got} />
                    {got ? (
                      <span className="earned-checkmark" aria-hidden>
                        <svg viewBox="0 0 16 16" width="18" height="18">
                          <path
                            d="M3.2 8.4 6.1 11.2 12.8 4.4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </div>
                  <div className="badge-copy">
                    <h3 className="badge-title">{badge.name}</h3>
                    <p className="badge-subtitle">{badge.how}</p>
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
