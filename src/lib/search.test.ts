import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  filterHits,
  highlightParts,
  matchesQuery,
  monthSparkline,
  snippet,
  sortHits,
} from "./search.ts";
import { emptyEntry } from "./types.ts";

describe("search", () => {
  it("finds a day by words and returns a snippet around the match", () => {
    const a = { ...emptyEntry("2026-08-01"), text: "hello world from the desk", wordCount: 5 };
    const b = { ...emptyEntry("2026-08-02"), text: "nothing here", wordCount: 2 };
    const hits = filterHits([a, b], "world");
    assert.equal(hits.length, 1);
    assert.equal(hits[0].date, "2026-08-01");
    assert.match(hits[0].snippet, /world/);
    assert.equal(hits[0].activeMs, 0);
  });

  it("carries session time onto archive hits", () => {
    const a = {
      ...emptyEntry("2026-08-01"),
      text: "hello",
      wordCount: 1,
      session: { ...emptyEntry("2026-08-01").session, activeMs: 120000 },
    };
    const hits = filterHits([a], "");
    assert.equal(hits[0].activeMs, 120000);
  });

  it("lists recent days when the query is empty", () => {
    const days = [
      { ...emptyEntry("2026-08-01"), text: "one", wordCount: 1 },
      { ...emptyEntry("2026-08-03"), text: "three", wordCount: 1 },
    ];
    const hits = filterHits(days, "");
    assert.deepEqual(
      hits.map((h) => h.date),
      ["2026-08-03", "2026-08-01"],
    );
  });

  it("skips empty days", () => {
    const hits = filterHits([emptyEntry("2026-08-01")], "x");
    assert.equal(hits.length, 0);
  });

  it("clips a snippet", () => {
    assert.equal(snippet("short", ""), "short");
    assert.match(snippet("aaaa world bbbb", "world"), /world/);
  });

  it("requires every word (750 multiple-terms tip)", () => {
    const a = { ...emptyEntry("2026-08-01"), text: "career and job talk", wordCount: 4 };
    const b = { ...emptyEntry("2026-08-02"), text: "career change only", wordCount: 3 };
    const hits = filterHits([a, b], "career job");
    assert.deepEqual(
      hits.map((h) => h.date),
      ["2026-08-01"],
    );
  });

  it("matches either side of OR", () => {
    assert.equal(matchesQuery("looking for a job", "2026-08-01", "career OR job"), true);
    assert.equal(matchesQuery("painting the porch", "2026-08-01", "career OR job"), false);
  });

  it("excludes -terms", () => {
    const a = { ...emptyEntry("2026-08-01"), text: "money worries again", wordCount: 3 };
    const b = { ...emptyEntry("2026-08-02"), text: "quiet morning pages", wordCount: 3 };
    const hits = filterHits([a, b], "-money");
    assert.deepEqual(
      hits.map((h) => h.date),
      ["2026-08-02"],
    );
  });

  it("matches a quoted phrase", () => {
    const a = { ...emptyEntry("2026-08-01"), text: "the exact phrase lives here", wordCount: 5 };
    const b = { ...emptyEntry("2026-08-02"), text: "exact and phrase apart", wordCount: 4 };
    const hits = filterHits([a, b], '"exact phrase"');
    assert.equal(hits.length, 1);
    assert.equal(hits[0].date, "2026-08-01");
  });

  it("sorts longest first", () => {
    const hits = sortHits(
      [
        { date: "2026-08-02", wordCount: 10, snippet: "b", activeMs: 0 },
        { date: "2026-08-03", wordCount: 40, snippet: "a", activeMs: 0 },
        { date: "2026-08-01", wordCount: 40, snippet: "c", activeMs: 0 },
      ],
      "word_count",
    );
    assert.deepEqual(
      hits.map((h) => h.date),
      ["2026-08-03", "2026-08-01", "2026-08-02"],
    );
  });

  it("wraps matches for the snippet <b> highlight", () => {
    const parts = highlightParts("hello world from the desk", "world");
    assert.deepEqual(parts, [
      { t: "hello " },
      { t: "world", hit: true },
      { t: " from the desk" },
    ]);
  });

  it("builds a monthly sparkline when hits span months", () => {
    const bars = monthSparkline([
      { date: "2026-07-02", wordCount: 10, snippet: "", activeMs: 0 },
      { date: "2026-08-01", wordCount: 10, snippet: "", activeMs: 0 },
      { date: "2026-08-03", wordCount: 10, snippet: "", activeMs: 0 },
    ]);
    assert.equal(bars.length, 2);
    assert.equal(bars[0].key, "2026-07");
    assert.equal(bars[1].count, 2);
    assert.equal(bars[1].heightPct, 100);
  });
});
