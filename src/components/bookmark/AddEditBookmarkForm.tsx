"use client"

import { useState, KeyboardEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { AddBookmarkSchema } from "@/lib/schemas"
import type { AddBookmarkInput, Bookmark } from "@/types"

interface AddEditBookmarkFormProps {
  /** When provided, form operates in edit mode and pre-fills all fields */
  bookmark?: Bookmark
  onSubmit: (data: AddBookmarkInput) => Promise<void>
  onCancel: () => void
}

export function AddEditBookmarkForm({
  bookmark,
  onSubmit,
  onCancel,
}: AddEditBookmarkFormProps) {
  const isEdit = !!bookmark
  const [tagInput, setTagInput] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddBookmarkInput>({
    resolver: zodResolver(AddBookmarkSchema),
    defaultValues: {
      title: bookmark?.title ?? "",
      url: bookmark?.url ?? "",
      description: bookmark?.description ?? "",
      tags: bookmark?.tags ?? [],
      favicon: bookmark?.favicon ?? "",
    },
  })

  const tags = watch("tags")

  function addTag() {
    const trimmed = tagInput.trim()
    if (!trimmed || tags.includes(trimmed)) return
    setValue("tags", [...tags, trimmed], { shouldDirty: true })
    setTagInput("")
  }

  function removeTag(tag: string) {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
      { shouldDirty: true },
    )
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  async function handleFormSubmit(data: AddBookmarkInput) {
    await onSubmit(data)
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bm-title" className="text-sm font-medium text-ink">
          Title <span aria-hidden="true" className="text-danger-600">*</span>
        </label>
        <input
          id="bm-title"
          type="text"
          autoComplete="off"
          placeholder="e.g. MDN Web Docs"
          {...register("title")}
          aria-describedby={errors.title ? "bm-title-error" : undefined}
          aria-invalid={!!errors.title}
          className="rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-teal-700 focus:outline-none aria-[invalid=true]:border-danger-600"
        />
        {errors.title && (
          <p id="bm-title-error" role="alert" className="text-xs text-danger-600">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* URL */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bm-url" className="text-sm font-medium text-ink">
          URL <span aria-hidden="true" className="text-danger-600">*</span>
        </label>
        <input
          id="bm-url"
          type="url"
          autoComplete="off"
          placeholder="https://example.com"
          {...register("url")}
          aria-describedby={errors.url ? "bm-url-error" : undefined}
          aria-invalid={!!errors.url}
          className="rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-teal-700 focus:outline-none aria-[invalid=true]:border-danger-600"
        />
        {errors.url && (
          <p id="bm-url-error" role="alert" className="text-xs text-danger-600">
            {errors.url.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bm-description" className="text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          id="bm-description"
          rows={3}
          placeholder="A brief description of this bookmark…"
          {...register("description")}
          className="resize-none rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-teal-700 focus:outline-none"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bm-tag-input" className="text-sm font-medium text-ink">
          Tags
        </label>

        {/* Existing tag pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label="Added tags">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-surface-alt px-2.5 py-0.5 text-xs font-medium text-ink-sub"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="rounded-full focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:outline-none"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Tag input */}
        <div className="flex gap-2">
          <input
            id="bm-tag-input"
            type="text"
            placeholder="Add a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="flex-1 rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-teal-700 focus:outline-none"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-lg border border-line px-3 py-2 text-sm text-ink-sub transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Add
          </button>
        </div>
      </div>

      {/* Favicon URL */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bm-favicon" className="text-sm font-medium text-ink">
          Favicon URL
          <span className="ml-1 text-xs font-normal text-ink-muted">(optional)</span>
        </label>
        <input
          id="bm-favicon"
          type="url"
          autoComplete="off"
          placeholder="https://example.com/favicon.ico"
          {...register("favicon")}
          className="rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-teal-700 focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-line pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-sub transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add bookmark"}
        </button>
      </div>
    </form>
  )
}
