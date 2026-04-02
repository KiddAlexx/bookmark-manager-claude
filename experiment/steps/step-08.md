## Step 8 — Add/Edit Bookmark Modal

**Goal**: Add/Edit bookmark modal with React Hook Form + Zod validation, modal shell with focus trap, wired into both pages.
**Surface**: web
**Completed**: 2026-04-02

### What Was Built

| Sub-task | Files |
|----------|-------|
| 8a | `src/components/bookmark/AddEditBookmarkForm.tsx` (created) |
| 8b | `src/components/ui/Modal.tsx` (created) |
| 8c | `src/app/page.tsx` (updated), `src/app/archived/page.tsx` (updated) |

**AddEditBookmarkForm.tsx**
- React Hook Form + `@hookform/resolvers/zod` connected to `AddBookmarkSchema`
- Fields: Title (required), URL (required, validated), Description (textarea), Tags (Enter/Add button to add, × pill to remove), Favicon URL (optional)
- Inline `aria-invalid` + `role="alert"` validation errors per field
- Pre-fills all fields when `bookmark` prop passed (edit mode)
- Submit button: "Saving…" while pending, "Save changes" in edit mode, "Add bookmark" in add mode
- `react-hook-form` + `@hookform/resolvers` installed (were not in package.json)

**Modal.tsx**
- Full focus trap: Tab cycles forward through all focusable elements, Shift+Tab reverses; wraps at boundaries
- First focusable element receives focus on open
- ESC closes, backdrop click closes
- Body scroll lock while open
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby={titleId}`
- Generic — accepts any `children`, reusable for delete confirmation (Step 9)

**page.tsx + archived/page.tsx**
- `modalBookmark` state: `null` = closed, `undefined` = add mode, `Bookmark` = edit mode
- `openAdd()`, `openEdit(id)`, `closeModal()` handlers
- `onAddBookmark` and `onEdit` fully wired (were no-ops)
- `Modal` + `AddEditBookmarkForm` rendered at bottom of each page tree

### Dependencies Added

- `react-hook-form` — form state management
- `@hookform/resolvers` — Zod adapter for RHF

### Tests Added or Updated

None added this step. 17 existing tests still passing.

### Deviations from Spec

None.

### Issues Encountered

`react-hook-form` and `@hookform/resolvers` were not yet installed — installed during 8a.

### Handoff Notes

- The `Modal` component is generic and will be reused for the delete confirmation dialog in Step 9.
- Tags field uses local component state (`tagInput`) separate from RHF — this is intentional as the tag list itself is managed via `setValue`.
