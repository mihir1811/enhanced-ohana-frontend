'use client'

import GemstoneListingPage from '@/components/gemstones/GemstoneListingPage'
import { gemstoneService } from '@/services/gemstoneService'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { SECTION_WIDTH } from '@/lib/constants'

export default function SingleGemstonesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>
        <GemstoneListingPage
          gemstoneType="single"
          fetchGemstones={gemstoneService.getAllGemstones}
          title="Single Gemstones"
        />
      </div>
      <Footer />
    </div>
  );
}
