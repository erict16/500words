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
        ink: "#231c14",
        wash: "#f6ecd2",
        accent: "#4db559",
        paper: "#fffdf8",
        warm: "#c45c26",
      }
    : {
        ink: "#b5b5b5",
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
    [8, 13],
    [17, 10],
    [26, 17],
    [47, 9],
    [62, 14],
    [72, 21],
    [11, 37],
    [69, 40],
    [7, 57],
    [20, 69],
    [54, 71],
    [67, 61],
    [73, 53],
    [14, 73],
    [41, 7],
    [32, 74],
    [10, 25],
    [58, 11],
    [74, 34],
    [5, 46],
    [23, 8],
    [50, 75],
    [37, 70],
    [65, 67],
    [29, 12],
    [44, 76],
  ];
  return (
    <g opacity="0.28" fill={p.ink}>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 0.8 : 0.4} />
      ))}
    </g>
  );
}

function Hatch({ p, d }: { p: Palette; d: string }) {
  return <path d={d} fill="none" stroke={p.ink} strokeWidth="0.45" opacity="0.32" />;
}

function Paper({ p, spirit }: { p: Palette; spirit: boolean; fid: string }) {
  return (
    <>
      {spirit ? (
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={p.ink}
          strokeWidth="0.9"
          strokeDasharray="2.4 2.2"
          opacity="0.45"
        />
      ) : null}
      <ellipse cx="40" cy="72" rx="22" ry="4" fill={p.ink} opacity="0.06" />
      <Grain p={p} />
    </>
  );
}

