## Step 10 — Theme Toggle

**Goal**: Light/dark/system theme switcher wired to next-themes, persisted via localStorage.
**Surface**: web
**Completed**: 2026-04-02

### What Was Built

| File | Change |
|------|--------|
| `src/components/ui/ThemeToggle.tsx` | Created |
| `src/components/layout/Header.tsx` | Updated — ThemeToggle added |

**ThemeToggle.tsx**
- Cycles through `light → dark → system` on each click
- Icon: Sun (light), Moon (dark), Monitor (system)
- `aria-label` describes the *next* action ("Switch to dark mode" when currently light)
- Hydration-safe: renders a same-size placeholder div until mounted, preventing SSR mismatch
- Uses `useTheme` from `next-themes` directly (persistence to localStorage handled by next-themes)

**Header.tsx**
- `ThemeToggle` imported and rendered between the Add Bookmark button and the avatar placeholder
- Avatar placeholder retained for Phase 2

### Tests Added or Updated

None added this step. 17 existing tests still passing.

### Deviations from Spec

None.

### Issues Encountered

None.

### Handoff Notes

- Theme persistence is fully handled by next-themes (writes to localStorage under key `theme`).
- The avatar placeholder div will be replaced with a real `<Image>` in Phase 2 (Cloudinary).
