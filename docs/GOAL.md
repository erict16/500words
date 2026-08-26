# Goal: 500 Words looks and works like current 750 Words

Keep going until an independent check can sit down, type, hit 500, and see the same write-page ritual as **today’s** https://750words.com — store name 500 Words, goal 500 words, no post-write AI.

Repo: this tree. Live (must 200): `https://500words-ink.vercel.app`
Firebase: `simply-journal-474a1`

## Explicitly not in the product

- Marketing homepage / “what is this” essay
- AI analysis (mood, theme, mindset, Silly Robot, Streak Fairy reading your prose)

Everything else 750 Words has after login is in, visually copied from the **current Nuxt product**, not original.750words.com bowling.

## The site must run

1. Production URL returns HTTP 200, not `DEPLOYMENT_NOT_FOUND`.
2. First paint is a writing page (or a sign-in that still lets you write), never an infinite “Loading…”.
3. **Continue with Google** opens Google and lands on today’s page.
4. If Google fails, **Write on this device** still opens the writing page (local save). The app is never a brick.
5. Typing autosaves. Cmd-S flashes green “saved”. Reloading keeps the words.
6. Font, size, and theme from Settings apply to the writing surface immediately.

## Writing page (copy live 750, 500 instead of 750)

Live CSS: `docs/750-live/`. Prefer that over screenshots and over old dumps.

- No “Menu”. Wordmark **500 Words** 20px / 700 serif, gray × to leave write.
- Long date 26px / 700. Month `Jul | Aug`. Avatar + `N day streak` + ⋮.
- Month squares 21px, empty gray ring, completed solid green + white check.
- Writing column ~820px, Bitter (Sentinel stand-in), 19px, loose line-height.
- Live count: `12 / 500`. At 500 it turns into a green stats link.
- First time you hit 500 that day: confetti + “500. That’s a strike.”
- Missed yesterday: banner to write 1000 today to keep the streak (makeup).

## Scoring (750 FAQ, 500-word strike)

- 1 base point for 100–499 words (spare)
- 2 base points for 500+ (strike)
- Spare adds yesterday’s base
- Strike adds the previous two days’ base
- Three strikes = turkey = 6
- A day is midnight–midnight in the user’s timezone

## Other pages (after login)

- **Stats:** today’s words, time, pauses, WPM, points. Month view. All time. No mood/theme AI.
- **Badges:** Tag Savage animals. Drawings if the PNG still 404s.
- **One month:** write 500 every day this month.
- **Search:** find your own writing by word or date.
- **Settings:** fonts, size, spacing, theme, timezone, hide chrome, lock today after 500, display name, export, print.
- **Public person page:** counts and badges only. Never the writing.

Inner-page chrome can stay the 16px sans nav until a later pass. The write page must already match 750.

## Tests

- Unit: word count, spare/strike marks, bowling points, makeup streak, challenge join date
- Playwright: type-first write page, 28–31 day boxes, type 500 words, today-box gets a green check, banner, Cmd-S saved, reload keeps the words, no pageerror, no write-page “Menu”
- `npm test`, `npm run e2e`, `npx tsc --noEmit`, `npm run build` green

## Done means

A stranger can open the live URL, type, fill a page, see the green check, and not wonder if they landed on a different product than 750 Words — except the name is 500, the goal is 500, and there is no AI report.
