import assert from "node:assert/strict";
import test from "node:test";
import { emptyEntry } from "./types.ts";
import {
  CONFLICT_RULE,
  isEmptyDay,
  mergeDiaries,
  pickWinningDay,
  shouldMergeLocalIntoCloud,
} from "./sync.ts";

function day(date: string, text: string, updatedAt: number, extra?: Partial<ReturnType<typeof emptyEntry>>) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return {
    ...emptyEntry(date),
    text,
    wordCount: words,
    updatedAt,
    ...extra,
  };
}

test("conflict rule is last-write-wins", () => {
  assert.equal(CONFLICT_RULE, "last-write-wins");
});

test("newer local writing beats older cloud writing", () => {
  const local = day("2026-08-22", "device a later", 200);
  const cloud = day("2026-08-22", "device b earlier", 100);
  assert.equal(pickWinningDay(local, cloud).text, "device a later");
});

test("newer cloud writing beats older local writing", () => {
  const local = day("2026-08-22", "stale laptop", 50);
  const cloud = day("2026-08-22", "phone just now", 90);
  assert.equal(pickWinningDay(local, cloud).text, "phone just now");
});

test("empty never overwrites writing, even with a newer timestamp", () => {
  const local = day("2026-08-22", "kept on this device", 10);
  const cloud = day("2026-08-22", "", 999);
  assert.equal(pickWinningDay(local, cloud).text, "kept on this device");
  assert.equal(pickWinningDay(cloud, local).text, "kept on this device");
});

test("equal timestamps prefer more words, then cloud", () => {
  const short = day("2026-08-22", "hi", 50);
  const long = day("2026-08-22", "hi there friend", 50);
  assert.equal(pickWinningDay(short, long).text, "hi there friend");
  const a = day("2026-08-22", "same words", 50);
  const b = day("2026-08-22", "same words", 50);
  assert.equal(pickWinningDay(a, b).text, b.text);
  assert.equal(pickWinningDay(a, b), b);
});

test("sign-in merge uploads local-only days and caches cloud-only days", () => {
  const local = {
    "2026-08-01": day("2026-08-01", "guest morning pages", 20),
    "2026-08-02": day("2026-08-02", "older local", 10),
  };
  const cloud = {
    "2026-08-02": day("2026-08-02", "newer phone", 40),
    "2026-08-03": day("2026-08-03", "only in cloud", 30),
  };
  const merged = mergeDiaries(local, cloud);
  assert.equal(merged.rule, "last-write-wins");
  assert.equal(merged.days["2026-08-01"]?.text, "guest morning pages");
  assert.equal(merged.days["2026-08-02"]?.text, "newer phone");
  assert.equal(merged.days["2026-08-03"]?.text, "only in cloud");
  assert.deepEqual(
    merged.toUpload.map((d) => d.date),
    ["2026-08-01"],
  );
  assert.deepEqual(
    merged.toCache.map((d) => d.date).sort(),
    ["2026-08-02", "2026-08-03"],
  );
});

test("empty cloud day does not count as a conflict win", () => {
  assert.equal(isEmptyDay(emptyEntry("2026-08-22")), true);
  const merged = mergeDiaries(
    { "2026-08-22": day("2026-08-22", "from guest", 5) },
    { "2026-08-22": emptyEntry("2026-08-22") },
  );
  assert.equal(merged.days["2026-08-22"]?.text, "from guest");
  assert.equal(merged.toUpload.length, 1);
});

test("a different Google account does not inherit this device's diary", () => {
  assert.equal(shouldMergeLocalIntoCloud(null, "uid-a"), true);
  assert.equal(shouldMergeLocalIntoCloud("uid-a", "uid-a"), true);
  assert.equal(shouldMergeLocalIntoCloud("uid-a", "uid-b"), false);
});
