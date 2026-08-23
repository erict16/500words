"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { prettyDate } from "@/lib/dates";
import type { SearchHit } from "@/lib/search";
import { useApp } from "./AppProvider";

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
  }, [searchWriting, entry.date, entry.wordCount]);

  if (!hits.length) return null;

  return (
    <section>
      <h2 className="page-h2">Your pages</h2>
      <ul className="archive" data-testid="archive">
        {hits.map((hit) => (
          <li key={hit.date}>
            <button
              type="button"
              data-testid="archive-hit"
              data-date={hit.date}
              onClick={() => {
                setDate(hit.date);
                router.push("/");
              }}
            >
              <span className="archive-date">{prettyDate(hit.date)}</span>
              <span className="archive-words">{hit.wordCount} words</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
