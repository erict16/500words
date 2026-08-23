import assert from "node:assert/strict";
import test from "node:test";
import { BADGES, badgesToAward, type BadgeStats } from "./badges.ts";

const empty: BadgeStats = {
  currentStreak: 0,
  showUpStreak: 0,
  completedEver: 0,
  showedUpEver: 0,
  totalWords: 0,
  fastDays: 0,
  nightDays: 0,
  morningDays: 0,
  monthChallengeWon: false,
  hasWritten: false,
};

test("first words award the egg", () => {
  assert.deepEqual(badgesToAward({ ...empty, hasWritten: true }, {}), ["egg"]);
});

test("three-day streak is a turkey", () => {
  const ids = badgesToAward({ ...empty, hasWritten: true, currentStreak: 3, completedEver: 3 }, {});
  assert.ok(ids.includes("egg"));
  assert.ok(ids.includes("turkey"));
  assert.ok(ids.includes("spirit-turkey"));
  assert.equal(ids.includes("penguin"), false);
});

test("does not re-award badges already earned", () => {
  const already = { egg: { id: "egg", earnedAt: 1, times: 1 } };
  assert.deepEqual(badgesToAward({ ...empty, hasWritten: true }, already), []);
});

test("turquoise horse is the month challenge", () => {
  const ids = badgesToAward({ ...empty, hasWritten: true, monthChallengeWon: true }, {});
  assert.ok(ids.includes("turquoise-horse"));
});

test("catalog includes Tag Savage animals", () => {
  const ids = BADGES.map((b) => b.id);
  for (const id of [
    "egg",
    "turkey",
    "penguin",
    "flamingo",
    "albatross",
    "phoenix",
    "pterodactyl",
    "spacebird",
    "spirit-turkey",
    "cheetah",
    "hamster",
    "early-bird",
    "night-bat",
    "oxalis",
    "turquoise-horse",
  ]) {
    assert.ok(ids.includes(id), id);
  }
});
