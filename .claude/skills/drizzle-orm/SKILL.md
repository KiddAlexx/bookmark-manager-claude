---
name: drizzle-orm
description: Define schemas, write queries, and manage migrations with Drizzle ORM. Use when working with the database layer, schema definitions, or writing queries.
---

# Drizzle ORM

Drizzle is a TypeScript-first ORM with no runtime binary and no code generation step.
Schema is defined in TypeScript and serves as the single source of truth for both
database structure and TypeScript types.

## Core Philosophy

- Schema-as-code — define once, types flow automatically
- Drizzle queries are SQL-like by design — if you know SQL, you know Drizzle
- No magic, no hidden queries — what you write is what executes
- Pair with `drizzle-zod` to auto-generate Zod schemas from the DB schema

## Project Setup

```ts
// src/lib/db/index.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

Never import `db` in client components. It is server-only.
Only used inside API route handlers, server actions, and the service layer.

## Schema Definition

```ts
// src/lib/db/schema.ts
import { pgTable, text, integer, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const bookmarks = pgTable('bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  url: text('url').notNull(),
  normalizedUrl: text('normalized_url').notNull(),
  tags: text('tags').array().notNull().default([]),
  favicon: text('favicon'),
  viewCount: integer('view_count').notNull().default(0),
  lastVisited: timestamp('last_visited'),
  dateAdded: timestamp('date_added').defaultNow().notNull(),
  isPinned: boolean('is_pinned').notNull().default(false),
  isArchived: boolean('is_archived').notNull().default(false),
}, (table) => ({
  // Duplicate prevention — one normalized URL per user
  uniqueUserUrl: uniqueIndex('unique_user_url').on(table.userId, table.normalizedUrl),
}))
```

## Drizzle-Zod Integration

Use `drizzle-zod` to derive Zod schemas directly from the Drizzle schema.
This is the source of truth for validation — do not duplicate schema definitions.

```ts
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { bookmarks } from './schema'

// Full select schema (what comes back from DB)
export const selectBookmarkSchema = createSelectSchema(bookmarks)

// Insert schema — override types as needed for API input
export const insertBookmarkSchema = createInsertSchema(bookmarks, {
  url: (schema) => schema.url(),           // enforce URL format
  title: (schema) => schema.min(1),        // enforce non-empty
}).omit({ id: true, userId: true, dateAdded: true, viewCount: true })

export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert
```

## Query Patterns

### Basic CRUD

```ts
import { db } from '@/lib/db'
import { bookmarks } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

// Select — user's active bookmarks
const userBookmarks = await db
  .select()
  .from(bookmarks)
  .where(and(eq(bookmarks.userId, userId), eq(bookmarks.isArchived, false)))
  .orderBy(desc(bookmarks.dateAdded))

// Insert
const [bookmark] = await db
  .insert(bookmarks)
  .values({ ...data, id: crypto.randomUUID(), userId })
  .returning()

// Update
const [updated] = await db
  .update(bookmarks)
  .set({ title: newTitle })
  .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)))
  .returning()

// Delete
await db
  .delete(bookmarks)
  .where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)))
```

### Always Scope Queries to userId

Every read and write must include `eq(bookmarks.userId, userId)` in the `where` clause.
Never query bookmarks without a userId constraint — this is a security requirement, not
just a best practice.

## Migrations

Use Drizzle Kit for migration management:

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations to the database
npx drizzle-kit migrate

# Open Drizzle Studio (local DB browser)
npx drizzle-kit studio
```

Migration files live in `/drizzle/` at the project root.
Always commit migration files to version control.
Never edit migration files manually after they have been applied.

## drizzle.config.ts

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

## Rules for This Project

- `db` is server-only — never import in `'use client'` files
- Always include `userId` in every query — no exceptions
- Use `.returning()` after insert/update to avoid a second round-trip
- Use `drizzle-zod` for all validation schemas — do not hand-write schemas that duplicate the DB schema
- Never write raw SQL strings — use Drizzle's query builder
- Index columns that are frequently filtered: `userId`, `normalizedUrl`, `isArchived`, `isPinned`
