## Step 11 — Polish Pass

**Goal**: Responsive layout check, hover/focus states audit, reduced-motion, mobile sidebar tag filter, aria-live regions.
**Surface**: web
**Completed**: 2026-04-02

### What Was Built

| File | Change |
|------|--------|
| `src/components/layout/MobileSidebarDrawer.tsx` | Added `tagFilter?: React.ReactNode` prop; passes it to `<Sidebar>` |
| `src/app/page.tsx` | Passes `tagFilter` to `<MobileSidebarDrawer>`; added `aria-live` result count |
| `src/app/archived/page.tsx` | Same as above |
| `src/app/globals.css` | Added `@media (prefers-reduced-motion: reduce)` — collapses all transitions/animations to 0.01ms |
| `src/components/bookmark/BookmarkCard.tsx` | `MenuItem` focus: added `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-700` |
| `src/components/bookmark/SortControl.tsx` | Option buttons: same focus ring fix |

### Sub-tasks

- **11a** — Mobile sidebar tag filter: `MobileSidebarDrawer` now accepts and forwards `tagFilter` prop to `Sidebar`. Both home and archived pages pass their `tagFilter` JSX. Mobile users can now filter by tag from the drawer.
- **11b** — Focus rings + reduced-motion: Full-width menu buttons (BookmarkCard menu items, SortControl options) now show `ring-inset` focus rings instead of background-change-only. Global CSS rule honors `prefers-reduced-motion: reduce`.
- **11c** — `aria-live` result count: Each `<main>` now contains a `sr-only aria-live="polite"` paragraph that announces the bookmark count after every search or filter change.

### Tests Added or Updated

None added this step. 17 existing tests still passing.

### Deviations from Spec

None.

### Issues Encountered

- IDE lint hint on `MobileSidebarDrawer` after first edit (stale diagnostic — resolved by final edit passing `tagFilter` to `<Sidebar>`).
- Used `ring-inset` for dropdown menu items so the focus ring renders inside the button boundary and does not clip against the panel edges.

### Handoff Notes

- `prefers-reduced-motion` is handled globally in `globals.css` — no per-component changes needed for future components.
- `aria-live` regions use `aria-atomic="true"` so the full sentence is re-read on each update, not just the diff.
- Mobile tag filter now fully mirrors desktop — same `TagFilter` JSX instance passed as a slot.
