import { describe, it, expect, beforeEach } from "vitest"
import {
  findDuplicate,
  archiveBookmark,
  unarchiveBookmark,
  togglePin,
  recordVisit,
} from "./bookmarks"
import type { Bookmark } from "@/types"

const STORAGE_KEY = "bookmarks"

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

function seed(bookmarks: Bookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
}

beforeEach(() => {
  localStorage.clear()
})

// ─── findDuplicate ─────────────────────────────────────────────────────────────

describe("findDuplicate", () => {
  it("returns undefined when storage is empty", () => {
    expect(findDuplicate("https://example.com")).toBeUndefined()
  })

  it("returns undefined when no URL matches", () => {
    seed([makeBookmark({ id: "1", normalizedUrl: "github.com" })])
    expect(findDuplicate("https://example.com")).toBeUndefined()
  })

  it("returns the bookmark when the URL matches exactly (normalized)", () => {
    const bm = makeBookmark({ id: "1", normalizedUrl: "example.com" })
    seed([bm])
    expect(findDuplicate("https://example.com")?.id).toBe("1")
  })

  it("matches http and https as the same URL", () => {
    const bm = makeBookmark({ id: "1", normalizedUrl: "example.com" })
    seed([bm])
    expect(findDuplicate("http://example.com")?.id).toBe("1")
  })

  it("matches www and non-www as the same URL", () => {
    const bm = makeBookmark({ id: "1", normalizedUrl: "example.com" })
    seed([bm])
    expect(findDuplicate("https://www.example.com")?.id).toBe("1")
  })

  it("matches case-insensitively", () => {
    const bm = makeBookmark({ id: "1", normalizedUrl: "example.com" })
    seed([bm])
    expect(findDuplicate("https://EXAMPLE.COM")?.id).toBe("1")
  })

  it("returns undefined when excludeId matches the only duplicate", () => {
    const bm = makeBookmark({ id: "1", normalizedUrl: "example.com" })
    seed([bm])
    expect(findDuplicate("https://example.com", "1")).toBeUndefined()
  })

  it("returns other bookmark when excludeId does not match the duplicate", () => {
    const bm1 = makeBookmark({ id: "1", normalizedUrl: "example.com" })
    const bm2 = makeBookmark({ id: "2", normalizedUrl: "example.com" })
    seed([bm1, bm2])
    expect(findDuplicate("https://example.com", "1")?.id).toBe("2")
  })
})

// ─── archiveBookmark ───────────────────────────────────────────────────────────

describe("archiveBookmark", () => {
  it("sets isArchived to true", () => {
    seed([makeBookmark({ id: "1", isArchived: false })])
    const result = archiveBookmark("1")
    expect(result.isArchived).toBe(true)
  })

  it("clears isPinned when archiving a pinned bookmark", () => {
    seed([makeBookmark({ id: "1", isPinned: true, isArchived: false })])
    const result = archiveBookmark("1")
    expect(result.isPinned).toBe(false)
  })

  it("persists the archived state to localStorage", () => {
    seed([makeBookmark({ id: "1" })])
    archiveBookmark("1")
    const stored: Bookmark[] = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored[0].isArchived).toBe(true)
  })

  it("throws when id is not found", () => {
    seed([])
    expect(() => archiveBookmark("missing")).toThrow()
  })
})

// ─── unarchiveBookmark ─────────────────────────────────────────────────────────

describe("unarchiveBookmark", () => {
  it("sets isArchived to false", () => {
    seed([makeBookmark({ id: "1", isArchived: true })])
    const result = unarchiveBookmark("1")
    expect(result.isArchived).toBe(false)
  })

  it("does not change isPinned when unarchiving", () => {
    seed([makeBookmark({ id: "1", isArchived: true, isPinned: false })])
    const result = unarchiveBookmark("1")
    expect(result.isPinned).toBe(false)
  })

  it("persists the unarchived state to localStorage", () => {
    seed([makeBookmark({ id: "1", isArchived: true })])
    unarchiveBookmark("1")
    const stored: Bookmark[] = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored[0].isArchived).toBe(false)
  })

  it("throws when id is not found", () => {
    seed([])
    expect(() => unarchiveBookmark("missing")).toThrow()
  })
})

// ─── togglePin ─────────────────────────────────────────────────────────────────

describe("togglePin", () => {
  it("sets isPinned to true when currently false", () => {
    seed([makeBookmark({ id: "1", isPinned: false })])
    const result = togglePin("1")
    expect(result.isPinned).toBe(true)
  })

  it("sets isPinned to false when currently true", () => {
    seed([makeBookmark({ id: "1", isPinned: true })])
    const result = togglePin("1")
    expect(result.isPinned).toBe(false)
  })

  it("does not change isArchived when toggling pin", () => {
    seed([makeBookmark({ id: "1", isPinned: false, isArchived: false })])
    const result = togglePin("1")
    expect(result.isArchived).toBe(false)
  })

  it("persists the new pin state to localStorage", () => {
    seed([makeBookmark({ id: "1", isPinned: false })])
    togglePin("1")
    const stored: Bookmark[] = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored[0].isPinned).toBe(true)
  })

  it("throws when id is not found", () => {
    seed([])
    expect(() => togglePin("missing")).toThrow()
  })
})

// ─── recordVisit ───────────────────────────────────────────────────────────────

describe("recordVisit", () => {
  it("increments viewCount by 1", () => {
    seed([makeBookmark({ id: "1", viewCount: 3 })])
    const result = recordVisit("1")
    expect(result.viewCount).toBe(4)
  })

  it("sets lastVisited to a non-null ISO date string", () => {
    seed([makeBookmark({ id: "1", lastVisited: null })])
    const result = recordVisit("1")
    expect(result.lastVisited).not.toBeNull()
    expect(() => new Date(result.lastVisited!)).not.toThrow()
  })

  it("persists updated viewCount to localStorage", () => {
    seed([makeBookmark({ id: "1", viewCount: 0 })])
    recordVisit("1")
    const stored: Bookmark[] = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored[0].viewCount).toBe(1)
  })

  it("throws when id is not found", () => {
    seed([])
    expect(() => recordVisit("missing")).toThrow()
  })
})
