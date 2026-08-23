import type { BadgeDef } from "@/lib/badges";
import type { ReactNode } from "react";

type Palette = {
  ink: string;
  wash: string;
  accent: string;
  paper: string;
  warm: string;
};

function pal(earned: boolean): Palette {
  return earned
    ? {
        ink: "#2a241c",
        wash: "#f4ead8",
        accent: "#2bbbad",
        paper: "#fffaf3",
        warm: "#c45c26",
      }
    : {
        ink: "#c8c8c8",
        wash: "#f3f3f3",
        accent: "#d8d8d8",
        paper: "#fafafa",
        warm: "#d0d0d0",
      };
}

function Egg({ p }: { p: Palette }) {
  return (
    <>
      <ellipse cx="40" cy="46" rx="16" ry="20" fill={p.paper} stroke={p.ink} strokeWidth="1.8" />
      <path d="M32 38c3 2 6-2 9 1 2 2 5 1 7-1" fill="none" stroke={p.ink} strokeWidth="1.2" />
      <ellipse cx="34" cy="50" rx="3" ry="2" fill={p.accent} opacity="0.7" />
    </>
  );
}

function Turkey({ p }: { p: Palette }) {
  return (
    <>
      <path d="M18 42c0-14 10-24 22-24 4 0 10 4 14 10 6 8 4 18-2 22" fill={p.warm} stroke={p.ink} strokeWidth="1.6" />
      <path d="M22 40c-6-8-4-18 4-22M30 36c-4-10 0-18 8-20M40 36c2-10 10-16 16-14" fill="none" stroke={p.ink} strokeWidth="1.5" />
      <ellipse cx="44" cy="48" rx="12" ry="10" fill={p.paper} stroke={p.ink} strokeWidth="1.6" />
      <circle cx="50" cy="46" r="1.6" fill={p.ink} />
      <path d="M54 48l6 2M44 58v8M40 68h10" stroke={p.ink} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M54 50c4 2 4 6 0 7" fill={p.accent} stroke={p.ink} strokeWidth="1" />
    </>
  );
}

