# SPEC.md — Bookmark Manager App

## Overview

A full-stack bookmark manager application built to the Frontend Mentor Figma specification.
Users can save, organize, search, filter, sort, pin, archive, and visit web bookmarks.
The app supports light/dark themes, is fully responsive, and persists data across devices via
authenticated user accounts.

The project is built in three phases:

- **Phase 1:** Full UI with local JSON seed data, no auth, no database
- **Phase 2:** Auth, Postgres database, image hosting, metadata auto-fetch, duplicate detection
- **Phase 3:** Browser extension, keyboard shortcuts, testing, final polish

---

## Version Philosophy

Prefer **modern but settled** versions with strong ecosystem compatibility. Do not adopt the
newest major release purely because it is newest. Use current stable releases within a mature
version line unless there is a clear project-specific reason to go newer.

If a version decision changes during implementation, the reason must be documented in
`/experiment/decisions.md`.

---

## Full Stack

| Technology | Version | Role |
|---|---|---|
| Next.js | 15.x | Framework — App Router, API Routes, Server Actions |
| React | 19.x | UI rendering |
| TypeScript | 5.x | Type safety across all layers |
| Tailwind CSS | 4.1 | Styling — CSS-first config, dark mode via class |
| Zustand | latest stable | Client state management |
| React Hook Form | latest stable | Form state and submission |
| Zod | latest stable | Schema validation — client and server, shared |
| Neon | latest stable | Serverless Postgres database |
| Drizzle ORM | latest stable | Type-safe ORM, schema-as-code, no binary process |
| Auth.js (NextAuth) | v5.x | Authentication — OAuth + credentials |
| Cloudinary | latest stable SDK | Image storage — avatars and favicons |
| Cheerio | latest stable | Server-side HTML parsing for metadata fetch |
| WXT | latest stable | Browser extension framework — Manifest V3, Chrome + Firefox |
| next-themes | latest stable | Theme management — SSR flash prevention, system preference, class toggle |
| Lucide React | latest stable | Icons |
| next/font | built-in | Google Fonts, zero layout shift |
| Vitest | latest stable | Unit and integration tests |
| React Testing Library | latest stable | Component tests |
| Playwright | latest stable | End-to-end tests for critical flows |
| Vercel | latest | Deployment |

### Phase 1 Only (temporary)

| Technology | Role | Replaced By |
|---|---|---|
| localStorage | Data persistence | Neon + Drizzle in Phase 2 |
| Service abstraction layer | Isolates data access for clean Phase 1 → Phase 2 swap | Same layer, new implementation |

---

## Data Models

### Bookmark

```ts
interface Bookmark {
  id: string
  userId: string                 // Phase 2+
  title: string
  description: string
  url: string
  normalizedUrl: string          // For duplicate detection
  tags: string[]
  favicon: string | null         // Cloudinary URL (Phase 2) or Google Favicon API URL (Phase 1)
  viewCount: number
  lastVisited: string | null     // ISO date string
  dateAdded: string              // ISO date string
  isPinned: boolean
  isArchived: boolean
}
```

### User (Phase 2+)

```ts
interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null       // Cloudinary URL
  createdAt: string
}
```

---

## Requirements Breakdown

### 1. Bookmark CRUD

**Add bookmark**
- Fields: title (required), URL (required), description (optional), tags (optional)
- On URL entry: auto-fetch metadata (title, description, favicon) via server-side API route
- Favicon uploaded to Cloudinary (Phase 2) or fetched from Google Favicon API (Phase 1)
- Duplicate detection: warn if normalized URL already exists for this user
- Manual favicon upload as fallback (file input)

**Edit bookmark**
- Same form as Add, pre-filled with existing data
- Metadata re-fetch available if URL is changed

**Archive bookmark**
- Sets `isArchived = true`
- Removes from main view, appears in Archive view
- If bookmark is pinned, silently unpin on archive