function Ink({ p, d, width = 1.35 }: { p: Palette; d: string; width?: number }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={p.ink}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Egg({ p, earned }: { p: Palette; earned: boolean }) {
  const shell = hue(earned, "#f6ecd2");
  const nest = hue(earned, "#8a5a32");
  const speck = hue(earned, "#c9a36a");
  return (
    <>
      <ellipse cx="40" cy="64" rx="22" ry="5.5" fill={p.ink} opacity="0.08" />
      <path
        d="M14 58c7-9 12-6 16-1 4-8 10-9 14-1 5-8 12-7 16 1 5-6 13-6 18 4-9 7-20 11-32 11-13 0-25-4-32-14z"
        fill={nest}
        opacity="0.62"
      />
      <Ink p={p} d="M16 57c9 5 18 8 25 8 8 0 16-2 26-8" width={1.15} />
      <path d="M21 56l5 9M29 53l4 12M38 53v13M47 53l-3 12M57 56l-6 9" stroke={p.ink} strokeWidth="1.05" />
      <path d="M40 19c10 1 18 11 17.5 23-0.5 11-8 21-17.5 21S23 53 23 41.5C23 29 30 20 40 19z" fill={shell} />
      <path d="M40 19c10 1 18 11 17.5 23-0.5 11-8 21-17.5 21S23 53 23 41.5C23 29 30 20 40 19z" fill={p.warm} opacity="0.14" />
      <Ink p={p} d="M40 19c10 1 18 11 17.5 23-0.5 11-8 21-17.5 21S23 53 23 41.5C23 29 30 20 40 19z" width={1.55} />
      <path d="M32 28c7-9 16-7 18 3" fill="none" stroke={p.paper} strokeWidth="2.3" opacity="0.75" />
      <Ink p={p} d="M36 34c2 1 3 4 1 6" width={0.9} />
      <ellipse cx="33" cy="44" rx="3.4" ry="2.3" fill={p.accent} opacity="0.5" />
      <ellipse cx="47" cy="37" rx="2.4" ry="1.7" fill={speck} opacity="0.7" />
      <circle cx="44" cy="51" r="1.4" fill={p.ink} opacity="0.3" />
    </>
  );
}

function Turkey({ p, earned }: { p: Palette; earned: boolean }) {
  const rust = hue(earned, "#c45c26");
  const gold = hue(earned, "#d9a441");
  const copper = hue(earned, "#a33b1c");
  const body = hue(earned, "#6b3a1e");
  return (
    <>
      <ellipse cx="42" cy="67" rx="17" ry="4" fill={p.ink} opacity="0.08" />
      <path d="M38 46c-18-4-28-20-22-32 9 5 16 14 20 24 1-14 10-24 24-28-4 16-8 26-22 36z" fill={gold} opacity="0.88" />
      <path d="M20 26c-8-11 0-22 12-20" fill="none" stroke={copper} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M28 22c-4-16 10-22 19-13" fill="none" stroke={rust} strokeWidth="3.6" strokeLinecap="round" />
      <path d="M40 20c3-14 20-16 24-4" fill="none" stroke={gold} strokeWidth="3.3" strokeLinecap="round" />
      <path d="M50 24c11-12 24-4 21 9" fill="none" stroke={copper} strokeWidth="3.1" strokeLinecap="round" />
      <Ink p={p} d="M16 34c-8-9-6-22 7-24" width={1.15} />
      <Ink p={p} d="M26 28c-5-15 6-24 18-16" width={1.15} />
      <Ink p={p} d="M40 26c2-15 18-20 24-8" width={1.15} />
      <Ink p={p} d="M52 30c9-13 22-8 19 5" width={1.15} />
      <ellipse cx="44" cy="51" rx="13.5" ry="11.5" fill={body} />
      <Ink p={p} d="M32 48c-1 8 4 16 14 16 10 0 14-8 12-16-2-7-8-11-14-10-6 0-12 4-12 10z" />
      <path d="M54 46c8-3 13 1 11 8-4 3-9 2-13-1" fill={hue(earned, "#4a2a14")} />
      <Ink p={p} d="M54 46c8-3 13 1 11 8-4 3-9 2-13-1" width={1.1} />
      <circle cx="58" cy="46" r="1.6" fill={p.paper} />
      <circle cx="58.5" cy="46.2" r="0.7" fill={p.ink} />
      <path d="M64 47c4.5 0 7 2.2 4.2 5.4" fill={p.warm} stroke={p.ink} strokeWidth="0.85" />
      <path d="M62 51c3.4 2.2 2 6.2-2.4 6" fill={hue(earned, "#c0392b")} stroke={p.ink} strokeWidth="0.75" />
      <Ink p={p} d="M36 61v10M47 61v10M32 71h10M43 71h11" width={1.5} />
      <Hatch p={p} d="M26 40l4 7M33 36l5 8M40 33l4 9M48 33l3 8" />
    </>
  );
}

function Penguin({ p, earned }: { p: Palette; earned: boolean }) {
  const black = hue(earned, "#1a1918");
  const orange = hue(earned, "#e07a2f");
  const tie = hue(earned, "#c45c26");
  return (
    <>
      <ellipse cx="40" cy="69" rx="15" ry="3.4" fill={p.ink} opacity="0.1" />
      <path d="M24 52c-8 7-12 16-5 18 2.2 0 4.5-2.5 7-7" fill={black} />
      <path d="M56 50c8 6 12 16 5 18-2.2 0-4.5-2.2-7-6.5" fill={black} />
      <path d="M26 28c-6 8-8 22-2 34 5 10 14 14 17 14 4 0 12-4 16-14 6-12 3-28-4-35-6-6-20-7-27 1z" fill={black} />
      <ellipse cx="41" cy="49" rx="10.5" ry="15.5" fill={p.paper} />
      <ellipse cx="34" cy="31" rx="3.4" ry="3.8" fill={p.paper} />
      <ellipse cx="47" cy="31" rx="3.4" ry="3.8" fill={p.paper} />
      <circle cx="34.6" cy="31.6" r="1.2" fill={p.ink} />
      <circle cx="47.6" cy="31.6" r="1.2" fill={p.ink} />
      <path d="M40 34l7.5 5.2h-15z" fill={orange} stroke={p.ink} strokeWidth="0.55" />
      <path d="M31 42h18" stroke={tie} strokeWidth="2.3" strokeLinecap="round" />
      <path d="M36 43h8l-4 8z" fill={tie} stroke={p.ink} strokeWidth="0.75" />
      <path d="M29 67h22" stroke={orange} strokeWidth="3.5" strokeLinecap="round" />
      <Ink p={p} d="M23 67c-2 4 2 6.5 7 4M57 67c2 4-2 6.5-7 4" width={1.35} />
    </>
  );
}

function Flamingo({ p, earned }: { p: Palette; earned: boolean }) {
  const pink = hue(earned, "#e8899a");
  const deep = hue(earned, "#d45d74");
  return (
    <>
      <ellipse cx="34" cy="71" rx="13" ry="3" fill={p.ink} opacity="0.08" />
      <Ink p={p} d="M37 38c2 12 3 24 0 32" width={1.85} />
      <Ink p={p} d="M37 70c-1 5 7 7 12 1.5" width={1.6} />
      <path d="M22 46c-2-7 6-14 16-12 8 2 12 10 9 16-4 7-14 9-20 6-4-2-6-6-5-10z" fill={pink} />
      <Ink p={p} d="M22 46c-2-7 6-14 16-12 8 2 12 10 9 16-4 7-14 9-20 6-4-2-6-6-5-10z" />
      <path
        d="M43 38c1-12 8-20 17-22 9-1.5 13 8 6 15-6 6-13 9-20 7"
        fill={deep}
      />
      <Ink p={p} d="M43 38c1-12 8-20 17-22 9-1.5 13 8 6 15-6 6-13 9-20 7" width={1.25} />
      <path d="M60 18c4.5-1.2 9 2 7.5 6.5-4.5 1.2-8 0-10-2.5" fill={pink} stroke={p.ink} strokeWidth="0.95" />
      <Ink p={p} d="M67 24c5.5 1 8 4.5 3 7" width={1.2} />
      <circle cx="62" cy="20" r="1.15" fill={p.ink} />
      <path d="M22 48c-7 4-7 11 0 8.5" fill={deep} opacity="0.75" />
      <Hatch p={p} d="M26 43h9M28 48h7" />
    </>
  );
}

function Albatross({ p, earned }: { p: Palette; earned: boolean }) {
  const wing = hue(earned, "#efe6d2");
  const tip = hue(earned, "#6d6558");
  const beak = hue(earned, "#e0b84a");
  return (
    <>
      <path d="M5 48c18-20 28-24 36-16 8-7 20-5 35 16-16-8-24 1-35 1S20 40 5 48z" fill={wing} />
      <Ink p={p} d="M5 48c18-20 28-24 36-16 8-7 20-5 35 16" width={1.5} />
      <path d="M9 47c13-11 22-13 32-8" fill="none" stroke={tip} strokeWidth="2.3" opacity="0.5" />
      <path d="M71 47c-13-11-22-13-32-8" fill="none" stroke={tip} strokeWidth="2.3" opacity="0.5" />
      <ellipse cx="40" cy="44" rx="9.5" ry="6.2" fill={p.paper} />
      <Ink p={p} d="M31 44c1-4 5-7 10-7 5 0 9 3 9 7 0 3-4 6-9 6s-10-3-10-6z" width={1.2} />
      <path d="M49 44c8-1.5 13-5 15-2.2-2 3.4-9 5.5-15 4.2" fill={beak} />
      <Ink p={p} d="M49 44c8-1.5 13-5 15-2.2-2 3.4-9 5.5-15 4.2" width={0.9} />
      <circle cx="44" cy="42" r="1.15" fill={p.ink} />
      <Ink p={p} d="M36 50c0 6 4.5 11 9 8.5" width={1.1} />
    </>
  );
}

function Phoenix({ p, earned }: { p: Palette; earned: boolean }) {
  const gold = hue(earned, "#e6a322");
  const flame = hue(earned, "#d94b1f");
  const ember = hue(earned, "#f0c96a");
  return (
    <>
      <path d="M40 71c-11-2-18-11-15-18 7 5 11 9 15 18 4-9 8-13 15-18-2 7-4 16-15 18z" fill={flame} opacity="0.9" />
      <path d="M26 53c-11 2-18 11-13 18 9-4 16-9 20-18" fill={gold} opacity="0.82" />
      <path d="M54 53c11 2 18 11 13 18-9-4-16-9-20-18" fill={gold} opacity="0.82" />
      <path d="M40 26c-13 6-22 19-21 30 8-7 16-17 21-26 5 9 13 19 21 26 1-11-8-24-21-30z" fill={ember} />
      <Ink p={p} d="M40 26c-13 6-22 19-21 30 8-7 16-17 21-26 5 9 13 19 21 26 1-11-8-24-21-30z" />
      <path d="M40 28c-5-13-16-18-20-11 9 2 16 9 20 18 4-9 11-16 20-18-4-7-15-2-20 11z" fill={flame} />
      <Ink p={p} d="M20 20c9 4 14 9 16 16M60 20c-9 4-14 9-16 16" width={1.15} />
      <circle cx="40" cy="37" r="2.3" fill={p.paper} stroke={p.ink} strokeWidth="0.8" />
      <circle cx="40" cy="37" r="0.7" fill={p.ink} />
      <path d="M40 18l2.2 6.5h-4.4z" fill={gold} stroke={p.ink} strokeWidth="0.7" />
      <Hatch p={p} d="M29 48l6 9M45 48l-4 11M35 53l9 6" />
    </>
  );
}

function Pterodactyl({ p, earned }: { p: Palette; earned: boolean }) {
  const hide = hue(earned, "#7a8f6b");
  const membrane = hue(earned, "#c5d4b0");
  return (
    <>
      <path d="M5 51c19-24 32-26 36-10 4-16 18-13 35 10-17-7-25 2-35 2S21 44 5 51z" fill={membrane} />
      <Ink p={p} d="M5 51c19-24 32-26 36-10 4-16 18-13 35 10-17-7-25 2-35 2S21 44 5 51z" width={1.4} />
      <path d="M19 42l9 9M61 42l-9 9M27 37l7 13M53 37l-7 13" stroke={p.ink} strokeWidth="0.7" opacity="0.45" />
      <Ink p={p} d="M40 35v20" width={1.7} />
      <path d="M40 37c11-13 22-11 26-4 0 4.5-9 9-18 9" fill={hide} />
      <Ink p={p} d="M40 37c11-13 22-11 26-4 0 4.5-9 9-18 9" width={1.2} />
      <Ink p={p} d="M58 29c9-2 13 2 11 7" width={1.3} />
      <path d="M52 24c2-7 9-7 11-2" fill={hide} stroke={p.ink} strokeWidth="1" />
      <circle cx="48" cy="31" r="1.15" fill={p.ink} />
      <Ink p={p} d="M35 54c-2 9 2.5 13 7 10.5" width={1.1} />
    </>
  );
}

function Spacebird({ p, earned }: { p: Palette; earned: boolean }) {
  const visor = hue(earned, "#3d6ea5");
  const suit = hue(earned, "#3d4a6b");
  return (
    <>
      <circle cx="40" cy="40" r="24.5" fill="none" stroke={p.ink} strokeWidth="0.8" strokeDasharray="2.4 3.1" opacity="0.55" />
      <circle cx="15" cy="19" r="1.15" fill={p.ink} />
      <circle cx="65" cy="17" r="0.8" fill={p.ink} />
      <circle cx="69" cy="51" r="1" fill={p.ink} />
      <circle cx="13" cy="57" r="0.7" fill={p.ink} />
      <circle cx="58" cy="67" r="1.15" fill={p.ink} />
      <path d="M21 51c9-20 30-20 38 0-6 9-15 13-19 6-4 7-13 3-19-6z" fill={suit} />
      <Ink p={p} d="M21 51c9-20 30-20 38 0-6 9-15 13-19 6-4 7-13 3-19-6z" width={1.3} />
      <circle cx="40" cy="33" r="10.5" fill={p.paper} stroke={p.ink} strokeWidth="1.4" />
      <circle cx="40" cy="33" r="7.3" fill={visor} opacity="0.88" />
      <path d="M33 31c5-5 11-5 14 0" fill="none" stroke={p.paper} strokeWidth="1.6" opacity="0.85" />
      <circle cx="43" cy="33" r="1.3" fill={p.paper} />
      <Ink p={p} d="M27 51l-7 9M53 51l7 9" width={1.3} />
    </>
  );
}

function Cheetah({ p, earned }: { p: Palette; earned: boolean }) {
  const coat = hue(earned, "#d4a04a");
  const belly = hue(earned, "#f0d9a8");
  return (
    <>
      <ellipse cx="40" cy="67" rx="21" ry="4" fill={p.ink} opacity="0.08" />
      <path
        d="M8 54c9-18 24-22 34-10 6-12 20-14 30-1-1 9-10 13-18 10-2 7-11 13-18 11-11 2-21-2-28-10z"
        fill={coat}
      />
      <Ink
        p={p}
        d="M8 54c9-18 24-22 34-10 6-12 20-14 30-1-1 9-10 13-18 10-2 7-11 13-18 11-11 2-21-2-28-10z"
      />
      <path d="M20 51c9 5 20 5 31-2" fill={belly} opacity="0.55" />
      <circle cx="64" cy="33" r="6.4" fill={coat} stroke={p.ink} strokeWidth="1.2" />
      <path d="M68 28c2.2-4.5 7-4.2 7 0.4" fill={coat} stroke={p.ink} strokeWidth="0.9" />
      <path d="M59 29c-1.2-4.5 2.2-6.5 4.4-3" fill={coat} stroke={p.ink} strokeWidth="0.9" />
      <circle cx="66" cy="32" r="1" fill={p.ink} />
      <Ink p={p} d="M70 35l8.5-3.2" width={1.15} />
      <Ink p={p} d="M62 35c4 3.2 2 6.5-2.2 5.2" width={0.8} />
      <Ink p={p} d="M12 50c-5 9-2 15 5 10.5M6 43c4.5 0 9 4.5 6.5 9" width={1.3} />
      {[
        [22, 47],
        [31, 42],
        [40, 49],
        [49, 44],
        [35, 55],
        [26, 53],
        [46, 53],
        [55, 39],
        [18, 50],
        [42, 41],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.55" ry="1.2" fill={p.ink} />
      ))}
    </>
  );
}

