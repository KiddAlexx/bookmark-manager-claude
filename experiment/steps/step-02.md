## Step 2 — TypeScript Types, Schemas, URL Utils, Service Layer

**Goal**: Define the data layer foundation: types, Zod schemas, URL normalization, localStorage service, and data seeding.
**Surface**: shared
**Completed**: 2026-04-01

---

### What Was Built

| Sub-task | Files |
|----------|-------|
| 2a — Types + data alignment | `src/types/index.ts` (updated), `src/data/data.json` (field names aligned) |
| 2b — Zod schemas | `src/lib/schemas.ts` (created), `src/types/index.ts` (now derives from Zod) |
| 2c — URL normalization | `src/lib/utils/url.ts` (created), `src/lib/utils/url.test.ts` (created) |
| 2d — Service layer | `src/lib/services/bookmarks.ts` (created), `src/lib/services/user.ts` (created) |

Removed: `src/lib/.gitkeep`, `src/lib/services/.gitkeep`, `src/lib/utils/.gitkeep`, `src/lib/db/.gitkeep`

---

### Tests Added or Updated

- `src/lib/utils/url.test.ts` — 17 unit tests for `normalizeUrl` and `isSameUrl`
  - Protocol stripping (http/https)
  - www. stripping
  - Trailing slash stripping
  - Lowercasing
  - Path preservation
  - Whitespace trimming
  - Combined edge cases

---

### Deviations from Spec

- `src/types/index.ts` now re-exports types inferred from Zod schemas (`z.infer<>`) rather than defining interfaces independently. This satisfies the AGENTS.md rule: "Zod schemas are the source of truth for runtime validation."
- `AddBookmarkSchema` and `EditBookmarkSchema` added in addition to `BookmarkSchema` and `UserSchema` — needed for form validation in Step 5.

---

### Issues Encountered

- None. `tsc --noEmit` clean after each sub-task.

---

### Handoff Notes

- `seedIfEmpty()` in the bookmark service must be called once on app init (Step 3 — store setup).
- `src/lib/db/` directory still exists but is empty (`.gitkeep` removed). Phase 2 (Drizzle schema) will populate it.
- `user.ts` is a Phase 1 stub; `getCurrentUserId()` returns `""`. All bookmarks have `userId: ""` in Phase 1.
- `archiveBookmark` clears `isPinned` — a pinned + archived conflict resolves to archived (archive wins). Consistent with the spec filter rule: archived bookmarks never appear in the main view.