**Delete bookmark**
- Permanent removal — separate from archive
- Confirmation prompt before delete to prevent accidental loss

**View bookmark detail**
- Full data: favicon (large), title, URL, description, all tags, view count, last visited, date added
- Visit URL action (opens new tab, increments viewCount, sets lastVisited)
- Copy URL to clipboard

---

### 2. UI Sections

#### Header / Navbar
- App logo
- Search bar (real-time title search)
- Theme toggle (light / dark)
- User avatar + account menu (Phase 2)
- Add bookmark button

#### Sidebar
- Full list of all unique tags across user's bookmarks
- Multi-select tag filter (OR logic — any match)
- Active/selected state per tag
- Reset / All option to clear all active filters
- Archive view navigation link
- Responsive: collapses on mobile (exact behavior from Figma)

#### Main Bookmark List
- Pinned section at top (labeled, visually separate)
- Regular bookmarks below
- Sort control: Recently added | Recently visited | Most visited
- Empty states:
  - No bookmarks yet
  - No results for current search query
  - No results for current tag filter combination

#### Bookmark Card

Displays:
- Favicon (with fallback icon for missing/broken images)
- Title
- URL (truncated)
- Description (truncated)
- Tags as pills/chips
- Date added

Actions (on hover or via overflow menu — match Figma exactly):
- Pin / Unpin
- Archive
- Edit
- Copy URL (with "Copied!" feedback for ~2 seconds)
- Visit URL (opens new tab)
- Delete

States:
- Default
- Pinned (visual indicator)
- Hover
- Focus (keyboard navigation)

#### Add / Edit Modal
- React Hook Form + Zod validation
- Fields: title, URL, description, tags, favicon
- URL blur → triggers metadata auto-fetch (title, description, favicon pre-populated)
- Favicon: displays fetched image with option to re-upload manually
- Tag input: inline add/remove tags
- Validation errors shown inline per field
- Loading state during metadata fetch
- Accessible: focus trap, ESC to close, aria-modal

#### Archive View
- All bookmarks where `isArchived === true`
- Unarchive action per item
- Delete action per item
- Empty state when no archived items
- Accessible via sidebar navigation link

#### Bookmark Detail View
- Full display of all bookmark fields
- Actions: visit, copy, edit, archive, delete
- Implementation: modal or route — confirm from Figma before Step 9

#### User Profile / Settings (Phase 2)
- Display name edit
- Avatar upload via Cloudinary
- Account management

#### Auth Pages (Phase 2)
- Login: OAuth (Google, GitHub) + email/password
- Register
- Forgot password

---

### 3. Interactions

| Interaction | Behavior |
|---|---|
| Type in search bar | Filters bookmark list by title in real-time, case-insensitive |
| Click tag in sidebar | Adds tag to active filter set |
| Click active tag | Removes tag from active filter set |
| Click Reset / All | Clears all active tag filters |
| Click sort option | Re-sorts the visible filtered list |
| Click pin | Toggles isPinned; moves card to/from pinned section |
| Click archive | Sets isArchived = true; removes from main view |
| Click unarchive | Sets isArchived = false; returns to main view |
| Click edit | Opens modal pre-filled with bookmark data |
| Click copy URL | Copies to clipboard; shows "Link copied to clipboard." toast notification |
| Click visit | Opens URL in new tab; increments viewCount; sets lastVisited |
| Click delete | Confirmation prompt; permanently removes bookmark |
| Submit add/edit form | Validates → fetches metadata if needed → saves → closes modal |
| Blur URL field in form | Triggers metadata fetch; pre-fills title/description/favicon |
| Toggle theme | Switches light/dark; persists to localStorage (Phase 1) / user record (Phase 2) |
| Upload favicon | Uploads to Cloudinary (Phase 2); updates favicon field |

---

### 4. Filter + Search + Sort Composition

