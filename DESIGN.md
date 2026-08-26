# 500 Words design guide

Visual and interaction: copy **current** 750words.com (the Nuxt product at https://750words.com), measured live. Store name is **500 Words**. Goal is **500 words**. Do not copy the post-write AI / mood / robot analysis.

Live tokens: `docs/750-live/`. `docs/750-source.md` and the old 1800-line `src/styles/app.css` are leftovers. Prefer live CSS + Tailwind.

This file overrides older “quiet Menu”, “wordmark 400”, “do not make it 750”, bowling/Sniglet, “no landing”, and “keep N/500” instructions.

## Type

750 uses paid Cloud.typography faces. We cannot hotlink them.

```
750 serif (paid):  Sentinel SSm A/B, Times New Roman, Times, serif
we use:            Zilla Slab default (closest slab silhouette, OFL), plus Merriweather and Bitter

750 sans (paid):   Gotham Narrow A/B, Helvetica Neue, Helvetica, Arial, sans-serif
we use:            Barlow Semi Condensed default (closest to Gotham Narrow, OFL), plus Montserrat, Figtree, Source Sans 3
```

| Surface | Size | Weight | Face |
| --- | --- | --- | --- |
| Wordmark “500 Words” | 20px / 30px line | **700** | serif |
| Landing wordmark | 20px / 30px line | **700** | serif |
| Landing welcome | 32px | **600** | serif, `#00c853` |
| Write date | **26px** (28px in focus) | **700** | serif |
| Editor | **19px** (20px in focus) | 400, line-height ~1.6 | serif |
| Placeholder | 19px | 300, opacity 0.6 | serif |
| Streak / chrome | 12px | 400 | sans |
| Footer | 14px | 400 | serif |
| Inner nav | 16px | 400 | sans |
| Landing Log In / Sign Up | 14px / 36px outlined | **500** | sans |

Green: `#00c853` primary (today ring, links, outlined header buttons). Success checks `#4caf50`. Ink `#1a1a1a`. Secondary `#4a4a4a`.

## Landing (`/`) — 750 logged-out chrome

Guests see 750’s logged-out header: serif wordmark left, outlined **Log In** + **Sign Up** right. No Menu. No giant Let’s write.

- **Do not** copy the 750 ★ manifesto (Artist Way, charts, fake writer counts) or post-write AI screenshots.
- **Do not** use a doodle, Notion illustration, photo, or any drawing.
- Welcome heading in brand green. Short private-writing blurb. Filled LOG IN / SIGN UP. Quiet guest path: Write on this device → `/write`.
- Sign in is Google (Log In / Sign Up). Guests can still write locally at `/write`.
- Signed-in visitors at `/` go to `/write`.
- Write page is **not** restyled to match the landing.

## Write page (`/write`)

Match the current 750 write overlay:

- **No “Menu”.** No Write / Stats / Badges row on this page.
- Top: **fixed 64px** bar, opacity 0.9, wordmark left (20px / 700 serif), **gray ×** right (close / exit). Close hides in focus mode.
- Long date, **26px / 700**. In focus mode: **28px** with a light bottom rule.
- Under the date: left `◀ Jul \| Aug` (and `Sep ►` when that month is not the future); right **avatar + “N day streak” + `.focus-toggle-btn`**. **No ⋮ / kebab / Menu** on this page (Eric, 2026-08-26 — 750 still has a ⋮; ours stays gone).
- **Focus mode:** F11 or EntryBrowser `.focus-toggle-btn` (mdi-fullscreen, title `Enter focus mode (F11)`). Hides the month grid, streak row, close ×, and footer. Logo and date stay. Exit: F11, Esc, or fixed top-right `.exit-focus-btn` (mdi-fullscreen-exit, 36px on small screens).
- Guests / no photo: empty 750-style (no homemade “0 days completed”).
- Month squares: **21px**, 2px border, ~20% radius, 2px margin. Empty = `#fbfbfb` / `#e0e0e0`. Words fill the live Bunny green scale (750 index × 500/750). Done = fill + **white check**. Today not done = `#00c853` ring. Hover lifts 2px.
- Placeholder: `Write something here...`
- Footer copies live `.write-footer .footer-content` (820px, flex-start):
  - 0 words: `Private, unfiltered, spontaneous, daily`
  - words > 0: **`N words`** — never `N/500`
  - **Three paper icons** (`.footer-icons .page-icon`, live `/images/page-transparent.png`). 750 fills one paper per 250 words toward 750. We fill one paper per `500/3` words toward 500. Same three-paper meter. No two-paper invention. Extra papers if you keep writing, same as 750 past 750.
  - At 500: `🎉 SEE STATS` plus the papers plus `N words`. Strike + confetti.
- **No AI analysis.** No mood, theme, Silly Robot, Streak Fairy.

Do not put Menu or ⋮ on the write page. The landing uses Log In / Sign Up, not the word Menu. Inner pages keep the 16px sans nav.

## Type first after the landing

Guests land, then write. Sign in is optional (landing Log In / Sign Up). Guest data is local until Google. Inner pages (Stats, Settings, …) still have Sign in.

No pricing. No AI pitch.

## Inner pages

Keep 16px sans nav with a green active underline until a later pass copies those 750 screens. Stats, badges, search, settings, person. Still no AI.

## Do not

- Restore Sniglet, numbered bowling boxes, or a teal Materialize bar on the write page
- Put “Menu” on the write page, or park Menu on the landing
- Set the wordmark to 400
- Show `N/500` in the write footer
- Invent two papers, or keep a numeric goal instead of the three papers
- Add AI when the day is done
- Invent “0 days completed”
- Copy the 750 ★ manifesto / Artist Way landing
- Put a doodle, Notion illustration, or any drawing on the landing
- Restyle the write page to match the landing
- Merge `750-parity` into main from here
- Revive `feat/overnight-750-lock`
