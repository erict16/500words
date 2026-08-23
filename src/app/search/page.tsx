"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { prettyDate } from "@/lib/dates";
import type { SearchHit } from "@/lib/search";

export default function SearchPage() {
  const { searchWriting, setDate } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    setBusy(true);
    const id = window.setTimeout(() => {
      void searchWriting(query).then((next) => {
        if (!live) return;
        setHits(next);
        setBusy(false);
      });
    }, 180);
    return () => {
      live = false;
      window.clearTimeout(id);
    };
  }, [query, searchWriting]);

  return (
    <main className="page site-col">
      <h1 className="page-title">Search</h1>
      <p className="page-kicker">Your writing only. Nothing leaves this account.</p>
      <label className="field">
        Find a word, a date, a sentence
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder=""
          className="field-control"
          data-testid="search-input"
          autoFocus
        />
      </label>
      {busy ? <p className="mt-4 text-[13px] text-[var(--muted)]">Looking…</p> : null}
      <ul className="archive mt-6" data-testid="search-hits">
        {hits.map((hit) => (
          <li key={hit.date}>
            <button
              type="button"
              data-testid={`search-hit-${hit.date}`}
              onClick={() => {
                setDate(hit.date);
                router.push("/");
              }}
            >
              <span>
                <span className="archive-date">{prettyDate(hit.date)}</span>
                <span className="mt-1 block text-[15px] leading-relaxed text-[var(--ink)]">
                  {hit.snippet}
                </span>
              </span>
              <span className="archive-words">{hit.wordCount} words</span>
            </button>
          </li>
        ))}
      </ul>
      {!busy && hits.length === 0 ? (
        <p className="mt-6 text-[14px] text-[var(--muted)]" data-testid="search-empty">
          {query.trim() ? "Nothing matches." : "No entries yet."}
        </p>
      ) : null}
    </main>
  );
}
