import type { BadgeDef } from "@/lib/badges";

export function BadgeArt({ badge, earned }: { badge: BadgeDef; earned: boolean }) {
  const color = earned ? "#222" : "#c8c8c8";
  return (
    <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden>
      {badge.id.includes("egg") ? (
        <ellipse cx="32" cy="34" rx="16" ry="20" fill="none" stroke={color} strokeWidth="2" />
      ) : badge.id.includes("turkey") ? (
        <>
          <circle cx="32" cy="36" r="10" fill="none" stroke={color} strokeWidth="2" />
          <path d="M18 30c6-14 22-14 28 0" fill="none" stroke={color} strokeWidth="2" />
          <path d="M32 46v8M26 54h12" stroke={color} strokeWidth="2" />
        </>
      ) : badge.id.includes("penguin") ? (
        <>
          <ellipse cx="32" cy="34" rx="14" ry="18" fill="none" stroke={color} strokeWidth="2" />
          <ellipse cx="32" cy="38" rx="8" ry="12" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="27" cy="28" r="1.5" fill={color} />
          <circle cx="37" cy="28" r="1.5" fill={color} />
        </>
      ) : badge.id.includes("flamingo") ? (
        <path
          d="M22 50c8-2 10-10 10-18 8 2 16-4 16-12-10 2-16 8-16 16 0 10-2 16-10 18z"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      ) : badge.id.includes("albatross") ? (
        <path d="M8 36c12-10 18-12 24-12s12 2 24 12" fill="none" stroke={color} strokeWidth="2" />
      ) : badge.id.includes("phoenix") ? (
        <path d="M32 54V22M20 30c8-4 12-12 12-18 0 6 4 14 12 18" fill="none" stroke={color} strokeWidth="2" />
      ) : badge.id.includes("pterodactyl") ? (
        <path d="M6 40c18-18 34-18 52 0M32 22v20" fill="none" stroke={color} strokeWidth="2" />
      ) : badge.id.includes("spacebird") ? (
        <>
          <circle cx="32" cy="32" r="20" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 4" />
          <path d="M20 36c8-12 16-12 24 0" fill="none" stroke={color} strokeWidth="2" />
        </>
      ) : badge.id === "cheetah" ? (
        <path d="M8 40h48M12 40c8-16 20-16 20-8s8 12 20 8" fill="none" stroke={color} strokeWidth="2" />
      ) : badge.id === "night-bat" ? (
        <path d="M8 36c12 8 16-8 24-8s12 16 24 8" fill="none" stroke={color} strokeWidth="2" />
      ) : badge.id === "early-bird" ? (
        <path d="M12 40c10-16 30-16 40 0M32 16v8" fill="none" stroke={color} strokeWidth="2" />
      ) : badge.id === "hamster" ? (
        <circle cx="32" cy="32" r="14" fill="none" stroke={color} strokeWidth="2" />
      ) : badge.id === "oxalis" ? (
        <>
          <circle cx="32" cy="24" r="8" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="24" cy="38" r="8" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="40" cy="38" r="8" fill="none" stroke={color} strokeWidth="2" />
        </>
      ) : badge.id === "turquoise-horse" ? (
        <path d="M16 44c4-16 16-24 28-18 2 8-4 16-12 18v8" fill="none" stroke={earned ? "#2a9d8f" : color} strokeWidth="2" />
      ) : (
        <path d="M18 44h28v-8c0-10-6-16-14-16s-14 6-14 16z" fill="none" stroke={color} strokeWidth="2" />
      )}
    </svg>
  );
}
