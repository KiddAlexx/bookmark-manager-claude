"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { MobileSidebarDrawer } from "@/components/layout/MobileSidebarDrawer"

export default function Archived() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onAddBookmark={() => {}}
          onMenuOpen={() => setDrawerOpen(true)}
        />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          aria-label="Archived bookmarks"
        >
          {/* Archived bookmark list — wired in Step 7 */}
          <p className="text-sm text-ink-muted">Archived bookmarks…</p>
        </main>
      </div>

      <MobileSidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
