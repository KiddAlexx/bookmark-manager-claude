"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Bookmark } from "lucide-react"
import { signInWithCredentials, signInWithGoogle } from "@/app/actions/auth"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
    >
      {pending ? "Signing in…" : "Log in"}
    </button>
  )
}

export default function SignInPage() {
  const [state, action] = useActionState(signInWithCredentials, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-line">

        {/* Logo */}
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700">
            <Bookmark className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-sm font-bold text-ink">Bookmark Manager</span>
        </div>

        {/* Heading */}
        <h1 className="text-xl font-bold text-ink">Log in to your account</h1>
        <p className="mt-1 mb-6 text-sm text-ink-sub">
          Welcome back! Please enter your details.
        </p>

        {/* Credentials form */}
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-teal-700 focus:outline-none"
            />
          </div>

          {state?.error && (
            <p role="alert" className="text-xs text-danger-600">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs text-ink-muted">or continue with</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        {/* Google OAuth */}
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 flex flex-col items-center gap-2 text-xs text-ink-muted">
          <p>
            Forgot password?{" "}
            <Link href="/reset-password" className="font-medium text-ink underline-offset-2 hover:underline focus-visible:outline-none focus-visible:underline">
              Reset it
            </Link>
          </p>
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-ink underline-offset-2 hover:underline focus-visible:outline-none focus-visible:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
