## Step 9 — Delete Confirmation Modal

**Goal**: Delete confirmation dialog before permanent delete; reuse Modal from Step 8.
**Surface**: web
**Completed**: 2026-04-02

### What Was Built

| File | Change |
|------|--------|
| `src/components/bookmark/DeleteConfirmModal.tsx` | Created |
| `src/app/page.tsx` | Updated |
| `src/app/archived/page.tsx` | Updated |

**DeleteConfirmModal.tsx**
- Wraps the generic `Modal` component
- Shows the bookmark title in the confirmation message
- Cancel button + "Delete permanently" button (danger-600, hover danger-800)
- Controlled by `bookmarkTitle: string | null` — null = closed

**page.tsx + archived/page.tsx**
- `deleteTarget: Bookmark | null` state (null = closed, Bookmark = pending)
- `requestDelete(id)` — finds bookmark by id, sets deleteTarget (replaces direct `remove` on `onDelete`)
- `confirmDelete()` — calls `remove`, clears deleteTarget
- `DeleteConfirmModal` rendered at bottom of page tree alongside add/edit modal

### Tests Added or Updated

None added this step. 17 existing tests still passing.

### Deviations from Spec

None.

### Issues Encountered

None.

### Handoff Notes

- Both pages now have two modals in the tree (add/edit + delete confirm); they cannot both be open simultaneously by design — opening one requires a user action that would not trigger the other.
