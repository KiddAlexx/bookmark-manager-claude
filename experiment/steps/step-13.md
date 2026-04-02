## Step 13 — Toast Notifications

**Goal**: Design-matched toast notifications for all bookmark actions, auto-dismissing after 4 seconds with manual dismiss button.
**Surface**: web
**Completed**: 2026-04-02

### What Was Built

| File | Change |
|------|--------|
| `src/store/toastStore.ts` | Created — Zustand store: `toasts[]`, `addToast` (id + 4s auto-dismiss timer), `removeToast` |
| `src/components/ui/Toast.tsx` | Created — `<Toast>` (icon + message + ✕ button) + `<ToastContainer>` (fixed bottom-right overlay) |
| `src/app/layout.tsx` | `<ToastContainer>` added inside `<Providers>` |
| `src/app/page.tsx` | `handleFormSubmit`, `handlePin`, `handleArchive`, `confirmDelete` all fire toasts |
| `src/app/archived/page.tsx` | `handleFormSubmit`, `handleUnarchive`, `confirmDelete` all fire toasts |
| `src/components/bookmark/BookmarkCard.tsx` | `handleCopy` fires toast; removed local `copied` state + `Check` icon swap |

### Sub-tasks

- **13a** — Toast store + components + layout wiring. `addToast` generates a unique id, pushes to state, and schedules `removeToast` via `setTimeout(4000)` — no component involvement needed for auto-dismiss. `ToastContainer` renders only when toasts are present (`role="status" aria-live="polite"`). Each `<Toast>` has `aria-atomic="true"` and a dismiss button.
- **13b** — Wired into all actions. `handlePin` reads `isPinned` before calling `togglePin` to select the correct message ("Bookmark pinned to top." vs "Bookmark unpinned."). `BookmarkCard` copy action replaced local 2-second button-state feedback with the "Link copied to clipboard." toast, consistent with the updated SPEC.

### Toast messages and icons

| Message | Icon |
|---|---|
| "Bookmark added successfully." | `Check` |
| "Changes saved." | `Check` |
| "Link copied to clipboard." | `Copy` |
| "Bookmark pinned to top." | `Pin` |
| "Bookmark unpinned." | `PinOff` |
| "Bookmark archived." | `Archive` |
| "Bookmark restored." | `RotateCcw` |
| "Bookmark deleted." | `Trash2` |

### Tests Added or Updated

None added this step. 60 existing tests still passing.

### Deviations from Spec

- Added "Bookmark unpinned." toast (with `PinOff` icon) for the unpin action — the design only explicitly lists the pin direction, but unpin feedback is required for completeness.

### Issues Encountered

- IDE emitted stale "declared but never read" hints during sequential edits to the same file; all resolved once the wiring edits completed.
- Canonical class warnings fixed: `min-w-[160px]` → `min-w-40` in BookmarkCard, `min-w-[180px]` → `min-w-45` in SortControl (fixed in Step 12a).

### Handoff Notes

- `addToast` can be called from any client component or store action — import `useToastStore` and destructure `addToast`.
- Auto-dismiss timer lives in the store, not the component, so dismissal is reliable even if `<ToastContainer>` temporarily unmounts.
- The `ToastContainer` is mounted once in `layout.tsx` and shared across all pages.
