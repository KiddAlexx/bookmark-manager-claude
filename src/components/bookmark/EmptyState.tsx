import { Bookmark } from "lucide-react"

interface EmptyStateProps {
  message?: string
}

export function EmptyState({
  message = "No bookmarks yet. Add your first one!",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-alt">
        <Bookmark className="h-8 w-8 text-ink-muted" aria-hidden="true" />
      </div>
      <p className="max-w-xs text-sm text-ink-muted">{message}</p>
    </div>
  )
}
