## Step 15 — Auth.js v5: Sign-in, Sign-up, Session, Route Guards

**Goal**: Implement full authentication — Auth.js v5 with Google OAuth + Credentials providers, sign-in/sign-up pages, database sessions, and middleware route guards.
**Surface**: backend, web
**Completed**: 2026-04-08

---

### What Was Built

**Created:**
- `src/auth.ts` — NextAuth v5 config; `DrizzleAdapter(db)`; Google + Credentials providers; database session strategy; session callback injects `user.id`; custom `pages.signIn`
- `middleware.ts` — `auth` wrapper protecting all routes; unauthenticated → `/sign-in?callbackUrl=...`; authenticated on auth pages → `/`; matcher excludes static assets
- `src/app/actions/auth.ts` — four server actions: `signInWithCredentials`, `signInWithGoogle`, `signOutAction`, `registerUser` (Zod validation, bcrypt cost 12, email uniqueness check, immediate sign-in after register)
- `src/app/sign-in/page.tsx` — client component; `useActionState` + `useFormStatus`; credentials form + Google OAuth button with inline SVG; footer links to sign-up and reset-password
- `src/app/sign-up/page.tsx` — client component; name/email/password/confirmPassword fields; inline error display

**Modified:**
- `src/db/schema.ts` — added `passwordHash` column to `users`; fixed `accounts` OAuth token property names to snake_case (`refresh_token`, `access_token`, `expires_at`, `token_type`, `id_token`, `session_state`); migrated all `pgTable` constraint syntax from deprecated object form to array form `(table) => [...]`
- `src/app/layout.tsx` — made async; calls `auth()` server-side; passes `session` to `<Providers>`
- `src/components/Providers.tsx` — accepts `session: Session | null` prop; wraps children in `<SessionProvider session={session}>`

---

### Tests Added or Updated

No new test files. All 60 existing Vitest tests continue to pass (`npx vitest run`). TypeScript compiles with zero errors (`npx tsc --noEmit`).

---

### Deviations from Spec

- GitHub OAuth skipped per user decision; Google + Credentials only for now.
- `src/app/sign-in/page.tsx` includes a "Forgot password?" link to `/reset-password` — route is not yet built (future step).

---

### Issues Encountered

1. **`AUTH_SECRET` / `AUTH_GOOGLE_SECRET` mix-up in `.env.local`**: User accidentally placed the Google client secret value in `AUTH_SECRET`. Fixed by generating a proper random `AUTH_SECRET` and updating `.env.local` directly.
2. **Deprecated `pgTable` constraint object syntax**: IDE warnings required migrating all three constrained tables from `(table) => ({ name: constraint })` to `(table) => [constraint]` array form.
3. **`parsed.error.errors` TS error**: Zod uses `.issues` not `.errors`. Fixed both occurrences in `src/app/actions/auth.ts`.
4. **`@auth/drizzle-adapter` snake_case requirement**: The adapter expects `refresh_token`, `access_token`, etc. as property names — not camelCase. Fixed in `src/db/schema.ts`.

---

### Handoff Notes

- A new Drizzle migration must be applied before the app runs: `npx drizzle-kit migrate` (adds `passwordHash` column and any schema changes since Step 14 migration).
- Step 16 (service layer migration to Drizzle) will need to handle the timestamp duality: DB stores `Date` objects (`{ mode: "date" }`), app types use ISO strings — serialization belongs in the service layer.
- The `/reset-password` route referenced on the sign-in page is not yet implemented.
