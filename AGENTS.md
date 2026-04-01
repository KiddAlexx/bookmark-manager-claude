<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# CLAUDE.md — Bookmark Manager App

## Purpose

This file defines the implementation rules for building the **Bookmark Manager App** in a
controlled, step-by-step workflow. Read this file before taking any action on this project.

This is a planning-driven, full-scope build. Implementation must follow `SPEC.md` and must
cover the original Frontend Mentor challenge requirements plus all agreed additions. This is
not a reduced demo build.

---

## Session Start Protocol

At the start of each session:

1. Read `CLAUDE.md`, `SPEC.md`, and `/experiment/summary.md`
2. Interpret the task I have asked you to do in this session
3. Briefly confirm the scope in your own words
4. List any files you expect to create or modify
5. Stop and wait for explicit approval before writing code, creating files, or running commands

Do not assume the next step unless I have asked for it.
Do not automatically enter plan execution mode.
Keep this pre-implementation summary brief and focused.

---

## Version Philosophy

Do not automatically use the newest major release just because it is newest.

Use this approach instead:

1. Prefer **modern but settled** versions
2. Prefer a mature version line with strong ecosystem compatibility
3. Use current compatible stable releases within that line
4. Only adopt the newest major version if there is a clear project-specific reason

If a version decision changes during implementation, the reason must be documented in
`/experiment/decisions.md`.

### Chosen baseline

| Technology             | Version                           |
| ---------------------- | --------------------------------- |
| Next.js                | 15.x                              |
| React                  | 19.x                              |
| Tailwind CSS           | 4.1                               |
| TypeScript             | 5.x                               |
| All other dependencies | latest stable within chosen major |

---

## Stack Constraints

### Required stack

| Layer                  | Technology                     | Version           |
| ---------------------- | ------------------------------ | ----------------- |
| Framework              | Next.js                        | 15.x              |
| Language               | TypeScript                     | 5.x               |
| UI                     | React                          | 19.x              |
| Styling                | Tailwind CSS                   | 4.1               |
| State                  | Zustand                        | latest stable     |
| Forms                  | React Hook Form                | latest stable     |
| Validation             | Zod                            | latest stable     |
| Database               | Neon (Postgres)                | latest stable     |
| ORM                    | Drizzle ORM                    | latest stable     |
| Auth                   | Auth.js (NextAuth)             | v5.x              |
| Image hosting          | Cloudinary                     | latest stable SDK |
| HTML parsing           | Cheerio                        | latest stable     |
| Extension              | WXT (Manifest V3)              | latest stable     |
| Icons                  | Lucide React                   | latest stable     |
| Fonts                  | next/font (Google Fonts)       | built-in          |
| Unit/integration tests | Vitest + React Testing Library | latest stable     |
| E2E tests              | Playwright                     | latest stable     |
| Deployment             | Vercel                         | latest            |

### Explicitly forbidden

- No CSS-in-JS (styled-components, Emotion, vanilla-extract, etc.)
- No external UI component libraries (MUI, Chakra, shadcn, Radix standalone, etc.) — all UI built from scratch to match Figma
- No Redux, MobX, Jotai, Context + useReducer, or any state library other than Zustand
- No Prisma — Drizzle ORM only
- No Supabase — Neon + Drizzle + Auth.js only
- No inline styles — Tailwind utility classes only
- No `any` TypeScript types anywhere in `/src`
- No separate backend services unless required by the spec
- No extra animation libraries unless the Figma design explicitly requires them
- No large client-side libraries for problems already solved by the chosen stack

### Dependency policy

Only add a dependency when at least one of the following is true:

- it satisfies a clear requirement from `SPEC.md`
- it significantly reduces implementation risk
- it materially improves accessibility, validation, security, or maintainability

Every new dependency must be logged in `/experiment/decisions.md` before installation.

---

## Architecture Rules

These are non-negotiable constraints on how the system is structured:

1. The **web app backend and domain layer is the source of truth** for all business logic
2. The browser extension must delegate to the backend — it must not reimplement bookmark rules locally
3. Duplicate detection must be enforced server-side — client-side check is UX only
4. Authentication must protect all bookmark write operations and user-scoped reads
5. Metadata fetching must be handled server-side (bypasses CORS, keeps keys server-only)
6. Cloudinary uploads must use secure, server-mediated patterns — never direct browser-to-Cloudinary with exposed keys
7. Bookmark data must persist across devices using the database (Phase 2+), not client storage
8. The extension must not bypass backend auth or validation rules
9. URL normalization logic must be centralized in `/src/lib/utils/url.ts` and shared — never duplicated across surfaces
10. All write inputs must be validated server-side even if also validated client-side