- Search: case-insensitive substring match on `title`
- Tag filter: OR logic — show bookmarks matching **any** selected tag
- Search and tag filter compose — both must match simultaneously
- Sort applies to the composed filtered result set
- Pinned bookmarks shown in their own section above, also subject to search/filter
- Archived bookmarks never appear in main view regardless of filters
- All composition computed via `useMemo` — never stored in state

---

### 5. Duplicate Detection

- On URL entry in the Add form, normalize the URL:
  - Lowercase
  - Strip trailing slash
  - Strip `www.`
  - Strip protocol (`https://`, `http://`)
- Check normalized URL against existing bookmarks for this user
- If match found: show non-blocking warning with link to existing bookmark
- User can dismiss warning and save anyway (intentional duplicates allowed)
- Database enforces unique constraint on `(userId, normalizedUrl)` as hard safety net (Phase 2)
- Duplicate detection must be enforced server-side — client check is UX only
- Normalization utility lives in `/src/lib/utils/url.ts`, shared between client and server

---

### 6. Metadata Auto-fetch

Server-side Route Handler at `POST /api/metadata`:
- Accepts `{ url: string }`
- Fetches the target URL server-side (bypasses browser CORS)
- Parses HTML with Cheerio
- Extracts in priority order:
  - Title: `og:title` → `<title>` → URL hostname as fallback
  - Description: `og:description` → `meta[name=description]` → empty string
  - Favicon: `<link rel="icon">` → `<link rel="shortcut icon">` → `/favicon.ico`
- Phase 2: downloads favicon and uploads to Cloudinary; returns Cloudinary URL
- Phase 1: returns raw favicon URL directly
- Returns `{ title, description, faviconUrl }`
- Error handling: if fetch fails, returns empty fields gracefully — user fills manually
- Metadata fetch failures must degrade gracefully and never block the save flow

---

### 7. Theme

- Two modes: light and dark
- Managed by `next-themes`: adds `.dark` class to `<html>`, handles SSR flash prevention, system preference, and localStorage persistence automatically
- Semantic CSS tokens in `globals.css` define what changes per theme — components use single token classes, never `dark:` variant pairs
- Phase 2: preference also persisted to user record in DB, synced across devices
- Default: system preference via `prefers-color-scheme`, fallback to light

---

### 8. Keyboard Shortcuts (Phase 3)

| Shortcut | Action |
|---|---|
| `N` | Open new bookmark modal |
| `/` or `Cmd+K` | Focus search bar |
| `Escape` | Close modal / clear search |
| `A` | Navigate to Archive view |
| `1` / `2` / `3` | Switch sort mode |
| `P` | Pin/unpin focused bookmark |
| `?` | Open keyboard shortcuts help modal |

Implementation: `useKeyboardShortcuts` hook using `keydown` event listener.
Shortcuts disabled when focus is inside an `<input>` or `<textarea>`.

---

### 9. Browser Extension (Phase 3)

Built with WXT (Manifest V3, Chrome + Firefox) in `/extension` directory within the monorepo.

**Features:**
- Popup showing current page title and URL
- One-click save to bookmark manager
- Auto-fills title and URL; triggers metadata fetch via app API
- Requires user to be authenticated (token stored in extension storage)
- Visual confirmation on successful save
- Duplicate warning if URL already saved

**Architecture rules:**
- Extension calls `POST /api/bookmarks` on the deployed app
- Extension must not reimplement bookmark business logic — it delegates to the backend
- Extension must not bypass backend auth or validation rules
- Auth via session token stored in `chrome.storage.local`
- Extension remains thin: capture and display only, no business logic ownership

---

### 10. Toast Notifications

Appear at the bottom-right of the screen. Stack vertically. Auto-dismiss after 4 seconds. Each has a dismiss ✕ button.

