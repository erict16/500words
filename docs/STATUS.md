# STATUS

Keep going until a stranger can open https://500words-ink.vercel.app and the write page looks like **current** 750words.com (20px/700 serif wordmark, gray × not Menu, 26px date, avatar + streak + ⋮, solid green checks, 19px serif editor). 500 words. No landing. No AI.

STOP only when that is true.

## Done (keep)

- Live `500words-ink.vercel.app`
- Google + Write on this device
- Sync / search / streak / privacy logic from main
- Inner pages: stats, badges, search, settings, person, challenge (logic stays; chrome later)
- Hitting 500: strike + confetti. No AI analysis.

## This branch (`750-parity`)

- Scraped live 750 write CSS into `docs/750-live/`
- Write page: no Menu; wordmark 700; gray ×; 26px date; Jul | Aug; avatar + “N day streak” + ⋮
- Month squares: empty gray ring; completed = solid `#4caf50` + white check
- Editor 19px Bitter (Sentinel stand-in). Source Sans 3 for chrome (Gotham Narrow stand-in)
- Tailwind on the write shell. Do not treat `app.css` as the write-page source of truth
- Guidance md rewritten so they no longer say “quiet Menu” or “don’t make it 750”

## Next

- Inner pages: copy current 750 stats / badges / search / settings chrome
- Tag Savage PNG/GIF art still isn’t in the public CSS
- Firestore rules: owner-only days + no diary body on `public/` (verified in unit tests; deploy with `firebase deploy --only firestore:rules`)
- `500words-inky` 404

## Do not

- Restore Sniglet / numbered bowling boxes on the write page
- Put “Menu” back on the write page
- Add a marketing landing
- Add AI
- Copy Nuxt V2 analysis
- Merge this branch into main from here
- Revive `feat/overnight-750-lock`
