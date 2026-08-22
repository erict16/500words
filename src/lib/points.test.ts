import assert from "node:assert/strict";
import test from "node:test";
import { scoreDay } from "./points.ts";

test("open frame is zero", () => {
  assert.deepEqual(scoreDay(0, [2, 2], false, 0, 0), { basePoints: 0, points: 0 });
});

test("spare adds yesterday's base", () => {
  assert.deepEqual(scoreDay(120, [2, 2], false, 0, 0), { basePoints: 1, points: 3 });
});

test("strike adds previous two bases", () => {
  assert.deepEqual(scoreDay(500, [2, 2], false, 0, 0), { basePoints: 2, points: 6 });
});

test("locked day does not change", () => {
  assert.deepEqual(scoreDay(0, [2, 2], true, 6, 2), { basePoints: 2, points: 6 });
});
