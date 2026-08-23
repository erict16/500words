"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { prettyDate, prettyLongDate } from "@/lib/dates";
import {
  SORTS,
  highlightParts,
  monthSparkline,
  sortHits,
  type SearchHit,
  type SortId,
} from "@/lib/search";

function Snippet({ text, query }: { text: string; query: string }) {
  const parts = highlightParts(text, query);
  return (
    <p className="result-snippet">
      {parts.map((part, i) => (part.hit ? <b key={i}>{part.t}</b> : <span key={i}>{part.t}</span>))}
    </p>
  );
}

export default function SearchPage() {
  const { searchWriting, setDate } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [busy, setBusy] = useState(false);
  const [sort, setSort] = useState<SortId>("relevance");
  const [monthFilter, setMonthFilter] = useState<string | null>(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const tipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    const q = query.trim();
    if (!q) {
      setHits([]);
      setBusy(false);
      setMonthFilter(null);
      return;
    }
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

  useEffect(() => {
    if (!tipsOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!tipsRef.current?.contains(e.target as Node)) setTipsOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [tipsOpen]);

  const searched = Boolean(query.trim());
  const spark = useMemo(() => monthSparkline(hits), [hits]);
  const visible = useMemo(() => {
    const filtered = monthFilter ? hits.filter((h) => h.date.startsWith(monthFilter)) : hits;
    return sortHits(filtered, sort);
  }, [hits, monthFilter, sort]);
  const hovered = spark.find((b) => b.key === hoveredBar);
  const activeBar = spark.find((b) => b.key === monthFilter);

  return (
    <main className={`page site-col search-page ${searched ? "has-results" : ""}`}>
      <h1 className="page-title">Search</h1>
      <p className="page-description">Find entries by keyword across your writing.</p>
      <form
        className="search-row"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setMonthFilter(null);
          }}
          placeholder="Search your writing..."
          className="search-box"
          data-testid="search-input"
          aria-label="Search your writing"
          autoFocus
        />
        <button type="submit" className="search-btn" disabled={!query.trim()}>
          Search
        </button>
      </form>
      <div className="options-row">
        <div className="options-left" ref={tipsRef}>
          <button
            type="button"
            className="tips-link"
            data-testid="search-tips"
            aria-expanded={tipsOpen}
            onClick={() => setTipsOpen((open) => !open)}
          >
            Tips
          </button>
          {tipsOpen ? (
            <div className="tips-card" role="dialog" aria-label="Search tips">
              <div className="tips-content">
                <div className="tip">
                  <strong>Multiple words</strong> matches all terms
                </div>
                <div className="tip">
                  <strong>&quot;exact phrase&quot;</strong> matches exact phrase
                </div>
                <div className="tip">
                  <strong>career OR job</strong> matches either
                </div>
                <div className="tip">
                  <strong>-money</strong> excludes that word
                </div>
              </div>
            </div>
          ) : null}
          {searched && !busy && hits.length > 0 ? (
            <span className="result-count" data-testid="result-count">
              {visible.length} {visible.length === 1 ? "entry" : "entries"}
            </span>
          ) : null}
          {searched && !busy && hits.length === 0 ? (
            <span className="result-count" data-testid="result-count">
              No results
            </span>
          ) : null}
        </div>
        <div className="options-dropdowns">
          <select
            className="control-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            aria-label="Sort results"
            data-testid="search-sort"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {spark.length > 1 ? (
        <div className="sparkline-container" data-testid="search-spark">
          <div className="sparkline-bars">
            {spark.map((bar) => (
              <button
                key={bar.key}
                type="button"
                className={`sparkline-bar-wrapper ${monthFilter === bar.key ? "is-active" : ""} ${
                  monthFilter && monthFilter !== bar.key ? "is-dimmed" : ""
                } ${bar.count === 0 ? "is-empty" : ""}`}
                disabled={bar.count === 0}
                title={`${bar.label}: ${bar.count} ${bar.count === 1 ? "entry" : "entries"}`}
                onClick={() => setMonthFilter((cur) => (cur === bar.key ? null : bar.key))}
                onMouseEnter={() => setHoveredBar(bar.key)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <span className="sparkline-bar" style={{ height: `${bar.heightPct}%` }} />
              </button>
            ))}
          </div>
          <div className="sparkline-label">
            {hovered ? (
              `${hovered.label}: ${hovered.count} ${hovered.count === 1 ? "entry" : "entries"}`
            ) : monthFilter && activeBar ? (
              <>
                {activeBar.label}: {activeBar.count} {activeBar.count === 1 ? "entry" : "entries"}{" "}
                <button type="button" className="sparkline-clear" onClick={() => setMonthFilter(null)}>
                  ×
                </button>
              </>
            ) : (
              `${hits.length} ${hits.length === 1 ? "result" : "results"} across ${spark.length} months`
            )}
          </div>
        </div>
      ) : null}
      {busy ? <p className="subdued">Looking…</p> : null}
      <ul className="results-list" data-testid="search-hits">
        {visible.map((hit) => (
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
              <Snippet text={hit.snippet} query={query} />
            </button>
          </li>
        ))}
      </ul>
      {!busy && hits.length === 0 ? (
        <div className="empty-state" data-testid="search-empty">
          <svg className="empty-icon" viewBox="0 0 24 24" width="48" height="48" aria-hidden>
            <path
              fill="currentColor"
              d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"
            />
          </svg>
          <p className="empty-title">
            {query.trim() ? `No entries found for “${query.trim()}”` : "Search your writing archive"}
          </p>
          <p className="empty-hint">
            {query.trim()
              ? "Try different keywords, a broader phrase, or remove date filters."
              : "Find entries by keyword across your entire journal."}
          </p>
        </div>
      ) : null}
    </main>
  );
}
