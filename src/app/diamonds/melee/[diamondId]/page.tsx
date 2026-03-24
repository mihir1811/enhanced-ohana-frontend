"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MeleeDiamondDetailsPage from '@/components/diamonds/MeleeDiamondDetailsPage';
import { diamondService } from '@/services/diamondService';
import { transformApiDiamond } from '@/components/diamonds/diamondUtils';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { Diamond } from '@/components/diamonds/DiamondResults';
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell';

export default function MeleeDiamondDetailPage() {
  const params = useParams<{ diamondId: string }>();
  const diamondId = params?.diamondId as string;
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!diamondId) return;
    setLoading(true);
    diamondService.getMeleeDiamondById(diamondId)
      .then(apiRes => {
        if (apiRes?.data) {
          setDiamond(transformApiDiamond(apiRes.data));
        } else {
          setDiamond(null);
        }
      })
      .catch(err => {
        console.error('Error fetching melee diamond:', err);
        setDiamond(null);
      })
      .finally(() => setLoading(false));
  }, [diamondId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <NavigationUser />
      <BuyerPageShell className="py-6">
        {loading ? (
          <div className="py-20 text-center text-lg" style={{ color: 'var(--muted-foreground)' }}>Loading melee diamond details...</div>
        ) : (
          <MeleeDiamondDetailsPage diamond={diamond} />
        )}
      </BuyerPageShell>
      <Footer />
    </div>
  );
}
