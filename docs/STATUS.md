# STATUS

Keep going until a stranger can open https://500words-ink.vercel.app, sign in or write locally, hit 500, see an X, and not think this is a different product than 750 Words (no landing, no AI).

STOP only when that is true. Firebase wiring is not STOP. A 30-minute slice is not STOP.

## Done

- Live `500words-ink.vercel.app` HTTP 200
- Google + “Write on this device” (never infinite Loading)
- Local write survives reload
- Teal bar `#2bbbad`, italic Georgia “500 Words”, Lucida nav, 28px bowling boxes with `/` and `X`, Georgia 21px / 640px editor, footer `n / 500` turning into a green stats link, confetti, 500 strike
- Stats scorecard with points under the boxes + word bars, badges, one month walls, settings, public person, search
- Badge drawings are ink-and-wash animals (egg, turkey+fan, penguin+bow tie, flamingo, albatross, phoenix, pterodactyl, spacebird, spirit dashed frames, cheetah, hamster, early bird, night bat, oxalis, word-count flocks, turquoise horse). Unearned stays grey. `data-badge` kept.
- Sign-in: same teal bar, Georgia title, Continue with Google, quiet local fallback
- Unit + Playwright e2e in repo

## Next

- Drawings are ours, not Tag Savage’s originals. Still not the 750 badge sheet.
- Header/type closer, not pixel-identical (Materialize 750 used a slightly different logo size and nav rhythm)
- Firestore owner-only rules file exists, not published
- `500words-inky.vercel.app` still 404 (ink is the live host)
- Confirm Google authorized domain includes `500words-ink.vercel.app`

## Do not

- Add a marketing landing
- Add AI mood/theme/Silly Robot
- Stop because Firebase is linked
