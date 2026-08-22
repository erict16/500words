"use client";

import Link from "next/link";
import { countWords } from "@/lib/words";
import { WORD_GOAL } from "@/lib/types";
import { useApp } from "./AppProvider";

export function WordFooter() {
  const { entry, saving, lastSavedAt, isToday } = useApp();
  const words = countWords(entry.text);
  const done = words >= WORD_GOAL || entry.locked;
  const saved = saving ? "saving…" : lastSavedAt ? "saved" : "";

  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-[var(--line)] bg-[var(--paper)]/95 px-4 py-2 backdrop-blur-[2px]">
      <div className="flex items-baseline justify-between gap-4 text-[13px]">
        {done ? (
          <Link href="/stats" className="word-good">
            {words} words
          </Link>
        ) : (
          <p>
            {words} / {WORD_GOAL}
            {isToday ? ` · ${Math.max(0, WORD_GOAL - words)} to go` : ""}
          </p>
        )}
        <p className="text-[var(--muted)]">{saved}</p>
      </div>
    </footer>
  );
}
