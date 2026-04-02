import { describe, it, expect } from "vitest"
import { filterAndSortBookmarks } from "./filter"
import type { Bookmark } from "@/types"

function makeBookmark(overrides: Partial<Bookmark> = {}): Bookmark {
  return {
    id: "bm-1",
    userId: "",
    title: "Test Bookmark",
    description: "",
    url: "https://example.com",
    normalizedUrl: "example.com",
    tags: [],
    favicon: null,
    viewCount: 0,
    lastVisited: null,
    dateAdded: "2024-01-01T00:00:00.000Z",
    isPinned: false,
    isArchived: false,
    ...overrides,
  }
}

const BASE_OPTIONS = { query: "", selectedTags: [], sortBy: "recently-added" } as const

// ─── Title search ──────────────────────────────────────────────────────────────

describe("filterAndSortBookmarks — title search", () => {
  const bookmarks = [
    makeBookmark({ id: "1", title: "MDN Web Docs" }),
    makeBookmark({ id: "2", title: "GitHub" }),
    makeBookmark({ id: "3", title: "TypeScript Handbook" }),
  ]

  it("returns all bookmarks when query is empty", () => {
    expect(filterAndSortBookmarks(bookmarks, BASE_OPTIONS)).toHaveLength(3)
  })

  it("filters by title substring (case-insensitive)", () => {
    const result = filterAndSortBookmarks(bookmarks, { ...BASE_OPTIONS, query: "mdn" })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("1")
  })

  it("is case-insensitive for the query", () => {
    const result = filterAndSortBookmarks(bookmarks, { ...BASE_OPTIONS, query: "GITHUB" })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("2")
  })

  it("returns empty array when no title matches", () => {
    const result = filterAndSortBookmarks(bookmarks, { ...BASE_OPTIONS, query: "zzz" })
    expect(result).toHaveLength(0)
  })

  it("matches partial title", () => {
    const result = filterAndSortBookmarks(bookmarks, { ...BASE_OPTIONS, query: "hand" })
    expect(result[0].id).toBe("3")
  })
})

// ─── Tag filter (OR logic) ─────────────────────────────────────────────────────

describe("filterAndSortBookmarks — tag filter", () => {
  const bookmarks = [
    makeBookmark({ id: "1", tags: ["react", "javascript"] }),
    makeBookmark({ id: "2", tags: ["typescript"] }),
    makeBookmark({ id: "3", tags: ["css"] }),
    makeBookmark({ id: "4", tags: [] }),
  ]

  it("returns all bookmarks when no tags selected", () => {
    expect(filterAndSortBookmarks(bookmarks, BASE_OPTIONS)).toHaveLength(4)
  })

  it("returns only bookmarks matching the selected tag", () => {
    const result = filterAndSortBookmarks(bookmarks, { ...BASE_OPTIONS, selectedTags: ["typescript"] })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("2")
  })

  it("uses OR logic — includes bookmarks matching any selected tag", () => {
    const result = filterAndSortBookmarks(bookmarks, {
      ...BASE_OPTIONS,
      selectedTags: ["react", "css"],
    })
    expect(result.map((b) => b.id).sort()).toEqual(["1", "3"])
  })

  it("excludes bookmarks matching none of the selected tags", () => {
    const result = filterAndSortBookmarks(bookmarks, {
      ...BASE_OPTIONS,
      selectedTags: ["react"],
    })
    expect(result.every((b) => b.tags.includes("react"))).toBe(true)
    expect(result.find((b) => b.id === "4")).toBeUndefined()
  })

  it("returns empty when selected tag matches nothing", () => {
    const result = filterAndSortBookmarks(bookmarks, {
      ...BASE_OPTIONS,
      selectedTags: ["nonexistent"],
    })
    expect(result).toHaveLength(0)
  })
})

// ─── Sort: recently-added ──────────────────────────────────────────────────────

describe("filterAndSortBookmarks — sort: recently-added", () => {
  const bookmarks = [
    makeBookmark({ id: "old", dateAdded: "2024-01-01T00:00:00.000Z" }),
    makeBookmark({ id: "new", dateAdded: "2024-06-01T00:00:00.000Z" }),
    makeBookmark({ id: "mid", dateAdded: "2024-03-01T00:00:00.000Z" }),
  ]

  it("sorts newest dateAdded first", () => {
    const result = filterAndSortBookmarks(bookmarks, { ...BASE_OPTIONS, sortBy: "recently-added" })
    expect(result.map((b) => b.id)).toEqual(["new", "mid", "old"])
  })
})