function Penguin({ p }: { p: Palette }) {
  return (
    <>
      <ellipse cx="40" cy="42" rx="16" ry="22" fill={p.ink} />
      <ellipse cx="40" cy="48" rx="9" ry="14" fill={p.paper} />
      <circle cx="34" cy="34" r="2" fill={p.paper} />
      <circle cx="46" cy="34" r="2" fill={p.paper} />
      <circle cx="34" cy="34" r="0.9" fill={p.ink} />
      <circle cx="46" cy="34" r="0.9" fill={p.ink} />
      <path d="M40 36l6 4h-12z" fill={p.warm} />
      <path d="M24 50c-6 4-8 10-4 12M56 50c6 4 8 10 4 12" fill={p.ink} />
      <path d="M32 66h16" stroke={p.warm} strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

function Flamingo({ p }: { p: Palette }) {
  const pink = p.ink === "#c8c8c8" ? p.wash : "#e8899a";
  return (
    <>
      <path d="M48 18c8 2 14 12 8 20-6 6-14 6-16 2" fill={pink} stroke={p.ink} strokeWidth="1.6" />
      <path d="M40 36c2 10 4 22 2 34" fill="none" stroke={p.ink} strokeWidth="2" />
      <ellipse cx="36" cy="48" rx="12" ry="8" fill={pink} stroke={p.ink} strokeWidth="1.6" />
      <path d="M42 70c-2 4 4 6 8 2" fill="none" stroke={p.ink} strokeWidth="1.6" />
      <circle cx="56" cy="24" r="1.4" fill={p.ink} />
    </>
  );
}

function Albatross({ p }: { p: Palette }) {
  return (
    <>
      <path
        d="M8 44c18-16 24-18 32-18s14 2 32 18"
        fill="none"
        stroke={p.ink}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse cx="40" cy="44" rx="8" ry="5" fill={p.paper} stroke={p.ink} strokeWidth="1.4" />
      <path d="M48 44l8-2" stroke={p.ink} strokeWidth="1.4" />
      <circle cx="44" cy="42" r="1" fill={p.ink} />
    </>
  );
}

function Phoenix({ p }: { p: Palette }) {
  return (
    <>
      <path d="M40 66V28" stroke={p.warm} strokeWidth="2" />
      <path
        d="M40 30c-12 4-20 16-22 24 8-4 16-14 22-18 6 4 14 14 22 18-2-8-10-20-22-24z"
        fill={p.warm}
        stroke={p.ink}
        strokeWidth="1.5"
      />
      <path d="M28 22c6 6 10 6 12 2 2 4 6 4 12-2" fill="none" stroke={p.warm} strokeWidth="1.8" />
      <circle cx="40" cy="36" r="2" fill={p.paper} />
    </>
  );
}

function Pterodactyl({ p }: { p: Palette }) {
  return (
    <>
      <path d="M8 48c16-20 28-22 32-12 4-10 16-8 32 12" fill={p.accent} stroke={p.ink} strokeWidth="1.6" />
      <path d="M40 36v16" stroke={p.ink} strokeWidth="1.8" />
      <path d="M40 36c8-8 16-6 18-2" fill="none" stroke={p.ink} strokeWidth="1.6" />
      <circle cx="44" cy="34" r="1.2" fill={p.ink} />
    </>
  );
}

function Spacebird({ p }: { p: Palette }) {
  return (
    <>
      <circle cx="40" cy="40" r="22" fill="none" stroke={p.ink} strokeWidth="1.2" strokeDasharray="3 4" />
      <path d="M24 46c8-16 24-16 32 0" fill={p.paper} stroke={p.ink} strokeWidth="1.6" />
      <circle cx="40" cy="34" r="7" fill={p.accent} stroke={p.ink} strokeWidth="1.4" />
      <circle cx="40" cy="34" r="3" fill={p.paper} />
      <circle cx="18" cy="22" r="1.2" fill={p.ink} />
      <circle cx="62" cy="26" r="1" fill={p.ink} />
      <circle cx="58" cy="58" r="1.1" fill={p.ink} />
    </>
  );
}

function Cheetah({ p }: { p: Palette }) {
  const coat = p.ink === "#c8c8c8" ? p.wash : "#d4a04a";
  return (
    <>
      <path d="M12 50c8-14 20-18 28-10 4-8 16-10 24-2 2 8-6 14-14 12-2 6-8 10-14 8-8 2-18 0-24-8z" fill={coat} stroke={p.ink} strokeWidth="1.5" />
      <circle cx="58" cy="34" r="5" fill={coat} stroke={p.ink} strokeWidth="1.4" />
      <circle cx="60" cy="32" r="0.9" fill={p.ink} />
      <circle cx="28" cy="46" r="1.4" fill={p.ink} />
      <circle cx="38" cy="42" r="1.2" fill={p.ink} />
      <circle cx="46" cy="48" r="1.3" fill={p.ink} />
      <path d="M62 36l8-4" stroke={p.ink} strokeWidth="1.3" />
    </>
  );
}

function NightBat({ p }: { p: Palette }) {
  return (
    <>
      <path d="M10 44c12 14 18-10 30-10s18 24 30 10c-8 16-20 20-30 12-10 8-22 4-30-12z" fill={p.ink} />
      <circle cx="36" cy="40" r="1.6" fill={p.paper} />
      <circle cx="44" cy="40" r="1.6" fill={p.paper} />
    </>
  );
}

function EarlyBird({ p }: { p: Palette }) {
  return (
    <>
      <circle cx="56" cy="22" r="8" fill={p.warm} opacity="0.85" />
      <path d="M18 52c10-20 34-20 44 0-8 8-18 10-22 4-4 6-14 4-22-4z" fill={p.paper} stroke={p.ink} strokeWidth="1.6" />
      <circle cx="48" cy="44" r="1.4" fill={p.ink} />
      <path d="M54 46l8 2" stroke={p.ink} strokeWidth="1.5" />
    </>
  );
}

function Hamster({ p }: { p: Palette }) {
  return (
    <>
      <circle cx="28" cy="32" r="8" fill={p.accent} stroke={p.ink} strokeWidth="1.4" />
      <circle cx="52" cy="32" r="8" fill={p.accent} stroke={p.ink} strokeWidth="1.4" />
      <ellipse cx="40" cy="44" rx="18" ry="16" fill={p.accent} stroke={p.ink} strokeWidth="1.6" />
      <circle cx="34" cy="42" r="2" fill={p.ink} />
      <circle cx="46" cy="42" r="2" fill={p.ink} />
      <ellipse cx="40" cy="50" rx="4" ry="3" fill={p.paper} />
    </>
  );
}

function Oxalis({ p }: { p: Palette }) {
  return (
    <>
      <path d="M40 40c-10-16-22-10-16 2 6 8 14 6 16-2z" fill={p.accent} stroke={p.ink} strokeWidth="1.3" />
      <path d="M40 40c-14 10-6 22 6 16 8-6 4-14-6-16z" fill={p.accent} stroke={p.ink} strokeWidth="1.3" />
      <path d="M40 40c14 10 22-4 10-14-8-6-14-2-10 14z" fill={p.accent} stroke={p.ink} strokeWidth="1.3" />
      <path d="M40 40v22" stroke={p.ink} strokeWidth="1.5" />
    </>
  );
}

function Horse({ p }: { p: Palette }) {
  const coat = p.ink === "#c8c8c8" ? p.wash : "#2bbbad";
  return (
    <>
      <path d="M18 56c4-18 16-28 30-20 2 2 4 8 2 12-8 4-12 8-12 16v8" fill={coat} stroke={p.ink} strokeWidth="1.6" />
      <path d="M44 36c8-8 16-6 18 0 0 6-6 10-10 10" fill={coat} stroke={p.ink} strokeWidth="1.5" />
      <path d="M38 72v-10M26 72v-8" stroke={p.ink} strokeWidth="1.8" />
      <circle cx="56" cy="34" r="1.2" fill={p.ink} />
      <path d="M48 24c2 6-2 10-6 10" fill="none" stroke={p.ink} strokeWidth="1.4" />
    </>
  );
}

function BookBeast({ p, kind }: { p: Palette; kind: string }) {
  const titles: Record<string, string> = {
    novella: "10k",
    "short-story": "25k",
    novel: "50k",
    anthology: "100k",
    sequel: "250k",
    library: "500k",
  };
  return (
    <>
      <rect x="22" y="24" width="36" height="28" rx="2" fill={p.paper} stroke={p.ink} strokeWidth="1.6" />
      <path d="M22 32h36M30 24v28" stroke={p.ink} strokeWidth="1.2" />
      <path d="M18 54h44l-4 10H22z" fill={p.accent} stroke={p.ink} strokeWidth="1.4" />
      <text x="40" y="46" textAnchor="middle" fontSize="9" fill={p.ink} fontFamily="Georgia, serif">
        {titles[kind] ?? ""}
      </text>
    </>
  );
}

const DRAW: Record<string, (p: Palette) => ReactNode> = {
  egg: (p) => <Egg p={p} />,
  turkey: (p) => <Turkey p={p} />,
  penguin: (p) => <Penguin p={p} />,
  flamingo: (p) => <Flamingo p={p} />,
  albatross: (p) => <Albatross p={p} />,
  phoenix: (p) => <Phoenix p={p} />,
  pterodactyl: (p) => <Pterodactyl p={p} />,
  spacebird: (p) => <Spacebird p={p} />,
  cheetah: (p) => <Cheetah p={p} />,
  "night-bat": (p) => <NightBat p={p} />,
  "early-bird": (p) => <EarlyBird p={p} />,
  hamster: (p) => <Hamster p={p} />,
  oxalis: (p) => <Oxalis p={p} />,
  "turquoise-horse": (p) => <Horse p={p} />,
};

export function BadgeArt({ badge, earned }: { badge: BadgeDef; earned: boolean }) {
  const p = pal(earned);
  const spirit = badge.id.startsWith("spirit-");
  const key = badge.id.replace(/^spirit-/, "");
  const body = DRAW[key]?.(p) ?? <BookBeast p={p} kind={key} />;
  return (
    <svg viewBox="0 0 80 80" width="96" height="96" aria-hidden data-badge={badge.id} data-earned={earned ? "1" : "0"}>
      <rect x="4" y="4" width="72" height="72" rx="6" fill={p.wash} stroke={spirit ? p.ink : "none"} strokeDasharray={spirit ? "3 3" : undefined} />
      <g opacity={spirit ? 0.7 : 1}>{body}</g>
    </svg>
  );
}
