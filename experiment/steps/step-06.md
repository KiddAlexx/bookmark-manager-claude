## Step 6 — Search, Tag Filter, Sort

**Goal**: Real-time search by title, multi-select tag filter (OR logic), sort by recently added / recently visited / most visited.
**Surface**: web
**Completed**: 2026-04-01

### What Was Built

| Sub-task | Files |
|----------|-------|
| 6a | `src/components/layout/Header.tsx` (updated), `src/app/page.tsx` (updated) |
| 6b | `src/components/bookmark/TagFilter.tsx` (created), `src/components/layout/Sidebar.tsx` (updated), `src/app/page.tsx` (updated) |
| 6c | `src/components/bookmark/SortControl.tsx` (created), `src/app/page.tsx` (updated) |

**6a — Search**
- `Header` gains `onSearch` + `searchQuery` props (both optional for backwards compatibility with archived page)
- `page.tsx`: `query` state passed to Header; `useMemo` filters by `b.title.toLowerCase().includes(lc)`

**6b — Tag Filter**
- `TagFilter.tsx`: list of tag buttons with `aria-pressed`, teal active state, "Reset filter" button (shown only when tags selected), returns null when no tags exist
- `Sidebar.tsx`: `tagFilter?: React.ReactNode` slot replaces the placeholder `<ul>`
- `page.tsx`: `selectedTags` state, `allTags` memo (deduped + sorted from active bookmarks), OR logic (`selectedTags.some(t => b.tags.includes(t))`), `TagFilter` passed to `<Sidebar>`

**6c — Sort Control**
- `SortControl.tsx`: dropdown button showing current mode label; listbox with three options (Recently Added, Recently Visited, Most Visited); checkmark on active option; outside-click closes
- `page.tsx`: `sortBy` state (default `recently-added`), sort applied inside `useMemo` after filter, before pinned/unpinned split; `recently-visited` nulls last; `SortControl` passed into `BookmarkList`'s `sortControl` slot

**Bugfix (mid-step)**
- `data.json` favicon paths corrected from `./assets/...` → `/assets/...`
- `assets/images/` copied to `public/assets/images/` so Next.js can serve them
- `BookmarkCard`: `isValidFaviconSrc()` guard — falls back to Globe icon for any path not starting with `/`, `http://`, or `https://`

### Tests Added or Updated

None added this step. 17 existing url.test.ts tests still passing.

### Deviations from Spec

None.

### Issues Encountered

- Favicon images were in project root `assets/` rather than `public/` — Next.js Image requires paths served from `public/`. Fixed by copying to `public/assets/` and correcting paths in `data.json`.
- localStorage cached the old `./assets/...` paths; `isValidFaviconSrc()` guard prevents the broken paths from reaching `<Image>` even if stale data persists.

### Handoff Notes

- `onEdit` in `page.tsx` and `archived/page.tsx` remains a no-op stub — Step 8 wires the modal.
- Tag filter only shows tags from non-archived bookmarks; archived page will have its own filter state.
- Sort applies to unpinned bookmarks only; pinned section order is insertion order.
