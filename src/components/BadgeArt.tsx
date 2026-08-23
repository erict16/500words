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
        wash: "#f3e6c8",
        accent: "#2bbbad",
        paper: "#fffaf1",
        warm: "#c45c26",
      }
    : {
        ink: "#bdbdbd",
        wash: "#efefef",
        accent: "#d4d4d4",
        paper: "#f7f7f7",
        warm: "#d0d0d0",
      };
}

function hue(earned: boolean, color: string) {
  return earned ? color : "#cfcfcf";
}

function Grain({ p }: { p: Palette }) {
  const dots = [
    [9, 14],
    [18, 11],
    [27, 16],
    [48, 10],
    [63, 13],
    [71, 22],
    [12, 38],
    [70, 41],
    [8, 58],
    [21, 68],
    [55, 70],
    [68, 62],
    [74, 54],
    [15, 72],
    [42, 8],
    [33, 73],
    [11, 24],
    [59, 12],
    [73, 33],
    [6, 47],
    [22, 9],
    [51, 74],
    [38, 71],
    [66, 68],
  ];
  return (
    <g opacity="0.22" fill={p.ink}>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 0.7 : 0.45} />
      ))}
    </g>
  );
}

function Hatch({ p, d }: { p: Palette; d: string }) {
  return <path d={d} fill="none" stroke={p.ink} strokeWidth="0.45" opacity="0.28" />;
}

function Paper({ p, spirit }: { p: Palette; spirit: boolean }) {
  return (
    <>
      <path
        d="M6 4h67c2 0 4 2 4 5v62c0 3-2 6-5 6H8c-3 0-5-3-5-6V9c0-3 2-5 3-5z"
        fill={p.wash}
      />
      <rect
        x="3.2"
        y="3.2"
        width="73.6"
        height="73.6"
        rx="3"
        fill="none"
        stroke={p.ink}
        strokeWidth={spirit ? 0.9 : 0.35}
        strokeDasharray={spirit ? "2.4 2.1" : undefined}
        opacity={spirit ? 0.85 : 0.28}
      />
      <Grain p={p} />
    </>
  );
}

function Egg({ p, earned }: { p: Palette; earned: boolean }) {
  const shell = hue(earned, "#f7efd6");
  const nest = hue(earned, "#8a5a32");
  return (
    <>
      <ellipse cx="40" cy="62" rx="22" ry="6" fill={p.ink} opacity="0.08" />
      <path
        d="M16 58c6-8 10-6 14-2 3-6 8-8 12-2 4-7 10-6 14 0 5-5 12-6 16 3-8 6-18 10-28 10-12 0-22-3-28-9z"
        fill={nest}
        opacity="0.55"
      />
      <path
        d="M18 57c8 4 16 7 22 7s16-2 24-7"
        fill="none"
        stroke={p.ink}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M22 56l4 8M30 54l3 10M38 54v10M48 54l-3 10M56 56l-5 8" stroke={p.ink} strokeWidth="1.05" />
      <ellipse cx="40" cy="40" rx="15" ry="19" fill={shell} />
      <ellipse cx="40" cy="40" rx="15" ry="19" fill={p.warm} opacity="0.12" />
      <path
        d="M40 21c9 2 16 10 16 19 0 10-7 19-16 19s-16-9-16-19c0-9 7-17 16-19z"
        fill="none"
        stroke={p.ink}
        strokeWidth="1.5"
      />
      <path d="M33 30c6-8 14-6 16 2" fill="none" stroke={p.paper} strokeWidth="2.2" opacity="0.7" />
      <ellipse cx="34" cy="44" rx="3.2" ry="2.2" fill={p.accent} opacity="0.55" />
      <ellipse cx="46" cy="38" rx="2.2" ry="1.6" fill={p.warm} opacity="0.45" />
      <circle cx="43" cy="50" r="1.3" fill={p.ink} opacity="0.35" />
    </>
  );
}

