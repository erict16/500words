"use client";

import { useEffect } from "react";
import { useApp } from "./AppProvider";

export function ConfettiBurst() {
  const { justFinished, settings } = useApp();

  useEffect(() => {
    if (!justFinished) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let cancelled = false;
    void import("canvas-confetti").then((mod) => {
      if (cancelled) return;
      const fire = mod.default;
      const dark = settings.theme === "dark";
      const colors = dark
        ? ["#7dcc8e", "#f0f0f0", "#c4a35a", "#9bb7d4"]
        : ["#1f7a3a", "#222222", "#c4a35a", "#4a6fa5"];
      fire({ particleCount: 120, spread: 70, origin: { y: 0.45 }, colors });
      window.setTimeout(() => {
        fire({ particleCount: 80, spread: 100, origin: { y: 0.4 }, colors });
      }, 220);
      window.setTimeout(() => {
        fire({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
        fire({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
      }, 480);
    });
    return () => {
      cancelled = true;
    };
  }, [justFinished, settings.theme]);

  if (!justFinished) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-24 z-20 flex justify-center"
      aria-live="polite"
    >
      <p
        className="rounded-sm bg-[var(--ink)] px-4 py-2 text-[15px] text-[var(--paper)]"
        data-testid="strike-banner"
      >
        500. That’s a strike.
      </p>
    </div>
  );
}
