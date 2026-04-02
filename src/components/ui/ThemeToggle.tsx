"use client"

import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

const THEMES = ["light", "dark", "system"] as const
type Theme = (typeof THEMES)[number]

const ICONS: Record<Theme, React.ElementType> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const LABELS: Record<Theme, string> = {
  light: "Switch to dark mode",
  dark: "Switch to system theme",
  system: "Switch to light mode",
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // Avoid hydration mismatch — render nothing until mounted
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-8 w-8 shrink-0" aria-hidden="true" />
  }

  const current: Theme = (theme as Theme) ?? "system"
  const Icon = ICONS[current]
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length]

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={LABELS[current]}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
