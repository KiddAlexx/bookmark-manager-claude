import { Pin } from "lucide-react"
import type { Bookmark } from "@/types"
import { BookmarkCard } from "./BookmarkCard"

interface PinnedSectionProps {
  bookmarks: Bookmark[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
  onArchive: (id: string) => void
  onVisit: (id: string) => void
}

export function PinnedSection({
  bookmarks, onEdit, onDelete, onPin, onArchive, onVisit,
}: PinnedSectionProps) {
  if (bookmarks.length === 0) return null

  return (
    <section aria-label="Pinned bookmarks" className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <Pin className="h-4 w-4 text-ink-muted" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wider">
          Pinned
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={onEdit}
            onDelete={onDelete}
            onPin={onPin}
            onArchive={onArchive}
            onUnarchive={() => {}}
            onVisit={onVisit}
          />
        ))}
      </div>
    </section>
  )
}
