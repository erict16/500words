# Live 750 write page, pulled 2026-08-26

Source: `https://750words.com` Nuxt CSS + computed styles in Chrome.
Logged-in HTML still 403s. Write-page CSS is public under `/_nuxt/`.

Do not treat `docs/750-source.md` or `src/styles/app.css` as newer than this.

## Fonts (computed on the live homepage / login shell)

Cloud.typography `https://cloud.typography.com/6292418/6454012/css/fonts.css`

```
--font-serif-primary: "Sentinel SSm A", "Sentinel SSm B", "Times New Roman", Times, serif
--font-sans-metadata / --font-family-sans: "Gotham Narrow A", "Gotham Narrow B", "Helvetica Neue", Helvetica, Arial, sans-serif
```

Computed wordmark: Sentinel SSm, **20px / 700 / line-height 30px**, color `#1a1a1a`.

Both Sentinel SSm and Gotham Narrow are paid, domain-locked. We cannot hotlink them.

Legal substitutes in this repo:

- Sentinel SSm → **Bitter** (`next/font/google`), then `ui-serif`, Georgia
- Gotham Narrow → **Source Sans 3** (`next/font/google`), then `ui-sans-serif`, system-ui

## Write chrome (`writing.iXoG4T04.css`, `write.B6t2A3Cm.css`)

- No “Menu” label on the write page
- `#logo`: 20px / 700 / serif
- Close: `.header-close-btn` 32×32, `.close-icon` 20×20 (gray ×)
- App bar: no border, no shadow, opacity 0.9
- Content column: **820px**
- Date heading `.title-input`: **26px / 700** serif
- Editor: **19px** / 400 / `var(--line-height-content)` serif. Placeholder opacity 0.6, weight 300
- Focus-mode editor: 20px. Focus exit is a 36–44px control, not the word “Menu”

## Calendar (`EntryBrowser.98FSsd8p.css`)

- Month nav: `◀ Jul | Aug`, gap 0.25rem, sans
- `.streak-display`: 12px, `--color-text-secondary` (`#4a4a4a` light), `margin-left: auto`
- Copy is **“N day streak”**, not “N days completed”
- `.day-grid-item`: **21×21**, **2px** border, **border-radius 20%**, margin 2px
- Empty: bg `#fbfbfb`, border `--theme-border-light` `#e0e0e0`
- Today (not done): 2px `--theme-primary` `#00c853`
- Completed / high word count: **solid `--color-success` `#4caf50`** + inverse (white) check
- Check: 14px, drop-shadow

## Footer (`WritePageFooter.Dbeovq_b.css`)

- `.footer-content`: max-width 820px, padding 16px, 14px
- `.footer-text`: serif, `--color-text-secondary`, `top: 3px`
- Tagline: Private, unfiltered, spontaneous, daily
- We keep 500’s `saved` / `N/500`. Do not copy AI / mood / robot analysis

## Explicitly not copied

EntryMindset, EntryDonutChart, Silly Robot, Streak Fairy, mood/theme analysis after 750 words.
