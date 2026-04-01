---
name: auth-js
description: Implement authentication with Auth.js v5. Use when working on auth configuration, session handling, protected routes, or OAuth setup.
---

# Auth.js v5 (NextAuth)

Auth.js v5 is a significant rewrite from v4. It is built specifically for Next.js App Router
with first-class support for server components, middleware-based route protection, and
server actions.

## Core Concepts

- **Session** is available in server components, API routes, middleware, and client components
- **Route protection** is handled in `middleware.ts` — not in individual page components
- **Mutations** (sign in, sign out) use server actions or the built-in Auth.js handlers
- **Drizzle adapter** syncs users and sessions to the database automatically

## Project Setup

```ts
// src/auth.ts  ← single source of truth for auth config
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      authorize: async (credentials) => {
        // validate credentials, return user or null
      },
    }),
  ],
  session: { strategy: 'database' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
})
```

```ts
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

## Reading the Session

### In Server Components and API Routes
```ts
import { auth } from '@/auth'

export default async function Page() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  return <div>Hello {session.user.name}</div>
}
```

### In Client Components
```ts
import { useSession } from 'next-auth/react'

function UserAvatar() {
  const { data: session } = useSession()
  if (!session?.user) return null
  return <img src={session.user.image ?? ''} alt={session.user.name ?? ''} />
}
```

Wrap the root layout with `<SessionProvider>` to enable `useSession` in client components:

```ts
// src/app/layout.tsx
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

export default async function RootLayout({ children }) {
  const session = await auth()
  return (
    <html>
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

## Route Protection via Middleware

Protect all authenticated routes in a single place:

```ts
// middleware.ts  ← project root
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth')

  if (!isLoggedIn && !isAuthPage && !isApiAuth) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

## Sign In / Sign Out (Server Actions)

```ts
// In a server action or form action
import { signIn, signOut } from '@/auth'

async function handleSignIn() {
  'use server'
  await signIn('github', { redirectTo: '/' })
}

async function handleSignOut() {
  'use server'
  await signOut({ redirectTo: '/auth/login' })
}
```

## Getting userId in API Routes and Service Layer

Always get the userId from the session — never from request body or query params:

```ts
// src/app/api/bookmarks/route.ts
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const bookmarks = await bookmarkService.getAll(session.user.id)
  return Response.json(bookmarks)
}
```

## Drizzle Adapter Schema Requirements

The Drizzle adapter requires specific tables. Add these to `schema.ts`:

```ts
import { AdapterAccountType } from 'next-auth/adapters'

export const accounts = pgTable('accounts', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccountType>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
})

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})
```

## Environment Variables

```bash
AUTH_SECRET=                  # Required — random string, used to sign tokens
AUTH_GITHUB_ID=               # GitHub OAuth app client ID
AUTH_GITHUB_SECRET=           # GitHub OAuth app client secret
AUTH_GOOGLE_ID=               # Google OAuth client ID
AUTH_GOOGLE_SECRET=           # Google OAuth client secret
```

`AUTH_SECRET` can be generated with: `npx auth secret`

## Rules for This Project

- `auth()` is the only way to get the current user — never trust client-supplied user IDs
- Every API route that touches bookmark data must call `auth()` and return 401 if no session
- Use database sessions (`strategy: 'database'`) not JWT — more secure, revocable
- Never expose `AUTH_SECRET` or OAuth secrets in client code or logs
- The session `user.id` must match the `userId` in every database query
