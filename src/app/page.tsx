"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { MobileSidebarDrawer } from "@/components/layout/MobileSidebarDrawer"
import { PinnedSection } from "@/components/bookmark/PinnedSection"
import { BookmarkList } from "@/components/bookmark/BookmarkList"
import { EmptyState } from "@/components/bookmark/EmptyState"
import { TagFilter } from "@/components/bookmark/TagFilter"
import { SortControl } from "@/components/bookmark/SortControl"
import { filterAndSortBookmarks, type SortMode } from "@/lib/utils/filter"
import { AddEditBookmarkForm } from "@/components/bookmark/AddEditBookmarkForm"
import { DeleteConfirmModal } from "@/components/bookmark/DeleteConfirmModal"
import { Modal } from "@/components/ui/Modal"
import { Check, Pin, PinOff, Archive, Trash2 } from "lucide-react"
import { useBookmarkStore } from "@/store/bookmarkStore"
import { useToastStore } from "@/store/toastStore"
import type { AddBookmarkInput, Bookmark } from "@/types"

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortMode>("recently-added")

  // Add/Edit modal: null = closed, undefined = add mode, Bookmark = edit mode
  const [modalBookmark, setModalBookmark] = useState<Bookmark | null | undefined>(null)
  const modalOpen = modalBookmark !== null

  // Delete confirm: null = closed, Bookmark = pending delete
  const [deleteTarget, setDeleteTarget] = useState<Bookmark | null>(null)

  const bookmarks = useBookmarkStore((s) => s.bookmarks)
  const add = useBookmarkStore((s) => s.add)
  const update = useBookmarkStore((s) => s.update)
  const togglePin = useBookmarkStore((s) => s.togglePin)
  const archive = useBookmarkStore((s) => s.archive)
  const unarchive = useBookmarkStore((s) => s.unarchive)
  const remove = useBookmarkStore((s) => s.remove)
  const recordVisit = useBookmarkStore((s) => s.recordVisit)
  const addToast = useToastStore((s) => s.addToast)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    bookmarks.forEach((b) => {
      if (!b.isArchived) b.tags.forEach((t) => tagSet.add(t))
    })
    return Array.from(tagSet).sort()
  }, [bookmarks])

  const { pinned, unpinned } = useMemo(() => {
    const active = bookmarks.filter((b) => !b.isArchived)
    const sorted = filterAndSortBookmarks(active, { query, selectedTags, sortBy })
    return {
      pinned: sorted.filter((b) => b.isPinned),
      unpinned: sorted.filter((b) => !b.isPinned),
    }
  }, [bookmarks, query, selectedTags, sortBy])

  const isEmpty = pinned.length === 0 && unpinned.length === 0

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  function openAdd() {
    setModalBookmark(undefined)
  }

  function openEdit(id: string) {
    const bm = bookmarks.find((b) => b.id === id)
    if (bm) setModalBookmark(bm)
  }

  function closeModal() {
    setModalBookmark(null)
  }

  async function handleFormSubmit(data: AddBookmarkInput) {
    if (modalBookmark) {
      update(modalBookmark.id, data)
      addToast("Changes saved.", Check)
    } else {
      add(data)
      addToast("Bookmark added successfully.", Check)
    }
    closeModal()
  }

  function handlePin(id: string) {
    const wasPinned = bookmarks.find((b) => b.id === id)?.isPinned ?? false
    togglePin(id)
    addToast(wasPinned ? "Bookmark unpinned." : "Bookmark pinned to top.", wasPinned ? PinOff : Pin)
  }

  function handleArchive(id: string) {
    archive(id)
    addToast("Bookmark archived.", Archive)
  }

  function requestDelete(id: string) {
    const bm = bookmarks.find((b) => b.id === id)
    if (bm) setDeleteTarget(bm)
  }

  function confirmDelete() {
    if (deleteTarget) {
      remove(deleteTarget.id)
      addToast("Bookmark deleted.", Trash2)
    }
    setDeleteTarget(null)
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
          onAddBookmark={openAdd}
          onMenuOpen={() => setDrawerOpen(true)}
          searchQuery={query}
          onSearch={setQuery}
        />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          aria-label="Bookmarks"
        >
          <p aria-live="polite" aria-atomic="true" className="sr-only">
            {isEmpty
              ? "No bookmarks found."
              : `${pinned.length + unpinned.length} bookmark${pinned.length + unpinned.length === 1 ? "" : "s"} found.`}
          </p>

          {isEmpty ? (
            <EmptyState />
          ) : (
            <>
              <PinnedSection
                bookmarks={pinned}
                onEdit={openEdit}
                onDelete={requestDelete}
                onPin={handlePin}
                onArchive={handleArchive}
                onVisit={recordVisit}
              />
              <BookmarkList
                bookmarks={unpinned}
                onEdit={openEdit}
                onDelete={requestDelete}
                onPin={handlePin}
                onArchive={handleArchive}
                onUnarchive={unarchive}
                onVisit={recordVisit}
                sortControl={
                  <SortControl value={sortBy} onChange={setSortBy} />
                }
              />
            </>
          )}
        </main>
      </div>

      <MobileSidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tagFilter={tagFilter}
      />

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalBookmark ? "Edit bookmark" : "Add bookmark"}
        titleId="bookmark-modal-title"
      >
        <AddEditBookmarkForm
          bookmark={modalBookmark ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <DeleteConfirmModal
        bookmarkTitle={deleteTarget?.title ?? null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