function Turkey({ p, earned }: { p: Palette; earned: boolean }) {
  const rust = hue(earned, "#c45c26");
  const gold = hue(earned, "#d9a441");
  const copper = hue(earned, "#a33b1c");
  return (
    <>
      <ellipse cx="40" cy="66" rx="16" ry="4" fill={p.ink} opacity="0.08" />
      <path d="M40 44c-16-2-26-16-22-28 8 4 14 12 18 22 2-12 10-22 22-26-2 14-6 24-18 32z" fill={gold} opacity="0.85" />
      <path d="M22 28c-6-10 2-20 12-18" fill="none" stroke={copper} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M30 24c-2-14 12-20 18-12" fill="none" stroke={rust} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M40 22c4-12 18-14 22-4" fill="none" stroke={gold} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M48 26c10-10 22-4 20 8" fill="none" stroke={copper} strokeWidth="3" strokeLinecap="round" />
      <path d="M18 36c-8-8-6-20 6-22" fill="none" stroke={p.ink} strokeWidth="1.15" />
      <path d="M28 30c-4-14 6-22 16-16" fill="none" stroke={p.ink} strokeWidth="1.15" />
      <path d="M40 28c2-14 16-18 22-8" fill="none" stroke={p.ink} strokeWidth="1.15" />
      <path d="M52 32c8-12 20-8 18 4" fill="none" stroke={p.ink} strokeWidth="1.15" />
      <ellipse cx="42" cy="50" rx="13" ry="11" fill={hue(earned, "#6b3a1e")} />
      <ellipse cx="42" cy="50" rx="13" ry="11" fill="none" stroke={p.ink} strokeWidth="1.4" />
      <path d="M52 46c8-2 12 2 10 8-4 2-8 2-12 0" fill={hue(earned, "#4a2a14")} stroke={p.ink} strokeWidth="1.1" />
      <circle cx="56" cy="46" r="1.5" fill={p.paper} />
      <circle cx="56.4" cy="46" r="0.7" fill={p.ink} />
      <path d="M62 47c4 0 6 2 4 5" fill={p.warm} stroke={p.ink} strokeWidth="0.9" />
      <path d="M60 50c3 2 2 6-2 6" fill={hue(earned, "#c0392b")} stroke={p.ink} strokeWidth="0.8" />
      <path d="M36 60v10M46 60v10" stroke={p.ink} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 70h10M42 70h10" stroke={p.ink} strokeWidth="1.5" strokeLinecap="round" />
      <Hatch p={p} d="M26 40l4 6M32 36l5 7M38 34l4 8M46 34l3 7" />
    </>
  );
}

function Penguin({ p, earned }: { p: Palette; earned: boolean }) {
  const black = hue(earned, "#1b1b1b");
  const orange = hue(earned, "#e07a2f");
  const tie = hue(earned, "#2bbbad");
  return (
    <>
      <ellipse cx="40" cy="68" rx="14" ry="3.5" fill={p.ink} opacity="0.1" />
      <path d="M26 50c-7 6-10 14-4 16 2 0 4-2 6-6" fill={black} />
      <path d="M54 50c7 6 10 14 4 16-2 0-4-2-6-6" fill={black} />
      <ellipse cx="40" cy="42" rx="16" ry="22" fill={black} />
      <ellipse cx="40" cy="48" rx="10" ry="15" fill={p.paper} />
      <ellipse cx="34" cy="32" rx="3.2" ry="3.6" fill={p.paper} />
      <ellipse cx="46" cy="32" rx="3.2" ry="3.6" fill={p.paper} />
      <circle cx="34.5" cy="32.5" r="1.15" fill={p.ink} />
      <circle cx="46.5" cy="32.5" r="1.15" fill={p.ink} />
      <path d="M40 35l7 5h-14z" fill={orange} stroke={p.ink} strokeWidth="0.6" />
      <path d="M36 44h8l-4 7z" fill={tie} stroke={p.ink} strokeWidth="0.8" />
      <path d="M32 43h16" stroke={tie} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 66h20" stroke={orange} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M24 66c-2 4 2 6 6 4M56 66c2 4-2 6-6 4" fill="none" stroke={orange} strokeWidth="1.4" />
    </>
  );
}

