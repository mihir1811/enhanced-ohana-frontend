'use client'

import { useState, useEffect } from 'react'
import SellerSidebar from './SellerSidebar'
import SellerHeader from './SellerHeader'
import SellerBreadcrumbs from './SellerBreadcrumbs'
import { PageLoader } from './Loader'
import { LoadingProvider } from '@/contexts/LoadingContext'
import { SECTION_WIDTH } from '@/lib/constants'

interface SellerLayoutWrapperProps {
  children: React.ReactNode
}

export default function SellerLayoutWrapper({ children }: SellerLayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const sellerThemeVars: React.CSSProperties = {
    ['--primary' as string]: '#4f46e5',
    ['--primary-foreground' as string]: '#ffffff',
    ['--ring' as string]: '#6366f1',
    ['--sidebar-primary' as string]: '#4f46e5',
    ['--sidebar-primary-foreground' as string]: '#ffffff',
  }

  useEffect(() => {
    // Simulate layout initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)', ...sellerThemeVars }}>
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <svg 
              className="w-7 h-7 animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: 'var(--primary-foreground)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              Gem World
            </h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Loading seller dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LoadingProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', ...sellerThemeVars }}>
        {/* Sidebar */}
        <SellerSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        
        {/* Main Content Area */}
        <div className="lg:pl-20">
          {/* Header */}
          <SellerHeader setSidebarOpen={setSidebarOpen} />
          
          {/* Page Content */}
          <main className="px-4 py-8 sm:px-6 lg:px-8">
            <div className={`mx-auto max-w-[${SECTION_WIDTH}px]`}>
              <SellerBreadcrumbs />
              {children}
            </div>
          </main>
        </div>
      </div>
    </LoadingProvider>
  )
}
