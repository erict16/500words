import assert from "node:assert/strict";
import test from "node:test";
import { cx, ui } from "./css.ts";

test("cx drops empty parts", () => {
  assert.equal(cx(ui.dayBox, "strike", false, null, "today"), "day-box strike today");
});

test("write chrome names stay the e2e selectors", () => {
  assert.equal(ui.mark, "site-mark");
  assert.equal(ui.writeTop, "write-top");
  assert.equal(ui.date, "write-date");
  assert.equal(ui.area, "write-area");
  assert.equal(ui.close, "write-close");
  assert.equal(ui.kebab, "write-kebab");
  assert.equal(ui.focusToggle, "focus-toggle-btn");
  assert.equal(ui.exitFocus, "exit-focus-btn");
});
