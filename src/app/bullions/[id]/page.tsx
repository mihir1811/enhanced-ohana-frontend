'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BullionDetailsPage from '@/components/bullions/BullionDetailsPage';
import { bullionService, BullionProduct } from '@/services/bullion.service';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { SECTION_WIDTH } from '@/lib/constants';

export default function BullionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const [bullion, setBullion] = useState<BullionProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // id is string from params, service expects number
    bullionService.getBullionById(Number(id))
      .then(res => {
        if (res?.data) {
          setBullion(res.data);
        } else {
          setBullion(null);
        }
      })
      .catch(err => {
        console.error('Error fetching bullion details:', err);
        setBullion(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <NavigationUser />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: SECTION_WIDTH }}>
        {loading ? (
          <div className="py-20 text-center text-lg" style={{ color: 'var(--muted-foreground)' }}>Loading bullion details...</div>
        ) : (
          <BullionDetailsPage bullion={bullion} />
        )}
      </div>
      <Footer />
    </div>
  );
}
