import type { DayMark } from "@/lib/types";

export function BowlingMark({ mark }: { mark: DayMark }) {
  if (mark !== "spare" && mark !== "strike") return null;
  return (
    <svg className="mark" viewBox="0 0 20 20" aria-hidden>
      {mark === "spare" ? (
        <line x1="3" y1="17" x2="17" y2="3" />
      ) : (
        <>
          <line x1="3" y1="3" x2="17" y2="17" />
          <line x1="17" y1="3" x2="3" y2="17" />
        </>
      )}
    </svg>
  );
}
