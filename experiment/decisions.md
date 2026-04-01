# Decisions Log

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
