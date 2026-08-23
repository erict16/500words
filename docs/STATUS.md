# STATUS

Keep going until a stranger can open https://500words-ink.vercel.app, sign in or write locally, hit 500, see an X, and not think this is a different product than 750 Words (no landing, no AI).

STOP only when that is true. Firebase wiring is not STOP. A 30-minute slice is not STOP.

## Done

- Live `500words-ink.vercel.app` HTTP 200
- Google + “Write on this device” (never infinite Loading)
- Local write survives reload
- Chrome matches `original.750words.com` / `docs/750-source.md` (not Materialize teal, not Nuxt V2):
  - 800px column, 16px
  - Header is not a teal bar. 30px sniglet/bree (Helvetica fallback) “500 Words” in black, no underline. Nav black, bold, 15px margin-right
  - Editor Helvetica 20px / 1.6em, 770px, border 0, padding 10px 0
  - Footer count 14px #666; at 500 CSS `green` + bold (stats link)
  - Month cells ~20px, 11px bold day numbers; drawn `/` and `X`
  - Stats big numbers 40px #4DB559
  - Search 16px #666, no border
  - Sign-in form ~350px, not a centered hero
  - Makeup/strike notice: Georgia 11pt, #d4eef7
- Confetti + “500. That’s a strike.”
- After-login pages share the 800px column; h1 is 35px #4DB559
- Badges are a catalog of rows. Unearned grey. `data-badge` kept
- Stats scorecard + word bars + dated archive; one month walls; person page is a scoreboard
- Unit + Playwright e2e (original CSS tokens, 20–28px boxes, 14px count, green, 27 badge rows, archive)

## Next

- Drawings are ours, not Tag Savage’s originals (those images are not in the public CSS)
- Firestore owner-only rules file exists, not published
- `500words-inky.vercel.app` still 404 (ink is the live host)

## Do not

- Add a marketing landing
- Add AI mood/theme/Silly Robot
- Copy current 750words.com Nuxt V2
- Stop because Firebase is linked
