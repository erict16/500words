import assert from "node:assert/strict";
import test from "node:test";
import { countWords, markForWords, parseTags, basePointsForWords, filledPages, pageTooltipWords } from "./words.ts";

test("empty text is 0 words", () => {
  assert.equal(countWords(""), 0);
  assert.equal(countWords("   \n"), 0);
});

test("splits on whitespace", () => {
  assert.equal(countWords("one two three"), 3);
  assert.equal(countWords("one\n two\t three"), 3);
});

test("marks spare and strike around 500", () => {
  assert.equal(markForWords(0), "none");
  assert.equal(markForWords(12), "dot");
  assert.equal(markForWords(100), "spare");
  assert.equal(markForWords(499), "spare");
  assert.equal(markForWords(500), "strike");
  assert.equal(basePointsForWords(100), 1);
  assert.equal(basePointsForWords(500), 2);
});

test("three papers fill toward 500, not two, not N/500", () => {
  assert.equal(filledPages(0), 0);
  assert.equal(filledPages(166), 0);
  assert.equal(filledPages(167), 1);
  assert.equal(filledPages(333), 1);
  assert.equal(filledPages(334), 2);
  assert.equal(filledPages(499), 2);
  assert.equal(filledPages(500), 3);
  assert.equal(filledPages(667), 4);
  assert.equal(pageTooltipWords(3), 500);
});

test("750-sized goal still yields three papers at the goal", () => {
  assert.equal(filledPages(250, 750), 1);
  assert.equal(filledPages(500, 750), 2);
  assert.equal(filledPages(750, 750), 3);
});

test("parses ALLCAPS tags", () => {
  const tags = parseTags("hello\nMOOD: 7\nTODO: eggs\nnot a tag");
  assert.equal(tags.MOOD, "7");
  assert.equal(tags.TODO, "eggs");
});
