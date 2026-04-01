"use client"

import { Search, Plus, Menu } from "lucide-react"

interface HeaderProps {
  onAddBookmark: () => void
  onMenuOpen: () => void
  onSearch?: (query: string) => void
  searchQuery?: string
}

export function Header({ onAddBookmark, onMenuOpen, onSearch, searchQuery = "" }: HeaderProps) {
  return (
    <header className="flex items-center gap-3 bg-surface px-4 py-3 sm:px-6">
      {/* Hamburger — visible on mobile/tablet, hidden on desktop */}
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-sub transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Search */}
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search by title..."
          aria-label="Search bookmarks by title"
          value={searchQuery}
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full rounded-lg border border-transparent bg-surface-alt py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-teal-700 focus:outline-none"
        />
      </div>

      {/* Add Bookmark — full label on sm+, icon-only on mobile */}
      <button
        type="button"
        onClick={onAddBookmark}
        aria-label="Add bookmark"
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Add Bookmark</span>
      </button>

      {/* Avatar placeholder */}
      <div
        aria-hidden="true"
        className="h-8 w-8 shrink-0 rounded-full bg-line"
      />
    </header>
  )
}
