"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DiamondDetailsPage from '@/components/diamonds/DiamondDetailsPage';
import diamondService from '@/services/diamondService';
import { transformApiDiamond } from '@/components/diamonds/diamondUtils';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { SECTION_WIDTH } from '@/lib/constants';
import { Diamond } from '@/components/diamonds/DiamondResults';

export default function DiamondDetailPage() {
  const params = useParams<{ diamondId: string }>();
  const diamondId = params?.diamondId as string;
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!diamondId) return;
    setLoading(true);
    diamondService.getDiamondById(diamondId)
      .then(apiRes => {
        console.log(apiRes.data, '1111111111111');
        if (apiRes?.data) {
        setDiamond(transformApiDiamond(apiRes.data));
        } else {
          setDiamond(null);
        }
      })
      .finally(() => setLoading(false));
  }, [diamondId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>
        {loading ? (
          <div className="py-20 text-center text-gray-500 text-lg">Loading diamond details...</div>
        ) : (
          <DiamondDetailsPage diamond={diamond} />
        )}
      </div>
      <Footer />
    </div>
  );
}
