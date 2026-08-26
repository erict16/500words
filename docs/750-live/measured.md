# Live 750, recrawled 2026-08-26 evening

Source: `https://750words.com` Nuxt CSS + public `/_nuxt/` write chunks. Logged-in HTML still 403s. Write JS still ships.

Prefer this file over `docs/750-source.md` and over leftover `src/styles/app.css`.

`https://site.750words.com/` is the original Rails marketing site. Current guests land on the **Nuxt** homepage at `https://750words.com/`. Copy that product’s **write page**. Store name **500 Words**. Goal **500**.

## Crawl set (this pass)

| File | What |
| --- | --- |
| `writing.iXoG4T04.css` | WritingLayout: 64px bar, logo 20px/700, close, `body:has(.focus-mode-active) #focus-close-btn` hidden |
| `write.B6t2A3Cm.css` | WritePage: 820px column, date 26px/700, editor 19px, focus 20px / date 28px, close 32×32 |
| `EntryBrowser.98FSsd8p.css` | 21×21 cells, 2px border, 20% radius, 2px margin, today ring, completed fill |
| `WritePageFooter.Dbeovq_b.css` | footer 820px flex-start, papers, `--focus` hides footer, exit-focus 36px top-right |
| `WritePage.V2vC6_NP.js` → `WritePage.focus.extract.js` | F11 / Esc toggle; hides entry-browser |
| `EntryBrowser.CuHKhKP7.js` | `◀ Mon \| Mon ►`, streak, focus-toggle “Enter focus mode (F11)” |
| `WritePageFooter.DYZtNmI2.js` | `numPages = floor(words/250)`, SEE STATS at 750, save = mdi-content-save |
| `WritingLayout.Buex9xG7.js` | logo + close only; close hidden in focus |
| `colorScale.DKDCDld5.js` | Bunny 1500-stop green; empty `#eeeeee` / cell bg `#fbfbfb`; check `#fff`; today `#00C853` |
| `tokens-bunny.css` | `:root` / `[data-theme=bunny]` tokens |
| `LoggedOutHomepage.O1qpbDpb.css` | green 32px/600 h1, outlined header, filled LOG IN / SIGN UP |

## Fonts

Cloud.typography `https://cloud.typography.com/6292418/6454012/css/fonts.css`

```
--font-serif-primary: "Sentinel SSm A", "Sentinel SSm B", "Times New Roman", Times, serif
--font-sans-metadata / --font-family-sans: "Gotham Narrow A", "Gotham Narrow B", "Helvetica Neue", Helvetica, Arial, sans-serif
--font-mono-code: "Roboto Mono", ui-monospace, ...
```

Computed wordmark (`#logo`): Sentinel SSm, **20px / 700 / line-height 30px**, color `#1a1a1a`.

Legal substitutes: **Bitter** (serif), **Source Sans 3** (sans).

## Logged-out homepage chrome (copied)

- App bar 64px, white, opacity 0.9, no border, no shadow
- Wordmark left, 20px / 700 serif
- Right: outlined 36px / 14px / 500 sans **Log In** / **Sign Up**, `text-primary` green `#00c853`
- `h1`: 32px / 600 serif, `#00c853`
- Bottom: filled 48px **LOG IN** / **SIGN UP**
- Do **not** copy the ★ manifesto, Artist Way, or AI / mood / robot charts

## Write chrome

- No “Menu” label
- `#words-app-bar` fixed, 64px, opacity 0.9
- `#logo`: 20px / 700 / serif
- Close: WritingLayout `#focus-close-btn` v-btn icon **36×36** (`.writing-control-btn`). Unused `.header-close-btn` is 32×32. Icon 20×20. Screenshot × is gray, not `#1a1a1a`
- Content: **820px**, padding 12px 16px, padding-bottom 50px
- Date `.title-input`: **26px / 700** serif. Focus: **28px** + bottom rule
- Editor: **19px** / 400 / line-height 1.6 serif. Placeholder opacity 0.6, weight 300, `Write something here...`
- Focus-mode editor: **20px**

## Focus mode (from WritePage.js)

Enter: **F11**, or EntryBrowser `.focus-toggle-btn` (`v-btn` outlined small, mdi-fullscreen, title “Enter focus mode (F11)”). Recrawl: `docs/750-live/WritePage.focus.extract.js` from `/_nuxt/V2vC6_NP.js`.
Exit: **F11**, **Escape**, or `.exit-focus-btn` (elevated small, mdi-fullscreen-exit, “Exit focus mode (F11 or ESC)”, fixed top-right 20px; **36px circle on ≤800px**).
Hides: month grid / entry-browser (`v-if !focusMode`), footer (`.write-footer--focus`), header close (`body:has(.focus-mode-active) #focus-close-btn`). Logo and date stay. Write page at 500 Words has **no ⋮** even though 750 still ships one.

## Calendar

- Month nav: `◄ Jul | Aug` (U+25C4 + MMM), gap **0.25rem**. Next month `Sep ►` when that month is not the future. Current month is wrapped in `<strong>` (**700**). No speaker icon.
- `.streak-display`: 12px, `#4a4a4a`, copy **“N day streak”**
- `.day-grid-item`: **21×21**, **2px** border, **border-radius 20%**, margin 2px, hover `translateY(-2px)`
- Empty: bg `#fbfbfb`, border `#e0e0e0`
- Today (not done): 2px `#00c853`
- Words > 0: Bunny gradient indexed by word count (we scale `words * 750/500` so 500 looks like 750)
- Completed: fill + white **✔** 14px
- Future empty: opacity **0.9**

## Footer

```
numPages() { return Math.floor(this.currentWords / 250) }
showStatsButton() { return this.currentWords >= 750 }
```

- `.footer-content`: max-width 820px, padding 16px, 14px, **flex-start**
- `.page-icon`: `/images/page-transparent.png`, height 16, opacity 0.7
- 0 words → `Private, unfiltered, spontaneous, daily`
- words > 0 → **`N words`** (never `N/500`)
- saved: ` •` + floppy icon (not the word “saved”)
- ≥ goal → green filled `BaseButton type=primary` **28px / 13px / 500 / white** `🎉 SEE STATS` (screenshot fill `#00c853`, radius ~4px) plus papers plus `N words`. Not a text link. `.mono` count uses Roboto Mono.

500 Words: three papers fill toward 500 (`words / (500/3)`).

## Explicitly not copied

EntryMindset, EntryDonutChart, Silly Robot, Streak Fairy, mood/theme analysis after the daily goal, 750’s paid webfonts, the ★ manifesto landing.
