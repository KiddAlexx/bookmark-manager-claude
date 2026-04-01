import { create } from "zustand"
import type { Bookmark, AddBookmarkInput, EditBookmarkInput } from "@/types"
import {
  seedIfEmpty,
  getBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  togglePin,
  archiveBookmark,
  unarchiveBookmark,
  recordVisit,
  findDuplicate,
} from "@/lib/services/bookmarks"

interface BookmarkStore {
  bookmarks: Bookmark[]
  init: () => void
  add: (input: AddBookmarkInput) => Bookmark
  update: (id: string, input: EditBookmarkInput) => Bookmark
  remove: (id: string) => void
  togglePin: (id: string) => void
  archive: (id: string) => void
  unarchive: (id: string) => void
  recordVisit: (id: string) => void
  findDuplicate: (url: string, excludeId?: string) => Bookmark | undefined
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: [],

  init: () => {
    seedIfEmpty()
    set({ bookmarks: getBookmarks() })
  },

  add: (input) => {
    const bookmark = addBookmark(input)
    set({ bookmarks: getBookmarks() })
    return bookmark
  },

  update: (id, input) => {
    const bookmark = updateBookmark(id, input)
    set({ bookmarks: getBookmarks() })
    return bookmark
  },

  remove: (id) => {
    deleteBookmark(id)
    set({ bookmarks: getBookmarks() })
  },

  togglePin: (id) => {
    togglePin(id)
    set({ bookmarks: getBookmarks() })
  },

  archive: (id) => {
    archiveBookmark(id)
    set({ bookmarks: getBookmarks() })
  },

  unarchive: (id) => {
    unarchiveBookmark(id)
    set({ bookmarks: getBookmarks() })
  },

  recordVisit: (id) => {
    recordVisit(id)
    set({ bookmarks: getBookmarks() })
  },

  findDuplicate: (url, excludeId) => findDuplicate(url, excludeId),
}))
