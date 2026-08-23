"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { prettyDate } from "@/lib/dates";
import { formatDuration, wordsPerMinute } from "@/lib/session";
import type { SearchHit } from "@/lib/search";
import { countWords } from "@/lib/words";
import { useApp } from "./AppProvider";

function meta(wordCount: number, activeMs: number) {
  const parts = [`${wordCount} words`];
  if (activeMs > 0) parts.push(formatDuration(activeMs));
  const wpm = wordsPerMinute(wordCount, activeMs);
  if (wpm) parts.push(`${wpm} wpm`);
  return parts.join(" · ");
}

export function EntryArchive() {
  const { searchWriting, setDate, entry } = useApp();
  const router = useRouter();
  const [hits, setHits] = useState<SearchHit[]>([]);

  useEffect(() => {
    let live = true;
    void searchWriting("").then((next) => {
      if (live) setHits(next);
    });
    return () => {
      live = false;
    };
  }, [searchWriting, entry.date, entry.wordCount, entry.session.activeMs]);

  if (!hits.length) return null;

  return (
    <section>
      <h2 className="page-h2">Browse your writing</h2>
      <ul className="browse-list" data-testid="archive">
        {hits.map((hit) => {
          const live = hit.date === entry.date;
          const words = live ? countWords(entry.text) || hit.wordCount : hit.wordCount;
          const active = live ? entry.session.activeMs || hit.activeMs : hit.activeMs;
          return (
            <li key={hit.date} className="month-entry">
              <button
                type="button"
                data-testid="archive-hit"
                data-date={hit.date}
                onClick={() => {
                  setDate(hit.date);
                  router.push("/");
                }}
              >
                <div className="month-title">
                  <strong>{prettyDate(hit.date)}</strong>
                </div>
                <div className="month-stats">{meta(words, active)}</div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
