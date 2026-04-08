"use server"

import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "@/db"
import { users } from "@/db/schema"

// ─── Sign in with credentials ──────────────────────────────────────────────────
// Note: actual sign-in is handled by NextAuth's built-in POST handler.
// This action is used for server-side validation before redirecting.

const signInSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(1, "Password is required"),
})

export type AuthActionState = { error?: string } | undefined

export async function validateSignIn(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  return undefined
}

// ─── Register ─────────────────────────────────────────────────────────────────

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Must be a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export async function registerUser(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, email, password } = parsed.data

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (existing) {
    return { error: "An account with this email already exists." }
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await db.insert(users).values({
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
  })

  // Return a success signal — the client will call signIn() from next-auth/react
  return { error: undefined }
}
