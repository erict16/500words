<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 500 Words — product rules (read these, not old Claude notes)

**DESIGN.md is the design source of truth.** It overrides leftover “quiet Menu”, “wordmark 400”, bowling/Sniglet write-page, and “don’t make it look like 750” notes.

Copy **current** 750words.com (https://750words.com) for look and interaction. Store name **500 Words**. Goal **500**. Do **not** copy post-write AI / mood / robot analysis.

Live CSS and computed type: `docs/750-live/`. Prefer that over `docs/750-source.md` and over `src/styles/app.css`. Write-page styling is Tailwind plus those live tokens.

Sentinel SSm and Gotham Narrow are paid. Use **Bitter** and **Source Sans 3**.

Write page: no Menu; serif wordmark 20px/700; gray ×; 26px date; month nav; avatar + streak + ⋮; solid green checks. Inner pages later.

Do not merge `750-parity` into main unless asked. Do not revive `feat/overnight-750-lock`.
