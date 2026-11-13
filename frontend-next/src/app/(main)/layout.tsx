'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import AuthGuard from '@/components/AuthGuard'

type MainLayoutProps = {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Shared Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* The current page appears here */}
        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="mb-4 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <span className="text-lg">☰</span>
            Menu
          </button>

          {children}
        </main>
      </div>
    </AuthGuard>
  )
}