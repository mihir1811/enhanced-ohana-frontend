'use client'

import { useState, useEffect } from 'react'
import { Gem, Package, Users, Filter as FilterIcon } from 'lucide-react'
import DiamondFilters, { DiamondFilterValues } from '@/components/diamonds/DiamondFilters'

import DiamondListingPage from '@/components/diamonds/DiamondListingPage'
import { diamondService } from '@/services/diamondService'

import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'

export default function NaturalMeleeDiamondsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      <div className="max-w-7xl mx-auto px-4">
        <DiamondListingPage
          diamondType="natural-melee"
          fetchDiamonds={diamondService.getDiamonds}
          title="Natural Melee Diamonds"
        />
      </div>
      <Footer />
    </div>
  );
}

