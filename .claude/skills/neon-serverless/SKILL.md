---
name: neon-serverless
description: Connect to and configure Neon Postgres for use in Next.js serverless functions. Use when setting up or modifying the database connection.
---

# Neon Serverless Postgres

Neon is a serverless Postgres provider. It uses an HTTP-based driver optimised for
serverless environments where traditional persistent TCP connections are impractical
due to cold starts and ephemeral function lifetimes.

## Why the Standard `pg` Driver Does Not Work Well Here

Next.js API routes and server actions run as serverless functions. Each invocation may
be a cold start with no existing connection. The standard `pg` driver uses persistent
TCP connections — connection pooling (e.g. PgBouncer) is needed to handle this.

Neon provides `@neondatabase/serverless` — an HTTP-based driver that works without a
persistent connection, making it the correct choice for this project.

## Installation

```bash
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit
```

## Connection Setup

```ts
// src/lib/db/index.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// neon() creates a tagged template SQL function
const sql = neon(process.env.DATABASE_URL!)

// drizzle wraps it with the ORM query builder
export const db = drizzle(sql, { schema })
```

This file is **server-only**. Never import `db` from a client component or any file
with `'use client'`.

## Environment Variable

```bash
# .env.local
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

The connection string is available in the Neon dashboard under your project's
connection details. Always use `?sslmode=require` — Neon requires SSL.

Add `DATABASE_URL` to Vercel environment variables for production and preview deployments.

## Neon Project Setup

1. Create a new project at [neon.tech](https://neon.tech)
2. Copy the connection string from the dashboard
3. Add it to `.env.local`
4. Run `npx drizzle-kit migrate` to apply the initial schema

## Branching (Optional but Useful)

Neon supports database branching — each branch is an isolated copy of the database.
Useful for:
- Preview deployments (each PR gets its own branch)
- Running E2E tests against isolated data

```bash
# Neon CLI — create a branch for testing
neonctl branch create --name test-branch
```

## Connection Considerations

- Each serverless function invocation creates a new HTTP connection — this is expected
- No connection pooler is needed with the `@neondatabase/serverless` HTTP driver
- If you later need WebSocket-based connections (for transactions), use
  `neonConfig.webSocketConstructor` from `@neondatabase/serverless` — see Neon docs
- Keep queries efficient — each HTTP round-trip has latency; avoid N+1 query patterns

## Transactions

HTTP-based connections support transactions via the `transaction` helper:

```ts
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Use neon's transaction helper for multi-step writes
const result = await sql.transaction([
  sql`INSERT INTO bookmarks (...) VALUES (...)`,
  sql`UPDATE users SET bookmark_count = bookmark_count + 1 WHERE id = ${userId}`,
])
```

With Drizzle, use `db.transaction`:

```ts
await db.transaction(async (tx) => {
  await tx.insert(bookmarks).values(newBookmark)
  await tx.update(users).set({ bookmarkCount: sql`bookmark_count + 1` }).where(eq(users.id, userId))
})
```

## Rules for This Project

- Always use `@neondatabase/serverless` with `drizzle-orm/neon-http` — not `pg`
- `DATABASE_URL` must include `?sslmode=require`
- `db` is server-only — enforced by keeping it in `/src/lib/db/` with no `'use client'`
- Never hardcode the connection string — always use `process.env.DATABASE_URL`
- Log the Drizzle queries in development by passing `{ logger: true }` to `drizzle()` temporarily
- Use Neon branching for E2E test isolation in Phase 2+
