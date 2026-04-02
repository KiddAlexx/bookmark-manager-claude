"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { MobileSidebarDrawer } from "@/components/layout/MobileSidebarDrawer"
import { BookmarkList } from "@/components/bookmark/BookmarkList"
import { EmptyState } from "@/components/bookmark/EmptyState"
import { TagFilter } from "@/components/bookmark/TagFilter"
import { SortControl, type SortMode } from "@/components/bookmark/SortControl"
import { useBookmarkStore } from "@/store/bookmarkStore"

export default function Archived() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortMode>("recently-added")
  const bookmarks = useBookmarkStore((s) => s.bookmarks)

  const unarchive = useBookmarkStore((s) => s.unarchive)
  const remove = useBookmarkStore((s) => s.remove)
  const recordVisit = useBookmarkStore((s) => s.recordVisit)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    bookmarks.forEach((b) => {
      if (b.isArchived) b.tags.forEach((t) => tagSet.add(t))
    })
    return Array.from(tagSet).sort()
  }, [bookmarks])

  const filtered = useMemo(() => {
    const lc = query.toLowerCase()
    return bookmarks
      .filter((b) => {
        if (!b.isArchived) return false
        if (!b.title.toLowerCase().includes(lc)) return false
        if (selectedTags.length > 0 && !selectedTags.some((t) => b.tags.includes(t))) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === "recently-added") {
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        }
        if (sortBy === "most-visited") {
          return b.viewCount - a.viewCount
        }
        if (!a.lastVisited && !b.lastVisited) return 0
        if (!a.lastVisited) return 1
        if (!b.lastVisited) return -1
        return new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
      })
  }, [bookmarks, query, selectedTags, sortBy])

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  const tagFilter = (
    <TagFilter
      tags={allTags}
      selected={selectedTags}
      onToggle={toggleTag}
      onReset={() => setSelectedTags([])}
    />
  )

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <div className="hidden lg:flex">
        <Sidebar tagFilter={tagFilter} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onAddBookmark={() => {}}
          onMenuOpen={() => setDrawerOpen(true)}
          searchQuery={query}
          onSearch={setQuery}
        />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          aria-label="Archived bookmarks"
        >
          {filtered.length === 0 ? (
            <EmptyState message="No archived bookmarks." />
          ) : (
            <BookmarkList
              bookmarks={filtered}
              title="Archived bookmarks"
              onEdit={() => {}}
              onDelete={remove}
              onPin={() => {}}
              onArchive={() => {}}
              onUnarchive={unarchive}
              onVisit={recordVisit}
              sortControl={
                <SortControl value={sortBy} onChange={setSortBy} />
              }
            />
          )}
        </main>
      </div>

      <MobileSidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
