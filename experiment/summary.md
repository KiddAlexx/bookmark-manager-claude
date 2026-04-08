# Project Summary — Bookmark Manager

## Current Status

**Phase**: 2 — Backend + Auth + Persistence
**Active Step**: Step 15 complete — awaiting approval to proceed to Step 16 (service layer migration to Drizzle/Neon)

---

## Completed Steps

| Step | Title | Date | Status |
|------|-------|------|--------|
| 1 | Project Scaffold | 2026-04-01 | ✅ Complete |
| 2 | Types, Schemas, URL Utils, Service Layer | 2026-04-01 | ✅ Complete |
| 3 | Zustand Stores | 2026-04-01 | ✅ Complete |
| 4 | Layout Shell | 2026-04-01 | ✅ Complete |
| 5 | Bookmark Card + List Components | 2026-04-01 | ✅ Complete |
| 6 | Search, Tag Filter, Sort | 2026-04-01 | ✅ Complete |
| 7 | Archive View | 2026-04-02 | ✅ Complete |
| 8 | Add/Edit Bookmark Modal | 2026-04-02 | ✅ Complete |
| 9 | Delete Confirmation Modal | 2026-04-02 | ✅ Complete |
| 10 | Theme Toggle | 2026-04-02 | ✅ Complete |
| 11 | Polish Pass | 2026-04-02 | ✅ Complete |
| 12 | Vitest Unit Tests | 2026-04-02 | ✅ Complete |
| 13 | Toast Notifications | 2026-04-02 | ✅ Complete |
| 14 | Neon + Drizzle Schema + Migrations | 2026-04-07 | ✅ Complete |
| 15 | Auth.js v5: Sign-in, Sign-up, Session, Route Guards | 2026-04-08 | ✅ Complete |

---

## Next Planned Step

**Step 16** — Migrate service layer from localStorage to Drizzle/Neon; all bookmark CRUD goes through the database.

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
