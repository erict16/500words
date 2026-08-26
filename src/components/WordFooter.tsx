"use client";

import Link from "next/link";
import { cx, ui } from "@/lib/css";
import { countWords, filledPages, pageTooltipWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { useApp } from "./AppProvider";

function clock(ms: number) {
  return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function WordFooter() {
  const { entry, saving, savedFlash, lastSavedAt } = useApp();
  const words = countWords(entry.text);
  const done = words >= WORD_GOAL || entry.locked;
  const pages = filledPages(words);
  const saved = saving
    ? "saving…"
    : savedFlash
      ? "saved"
      : lastSavedAt
        ? `saved ${clock(lastSavedAt)}`
        : "";

  return (
    <footer className={cx(ui.foot, ui.wordFoot)} id="write-page-footer">
      <div className={cx(ui.col, ui.writeFootBar, "footer-content")}>
        {done ? (
          <Link
            href="/stats"
            className={cx(ui.statsButton, ui.wordGood)}
            data-testid="see-stats"
            title="Today’s stats"
          >
            🎉 SEE STATS
          </Link>
        ) : null}
        {pages > 0 ? (
          <span className={ui.footerIcons} data-testid="page-icons" aria-label={`${pages} pages toward ${WORD_GOAL} words`}>
            {Array.from({ length: pages }, (_, i) => {
              const n = i + 1;
              return (
                <img
                  key={n}
                  src="/images/page-transparent.png"
                  height={16}
                  width={12}
                  alt=""
                  className={ui.pageIcon}
                  title={`${n} ${n === 1 ? "page" : "pages"} = ${pageTooltipWords(n)} words`}
                />
              );
            })}
          </span>
        ) : null}
        {words > 0 ? (
          <p className={cx(ui.footerText, "mono")} data-testid="word-count">
            {words} words
          </p>
        ) : (
          <p className={cx(ui.footerText, ui.tagline)} data-testid="word-count">
            Private, unfiltered, spontaneous, daily
          </p>
        )}
        {savedFlash ? (
          <p className={cx(ui.footerText, ui.savedFlash, "mono")} aria-live="polite" data-testid="saved-flash">
            {" "}
            • saved
          </p>
        ) : saved ? (
          <p className={cx(ui.footerText, ui.footSaved, "mono")} aria-live="polite" data-testid="saved-status">
            {" "}
            • {saved}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
