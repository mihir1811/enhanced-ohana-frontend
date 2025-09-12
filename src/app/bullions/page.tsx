'use client'

import React from 'react'
import BullionListingPage from '@/components/bullions/BullionListingPage'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { SECTION_WIDTH } from '@/lib/constants'

export default function BullionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationUser />
      
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Precious Metal Bullions</h1>
            <p className="mt-2 text-gray-600">
              Discover our extensive collection of gold, silver, platinum, and other precious metal bullions
            </p>
          </div>
          
          <BullionListingPage />
        </div>
      </div>
      
      <Footer />
    </div>
  )
}