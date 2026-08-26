"use client";

import { useEffect, useRef, useState } from "react";
import { cx, ui } from "@/lib/css";
import { countWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { useApp } from "./AppProvider";
import { useWriteFocus } from "./WriteFocus";

export function Editor() {
  const { entry, isToday, setText, settings, missedYesterday } = useApp();
  const { focusMode, enterFocus, exitFocus } = useWriteFocus();
  const locked = !isToday || (settings.lockEdits && entry.locked);
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const words = countWords(entry.text);
  const className = cx(ui.area, `font-${settings.font}`);
  const fontSize = focusMode ? Math.max(settings.fontSize, 20) : settings.fontSize;

  useEffect(() => {
    if (settings.hideChrome && focused && words > 0 && !focusMode) enterFocus();
  }, [settings.hideChrome, focused, words, focusMode, enterFocus]);

  useEffect(() => {
    ref.current?.focus();
  }, [isToday, entry.date]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(400, el.scrollHeight)}px`;
  }, [entry.text]);

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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        readOnly={locked}
        spellCheck
        autoCapitalize="sentences"
        autoCorrect="on"
        name="entry"
        placeholder={isToday ? "Write something here..." : ""}
        data-testid="editor"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: settings.lineHeight + settings.paragraphSpacing * 0.15,
        }}
        aria-label="Daily writing"
      />
      <button
        type="button"
        className={ui.exitFocus}
        data-testid="exit-focus"
        aria-label="Exit focus mode"
        title="Exit focus mode (F11 or ESC)"
        onMouseDown={(e) => {
          e.preventDefault();
          exitFocus();
          ref.current?.blur();
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            fill="currentColor"
            d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
          />
        </svg>
      </button>
      <span className="sr-only" aria-live="polite">
        {words} {words === 1 ? "word" : "words"}
      </span>
    </div>
  );
}
