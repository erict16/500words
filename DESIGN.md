# 500 Words design guide

Copied from live 750words.com CSS (`/_nuxt/entry`, `LoggedOutHomepage`, `LoggedOutHomepageV3`). Not screenshots. Not original.750words.com Sniglet.

Loops: read this file first. Do not put the app nav on the write page. Do not set the wordmark to 700.

## Type (from `_nuxt/entry.amQniMXz.css`)

```
--font-serif-primary: Source Serif 4, ui-serif, Iowan, Palatino, Georgia, Cambria, Times
--font-sans-metadata: ui-sans-serif, system-ui, …
--font-size-lg: 1.125rem   /* 18px editor */
```

750’s real face is a Cloud.typography kit (domain-locked). We cannot hotlink it. Root bug was `.font-georgia { font-family: Georgia }` winning over `ui-serif`. Default “Serif” now uses `--font-serif-primary` (Source Serif 4 + ui-serif). Do not put Georgia first.

On a Mac, `ui-serif` is New York. Body and wordmark are **400**. Headlines on the logged-out homepage are **600**. The write-page date is **700** at **1.5rem**. The editor is regular, not bold.

| Surface | Size | Weight |
| --- | --- | --- |
| Wordmark “500 Words” | 20px | 400 |
| Write date | 1.5rem (24px) | 700 |
| Editor | 1.125rem (18px) | 400, line-height 1.6 |
| Landing h1 | serif | 600 |
| Nav (inner pages only) | 16px sans | 400 |

Green: `#00c853` primary, `#4caf50` success checks. Ink `#1a1a1a`. Placeholder opacity ~0.3.

## Write page (logged in, `/`)

Match current 750 write overlay:

- **No app header.** No Write / Stats / Badges row.
- Wordmark top-left, weight 400. A quiet Menu on the right for the rest of the app.
- Long date, month `Jul \| Aug`, empty 18px rounded squares, green check at 500.
- Placeholder: `Write something here...`
- Footer: `Private, unfiltered, spontaneous, daily`
- Hitting 500: strike + confetti. **No AI analysis.** No mood, theme, Silly Robot, Streak Fairy.

## Type first (750’s strategy)

You land on the writing page and type. Sign in is optional (Menu → Sign in). No gate. Guest data is local until Google.

Landing is the write page plus one muted line: “Practice writing every day.” Not a marketing site. No pricing. No AI pitch.

## Landing (logged out, `/`)

Same URL as write. Wordmark 400, editor ready, Google behind Menu.

## Inner pages

Keep 16px sans nav with a green active underline. Stats, badges, search, settings, person. Still no AI.

## Do not

- Restore Sniglet, numbered bowling boxes, or a teal Materialize bar on the write page
- Bold the wordmark
- Add AI when the day is done
