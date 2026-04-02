## Step 7 — Archive View

**Goal**: Wire `src/app/archived/page.tsx` with search, tag filter, sort, and unarchive/delete actions.
**Surface**: web
**Completed**: 2026-04-02

### What Was Built

| File | Change |
|------|--------|
| `src/app/archived/page.tsx` | Full rewrite from stub |

**archived/page.tsx**
- Reads archived bookmarks from `useBookmarkStore` (`b.isArchived === true`)
- Own `query`, `selectedTags`, `sortBy` state — independent from the home page
- `allTags` memo derived from archived bookmarks only
- Filter + sort logic mirrors `page.tsx`; no pinned section (archived items cannot be pinned)
- Renders `BookmarkList` with title "Archived bookmarks" or `EmptyState` with "No archived bookmarks."
- `onPin` and `onArchive` passed as no-ops (not applicable in archive view)
- `onUnarchive` and `onDelete` (permanent delete) fully wired
- `TagFilter` passed into `<Sidebar tagFilter={...}>` slot
- `SortControl` passed into `<BookmarkList sortControl={...}>` slot
- Search, tag filter, and sort all work independently on the archived list

### Tests Added or Updated

None added this step. 17 existing tests still passing.

### Deviations from Spec

None.

### Issues Encountered

None.

### Handoff Notes

- `onEdit` remains a no-op stub — wired in Step 8 when the modal is added.
- The `Add Bookmark` button in `Header` is also a no-op on the archived page — it will only be functional on the home page after Step 8.