function NightBat({ p, earned }: { p: Palette; earned: boolean }) {
  const fur = hue(earned, "#2c2a32");
  const moon = hue(earned, "#f0e2b2");
  return (
    <>
      <circle cx="59" cy="21" r="8.5" fill={moon} opacity="0.92" />
      <circle cx="63" cy="19" r="6.2" fill={p.wash} />
      <path
        d="M7 47c11 17 17-9 33-11 16 2 24 27 34 11-9 17-21 23-34 14-13 9-25 2-33-14z"
        fill={fur}
      />
      <Ink
        p={p}
        d="M7 47c11 17 17-9 33-11 16 2 24 27 34 11-9 17-21 23-34 14-13 9-25 2-33-14z"
        width={1.2}
      />
      <path d="M17 44c7 7 11 2 15-5M63 44c-7 7-11 2-15-5" fill="none" stroke={p.paper} strokeWidth="0.7" opacity="0.35" />
      <path d="M35 33l-4.5-9 7 4.5 4.5-9 2 9" fill={fur} stroke={p.ink} strokeWidth="0.9" />
      <circle cx="36" cy="40" r="1.75" fill={hue(earned, "#e6c15a")} />
      <circle cx="44" cy="40" r="1.75" fill={hue(earned, "#e6c15a")} />
      <circle cx="36.4" cy="40" r="0.6" fill={p.ink} />
      <circle cx="44.4" cy="40" r="0.6" fill={p.ink} />
      <Ink p={p} d="M38 44c2 3.2 4 3.2 6 0" width={0.8} />
    </>
  );
}

