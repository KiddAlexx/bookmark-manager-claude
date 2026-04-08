# Decisions Log

---

## [2026-04-08] Decision: Skip GitHub OAuth — Google + Credentials only

**Context**: SPEC included GitHub OAuth as a third sign-in provider. User decided to skip it during Step 15 implementation.
**Options considered**: Implement GitHub OAuth alongside Google, skip entirely.
**Decision**: GitHub OAuth skipped; only Google OAuth and email/password Credentials are implemented.
**Rationale**: User preference — reduces OAuth app setup complexity with no functional impact on core requirements.
**Consequences**: GitHub provider can be added later by registering an OAuth app and adding `GitHub` to the `providers` array in `src/auth.ts`.

---

## [2026-04-08] Decision: Auth.js v5 database sessions over JWT

**Context**: Auth.js v5 supports both JWT (stateless) and database (stateful) session strategies.
**Options considered**: JWT sessions (no DB read per request), database sessions (session row persisted in `sessions` table).
**Decision**: `session: { strategy: "database" }`.
**Rationale**: DrizzleAdapter is optimized for database sessions. Supports server-side invalidation. Consistent with Phase 2 persistence approach.
**Consequences**: Every authenticated request reads the `sessions` table. Acceptable for a Neon/Postgres setup at this scale.

---

## [2026-04-07] Decision: Use @next/env to load .env.local for drizzle-kit

**Context**: `drizzle-kit` runs outside Next.js and only auto-loads `.env`, not `.env.local`. The DB credentials live in `.env.local` per Next.js convention.
**Options considered**: Copy vars to `.env`, use `dotenv-cli` prefix, use `@next/env` in `drizzle.config.ts`.
**Decision**: Import `loadEnvConfig` from `@next/env` at the top of `drizzle.config.ts`.
**Rationale**: `@next/env` is already a transitive dependency; it respects `.env.local` override precedence exactly as Next.js does. No extra package needed.
**Consequences**: `drizzle.config.ts` has a side-effect import. Acceptable for a config file.

---

## [2026-04-07] Decision: Dual timestamp strategy — Date in DB, string in app

**Context**: Drizzle schema uses `timestamp({ mode: "date" })` so inferred types are `Date`. The existing `Bookmark` interface (from Phase 1) uses ISO strings throughout.
**Options considered**: Change schema to `{ mode: "string" }` to keep strings end-to-end; keep `{ mode: "date" }` and serialize in the service layer.
**Decision**: Keep `{ mode: "date" }` in DB schema; service layer (Step 16) serializes `Date → string` when mapping `DbBookmark → Bookmark`.
**Rationale**: `Date` objects are more type-safe for DB operations and sorting. ISO string is the right format for JSON serialization and the client. The service layer is the correct boundary for this transform.
**Consequences**: `DbBookmark` (from drizzle-zod) and `Bookmark` (app type) coexist until Step 16 reconciles them.

---

## [2026-04-01] Decision: Retain Next.js 15.x (downgrade from 16.2.2)

**Context**: `create-next-app` scaffolded with Next.js 16.2.2. SPEC targets 15.x.
**Options considered**: Keep 16.2.2, downgrade to 15.x.
**Decision**: Downgrade to 15.x (installed 15.5.14).
**Rationale**: SPEC explicitly requires 15.x. CLAUDE.md states not to adopt the newest major release without a clear project-specific reason. No such reason exists.
**Consequences**: Any Next.js 16-specific APIs will need to be replaced with 15.x equivalents. The `node_modules/next/dist/docs/` directory no longer ships with the package in 15.x.

---

## [2026-04-01] Decision: Use next/font/local for Manrope

**Context**: SPEC says "next/font (Google Fonts)". User provided local Manrope variable font files at `assets/fonts/Manrope/`.
**Options considered**: `next/font/google` (fetches at build time from Google), `next/font/local` (uses supplied `.ttf`).
**Decision**: `next/font/local` with `Manrope-VariableFont_wght.ttf`.
**Rationale**: User explicitly requested local. Avoids external network request at build time. Equivalent output.
**Consequences**: Font updates require replacing the local file rather than bumping a config string.

---

## [2026-04-01] Decision: Migrate from root app/ to src/app/

