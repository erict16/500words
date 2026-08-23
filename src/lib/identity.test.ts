import assert from "node:assert/strict";
import test from "node:test";
import {
  LOCAL_UID,
  isLocalUid,
  localSessionUser,
  sessionFromFirebase,
} from "./identity.ts";

test("local session is not a Firebase user", () => {
  assert.equal(localSessionUser.uid, LOCAL_UID);
  assert.equal(localSessionUser.email, "");
  assert.equal(isLocalUid(localSessionUser.uid), true);
  assert.equal(isLocalUid("abc"), false);
  assert.equal(isLocalUid(undefined), false);
});

test("firebase session copies the fields we actually use", () => {
  const next = sessionFromFirebase({
    uid: "google-1",
    displayName: "Eric",
    email: "e@x.com",
    photoURL: "https://example.com/p.png",
  });
  assert.deepEqual(next, {
    uid: "google-1",
    displayName: "Eric",
    email: "e@x.com",
    photoURL: "https://example.com/p.png",
  });
});