function EarlyBird({ p, earned }: { p: Palette; earned: boolean }) {
  const sun = hue(earned, "#e8a23a");
  const bird = hue(earned, "#6b4423");
  const breast = hue(earned, "#d4552a");
  return (
    <>
      <circle cx="57" cy="23" r="11.5" fill={sun} opacity="0.92" />
      <Ink p={p} d="M57 11.5a11.5 11.5 0 1 1 0 23 11.5 11.5 0 0 1 0-23z" width={1.1} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={57 + Math.cos(a) * 13.5}
            y1={23 + Math.sin(a) * 13.5}
            x2={57 + Math.cos(a) * 17.5}
            y2={23 + Math.sin(a) * 17.5}
            stroke={sun}
            strokeWidth="1.45"
            strokeLinecap="round"
          />
        );
      })}
      <Ink p={p} d="M11 63c13 2 30 2 47-9" width={1.3} />
      <path d="M17 63c4.5-7 11-9 17-4" fill="none" stroke={hue(earned, "#3f6b3a")} strokeWidth="2.3" />
      <path d="M21 50c11-17 32-15 38 5-8 8-17 10-21 4-4 6.5-13 6.5-17-9z" fill={bird} />
      <Ink p={p} d="M21 50c11-17 32-15 38 5-8 8-17 10-21 4-4 6.5-13 6.5-17-9z" width={1.3} />
      <path d="M29 50c6 4.5 15 4.5 21-2" fill={breast} opacity="0.82" />
      <circle cx="51" cy="43" r="1.35" fill={p.paper} />
      <circle cx="51.3" cy="43" r="0.6" fill={p.ink} />
      <path d="M57 45l10 2.2-9 3.2z" fill={hue(earned, "#e07a2f")} stroke={p.ink} strokeWidth="0.7" />
    </>
  );
}