| Message | Lucide Icon | Trigger |
|---|---|---|
| "Bookmark added successfully." | `Check` | Add bookmark form submitted |
| "Changes saved." | `Check` | Edit bookmark form submitted |
| "Link copied to clipboard." | `Copy` | Copy URL action |
| "Bookmark pinned to top." | `Pin` | Pin action |
| "Bookmark unpinned." | `PinOff` | Unpin action |
| "Bookmark archived." | `Archive` | Archive action |
| "Bookmark restored." | `RotateCcw` | Unarchive action |
| "Bookmark deleted." | `Trash2` | Delete confirmed |

**Design tokens:**
- Background: `bg-surface` (white in light, dark teal in dark)
- Border: `ring-1 ring-line`
- Icon: `text-ink-sub` (teal-tinted in light, near-white in dark)
- Text: `text-ink`
- Shape: `rounded-xl`, `shadow-lg`

**State management:** Zustand `toastStore` — `toasts[]`, `addToast(message, icon)`, `removeToast(id)`. Each toast has a unique id and auto-dismiss timer set on creation.

**Accessibility:** `role="status"` on the container, `aria-live="polite"`, `aria-atomic="true"` on each toast.

---

### 11. Responsiveness

Three target layouts (exact breakpoints confirmed from Figma):
- **Mobile** (< 640px): Sidebar hidden, accessible via toggle; stacked card layout
- **Tablet** (640px–1024px): Sidebar collapsible overlay or narrow rail
- **Desktop** (> 1024px): Full sidebar + main content side by side

All interactive elements must meet minimum 44×44px touch target size on mobile.

---

### 11. Accessibility

- All interactive elements keyboard accessible
- Focus-visible styles on all interactive elements (never `outline: none` without replacement)
- ARIA labels on all icon-only buttons
- Modal: focus trap, `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal title
- Dynamic regions: `aria-live` for search result count, copy feedback, validation errors
- Semantic HTML: `<nav>`, `<main>`, `<aside>`, `<header>`, `<button>`, `<form>`, `<label>`
- Sufficient color contrast in both light and dark themes
- Respect `prefers-reduced-motion` for all transitions and animations

---

### 12. Testing Strategy

Testing is a required part of the implementation, not optional polish.

#### Unit Tests (Vitest)

Cover all shared logic and utilities:

| Area | What to Test |
|---|---|
| URL normalization | All normalization rules, edge cases, trailing slashes, www, protocol stripping |
| Duplicate detection | Match, no match, case differences, protocol differences |
| Search/filter/sort logic | All sort modes, OR tag logic, search composition, edge cases |
| Archive/pin behaviors | State transitions, pin + archive conflict resolution |
| Metadata extraction helpers | Title/description/favicon priority order, fallback behavior |

#### Component Tests (Vitest + React Testing Library)

Cover interactive UI components:

| Component | What to Test |
|---|---|
| BookmarkCard | Renders all fields, action buttons fire correct callbacks |
| AddEditBookmarkForm | Validation errors, URL blur triggers metadata fetch, tag add/remove |
| TagFilter (Sidebar) | Single select, multi-select, reset clears all |
| SortControl | Each option dispatches correct sort action |
| Modal | Focus trap, ESC closes, aria attributes present |
| ThemeToggle | Toggles class on html element, persists to localStorage |

#### End-to-End Tests (Playwright)

Cover critical user flows:

| Flow | Scope |
|---|---|
| Add bookmark | Fill form → submit → appears in list |
| Edit bookmark | Open existing → change title → save → updated in list |
| Archive bookmark | Archive from card → disappears from main → appears in archive |
| Search | Type query → list filters → clear → list restored |
| Tag filter | Select tag → list filters → reset → list restored |
| Duplicate detection | Add URL → add same URL → warning shown |
| Theme toggle | Toggle → class applied → persists on reload |
| Auth flow (Phase 2) | Login → protected route accessible → logout → redirected |

#### Testing Rules
- Tests live alongside source files: `*.test.ts` / `*.test.tsx`
- E2E tests live in `/e2e/`
- Tests for shared utilities must pass before Phase 2 begins
- Component tests for core UI must pass before Phase 2 begins
- E2E tests for critical flows added incrementally from Step 6 onward
- No step is considered done if it breaks existing passing tests

---

## Service Abstraction Layer

All data access goes through `/src/lib/services/`:

```
/src/lib/services/
  bookmarks.ts     ← getBookmarks, addBookmark, editBookmark, archiveBookmark, deleteBookmark
  user.ts          ← getUser, updateUser (Phase 2)
