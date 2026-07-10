# CLAUDE.md

We're building the app described in @SPEC.md. Read that file for general architectural tasks or to double-check the exact database structure, tech stack or application architecture.

Keep your replies exremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information. Use the DocsExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use `bun` as the package manager and runtime — not npm, yarn, or pnpm.

```bash
bun dev        # start dev server
bun build      # production build
bun start      # start production server
bun lint       # run ESLint
```

No test suite is configured. Bun's built-in test runner (`bun test`) can be used if tests are added.

To set up the database (auth tables managed by better-auth, not manually):

```bash
npx auth@latest migrate
```

## Architecture

This is a **Next.js App Router** note-taking app using the `@/` path alias (maps to project root, not a `src/` subdirectory).

### Key stack decisions

- **Bun SQLite** (`bun:sqlite`) with raw SQL — no ORM. The app's `notes` table must be created manually; auth tables are created by `npx auth@latest migrate`.
- **better-auth** for cookie-based session management with email/password only. All note API routes require authenticated sessions server-side.
- **TipTap** rich text editor — note `content` is stored as serialized TipTap JSON in SQLite.
- **Tailwind v4** — CSS-first, no `tailwind.config.js`. Customizations go in `globals.css` using `@theme`.
- **Zod** for request validation in API route handlers.

### Planned structure (per SPEC.md)

The app is not yet implemented. `SPEC.md` is the authoritative specification. The planned shape:

```
app/
  (auth)/sign-in/      # public
  (auth)/sign-up/      # public
  notes/               # auth-required layout
    page.tsx           # list all notes
    new/page.tsx       # create note
    [id]/page.tsx      # view/edit note
    public/[shareId]/  # read-only public view (no auth)
  api/
    notes/
      route.ts              # GET (list), POST (create)
      [id]/route.ts         # GET, PUT, DELETE
      [id]/share/route.ts   # POST (enable), DELETE (disable)
      public/[shareId]/route.ts  # GET (unauthenticated)
lib/
  db.ts                # Bun SQLite client + query helpers
  auth.ts              # better-auth server config
  auth-client.ts       # better-auth client config
```

### Notes table schema

```sql
CREATE TABLE notes (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,   -- TipTap JSON serialized as string
  is_public   INTEGER NOT NULL DEFAULT 0,
  share_id    TEXT UNIQUE,     -- null when not shared
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);
```

### Security invariants

- API routes must verify ownership server-side before any read/write/delete on a note.
- Public note endpoints (`/api/notes/public/[shareId]`) expose only title and content — no user data.
- `share_id` must be a cryptographically random token (UUID v4 or equivalent).
