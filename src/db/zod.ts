/**
 * Drizzle-Zod derived schemas — source of truth for Phase 2 DB types.
 *
 * These replace the hand-written schemas in src/lib/schemas.ts when the
 * service layer migrates to Drizzle in Step 16.
 *
 * Note on timestamps: DB schema uses { mode: "date" } so inferred types are
 * Date objects. The service layer (Step 16) will serialize to ISO strings for
 * the app's Bookmark type. Until then, these are used server-side only.
 */
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { bookmarks, users } from "./schema"

// ─── Bookmark schemas ──────────────────────────────────────────────────────────

export const selectBookmarkSchema = createSelectSchema(bookmarks)

export const insertBookmarkSchema = createInsertSchema(bookmarks, {
  url: (s) => s.url("Must be a valid URL"),
  title: (s) => s.min(1, "Title is required"),
  tags: () => z.array(z.string()).default([]),
}).omit({
  id: true,
  viewCount: true,
  lastVisited: true,
  dateAdded: true,
  isPinned: true,
  isArchived: true,
  normalizedUrl: true,
})

export const updateBookmarkSchema = insertBookmarkSchema.omit({ userId: true })

// Inferred DB types (Date-based timestamps — serialized to strings in service layer)
export type DbBookmark = typeof bookmarks.$inferSelect
export type NewDbBookmark = typeof bookmarks.$inferInsert

// ─── User schemas ──────────────────────────────────────────────────────────────

export const selectUserSchema = createSelectSchema(users)

export const insertUserSchema = createInsertSchema(users, {
  email: (s) => s.email("Must be a valid email"),
  name: (s) => s.min(1, "Name is required"),
}).omit({ id: true, createdAt: true })

export type DbUser = typeof users.$inferSelect
export type NewDbUser = typeof users.$inferInsert
