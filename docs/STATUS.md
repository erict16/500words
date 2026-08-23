# STATUS

Keep going until a stranger can open https://500words-ink.vercel.app, sign in or write locally, hit 500, see an X, and not think this is a different product than 750 Words (no landing, no AI).

STOP only when that is true. Firebase wiring is not STOP. A 30-minute slice is not STOP.

Clone **original.750words.com** (Rails bowling). Do not clone 750words.com Nuxt teal/Vuetify. Tokens: `docs/750-source.md`.

## Done

- Live `500words-ink.vercel.app` HTTP 200
- Google + “Write on this device” (never infinite Loading)
- Local write survives reload
- Original chrome: **800px** paper, **30px Sniglet** black wordmark, **bold black Helvetica** nav (`margin-right: 15px`), no teal bar
- Day boxes **22px**, day number **11px bold**, `/` spare and `X` strike, wrapping row
- Editor Georgia 21px (settings) on a **770px** measure; footer count **14px `#666`**, at 500 **green bold** stats link; `.days-left`; confetti + “500. That’s a strike.”
- Page titles **35px `#4DB559` Sniglet**; stats hero **40px `#4DB559`**; search box 16px `#666` borderless
- Badges catalog of rows (drawing + name + how). Unearned grey. `data-badge` kept
- Stats scorecard + word bars + dated archive; one month walls; person page is counts + badges only
- Sign-in: same 800px header, Sniglet title, Continue with Google, quiet local fallback
- Unit + Playwright e2e (no teal bar, 30px wordmark, 14px count, green at 500, 22px boxes, 800px column)

## Next

- Drawings are ours, not Tag Savage’s originals
- Inner pages still not a logged-in HTML overlay of original.750words.com (auth-gated)
- Firestore owner-only rules file exists, not published
- `500words-inky.vercel.app` still 404 (ink is the live host)

## Do not

- Add a marketing landing
- Add AI mood/theme/Silly Robot
- Copy Nuxt V2 teal/Material chrome
- Stop because Firebase is linked