function Flamingo({ p, earned }: { p: Palette; earned: boolean }) {
  const pink = hue(earned, "#e8899a");
  const deep = hue(earned, "#d45d74");
  return (
    <>
      <ellipse cx="36" cy="70" rx="12" ry="3" fill={p.ink} opacity="0.08" />
      <path d="M38 40c1 10 2 22 0 30" fill="none" stroke={p.ink} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M38 70c-1 4 6 6 10 1" fill="none" stroke={p.ink} strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="34" cy="46" rx="13" ry="8.5" fill={pink} />
      <ellipse cx="34" cy="46" rx="13" ry="8.5" fill="none" stroke={p.ink} strokeWidth="1.35" />
      <path
        d="M44 40c2-10 8-18 16-20 8-1 12 8 6 14-5 6-12 8-18 6"
        fill={deep}
        stroke={p.ink}
        strokeWidth="1.3"
      />
      <path d="M60 22c4-1 8 2 7 6-4 1-7 0-9-2" fill={pink} stroke={p.ink} strokeWidth="1" />
      <path d="M66 26c5 1 7 4 3 6" fill="none" stroke={p.ink} strokeWidth="1.2" />
      <circle cx="62" cy="22" r="1.15" fill={p.ink} />
      <path d="M24 48c-6 4-6 10 0 8" fill={deep} opacity="0.7" />
      <Hatch p={p} d="M28 44h8M30 48h6" />
    </>
  );
}

function Albatross({ p, earned }: { p: Palette; earned: boolean }) {
  const wing = hue(earned, "#efe6d2");
  const tip = hue(earned, "#6d6558");
  return (
    <>
      <path d="M6 46c16-18 26-22 34-16 8-6 18-4 34 16" fill={wing} stroke={p.ink} strokeWidth="1.5" />
      <path d="M10 46c12-10 20-12 30-8" fill="none" stroke={tip} strokeWidth="2.2" opacity="0.5" />
      <path d="M70 46c-12-10-20-12-30-8" fill="none" stroke={tip} strokeWidth="2.2" opacity="0.5" />
      <ellipse cx="40" cy="44" rx="9" ry="6" fill={p.paper} stroke={p.ink} strokeWidth="1.25" />
      <path d="M48 44c8-1 12-4 14-2-2 3-8 5-14 4" fill={hue(earned, "#e0b84a")} stroke={p.ink} strokeWidth="0.9" />
      <circle cx="44" cy="42" r="1.1" fill={p.ink} />
      <path d="M36 50c0 6 4 10 8 8" fill="none" stroke={p.ink} strokeWidth="1.1" />
      <path d="M18 44c8 2 14 2 22 0M58 44c-8 2-14 2-18 0" fill="none" stroke={p.ink} strokeWidth="0.7" opacity="0.5" />
    </>
  );
}

function Phoenix({ p, earned }: { p: Palette; earned: boolean }) {
  const gold = hue(earned, "#e6a322");
  const flame = hue(earned, "#d94b1f");
  const ember = hue(earned, "#f0c96a");
  return (
    <>
      <path d="M40 70c-10-2-16-10-14-16 6 4 10 8 14 16 4-8 8-12 14-16-2 6-4 14-14 16z" fill={flame} opacity="0.85" />
      <path d="M28 54c-10 2-16 10-12 16 8-4 14-8 18-16" fill={gold} opacity="0.8" />
      <path d="M52 54c10 2 16 10 12 16-8-4-14-8-18-16" fill={gold} opacity="0.8" />
      <path
        d="M40 28c-12 6-20 18-20 28 8-6 16-16 20-24 4 8 12 18 20 24 0-10-8-22-20-28z"
        fill={ember}
        stroke={p.ink}
        strokeWidth="1.35"
      />
      <path d="M40 30c-4-12-14-16-18-10 8 2 14 8 18 16 4-8 10-14 18-16-4-6-14-2-18 10z" fill={flame} />
      <path d="M22 22c8 4 12 8 14 14M58 22c-8 4-12 8-14 14" fill="none" stroke={p.ink} strokeWidth="1.15" />
      <circle cx="40" cy="38" r="2.2" fill={p.paper} stroke={p.ink} strokeWidth="0.8" />
      <circle cx="40" cy="38" r="0.7" fill={p.ink} />
      <path d="M40 20l2 6h-4z" fill={gold} stroke={p.ink} strokeWidth="0.7" />
      <Hatch p={p} d="M30 48l6 8M44 48l-4 10M36 52l8 6" />
    </>
  );
}

