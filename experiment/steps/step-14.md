## Step 14 — Neon + Drizzle Schema + Migrations

**Goal**: Set up the Neon Postgres database, define the Drizzle schema for all tables, run the initial migration, and generate drizzle-zod schemas.
**Surface**: backend / shared
**Completed**: 2026-04-07

### What Was Built

| File | Change |
|------|--------|
| `.env.local` | Added `DATABASE_URL` (pooled) + `DATABASE_URL_UNPOOLED` (direct, for drizzle-kit) |
| `.env.example` | Template without secrets — committed to version control |
| `drizzle.config.ts` | Drizzle Kit config — `@next/env` loads `.env.local`, unpooled URL for migrations |
| `src/db/schema.ts` | 5 tables: `users`, `accounts`, `sessions`, `verificationTokens` (Auth.js v5), `bookmarks` |
| `src/db/index.ts` | Neon HTTP client + Drizzle instance with full schema |
| `src/db/zod.ts` | drizzle-zod derived schemas: `insertBookmarkSchema`, `selectBookmarkSchema`, `updateBookmarkSchema`, `selectUserSchema`, DB inferred types |
| `drizzle/0000_brown_wonder_man.sql` | Initial migration — generated and applied to Neon |
| `package.json` | Added `db:generate`, `db:migrate`, `db:push`, `db:studio` scripts |
| `experiment/decisions.md` | Two decisions logged (env loading strategy, Date vs string timestamps) |

### Sub-tasks

- **14a** — Schema + client + migration. Installed `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`. Created `src/db/schema.ts` with all 5 tables. `bookmarks` table has `unique_user_url` composite index on `(userId, normalizedUrl)` — enforces duplicate detection at the DB level. Auth.js tables use compound primary keys on `(provider, providerAccountId)` and `(identifier, token)`. Migration applied to Neon successfully.
- **14b** — drizzle-zod. Installed `drizzle-zod`. Created `src/db/zod.ts` with `insertBookmarkSchema` (URL + title validated, server-generated fields omitted), `updateBookmarkSchema`, `selectBookmarkSchema`, and user equivalents. `DbBookmark` / `DbUser` types inferred from Drizzle schema. Coexist with hand-written schemas until Step 16.

### Schema design decisions

- Auth.js tables defined manually to be explicit and auditable — not pulled from a black-box helper
- `bookmarks.tags` uses `text("tags").array()` — Postgres native array, no join table needed at this scale
- `users.image` kept for Auth.js OAuth avatar; `users.avatarUrl` is our Cloudinary field (Step 18b)
- `{ mode: "date" }` on all timestamps — serialized to ISO strings in the service layer (Step 16)

### Tests Added or Updated

None. 60 existing tests still passing.

### Deviations from Spec

None.

### Issues Encountered

- `drizzle-kit migrate` failed initially because it couldn't read `DATABASE_URL_UNPOOLED` from `.env.local`. Fixed by adding `loadEnvConfig(process.cwd())` from `@next/env` to `drizzle.config.ts`.

### Handoff Notes

- `src/db/index.ts` exports `db` — server-only, never import in `"use client"` files
- `src/db/zod.ts` schemas will replace `src/lib/schemas.ts` in Step 16
- `DbBookmark` types have `Date` objects; app `Bookmark` type has strings — service layer (Step 16) bridges the gap
- Migration files live in `/drizzle/` — commit these, never edit after applied