function Hamster({ p, earned }: { p: Palette; earned: boolean }) {
  const fur = hue(earned, "#d9a15c");
  const ear = hue(earned, "#e7b98a");
  const nose = hue(earned, "#e07a7a");
  return (
    <>
      <ellipse cx="40" cy="67" rx="16" ry="4" fill={p.ink} opacity="0.08" />
      <circle cx="23" cy="29" r="9.2" fill={ear} stroke={p.ink} strokeWidth="1.2" />
      <circle cx="57" cy="29" r="9.2" fill={ear} stroke={p.ink} strokeWidth="1.2" />
      <circle cx="23" cy="29" r="5.1" fill={hue(earned, "#f2c4c4")} opacity="0.82" />
      <circle cx="57" cy="29" r="5.1" fill={hue(earned, "#f2c4c4")} opacity="0.82" />
      <ellipse cx="40" cy="46" rx="20.5" ry="18.5" fill={fur} />
      <Ink p={p} d="M20 46c0-12 9-21 20-21s20 9 20 21-9 19-20 19-20-8-20-19z" />
      <ellipse cx="21" cy="49" rx="7.2" ry="8.2" fill={fur} stroke={p.ink} strokeWidth="1.1" />
      <ellipse cx="59" cy="49" rx="7.2" ry="8.2" fill={fur} stroke={p.ink} strokeWidth="1.1" />
      <circle cx="33" cy="42" r="2.15" fill={p.ink} />
      <circle cx="47" cy="42" r="2.15" fill={p.ink} />
      <circle cx="33.7" cy="41.3" r="0.6" fill={p.paper} />
      <circle cx="47.7" cy="41.3" r="0.6" fill={p.paper} />
      <ellipse cx="40" cy="52" rx="4.7" ry="3.3" fill={p.paper} stroke={p.ink} strokeWidth="0.7" />
      <ellipse cx="40" cy="50" rx="2.1" ry="1.45" fill={nose} />
      <Ink p={p} d="M40 52v4.2M36 56.5c2-1 3-1 4 0 1-1 2-1 4 0" width={0.8} />
      <Ink p={p} d="M27 62c2.2 4.5 6.5 6.5 11 4M53 62c-2.2 4.5-6.5 6.5-11 4" width={1.1} />
    </>
  );
}

