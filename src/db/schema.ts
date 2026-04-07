import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core"

// ─── Auth.js v5 tables ─────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
})

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  }),
)

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
  }),
)

// ─── Application tables ────────────────────────────────────────────────────────

export const bookmarks = pgTable(
  "bookmarks",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    url: text("url").notNull(),
    normalizedUrl: text("normalized_url").notNull(),
    tags: text("tags").array().notNull().default([]),
    favicon: text("favicon"),
    viewCount: integer("view_count").notNull().default(0),
    lastVisited: timestamp("last_visited", { mode: "date" }),
    dateAdded: timestamp("date_added", { mode: "date" }).defaultNow().notNull(),
    isPinned: boolean("is_pinned").notNull().default(false),
    isArchived: boolean("is_archived").notNull().default(false),
  },
  (table) => ({
    uniqueUserUrl: uniqueIndex("unique_user_url").on(table.userId, table.normalizedUrl),
  }),
)
