import type { Bookmark, AddBookmarkInput, EditBookmarkInput } from "@/types"
import { normalizeUrl } from "@/lib/utils/url"
import seedData from "@/data/data.json"

const STORAGE_KEY = "bookmarks"

function generateId(): string {
  return `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function readStorage(): Bookmark[] {
  if (typeof window === "undefined") return []
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Bookmark[]
  } catch {
    return []
  }
}

function writeStorage(bookmarks: Bookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
}

export function seedIfEmpty(): void {
  if (typeof window === "undefined") return
  const existing = localStorage.getItem(STORAGE_KEY)
  if (!existing) {
    writeStorage(seedData.bookmarks as Bookmark[])
  }
}

export function getBookmarks(): Bookmark[] {
  return readStorage()
}

export function getBookmarkById(id: string): Bookmark | undefined {
  return readStorage().find((b) => b.id === id)
}

export function addBookmark(input: AddBookmarkInput): Bookmark {
  const bookmarks = readStorage()
  const now = new Date().toISOString()
  const bookmark: Bookmark = {
    ...input,
    id: generateId(),
    userId: "",
    normalizedUrl: normalizeUrl(input.url),
    viewCount: 0,
    lastVisited: null,
    dateAdded: now,
    isPinned: false,
    isArchived: false,
  }
  writeStorage([...bookmarks, bookmark])
  return bookmark
}

export function updateBookmark(id: string, input: EditBookmarkInput): Bookmark {
  const bookmarks = readStorage()
  const index = bookmarks.findIndex((b) => b.id === id)
  if (index === -1) throw new Error(`Bookmark ${id} not found`)
  const updated: Bookmark = {
    ...bookmarks[index],
    ...input,
    normalizedUrl: normalizeUrl(input.url),
  }
  bookmarks[index] = updated
  writeStorage(bookmarks)
  return updated
}

export function deleteBookmark(id: string): void {
  const bookmarks = readStorage()
  writeStorage(bookmarks.filter((b) => b.id !== id))
}

export function togglePin(id: string): Bookmark {
  const bookmarks = readStorage()
  const index = bookmarks.findIndex((b) => b.id === id)
  if (index === -1) throw new Error(`Bookmark ${id} not found`)
  bookmarks[index] = { ...bookmarks[index], isPinned: !bookmarks[index].isPinned }
  writeStorage(bookmarks)
  return bookmarks[index]
}

export function archiveBookmark(id: string): Bookmark {
  const bookmarks = readStorage()
  const index = bookmarks.findIndex((b) => b.id === id)
  if (index === -1) throw new Error(`Bookmark ${id} not found`)
  // Archiving clears pin
  bookmarks[index] = { ...bookmarks[index], isArchived: true, isPinned: false }
  writeStorage(bookmarks)
  return bookmarks[index]
}

export function unarchiveBookmark(id: string): Bookmark {
  const bookmarks = readStorage()
  const index = bookmarks.findIndex((b) => b.id === id)
  if (index === -1) throw new Error(`Bookmark ${id} not found`)
  bookmarks[index] = { ...bookmarks[index], isArchived: false }
  writeStorage(bookmarks)
  return bookmarks[index]
}

export function recordVisit(id: string): Bookmark {
  const bookmarks = readStorage()
  const index = bookmarks.findIndex((b) => b.id === id)
  if (index === -1) throw new Error(`Bookmark ${id} not found`)
  bookmarks[index] = {
    ...bookmarks[index],
    viewCount: bookmarks[index].viewCount + 1,
    lastVisited: new Date().toISOString(),
  }
  writeStorage(bookmarks)
  return bookmarks[index]
}

export function findDuplicate(url: string, excludeId?: string): Bookmark | undefined {
  const normalized = normalizeUrl(url)
  return readStorage().find(
    (b) => b.normalizedUrl === normalized && b.id !== excludeId,
  )
}
