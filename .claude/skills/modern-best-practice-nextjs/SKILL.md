---
name: modern-best-practice-nextjs
description: Build modern Next.js apps with App Router and best practices. Use when working on Next.js code or using Next.js features.
---

# Next.js Best Practices (App Router)

Next.js is a library that changes frequently - use web search or context7 MCP (via DocsExplorer agent) for exploring the current documentation.

## Routing & Structure

- Use the App Router in `app/` for new work
- Use nested layouts and route groups to organize sections
- Keep server components as the default; add `'use client'` only where needed

## Server vs Client Boundary — This Project

This project has a **deliberately client-driven core UI**. Understand where the boundary sits
before deciding where to fetch or mutate data:

**Server components are used for:**
- The root layout shell (`app/layout.tsx`)
- Auth pages (`app/auth/login`, `app/auth/register`)
- The metadata fetch API route (`app/api/metadata/route.ts`)
- The bookmarks API route (`app/api/bookmarks/route.ts`)
- Static page wrappers where no interactivity is needed

**Client components (`'use client'`) are used for:**
- The entire bookmark list UI — search, filter, sort, pin, archive are all reactive
  client-side state managed by Zustand
- All interactive components: BookmarkCard, Sidebar, Header, Modal, forms
- Any component that reads from or dispatches to a Zustand store

**Rule:** Do not attempt to fetch bookmark data in Server Components and pass it as props
into the client UI. The Zustand store is the single source of truth for bookmark state.
Data enters the store via the service layer (`/src/lib/services/`), not via RSC props.

## Data Fetching & Mutations

- Fetch data in React Server Components where applicable (layout, auth, static pages)
- **Do not** fetch bookmark list data via `useEffect()` and client-side `fetch()`
- Use the Zustand service layer for all bookmark reads and writes in the client UI
- Use server actions ("Server Functions") for auth mutations and API-level operations,
  potentially in conjunction with React Hooks like `useActionState`

## UI States

- Provide `loading.tsx` and `error.tsx` for route-level UX
- Use `Suspense` boundaries around async UI

## Metadata & SEO

- Use the Metadata API in layouts and pages
- Prefer static metadata when possible; keep dynamic metadata minimal
