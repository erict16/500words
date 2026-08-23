# STATUS

Keep going until a stranger can open https://500words-ink.vercel.app, sign in or write locally, hit 500, see an X, and not think this is a different product than 750 Words (no landing, no AI).

STOP only when that is true. Firebase wiring is not STOP. A 30-minute slice is not STOP.

## Done

- Live `500words-ink.vercel.app` HTTP 200
- Google + “Write on this device” (never infinite Loading)
- Local write survives reload
- Teal bar `#2bbbad`, Materialize-era 64px rhythm, italic 32px Georgia “500 Words”, 14px white nav in a 1080px inner, 28px bowling boxes with `/` and `X`, Georgia 21px / 640px editor, footer `n / 500` turning into a green stats link, confetti, 500 strike
- Stats: scorecard with points under the boxes + word bars, dated “Your pages” archive (click a day to read it)
- Badges as a paper catalog (drawing + how), one month walls, settings, public person, search
- Badge drawings are ink-and-wash animals. Unearned stays grey. `data-badge` kept.
- Sign-in: same teal bar, Georgia title, Continue with Google, quiet local fallback
- Unit + Playwright e2e in repo (archive asserted)

## Next

- Drawings are ours, not Tag Savage’s originals. Still not the 750 badge sheet.
- Header/type closer (64px / 32px italic), still not a screenshot overlay of 2014 Materialize 750
- Firestore owner-only rules file exists, not published
- `500words-inky.vercel.app` still 404 (ink is the live host)

## Do not

- Add a marketing landing
- Add AI mood/theme/Silly Robot
- Stop because Firebase is linked
