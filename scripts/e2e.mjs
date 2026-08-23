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

const child = spawn("npx", ["next", "dev", "-p", String(PORT)], {
  cwd: root,
  env: { ...process.env, NEXT_PUBLIC_E2E: "1" },
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
  await page.waitForSelector('[data-testid="editor"]', { timeout: 10000 });
  const boxes = await page.locator(".day-box").count();
  console.log("dayBoxes=" + boxes);
  if (boxes < 28 || boxes > 31) fail("expected 28–31 day boxes, got " + boxes);

  const box = await page.locator('[data-testid="today-box"]').boundingBox();
  console.log("todayBox=" + Math.round(box?.width || 0) + "x" + Math.round(box?.height || 0));
  if (!box || box.width < 24 || box.height < 24) fail("today box too small");

  const editor = page.locator('[data-testid="editor"]');
  const georgia = await editor.evaluate((el) => getComputedStyle(el).fontFamily);
  console.log("editorFont=" + georgia);
  if (!/georgia/i.test(georgia)) fail("editor is not Georgia");

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

  await page.goto(SITE + "/settings", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="font-size"]');
  await page.locator('[data-testid="font-size"]').fill("28");
  await page.goto(SITE, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="editor"]');
  const size = await page.locator('[data-testid="editor"]').evaluate((el) => getComputedStyle(el).fontSize);
  console.log("fontSize=" + size);
  if (size !== "28px") fail("font-size did not apply, got " + size);

  await page.goto(SITE + "/badges", { waitUntil: "domcontentloaded" });
  const badgeCount = await page.locator("[data-badge]").count();
  console.log("badges=" + badgeCount);
  if (badgeCount < 20) fail("expected animal badges, got " + badgeCount);

  await page.goto(SITE + "/challenge", { waitUntil: "domcontentloaded" });
  await page.locator('[data-testid="join-challenge"]').click();
  await page.waitForSelector('[data-testid="joined-challenge"]');

  console.log("pageErrors=" + errors.length);
  if (errors.length) fail(errors.join("\n"));
  await browser.close();
  child.kill("SIGTERM");
  console.log("e2e ok");
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
}
