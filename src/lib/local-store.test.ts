import assert from "node:assert/strict";
import test from "node:test";
import { parseLocalDb } from "./local-store.ts";
import { LOCAL_UID } from "./identity.ts";

test("junk localStorage falls back to an empty local db", () => {
  const db = parseLocalDb("nope");
  assert.equal(db.profile.uid, LOCAL_UID);
  assert.equal(db.profile.email, "");
  assert.deepEqual(db.days, {});
});

test("keeps a valid day and drops a bad date key", () => {
  const db = parseLocalDb({
    profile: { displayName: "Eric", email: "you@local", settings: { fontSize: 28 } },
    days: {
      "2026-08-23": { text: "hello world", wordCount: 2, mark: "dot" },
      junk: { text: "nope" },
    },
    cloudUid: "google-1",
  });
  assert.equal(db.profile.displayName, "Eric");
  assert.equal(db.profile.email, "");
  assert.equal(db.profile.settings.fontSize, 28);
  assert.equal(db.days["2026-08-23"]?.text, "hello world");
  assert.equal(db.days.junk, undefined);
  assert.equal(db.cloudUid, "google-1");
});

test("missing cloudUid stays null so a later sign-in can merge", () => {
  const db = parseLocalDb({ days: {} });
  assert.equal(db.cloudUid, null);
});
