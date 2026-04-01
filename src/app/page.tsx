"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { MobileSidebarDrawer } from "@/components/layout/MobileSidebarDrawer"
import { PinnedSection } from "@/components/bookmark/PinnedSection"
import { BookmarkList } from "@/components/bookmark/BookmarkList"
import { EmptyState } from "@/components/bookmark/EmptyState"
import { useBookmarkStore } from "@/store/bookmarkStore"

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState("")
  const bookmarks = useBookmarkStore((s) => s.bookmarks)

  const togglePin = useBookmarkStore((s) => s.togglePin)
  const archive = useBookmarkStore((s) => s.archive)
  const unarchive = useBookmarkStore((s) => s.unarchive)
  const remove = useBookmarkStore((s) => s.remove)
  const recordVisit = useBookmarkStore((s) => s.recordVisit)

  const { pinned, unpinned } = useMemo(() => {
    const lc = query.toLowerCase()
    const active = bookmarks.filter(
      (b) => !b.isArchived && b.title.toLowerCase().includes(lc),
    )
    return {
      pinned: active.filter((b) => b.isPinned),
      unpinned: active.filter((b) => !b.isPinned),
    }
  }, [bookmarks, query])

  const isEmpty = pinned.length === 0 && unpinned.length === 0

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main area */}
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
          aria-label="Bookmarks"
        >
          {isEmpty ? (
            <EmptyState />
          ) : (
            <>
              <PinnedSection
                bookmarks={pinned}
                onEdit={() => {}}
                onDelete={remove}
                onPin={togglePin}
                onArchive={archive}
                onVisit={recordVisit}
              />
              <BookmarkList
                bookmarks={unpinned}
                onEdit={() => {}}
                onDelete={remove}
                onPin={togglePin}
                onArchive={archive}
                onUnarchive={unarchive}
                onVisit={recordVisit}
              />
            </>
          )}
        </main>
      </div>

      {/* Mobile/tablet sidebar drawer */}
      <MobileSidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
