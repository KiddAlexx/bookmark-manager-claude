## Step 5 — Bookmark Card + List Components

**Goal**: Bookmark card and list components, section titles, empty state, sort control shell.
**Surface**: web
**Completed**: 2026-04-01

### What Was Built

| Sub-task | Files |
|----------|-------|
| 5a | `src/components/bookmark/BookmarkCard.tsx` (created) |
| 5b | `src/components/bookmark/BookmarkList.tsx` (created), `src/components/bookmark/PinnedSection.tsx` (created) |
| 5c | `src/components/bookmark/EmptyState.tsx` (created), `src/app/page.tsx` (updated) |

**BookmarkCard.tsx**
- Renders: favicon (Next.js Image) with Globe fallback, title, normalizedUrl, description (line-clamp-3), tag pills, stats bar (viewCount, dateAdded, lastVisited)
- 3-dot action menu: adapts items based on `isPinned` and `isArchived` state
- Copy URL with 2s "Copied!" feedback via navigator.clipboard
- Visit: opens in new tab (`_blank, noopener,noreferrer`) + calls `onVisit`
- MenuItem sub-component at bottom of file (keeps card under 150 lines)

**BookmarkList.tsx**
- Accepts `sortControl?: React.ReactNode` slot for Step 6
- Renders disabled "Sort by" button as placeholder when slot is empty

**PinnedSection.tsx**
- Returns null when `bookmarks.length === 0`
- Pin icon + "PINNED" uppercase heading
- `onUnarchive` passed as no-op (pinned cards cannot be archived)

**EmptyState.tsx**
- Bookmark icon + configurable message string

**page.tsx**
- Reads from `useBookmarkStore`
- `useMemo` splits active (non-archived) bookmarks into `pinned` / `unpinned`
- Renders `PinnedSection` + `BookmarkList` or `EmptyState` when both are empty
- `onEdit` stubbed as `() => {}` — wired in Step 8

### Tests Added or Updated

None added this step — component tests for BookmarkCard are planned for Step 11 (Polish/Testing).
17 existing url.test.ts tests still passing.

### Deviations from Spec

None.

### Issues Encountered

None.

### Handoff Notes

- `onEdit` in `page.tsx` (and `archived/page.tsx`) is a no-op stub — Step 8 adds the modal and wires it in.
- `sortControl` prop in `BookmarkList` is an empty slot — Step 6 passes the real `SortControl` component.
- The archived page still renders a placeholder — Step 7 wires it up.
