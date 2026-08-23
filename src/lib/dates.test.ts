import assert from "node:assert/strict";
import test from "node:test";
import { addDays, monthKey, shiftMonth, todayInZone } from "./dates.ts";

test("todayInZone UTC is YYYY-MM-DD", () => {
  const d = new Date("2026-08-22T15:00:00Z");
  assert.equal(todayInZone("UTC", d), "2026-08-22");
});

test("addDays crosses months", () => {
  assert.equal(addDays("2026-08-31", 1), "2026-09-01");
  assert.equal(addDays("2026-08-22", -1), "2026-08-21");
});

test("shiftMonth", () => {
  assert.equal(shiftMonth("2026-08-22", -1), "2026-07-01");
  assert.equal(shiftMonth("2026-01-05", -1), "2025-12-01");
  assert.equal(monthKey("2026-08-22"), "2026-08");
});