function Pterodactyl({ p, earned }: { p: Palette; earned: boolean }) {
  const hide = hue(earned, "#7a8f6b");
  const membrane = hue(earned, "#c5d4b0");
  return (
    <>
      <path d="M6 50c18-22 30-24 34-10 4-14 16-12 34 10-16-6-24 2-34 2s-18-8-34-2z" fill={membrane} />
      <path d="M6 50c18-22 30-24 34-10 4-14 16-12 34 10-16-6-24 2-34 2s-18-8-34-2z" fill="none" stroke={p.ink} strokeWidth="1.4" />
      <path d="M20 42l8 8M60 42l-8 8M28 38l6 12M52 38l-6 12" stroke={p.ink} strokeWidth="0.7" opacity="0.45" />
      <path d="M40 36v18" stroke={p.ink} strokeWidth="1.7" />
      <path d="M40 38c10-12 20-10 24-4 0 4-8 8-16 8" fill={hide} stroke={p.ink} strokeWidth="1.2" />
      <path d="M58 30c8-2 12 2 10 6" fill="none" stroke={p.ink} strokeWidth="1.3" />
      <path d="M52 26c2-6 8-6 10-2" fill={hide} stroke={p.ink} strokeWidth="1" />
      <circle cx="48" cy="32" r="1.15" fill={p.ink} />
      <path d="M36 54c-2 8 2 12 6 10" fill="none" stroke={p.ink} strokeWidth="1.1" />
    </>
  );
}

function Spacebird({ p, earned }: { p: Palette; earned: boolean }) {
  const visor = hue(earned, "#2bbbad");
  const suit = hue(earned, "#3d4a6b");
  return (
    <>
      <circle cx="40" cy="40" r="24" fill="none" stroke={p.ink} strokeWidth="0.8" strokeDasharray="2.5 3.2" opacity="0.55" />
      <circle cx="16" cy="20" r="1.1" fill={p.ink} />
      <circle cx="64" cy="18" r="0.8" fill={p.ink} />
      <circle cx="68" cy="50" r="1" fill={p.ink} />
      <circle cx="14" cy="56" r="0.7" fill={p.ink} />
      <circle cx="58" cy="66" r="1.1" fill={p.ink} />
      <path d="M22 50c8-18 28-18 36 0-6 8-14 12-18 6-4 6-12 2-18-6z" fill={suit} stroke={p.ink} strokeWidth="1.3" />
      <circle cx="40" cy="34" r="10" fill={p.paper} stroke={p.ink} strokeWidth="1.4" />
      <circle cx="40" cy="34" r="7" fill={visor} opacity="0.85" />
      <path d="M34 32c4-4 10-4 12 0" fill="none" stroke={p.paper} strokeWidth="1.6" opacity="0.8" />
      <circle cx="42" cy="34" r="1.3" fill={p.paper} />
      <path d="M28 50l-6 8M52 50l6 8" stroke={p.ink} strokeWidth="1.3" strokeLinecap="round" />
    </>
  );
}

