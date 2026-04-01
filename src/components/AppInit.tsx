"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/store/themeStore"
import { useBookmarkStore } from "@/store/bookmarkStore"

export function AppInit() {
  const initTheme = useThemeStore((s) => s.initTheme)
  const initBookmarks = useBookmarkStore((s) => s.init)

  useEffect(() => {
    initTheme()
    initBookmarks()
  }, [initTheme, initBookmarks])

  return null
}
