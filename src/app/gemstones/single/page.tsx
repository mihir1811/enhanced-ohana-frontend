'use client'

import GemstoneListingPage from '@/components/gemstones/GemstoneListingPage'
import { gemstoneService } from '@/services/gemstoneService'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell'

export default function SingleGemstonesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      <BuyerPageShell className="py-6">
        <GemstoneListingPage
          gemstoneType="single"
          fetchGemstones={gemstoneService.getAllGemstones}
          title="Single Gemstones"
        />
      </BuyerPageShell>
      <Footer />
    </div>
  );
}
