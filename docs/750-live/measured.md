# Live 750, recrawled 2026-08-26 afternoon

Source: `https://750words.com` Nuxt CSS + computed styles in Chrome (logged-out homepage + public `/_nuxt/` write chunks). Logged-in HTML still 403s.

`docs/750-source.md` and the old 1800-line `src/styles/app.css` are leftovers. Prefer this file.

`https://site.750words.com/` is the original Rails marketing site (same essay as original.750words.com). Current guests land on the **Nuxt** homepage at `https://750words.com/`. Copy that product, store name **500 Words**.

## Fonts

Cloud.typography `https://cloud.typography.com/6292418/6454012/css/fonts.css`

```
--font-serif-primary: "Sentinel SSm A", "Sentinel SSm B", "Times New Roman", Times, serif
--font-sans-metadata / --font-family-sans: "Gotham Narrow A", "Gotham Narrow B", "Helvetica Neue", Helvetica, Arial, sans-serif
```

Computed wordmark (`#logo`): Sentinel SSm, **20px / 700 / line-height 30px**, color `#1a1a1a`.

Both Sentinel SSm and Gotham Narrow are paid, domain-locked. We cannot hotlink them.

Legal substitutes:

- Sentinel SSm → **Bitter** (`next/font/google`), then `ui-serif`, Georgia
- Gotham Narrow → **Source Sans 3** (`next/font/google`), then `ui-sans-serif`, system-ui

## Logged-out 750 homepage (measured, **not copied**)

Recrawled 2026-08-26. 750 still ships the long ★ manifesto. Eric 2026-08-26: **do not copy that**. Our `/` is one white screen: wordmark, Menu, Let’s write. No doodle. Tokens below are for the **write page**, not the landing.

750 landing chrome, for the record only:

- App bar `#words-app-bar`: 64px, white, opacity 0.9, **no border, no shadow**
- Wordmark left, 20px / 700 serif (we keep this size on our landing wordmark and on the write page)
- Right: outlined 36px / 14px / 500 sans buttons (`Log In` / `Sign Up`). We put **Menu** on the landing instead.
- `h1`: 32px / 600 serif, `#00c853` — not used on our landing
- Do **not** copy post-write AI / mood / robot screenshots or “feelings, themes, and mindset” analysis

## Write chrome (`writing.iXoG4T04.css`, `write.B6t2A3Cm.css`)

- No “Menu” label on the write page
- `#logo`: 20px / 700 / serif
- Close: `.header-close-btn` 32×32, `.close-icon` 20×20 (gray ×)
- Content column: **820px**
- Date `.title-input`: **26px / 700** serif
- Editor: **19px** / 400 / `var(--line-height-content)` serif. Placeholder opacity 0.6, weight 300
- Focus-mode editor: 20px. Focus exit is a 36–44px control, not the word “Menu”

## Calendar (`EntryBrowser.98FSsd8p.css`)

- Month nav: `◀ Jul | Aug`, gap 0.25rem, sans
- `.streak-display`: 12px, `--color-text-secondary` (`#4a4a4a` light)
- Copy is **“N day streak”**, not “N days completed”
- `.day-grid-item`: **21×21**, **2px** border, **border-radius 20%**, margin 2px
- Empty: bg `#fbfbfb`, border `#e0e0e0`
- Today (not done): 2px `--theme-primary` `#00c853`
- Completed: **solid `#4caf50`** + white check 14px

## Footer (`WritePageFooter.Dbeovq_b.css` + `DYZtNmI2.js`)

Live Vue (do not keep N/500):

```
numPages() { return Math.floor(this.currentWords / 250) }   // 250 = 750 / 3
showStatsButton() { return this.currentWords >= 750 }
```

- `.footer-content`: max-width 820px, padding 16px, 14px, **flex-start** (not space-between)
- `.footer-icons .page-icon`: `/images/page-transparent.png`, height 16, opacity 0.7
- 0 words → tagline `Private, unfiltered, spontaneous, daily`
- words > 0 → **`N words`** (never `N/500`)
- papers appear as they fill; tooltip `N page(s) = N*250 words`
- ≥ goal → `🎉 SEE STATS` plus the papers plus `N words`
- saved: ` •` + mdi-content-save

500 Words: `WORD_GOAL` stays 500. Three papers fill toward 500 (`words / (500/3)`). Same image. No two-paper invention. No N/500.

## Explicitly not copied

EntryMindset, EntryDonutChart, Silly Robot, Streak Fairy, mood/theme analysis after the daily goal, 750’s paid webfonts.
