"use client";

import { useEffect, useRef } from "react";
import { countWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { useApp } from "./AppProvider";

export function Editor() {
  const { entry, isToday, setText, settings, missedYesterday, tip } = useApp();
  const ref = useRef<HTMLTextAreaElement>(null);
  const words = countWords(entry.text);
  const className = `write-area font-${settings.font}`;

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
    <div className="px-6">
      {!isToday ? (
        <p className="mx-auto mb-2 max-w-2xl text-[13px] text-[var(--muted)]">
          {entry.date} is closed. You can read it. You can’t add words to a past day.
        </p>
      ) : null}
      {isToday && missedYesterday ? (
        <p className="mx-auto mb-2 max-w-2xl text-[13px] text-[var(--muted)]">
          You missed yesterday. Write {WORD_GOAL * 2} words today to keep the streak
          (a makeup day).
        </p>
      ) : null}
      {isToday && tip ? (
        <p className="mx-auto mb-2 max-w-2xl text-[13px] italic text-[var(--muted)]">
          {tip}
        </p>
      ) : null}
      <textarea
        ref={ref}
        id="write"
        className={className}
        value={entry.text}
        onChange={(e) => setText(e.target.value)}
        readOnly={!isToday}
        spellCheck
        autoCapitalize="sentences"
        autoCorrect="on"
        name="entry"
        placeholder={isToday ? "Write…" : ""}
        data-testid="editor"
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineHeight + settings.paragraphSpacing * 0.15,
        }}
        aria-label="Daily writing"
      />
      <span className="sr-only">
        {words} of {WORD_GOAL} words
      </span>
    </div>
  );
}
