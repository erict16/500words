# Source: live 750 CSS/JS, not screenshots

Pulled 2026-08-23 with curl (web_fetch is SSRF-blocked on these hosts). After-login HTML 403s without a session. The stylesheets are public.

Use this file. Do not guess from screenshots.

## Hosts

- **Current product (clone this after-login chrome):** `https://750words.com`
  - Nuxt. Public CSS under `/_nuxt/` (`entry.amQniMXz.css` plus page chunks). Write page + inner pages.
- **Bowling Rails (do not put back on the write page):** `https://original.750words.com`
  - `/assets/stylesheets/base_packaged.css` — Sniglet, numbered boxes, mint person header. Keep as a token dump only.

## Tokens from `base_packaged.css`

```
#wrapper                         800px, font-size 16px
#header                          800px
#header #nav .logo               30px, sniglet/bree, weight normal
#header #nav .logo a             no underline, color #000
#header #nav #hover_nav .top_menu  float left, margin-right 15px
textarea                         20px / 1.6em, helvetica
textarea#entry_body              width 770px, border 0, padding 10px 0, resize none
#entry_body_counter              float right, 150px, #666, 14px
.wordcount_under                 #666
.wordcount_over                  color green, font-weight bold
#footer a.count                  color green
#bowling-score-tally             width 800px
table#months_progress tr td      11px bold, width 20px, center, padding 0
table.entry_stats tr td          width 20%, vertical-align top
table.entry_stats tr td div.header  12px, border-bottom 1px #333
table.entry_stats tr td strong   40px / 30px line, color #4DB559
table.entry_stats tr td span     11px #666
table#stats tr td                padding 5px, 12px
table#stats tr td strong         30px #666, weight 800
.persons-header                  bg #DCFFFD, padding 15px 15px 10px, radius 5px, shadow 0 1px 5px rgba(0,0,0,.5)
.persons-header .big             18px #000
.persons-header .big strong      #4392F1
.person_stats td.stat_key        18px
.person_stats td.score           30px #666 bold
.person_stats .positive          #4DB559
.person_stats .negative          #B30909
#challenge_nav a                 radius 10px, 1px #ccc, padding 10px, color #000
#challenge_nav span strong       color/border #45DED7, radius 10px, padding 10px
body.one-col h1                  35px #4DB559, sniglet
.notice                          georgia 11pt, bg #d4eef7
#search-box                      16px #666, no border, 245px
.subdued                         12px #666, no underline
#signin_form                     350px, sniglet
form#update_settings input       20px, height 37px, inset shadow
#footer                          800px, 4em, logo not underlined black
```

Typekit: `https://use.typekit.com/onu2kal.js` (sniglet + bree). Fallback: Helvetica, not Georgia, for the original chrome. Georgia is only on `.notice`.

## Tokens from current `750words.com/_nuxt` (inner pages, 2026-08-23)

Pulled `entry.amQniMXz.css` plus `prefs.lq1g1e79.css`, `index.DkhQW2uW.css` (badges), `index.BedupGjz.css` / `_query_.D7Zt-hjq.css` (search), `index.DbdOTmxB.css` (person), `browse.CJzZ1Qdk.css`. Logged-in HTML still 403s.

```
--font-serif-primary           ui-serif, Georgia, Cambria, Times
--font-sans-metadata           ui-sans-serif, system-ui, …
--font-size-3xl / h1           1.875rem, weight 700, line-height 1.25, color #1a1a1a
--font-size-2xl / h2           1.5rem
page-title                     serif, ink — not #4DB559
page-description               serif, #666, line-height 1.75
section-title                  serif 1.5rem
inner column                   max-width 50rem (search 44rem)
--brand-green / --color-primary  #00c853  (links, search bars, joined)
--color-text-secondary         #666
--color-text-muted             #888
--color-border-light/medium    #e0e0e0 / #ccc
--radius-base                  4px
fields / search                48px tall, 16px sans, 1px #ccc, hover #00c853
theme activator                48px, 1px #ccc
badge-title                    serif 18px, min-height 3em
badge-subtitle                 sans 0.875rem #666
badge grid                     v-col cols 6 / sm 4 / md 3 (2 / 3 / 4)
badge-card                     min-height 280px, 1px #e0e0e0, elevation 0
earned-checkmark               absolute top-right, green mdi-check-bold
badge images                   /images/badges/* (404 without a session; not in CSS)
search-btn                     48px, sans 0.9rem / 500, primary fill
search result date             sans 0.8rem / 600 / primary
search result title            serif 1.05rem / 500
search result snippet          sans 0.85rem / #666 / 1.6
theme-activator                48px, min-width 200px, 1px #ccc, radius 4px
font-menu-item                 min-height 80px, 16px title / 600, 14px sample
logo-link / site-mark          serif 20px / 700
participant-card               8px radius, 1px #e0e0e0, sans row
account-browse .month-entry    padding 16px 0, 1px #e0e0e0
month-title a/strong           sans 600, primary #00c853
month-stats                    sans 0.875rem #666
login primary button           48px, brand-green fill, white text
person page                    no #DCFFFD mint card; ink serif
person summary                 sans 1rem; “This month, {handle} has written…”
person kicker                  sans “DAY N OF MONTH”
CURRENT BADGES                 sans 1.125rem / 600 heading + wrapping tiles
account mini-calendar          7-col grid, 4–8px dots
day-dot empty                  #8080804d
day-dot has-writing            rgba(0,200,83,.6)
day-dot completed              #00c853 + 6px glow
v-alert / notice               sans, 1px #ccc, 4px radius — not Georgia #d4eef7
challenge pills                not #45DED7; primary green / #ccc
```

Do not copy AI chunks (`EntryMindset`, Silly Robot, donut “analysis”).

## What we still cannot download

- Logged-in HTML for `/entry`, `/stats`, `/badges` (Cloudflare 403 + auth)
- Tag Savage PNG/GIF badge art (not in the public CSS; images 404 at old `/images/icons/` paths)

Bowling `/` and `X` are not in this stylesheet as SVG. The month row is a 20px-wide table. Keep drawn `/` and `X`; size the cells toward 20–28px.

## Do not

- Restore Sniglet / numbered bowling boxes on the write page
- Copy marketing homepage copy
- Copy Nuxt AI analysis
- Check in their full CSS files (use tokens above)
