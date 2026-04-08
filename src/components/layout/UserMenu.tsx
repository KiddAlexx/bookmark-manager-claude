"use client"

import { useState, useRef, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { LogOut } from "lucide-react"

export function UserMenu() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  const name = session?.user?.name ?? "User"
  const email = session?.user?.email ?? ""
  const image = session?.user?.image
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="true"
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-teal-700 text-xs font-bold text-white ring-2 ring-transparent transition-all hover:ring-teal-700 focus-visible:outline-none focus-visible:ring-teal-700"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-line bg-surface py-1 shadow-lg"
        >
          {/* User info */}
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-medium text-ink">{name}</p>
            <p className="truncate text-xs text-ink-muted">{email}</p>
          </div>

          {/* Sign out */}
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface-alt focus-visible:bg-surface-alt focus-visible:outline-none"
          >
            <LogOut className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