function Cheetah({ p, earned }: { p: Palette; earned: boolean }) {
  const coat = hue(earned, "#d4a04a");
  const belly = hue(earned, "#f0d9a8");
  return (
    <>
      <ellipse cx="40" cy="66" rx="20" ry="4" fill={p.ink} opacity="0.08" />
      <path
        d="M10 52c8-16 22-20 32-10 6-10 18-12 28-2 0 8-8 12-16 10-2 6-10 12-16 10-10 2-20-2-28-8z"
        fill={coat}
        stroke={p.ink}
        strokeWidth="1.35"
      />
      <path d="M22 50c8 4 18 4 28-2" fill={belly} opacity="0.55" />
      <circle cx="62" cy="34" r="6.2" fill={coat} stroke={p.ink} strokeWidth="1.2" />
      <path d="M66 30c2-4 6-4 6 0" fill={coat} stroke={p.ink} strokeWidth="0.9" />
      <path d="M58 30c-1-4 2-6 4-3" fill={coat} stroke={p.ink} strokeWidth="0.9" />
      <circle cx="64" cy="33" r="1" fill={p.ink} />
      <path d="M68 36l8-3" stroke={p.ink} strokeWidth="1.15" strokeLinecap="round" />
      <path d="M60 36c4 3 2 6-2 5" fill="none" stroke={p.ink} strokeWidth="0.8" />
      <path d="M14 50c-4 8-2 14 4 10" fill="none" stroke={p.ink} strokeWidth="1.3" />
      <path d="M8 44c4 0 8 4 6 8" fill="none" stroke={p.ink} strokeWidth="1.3" />
      {[
        [24, 46],
        [32, 42],
        [40, 48],
        [48, 44],
        [36, 54],
        [28, 52],
        [46, 52],
        [54, 40],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.5" ry="1.2" fill={p.ink} />
      ))}
    </>
  );
}

function NightBat({ p, earned }: { p: Palette; earned: boolean }) {
  const fur = hue(earned, "#2c2a32");
  const moon = hue(earned, "#f0e2b2");
  return (
    <>
      <circle cx="58" cy="22" r="8" fill={moon} opacity="0.9" />
      <circle cx="62" cy="20" r="6" fill={p.wash} />
      <path
        d="M8 46c10 16 16-8 32-10 16 2 22 26 32 10-8 16-20 22-32 14-12 8-24 2-32-14z"
        fill={fur}
        stroke={p.ink}
        strokeWidth="1.2"
      />
      <path d="M18 44c6 6 10 2 14-4M62 44c-6 6-10 2-14-4" fill="none" stroke={p.paper} strokeWidth="0.7" opacity="0.35" />
      <path d="M36 34l-4-8 6 4 4-8 2 8" fill={fur} stroke={p.ink} strokeWidth="0.9" />
      <circle cx="36" cy="40" r="1.7" fill={hue(earned, "#e6c15a")} />
      <circle cx="44" cy="40" r="1.7" fill={hue(earned, "#e6c15a")} />
      <circle cx="36.3" cy="40" r="0.6" fill={p.ink} />
      <circle cx="44.3" cy="40" r="0.6" fill={p.ink} />
      <path d="M38 44c2 3 4 3 6 0" fill="none" stroke={p.paper} strokeWidth="0.8" opacity="0.6" />
    </>
  );
}

function EarlyBird({ p, earned }: { p: Palette; earned: boolean }) {
  const sun = hue(earned, "#e8a23a");
  const bird = hue(earned, "#6b4423");
  const breast = hue(earned, "#d4552a");
  return (
    <>
      <circle cx="56" cy="24" r="11" fill={sun} opacity="0.9" />
      <circle cx="56" cy="24" r="11" fill="none" stroke={p.ink} strokeWidth="1.1" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={56 + Math.cos(a) * 13}
            y1={24 + Math.sin(a) * 13}
            x2={56 + Math.cos(a) * 17}
            y2={24 + Math.sin(a) * 17}
            stroke={sun}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        );
      })}
      <path d="M12 62c12 2 28 2 44-8" fill="none" stroke={p.ink} strokeWidth="1.3" />
      <path d="M18 62c4-6 10-8 16-4" fill="none" stroke={hue(earned, "#3f6b3a")} strokeWidth="2.2" />
      <path d="M22 50c10-16 30-14 36 4-8 8-16 10-20 4-4 6-12 6-16-8z" fill={bird} stroke={p.ink} strokeWidth="1.3" />
      <path d="M30 50c6 4 14 4 20-2" fill={breast} opacity="0.8" />
      <circle cx="50" cy="44" r="1.3" fill={p.paper} />
      <circle cx="50.3" cy="44" r="0.6" fill={p.ink} />
      <path d="M56 46l9 2-8 3z" fill={hue(earned, "#e07a2f")} stroke={p.ink} strokeWidth="0.7" />
    </>
  );
}

