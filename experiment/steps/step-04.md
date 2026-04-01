## Step 4 — Layout Shell

**Goal**: Build the responsive layout structure — sidebar, header, mobile drawer, and page assembly.
**Surface**: web
**Completed**: 2026-04-01

---

### What Was Built

| Sub-task | Files |
|----------|-------|
| 4a — Sidebar | `src/components/layout/Sidebar.tsx` (created) |
| 4b — Header | `src/components/layout/Header.tsx` (created) |
| 4c — Layout wiring | `src/components/layout/MobileSidebarDrawer.tsx` (created), `src/app/page.tsx` (updated), `src/app/archived/page.tsx` (created) |

**Mid-step change (applied before 4c):**
- Installed `next-themes`; replaced Zustand themeStore with thin re-export
- Added `src/components/Providers.tsx` (ThemeProvider wrapper)
- Updated `src/app/layout.tsx` (Providers + suppressHydrationWarning)
- Updated `src/components/AppInit.tsx` (removed initTheme call)
- Added semantic CSS tokens to `globals.css` with `.dark {}` overrides
- Migrated Sidebar + Header to semantic token classes + ring focus styles
- Updated AGENTS.md, SPEC.md, decisions.md

---

### Tests Added or Updated

None — layout components are covered by E2E tests added in later steps.

---

### Deviations from Spec

- `themeStore.ts` is a re-export shim, not a Zustand store. Documented in decisions.md.
- `archived/page.tsx` added as a stub (not in spec for Step 4) to prevent 404 from sidebar nav link. Full wiring in Step 7.
- Both page routes share duplicated layout structure for now. If a third route is added, extract to a shared layout component.

---

### Issues Encountered

- IDE flagged `focus-visible:outline` + `focus-visible:outline-2` as a CSS conflict in Tailwind v4. Switched all focus rings to `ring` utilities (`focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none`).

---

### Handoff Notes

- `Header` receives `onAddBookmark` and `onMenuOpen` as props — both are no-ops until Step 5 (modal) wires the form.
- `MobileSidebarDrawer` handles ESC + body scroll lock + focus-on-open. Full focus trap (Tab cycling) is deferred — add if accessibility audit flags it.
- Semantic token reference: `bg-canvas` (page bg), `bg-surface` (sidebar/header/cards), `bg-surface-alt` (inputs/hover/active), `text-ink` / `text-ink-sub` / `text-ink-muted`, `border-line`.
