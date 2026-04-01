---
name: react-hook-form-zod
description: Build validated forms with React Hook Form and Zod. Use when creating or modifying any form in the project.
---

# React Hook Form + Zod

We use React Hook Form (RHF) for form state management and Zod for schema-based validation.
These are always used together via `@hookform/resolvers/zod`.

## Core Philosophy

- Zod schema is the single source of truth for field types, constraints, and error messages
- RHF manages form state with minimal re-renders (uncontrolled inputs under the hood)
- Validation runs on submit by default; individual fields validate on blur after first submit
- All async side effects (metadata fetch) live in event handlers, not in validation

## Basic Setup

```ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const bookmarkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  favicon: z.string().nullable().default(null),
})

type BookmarkFormValues = z.infer<typeof bookmarkSchema>

function AddEditBookmarkForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<BookmarkFormValues>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      tags: [],
      favicon: null,
    },
  })

  async function handleFormSubmit(data: BookmarkFormValues) {
    await bookmarkService.add(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* fields */}
    </form>
  )
}
```

## Edit Mode — Pre-filling Values

Pass existing data as `defaultValues` when editing:

```ts
useForm<BookmarkFormValues>({
  resolver: zodResolver(bookmarkSchema),
  defaultValues: bookmark ?? {
    title: '',
    url: '',
    description: '',
    tags: [],
    favicon: null,
  },
})
```

## Async Side Effect on URL Blur (Metadata Fetch)

The URL field triggers a metadata fetch on blur. This is a side effect — it lives in the
event handler, not in Zod validation:

```ts
const { register, setValue, getValues } = useForm<BookmarkFormValues>(...)
const [isFetchingMeta, setIsFetchingMeta] = useState(false)

async function handleUrlBlur() {
  const url = getValues('url')
  if (!url) return

  // Only fetch if URL is valid
  const result = bookmarkSchema.shape.url.safeParse(url)
  if (!result.success) return

  setIsFetchingMeta(true)
  try {
    const meta = await fetch('/api/metadata', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }).then(r => r.json())

    // Pre-fill only if user hasn't already typed a value
    if (!getValues('title')) setValue('title', meta.title)
    if (!getValues('description')) setValue('description', meta.description)
    if (meta.faviconUrl) setValue('favicon', meta.faviconUrl)
  } finally {
    setIsFetchingMeta(false)
  }
}

<input
  type="url"
  {...register('url', { onBlur: handleUrlBlur })}
/>
```

## Tag Input — Dynamic Array Field

Tags are managed as a controlled array. Use `useFieldArray` for dynamic lists:

```ts
import { useFieldArray } from 'react-hook-form'

const { fields, append, remove } = useFieldArray({
  control,
  name: 'tags',
})
```

However, since tags are plain strings (not objects), manage them with `setValue` and
`watch` instead — simpler for this use case:

```ts
const tags = watch('tags')

function handleAddTag(tag: string) {
  const trimmed = tag.trim()
  if (trimmed && !tags.includes(trimmed)) {
    setValue('tags', [...tags, trimmed])
  }
}

function handleRemoveTag(tag: string) {
  setValue('tags', tags.filter((t) => t !== tag))
}
```

## Displaying Validation Errors

Always display errors inline below the relevant field. Use the `errors` object from
`formState`:

```tsx
<div>
  <label htmlFor="title">Title</label>
  <input id="title" {...register('title')} aria-invalid={!!errors.title} />
  {errors.title && (
    <p role="alert" className="text-sm text-red-600">
      {errors.title.message}
    </p>
  )}
</div>
```

- Use `aria-invalid` on the input when there is an error
- Use `role="alert"` on the error message so screen readers announce it
- Never show errors before the user has interacted with the field

## Shared Schema — Client and Server

The same Zod schema is used for both client-side RHF validation and server-side API
route validation:

```ts
// src/lib/schemas/bookmark.ts  ← shared schema
export const bookmarkSchema = z.object({ ... })
export type BookmarkFormValues = z.infer<typeof bookmarkSchema>
```

```ts
// In the API route
import { bookmarkSchema } from '@/lib/schemas/bookmark'

const result = bookmarkSchema.safeParse(await request.json())
if (!result.success) {
  return Response.json({ error: result.error.flatten() }, { status: 400 })
}
```

## Loading and Disabled States

```tsx
<button type="submit" disabled={isSubmitting || isFetchingMeta}>
  {isSubmitting ? 'Saving...' : 'Save Bookmark'}
</button>
```

Always disable the submit button while submitting. Show meaningful loading text.

## Rules for This Project

- Every form uses RHF + Zod resolver — no exceptions, no uncontrolled forms
- Zod schemas live in `/src/lib/schemas/` and are shared between client and server
- Async side effects (metadata fetch) live in blur/change handlers — not in Zod `refine`
- Never use `refine` for async validation — it blocks form submission
- Always show inline errors with `role="alert"` for accessibility
- Use `reset()` after successful submission to clear the form
- Use `defaultValues` in `useForm` — never leave them undefined
