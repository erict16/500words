# STATUS

Keep going until a stranger can open https://500words-ink.vercel.app, sign in or write locally, hit 500, see an X, and not think this is a different product than 750 Words (no landing, no AI).

STOP only when that is true. Firebase wiring is not STOP. A 30-minute slice is not STOP.

## Done

- Live `500words-ink.vercel.app` HTTP 200
- Google + “Write on this device” (never infinite Loading)
- Local write survives reload
- Teal bar `#2bbbad`, Materialize 64px + shadow, italic Georgia wordmark `2.1rem`, nav `15px` / `0.8px` tracking with hover fill (not underline), 70% container
- Day boxes **28×28**, `margin: 6px 3px 0`, day number **9px**, wrapping row, `/` spare and `X` strike
- Editor Georgia **21.3333px / 32px**, 640px measure; footer count **24px Georgia `#9e9e9e`**, at 500 **`#4caf50`** stats link; `.days-left` 11px `#4db6ac`; confetti + “500. That’s a strike.”
- Stats scorecard with points under the boxes + word bars, dated “Your pages” archive (words, plus time/wpm when the session has them)
- Badges as a paper catalog. Drawings use paper grain, ink displacement, wash, and animal-specific poses. Unearned grey. `data-badge` kept.
- Sign-in sits like a letterhead (title, Google, quiet local link), not a vertically-centered app hero. Writing surface has typewriter padding under the month strip.
- One month walls, settings, public person, search
- Sign-in: same teal bar, Georgia title, Continue with Google, quiet local fallback
- Unit + Playwright e2e (chrome tokens, 28px box, 24px count, `#4caf50` at 500, archive)

## Next

- Drawings are ours, not Tag Savage’s originals. Closer sheet layout, still not his watercolors.
- Inner pages (stats / settings / search) are Georgia-titled, not a screenshot overlay of 2014 Materialize 750
- Firestore owner-only rules file exists, not published
- `500words-inky.vercel.app` still 404 (ink is the live host)

## Do not

- Add a marketing landing
- Add AI mood/theme/Silly Robot
- Stop because Firebase is linked