function Oxalis({ p, earned }: { p: Palette; earned: boolean }) {
  const leaf = hue(earned, "#3fa38c");
  const deep = hue(earned, "#2b6e5e");
  const bloom = hue(earned, "#c45c8a");
  return (
    <>
      <ellipse cx="40" cy="71" rx="14" ry="3" fill={p.ink} opacity="0.08" />
      <Ink p={p} d="M40 38c0 11 0 24 2 31" width={1.5} />
      <path d="M40 38c-13-19-28-11-19 4 6 11 15 9 19-4z" fill={leaf} />
      <Ink p={p} d="M40 38c-13-19-28-11-19 4 6 11 15 9 19-4z" width={1.2} />
      <path d="M40 38c-17 13-9 28 6.5 19 8.5-6 6-15-6.5-19z" fill={deep} />
      <Ink p={p} d="M40 38c-17 13-9 28 6.5 19 8.5-6 6-15-6.5-19z" width={1.2} />
      <path d="M40 38c17 11 26-6 11-17-8.5-6.5-15 0-11 17z" fill={leaf} />
      <Ink p={p} d="M40 38c17 11 26-6 11-17-8.5-6.5-15 0-11 17z" width={1.2} />
      <path d="M42 23c4.5-9 13-9 13 0-4.5 2.2-9 2.2-13 0z" fill={bloom} stroke={p.ink} strokeWidth="0.9" />
      <path d="M51 21c6.5-4.5 13 0 8.5 6.5-4.5 0-8.5-2.2-8.5-6.5z" fill={hue(earned, "#e89ab8")} stroke={p.ink} strokeWidth="0.8" />
      <Hatch p={p} d="M31 33c-4.5 4.5-4.5 9 0 9M47 31c4.5 2 7 7 2 11M35 44c2 4.5 7 7 9 4.5" />
    </>
  );
}

