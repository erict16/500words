# 500 Words design guide

Visual and interaction: copy **current** 750words.com (the Nuxt product at https://750words.com), measured live. Store name is **500 Words**. Goal is **500 words**. Do not copy the post-write AI / mood / robot analysis.

Live tokens: `docs/750-live/`. `docs/750-source.md` and the old 1800-line `src/styles/app.css` are leftovers. Prefer live CSS + Tailwind.

This file overrides older “quiet Menu”, “wordmark 400”, “do not make it 750”, bowling/Sniglet, “no landing”, and “keep N/500” instructions.

## Type

750 uses paid Cloud.typography faces. We cannot hotlink them.

```
750 serif (paid):  Sentinel SSm A/B, Times New Roman, Times, serif
we use:            Bitter (Google, legal slab in the same category), ui-serif, Georgia, Cambria, Times

750 sans (paid):   Gotham Narrow A/B, Helvetica Neue, Helvetica, Arial, sans-serif
we use:            Source Sans 3 (Google), ui-sans-serif, system-ui, Helvetica, Arial
```

| Surface | Size | Weight | Face |
| --- | --- | --- | --- |
| Wordmark “500 Words” | 20px / 30px line | **700** | serif |
| Landing wordmark | 20px / 30px line | **700** | serif |
| Landing “Let’s write” | clamp 52–96px | **700** | serif |
| Write date | **26px** | **700** | serif |
| Editor | **19px** | 400, line-height ~1.6 | serif |
| Placeholder | 19px | 300, opacity 0.6 | serif |
| Streak / chrome | 12px | 400 | sans |
| Footer | 14px | 400 | serif |
| Inner nav | 16px | 400 | sans |
| Landing Menu | 13px / 500, uppercase, tracked | sans |

Green: `#00c853` primary (today ring, links, Let’s write rule). Success checks `#4caf50`. Ink `#1a1a1a`. Secondary `#4a4a4a`.

## Landing (`/`) — Menu lives here only

One white viewport. Type and air. Guests see this first. **Do not** copy the 750 ★ manifesto (Artist Way, charts, fake writer counts). **Do not** use a doodle, Notion illustration, photo, or any drawing.

- Serif wordmark, **Menu** (Write, Stats, Badges, One month, Search, Settings, Sign in / Sign out), giant **Let’s write** → `/write`.
- Short green rule under Let’s write. Nothing else on the screen.
- No second CTA block. Nothing below the fold on a desktop viewport.
- Sign in is Google (in Menu). Second path: Let’s write on this device.
- Signed-in visitors at `/` go to `/write`.
- Write page is **not** restyled to match the landing.

## Write page (`/write`)

Match the current 750 write overlay:

- **No “Menu”.** No Write / Stats / Badges row on this page.
- Top: wordmark left (20px / 700 serif), **gray ×** right (close / exit).
- Long date, **26px / 700**.
- Under the date: left `◀ Jul \| Aug`; right **avatar + “N day streak” + square ⋮**.
- Guests / no photo: empty 750-style (no homemade “0 days completed”).
- Month squares: **21px**, 2px border, ~20% radius. Empty = light gray border on `#fbfbfb`. Done = **solid `#4caf50` + white check**. Today not done = green ring, not a filled check.
- Placeholder: `Write something here...`
- Footer copies live `.write-footer .footer-content` (820px, flex-start):
  - 0 words: `Private, unfiltered, spontaneous, daily`
  - words > 0: **`N words`** — never `N/500`
  - **Three paper icons** (`.footer-icons .page-icon`, live `/images/page-transparent.png`). 750 fills one paper per 250 words toward 750. We fill one paper per `500/3` words toward 500. Same three-paper meter. No two-paper invention. Extra papers if you keep writing, same as 750 past 750.
  - At 500: `🎉 SEE STATS` plus the papers plus `N words`. Strike + confetti.
- **No AI analysis.** No mood, theme, Silly Robot, Streak Fairy.

The ⋮ on the write page is the in-session menu (Write, Stats, Badges, …). The word **Menu** is landing-only.

## Type first after the landing

Guests land, then write. Sign in is optional (landing Menu / Sign in, or ⋮ → Sign in). Guest data is local until Google.

No pricing. No AI pitch.

## Inner pages

Keep 16px sans nav with a green active underline until a later pass copies those 750 screens. Stats, badges, search, settings, person. Still no AI.

## Do not

- Restore Sniglet, numbered bowling boxes, or a teal Materialize bar on the write page
- Put “Menu” on the write page
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
