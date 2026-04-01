export interface Bookmark {
  id: string
  userId: string
  title: string
  description: string
  url: string
  normalizedUrl: string
  tags: string[]
  favicon: string | null
  viewCount: number
  lastVisited: string | null
  dateAdded: string
  isPinned: boolean
  isArchived: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
}
