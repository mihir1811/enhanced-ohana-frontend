"use client";

import DiamondListingPage from '@/components/diamonds/DiamondListingPage'
import { diamondService } from '@/services/diamondService'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell'
import { BuyerSectionHeader } from '@/components/buyer/BuyerSectionHeader'

export default function LabGrownMeleeDiamondsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <NavigationUser />
      <BuyerPageShell className="py-6">
        <BuyerSectionHeader title="Lab-Grown Melee Diamonds" className="mb-10" />
        <DiamondListingPage
          diamondType="lab-grown-melee"
          fetchDiamonds={diamondService.getMeleeDiamonds}
          title="Lab-Grown Melee Diamonds"
        />
      </BuyerPageShell>
      <Footer />
    </div>
  );
}
