---
name: vitest-rtl
description: Write unit and component tests with Vitest and React Testing Library. Use when writing, reviewing, or running tests.
---

# Vitest + React Testing Library

We use Vitest for unit and integration tests and React Testing Library (RTL) for component
tests. Tests live alongside source files as `*.test.ts` / `*.test.tsx`.

## Core Philosophy

- Test **behaviour**, not implementation — what a user sees and does, not internal state
- Prefer `getByRole` and `getByLabelText` over `getByTestId` — they test accessibility too
- Unit test pure functions exhaustively; component test interactive behaviour
- One test file per module or component — keep tests close to the code they cover

## Setup

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom'
```

## Unit Testing Pure Functions

Utility functions like URL normalization and filter logic should be tested exhaustively:

```ts
// src/lib/utils/url.test.ts
import { describe, it, expect } from 'vitest'
import { normalizeUrl } from './url'

describe('normalizeUrl', () => {
  it('strips https protocol', () => {
    expect(normalizeUrl('https://example.com')).toBe('example.com')
  })
  it('strips http protocol', () => {
    expect(normalizeUrl('http://example.com')).toBe('example.com')
  })
  it('strips www prefix', () => {
    expect(normalizeUrl('https://www.example.com')).toBe('example.com')
  })
  it('strips trailing slash', () => {
    expect(normalizeUrl('https://example.com/')).toBe('example.com')
  })
  it('lowercases the URL', () => {
    expect(normalizeUrl('https://EXAMPLE.COM')).toBe('example.com')
  })
  it('handles all transformations together', () => {
    expect(normalizeUrl('HTTPS://WWW.EXAMPLE.COM/')).toBe('example.com')
  })
})
```

## Mocking the Zustand Store

Use the real store in tests but reset it between tests:

```ts
import { useBookmarkStore } from '@/store/bookmarkStore'

beforeEach(() => {
  useBookmarkStore.setState({
    bookmarks: [],
    search: '',
    activeTags: [],
    sort: 'recently-added',
  })
})
```

To test with pre-populated data:

```ts
beforeEach(() => {
  useBookmarkStore.setState({ bookmarks: mockBookmarks })
})
```

## Component Testing with RTL

```tsx
// src/components/bookmark/BookmarkCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BookmarkCard } from './BookmarkCard'
import { mockBookmark } from '@/test/fixtures'

describe('BookmarkCard', () => {
  it('renders bookmark title', () => {
    render(<BookmarkCard bookmark={mockBookmark} />)
    expect(screen.getByRole('heading', { name: mockBookmark.title })).toBeInTheDocument()
  })

  it('calls onArchive when archive button is clicked', () => {
    const onArchive = vi.fn()
    render(<BookmarkCard bookmark={mockBookmark} onArchive={onArchive} />)
    fireEvent.click(screen.getByRole('button', { name: /archive/i }))
    expect(onArchive).toHaveBeenCalledWith(mockBookmark.id)
  })

  it('shows copied feedback after copy button click', async () => {
    render(<BookmarkCard bookmark={mockBookmark} />)
    fireEvent.click(screen.getByRole('button', { name: /copy url/i }))
    expect(await screen.findByText(/copied/i)).toBeInTheDocument()
  })
})
```

## Query Priority — Always Follow This Order

1. `getByRole` — most accessible, checks ARIA roles
2. `getByLabelText` — for form inputs
3. `getByPlaceholderText` — only when label is unavailable
4. `getByText` — for visible text content
5. `getByDisplayValue` — for form values
6. `getByTestId` — last resort only; adds no accessibility value

Never use `getByTestId` when a semantic query works.

## Testing Async Behaviour

Use `findBy*` for elements that appear asynchronously:

```ts
// ✅ Waits for element to appear
const error = await screen.findByRole('alert')

// ❌ Will fail if element isn't immediately present
const error = screen.getByRole('alert')
```

Use `waitFor` for assertions that depend on async state changes:

```ts
await waitFor(() => {
  expect(screen.getByText('Bookmark saved')).toBeInTheDocument()
})
```

## Testing Forms

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('shows validation error for empty title', async () => {
  const user = userEvent.setup()
  render(<AddEditBookmarkForm />)

  await user.click(screen.getByRole('button', { name: /save/i }))

  expect(screen.getByRole('alert')).toHaveTextContent('Title is required')
})
```

Always use `userEvent` over `fireEvent` for realistic user interactions (typing, clicking).

## Test Fixtures

Keep shared mock data in `/src/test/fixtures.ts`:

```ts
// src/test/fixtures.ts
import type { Bookmark } from '@/types'

export const mockBookmark: Bookmark = {
  id: 'test-id-1',
  title: 'Example Site',
  url: 'https://example.com',
  normalizedUrl: 'example.com',
  description: 'An example bookmark',
  tags: ['dev', 'tools'],
  favicon: null,
  viewCount: 3,
  lastVisited: '2024-01-15T10:00:00Z',
  dateAdded: '2024-01-01T10:00:00Z',
  isPinned: false,
  isArchived: false,
  userId: 'user-1',
}
```

## Mocking API Calls

Use `vi.mock` to mock the service layer in component tests:

```ts
import { vi } from 'vitest'
import * as bookmarkService from '@/lib/services/bookmarks'

vi.mock('@/lib/services/bookmarks')

beforeEach(() => {
  vi.mocked(bookmarkService.add).mockResolvedValue(mockBookmark)
})
```

## Running Tests

```bash
# Run all tests once
npx vitest run

# Watch mode during development
npx vitest

# Coverage report
npx vitest run --coverage
```

## Rules for This Project

- Tests live next to source files — `Component.tsx` and `Component.test.tsx` in the same folder
- Fixtures live in `/src/test/fixtures.ts` — never inline large mock objects in test files
- Reset Zustand store state in `beforeEach` for every test that uses the store
- Use `userEvent` not `fireEvent` for simulating user interactions
- URL normalization and filter logic tests must pass before Phase 2 begins
- No step is done if it causes previously passing tests to fail
