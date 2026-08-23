# STATUS

Keep going until a stranger can open https://500words-ink.vercel.app, sign in or write locally, hit 500, see an X, and not think this is a different product than 750 Words (no landing, no AI).

STOP only when that is true. Firebase wiring is not STOP. A 30-minute slice is not STOP.

## Done

- Live `500words-ink.vercel.app` HTTP 200
- Google + “Write on this device” (never infinite Loading)
- Local write survives reload
- Teal bar `#2bbbad`, Materialize 64px + shadow, italic Georgia wordmark `2.1rem`, nav `15px` / `0.8px` tracking, 70% container
- Day boxes **28×28**, day number **9px**, `/` spare and `X` strike
- Editor Georgia 21px / 640px; footer count **24px Georgia `#9e9e9e`**, at 500 **`#4caf50`** stats link; `.days-left`; confetti + “500. That’s a strike.”
- After-login pages share the same 70% paper column: Georgia titles, `#9e9e9e` helpers, teal `#2bbbad` links
- Badges are a catalog of rows (drawing + name + how), not a tile grid. Unearned grey. `data-badge` kept
- Stats scorecard + word bars + dated archive; one month walls with hairlines; person page is a scoreboard of earned rows
- Sign-in: same teal bar, Georgia title, Continue with Google, quiet local fallback
- Unit + Playwright e2e (chrome tokens, 28px box, 24px count, `#4caf50`, 27 badge rows, archive)

## Next

- Drawings are ours, not Tag Savage’s originals
- Inner pages closer (same paper/type/links), still not a screenshot overlay of 2014 Materialize 750
- Firestore owner-only rules file exists, not published
- `500words-inky.vercel.app` still 404 (ink is the live host)

## Do not

- Add a marketing landing
- Add AI mood/theme/Silly Robot
- Stop because Firebase is linked
