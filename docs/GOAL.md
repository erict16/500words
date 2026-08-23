# Goal: 500 Words is 750 Words

Keep going until an independent check can sit down, sign in, type, hit 500, and see the same ritual as 750 Words. Stop only then.

Repo: `/Users/youming/Github/500words`
Live (must 200): `https://500words-ink.vercel.app` (also keep `500words-inky.vercel.app` aliased if Vercel will take it)
Firebase: `simply-journal-474a1`

## Explicitly not in the product

- Marketing homepage / “what is this” essay
- AI analysis (mood, theme, mindset, Silly Robot, Streak Fairy reading your prose)

Everything else 750 Words has after login is in.

## The site must run

1. Production URL returns HTTP 200, not `DEPLOYMENT_NOT_FOUND`.
2. First paint is a sign-in screen, never an infinite “Loading…”.
3. **Continue with Google** opens Google and lands on today’s page.
4. If Google fails, **Write on this device** still opens the writing page (local save). The app is never a brick.
5. Typing autosaves. Cmd-S flashes green “saved”. Reloading keeps the words.
6. Font, size, and theme from Settings apply to the writing surface immediately.

## Writing page (the original 750 ritual, 500 instead of 750)

This is the original bowling calendar, not a green check-mark month view.

- Teal top bar (`#2bbbad`), white “500 Words”, white links: Write · Stats · Badges · One month · Settings · Sign out
- Under that: month name on the left, month points on the right
- **31 (or 28–31) boxes in a wrapping row.** Day number tiny in the top-left of each box.
  - empty = blank box
  - started (<100 words) = small center dot
  - spare (100–499) = a single `/` drawn through the box
  - strike (500+) = an `X` drawn through the box
  - today = stronger border
  - future days disabled
- Click a past box to read that day (read-only). You cannot add words to a closed day.
- Writing column: Georgia (default), ~21px, ~640px measure, typewriter-ish scroll as you type
- Fonts in Settings: Georgia, Palatino, Times, Helvetica, Courier. Size slider. Paragraph spacing. Light / dark.
- Live count bottom-left: `12 / 500`. At 500 it turns into a green stats link.
- First time you hit 500 that day: confetti + “500. That’s a strike.”
- Missed yesterday: banner to write 1000 today to keep the streak (makeup). Makeup marks yesterday repaired.

## Scoring (750 FAQ, 500-word strike)

- 1 base point for 100–499 words (spare)
- 2 base points for 500+ (strike)
- Spare adds yesterday’s base
- Strike adds the previous two days’ base
- Three strikes = turkey = 6
- A day is midnight–midnight in the user’s timezone

## Other pages (after login)

- **Stats:** today’s words, time, pauses, WPM, points. This month. All time. No mood/theme AI. Optional `MOOD: 7` style tags the user typed.
- **Badges:** Tag Savage animals (egg, turkey, penguin, flamingo, albatross, phoenix, pterodactyl, spacebird, spirit versions, cheetah, hamster, early bird, night bat, oxalis, word-count animals, turquoise horse). Drawings, not stick-figure outlines.
- **One month:** write 500 every day this month. Wall of awesomeness / wall of shame. Turquoise horse on a win. Join mid-month does not shame days before you joined.
- **Settings:** fonts, size, spacing, theme, timezone, hide chrome while typing, export.
- **Public person page:** counts and badges only. Never the writing.

## Login look

Not a landing page. Same teal bar. Georgia title. One Google button. One quiet local fallback. No tagline, no “what is this”, no marketing copy.

## Tests (must exist in this repo)

- Unit: word count, spare/strike marks, bowling points, makeup streak, challenge join date
- Playwright: sign-in screen (Google + Write on this device), 31-ish day boxes, type 500 words, today-box gets `strike`, banner “500. That’s a strike.”, Cmd-S flashes saved, reload keeps the words, font-size changes, no pageerror
- `npm test`, `npm run e2e`, `npx tsc --noEmit`, `npm run build` green

## Done means

A stranger can open the live URL, sign in (or write locally), fill a page, see the X, and not wonder if they landed on a different product than 750 Words.
