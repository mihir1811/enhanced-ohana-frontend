"use client";

import DiamondListingPage from '@/components/diamonds/DiamondListingPage'
import { diamondService } from '@/services/diamondService'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell'
import { BuyerSectionHeader } from '@/components/buyer/BuyerSectionHeader'

export default function LabGrownSingleDiamondsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <NavigationUser />
      <BuyerPageShell className="py-6">
        <BuyerSectionHeader title="Lab-Grown Single Diamonds" className="mb-10" />
        <DiamondListingPage
          diamondType="lab-grown-single"
          fetchDiamonds={diamondService.getDiamonds}
          title="Lab-Grown Single Diamonds"
        />
      </BuyerPageShell>
      <Footer />
    </div>
  );
}
