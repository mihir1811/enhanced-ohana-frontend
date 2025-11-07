'use client'

import React from 'react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import BullionListingPage from '@/components/bullions/BullionListingPage'
import { jewelryService } from '@/services/jewelryService'
import { Shield, Award, TrendingUp } from 'lucide-react'

const SECTION_WIDTH = 1920

export default function BullionsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      {/* Main Content */}
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>
        <BullionListingPage
          fetchBullions={jewelryService.getAllJewelry}
          title="Precious Metal Bullions"
        />
      </div>
      
      <Footer />
    </div>
  )
}