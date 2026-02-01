'use client'

import React from 'react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import BullionListingPage from '@/components/bullions/BullionListingPage'
import { bullionService } from '@/services/bullion.service'
import { Shield, Award, TrendingUp } from 'lucide-react'

const SECTION_WIDTH = 1400

export default function BullionsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      {/* Main Content */}
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-2 sm:px-6 lg:px-6`}>
        <BullionListingPage
          fetchBullions={(params) => bullionService.getBullions(params)}
          title="Precious Metal Bullions"
        />
      </div>
      
      <Footer />
    </div>
  )
}