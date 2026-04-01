import { ArrowUpDown } from "lucide-react"
import type { Bookmark } from "@/types"
import { BookmarkCard } from "./BookmarkCard"

interface BookmarkListProps {
  bookmarks: Bookmark[]
  title?: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
  onVisit: (id: string) => void
  /** Slot for the sort control — wired in Step 6 */
  sortControl?: React.ReactNode
}

export function BookmarkList({
  bookmarks,
  title = "All bookmarks",
  onEdit,
  onDelete,
  onPin,
  onArchive,
  onUnarchive,
  onVisit,
  sortControl,
}: BookmarkListProps) {
  return (
    <section aria-label={title}>
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {sortControl ?? (
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-sub opacity-50"
            aria-label="Sort bookmarks"
          >
            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
            Sort by
          </button>
        )}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={onEdit}
            onDelete={onDelete}
            onPin={onPin}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            onVisit={onVisit}
          />
        ))}
      </div>
    </section>
  )
}
