"use client"

import { X } from "lucide-react"
import { useToastStore } from "@/store/toastStore"
import type { ToastItem } from "@/store/toastStore"

function Toast({ id, message, icon: Icon }: ToastItem) {
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div
      aria-atomic="true"
      className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 shadow-lg ring-1 ring-line"
    >
      <Icon className="h-4 w-4 shrink-0 text-ink-sub" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium text-ink">{message}</p>
      <button
        type="button"
        onClick={() => removeToast(id)}
        aria-label="Dismiss notification"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-ink-muted transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex w-80 flex-col gap-2"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
