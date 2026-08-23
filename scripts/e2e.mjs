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
  await page.waitForSelector('[data-testid="editor"]', { timeout: 10000 });
  const google = await page.locator('[data-testid="google-signin"]').count();
  console.log("googleButton=" + google);
  if (!google) fail("missing optional Sign in");
  const kicker = await page.locator('[data-testid="landing-kicker"]').count();
  console.log("landingKicker=" + kicker);
  if (!kicker) fail("missing type-first landing line");
  const headerNav = await page.locator("header.site-bar .bar-nav").count();
  console.log("writeHeaderNav=" + headerNav);
  if (headerNav) fail("write page should not have the app header nav");
  const boxes = await page.locator(".day-box").count();
  console.log("dayBoxes=" + boxes);
  if (boxes < 28 || boxes > 31) fail("expected 28–31 day boxes, got " + boxes);

  const box = await page.locator('[data-testid="today-box"]').boundingBox();
  console.log("todayBox=" + Math.round(box?.width || 0) + "x" + Math.round(box?.height || 0));
  if (!box || box.width < 14 || box.width > 24 || box.height < 14 || box.height > 24) {
    fail("today box not a small square, got " + Math.round(box?.width || 0) + "x" + Math.round(box?.height || 0));
  }

  const editor = page.locator('[data-testid="editor"]');
  const editorStyle = await editor.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      width: Math.round(el.getBoundingClientRect().width),
      borderTopWidth: s.borderTopWidth,
    };
  });
  console.log("editorStyle=" + JSON.stringify(editorStyle));
  if (!/georgia|ui-serif|cambria|times/i.test(editorStyle.fontFamily)) {
    fail("editor is not the 750 serif stack, got " + editorStyle.fontFamily);
  }
  if (editorStyle.borderTopWidth !== "0px") fail("editor should have no border");
  if (editorStyle.width < 800 || editorStyle.width > 840) {
    fail("write column not ~820px, got " + editorStyle.width);
  }
  const placeholder = await editor.getAttribute("placeholder");
  console.log("placeholder=" + placeholder);
  if (placeholder !== "Write something here...") fail("missing 750 placeholder");
  const heading = await page.locator('[data-testid="write-date"]').textContent();
  console.log("writeDate=" + heading);
  if (!heading || !/2026/.test(heading)) fail("missing long date heading");
  const tagline = await page.locator(".foot-tagline").textContent();
  console.log("tagline=" + tagline);
  if (!tagline?.includes("Private, unfiltered")) fail("missing 750 tagline");
  const tagStyle = await page.locator(".foot-tagline").evaluate((el) => {
    const s = getComputedStyle(el);
    return { font: s.fontFamily, size: s.fontSize, color: s.color };
  });
  console.log("tagStyle=" + JSON.stringify(tagStyle));
  if (!/georgia|ui-serif|cambria|times/i.test(tagStyle.font)) fail("tagline not serif, got " + tagStyle.font);
  if (tagStyle.size !== "14px") fail("tagline not 14px, got " + tagStyle.size);
  const mark = await page.locator(".site-mark").evaluate((el) => {
    const s = getComputedStyle(el);
    return { font: s.fontFamily, weight: s.fontWeight, size: s.fontSize };
  });
  console.log("mark=" + JSON.stringify(mark));
  if (!/georgia|ui-serif|cambria|times/i.test(mark.font)) fail("wordmark not serif, got " + mark.font);
  if (!(mark.weight === "400" || mark.weight === "normal")) fail("wordmark should be 400, got " + mark.weight);
  const align = await page.locator(".write-top-inner").evaluate((el) => {
    const markEl = el.querySelector(".site-mark");
    const menuEl = el.querySelector(".write-menu-sum");
    const dateEl = document.querySelector(".write-date");
    const calEl = document.querySelector(".cal-row");
    const a = markEl.getBoundingClientRect();
    const b = menuEl.getBoundingClientRect();
    const d = dateEl.getBoundingClientRect();
    const c = calEl.getBoundingClientRect();
    return {
      markMenuDy: Math.abs(a.top + a.height / 2 - (b.top + b.height / 2)),
      markLeft: Math.round(a.left),
      dateLeft: Math.round(d.left),
      calLeft: Math.round(c.left),
      menuSize: getComputedStyle(menuEl).fontSize,
      dateSize: getComputedStyle(dateEl).fontSize,
    };
  });
  console.log("align=" + JSON.stringify(align));
  if (align.markMenuDy > 2) fail("wordmark and Menu not vertically aligned, Δ " + align.markMenuDy);
  if (Math.abs(align.markLeft - align.dateLeft) > 1) fail("wordmark and date left edges differ");
  if (align.menuSize !== "14px") fail("Menu not 14px, got " + align.menuSize);
  if (align.dateSize !== "24px") fail("date not 24px, got " + align.dateSize);

  const words = Array.from({ length: 500 }, (_, i) => "word" + i).join(" ");
  await editor.fill(words);
  await page.waitForFunction(
    () => document.querySelector('[data-testid="today-box"]')?.classList.contains("strike"),
    null,
    { timeout: 10000 },
  );
  const cls = await page.locator('[data-testid="today-box"]').getAttribute("class");
  console.log("todayClass=" + cls);
  const check = await page.locator('[data-testid="today-box"] svg.day-check').count();
  console.log("strikeCheck=" + check);
  if (check < 1) fail("strike is missing the check");
  const banner = await page.locator('[data-testid="strike-banner"]').textContent();
  console.log("banner=" + banner);
  if (!banner?.includes("500")) fail("missing strike banner");
  const count = await page.locator('[data-testid="word-count"]').textContent();
  console.log("count=" + count);
  const doneColor = await page.locator('[data-testid="word-count"]').evaluate((el) => getComputedStyle(el).color);
  console.log("doneColor=" + doneColor);
  if (!doneColor.includes("76, 175, 80") && !doneColor.includes("0, 128, 0")) fail("done count not green, got " + doneColor);
  const doneWeight = await page.locator('[data-testid="word-count"]').evaluate((el) => getComputedStyle(el).fontWeight);
  console.log("doneWeight=" + doneWeight);
  if (!(doneWeight === "700" || doneWeight === "bold")) fail("done count not bold, got " + doneWeight);

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
  const settingsH1 = await page.locator(".page-title").evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, color: s.color, fontFamily: s.fontFamily, fontWeight: s.fontWeight };
  });
  console.log("settingsH1=" + JSON.stringify(settingsH1));
  if (settingsH1.fontSize !== "30px") fail("inner h1 not 1.875rem, got " + settingsH1.fontSize);
  if (!/georgia|ui-serif|cambria|times/i.test(settingsH1.fontFamily)) {
    fail("inner h1 not serif, got " + settingsH1.fontFamily);
  }
  if (settingsH1.color.includes("77, 181, 89")) fail("inner h1 still Rails #4DB559");
  if (!settingsH1.color.includes("26, 26, 26") && !settingsH1.color.includes("0, 0, 0")) {
    fail("inner h1 not ink, got " + settingsH1.color);
  }
  const settingsInput = await page.locator('[data-testid="display-name"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      height: s.height,
      borderTopColor: s.borderTopColor,
      radius: s.borderTopLeftRadius,
      shadow: s.boxShadow,
    };
  });
  console.log("settingsInput=" + JSON.stringify(settingsInput));
  if (settingsInput.fontSize !== "16px") fail("settings input not 16px, got " + settingsInput.fontSize);
  if (settingsInput.height !== "48px") fail("settings input height not 48px, got " + settingsInput.height);
  if (!settingsInput.borderTopColor.includes("204, 204, 204")) fail("settings input border not #ccc, got " + settingsInput.borderTopColor);
  if (settingsInput.radius !== "4px") fail("settings input radius not 4px, got " + settingsInput.radius);
  if (settingsInput.shadow !== "none") fail("settings input still has inset shadow, got " + settingsInput.shadow);
  const footLogo = await page.locator(".foot-logo").evaluate((el) => {
    const s = getComputedStyle(el);
    return { size: s.fontSize, weight: s.fontWeight, line: s.lineHeight, font: s.fontFamily };
  });
  console.log("footLogo=" + JSON.stringify(footLogo));
  if (footLogo.size !== "20px") fail("inner footer logo not 20px, got " + footLogo.size);
  if (footLogo.weight !== "700" && footLogo.weight !== "bold") fail("inner footer logo not 700, got " + footLogo.weight);
  if (footLogo.line === "45px") fail("inner footer still Rails 45px line-height");
  if (!/georgia|ui-serif|cambria|times/i.test(footLogo.font)) fail("inner footer logo not serif, got " + footLogo.font);
  const themeActivator = await page.locator(".theme-activator").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      height: Math.round(el.getBoundingClientRect().height),
      radius: s.borderTopLeftRadius,
      border: s.borderTopColor,
      fontSize: s.fontSize,
    };
  });
  console.log("themeActivator=" + JSON.stringify(themeActivator));
  if (themeActivator.height !== 48) fail("theme activator not 48px, got " + themeActivator.height);
  const fontItem = await page.locator(".font-menu-item").first().evaluate((el) => {
    const s = getComputedStyle(el);
    const title = el.querySelector(".font-title");
    const sample = el.querySelector(".font-sample-text");
    return {
      minHeight: Math.round(el.getBoundingClientRect().height),
      titleSize: title ? getComputedStyle(title).fontSize : "",
      sampleSize: sample ? getComputedStyle(sample).fontSize : "",
    };
  });
  console.log("fontItem=" + JSON.stringify(fontItem));
  if (fontItem.minHeight < 80) fail("font picker item shorter than 80px, got " + fontItem.minHeight);
  if (fontItem.titleSize !== "16px") fail("font title not 16px, got " + fontItem.titleSize);
  if (fontItem.sampleSize !== "14px") fail("font sample not 14px, got " + fontItem.sampleSize);
  if (themeActivator.radius !== "4px") fail("theme activator radius not 4px, got " + themeActivator.radius);
  if (!themeActivator.border.includes("204, 204, 204") && !themeActivator.border.includes("0, 200, 83")) {
    fail("theme activator border not #ccc, got " + themeActivator.border);
  }
  const subdued = await page.locator(".subdued").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, color: s.color, fontWeight: s.fontWeight, textDecorationLine: s.textDecorationLine };
  });
  console.log("subdued=" + JSON.stringify(subdued));
  if (subdued.fontSize !== "14px") fail("subdued not 14px, got " + subdued.fontSize);
  if (!subdued.color.includes("102, 102, 102")) fail("subdued not #666, got " + subdued.color);
  await page.locator('[data-testid="font-size"]').fill("28");
  await page.goto(SITE, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="editor"]');
  const size = await page.locator('[data-testid="editor"]').evaluate((el) => getComputedStyle(el).fontSize);
  console.log("fontSize=" + size);
  if (size !== "28px") fail("font-size did not apply, got " + size);

  await page.goto(SITE + "/badges", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("[data-badge]", { timeout: 10000 });
  const badgeCount = await page.locator("[data-badge]").count();
  const badgeCards = await page.locator(".badge-card").count();
  console.log("badges=" + badgeCount + " cards=" + badgeCards);
  if (badgeCount < 20) fail("expected animal badges, got " + badgeCount);
  if (badgeCards < 20) fail("badges page should be a card grid, got " + badgeCards);
  const eggCard = await page.locator(".badge-card[data-testid='badge-egg']").evaluate((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      minHeight: s.minHeight,
      display: s.display,
      borderTopWidth: s.borderTopWidth,
      height: Math.round(r.height),
    };
  });
  console.log("eggCard=" + JSON.stringify(eggCard));
  if (eggCard.height < 80) fail("badge card too short, got " + eggCard.height);
  if (eggCard.display && eggCard.display !== "flex") fail("badge card not flex column, got " + eggCard.display);
  const eggHow = (await page.locator('[data-testid="badge-egg"] .badge-copy p').first().textContent()) ?? "";
  console.log("eggHow=" + eggHow.slice(0, 80));
  if (!/how we all start/i.test(eggHow)) fail("egg catalog copy is not the original 750 blurb");
  const streakHead = await page.locator("h2.page-h2").first().textContent();
  console.log("streakHead=" + streakHead);
  if (streakHead !== "Streak Badges") fail("badge groups should start with Streak Badges, got " + streakHead);
  const titleSize = await page.locator('[data-testid="badge-egg"] .badge-title').evaluate((el) => getComputedStyle(el).fontSize);
  console.log("badgeTitle=" + titleSize);
  if (titleSize !== "18px") fail("badge title not 18px serif, got " + titleSize);
  const horseFill = await page.locator('[data-badge="turquoise-horse"]').evaluate((el) => {
    const paints = [...el.querySelectorAll("path, ellipse, circle")].map((n) => getComputedStyle(n).fill);
    return paints.join(" ");
  });
  console.log("horseFill=" + horseFill.slice(0, 120));
  if (horseFill.includes("43, 187, 173")) fail("turquoise horse still uses Materialize teal");

  await page.goto(SITE + "/challenge", { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="join-challenge"], [data-testid="joined-challenge"]', {
    timeout: 10000,
  });
  const challengeCopy = await page.locator(".challenge-copy").evaluate((el) => {
    const s = getComputedStyle(el);
    return { size: s.fontSize, font: s.fontFamily, color: s.color, height: s.lineHeight };
  });
  console.log("challengeCopy=" + JSON.stringify(challengeCopy));
  if (challengeCopy.size !== "16px") fail("challenge copy not 1rem, got " + challengeCopy.size);
  if (!/georgia|ui-serif|cambria|times/i.test(challengeCopy.font)) fail("challenge copy not serif, got " + challengeCopy.font);
  if (!challengeCopy.color.includes("102, 102, 102")) fail("challenge copy not #666, got " + challengeCopy.color);
  const joinStyle = await page.locator('[data-testid="join-challenge"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      radius: s.borderTopLeftRadius,
      border: s.borderTopColor,
      padding: s.paddingTop,
      height: Math.round(el.getBoundingClientRect().height),
      color: s.color,
    };
  });
  console.log("joinStyle=" + JSON.stringify(joinStyle));
  if (joinStyle.radius !== "4px") fail("challenge join radius not 4px, got " + joinStyle.radius);
  if (!joinStyle.border.includes("204, 204, 204")) fail("challenge join border not #ccc, got " + joinStyle.border);
  if (joinStyle.padding !== "12px") fail("challenge join padding not 12px, got " + joinStyle.padding);
  if (joinStyle.height < 44) fail("challenge join shorter than 48px, got " + joinStyle.height);
  await page.locator('[data-testid="join-challenge"]').click();
  await page.waitForSelector('[data-testid="joined-challenge"]');
  const joinedStyle = await page.locator('[data-testid="joined-challenge"] strong').evaluate((el) => {
    const s = getComputedStyle(el);
    return { color: s.color, border: s.borderTopColor, radius: s.borderTopLeftRadius, fontSize: s.fontSize };
  });
  console.log("joinedStyle=" + JSON.stringify(joinedStyle));
  if (!joinedStyle.color.includes("0, 200, 83")) fail("joined challenge not #00c853, got " + joinedStyle.color);
  if (!joinedStyle.border.includes("0, 200, 83")) fail("joined challenge border not #00c853, got " + joinedStyle.border);
  if (joinedStyle.radius !== "4px") fail("joined challenge radius not 4px, got " + joinedStyle.radius);
  const progress = await page.locator('[data-testid="challenge-progress"]').textContent();
  console.log("challengeProgress=" + progress);
  if (!progress?.includes("left")) fail("missing challenge progress");
  if (!progress?.includes("1 day")) fail("joining after a strike should count today");
  const noticeStyle = await page.locator('[data-testid="shame-empty"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return { bg: s.backgroundColor, font: s.fontFamily, size: s.fontSize };
  });
  console.log("notice=" + JSON.stringify(noticeStyle));
  if (noticeStyle.bg.includes("212, 238, 247")) fail("notice still Rails #d4eef7");
  if (/georgia/i.test(noticeStyle.font) && !/ui-sans|system-ui|segoe|helvetica|arial/i.test(noticeStyle.font)) {
    fail("notice still Georgia, got " + noticeStyle.font);
  }
  const groupCard = await page.locator(".group-card").first().evaluate((el) => {
    const s = getComputedStyle(el);
    const name = el.querySelector(".group-name");
    return {
      border: s.borderTopWidth,
      radius: s.borderTopLeftRadius,
      nameSize: name ? getComputedStyle(name).fontSize : "",
      nameFont: name ? getComputedStyle(name).fontFamily : "",
    };
  });
  console.log("groupCard=" + JSON.stringify(groupCard));
  if (groupCard.border !== "1px") fail("group-card missing 1px border, got " + groupCard.border);
  if (groupCard.radius !== "4px") fail("group-card radius not 4px, got " + groupCard.radius);
  if (groupCard.nameSize !== "18px") fail("group-name not 1.125rem, got " + groupCard.nameSize);
  if (!/georgia|ui-serif|cambria|times/i.test(groupCard.nameFont)) fail("group-name not serif, got " + groupCard.nameFont);
  const joined = await page.locator('[data-testid="joined-challenge"] strong').evaluate((el) => {
    const s = getComputedStyle(el);
    return { color: s.color, border: s.borderTopColor, radius: s.borderRadius, pad: s.paddingTop };
  });
  console.log("joined=" + JSON.stringify(joined));
  if (!joined.color.includes("0, 200, 83")) fail("joined challenge not #00c853, got " + joined.color);
  if (!joined.border.includes("0, 200, 83")) fail("joined challenge border not #00c853, got " + joined.border);
  if (joined.radius !== "4px") fail("joined challenge radius not 4px, got " + joined.radius);

  await page.goto(SITE + "/stats", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.querySelector('[data-testid="stat-words"]')?.textContent?.trim() === "500",
    null,
    { timeout: 10000 },
  );
  const statWords = (await page.locator('[data-testid="stat-words"]').textContent())?.trim();
  const statGoal = await page.locator('[data-testid="stat-goal"]').textContent();
  const statPoints = Number((await page.locator('[data-testid="stat-points"]').textContent())?.trim());
  const statMonthBoxes = await page.locator("[data-testid='stats-month'] .calendar-day:not(.isEmpty)").count();
  console.log("statWords=" + statWords + " goal=" + statGoal + " points=" + statPoints + " monthBoxes=" + statMonthBoxes);
  if (statWords !== "500") fail("stats words expected 500, got " + statWords);
  if (!statGoal?.includes("Strike")) fail("stats goal is not Strike");
  if (!(statPoints >= 2)) fail("stats points expected >= 2, got " + statPoints);
  if (statMonthBoxes < 28) fail("stats month grid missing");
  const statsDots = await page.locator("[data-testid='stats-month'] .day-dot").count();
  console.log("statsDots=" + statsDots);
  if (statsDots < 28) fail("stats month missing current-750 day dots");
  const completedDot = await page.locator("[data-testid='stats-month'] .calendar-day.completed .day-dot").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { size: s.width, bg: s.backgroundColor, radius: s.borderRadius };
  });
  console.log("completedDot=" + JSON.stringify(completedDot));
  if (completedDot.size !== "8px") fail("completed day-dot not 8px, got " + completedDot.size);
  if (!completedDot.bg.includes("0, 200, 83")) fail("completed day-dot not #00c853, got " + completedDot.bg);
  const bars = await page.locator("[data-testid='word-bars'] .score-bar").count();
  console.log("wordBars=" + bars);
  if (bars < 28) fail("stats word bars missing");
  const spark = await page.locator("[data-testid='word-bars']").evaluate((el) => {
    const s = getComputedStyle(el);
    return { height: s.height, gap: s.columnGap || s.gap };
  });
  console.log("spark=" + JSON.stringify(spark));
  if (spark.height !== "32px") fail("word bars not 32px sparkline, got " + spark.height);
  await page.waitForSelector("[data-testid='archive'] [data-testid='archive-hit']", { timeout: 10000 });
  const archive = await page.locator("[data-testid='archive'] [data-testid='archive-hit']").count();
  const archiveText = (await page.locator("[data-testid='archive'] [data-testid='archive-hit']").first().textContent()) ?? "";
  console.log("archive=" + archive + " archiveText=" + archiveText.replace(/\s+/g, " ").trim());
  if (archive < 1) fail("stats archive missing");
  if (!/words/i.test(archiveText)) fail("archive row missing word count");
  const monthTitle = await page.locator("[data-testid='archive'] .month-title strong").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { weight: s.fontWeight, color: s.color, font: s.fontFamily };
  });
  console.log("monthTitle=" + JSON.stringify(monthTitle));
  if (monthTitle.weight !== "600") fail("browse title not semibold, got " + monthTitle.weight);
  if (!monthTitle.color.includes("0, 200, 83")) fail("browse title not #00c853, got " + monthTitle.color);
  const monthStats = await page.locator("[data-testid='archive'] .month-stats").first().evaluate((el) => getComputedStyle(el).fontSize);
  console.log("monthStats=" + monthStats);
  if (monthStats !== "14px") fail("browse stats not 0.875rem, got " + monthStats);
  const statHero = await page.locator('[data-testid="stat-words"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, color: s.color };
  });
  console.log("statHero=" + JSON.stringify(statHero));
  const statsLead = await page.locator(".page-title + p").evaluate((el) => {
    const s = getComputedStyle(el);
    return { size: s.fontSize, font: s.fontFamily, color: s.color, cls: el.className };
  });
  console.log("statsLead=" + JSON.stringify(statsLead));
  if (statsLead.cls !== "page-description") fail("stats lead not page-description, got " + statsLead.cls);
  if (statsLead.size !== "16px") fail("stats lead not 1rem, got " + statsLead.size);
  if (!/georgia|ui-serif|cambria|times/i.test(statsLead.font)) fail("stats lead not serif, got " + statsLead.font);
  const innerH2 = await page.locator(".page-h2").first().evaluate((el) => getComputedStyle(el).fontWeight);
  console.log("innerH2=" + innerH2);
  if (innerH2 !== "700" && innerH2 !== "bold") fail("inner h2 not 700, got " + innerH2);
  if (statHero.fontSize !== "30px") fail("stats number not 1.875rem, got " + statHero.fontSize);
  if (statHero.color.includes("77, 181, 89")) fail("stats number still Rails #4DB559");
  if (!statHero.color.includes("26, 26, 26") && !statHero.color.includes("0, 0, 0")) {
    fail("stats number not ink, got " + statHero.color);
  }
  const entryCols = await page.locator(".entry-stats .stats-cell").count();
  console.log("entryCols=" + entryCols);
  if (entryCols !== 5) fail("today stats should be five centered cells, got " + entryCols);
  const lifeStrong = await page.locator(".lifetime-stats .score").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, color: s.color, fontWeight: s.fontWeight };
  });
  console.log("lifeStrong=" + JSON.stringify(lifeStrong));
  if (lifeStrong.fontSize !== "24px") fail("all-time stats not 1.5rem, got " + lifeStrong.fontSize);
  if (!lifeStrong.color.includes("26, 26, 26") && !lifeStrong.color.includes("0, 0, 0")) {
    fail("all-time stats not ink, got " + lifeStrong.color);
  }
  if (lifeStrong.fontWeight !== "700" && lifeStrong.fontWeight !== "bold") {
    fail("all-time stats not weight 700, got " + lifeStrong.fontWeight);
  }
  const statLabel = await page.locator('[data-testid="stat-goal"]').evaluate((el) => getComputedStyle(el).fontSize);
  const statHead = await page.locator(".stat-head").first().evaluate((el) => getComputedStyle(el).fontSize);
  const lifeCell = await page.locator(".lifetime-stats .stat-key").first().evaluate((el) => getComputedStyle(el).fontSize);
  const timeHero = await page.locator('[data-testid="stat-time"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, color: s.color };
  });
  console.log("statLabel=" + statLabel + " statHead=" + statHead + " lifeCell=" + lifeCell + " timeHero=" + JSON.stringify(timeHero));
  if (statLabel !== "14px") fail("stats label not 14px, got " + statLabel);
  if (statHead !== "14px") fail("stats table header not 14px, got " + statHead);
  if (lifeCell !== "14px") fail("stats table cell not 14px, got " + lifeCell);
  if (timeHero.fontSize !== "30px") fail("stats time not 1.875rem, got " + timeHero.fontSize);
  if (timeHero.color.includes("77, 181, 89")) fail("stats time still Rails #4DB559");
  const publicLink = await page.locator('[data-testid="public-link"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return { color: s.color, textDecorationLine: s.textDecorationLine };
  });
  console.log("publicLink=" + JSON.stringify(publicLink));
  if (!publicLink.color.includes("0, 200, 83")) fail("page link not #00c853, got " + publicLink.color);

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
  const personHead = await page.locator(".persons-header").evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      bg: s.backgroundColor,
      pad: s.paddingTop,
      radius: s.borderRadius,
      shadow: s.boxShadow,
    };
  });
  console.log("personHead=" + JSON.stringify(personHead));
  if (personHead.bg.includes("220, 255, 253")) fail("person header still Rails mint #DCFFFD");
  if (personHead.pad !== "0px") fail("person header padding-top not 0, got " + personHead.pad);
  if (personHead.radius !== "0px") fail("person header radius not 0, got " + personHead.radius);
  const personBig = await page.locator('[data-testid="person-score"]').evaluate((el) => {
    const s = getComputedStyle(el);
    const strong = el.querySelector("strong");
    const sc = strong ? getComputedStyle(strong) : null;
    return { fontSize: s.fontSize, color: s.color, strong: sc?.color, font: s.fontFamily };
  });
  console.log("personBig=" + JSON.stringify(personBig));
  if (personBig.fontSize !== "16px") fail("person summary not 1rem, got " + personBig.fontSize);
  if (!/ui-sans|system-ui|segoe|helvetica|arial/i.test(personBig.font)) {
    fail("person summary not sans, got " + personBig.font);
  }
  if (personBig.strong?.includes("67, 146, 241")) fail("person strong still Rails #4392F1");
  const personScoreCell = await page.locator("[data-testid='person-stats'] .score").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, color: s.color, fontWeight: s.fontWeight };
  });
  console.log("personScoreCell=" + JSON.stringify(personScoreCell));
  if (personScoreCell.fontSize !== "24px") fail("person score not 1.5rem, got " + personScoreCell.fontSize);
  if (!personScoreCell.color.includes("26, 26, 26") && !personScoreCell.color.includes("0, 0, 0")) {
    fail("person score not ink, got " + personScoreCell.color);
  }
  if (personHead.shadow !== "none") fail("persons-header still has box-shadow, got " + personHead.shadow);
  const personH1 = await page.locator(".page-title").evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, color: s.color };
  });
  console.log("personH1=" + JSON.stringify(personH1));
  if (personH1.fontSize !== "30px") fail("person h1 not 1.875rem, got " + personH1.fontSize);
  if (personH1.color.includes("77, 181, 89")) fail("person h1 still Rails #4DB559");

  await page.goto(SITE + "/search", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => {
      const el = document.querySelector('[data-testid="search-input"]');
      return el && el.getBoundingClientRect().height > 20;
    },
    null,
    { timeout: 10000 },
  );
  const searchStyle = await page.locator('[data-testid="search-input"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      color: s.color,
      borderTopWidth: s.borderTopWidth,
      height: Math.round(el.getBoundingClientRect().height),
      width: Math.round(el.getBoundingClientRect().width),
    };
  });
  console.log("searchStyle=" + JSON.stringify(searchStyle));
  if (searchStyle.fontSize !== "16px") fail("search not 16px, got " + searchStyle.fontSize);
  if (searchStyle.color.includes("102, 102, 102")) fail("search still Rails #666");
  if (searchStyle.borderTopWidth !== "1px") fail("search should have a 1px border, got " + searchStyle.borderTopWidth);
  if (searchStyle.height < 44) fail("search shorter than 48px, got " + searchStyle.height);
  if (searchStyle.width < 400) fail("search still a 245px Rails box, got " + searchStyle.width);
  const searchBtn = await page.locator(".search-btn").evaluate((el) => Math.round(el.getBoundingClientRect().height));
  console.log("searchBtn=" + searchBtn);
  if (searchBtn < 44) fail("search button shorter than 48px, got " + searchBtn);
  const tipsLink = await page.locator('[data-testid="search-tips"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return { size: s.fontSize, deco: s.textDecorationStyle, color: s.color };
  });
  console.log("tipsLink=" + JSON.stringify(tipsLink));
  if (tipsLink.size !== "12.8px") fail("tips-link not 0.8rem, got " + tipsLink.size);
  if (tipsLink.deco !== "dotted") fail("tips-link not dotted underline, got " + tipsLink.deco);
  if (!tipsLink.color.includes("136, 136, 136")) fail("tips-link not #888, got " + tipsLink.color);
  const sortSelect = await page.locator('[data-testid="search-sort"]').evaluate((el) => {
    const s = getComputedStyle(el);
    return { size: s.fontSize, height: Math.round(el.getBoundingClientRect().height) };
  });
  console.log("searchSort=" + JSON.stringify(sortSelect));
  if (sortSelect.size !== "12.8px") fail("search sort not 0.8rem, got " + sortSelect.size);
  await page.locator('[data-testid="search-input"]').fill("word0");
  await page.waitForSelector('[data-testid="search-hits"] button', { timeout: 10000 });
  const hitCount = await page.locator('[data-testid="search-hits"] button').count();
  console.log("searchHits=" + hitCount);
  if (hitCount < 1) fail("search did not find the entry");
  const resultCount = (await page.locator('[data-testid="result-count"]').textContent()) ?? "";
  console.log("resultCount=" + resultCount.trim());
  if (!/entry/i.test(resultCount)) fail("search missing result count, got " + resultCount);
  const highlight = (await page.locator(".result-snippet b").first().textContent()) ?? "";
  console.log("snippetMark=" + highlight);
  if (!/word0/i.test(highlight)) fail("search snippet missing <b> highlight, got " + highlight);
  const markStyle = await page.locator(".result-snippet b").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { weight: s.fontWeight, radius: s.borderTopLeftRadius };
  });
  console.log("snippetMarkStyle=" + JSON.stringify(markStyle));
  if (markStyle.weight !== "700" && markStyle.weight !== "bold") {
    fail("snippet highlight not weight 700, got " + markStyle.weight);
  }
  if (markStyle.radius !== "3px") fail("snippet highlight radius not 3px, got " + markStyle.radius);
  const resultDate = await page.locator(".result-date").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { size: s.fontSize, weight: s.fontWeight, color: s.color };
  });
  console.log("resultDate=" + JSON.stringify(resultDate));
  if (resultDate.size !== "12.8px") fail("result date not 0.8rem, got " + resultDate.size);
  if (resultDate.weight !== "600") fail("result date not weight 600, got " + resultDate.weight);
  if (!resultDate.color.includes("0, 200, 83")) fail("result date not #00c853, got " + resultDate.color);
  const resultTitle = await page.locator(".result-title").first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { size: s.fontSize, font: s.fontFamily };
  });
  console.log("resultTitle=" + JSON.stringify(resultTitle));
  if (resultTitle.size !== "16.8px") fail("result title not 1.05rem, got " + resultTitle.size);
  if (!/georgia|ui-serif|cambria|times/i.test(resultTitle.font)) fail("result title not serif, got " + resultTitle.font);
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
  await page.locator('[data-testid="hide-chrome"]').check();
  await page.goto(SITE, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="editor"]');
  await page.locator('[data-testid="editor"]').focus();
  await page.waitForFunction(
    () =>
      document.documentElement.dataset.writeFocus === "1" &&
      getComputedStyle(document.querySelector(".write-top")).opacity === "0",
    null,
    { timeout: 5000 },
  );
  const focusTop = await page.locator(".write-top").evaluate((el) => getComputedStyle(el).opacity);
  const focusExit = await page.locator('[data-testid="exit-focus"]').evaluate((el) => getComputedStyle(el).display);
  console.log("focusTop=" + focusTop + " focusExit=" + focusExit);
  if (focusTop !== "0") fail("hide chrome did not hide the write header, opacity " + focusTop);
  if (focusExit === "none") fail("hide chrome missing exit control");
  await page.locator('[data-testid="exit-focus"]').click();
  await page.waitForFunction(
    () =>
      document.documentElement.dataset.writeFocus !== "1" &&
      getComputedStyle(document.querySelector(".write-top")).opacity === "1",
    null,
    { timeout: 5000 },
  );
  const afterExit = await page.locator(".write-top").evaluate((el) => getComputedStyle(el).opacity);
  console.log("afterExit=" + afterExit);
  if (afterExit !== "1") fail("exit focus did not restore the write header, opacity " + afterExit);

  console.log("pageErrors=" + errors.length);
  if (errors.length) fail(errors.join("\n"));
  await browser.close();
  child.kill("SIGTERM");
  console.log("e2e ok");
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
}