```

**Phase 1:** functions read/write localStorage, seed from data.json on first load
**Phase 2:** functions call Drizzle ORM queries against Neon Postgres

Zustand store only calls the service layer — never touches localStorage or DB directly.
The web app backend and domain layer is the source of truth.
Phase 1 → Phase 2 migration only touches the service layer files — the rest of the app is unchanged.

---

## Scope Exclusions

The following must not be built unless the specification is intentionally changed:

- Team or shared workspaces
- Social or community features
- AI-generated tagging or summaries
- Bookmark sharing or public profiles
- Browser history ingestion
- Import / export systems
- Native mobile apps
- Analytics beyond required bookmark view count and last visited metadata

Optional enhancements may be noted in `experiment/summary.md` but must not interrupt the core build sequence.

---

## Folder Structure

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── archive/
│   │   │   └── page.tsx
│   │   ├── auth/                          # Phase 2
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── api/
│   │       ├── metadata/route.ts          # Cheerio metadata fetch
│   │       ├── bookmarks/route.ts         # Phase 2
│   │       └── auth/[...nextauth]/        # Phase 2
│   ├── components/
│   │   ├── bookmark/
│   │   │   ├── BookmarkCard.tsx
│   │   │   ├── BookmarkList.tsx
│   │   │   ├── BookmarkDetail.tsx
│   │   │   ├── PinnedSection.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── forms/
│   │   │   ├── AddEditBookmarkForm.tsx
│   │   │   └── TagInput.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileSidebarDrawer.tsx
│   │   └── ui/
│   │       ├── Modal.tsx
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── SortControl.tsx
│   ├── store/
│   │   ├── bookmarkStore.ts
│   │   └── themeStore.ts
│   ├── lib/
│   │   ├── services/
│   │   │   ├── bookmarks.ts
│   │   │   └── user.ts
│   │   ├── db/                            # Phase 2
│   │   │   ├── schema.ts
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── url.ts                     # URL normalization + duplicate check
│   │       ├── metadata.ts                # Cheerio parsing helpers
│   │       └── cloudinary.ts              # Phase 2
│   ├── hooks/
│   │   ├── useKeyboardShortcuts.ts        # Phase 3
│   │   └── useClipboard.ts
│   ├── types/
│   │   └── index.ts
│   └── data/
│       └── data.json
├── e2e/                                   # Playwright end-to-end tests
│   ├── bookmark.spec.ts
│   ├── search-filter.spec.ts
│   ├── auth.spec.ts                       # Phase 2
│   └── extension.spec.ts                  # Phase 3
├── extension/                             # Phase 3 — WXT browser extension
├── experiment/
│   ├── decisions.md
│   ├── prompts.md
│   ├── metrics.csv
│   ├── summary.md
│   └── steps/
├── public/
└── assets/
```

---

## Implementation Plan

Each step is broken into sub-tasks (a, b, c…). Each sub-task is implemented, reviewed, and committed separately before the next begins.

### Phase 1 — Full UI with Local Data

