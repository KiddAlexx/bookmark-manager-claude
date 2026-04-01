## Step 1 — Project Scaffold

**Goal**: Next.js 15, TypeScript, Tailwind v4, Lucide, next/font, Vitest + RTL config, folder structure, design tokens from Figma.
**Surface**: shared
**Completed**: 2026-04-01

---

### What Was Built

**Files created:**
- `src/app/globals.css` — Tailwind v4 CSS-first config with all Figma design tokens (colors, radii, spacing vars, dark mode variant)
- `src/app/layout.tsx` — Root layout with Manrope local font via `next/font/local`
- `src/app/page.tsx` — Minimal scaffold placeholder
- `src/app/favicon.ico` — Copied from old `app/`
- `src/test/setup.ts` — `@testing-library/jest-dom` import
- `src/data/data.json` — Copied from `data/data.json`
- `vitest.config.ts` — Vitest + jsdom + `@vitejs/plugin-react` + `@/*` alias
- `experiment/decisions.md`, `prompts.md`, `metrics.csv`, `summary.md`, `steps/step-01.md`
- `.gitkeep` files for all empty `src/` subdirectories

**Files modified:**
- `package.json` — Next.js downgraded to 15.x; added `lucide-react`; added `vitest`, `@vitejs/plugin-react`, `@testing-library/*`, `jsdom` devDeps; added `test`, `test:run`, `typecheck` scripts
- `tsconfig.json` — Path alias changed from `"@/*": ["./*"]` to `"@/*": ["./src/*"]`

**Directories created (stubs):**
```
src/
  app/
  components/bookmark/ forms/ layout/ ui/
  store/
  lib/services/ lib/utils/ lib/db/
  hooks/
  types/
  data/
  test/
experiment/
  steps/
```

**Removed:**
- `app/` (root-level) — migrated to `src/app/`

---

### Tests Added or Updated

None — test infrastructure created but no tests yet (Step 2 adds first unit tests).

---

### Deviations from Spec

| Item | Spec | Actual | Reason |
|------|------|--------|--------|
| Font method | `next/font/google` | `next/font/local` | User provided local Manrope .ttf files |
| Next.js version | 15.x | 15.5.14 | Latest in 15.x line — compliant |

---

### Issues Encountered

1. **Next.js 16 pre-installed** — `create-next-app` had used 16.2.2. Downgraded to 15.5.14.
2. **No docs in node_modules/next/dist/docs/** — AGENTS.md references this path, but it doesn't exist in Next.js 15. Not blocking.

---

### Handoff Notes

- Step 2 must define TypeScript interfaces in `src/types/index.ts` and align `src/data/data.json` field names with the spec (`isPinned`, `viewCount`, `dateAdded`).
- The dark mode variant uses `@custom-variant dark (&:where(.dark, .dark *))` — the theme store (Step 3) must initialise by reading `prefers-color-scheme` and applying/removing the `.dark` class on `<html>`.
- `src/lib/db/` stub is Phase 2 only — do not populate until Step 13.
