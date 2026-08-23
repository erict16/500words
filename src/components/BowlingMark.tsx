import type { DayMark } from "@/lib/types";

export function BowlingMark({ mark }: { mark: DayMark }) {
  if (mark !== "spare" && mark !== "strike") return null;
  return (
    <svg className="mark" viewBox="0 0 28 28" aria-hidden>
      {mark === "spare" ? (
        <line x1="5" y1="23" x2="23" y2="5" />
      ) : (
        <>
          <line x1="5" y1="5" x2="23" y2="23" />
          <line x1="23" y1="5" x2="5" y2="23" />
        </>
      )}
    </svg>
  );
}