function Hamster({ p, earned }: { p: Palette; earned: boolean }) {
  const fur = hue(earned, "#d9a15c");
  const ear = hue(earned, "#e7b98a");
  const nose = hue(earned, "#e07a7a");
  return (
    <>
      <ellipse cx="40" cy="66" rx="16" ry="4" fill={p.ink} opacity="0.08" />
      <circle cx="24" cy="30" r="9" fill={ear} stroke={p.ink} strokeWidth="1.2" />
      <circle cx="56" cy="30" r="9" fill={ear} stroke={p.ink} strokeWidth="1.2" />
      <circle cx="24" cy="30" r="5" fill={hue(earned, "#f2c4c4")} opacity="0.8" />
      <circle cx="56" cy="30" r="5" fill={hue(earned, "#f2c4c4")} opacity="0.8" />
      <ellipse cx="40" cy="46" rx="20" ry="18" fill={fur} stroke={p.ink} strokeWidth="1.4" />
      <ellipse cx="22" cy="48" rx="7" ry="8" fill={fur} stroke={p.ink} strokeWidth="1.1" />
      <ellipse cx="58" cy="48" rx="7" ry="8" fill={fur} stroke={p.ink} strokeWidth="1.1" />
      <circle cx="33" cy="42" r="2.1" fill={p.ink} />
      <circle cx="47" cy="42" r="2.1" fill={p.ink} />
      <circle cx="33.6" cy="41.4" r="0.6" fill={p.paper} />
      <circle cx="47.6" cy="41.4" r="0.6" fill={p.paper} />
      <ellipse cx="40" cy="52" rx="4.5" ry="3.2" fill={p.paper} stroke={p.ink} strokeWidth="0.7" />
      <ellipse cx="40" cy="50" rx="2" ry="1.4" fill={nose} />
      <path d="M40 52v4M36 56c2-1 3-1 4 0 1-1 2-1 4 0" stroke={p.ink} strokeWidth="0.8" />
      <path d="M28 62c2 4 6 6 10 4M52 62c-2 4-6 6-10 4" fill="none" stroke={p.ink} strokeWidth="1.1" />
    </>
  );
}

function Oxalis({ p, earned }: { p: Palette; earned: boolean }) {
  const leaf = hue(earned, "#3fa38c");
  const deep = hue(earned, "#2b6e5e");
  const bloom = hue(earned, "#c45c8a");
  return (
    <>
      <ellipse cx="40" cy="70" rx="14" ry="3" fill={p.ink} opacity="0.08" />
      <path d="M40 38c0 10 0 22 2 30" fill="none" stroke={p.ink} strokeWidth="1.5" />
      <path d="M40 38c-12-18-26-10-18 4 6 10 14 8 18-4z" fill={leaf} stroke={p.ink} strokeWidth="1.2" />
      <path d="M40 38c-16 12-8 26 6 18 8-6 6-14-6-18z" fill={deep} stroke={p.ink} strokeWidth="1.2" />
      <path d="M40 38c16 10 24-6 10-16-8-6-14 0-10 16z" fill={leaf} stroke={p.ink} strokeWidth="1.2" />
      <path d="M42 24c4-8 12-8 12 0-4 2-8 2-12 0z" fill={bloom} stroke={p.ink} strokeWidth="0.9" />
      <path d="M50 22c6-4 12 0 8 6-4 0-8-2-8-6z" fill={hue(earned, "#e89ab8")} stroke={p.ink} strokeWidth="0.8" />
      <Hatch p={p} d="M32 34c-4 4-4 8 0 8M46 32c4 2 6 6 2 10M36 44c2 4 6 6 8 4" />
    </>
  );
}

