"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Archive, Bookmark } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/archived", label: "Archived", icon: Archive },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col bg-neutral-light-0 dark:bg-neutral-dark-500">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-700">
          <Bookmark className="h-4 w-4 text-neutral-dark-0" aria-hidden="true" />
        </div>
        <span className="text-sm font-bold text-neutral-light-900 dark:text-neutral-dark-0">
          Bookmark Manager
        </span>
      </div>

      {/* Nav */}
      <nav aria-label="Main navigation">
        <ul className="space-y-1 px-3">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700",
                    isActive
                      ? "bg-neutral-light-100 text-neutral-light-900 dark:bg-neutral-dark-400 dark:text-neutral-dark-0"
                      : "text-neutral-light-800 hover:bg-neutral-light-100 hover:text-neutral-light-900 dark:text-neutral-dark-100 dark:hover:bg-neutral-dark-400 dark:hover:text-neutral-dark-0",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Tags */}
      <div className="mt-6 flex-1 overflow-y-auto px-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-light-500 dark:text-neutral-dark-100">
          Tags
        </p>
        {/* Tag filter list — wired up in Step 6 */}
        <ul aria-label="Filter by tag" className="space-y-1" />
      </div>
    </aside>
  )
}
