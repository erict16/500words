# STATUS

Keep going until a stranger can open https://500words-ink.vercel.app, see a one-screen white landing (Menu + Let’s write, type and air, no doodle), then write a page that looks like **current** 750words.com (20px/700 serif wordmark, gray × not Menu, 26px date, avatar + streak + ⋮, solid green checks, 19px serif editor, three paper icons — not N/500). 500 words. No AI.

STOP only when that is true.

## Done (keep)

- Live `500words-ink.vercel.app`
- Google + Write on this device
- Sync / search / streak / privacy logic from main
- Inner pages: stats, badges, search, settings, person, challenge (logic stays; chrome later)
- Hitting 500: strike + confetti. No AI analysis.

## This branch (`750-parity`)

- Recrawled live 750 into `docs/750-live/` (write footer JS, paper PNG). Write chrome copied from that.
- Guests see a **one-screen white landing** at `/`. Wordmark, **Menu**, **Let’s write**. No doodle. Not the 750 ★ manifesto.
- Write page is `/write`. No Menu; wordmark 700; gray ×; 26px date; Jul | Aug; avatar + “N day streak” + ⋮
- Month squares: empty gray ring; completed = solid `#4caf50` + white check
- Footer: three `.page-icon` papers filling toward 500 (`500/3` words each). `N words`. No `N/500`.
- Editor 19px Bitter (Sentinel stand-in). Source Sans 3 for chrome (Gotham Narrow stand-in)
- Tailwind + live tokens on the write/landing shell. Do not treat `app.css` as the source of truth
- Guidance md rewritten so they no longer say “quiet Menu”, “don’t make it 750”, “no landing”, “keep N/500”, or “copy the 750 landing essay”

## Next

- Inner pages: copy current 750 stats / badges / search / settings chrome
- Tag Savage PNG/GIF art still isn’t in the public CSS
- Firestore rules: owner-only days + no diary body on `public/` (verified in unit tests; deploy with `firebase deploy --only firestore:rules`)
- `500words-inky` 404
- Tab icon (queued; **not this pass**)

## Do not

- Restore Sniglet / numbered bowling boxes on the write page
- Put “Menu” back on the write page
- Show `N/500` in the write footer
- Add AI
- Copy Nuxt V2 analysis
- Merge this branch into main from here
- Revive `feat/overnight-750-lock`
- Ship a new favicon this pass
