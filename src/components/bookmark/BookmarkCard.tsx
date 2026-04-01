"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Globe, MoreVertical, ExternalLink, Copy, Check,
  Pin, PinOff, Pencil, Archive, ArchiveRestore, Trash2,
  Eye, Calendar, Clock,
} from "lucide-react"
import type { Bookmark } from "@/types"

interface BookmarkCardProps {
  bookmark: Bookmark
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
  onVisit: (id: string) => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

function isValidFaviconSrc(src: string | null | undefined): src is string {
  if (!src) return false
  return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")
}

export function BookmarkCard({
  bookmark, onEdit, onDelete, onPin, onArchive, onUnarchive, onVisit,
}: BookmarkCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [menuOpen])

  function handleVisit() {
    window.open(bookmark.url, "_blank", "noopener,noreferrer")
    onVisit(bookmark.id)
    setMenuOpen(false)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(bookmark.url)
    setCopied(true)
    setMenuOpen(false)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="relative flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          {isValidFaviconSrc(bookmark.favicon) ? (
            <Image
              src={bookmark.favicon}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-alt">
              <Globe className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink">{bookmark.title}</h3>
            <p className="truncate text-xs text-ink-muted">{bookmark.normalizedUrl}</p>
          </div>
        </div>

        {/* Action menu */}
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Bookmark actions"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-9 z-20 min-w-[160px] rounded-xl bg-surface py-1 shadow-lg ring-1 ring-line"
            >
              <MenuItem icon={ExternalLink} label="Visit" onClick={handleVisit} />
              <MenuItem icon={copied ? Check : Copy} label={copied ? "Copied!" : "Copy URL"} onClick={handleCopy} />
              {!bookmark.isArchived && (
                <MenuItem
                  icon={bookmark.isPinned ? PinOff : Pin}
                  label={bookmark.isPinned ? "Unpin" : "Pin"}
                  onClick={() => { onPin(bookmark.id); setMenuOpen(false) }}
                />
              )}
              {!bookmark.isArchived ? (
                <>
                  <MenuItem icon={Pencil} label="Edit" onClick={() => { onEdit(bookmark.id); setMenuOpen(false) }} />
                  <MenuItem icon={Archive} label="Archive" onClick={() => { onArchive(bookmark.id); setMenuOpen(false) }} />
                </>
              ) : (
                <>
                  <MenuItem icon={ArchiveRestore} label="Unarchive" onClick={() => { onUnarchive(bookmark.id); setMenuOpen(false) }} />
                  <MenuItem icon={Trash2} label="Delete Permanently" onClick={() => { onDelete(bookmark.id); setMenuOpen(false) }} danger />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {bookmark.description && (
        <p className="line-clamp-3 text-sm text-ink-sub">{bookmark.description}</p>
      )}

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface-alt px-2.5 py-0.5 text-xs font-medium text-ink-sub">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 border-t border-line pt-3 text-xs text-ink-muted">
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          {bookmark.viewCount}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(bookmark.dateAdded)}
        </span>
        {bookmark.lastVisited && (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(bookmark.lastVisited)}
          </span>
        )}
      </div>
    </article>
  )
}

interface MenuItemProps {
  icon: React.ElementType
  label: string
  onClick: () => void
  danger?: boolean
}

function MenuItem({ icon: Icon, label, onClick, danger = false }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-surface-alt focus-visible:bg-surface-alt focus-visible:outline-none",
        danger ? "text-danger-600" : "text-ink-sub",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
    </button>
  )
}
