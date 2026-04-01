import { create } from "zustand"

type Theme = "light" | "dark"

const STORAGE_KEY = "theme"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === "light" || stored === "dark") return stored
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return
  document.documentElement.classList.toggle("dark", theme === "dark")
}

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
  initTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "light",

  initTheme: () => {
    const theme = getInitialTheme()
    applyTheme(theme)
    set({ theme })
  },

  toggleTheme: () => {
    const next: Theme = get().theme === "light" ? "dark" : "light"
    applyTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
    set({ theme: next })
  },
}))
