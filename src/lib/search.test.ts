import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { filterHits, snippet } from "./search.ts";
import { emptyEntry } from "./types.ts";

describe("search", () => {
  it("finds a day by words and returns a snippet around the match", () => {
    const a = { ...emptyEntry("2026-08-01"), text: "hello world from the desk", wordCount: 5 };
    const b = { ...emptyEntry("2026-08-02"), text: "nothing here", wordCount: 2 };
    const hits = filterHits([a, b], "world");
    assert.equal(hits.length, 1);
    assert.equal(hits[0].date, "2026-08-01");
    assert.match(hits[0].snippet, /world/);
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
});
