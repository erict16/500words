"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
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
    <main className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-georgia text-3xl">Search</h1>
      <p className="mt-2 text-[14px] text-[var(--muted)]">
        Your writing only. Nothing leaves this account.
      </p>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find a word, a date, a sentence…"
        className="mt-6 w-full border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[16px] text-[var(--ink)]"
        data-testid="search-input"
        autoFocus
      />
      {busy ? <p className="mt-4 text-[13px] text-[var(--muted)]">Looking…</p> : null}
      <ul className="mt-6 space-y-4" data-testid="search-hits">
        {hits.map((hit) => (
          <li key={hit.date}>
            <button
              type="button"
              className="block w-full text-left"
              data-testid={`search-hit-${hit.date}`}
              onClick={() => {
                setDate(hit.date);
                router.push("/");
              }}
            >
              <span className="text-[13px] text-[var(--muted)]">
                {hit.date} · {hit.wordCount} words
              </span>
              <span className="mt-1 block text-[16px] leading-relaxed">{hit.snippet}</span>
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