| Step | Sub-task | Scope |
|---|---|---|
| 1 | ✅ complete | Project scaffold: Next.js 15, TypeScript, Tailwind v4, Lucide, next/font, Vitest + RTL config, folder structure, design tokens from Figma |
| 2 | ✅ complete | TypeScript types + Zod schemas + URL normalization utility + unit tests + localStorage service layer + data seeding |
| 3 | ✅ complete | Zustand bookmarkStore: state shape + all actions |
| 4 | ✅ complete | Layout shell: Header + Sidebar + Mobile sidebar drawer + responsive wiring + theme toggle |
| 5 | ✅ complete | BookmarkCard + BookmarkList + PinnedSection + EmptyState |
| 6 | ✅ complete | Search + tag filter (OR logic) + sort control + filter/sort composition |
| 7 | ✅ complete | Archive view: list, search, tag filter, sort, unarchive, delete |
| 8 | ✅ complete | Add/Edit Bookmark Modal: RHF + Zod, all fields, tag input, focus trap |
| 9 | ✅ complete | Delete Confirmation Modal |
| 10 | ✅ complete | Theme toggle: light/dark/system, hydration-safe, next-themes persistence |
| 11 | ✅ complete | Polish pass: mobile tag filter, focus rings, prefers-reduced-motion, aria-live |
| 12 | ✅ complete | Vitest unit tests: URL normalization, filter/sort, duplicate detection, archive/pin transitions |
| 13a | | Toast store (Zustand) + Toast + ToastContainer components + wire into root layout |
| 13b | | Fire toasts from all bookmark actions across home + archived pages + BookmarkCard copy |

### Phase 2 — Auth + Database + Images

| Step | Sub-task | Scope |
|---|---|---|
| 14a | | Neon setup + Drizzle schema (users, bookmarks, sessions) |
| 14b | | Migrations + drizzle-zod schema generation |
| 15a | | Auth.js v5: login/register pages + session handling |
| 15b | | Google + GitHub OAuth + protected routes |
| 15c | | Email/password credentials provider |
| 16 | | Migrate service layer from localStorage to Drizzle/Neon |
| 17 | | Metadata API route: Cheerio fetch, title/description/favicon extraction |
| 18a | | Cloudinary: favicon upload pipeline in metadata route |
| 18b | | Cloudinary: avatar upload, secure server-mediated patterns |
| 19a | | Duplicate detection: client-side warning |
| 19b | | Duplicate detection: server-side enforcement + DB unique constraint |
| 20 | | User profile page: avatar upload, display name edit |
| 21 | | Cross-device theme sync: persist to user record in DB |
| 22 | | Phase 2 test pass: auth flow E2E, duplicate detection unit tests, API route tests |

### Phase 3 — Extension + Shortcuts + Final QA

| Step | Sub-task | Scope |
|---|---|---|
| 23a | | useKeyboardShortcuts hook + all shortcuts wired |
| 23b | | Keyboard shortcuts help modal + unit tests |
| 24a | | WXT extension scaffold: popup UI |
| 24b | | Extension: save current page action + auth token handling |
| 25 | | Extension: duplicate detection warning, save confirmation, error states |
| 26 | | Extension E2E: core save flow test, duplicate warning test |
| 27 | | Final QA: full regression, extension + main app integration, all tests passing, performance check |

---

## Risks & Unknowns

| Risk | Mitigation |
|---|---|
| Figma sidebar mobile behavior unclear | Confirm from design before Step 4 |
| Bookmark detail: modal vs route | Confirm from design before Step 9 |
| Tag filter OR vs AND | Assumed OR — verify against brief intent |
| Metadata fetch fails for some URLs | Graceful fallback — empty fields, user fills manually |
| Cheerio cannot parse JS-rendered pages | Acceptable — most sites have static meta tags |
| Cloudinary free tier limits | 25GB storage/bandwidth — sufficient for this scope |
| Pinned + archived conflict | Decision: archiving a pinned bookmark silently unpins it |
| Extension auth flow complexity | Treated as separate sub-project in Phase 3 |
| localStorage 5MB limit in Phase 1 | Store favicon URLs not base64 blobs — text data well within limits |
| Playwright tests in CI | Configure with Vercel preview URLs for E2E against deployed builds |
