import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const require = createRequire(import.meta.url);
const root = path.join(fileURLToPath(import.meta.url), "..", "..");
const playwrightRoots = [
  path.join(root, "node_modules/playwright"),
  "/Users/youming/Github/typebooks/node_modules/playwright",
];
const playwrightPath = playwrightRoots.find((p) => fs.existsSync(p));
if (!playwrightPath) {
  console.error("playwright not found");
  process.exit(1);
}
const { chromium } = require(playwrightPath);

const PORT = 3017;
const SITE = `http://localhost:${PORT}`;

const env = { ...process.env };
delete env.NEXT_PUBLIC_E2E;
const child = spawn("npx", ["next", "dev", "-p", String(PORT)], {
  cwd: root,
  env,
  stdio: ["ignore", "pipe", "pipe"],
});

let ready = false;
child.stdout.on("data", (buf) => {
  const s = buf.toString();
  if (s.includes("Ready") || s.includes("Local:")) ready = true;
});
child.stderr.on("data", (buf) => process.stderr.write(buf));

function fail(msg) {
  console.error(msg);
  child.kill("SIGTERM");
  process.exit(1);
}

try {
  for (let i = 0; i < 40 && !ready; i++) await sleep(500);
  if (!ready) fail("dev server did not start");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.addInitScript(() => {
    try {
      if (!sessionStorage.getItem("e2e-cleared")) {
        localStorage.removeItem("fivehundred-local-v1");
        localStorage.removeItem("fivehundred-local-session");
        sessionStorage.setItem("e2e-cleared", "1");
      }
    } catch {
      /* ignore */
    }
  });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto(SITE, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector("html[data-hydrated='1']", { timeout: 20000 });
  await page.waitForSelector('[data-testid="local-write"]', { timeout: 10000 });
  const google = await page.locator('[data-testid="google-signin"]').count();
  console.log("googleButton=" + google);
  if (!google) fail("missing Continue with Google");
  await page.locator('[data-testid="local-write"]').click();
  await page.waitForSelector('[data-testid="editor"]', { timeout: 10000 });
  const boxes = await page.locator(".day-box").count();
  console.log("dayBoxes=" + boxes);
  if (boxes < 28 || boxes > 31) fail("expected 28–31 day boxes, got " + boxes);

  const box = await page.locator('[data-testid="today-box"]').boundingBox();
  console.log("todayBox=" + Math.round(box?.width || 0) + "x" + Math.round(box?.height || 0));
  if (!box || box.width < 20 || box.width > 28 || box.height < 20 || box.height > 28) {
    fail("today box not 20–28px, got " + Math.round(box?.width || 0) + "x" + Math.round(box?.height || 0));
  }

  const editor = page.locator('[data-testid="editor"]');
  const editorFont = await editor.evaluate((el) => getComputedStyle(el).fontFamily);
  console.log("editorFont=" + editorFont);
  if (!/helvetica/i.test(editorFont)) fail("editor is not Helvetica");

  const barBg = await page.locator("header.site-bar").evaluate((el) => getComputedStyle(el).backgroundColor);
  console.log("barBg=" + barBg);
  if (barBg.includes("43, 187, 173")) fail("header is still the Nuxt teal bar");
  const mark = await page.locator(".site-mark").evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, color: s.color, fontStyle: s.fontStyle };
  });
  console.log("mark=" + JSON.stringify(mark));
  if (mark.fontSize !== "30px") fail("wordmark not 30px, got " + mark.fontSize);
  if (!mark.color.includes("51, 51, 51") && !mark.color.includes("0, 0, 0")) {
    fail("wordmark not black, got " + mark.color);
  }
  if (mark.fontStyle === "italic") fail("original logo is not italic Georgia");
  const nav = await page.locator(".bar-link").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color };
  });
  console.log("nav=" + JSON.stringify(nav));
  if (nav.fontSize !== "16px") fail("nav not 16px, got " + nav.fontSize);
  const countStyle = await page.locator('[data-testid="word-count"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, color: s.color };
  });
  console.log("countStyle=" + JSON.stringify(countStyle));
  if (countStyle.fontSize !== "14px") fail("count not 14px, got " + countStyle.fontSize);
  const daysLeft = await page.locator('[data-testid="days-left"]').textContent();
  console.log("daysLeft=" + daysLeft);
  if (!daysLeft?.includes("left")) fail("missing days left");
  const numSize = await page.locator('[data-testid="today-box"] .num').evaluate((el) => getComputedStyle(el).fontSize);
  console.log("dayNum=" + numSize);
  if (numSize !== "11px") fail("day number not 11px, got " + numSize);
  const colW = await page.locator("main.write-page").evaluate((el) => el.getBoundingClientRect().width);
  console.log("colW=" + Math.round(colW));
  if (colW < 760 || colW > 820) fail("wrapper not ~800px, got " + colW);

  const words = Array.from({ length: 500 }, (_, i) => "word" + i).join(" ");
  await editor.fill(words);
  await page.waitForFunction(
    () => document.querySelector('[data-testid="today-box"]')?.classList.contains("strike"),
    null,
    { timeout: 10000 },
  );
  const cls = await page.locator('[data-testid="today-box"]').getAttribute("class");
  console.log("todayClass=" + cls);
  const slash = await page.locator('[data-testid="today-box"] svg.mark line').count();
  console.log("strikeLines=" + slash);
  if (slash < 2) fail("strike is missing the X");
  const banner = await page.locator('[data-testid="strike-banner"]').textContent();
  console.log("banner=" + banner);
  if (!banner?.includes("500")) fail("missing strike banner");
  const count = await page.locator('[data-testid="word-count"]').textContent();
  console.log("count=" + count);
  const doneColor = await page.locator('[data-testid="word-count"]').evaluate((el) => getComputedStyle(el).color);
  console.log("doneColor=" + doneColor);
  if (!doneColor.includes("0, 128, 0")) fail("done count not green, got " + doneColor);

  await page.keyboard.press("Meta+s");
  await page.waitForSelector('[data-testid="saved-flash"]', { timeout: 5000 });
  console.log("savedFlash=1");

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="editor"]', { timeout: 10000 });
  const kept = (await page.locator('[data-testid="editor"]').inputValue())
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  console.log("reloadWords=" + kept);
  if (kept < 500) fail("reload lost the words, got " + kept);
  const afterReload = await page.locator('[data-testid="today-box"]').getAttribute("class");
  console.log("reloadClass=" + afterReload);
  if (!afterReload?.includes("strike")) fail("reload lost the strike");

  await page.goto(SITE + "/settings", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="font-size"]');
  await page.locator('[data-testid="font-size"]').fill("28");
  await page.goto(SITE, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="editor"]');
  const size = await page.locator('[data-testid="editor"]').evaluate((el) => getComputedStyle(el).fontSize);
  console.log("fontSize=" + size);
  if (size !== "28px") fail("font-size did not apply, got " + size);

  await page.goto(SITE + "/badges", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-badge]", { timeout: 10000 });
  const badgeCount = await page.locator("[data-badge]").count();
  const badgeRows = await page.locator(".badge-row").count();
  console.log("badges=" + badgeCount + " rows=" + badgeRows);
  if (badgeCount < 20) fail("expected animal badges, got " + badgeCount);
  if (badgeRows < 20) fail("badges page should be a catalog of rows, got " + badgeRows);

  await page.goto(SITE + "/challenge", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="join-challenge"], [data-testid="joined-challenge"]', {
    timeout: 10000,
  });
  await page.locator('[data-testid="join-challenge"]').click();
  await page.waitForSelector('[data-testid="joined-challenge"]');
  const progress = await page.locator('[data-testid="challenge-progress"]').textContent();
  console.log("challengeProgress=" + progress);
  if (!progress?.includes("left")) fail("missing challenge progress");
  if (!progress?.includes("1 day")) fail("joining after a strike should count today");

  await page.goto(SITE + "/stats", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.querySelector('[data-testid="stat-words"]')?.textContent?.trim() === "500",
    null,
    { timeout: 10000 },
  );
  const statWords = (await page.locator('[data-testid="stat-words"]').textContent())?.trim();
  const statGoal = await page.locator('[data-testid="stat-goal"]').textContent();
  const statPoints = Number((await page.locator('[data-testid="stat-points"]').textContent())?.trim());
  const statMonthBoxes = await page.locator("[data-testid='stats-month'] .day-box").count();
  console.log("statWords=" + statWords + " goal=" + statGoal + " points=" + statPoints + " monthBoxes=" + statMonthBoxes);
  if (statWords !== "500") fail("stats words expected 500, got " + statWords);
  if (!statGoal?.includes("Strike")) fail("stats goal is not Strike");
  if (!(statPoints >= 2)) fail("stats points expected >= 2, got " + statPoints);
  if (statMonthBoxes < 28) fail("stats month grid missing");
  const bars = await page.locator("[data-testid='word-bars'] .score-bar").count();
  console.log("wordBars=" + bars);
  if (bars < 28) fail("stats word bars missing");
  await page.waitForSelector("[data-testid='archive'] [data-testid='archive-hit']", { timeout: 10000 });
  const archive = await page.locator("[data-testid='archive'] [data-testid='archive-hit']").count();
  const archiveText = (await page.locator("[data-testid='archive'] [data-testid='archive-hit']").first().textContent()) ?? "";
  console.log("archive=" + archive + " archiveText=" + archiveText.replace(/\s+/g, " ").trim());
  if (archive < 1) fail("stats archive missing");
  if (!/words/i.test(archiveText)) fail("archive row missing word count");

  await page.goto(SITE + "/person/local", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="person-score"]', { timeout: 10000 });
  await page.waitForFunction(
    () => document.querySelector('[data-testid="person-score"]')?.textContent?.includes("500"),
    null,
    { timeout: 10000 },
  );
  await page.waitForSelector('[data-testid="person-badges"] [data-badge="egg"]', { timeout: 10000 });
  const personScore = await page.locator('[data-testid="person-score"]').textContent();
  const egg = await page.locator('[data-testid="person-badges"] [data-badge="egg"]').count();
  console.log("personScore=" + personScore + " egg=" + egg);
  if (!personScore?.includes("500")) fail("person page missing word count");
  if (egg < 1) fail("person page missing egg badge");
  const leaked = await page.locator("textarea, [data-testid='editor']").count();
  if (leaked) fail("person page leaked writing");

  await page.goto(SITE + "/search", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="search-input"]');
  await page.locator('[data-testid="search-input"]').fill("word0");
  await page.waitForSelector('[data-testid="search-hits"] button', { timeout: 10000 });
  const hitCount = await page.locator('[data-testid="search-hits"] button').count();
  console.log("searchHits=" + hitCount);
  if (hitCount < 1) fail("search did not find the entry");
  await page.locator('[data-testid="search-hits"] button').first().click();
  await page.waitForSelector('[data-testid="editor"]');
  const fromSearch = (await page.locator('[data-testid="editor"]').inputValue())
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  console.log("searchOpenWords=" + fromSearch);
  if (fromSearch < 500) fail("search did not open the day");

  await page.goto(SITE + "/settings", { waitUntil: "domcontentloaded" });
  await page.locator('[data-testid="theme-dark"]').check();
  await page.waitForFunction(() => document.documentElement.dataset.theme === "dark", null, {
    timeout: 5000,
  });
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  console.log("theme=" + theme);
  if (theme !== "dark") fail("dark theme did not apply");
  const tzCount = await page.locator('[data-testid="timezone"] option').count();
  console.log("timezones=" + tzCount);
  if (tzCount < 8) fail("timezone list too short");

  console.log("pageErrors=" + errors.length);
  if (errors.length) fail(errors.join("\n"));
  await browser.close();
  child.kill("SIGTERM");
  console.log("e2e ok");
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
}
