'use client'

import React from 'react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import BullionListingPage from '@/components/bullions/BullionListingPage'
import { bullionService } from '@/services/bullion.service'
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell'
import { BuyerSectionHeader } from '@/components/buyer/BuyerSectionHeader'

export default function BullionsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      {/* Main Content */}
      <BuyerPageShell className="py-6">
        <BuyerSectionHeader title="Precious Metal Bullions" className="mb-10" />
        <BullionListingPage
          fetchBullions={(params) => bullionService.getBullions(params)}
          title="Precious Metal Bullions"
        />
      </BuyerPageShell>
      
      <Footer />
    </div>
  )
}