"use client";

import Link from "next/link";
import { cx, ui } from "@/lib/css";
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
    <footer className={cx(ui.foot, ui.wordFoot)}>
      <div className={cx(ui.col, ui.writeFootBar, "flex items-center justify-between gap-4 py-4 text-sm")}>
        <p className={cx(ui.tagline, "font-serif text-[14px] text-[color:var(--text-secondary)]")}>
          Private, unfiltered, spontaneous, daily
        </p>
        <div className={ui.wordFootInner}>
          {savedFlash ? (
            <p className={ui.savedFlash} aria-live="polite" data-testid="saved-flash">
              saved
            </p>
          ) : (
            <p className={ui.footSaved} aria-live="polite" data-testid="saved-status">
              {saved}
            </p>
          )}
          {done ? (
            <Link href="/stats" className={cx(ui.wordCount, ui.wordGood)} data-testid="word-count" title="Today’s stats">
              {words}
            </Link>
          ) : (
            <p className={ui.wordCount} data-testid="word-count">
              {words > 0 ? `${words} / ${WORD_GOAL}` : String(WORD_GOAL)}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
