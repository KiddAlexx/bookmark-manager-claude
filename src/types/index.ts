import type { z } from "zod"
import type {
  BookmarkSchema,
  UserSchema,
  AddBookmarkSchema,
  EditBookmarkSchema,
} from "@/lib/schemas"

export type Bookmark = z.infer<typeof BookmarkSchema>
export type User = z.infer<typeof UserSchema>
export type AddBookmarkInput = z.infer<typeof AddBookmarkSchema>
export type EditBookmarkInput = z.infer<typeof EditBookmarkSchema>

// Augment NextAuth v4 session to include user.id
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