// ─── Sort: most-visited ────────────────────────────────────────────────────────

describe("filterAndSortBookmarks — sort: most-visited", () => {
  const bookmarks = [
    makeBookmark({ id: "a", viewCount: 5 }),
    makeBookmark({ id: "b", viewCount: 42 }),
    makeBookmark({ id: "c", viewCount: 0 }),
  ]

  it("sorts highest viewCount first", () => {
    const result = filterAndSortBookmarks(bookmarks, { ...BASE_OPTIONS, sortBy: "most-visited" })
    expect(result.map((b) => b.id)).toEqual(["b", "a", "c"])
  })
})

// ─── Sort: recently-visited ────────────────────────────────────────────────────

describe("filterAndSortBookmarks — sort: recently-visited", () => {
  it("sorts newest lastVisited first", () => {
    const bookmarks = [
      makeBookmark({ id: "a", lastVisited: "2024-01-01T00:00:00.000Z" }),
      makeBookmark({ id: "b", lastVisited: "2024-06-01T00:00:00.000Z" }),
      makeBookmark({ id: "c", lastVisited: "2024-03-01T00:00:00.000Z" }),
    ]
    const result = filterAndSortBookmarks(bookmarks, { ...BASE_OPTIONS, sortBy: "recently-visited" })
    expect(result.map((b) => b.id)).toEqual(["b", "c", "a"])
  })

  it("sorts null lastVisited to the bottom", () => {
    const bookmarks = [
      makeBookmark({ id: "never", lastVisited: null }),
      makeBookmark({ id: "visited", lastVisited: "2024-01-01T00:00:00.000Z" }),
    ]
    const result = filterAndSortBookmarks(bookmarks, { ...BASE_OPTIONS, sortBy: "recently-visited" })
    expect(result[0].id).toBe("visited")
    expect(result[1].id).toBe("never")
  })

  it("keeps two null lastVisited bookmarks in stable relative position", () => {
    const bookmarks = [
      makeBookmark({ id: "x", lastVisited: null }),
      makeBookmark({ id: "y", lastVisited: null }),
    ]
    const result = filterAndSortBookmarks(bookmarks, { ...BASE_OPTIONS, sortBy: "recently-visited" })
    expect(result).toHaveLength(2)
    expect(result.every((b) => b.lastVisited === null)).toBe(true)
  })
})

// ─── Composition ──────────────────────────────────────────────────────────────

describe("filterAndSortBookmarks — composition", () => {
  it("applies search + tag filter together", () => {
    const bookmarks = [
      makeBookmark({ id: "1", title: "React Docs", tags: ["react"] }),
      makeBookmark({ id: "2", title: "React Blog", tags: ["css"] }),
      makeBookmark({ id: "3", title: "CSS Tricks", tags: ["react"] }),
    ]
    // query "react" + tag "react" → only id 1 matches both
    const result = filterAndSortBookmarks(bookmarks, {
      ...BASE_OPTIONS,
      query: "react",
      selectedTags: ["react"],
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("1")
  })

  it("applies search + sort together", () => {
    const bookmarks = [
      makeBookmark({ id: "old", title: "TypeScript Guide", dateAdded: "2024-01-01T00:00:00.000Z" }),
      makeBookmark({ id: "new", title: "TypeScript Tips", dateAdded: "2024-06-01T00:00:00.000Z" }),
      makeBookmark({ id: "other", title: "CSS Guide", dateAdded: "2024-09-01T00:00:00.000Z" }),
    ]
    const result = filterAndSortBookmarks(bookmarks, {
      ...BASE_OPTIONS,
      query: "typescript",
      sortBy: "recently-added",
    })
    expect(result.map((b) => b.id)).toEqual(["new", "old"])
  })

  it("returns empty array for empty input", () => {
    expect(filterAndSortBookmarks([], BASE_OPTIONS)).toEqual([])
  })
})