---

## Coding Guidelines

### TypeScript

- All files must be `.ts` or `.tsx` — no `.js` files in `/src`
- No `any` types — use proper interfaces defined in `/src/types/index.ts`
- All component props must have explicit typed interfaces
- Zod schemas are the source of truth for runtime validation — derive TypeScript types with `z.infer<typeof schema>`
- Drizzle schema (Phase 2) is the source of truth for DB types — use `drizzle-zod` to generate Zod schemas from it

### Components

- One component per file
- Named exports for all components; default export only for Next.js page files
- File names: `PascalCase` for components, `camelCase` for utilities, hooks, and stores
- Keep components under ~150 lines — split when they grow beyond this
- No business logic in components — extract to hooks or the service layer
- No direct localStorage or DB calls from components — always go through the store or service layer
- Prefer semantic HTML before reaching for ARIA

### State (Zustand)

- All global state lives in Zustand stores under `/src/store/`
- Two stores: `bookmarkStore.ts` and `themeStore.ts`
- Derived/computed data (filtered lists, sorted lists) must use `useMemo` — never stored in state
- Stores call the service layer (`/src/lib/services/`) only — never call localStorage or DB directly

### Service Layer

- All data access goes through `/src/lib/services/bookmarks.ts` and `/src/lib/services/user.ts`
- Phase 1: service functions use localStorage
- Phase 2: service functions use Drizzle ORM
- The rest of the app must not change when migrating between phases
- This abstraction is mandatory — do not bypass it for any reason

### Forms

- All forms use React Hook Form
- All validation schemas defined in Zod
- Connect RHF to Zod via `@hookform/resolvers/zod`
- Validation errors displayed inline per field
- Form submission must show loading state and handle errors gracefully
- Never use uncontrolled inputs outside of RHF

### Styling

- Tailwind CSS v4 — CSS-first configuration via `@theme` in `globals.css`
- Dark mode via `class` strategy on `<html>` element
- All color tokens defined as CSS custom properties in `globals.css`
- Design tokens must match Figma exactly (colors, spacing, border-radius, typography)
- No magic numbers — always use design token values or Tailwind scale values

### Accessibility

- All interactive elements must be keyboard accessible
- Focus-visible styles must be present on all interactive elements
- Never use `outline: none` without providing a visible replacement
- All icon-only buttons must have `aria-label`
- All form inputs must have associated `<label>` elements
- Modals must implement: focus trap, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Use `aria-live` regions for dynamic content: search results, copy feedback, validation errors
- Use semantic HTML: `<nav>`, `<main>`, `<aside>`, `<header>`, `<button>`, `<form>`, `<label>`
- Respect `prefers-reduced-motion` for all animations and transitions
- Accessibility is a required quality bar, not a polish-only extra

### Error and State Handling

- Handle loading, success, empty, and error states explicitly for every async operation
- Never show a blank screen — always show a meaningful empty or error state
- Metadata fetch failures must degrade gracefully and never block the save flow
- Document non-obvious tradeoffs and assumptions in `/experiment/decisions.md`

---

## Full-Scope Feature Requirement

The implementation must cover 100% of the required features below. Nothing may be skipped
because it seems secondary or "nice to have."

### Core bookmark manager (Phase 1)

- [ ] Add bookmarks (title, URL, description, tags)
- [ ] View all bookmarks
- [ ] View full bookmark details (favicon, title, URL, description, tags, view count, last visited, date added)
- [ ] Real-time search by title
- [ ] Multi-select tag filter (OR logic) with reset
- [ ] Sort by Recently added / Recently visited / Most visited
- [ ] Pin / unpin bookmarks with pinned section at top
- [ ] Archive bookmarks / view archive / unarchive
- [ ] Edit bookmarks
- [ ] Delete bookmarks with confirmation
- [ ] Copy URL to clipboard with "Copied!" feedback
- [ ] Visit URL in new tab (increments view count + sets last visited)
- [ ] Light / dark theme toggle with persistence
- [ ] Fully responsive layout (mobile, tablet, desktop)
- [ ] All hover and focus states present on every interactive element
- [ ] Full accessibility implementation

### Expanded features (Phase 2)

