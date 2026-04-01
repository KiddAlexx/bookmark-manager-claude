"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/store/themeStore"

export function AppInit() {
  const initTheme = useThemeStore((s) => s.initTheme)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return null
}
