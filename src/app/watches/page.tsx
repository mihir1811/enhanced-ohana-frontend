'use client'
import React from 'react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import WatchListingPage from '@/components/watches/WatchListingPage'
import { watchService } from '@/services/watch.service'

const SECTION_WIDTH = 1400

export default function WatchesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-2 sm:px-6 lg:px-6`}>
        <WatchListingPage
          fetchWatches={(params) => watchService.getWatches(params)}
          title="Luxury Watches"
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  )
}
