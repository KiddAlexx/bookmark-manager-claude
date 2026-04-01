"use client"

import { useEffect } from "react"
import { useBookmarkStore } from "@/store/bookmarkStore"

export function AppInit() {
  const initBookmarks = useBookmarkStore((s) => s.init)

  useEffect(() => {
    initBookmarks()
  }, [initBookmarks])

  return null
}
