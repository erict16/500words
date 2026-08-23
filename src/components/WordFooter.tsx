"use client";

import Link from "next/link";
import { countWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { useApp } from "./AppProvider";

function clock(ms: number) {
  return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function WordFooter() {
  const { entry, saving, savedFlash, lastSavedAt } = useApp();
  const words = countWords(entry.text);
  const done = words >= WORD_GOAL || entry.locked;
  const saved = saving
    ? "saving…"
    : savedFlash
      ? "saved"
      : lastSavedAt
        ? `saved ${clock(lastSavedAt)}`
        : "";

  return (
    <footer className="word-foot">
      <div className="site-col word-foot-inner">
        <div className="flex items-baseline gap-3">
          <button
            type="button"
            className="chrome-link no-print"
            onClick={() => window.print()}
          >
            Print
          </button>
          {savedFlash ? (
            <p className="saved-flash" aria-live="polite" data-testid="saved-flash">
              saved
            </p>
          ) : (
            <p className="text-[var(--muted)] text-[12px]" aria-live="polite" data-testid="saved-status">
              {saved}
            </p>
          )}
        </div>
        {done ? (
          <Link href="/stats" className="word-count word-good" data-testid="word-count" title="Today’s stats">
            {words}
          </Link>
        ) : (
          <p className="word-count" data-testid="word-count">
            {words} / {WORD_GOAL}
          </p>
        )}
      </div>
    </footer>
  );
}
