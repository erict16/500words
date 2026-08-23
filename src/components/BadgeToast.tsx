"use client";

import { useEffect } from "react";
import { BADGE_MAP } from "@/lib/badges";
import { useApp } from "./AppProvider";

export function BadgeToast() {
  const { newBadges, justFinished, clearCelebration } = useApp();

  useEffect(() => {
    if (!newBadges.length || justFinished) return;
    const id = window.setTimeout(() => clearCelebration(), 4200);
    return () => window.clearTimeout(id);
  }, [newBadges, justFinished, clearCelebration]);

  if (!newBadges.length) return null;
  const names = newBadges.map((id) => BADGE_MAP[id]?.name ?? id).join(" · ");

  return (
    <div className="pointer-events-none fixed inset-x-0 top-36 z-20 flex justify-center">
      <p
        className="bg-[var(--paper)] px-4 py-2 text-[14px] text-[var(--ink)] shadow-sm"
        data-testid="new-badge-toast"
        aria-live="polite"
      >
        {names}
      </p>
    </div>
  );
}