**Context**: `create-next-app` placed the app router at the project root (`app/`). SPEC folder structure uses `src/app/`.
**Options considered**: Keep at root, move to `src/`.
**Decision**: Move to `src/app/`.
**Rationale**: SPEC is explicit about the `src/` layout. Keeps all application source code under a single `src/` root, separate from config files.
**Consequences**: `tsconfig.json` path alias updated from `"./*"` to `"./src/*"`. All future `@/…` imports resolve to `src/`.

---

## [2026-04-01] Decision: data.json field name alignment deferred to Step 2

**Context**: The provided `data/data.json` uses `pinned`, `visitCount`, `createdAt` while SPEC TypeScript interfaces define `isPinned`, `viewCount`, `dateAdded`.
**Options considered**: Rename fields in data.json now, rename in Step 2 when types are defined.
**Decision**: Defer alignment to Step 2.
**Rationale**: Types and service layer are Step 2 scope. Normalising data without the type definitions in place risks inconsistency.
**Consequences**: Step 2 must define canonical field names and update `src/data/data.json` accordingly.

---

## [2026-04-01] Decision: next-themes + semantic CSS tokens for dark mode

**Context**: Initial implementation used a Zustand themeStore to manage the `.dark` class on `<html>`, with components using paired `dark:` Tailwind variants. Two problems: (1) no SSR flash prevention — the class was applied client-side after hydration; (2) every component needed two colour classes per property.
**Options considered**:
- Keep Zustand themeStore + add blocking script for SSR flash prevention manually
- Replace with `next-themes` (handles SSR flash, system preference, persistence)
- Adopt semantic CSS tokens so components use one class instead of dark: pairs
**Decision**: Use `next-themes` for theme management + semantic tokens in `globals.css` for styling. `themeStore.ts` becomes a thin re-export of `useTheme` from next-themes.
**Rationale**: next-themes is purpose-built for this exact problem in Next.js. Semantic tokens eliminate all `dark:` variant duplication in components. Both changes together materially improve UX and maintainability.
**Consequences**: `suppressHydrationWarning` required on `<html>`. Components must use semantic classes (`bg-surface`, `text-ink`, etc.) — raw palette tokens with `dark:` pairs are prohibited. `themeStore.ts` is a re-export shim, not a Zustand store.

---

## [2026-04-01] Decision: Zod as single source of truth for types

**Context**: AGENTS.md states "Zod schemas are the source of truth for runtime validation — derive TypeScript types with `z.infer<typeof schema>`". The initial `src/types/index.ts` defined raw interfaces.
**Options considered**: Keep raw interfaces + duplicate in Zod, or make Zod primary and derive interfaces.
**Decision**: Zod schemas in `src/lib/schemas.ts` are primary; `src/types/index.ts` re-exports `z.infer<>` types only.
**Rationale**: Single definition point eliminates drift between runtime validation and compile-time types.
**Consequences**: Any new field must be added to the Zod schema first; the TypeScript type updates automatically.

---

## [2026-04-01] Decision: archive wins over pin conflict

**Context**: A bookmark can be both pinned and archived if toggled in sequence. SPEC does not explicitly state resolution.
**Options considered**: Block archive if pinned (require unpin first), silently clear pin on archive.
**Decision**: `archiveBookmark()` sets `isPinned: false` alongside `isArchived: true`.
**Rationale**: Simplest resolution; archived items never show in the main view so a pinned+archived state would be invisible anyway.
**Consequences**: Users do not need to unpin before archiving. Unarchiving does not restore pin state.

---

## [2026-04-01] Decision: Tailwind v4 custom dark mode variant

**Context**: SPEC requires class-based dark mode (`dark` class on `<html>`). Tailwind v4 defaults to `prefers-color-scheme`.
**Options considered**: Use default media-query dark, override with `@custom-variant dark`.
**Decision**: `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css`.
**Rationale**: Matches SPEC requirement for class-controlled dark mode toggle. `@custom-variant` is the v4 API for overriding built-in variants.
**Consequences**: Dark mode utilities only activate when `.dark` class is present on an ancestor — not from system preference alone. The theme store (Step 3) must read `prefers-color-scheme` on init and apply the class accordingly.
