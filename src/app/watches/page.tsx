'use client'
import React from 'react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import WatchListingPage from '@/components/watches/WatchListingPage'
import { watchService } from '@/services/watch.service'
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell'
import { BuyerSectionHeader } from '@/components/buyer/BuyerSectionHeader'

export default function WatchesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <NavigationUser />
      <BuyerPageShell className="py-6">
        <BuyerSectionHeader title="Luxury Watches" className="mb-10" />
        <WatchListingPage
          fetchWatches={(params) => watchService.getWatches(params)}
          title="Luxury Watches"
        />
      </BuyerPageShell>
      <Footer />
    </div>
  )
}
