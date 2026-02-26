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
import { ProductDetailSkeleton } from '@/components/ui/ProductDetailSkeleton';

export default function DiamondDetailPage() {
  const params = useParams<{ diamondId: string }>();
  const diamondId = params?.diamondId as string;
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiamond = () => {
    if (!diamondId) return;
    setLoading(true);
    setError(null);
    diamondService.getDiamondById(diamondId)
      .then(apiRes => {
        if (apiRes?.data) {
          setDiamond(transformApiDiamond(apiRes.data));
        } else {
          setDiamond(null);
        }
      })
      .catch(() => {
        setDiamond(null);
        setError('Failed to load diamond');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDiamond();
  }, [diamondId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <NavigationUser />
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: SECTION_WIDTH }}>
        {loading ? (
          <ProductDetailSkeleton />
        ) : error ? (
          <div className="text-center py-16 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="mb-4" style={{ color: 'var(--destructive)' }}>{error}</p>
            <button
              onClick={fetchDiamond}
              className="px-6 py-3 rounded-lg font-medium"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <DiamondDetailsPage diamond={diamond} />
        )}
      </div>
      <Footer />
    </div>
  );
}
