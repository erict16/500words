import assert from "node:assert/strict";
import test from "node:test";
import {
  applyChallenge,
  applyLifetime,
  applySave,
  emptyLifetime,
  emptyMonth,
  missedYesterday,
  publicScore,
} from "./engine.ts";
import { emptyEntry, emptySession, WORD_GOAL } from "./types.ts";

const words = (n: number) => Array.from({ length: n }, (_, i) => `w${i}`).join(" ");

test("rejects writing on a past day", () => {
  assert.throws(() =>
    applySave({
      existing: emptyEntry("2026-08-01"),
      text: "hi",
      previousBase: [0, 0],
      date: "2026-08-01",
      today: "2026-08-22",
      session: emptySession(),
      yesterday: null,
    }),
  );
});

test("strike at 500 locks points", () => {
  const first = applySave({
    existing: emptyEntry("2026-08-22"),
    text: words(WORD_GOAL),
    previousBase: [2, 2],
    date: "2026-08-22",
    today: "2026-08-22",
    session: emptySession(),
    yesterday: null,
  });
  assert.equal(first.justFinished, true);
  assert.equal(first.entry.locked, true);
  assert.equal(first.entry.mark, "strike");
  assert.equal(first.entry.points, 6);

  const afterDelete = applySave({
    existing: first.entry,
    text: "oops",
    previousBase: [2, 2],
    date: "2026-08-22",
    today: "2026-08-22",
    session: emptySession(),
    yesterday: null,
  });
  assert.equal(afterDelete.justFinished, false);
  assert.equal(afterDelete.entry.points, 6);
  assert.equal(afterDelete.entry.locked, true);
  assert.equal(afterDelete.entry.mark, "strike");
  assert.equal(afterDelete.entry.wordCount, 1);
});

test("makeup day when writing 1000 after a miss", () => {
  const yesterday = emptyEntry("2026-08-21");
  yesterday.wordCount = 40;
  const result = applySave({
    existing: emptyEntry("2026-08-22"),
    text: words(1000),
    previousBase: [0, 2],
    date: "2026-08-22",
    today: "2026-08-22",
    session: emptySession(),
    yesterday,
  });
  assert.equal(result.makeupYesterday, true);
  assert.equal(result.entry.locked, true);
});

test("lifetime streak continues after makeup", () => {
  const prev = emptyLifetime();
  prev.lastCompleted = "2026-08-20";
  prev.currentStreak = 4;
  prev.lastWordDate = "2026-08-20";
  const entry = emptyEntry("2026-08-22");
  entry.wordCount = 500;
  const next = applyLifetime(prev, "2026-08-22", entry, emptySession(), 9, true, true);
  assert.equal(next.currentStreak, 5);
  assert.equal(next.lastCompleted, "2026-08-22");
});

test("lifetime streak resets without makeup", () => {
  const prev = emptyLifetime();
  prev.lastCompleted = "2026-08-20";
  prev.currentStreak = 4;
  const entry = emptyEntry("2026-08-22");
  entry.wordCount = 500;
  const next = applyLifetime(prev, "2026-08-22", entry, emptySession(), 9, true, false);
  assert.equal(next.currentStreak, 1);
});

test("total words uses a delta on the same day", () => {
  const prev = emptyLifetime();
  prev.totalWords = 100;
  prev.lastWordCount = 100;
  prev.lastWordDate = "2026-08-22";
  const entry = emptyEntry("2026-08-22");
  entry.wordCount = 140;
  const next = applyLifetime(prev, "2026-08-22", entry, emptySession(), 9, false, false);
  assert.equal(next.totalWords, 140);
});

test("challenge ignores days before join", () => {
  const month = emptyMonth("2026-08").map((d) => d.date);
  const result = applyChallenge({
    monthDates: month,
    today: "2026-08-22",
    joinDate: "2026-08-20",
    wordsByDate: {
      "2026-08-01": 0,
      "2026-08-20": 500,
      "2026-08-21": 500,
      "2026-08-22": 200,
    },
  });
  assert.equal(result.missedDays, 0);
  assert.equal(result.completedDays, 2);
  assert.equal(result.status, "in");
});

test("challenge shame after a miss post-join", () => {
  const month = emptyMonth("2026-08").map((d) => d.date);
  const result = applyChallenge({
    monthDates: month,
    today: "2026-08-22",
    joinDate: "2026-08-20",
    wordsByDate: { "2026-08-20": 500 },
  });
  assert.equal(result.missedDays, 1);
  assert.equal(result.status, "shame");
});

test("missedYesterday is false for a new account", () => {
  assert.equal(missedYesterday("2026-08-22", null), false);
});

test("missedYesterday is true when last strike was two days ago", () => {
  assert.equal(missedYesterday("2026-08-22", "2026-08-20"), true);
  assert.equal(missedYesterday("2026-08-22", "2026-08-21"), false);
});

test("emptyMonth has the right number of August days", () => {
  assert.equal(emptyMonth("2026-08").length, 31);
  assert.equal(emptyMonth("2026-08")[0].date, "2026-08-01");
});

test("joining today after a strike counts the day", () => {
  const month = emptyMonth("2026-08").map((d) => d.date);
  const result = applyChallenge({
    monthDates: month,
    today: "2026-08-22",
    joinDate: "2026-08-22",
    wordsByDate: { "2026-08-22": 500 },
  });
  assert.equal(result.completedDays, 1);
  assert.equal(result.missedDays, 0);
  assert.equal(result.status, "in");
});

test("publicScore never includes writing", () => {
  const month = emptyMonth("2026-08");
  month[0].wordCount = 500;
  month[0].mark = "strike";
  month[0].points = 2;
  const row = publicScore({
    displayName: "Ada",
    monthDays: month,
    streak: 3,
    badges: [{ id: "egg", earnedAt: 1, times: 1 }],
  });
  assert.equal(row.displayName, "Ada");
  assert.equal(row.daysCompleted, 1);
  assert.equal(row.monthWords, 500);
  assert.equal(row.monthPoints, 2);
  assert.deepEqual(row.badgeIds, ["egg"]);
  assert.equal("text" in row, false);
});
