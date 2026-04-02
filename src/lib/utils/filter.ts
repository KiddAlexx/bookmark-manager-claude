import type { Bookmark } from "@/types"

export type SortMode = "recently-added" | "recently-visited" | "most-visited"

interface FilterOptions {
  query: string
  selectedTags: readonly string[]
  sortBy: SortMode
}

/**
 * Filters bookmarks by title search + OR tag logic, then sorts by the given mode.
 * Archive/pin filtering is the caller's responsibility — pass a pre-filtered slice.
 */
export function filterAndSortBookmarks(
  bookmarks: Bookmark[],
  { query, selectedTags, sortBy }: FilterOptions,
): Bookmark[] {
  const lc = query.toLowerCase()

  const filtered = bookmarks.filter((b) => {
    if (!b.title.toLowerCase().includes(lc)) return false
    if (selectedTags.length > 0 && !selectedTags.some((t) => b.tags.includes(t))) return false
    return true
  })

  return [...filtered].sort((a, b) => {
    if (sortBy === "recently-added") {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    }
    if (sortBy === "most-visited") {
      return b.viewCount - a.viewCount
    }
    // recently-visited: nulls sort to the bottom
    if (!a.lastVisited && !b.lastVisited) return 0
    if (!a.lastVisited) return 1
    if (!b.lastVisited) return -1
    return new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
  })
}