function Horse({ p, earned }: { p: Palette; earned: boolean }) {
  const coat = hue(earned, "#00bfa5");
  const mane = hue(earned, "#00796b");
  return (
    <>
      <ellipse cx="35" cy="71" rx="17" ry="3.4" fill={p.ink} opacity="0.08" />
      <path d="M15 57c4-20 17-30 32-19 4.5 2 7 11 2 15-9 4-13 8-13 17" fill={coat} />
      <Ink p={p} d="M15 57c4-20 17-30 32-19 4.5 2 7 11 2 15-9 4-13 8-13 17" />
      <path d="M44 37c11-11 22-8.5 24 2.5 0 6.5-9 11-15.5 8.5" fill={coat} />
      <Ink p={p} d="M44 37c11-11 22-8.5 24 2.5 0 6.5-9 11-15.5 8.5" width={1.3} />
      <Ink p={p} d="M48 21c2 9-2 15-9 17 7-2 11 2 9 9" width={2.5} />
      <path d="M48 21c2 9-2 15-9 17" fill="none" stroke={mane} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 54c-7 4-9 13-2 15.5" fill={mane} stroke={p.ink} strokeWidth="1.1" />
      <Ink p={p} d="M33 69v-13M23 69v-9M19 69h11M29 69h11" width={1.6} />
      <circle cx="59" cy="33" r="1.2" fill={p.ink} />
      <Ink p={p} d="M63 35c4.5 1 7 4.5 2.2 6.5" width={1.1} />
      <Ink p={p} d="M54 40c3.2 3.2 2 6.5-2.2 5.2" width={0.8} />
    </>
  );
}

