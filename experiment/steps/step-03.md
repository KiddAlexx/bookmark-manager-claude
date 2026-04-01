## Step 3 — Zustand Stores

**Goal**: Set up global client state — theme store and bookmark store — both initialised on app mount.
**Surface**: shared
**Completed**: 2026-04-01

---

### What Was Built

| Sub-task | Files |
|----------|-------|
| 3a — themeStore + AppInit | `src/store/themeStore.ts` (created), `src/components/AppInit.tsx` (created), `src/app/layout.tsx` (updated) |
| 3b — bookmarkStore | `src/store/bookmarkStore.ts` (created), `src/components/AppInit.tsx` (updated) |

Removed: `src/store/.gitkeep`

---

### Tests Added or Updated

None added this step — stores depend on `window`/`localStorage` and are covered indirectly by component tests in later steps.

---

### Deviations from Spec

- None.

---

### Issues Encountered

- Bash stream closed mid-step during 3b verification; reran tsc and vitest in the following session — both clean.

---

### Handoff Notes

- `AppInit` is the single mount point for all store initialisation. Future stores should add their `init` call here.
- `themeStore.initTheme` reads `localStorage` first, then falls back to `prefers-color-scheme`. The `.dark` class is applied synchronously on mount — no flash of wrong theme expected in practice (client-side only).
- `bookmarkStore` is a thin wrapper over the service layer; all persistence logic lives in `src/lib/services/bookmarks.ts`.