- [ ] User authentication (OAuth + email/password)
- [ ] Cross-device bookmark persistence via Neon
- [ ] User avatars via Cloudinary
- [ ] Automatic metadata fetch on URL entry (title, description, favicon)
- [ ] Manual favicon upload fallback
- [ ] Duplicate URL detection — client warning + server enforcement
- [ ] Cloudinary image hosting for favicons and avatars
- [ ] User profile page

### Phase 3 features

- [ ] Keyboard shortcuts with help modal
- [ ] Browser extension (WXT) — save current page, auth, duplicate warning

---

## Scope Exclusions

Do not build the following unless the specification is intentionally changed:

- Team or shared workspaces
- Social or community features
- AI-generated tagging or summaries
- Bookmark sharing or public profiles
- Browser history ingestion
- Import / export systems
- Native mobile apps
- Analytics beyond required bookmark view count and last visited metadata

Optional ideas may be noted in `experiment/summary.md` under "Future Enhancements" only.
They must not interrupt the core build sequence.

---

## Testing Requirements

Testing is a required part of the implementation, not optional polish.

### Unit Tests — Vitest

Must cover all shared logic and utilities:

| Area                            | Required Coverage                                                |
| ------------------------------- | ---------------------------------------------------------------- |
| URL normalization               | All rules, edge cases, trailing slashes, www, protocol stripping |
| Duplicate detection             | Match, no match, case differences, protocol differences          |
| Search / filter / sort logic    | All sort modes, OR tag logic, composition, edge cases            |
| Archive / pin state transitions | All transitions including pin + archive conflict                 |
| Metadata extraction helpers     | Title/description/favicon priority order, fallback behavior      |

### Component Tests — Vitest + React Testing Library

Must cover core interactive components:

| Component            | Required Coverage                                                |
| -------------------- | ---------------------------------------------------------------- |
| BookmarkCard         | Renders all fields, action buttons trigger correct callbacks     |
| AddEditBookmarkForm  | Validation errors shown, URL blur triggers fetch, tag add/remove |
| Tag filter (Sidebar) | Single select, multi-select, reset clears all                    |
| SortControl          | Each option dispatches correct sort action                       |
| Modal                | Focus trap present, ESC closes, aria attributes correct          |
| ThemeToggle          | Toggles class on html, persists to localStorage                  |

### End-to-End Tests — Playwright

Must cover critical user flows:

| Flow                | Required Scope                                           |
| ------------------- | -------------------------------------------------------- |
| Add bookmark        | Fill form → submit → appears in list                     |
| Edit bookmark       | Open existing → change title → save → list updated       |
| Archive bookmark    | Archive → gone from main → present in archive            |
| Search              | Type query → list filters → clear → list restored        |
| Tag filter          | Select tag → list filters → reset → list restored        |
| Duplicate detection | Add URL → add same URL → warning shown                   |
| Theme toggle        | Toggle → class applied → persists on reload              |
| Auth flow (Phase 2) | Login → protected route accessible → logout → redirected |

### Testing Rules

- Test files live alongside source files: `ComponentName.test.tsx`, `util.test.ts`
- E2E tests live in `/e2e/`
- URL normalization and duplicate detection unit tests must pass before Phase 2 begins
- Core component tests must pass before Phase 2 begins
- E2E tests added incrementally from Step 6 onward
- No step is complete if it causes previously passing tests to fail

---

## Step-by-Step Workflow Rules

Implementation must happen step by step. These rules are mandatory.

### Rule 1 — One Step at a Time

NEVER complete more than one step per session.
NEVER continue to the next step without explicit user approval.
Do NOT automatically enter plan execution mode.
Do NOT chain steps together even if they seem small or related.

### Rule 2 — Pre-Code Plan Confirmation

Before writing any code for a step:

1. State exactly what you plan to implement
2. List every file you intend to create or modify
3. Flag any decisions or ambiguities you have identified
4. STOP and wait for the user to confirm before proceeding

### Rule 3 — Stop After Each Step

After completing a step:

1. Output a visible summary in the chat:
   - What was implemented
   - Files created or modified
   - Key decisions made
   - Assumptions made
   - Known issues or limitations
   - Definition of Done checklist (pass/fail per item — see Definition of Done section)
2. Write the step log in `/experiment/steps/step-XX.md`
3. Update `/experiment/summary.md`
4. Add any decisions to `/experiment/decisions.md`
5. Update `/experiment/metrics.csv`
6. Stage all changes and commit with a conventional commit message. Do not push. Keep the subject under 72 characters.
7. Ask: "Step X is complete. Shall I proceed to Step X+1?"
8. STOP — do not begin the next step until the user replies with approval

