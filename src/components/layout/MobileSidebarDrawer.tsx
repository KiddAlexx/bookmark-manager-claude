"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Sidebar } from "./Sidebar"

interface MobileSidebarDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebarDrawer({ isOpen, onClose }: MobileSidebarDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  // ESC closes, body scroll locked while open
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    // Focus the drawer on open
    drawerRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-dark-900/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className="relative flex h-full w-[220px] flex-col focus:outline-none"
      >
        <Sidebar />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-ink-sub transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
