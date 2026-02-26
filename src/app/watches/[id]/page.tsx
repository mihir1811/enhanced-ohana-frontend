"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import WatchDetailsPage from '@/components/watches/WatchDetailsPage';
import { watchService, WatchProduct } from '@/services/watch.service';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { SECTION_WIDTH } from '@/lib/constants';
import { ProductDetailSkeleton } from '@/components/ui/ProductDetailSkeleton';

export default function WatchDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [watch, setWatch] = useState<WatchProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatch = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await watchService.getWatchById(Number(id));
      if (response?.data) {
        setWatch(response.data);
      } else {
        setWatch(null);
      }
    } catch (err) {
      console.error('Failed to fetch watch details:', err);
      setWatch(null);
      setError('Failed to load watch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatch();
  }, [id]);

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
              onClick={fetchWatch}
              className="px-6 py-3 rounded-lg font-medium"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <WatchDetailsPage watch={watch} />
        )}
      </div>
      <Footer />
    </div>
  );
}
