"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Bookmark } from "lucide-react"
import { registerUser } from "@/app/actions/auth"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
    >
      {pending ? "Creating account…" : "Sign up"}
    </button>
  )
}

export default function SignUpPage() {
  const [state, action] = useActionState(registerUser, undefined)

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
        <h1 className="text-xl font-bold text-ink">Create your account</h1>
        <p className="mt-1 mb-6 text-sm text-ink-sub">
          Get started — it only takes a moment.
        </p>

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-ink">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-teal-700 focus:outline-none"
            />
          </div>

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
              autoComplete="new-password"
              required
              minLength={8}
              className="rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-ink">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
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

        <p className="mt-6 text-center text-xs text-ink-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-ink underline-offset-2 hover:underline focus-visible:outline-none focus-visible:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
