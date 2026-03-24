'use client'

import DiamondListingPage from '@/components/diamonds/DiamondListingPage'
import { diamondService } from '@/services/diamondService'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell'
import { BuyerSectionHeader } from '@/components/buyer/BuyerSectionHeader'

export default function NaturalMeleeDiamondsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <NavigationUser />
      <BuyerPageShell className="py-6">
        <BuyerSectionHeader title="Natural Melee Diamonds" className="mb-10" />
        <DiamondListingPage
          diamondType="natural-melee"
          fetchDiamonds={diamondService.getMeleeDiamonds}
          title="Natural Melee Diamonds"
        />
      </BuyerPageShell>
      <Footer />
    </div>
  );
}

