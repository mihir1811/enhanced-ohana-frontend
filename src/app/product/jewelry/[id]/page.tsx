"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import JewelryDetailsPage, { JewelryDetailsItem } from '@/components/jewelry/JewelryDetailsPage';
import { jewelryService } from '@/services/jewelryService';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { SECTION_WIDTH } from '@/lib/constants';

export default function JewelryDetailPage() {
  const params = useParams();
  const jewelryId = params?.id as string;
  const [jewelry, setJewelry] = useState<JewelryDetailsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jewelryId) return;
    setLoading(true);
    jewelryService.getJewelryById(jewelryId)
      .then(apiRes => {
        console.log(apiRes.data, 'Jewelry Data');
        if (apiRes?.data) {
          setJewelry(apiRes.data);
        } else {
          setJewelry(null);
        }
      })
      .finally(() => setLoading(false));
  }, [jewelryId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>
        {loading ? (
          <div className="py-20 text-center text-gray-500 text-lg">Loading jewelry details...</div>
        ) : (
          <JewelryDetailsPage jewelry={jewelry} />
        )}
      </div>
      <Footer />
    </div>
  );
}