function Wren({ p, earned, x, y, s = 1 }: { p: Palette; earned: boolean; x: number; y: number; s?: number }) {
  const body = hue(earned, "#6b5344");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="6.2" ry="4.1" fill={body} stroke={p.ink} strokeWidth="0.9" />
      <path d="M6 0l5.4-1.1" stroke={p.ink} strokeWidth="0.9" />
      <circle cx="3.1" cy="-1.1" r="0.7" fill={p.ink} />
      <path d="M-4.2 0c-4.2-3.2-4.2-6.2 0-5.2" fill="none" stroke={p.ink} strokeWidth="0.8" />
    </g>
  );
}

function Novella({ p, earned }: { p: Palette; earned: boolean }) {
  return (
    <>
      <Wren p={p} earned={earned} x={40} y={44} s={2.15} />
      <Ink p={p} d="M22 63h36" width={1.2} />
    </>
  );
}

function ShortStory({ p, earned }: { p: Palette; earned: boolean }) {
  return (
    <>
      <Wren p={p} earned={earned} x={27} y={40} s={1.65} />
      <Wren p={p} earned={earned} x={51} y={47} s={1.95} />
      <Wren p={p} earned={earned} x={40} y={29} s={1.2} />
    </>
  );
}

function NovelOwl({ p, earned }: { p: Palette; earned: boolean }) {
  const body = hue(earned, "#7a5a38");
  return (
    <>
      <ellipse cx="40" cy="49" rx="16.5" ry="18.5" fill={body} />
      <Ink p={p} d="M24 49c0-12 7-21 16-21s16 9 16 21-7 20-16 20-16-9-16-20z" />
      <circle cx="33" cy="40" r="7.2" fill={p.paper} stroke={p.ink} strokeWidth="1.1" />
      <circle cx="47" cy="40" r="7.2" fill={p.paper} stroke={p.ink} strokeWidth="1.1" />
      <circle cx="33" cy="40" r="3.1" fill={p.accent} />
      <circle cx="47" cy="40" r="3.1" fill={p.accent} />
      <circle cx="33" cy="40" r="1.3" fill={p.ink} />
      <circle cx="47" cy="40" r="1.3" fill={p.ink} />
      <path d="M40 44l5.2 6.2h-10.4z" fill={hue(earned, "#e07a2f")} stroke={p.ink} strokeWidth="0.7" />
      <Ink p={p} d="M23 31l9 6.5M57 31l-9 6.5" width={1.2} />
      <Ink p={p} d="M27 65h26" width={1.5} />
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
      <path d="M36 71V37" stroke={bark} strokeWidth="5.2" />
      <Ink p={p} d="M36 71V37" width={1.2} />
      <ellipse cx="40" cy="29" rx="21" ry="14.5" fill={leaf} stroke={p.ink} strokeWidth="1.2" />
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

function Filters({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-paper`} x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
        <feColorMatrix in="n" type="luminanceToAlpha" result="a" />
        <feComponentTransfer in="a" result="g">
          <feFuncA type="linear" slope="0.18" />
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="g" mode="multiply" />
      </filter>
      <filter id={`${id}-ink`} x="-12%" y="-12%" width="124%" height="124%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="2" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.35" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  );
}

export function BadgeArt({ badge, earned }: { badge: BadgeDef; earned: boolean }) {
  const p = pal(earned);
  const spirit = badge.id.startsWith("spirit-");
  const key = badge.id.replace(/^spirit-/, "");
  const fid = `b-${badge.id}`;
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
      <Filters id={fid} />
      <Paper p={p} spirit={spirit} fid={fid} />
      {spirit ? (
        <g opacity="0.22" transform="translate(1.6 -1.2)" filter={`url(#${fid}-ink)`}>
          {body}
        </g>
      ) : null}
      <g opacity={spirit ? 0.72 : 1} filter={`url(#${fid}-ink)`}>
        {body}
      </g>
    </svg>
  );
}