### Rule 4 — No Skipping Steps

Steps must be completed in order. Do not skip a step or silently merge two steps into one
session, even if they seem small.

### Rule 5 — Spec is the Source of Truth

Any ambiguity must be resolved by consulting `SPEC.md` first. If `SPEC.md` does not answer
the question, log a decision in `/experiment/decisions.md` before proceeding.

### Rule 6 — No Scope Creep

Do not add features, components, or behaviors not in `SPEC.md`. New ideas go into
`experiment/summary.md` under "Future Enhancements" only.

### Rule 7 — No Premature Optimization

Do not refactor or optimize during implementation steps. Refactoring is reserved for the
Polish step (Step 12) or a dedicated refactor step if explicitly added to the plan.

### Rule 8 — Phase Boundaries

Do not implement Phase 2 features during Phase 1, or Phase 3 features during Phase 2.
The only exception is the service abstraction layer, which must be set up in Step 2 (Phase 1)
to enable the clean migration later.

---

## Logging Requirements

All development activity must be logged in the `/experiment` folder.

### `/experiment/decisions.md`

Log every architectural, stack, or design decision.

Record decisions for:

- Stack and version choices
- Auth strategy
- Schema and relationship design
- URL normalization rules
- Duplicate detection behavior
- Metadata fallback behavior
- Favicon and cloud storage boundaries
- Extension authentication approach
- Any meaningful Figma interpretation choices

Format:

```markdown
## [YYYY-MM-DD] Decision: <short title>

**Context**: Why this decision was needed
**Options considered**: List of alternatives
**Decision**: What was chosen
**Rationale**: Why
**Consequences**: Known tradeoffs or follow-up actions
```

### `/experiment/prompts.md`

Log every prompt used to generate or modify code.

Format:

```markdown
## Step X — <step title>

**Prompt**:
<full prompt text>

**Notes**:
<observations about what worked or didn't>
```

### `/experiment/metrics.csv`

Track quantitative progress per step.

Columns:

```
step,date,surface,step_name,status,time_spent_minutes,files_created,files_modified,tests_added,issues_found,issues_fixed,notes
```

Surface values: `web`, `backend`, `extension`, `shared`, `tests`

### `/experiment/summary.md`

Maintain a running project status document. Update after every step.

Must always show:

- Current project status
- Completed steps
- Blockers or open questions
- Next planned step
- Notable assumption changes
- Future enhancements (out-of-scope ideas)

### `/experiment/steps/step-XX.md`

Written after completing each step.

```markdown
## Step X — <title>

**Goal**: (copied from SPEC.md)
**Surface**: web | backend | extension | shared | tests
**Completed**: [date]

### What Was Built

<list of files created or modified>

### Tests Added or Updated

<list of test files and what they cover>

### Deviations from Spec

<differences from SPEC.md and why>

### Issues Encountered

<bugs, blockers, unexpected complexity>

### Handoff Notes

<anything the next step needs to be aware of>
```

---

## Definition of Done

A **step** is complete only when ALL of the following are true:

1. TypeScript compiles with zero errors (`tsc --noEmit`)
2. No ESLint errors or warnings
3. UI matches the Figma design at all relevant breakpoints for this step
4. No console errors in the browser
5. All interactive elements in scope have correct hover and focus states
6. All tests added for this step are passing
7. No previously passing tests are broken
8. `/experiment/steps/step-XX.md` is written
9. `/experiment/summary.md` is updated
10. `/experiment/metrics.csv` is updated

A **phase** is complete when:

- All steps in that phase meet the Definition of Done
- All phase feature checkboxes in the Full-Scope Feature Requirement section are ticked
- The full test suite for that phase passes

---

## Review Checklist

Ask these questions before closing any step:

1. Does this step match the scoped plan in `SPEC.md`?
2. Are required states covered — not just the happy path?
3. Did this step introduce any out-of-scope features?
4. Is the implementation still appropriately simple for this project?
5. Are backend and extension rules consistent with the web app domain layer?
6. Are accessibility requirements met for everything built in this step?
7. Was the work logged properly in `/experiment`?
8. Should any new decision be documented before moving on?
9. Do all tests pass with no regressions?

---

## Final Instruction

Build this project as a real, reviewable product implementation:

- complete in scope
- incremental in execution
- documented at every step
- accessible throughout
- tested at all critical layers
- not over-engineered

When in doubt, choose the approach that best preserves **clarity, consistency, security, and
step-by-step control**.
