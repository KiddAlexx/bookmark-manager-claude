"use client"

import { X } from "lucide-react"

interface TagFilterProps {
  tags: string[]
  selected: string[]
  onToggle: (tag: string) => void
  onReset: () => void
}

export function TagFilter({ tags, selected, onToggle, onReset }: TagFilterProps) {
  if (tags.length === 0) return null

  return (
    <div>
      {selected.length > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="mb-3 flex items-center gap-1 text-xs text-ink-muted underline-offset-2 hover:text-ink hover:underline focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none rounded"
        >
          <X className="h-3 w-3" aria-hidden="true" />
          Reset filter
        </button>
      )}
      <ul aria-label="Filter by tag" className="space-y-1">
        {tags.map((tag) => {
          const isActive = selected.includes(tag)
          return (
            <li key={tag}>
              <button
                type="button"
                onClick={() => onToggle(tag)}
                aria-pressed={isActive}
                className={[
                  "w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none",
                  isActive
                    ? "bg-teal-700 font-medium text-white"
                    : "text-ink-sub hover:bg-surface-alt hover:text-ink",
                ].join(" ")}
              >
                {tag}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
