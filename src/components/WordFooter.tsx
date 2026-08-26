"use client";

import Link from "next/link";
import { cx, ui } from "@/lib/css";
import { countWords, filledPages, pageTooltipWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { useApp } from "./AppProvider";
import { ExitFocusButton, useWriteFocus } from "./WriteFocus";

function SaveGlyph() {
  return (
    <svg className="footer-mdi-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        fill="currentColor"
        d="M15 9V3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14c1.11 0 2-.89 2-2V9h-6m-6 10H5v-2h4v2m8 0h-6v-4h6v4m0-8H5V5h2v4h8V5h2v6Z"
      />
    </svg>
  );
}

export function WordFooter() {
  const { entry, saving, savedFlash, lastSavedAt } = useApp();
  const { focusMode } = useWriteFocus();
  const words = countWords(entry.text);
  const done = words >= WORD_GOAL || entry.locked;
  const pages = filledPages(words);

  return (
    <>
      <ExitFocusButton />
      <footer
        className={cx(ui.foot, ui.wordFoot, focusMode && "write-footer--focus")}
        id="write-page-footer"
      >
        <div className={cx(ui.col, ui.writeFootBar, "footer-content")}>
          {done ? (
            <Link
              href="/stats"
              className={cx(ui.statsButton, "footer-button")}
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
            <p className={cx(ui.footerText, ui.savedFlash, "mono", "save-status--saved")} aria-live="polite" data-testid="saved-flash">
              {" "}
              • <SaveGlyph />
            </p>
          ) : lastSavedAt && words > 0 && !saving ? (
            <p className={cx(ui.footerText, ui.footSaved, "mono", "save-status--saved")} aria-live="polite" data-testid="saved-status">
              {" "}
              • <SaveGlyph />
            </p>
          ) : null}
        </div>
      </footer>
    </>
  );
}
