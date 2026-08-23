import assert from "node:assert/strict";
import test from "node:test";
import { emptySession, hideSession, showSession, touchSession, wordsPerMinute } from "./session.ts";

test("first keystroke starts the session", () => {
  const next = touchSession(emptySession(), 1_000);
  assert.equal(next.startedAt, 1_000);
  assert.equal(next.activeMs, 0);
});

test("idle over 60s counts as a pause", () => {
  const a = touchSession(emptySession(), 1_000);
  const b = touchSession(a, 1_000 + 61_000);
  assert.equal(b.pauseCount, 1);
  assert.ok(b.pauseMs >= 60_000);
});

test("tab hide longer than 15s is a break", () => {
  const a = touchSession(emptySession(), 1_000);
  const hidden = hideSession(a, 2_000);
  const shown = showSession(hidden, 2_000 + 16_000);
  assert.equal(shown.pauseCount, 1);
});

test("short tab hide is ignored", () => {
  const a = touchSession(emptySession(), 1_000);
  const hidden = hideSession(a, 2_000);
  const shown = showSession(hidden, 2_000 + 5_000);
  assert.equal(shown.pauseCount, 0);
});

test("wpm is zero until 5s of active time", () => {
  assert.equal(wordsPerMinute(500, 4000), 0);
  assert.equal(wordsPerMinute(500, 60_000), 500);
});
