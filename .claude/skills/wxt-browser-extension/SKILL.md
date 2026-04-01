---
name: wxt-browser-extension
description: Build a browser extension with WXT and Manifest V3. Use when working on the browser extension in the /extension directory.
---

# WXT Browser Extension (Manifest V3)

WXT is a Vite-based framework for building browser extensions. It handles Manifest V3
differences between Chrome and Firefox, provides TypeScript support, HMR during
development, and a clean project structure.

The extension lives in `/extension/` as a separate sub-project within the monorepo.
It is **Phase 3 only** — do not work on the extension until the main app is stable.

## Core Philosophy

- The extension is **thin** — it captures the current page and delegates to the backend
- All business logic (duplicate detection, validation, metadata fetch) lives in the API
- The extension must never reimplement rules that exist server-side
- Keep the popup UI minimal — title, URL, tags, save button, feedback state

## Project Structure

```
/extension
  wxt.config.ts
  package.json
  /entrypoints
    popup/
      index.html
      main.tsx
      App.tsx
    background.ts       ← service worker (Manifest V3)
  /components
    SaveForm.tsx
    DuplicateWarning.tsx
    AuthPrompt.tsx
  /lib
    api.ts              ← calls to the main app API
    auth.ts             ← token storage and retrieval
    types.ts
```

## WXT Config

```ts
// extension/wxt.config.ts
import { defineConfig } from 'wxt'

export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Bookmark Manager',
    description: 'Save bookmarks directly from any webpage',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['https://your-app-domain.com/*'],
  },
})
```

## Popup Entry Point

```tsx
// extension/entrypoints/popup/App.tsx
import { useEffect, useState } from 'react'
import { getCurrentTab } from '../lib/tab'
import { getAuthToken } from '../lib/auth'
import { SaveForm } from '../components/SaveForm'
import { AuthPrompt } from '../components/AuthPrompt'

export function App() {
  const [tab, setTab] = useState<{ title: string; url: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function init() {
      const token = await getAuthToken()
      setIsAuthenticated(!!token)
      const currentTab = await getCurrentTab()
      setTab(currentTab)
    }
    init()
  }, [])

  if (!isAuthenticated) return <AuthPrompt />
  if (!tab) return <div>Loading...</div>
  return <SaveForm title={tab.title} url={tab.url} />
}
```

## Getting the Current Tab

```ts
// extension/lib/tab.ts
export async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return {
    title: tab.title ?? '',
    url: tab.url ?? '',
  }
}
```

## Auth Token Storage

Store the session token in `chrome.storage.local` — sandboxed to the extension:

```ts
// extension/lib/auth.ts
const TOKEN_KEY = 'auth_token'

export async function getAuthToken(): Promise<string | null> {
  const result = await chrome.storage.local.get(TOKEN_KEY)
  return result[TOKEN_KEY] ?? null
}

export async function setAuthToken(token: string): Promise<void> {
  await chrome.storage.local.set({ [TOKEN_KEY]: token })
}

export async function clearAuthToken(): Promise<void> {
  await chrome.storage.local.remove(TOKEN_KEY)
}
```

Never store tokens in `localStorage`, `sessionStorage`, or cookies from the extension.

## API Calls to the Main App

```ts
// extension/lib/api.ts
const APP_URL = import.meta.env.WXT_APP_URL  // set in .env

export async function saveBookmark(data: {
  title: string
  url: string
  tags?: string[]
}): Promise<{ success: boolean; duplicate?: boolean; bookmarkId?: string }> {
  const token = await getAuthToken()

  const response = await fetch(`${APP_URL}/api/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (response.status === 401) {
    await clearAuthToken()
    throw new Error('Unauthorized')
  }

  return response.json()
}
```

## Extension States to Handle

The popup must handle all of these states explicitly:

| State | UI |
|---|---|
| Not authenticated | Prompt to log in, link to app login page |
| Authenticated, URL valid | Save form with pre-filled title and URL |
| Saving | Button disabled, loading indicator |
| Saved successfully | Green confirmation, option to view bookmark |
| Duplicate detected | Warning with link to existing bookmark, option to save anyway |
| Save failed | Error message, retry option |
| No URL (new tab, chrome:// page) | Message: "Cannot save this page" |

## Environment Variables

```bash
# extension/.env
WXT_APP_URL=https://your-deployed-app.com
```

Use `import.meta.env.WXT_APP_URL` to access in extension code.

## Development

```bash
cd extension

# Install dependencies
npm install

# Start dev mode (Chrome)
npm run dev

# Start dev mode (Firefox)
npm run dev:firefox

# Build for production
npm run build

# Build for Firefox
npm run build:firefox

# Package for submission
npm run zip
```

Loading the extension in Chrome during development:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `extension/.output/chrome-mv3/`

## Rules for This Project

- Extension is Phase 3 only — do not start until main app and auth are stable
- The extension calls the main app's API — it does not have its own backend
- All bookmark validation and duplicate detection happens server-side — the extension
  shows the result, it does not reimplement the logic
- Token stored in `chrome.storage.local` only — see web-security skill
- On auth error (401), clear the stored token and prompt re-authentication
- The popup must not exceed ~400px width — keep the UI minimal
- Always handle the case where the current tab URL is not saveable (chrome://, about:, etc.)
