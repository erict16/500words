import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_FORBIDDEN_KEYS } from "./engine.ts";

const root = path.join(fileURLToPath(import.meta.url), "..", "..", "..");
const rules = readFileSync(path.join(root, "firestore.rules"), "utf8");

test("owner-only reads on users/{uid} and nested days", () => {
  const usersBlock = rules.match(/match \/users\/\{uid\} \{[\s\S]*?\n    \}/)?.[0] ?? "";
  assert.match(usersBlock, /allow read, write: if isSelf\(uid\)/);
  assert.match(usersBlock, /match \/\{\s*document=\*\*\s*\}/);
  assert.equal(usersBlock.includes("allow read: if true"), false);
});

test("public scoreboard may be world-readable but must reject diary body fields", () => {
  assert.match(rules, /match \/public\/\{month\}\/people\/\{uid\}/);
  assert.match(rules, /allow read: if true/);
  assert.match(rules, /function noDiaryBody\(\)/);
  for (const key of PUBLIC_FORBIDDEN_KEYS) {
    assert.match(rules, new RegExp(`['"]${key}['"]`));
  }
  assert.match(rules, /allow create, update: if isSelf\(uid\) && noDiaryBody\(\)/);
});

test("challenge rows also cannot store diary text", () => {
  assert.match(rules, /match \/challenges\/\{month\}\/entrants\/\{uid\}/);
  assert.match(rules, /allow create, update: if isSelf\(uid\) && noDiaryBody\(\)/);
});
