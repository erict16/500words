# 500 Words design guide

Visual and interaction: copy **current** 750words.com (the Nuxt product at https://750words.com), measured live. Store name is **500 Words**. Goal is **500 words**. Do not copy the post-write AI / mood / robot analysis.

Live tokens: `docs/750-live/`. `docs/750-source.md` and the old 1800-line `src/styles/app.css` are leftovers. Prefer live CSS + Tailwind on the write page.

This file overrides older “quiet Menu”, “wordmark 400”, “do not make it 750”, bowling/Sniglet, and original.750words.com write-page instructions.

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
| Write date | **26px** | **700** | serif |
| Editor | **19px** | 400, line-height ~1.6 | serif |
| Placeholder | 19px | 300, opacity 0.6 | serif |
| Streak / chrome | 12px | 400 | sans |
| Footer tagline | 14px | 400 | serif |
| Inner nav | 16px | 400 | sans |

Green: `#00c853` primary (today ring, links). Success checks `#4caf50`. Ink `#1a1a1a`. Secondary `#4a4a4a`.

## Write page (`/`)

Match the current 750 write overlay:

- **No “Menu”.** No Write / Stats / Badges row on this page.
- Top: wordmark left (20px / 700 serif), **gray ×** right (close / exit to Stats).
- Long date, **26px / 700**.
- Under the date: left `◀ Jul \| Aug`; right **avatar + “N day streak” + square ⋮**.
- Guests / no photo: empty 750-style (no avatar, no homemade “0 days completed”).
- Month squares: **21px**, 2px border, ~20% radius. Empty = light gray border on `#fbfbfb`. Done = **solid `#4caf50` + white check**. Today not done = green ring, not a filled check.
- Placeholder: `Write something here...`
- Footer: `Private, unfiltered, spontaneous, daily` plus 500’s `saved` / `N/500`. Layout matches 750’s 820px footer.
- Hitting 500: strike + confetti. **No AI analysis.** No mood, theme, Silly Robot, Streak Fairy.

The ⋮ is the app menu (Write, Stats, Badges, One month, Search, Settings, Sign in / Sign out).

## Type first

Land on the writing page and type. Sign in is optional (⋮ → Sign in). Guest data is local until Google.

Not a marketing site. No pricing. No AI pitch.

## Inner pages

Keep 16px sans nav with a green active underline until a later pass copies those 750 screens. Stats, badges, search, settings, person. Still no AI.

## Do not

- Restore Sniglet, numbered bowling boxes, or a teal Materialize bar on the write page
- Put “Menu” on the write page
- Set the wordmark to 400
- Add AI when the day is done
- Invent “0 days completed”
