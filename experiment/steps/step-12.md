## Step 12 — Vitest Unit Tests

**Goal**: Unit test coverage for filter/sort logic and service layer state transitions.
**Surface**: web / shared
**Completed**: 2026-04-02

### What Was Built

| File | Change |
|------|--------|
| `src/lib/utils/filter.ts` | Created — pure `filterAndSortBookmarks(bookmarks, options)` extracted from page useMemo |
| `src/lib/utils/filter.test.ts` | Created — 18 tests for title search, OR tag logic, all 3 sort modes, nulls-last, composition |
| `src/lib/services/bookmarks.test.ts` | Created — 25 tests for findDuplicate, archiveBookmark, unarchiveBookmark, togglePin, recordVisit |
| `src/components/bookmark/SortControl.tsx` | `SortMode` now re-exported from `filter.ts`; canonical `min-w-45` class |
| `src/app/page.tsx` | useMemo calls `filterAndSortBookmarks`; SortMode imported from `filter.ts` |
| `src/app/archived/page.tsx` | Same as above |

### Sub-tasks

- **12a** — Extracted filter/sort to `src/lib/utils/filter.ts`. `FilterOptions.selectedTags` typed as `readonly string[]` (function never mutates). 18 tests cover: empty query returns all; case-insensitive title match; OR tag logic; all 3 sort modes; recently-visited nulls-last; composition of search + tag + sort; empty input.
- **12b** — 25 service layer tests using jsdom `localStorage`. `beforeEach` clears storage; `seed()` helper writes fixture bookmarks. Key transitions tested: archiveBookmark clears isPinned; togglePin is a true toggle; unarchiveBookmark does not touch isPinned; recordVisit increments and persists viewCount; findDuplicate respects excludeId and normalizes across protocol/www/case variants.

### Tests Added or Updated

| File | Tests |
|------|-------|
| `src/lib/utils/filter.test.ts` | 18 new |
| `src/lib/services/bookmarks.test.ts` | 25 new |
| **Total** | **60 passing** (was 35 after 12a, 17 before step 12) |

### Deviations from Spec

None. All required coverage areas from SPEC.md testing table are now met for Phase 1:
- URL normalization ✅ (Step 2, url.test.ts)
- Duplicate detection ✅ (bookmarks.test.ts)
- Search / filter / sort logic ✅ (filter.test.ts)
- Archive / pin state transitions ✅ (bookmarks.test.ts)

### Issues Encountered

- `BASE_OPTIONS` declared `as const` in filter.test.ts caused `readonly []` vs `string[]` mismatch. Fixed by widening `FilterOptions.selectedTags` to `readonly string[]` — the function never mutates the array so this is correct.

### Handoff Notes

- `filterAndSortBookmarks` does not filter by `isArchived` — caller must pre-filter. This keeps the function single-purpose and makes both home and archive pages' useMemos explicit.
- Service tests use raw `localStorage` manipulation via a `seed()` helper — no mocks needed since jsdom provides a real localStorage implementation.
- Phase 1 unit test requirements from SPEC.md are complete. Phase 2 will add: metadata extraction helpers, component tests (RTL), Playwright E2E.
