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
    <footer className="site-foot word-foot">
      <div className="site-col foot-bar">
        <Link href="/" className="foot-logo">
          500 Words
        </Link>
        <div className="word-foot-inner">
          <button type="button" className="foot-link no-print" onClick={() => window.print()}>
            Print
          </button>
          {savedFlash ? (
            <p className="saved-flash" aria-live="polite" data-testid="saved-flash">
              saved
            </p>
          ) : (
            <p className="foot-saved" aria-live="polite" data-testid="saved-status">
              {saved}
            </p>
          )}
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
      </div>
    </footer>
  );
}
