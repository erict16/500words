import type { BadgeDef } from "@/lib/badges";

export function BadgeArt({ badge, earned }: { badge: BadgeDef; earned: boolean }) {
  const ink = earned ? "#2a2a2a" : "#d0d0d0";
  const wash = earned ? "#f4ead8" : "#f3f3f3";
  const accent = earned ? "#2bbbad" : "#d8d8d8";
  return (
    <svg viewBox="0 0 64 64" width="80" height="80" aria-hidden>
      <rect x="4" y="4" width="56" height="56" rx="4" fill={wash} />
      {badge.id.includes("egg") ? (
        <ellipse cx="32" cy="34" rx="14" ry="18" fill={accent} stroke={ink} strokeWidth="1.8" />
      ) : badge.id.includes("turkey") ? (
        <>
          <path d="M18 34c8-16 20-16 28 0" fill={accent} stroke={ink} strokeWidth="1.8" />
          <circle cx="32" cy="38" r="9" fill="#fff" stroke={ink} strokeWidth="1.8" />
          <path d="M32 47v7M26 56h12" stroke={ink} strokeWidth="1.8" />
        </>
      ) : badge.id.includes("penguin") ? (
        <>
          <ellipse cx="32" cy="34" rx="13" ry="17" fill={ink} />
          <ellipse cx="32" cy="38" rx="7" ry="11" fill="#fff" />
          <circle cx="27" cy="28" r="1.4" fill="#fff" />
          <circle cx="37" cy="28" r="1.4" fill="#fff" />
        </>
      ) : badge.id.includes("flamingo") ? (
        <path
          d="M24 52c6-2 8-10 8-18 8 2 16-4 14-12-8 1-14 8-14 16 0 8-2 14-8 16z"
          fill={earned ? "#e8899a" : wash}
          stroke={ink}
          strokeWidth="1.8"
        />
      ) : badge.id.includes("albatross") ? (
        <path d="M8 36c12-12 18-14 24-14s12 2 24 14" fill="none" stroke={ink} strokeWidth="2.2" />
      ) : badge.id.includes("phoenix") ? (
        <path
          d="M32 54V22M18 34c10-6 14-16 14-22 0 6 4 16 14 22"
          fill="none"
          stroke={earned ? "#c45c26" : ink}
          strokeWidth="2"
        />
      ) : badge.id.includes("pterodactyl") ? (
        <path d="M6 40c18-18 34-18 52 0M32 22v20" fill="none" stroke={ink} strokeWidth="2" />
      ) : badge.id.includes("spacebird") ? (
        <>
          <circle cx="32" cy="32" r="18" fill="none" stroke={ink} strokeWidth="1.6" strokeDasharray="3 3" />
          <path d="M20 36c8-12 16-12 24 0" fill="none" stroke={ink} strokeWidth="2" />
        </>
      ) : badge.id === "cheetah" ? (
        <path d="M8 42h48M12 42c8-16 20-16 20-8s8 12 20 8" fill="none" stroke={earned ? "#c48a2a" : ink} strokeWidth="2" />
      ) : badge.id === "night-bat" ? (
        <path d="M8 36c12 10 16-8 24-8s12 18 24 8" fill={ink} />
      ) : badge.id === "early-bird" ? (
        <path d="M12 42c10-18 30-18 40 0M32 14v10" fill="none" stroke={ink} strokeWidth="2" />
      ) : badge.id === "hamster" ? (
        <circle cx="32" cy="34" r="13" fill={accent} stroke={ink} strokeWidth="1.8" />
      ) : badge.id === "oxalis" ? (
        <>
          <circle cx="32" cy="24" r="7" fill={accent} />
          <circle cx="24" cy="38" r="7" fill={accent} />
          <circle cx="40" cy="38" r="7" fill={accent} />
        </>
      ) : badge.id === "turquoise-horse" ? (
        <path
          d="M16 44c4-16 16-24 28-18 2 8-4 16-12 18v8"
          fill={earned ? "#2bbbad" : wash}
          stroke={ink}
          strokeWidth="1.8"
        />
      ) : (
        <path d="M18 46h28v-8c0-10-6-16-14-16s-14 6-14 16z" fill={accent} stroke={ink} strokeWidth="1.8" />
      )}
    </svg>
  );
}