function Horse({ p, earned }: { p: Palette; earned: boolean }) {
  const coat = hue(earned, "#2bbbad");
  const mane = hue(earned, "#1a7f78");
  return (
    <>
      <ellipse cx="36" cy="70" rx="16" ry="3.5" fill={p.ink} opacity="0.08" />
      <path
        d="M16 56c4-18 16-28 30-18 4 2 6 10 2 14-8 4-12 8-12 16"
        fill={coat}
        stroke={p.ink}
        strokeWidth="1.4"
      />
      <path d="M44 38c10-10 20-8 22 2 0 6-8 10-14 8" fill={coat} stroke={p.ink} strokeWidth="1.3" />
      <path d="M48 22c2 8-2 14-8 16 6-2 10 2 8 8" fill="none" stroke={mane} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M46 24c6 4 8 10 4 14" fill="none" stroke={p.ink} strokeWidth="1.1" />
      <path d="M22 54c-6 4-8 12-2 14" fill={mane} stroke={p.ink} strokeWidth="1.1" />
      <path d="M34 68v-12M24 68v-8" stroke={p.ink} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M20 68h10M30 68h10" stroke={p.ink} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="58" cy="34" r="1.2" fill={p.ink} />
      <path d="M62 36c4 1 6 4 2 6" fill="none" stroke={p.ink} strokeWidth="1.1" />
      <path d="M54 40c3 3 2 6-2 5" fill="none" stroke={p.ink} strokeWidth="0.8" />
    </>
  );
}

function Wren({ p, earned, x, y, s = 1 }: { p: Palette; earned: boolean; x: number; y: number; s?: number }) {
  const body = hue(earned, "#6b5344");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="6" ry="4" fill={body} stroke={p.ink} strokeWidth="0.9" />
      <path d="M6 0l5-1" stroke={p.ink} strokeWidth="0.9" />
      <circle cx="3" cy="-1" r="0.7" fill={p.ink} />
      <path d="M-4 0c-4-3-4-6 0-5" fill="none" stroke={p.ink} strokeWidth="0.8" />
    </g>
  );
}

function Novella({ p, earned }: { p: Palette; earned: boolean }) {
  return (
    <>
      <Wren p={p} earned={earned} x={40} y={44} s={2.1} />
      <path d="M24 62h32" stroke={p.ink} strokeWidth="1.2" />
    </>
  );
}

function ShortStory({ p, earned }: { p: Palette; earned: boolean }) {
  return (
    <>
      <Wren p={p} earned={earned} x={28} y={40} s={1.6} />
      <Wren p={p} earned={earned} x={50} y={46} s={1.9} />
      <Wren p={p} earned={earned} x={40} y={30} s={1.2} />
    </>
  );
}

function NovelOwl({ p, earned }: { p: Palette; earned: boolean }) {
  const body = hue(earned, "#7a5a38");
  return (
    <>
      <ellipse cx="40" cy="48" rx="16" ry="18" fill={body} stroke={p.ink} strokeWidth="1.4" />
      <circle cx="33" cy="40" r="7" fill={p.paper} stroke={p.ink} strokeWidth="1.1" />
      <circle cx="47" cy="40" r="7" fill={p.paper} stroke={p.ink} strokeWidth="1.1" />
      <circle cx="33" cy="40" r="3" fill={p.accent} />
      <circle cx="47" cy="40" r="3" fill={p.accent} />
      <circle cx="33" cy="40" r="1.3" fill={p.ink} />
      <circle cx="47" cy="40" r="1.3" fill={p.ink} />
      <path d="M40 44l5 6h-10z" fill={hue(earned, "#e07a2f")} stroke={p.ink} strokeWidth="0.7" />
      <path d="M24 32l8 6M56 32l-8 6" stroke={p.ink} strokeWidth="1.2" />
      <path d="M28 64h24" stroke={p.ink} strokeWidth="1.5" strokeLinecap="round" />
    </>
  );
}

