"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { prettyDate, prettyLongDate } from "@/lib/dates";
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
    <main className="page site-col search-page">
      <h1 className="page-title">Search</h1>
      <p className="page-description">Find entries by keyword across your writing.</p>
      <div className="search-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your writing..."
          className="search-box"
          data-testid="search-input"
          aria-label="Search your writing"
          autoFocus
        />
        <button type="button" className="search-btn" tabIndex={-1}>
          Search
        </button>
      </div>
      {busy ? <p className="subdued">Looking…</p> : null}
      <ul className="results-list" data-testid="search-hits">
        {hits.map((hit) => (
          <li key={hit.date}>
            <button
              type="button"
              className="result-card"
              data-testid={`search-hit-${hit.date}`}
              onClick={() => {
                setDate(hit.date);
                router.push("/");
              }}
            >
              <div className="result-header">
                <span className="result-date">{prettyDate(hit.date)}</span>
                <span className="result-words">{hit.wordCount} words</span>
              </div>
              <div className="result-title">{prettyLongDate(hit.date)}</div>
              <p className="result-snippet">{hit.snippet}</p>
            </button>
          </li>
        ))}
      </ul>
      {!busy && hits.length === 0 ? (
        <div className="empty-state" data-testid="search-empty">
          <p className="empty-title">{query.trim() ? "Nothing matches." : "Search your writing archive"}</p>
          <p className="empty-hint">
            {query.trim() ? "Try another word or a date." : "Find entries by keyword across your entire journal."}
          </p>
        </div>
      ) : null}
    </main>
  );
}
