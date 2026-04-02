"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUpDown, Check } from "lucide-react"

export type SortMode = "recently-added" | "recently-visited" | "most-visited"

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: "recently-added", label: "Recently Added" },
  { value: "recently-visited", label: "Recently Visited" },
  { value: "most-visited", label: "Most Visited" },
]

interface SortControlProps {
  value: SortMode
  onChange: (mode: SortMode) => void
}

export function SortControl({ value, onChange }: SortControlProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const current = OPTIONS.find((o) => o.value === value)!

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sort by: ${current.label}`}
        className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-sub transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
        {current.label}
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Sort options"
          className="absolute right-0 top-9 z-20 min-w-[180px] rounded-xl bg-surface py-1 shadow-lg ring-1 ring-line"
        >
          {OPTIONS.map((option) => {
            const isSelected = option.value === value
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false) }}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm text-ink-sub transition-colors hover:bg-surface-alt focus-visible:bg-surface-alt focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-700 focus-visible:outline-none"
                >
                  {option.label}
                  {isSelected && <Check className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
