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
    <footer className="pointer-events-none fixed bottom-0 left-0 right-0 px-7 py-3">
      <div className="pointer-events-auto mx-auto flex max-w-[960px] items-baseline justify-between gap-4">
        {done ? (
          <Link href="/stats" className="word-count word-good" data-testid="word-count" title="Today’s stats">
            {words}
          </Link>
        ) : (
          <p className="word-count" data-testid="word-count">
            {words} / {WORD_GOAL}
          </p>
        )}
        <div className="flex items-baseline gap-3">
          <button
            type="button"
            className="chrome-link no-print"
            onClick={() => window.print()}
          >
            Print
          </button>
          {savedFlash ? (
            <p
              className="bg-[var(--good)] px-2 py-0.5 text-[12px] text-white"
              aria-live="polite"
              data-testid="saved-flash"
            >
              saved
            </p>
          ) : (
            <p className="text-[var(--muted)]" aria-live="polite" data-testid="saved-status">
              {saved}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
