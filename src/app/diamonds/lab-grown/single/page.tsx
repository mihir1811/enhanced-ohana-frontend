"use client";

import DiamondListingPage from '@/components/diamonds/DiamondListingPage'
import { diamondService } from '@/services/diamondService'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { SECTION_WIDTH } from '@/lib/constants';

export default function LabGrownSingleDiamondsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
            <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>

        <DiamondListingPage
          diamondType="lab-grown-single"
          fetchDiamonds={diamondService.getDiamonds}
          title="Lab-Grown Single Diamonds"
        />
      </div>
      <Footer />
    </div>
  );
}
