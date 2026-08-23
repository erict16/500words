# Goal: 500 Words is 750 Words, minus landing and AI

Stop only when every item below is true. Repo: `~/Github/500words`. Live: https://500words-inky.vercel.app. Firebase: `simply-journal-474a1`.

## Locks

- Daily goal is **500** words, not 750.
- No marketing homepage. Signed-out users see a Google sign-in gate, then the writing page.
- No AI analysis: no mood, theme, mindset, Silly Robot, Streak Fairy prose-reading. Count words. Session time, pauses, WPM, points, badges, challenge stay.

## Must match 750 Words

1. **Google + Firebase** works on localhost and production. Writing syncs. Authorized domains include `localhost` and the Vercel hosts.
2. **Writing page:** month of boxes at the top, empty / started-dot / `/` spare (100+) / `X` strike (500). Live word count. Autosave. Cmd-S saved flash. Confetti the first time you hit 500 that day. Georgia (and the other four fonts), size, spacing, light/dark.
3. **Bowling points:** 1 base for 100–499, 2 for 500+. Spare adds yesterday’s base. Strike adds the previous two days. Turkey = 6.
4. **Makeup:** 1000 words today repairs yesterday if it missed.
5. **Stats, badges (Tag Savage animals, not stick figures), one-month challenge, public person page (counts/badges only), settings, export.**
6. **Tests in-repo:** unit tests for scoring/marks/makeup/challenge; Playwright for write → 500 → strike + confetti. `npm test`, lint, `tsc`, `next build` green.

## Out of scope

Landing page copy. AI analysis. Owning `500words.vercel.app` (already taken).
