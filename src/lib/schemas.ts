import { z } from "zod"

export const BookmarkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  url: z.string().url("Must be a valid URL"),
  normalizedUrl: z.string(),
  tags: z.array(z.string()),
  favicon: z.string().nullable(),
  viewCount: z.number().int().min(0),
  lastVisited: z.string().nullable(),
  dateAdded: z.string(),
  isPinned: z.boolean(),
  isArchived: z.boolean(),
})

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email"),
  avatarUrl: z.string().nullable(),
  createdAt: z.string(),
})

export const AddBookmarkSchema = BookmarkSchema.omit({
  id: true,
  userId: true,
  normalizedUrl: true,
  viewCount: true,
  lastVisited: true,
  dateAdded: true,
  isPinned: true,
  isArchived: true,
})

export const EditBookmarkSchema = AddBookmarkSchema
