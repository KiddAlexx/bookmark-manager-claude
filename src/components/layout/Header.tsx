"use client"

import { Search, Plus, Menu } from "lucide-react"

interface HeaderProps {
  onAddBookmark: () => void
  onMenuOpen: () => void
}

export function Header({ onAddBookmark, onMenuOpen }: HeaderProps) {
  return (
    <header className="flex items-center gap-3 bg-neutral-light-0 px-4 py-3 dark:bg-neutral-dark-500 sm:px-6">
      {/* Hamburger — visible on mobile/tablet, hidden on desktop */}
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-light-800 transition-colors hover:bg-neutral-light-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-neutral-dark-100 dark:hover:bg-neutral-dark-400 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Search */}
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-light-500 dark:text-neutral-dark-100"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search by title..."
          aria-label="Search bookmarks by title"
          className={[
            "w-full rounded-lg py-2 pl-9 pr-3 text-sm",
            "bg-neutral-light-100 text-neutral-light-900 placeholder:text-neutral-light-500",
            "dark:bg-neutral-dark-400 dark:text-neutral-dark-0 dark:placeholder:text-neutral-dark-100",
            "border border-transparent focus:border-teal-700 focus:outline-none",
          ].join(" ")}
        />
      </div>

      {/* Add Bookmark — full label on sm+, icon-only on mobile */}
      <button
        type="button"
        onClick={onAddBookmark}
        aria-label="Add bookmark"
        className={[
          "flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-neutral-dark-0",
          "hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700",
          "transition-colors",
        ].join(" ")}
      >
        <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Add Bookmark</span>
      </button>

      {/* Avatar placeholder */}
      <div
        aria-hidden="true"
        className="h-8 w-8 shrink-0 rounded-full bg-neutral-light-400 dark:bg-neutral-dark-300"
      />
    </header>
  )
}
