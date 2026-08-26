"use client";

import { useEffect, useRef, useState } from "react";
import { cx, ui } from "@/lib/css";
import { countWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { useApp } from "./AppProvider";

export function Editor() {
  const { entry, isToday, setText, settings, missedYesterday } = useApp();
  const locked = !isToday || (settings.lockEdits && entry.locked);
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const words = countWords(entry.text);
  const className = cx(ui.area, `font-${settings.font}`);
  const hideChrome = settings.hideChrome && focused && !paused && words > 0;

  useEffect(() => {
    if (hideChrome) document.documentElement.dataset.writeFocus = "1";
    else delete document.documentElement.dataset.writeFocus;
    return () => {
      delete document.documentElement.dataset.writeFocus;
    };
  }, [hideChrome]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !document.documentElement.dataset.writeFocus) return;
      setPaused(true);
      setFocused(false);
      ref.current?.blur();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    ref.current?.focus();
  }, [isToday, entry.date]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onType = () => {
      const value = el.value;
      const pos = el.selectionStart ?? value.length;
      const before = value.slice(0, pos);
      const lines = before.split("\n").length;
      const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight) || 32;
      const caretY = lines * lineHeight;
      const view = window.innerHeight * 0.55;
      const next = caretY - view + 120;
      if (next > window.scrollY) {
        window.scrollTo({ top: next, behavior: "auto" });
      }
    };
    el.addEventListener("keyup", onType);
    return () => el.removeEventListener("keyup", onType);
  }, []);

  return (
    <div className={ui.writeCol}>
      {!isToday ? (
        <p className={ui.writeNote}>
          {entry.date} is closed. You can read it. You can’t add words to a past day.
        </p>
      ) : null}
      {isToday && settings.lockEdits && entry.locked ? (
        <p className={ui.writeNote}>
          Today is locked. Turn that off in Settings if you want to keep going.
        </p>
      ) : null}
      {isToday && missedYesterday ? (
        <p className={ui.notice} data-testid="makeup-banner">
          You missed yesterday. Write {WORD_GOAL * 2} words today to keep the streak
          (a makeup day). A day starts at midnight in your timezone. Older misses break
          the streak.
        </p>
      ) : null}
      <textarea
        ref={ref}
        id="write"
        className={className}
        value={entry.text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => {
          setPaused(false);
          setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        readOnly={locked}
        spellCheck
        autoCapitalize="sentences"
        autoCorrect="on"
        name="entry"
        placeholder={isToday ? "Write something here..." : ""}
        data-testid="editor"
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineHeight + settings.paragraphSpacing * 0.15,
        }}
        aria-label="Daily writing"
      />
      {settings.hideChrome ? (
        <button
          type="button"
          className={ui.exitFocus}
          data-testid="exit-focus"
          aria-label="Close"
          onMouseDown={(e) => {
            e.preventDefault();
            setPaused(true);
            setFocused(false);
            ref.current?.blur();
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <path
              fill="currentColor"
              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {words} {words === 1 ? "word" : "words"}
      </span>
    </div>
  );
}
