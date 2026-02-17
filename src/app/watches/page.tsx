'use client'
import React from 'react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import WatchListingPage from '@/components/watches/WatchListingPage'
import { watchService } from '@/services/watch.service'
import { SECTION_WIDTH } from '@/lib/constants'

export default function WatchesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <NavigationUser />
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: SECTION_WIDTH }}>
        <WatchListingPage
          fetchWatches={(params) => watchService.getWatches(params)}
          title="Luxury Watches"
        />
      </div>
      <Footer />
    </div>
  )
}
