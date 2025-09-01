import React from 'react';
import DiamondDetailsPage from '@/components/diamonds/DiamondDetailsPage';
import diamondService from '@/services/diamondService';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { SECTION_WIDTH } from '@/lib/constants';

// This page expects a dynamic route param for diamondId
export default async function DiamondDetailPage({ params }: { params: { diamondId: string } }) {
  // Fetch diamond data by ID (replace with your actual data fetching logic)
  const diamond = await diamondService.getDiamondById(params.diamondId);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>
        <DiamondDetailsPage diamond={diamond} />
      </div>
      <Footer />
    </div>
  );
}
