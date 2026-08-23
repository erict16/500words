# Source: live 750 CSS/JS, not screenshots

Pulled 2026-08-23 with curl (web_fetch is SSRF-blocked on these hosts). After-login HTML 403s without a session. The stylesheets are public.

Use this file. Do not guess from screenshots.

## Hosts

- **Bowling product (clone this):** `https://original.750words.com`
  - Rails. CSS: `/assets/stylesheets/base_packaged.css` (64,242 bytes)
  - Writing surface, bowling tally, stats tables, search box, sign-in form are in that file even when `/entry` is gated.
- **Current V2 (do not clone):** `https://750words.com`
  - Nuxt. CSS under `/_nuxt/`. This is the green-check / AI product. Ignore except to know what we are *not* copying.

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
table.entry_stats tr td strong   40px / 30px line, color #4DB559
table#stats tr td strong         30px #666
body.one-col h1                  35px #4DB559, sniglet
.notice                          georgia 11pt, bg #d4eef7
#search-box                      16px #666, no border, 245px
.subdued                         12px #666, no underline
#signin_form                     350px, sniglet
```

Typekit: `https://use.typekit.com/onu2kal.js` (sniglet + bree). Fallback: Helvetica, not Georgia, for the original chrome. Georgia is only on `.notice`.

## What we still cannot download

- Logged-in HTML for `/entry`, `/stats`, `/badges` (Cloudflare 403 + auth)
- Tag Savage PNG/GIF badge art (not in the public CSS; images 404 at old `/images/icons/` paths)

Bowling `/` and `X` are not in this stylesheet as SVG. The month row is a 20px-wide table. Keep drawn `/` and `X`; size the cells toward 20–28px.

## Do not

- Copy Nuxt V2 chrome (`#4caf50` Material, `--v-theme`, 820px footer)
- Copy marketing homepage copy
- Check in their full `base_packaged.css` (use tokens above)
