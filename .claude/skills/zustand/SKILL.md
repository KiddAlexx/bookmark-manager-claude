---
name: zustand
description: Manage client state with Zustand. Use when creating, reading from, or modifying Zustand stores.
---

# Zustand State Management

Zustand is a minimal, unopinionated client state library. We use it as the single source
of truth for all interactive client state in this project.

## Core Philosophy

- Stores are **flat by default** — avoid deeply nested state shapes
- **Derive, don't store** — computed values belong in selectors or `useMemo`, not in the store
- Stores call the **service layer only** — never call localStorage or DB directly from a store
- Keep stores focused — one store per domain (`bookmarkStore`, `themeStore`)

## Store Structure

Define stores with a clear separation between state and actions:

```ts
import { create } from 'zustand'
import type { Bookmark } from '@/types'

type BookmarkState = {
  // State
  bookmarks: Bookmark[]
  search: string
  activeTags: string[]
  sort: 'recently-added' | 'recently-visited' | 'most-visited'
  activeView: 'main' | 'archive'
  // Actions
  setSearch: (search: string) => void
  setSort: (sort: BookmarkState['sort']) => void
  addBookmark: (bookmark: Bookmark) => void
}

export const useBookmarkStore = create<BookmarkState>()((set) => ({
  bookmarks: [],
  search: '',
  activeTags: [],
  sort: 'recently-added',
  activeView: 'main',

  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
  addBookmark: (bookmark) =>
    set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
}))
```

## Selectors — Prevent Unnecessary Re-renders

Always select only what a component needs. Never subscribe to the whole store.

```ts
// ✅ Component only re-renders when `search` changes
const search = useBookmarkStore((state) => state.search)

// ✅ Stable action reference — never causes re-renders
const setSearch = useBookmarkStore((state) => state.setSearch)

// ❌ Subscribes to entire store — re-renders on any change
const store = useBookmarkStore()
```

For derived/computed data, use a selector with `useMemo` in the component, or define
a standalone selector function outside the component:

```ts
// Standalone selector — reusable, testable
export const selectFilteredBookmarks = (state: BookmarkState) => {
  // filter + search + sort logic here
}

// In component
const filtered = useBookmarkStore(selectFilteredBookmarks)
```

## Derived State

Never store derived data in the store. Compute it from existing state:

```ts
// ❌ Do not store derived data
set({ filteredBookmarks: applyFilters(state.bookmarks) })

// ✅ Derive during render via selector
const filtered = useBookmarkStore(selectFilteredBookmarks)
```

## Async Actions

Handle async operations (service layer calls) directly in actions:

```ts
addBookmark: async (data) => {
  const bookmark = await bookmarkService.add(data)   // service layer call
  set((state) => ({ bookmarks: [...state.bookmarks, bookmark] }))
},
```

Keep loading and error state local to the component that triggered the action unless
multiple components need to observe it.

## Persistence (Phase 1)

In Phase 1, use the `persist` middleware to sync the store to localStorage:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({ /* store definition */ }),
    { name: 'bookmark-store' }
  )
)
```

In Phase 2, remove the `persist` middleware — the service layer handles DB persistence
and the store becomes a pure in-memory cache of the current session's data.

## This Project's Stores

### `bookmarkStore.ts`
State: `bookmarks`, `search`, `activeTags`, `sort`, `activeView`
Actions: `addBookmark`, `editBookmark`, `archiveBookmark`, `unarchiveBookmark`,
`deleteBookmark`, `pinBookmark`, `unpinBookmark`, `setSearch`, `toggleTag`,
`resetTags`, `setSort`, `setActiveView`, `incrementViewCount`, `setLastVisited`

### `themeStore.ts`
State: `theme: 'light' | 'dark'`
Actions: `toggleTheme`, `setTheme`
Persistence: always persisted to localStorage

## Rules for This Project

- Stores **never** import from each other
- Stores **never** call `fetch`, localStorage, or Drizzle directly — only service layer
- Actions must be **synchronous where possible**; async only when calling the service layer
- Do not use `immer` middleware unless state nesting genuinely requires it (it does not here)
- Do not use `subscribeWithSelector` middleware unless there is a proven need
