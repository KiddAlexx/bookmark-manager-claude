---
name: playwright
description: Write end-to-end tests with Playwright. Use when writing, reviewing, or running E2E tests.
---

# Playwright End-to-End Testing

We use Playwright for end-to-end tests covering critical user flows. E2E tests live in
the `/e2e/` directory at the project root.

## Core Philosophy

- Test **complete user flows**, not individual components — that's RTL's job
- Keep tests **resilient** — prefer role and label selectors over CSS or XPath
- Keep tests **independent** — each test must work in isolation with no shared state
- Avoid testing the same thing twice — if RTL covers it, Playwright doesn't need to

## Setup

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Basic Test Structure

```ts
// e2e/bookmark.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Add bookmark', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('adds a bookmark and shows it in the list', async ({ page }) => {
    await page.getByRole('button', { name: /add bookmark/i }).click()
    await page.getByLabel('Title').fill('Example Site')
    await page.getByLabel('URL').fill('https://example.com')
    await page.getByRole('button', { name: /save/i }).click()

    await expect(page.getByRole('article', { name: /example site/i })).toBeVisible()
  })
})
```

## Locator Strategy — Priority Order

1. `getByRole` — preferred, accessibility-aligned
2. `getByLabel` — for form inputs
3. `getByText` — for visible text
4. `getByPlaceholder` — only when label unavailable
5. `locator('[data-testid="..."]')` — last resort

```ts
// ✅ Preferred
page.getByRole('button', { name: /archive/i })
page.getByLabel('Search bookmarks')

// ❌ Avoid — brittle
page.locator('.bookmark-card:nth-child(2) .archive-btn')
page.locator('#archive-button')
```

## Authentication State in Tests (Phase 2)

Avoid logging in through the UI in every test — it's slow and tests the wrong thing.
Use Playwright's `storageState` to reuse an authenticated session:

```ts
// e2e/auth.setup.ts — runs once before all tests
import { test as setup } from '@playwright/test'

setup('authenticate', async ({ page }) => {
  await page.goto('/auth/login')
  await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL!)
  await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD!)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL('/')
  await page.context().storageState({ path: 'e2e/.auth/user.json' })
})
```

```ts
// playwright.config.ts — apply auth state to all tests
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'authenticated',
      use: { storageState: 'e2e/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
})
```

## Waiting Strategies

Always wait for the right thing — never use arbitrary `waitForTimeout`:

```ts
// ✅ Wait for element to appear
await expect(page.getByText('Bookmark saved')).toBeVisible()

// ✅ Wait for navigation
await page.waitForURL('/archive')

// ✅ Wait for network request to complete
await page.waitForResponse('/api/metadata')

// ❌ Never use arbitrary timeouts — flaky
await page.waitForTimeout(2000)
```

## Page Object Model

For flows with many steps, extract a Page Object to keep tests readable:

```ts
// e2e/pages/BookmarkPage.ts
import { Page } from '@playwright/test'

export class BookmarkPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  async addBookmark(title: string, url: string) {
    await this.page.getByRole('button', { name: /add bookmark/i }).click()
    await this.page.getByLabel('Title').fill(title)
    await this.page.getByLabel('URL').fill(url)
    await this.page.getByRole('button', { name: /save/i }).click()
  }

  async archiveBookmark(title: string) {
    const card = this.page.getByRole('article', { name: title })
    await card.getByRole('button', { name: /archive/i }).click()
  }
}
```

## Test Data Strategy

- Use a dedicated test database for E2E tests — never run against production
- Seed test data via API calls in `beforeEach` using the app's own API routes
- Clean up test data in `afterEach` or use isolated test users per test run

```ts
test.beforeEach(async ({ request }) => {
  // Seed via API
  await request.post('/api/test/seed', { data: { bookmarks: testBookmarks } })
})
```

## Required E2E Tests — This Project

| File | Flows Covered |
|---|---|
| `e2e/bookmark.spec.ts` | Add, edit, archive, delete, pin, copy URL |
| `e2e/search-filter.spec.ts` | Search by title, tag filter, reset filters, sort |
| `e2e/auth.spec.ts` | Login, logout, protected route redirect (Phase 2) |
| `e2e/extension.spec.ts` | Extension save flow, duplicate warning (Phase 3) |

## Running Tests

```bash
# Run all E2E tests
npx playwright test

# Run with UI mode (interactive)
npx playwright test --ui

# Run specific file
npx playwright test e2e/bookmark.spec.ts

# Run on specific browser
npx playwright test --project=chromium

# Show last HTML report
npx playwright show-report
```

## Rules for This Project

- Never use `waitForTimeout` — always wait for a specific condition
- Each test must pass in isolation — no dependency on test execution order
- Use `storageState` for auth in Phase 2 — never log in through UI in every test
- Page objects are required for flows with more than 5 steps
- E2E tests run against a test database — never production data
- Add E2E tests incrementally from Step 6 — do not defer all E2E to the end
