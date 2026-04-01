# Project Summary — Bookmark Manager

## Current Status

**Phase**: 1 — Full UI with Local Data
**Active Step**: Step 5 complete — awaiting approval to proceed to Step 6

---

## Completed Steps

| Step | Title | Date | Status |
|------|-------|------|--------|
| 1 | Project Scaffold | 2026-04-01 | ✅ Complete |
| 2 | Types, Schemas, URL Utils, Service Layer | 2026-04-01 | ✅ Complete |
| 3 | Zustand Stores | 2026-04-01 | ✅ Complete |
| 4 | Layout Shell | 2026-04-01 | ✅ Complete |
| 5 | Bookmark Card + List Components | 2026-04-01 | ✅ Complete |

---

## Next Planned Step

**Step 6** — Search, tag filter, sort logic + wiring.

Sub-tasks:
- 6a: Search logic — filter bookmarks by title in `page.tsx`, wire search input in `Header`
- 6b: Tag filter — `TagFilter` component in `Sidebar`, OR logic, multi-select, reset
- 6c: Sort control — `SortControl` component, pass into `BookmarkList` sortControl slot, sort logic via `useMemo`

---

## Blockers / Open Questions

- None currently.

---

## Notable Assumption Changes

- Font strategy changed from `next/font/google` → `next/font/local` per user instruction (local Manrope .ttf provided).
- Next.js version is 15.5.14 (SPEC says 15.x ✓).
- `src/types/index.ts` derives types from Zod schemas (Zod is the source of truth), not raw interfaces.

---

## Future Enhancements (out of scope)

- Import / export bookmarks (CSV, HTML)
- Bookmark collections / folders
- Bookmark sharing via public link
- AI-powered tagging suggestions
