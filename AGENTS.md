<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 500 Words — product rules (read these, not old Claude notes)

**DESIGN.md is the design source of truth.** It overrides leftover “quiet Menu”, “wordmark 400”, bowling/Sniglet write-page, “don’t make it look like 750”, “no landing”, and “keep N/500” notes.

Copy **current** 750words.com (https://750words.com) for look and interaction. Store name **500 Words**. Goal **500**. Do **not** copy post-write AI / mood / robot analysis.

Live CSS and computed type: `docs/750-live/`. Prefer that over `docs/750-source.md` and over `src/styles/app.css`. Styling is Tailwind plus those live tokens.

Sentinel SSm and Gotham Narrow are paid. Do not pirate them. Defaults: **Zilla Slab** (serif) and **Barlow Semi Condensed** (sans). Also loaded (OFL / Google Fonts): Merriweather, Bitter, Montserrat, Figtree, Source Sans 3, Roboto Mono.

Guests see 750’s logged-out chrome at `/` (serif wordmark, outlined Log In + Sign Up). No Menu. No doodle. No Let’s write. Write page (`/write`) is 750-identical: no Menu, no ⋮; fixed 64px bar; serif wordmark 22px/700 (Zilla optical bump); gray ×; 28px date (30px in focus); month nav; avatar + streak + wider `.focus-toggle-btn` (outlined ~52×24, mdi-fullscreen, F11); 21px day cells; F11 focus mode with `.exit-focus-btn`; **three paper icons** filling toward 500 (not N/500). Inner pages later.

Do not merge `750-parity` into main unless asked. Do not revive `feat/overnight-750-lock`.