function Flock({ p, earned, n }: { p: Palette; earned: boolean; n: number }) {
  const spots = [
    [18, 48],
    [30, 40],
    [44, 46],
    [56, 38],
    [24, 30],
    [50, 28],
    [38, 34],
    [64, 50],
    [14, 36],
    [40, 22],
    [28, 54],
    [52, 56],
    [36, 58],
    [20, 22],
    [60, 24],
  ];
  return (
    <>
      {spots.slice(0, n).map(([x, y], i) => (
        <Wren key={i} p={p} earned={earned} x={x} y={y} s={0.85 + (i % 3) * 0.2} />
      ))}
    </>
  );
}

function Library({ p, earned }: { p: Palette; earned: boolean }) {
  const bark = hue(earned, "#6b4423");
  const leaf = hue(earned, "#3f7a4a");
  return (
    <>
      <path d="M36 70V38" stroke={bark} strokeWidth="5" />
      <path d="M36 70V38" stroke={p.ink} strokeWidth="1.2" fill="none" />
      <ellipse cx="40" cy="30" rx="20" ry="14" fill={leaf} stroke={p.ink} strokeWidth="1.2" />
      <Flock p={p} earned={earned} n={9} />
    </>
  );
}

const DRAW: Record<string, (p: Palette, earned: boolean) => ReactNode> = {
  egg: (p, e) => <Egg p={p} earned={e} />,
  turkey: (p, e) => <Turkey p={p} earned={e} />,
  penguin: (p, e) => <Penguin p={p} earned={e} />,
  flamingo: (p, e) => <Flamingo p={p} earned={e} />,
  albatross: (p, e) => <Albatross p={p} earned={e} />,
  phoenix: (p, e) => <Phoenix p={p} earned={e} />,
  pterodactyl: (p, e) => <Pterodactyl p={p} earned={e} />,
  spacebird: (p, e) => <Spacebird p={p} earned={e} />,
  cheetah: (p, e) => <Cheetah p={p} earned={e} />,
  "night-bat": (p, e) => <NightBat p={p} earned={e} />,
  "early-bird": (p, e) => <EarlyBird p={p} earned={e} />,
  hamster: (p, e) => <Hamster p={p} earned={e} />,
  oxalis: (p, e) => <Oxalis p={p} earned={e} />,
  "turquoise-horse": (p, e) => <Horse p={p} earned={e} />,
  novella: (p, e) => <Novella p={p} earned={e} />,
  "short-story": (p, e) => <ShortStory p={p} earned={e} />,
  novel: (p, e) => <NovelOwl p={p} earned={e} />,
  anthology: (p, e) => <Flock p={p} earned={e} n={7} />,
  sequel: (p, e) => <Flock p={p} earned={e} n={12} />,
  library: (p, e) => <Library p={p} earned={e} />,
};

export function BadgeArt({ badge, earned }: { badge: BadgeDef; earned: boolean }) {
  const p = pal(earned);
  const spirit = badge.id.startsWith("spirit-");
  const key = badge.id.replace(/^spirit-/, "");
  const body = DRAW[key]?.(p, earned) ?? <Novella p={p} earned={earned} />;
  return (
    <svg
      viewBox="0 0 80 80"
      width="112"
      height="112"
      aria-hidden
      data-badge={badge.id}
      data-earned={earned ? "1" : "0"}
    >
      <Paper p={p} spirit={spirit} />
      <g opacity={spirit ? 0.72 : 1}>{body}</g>
    </svg>
  );
}
