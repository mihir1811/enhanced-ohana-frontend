"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import WatchDetailsPage from '@/components/watches/WatchDetailsPage';
import { watchService, WatchProduct } from '@/services/watch.service';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { SECTION_WIDTH } from '@/lib/constants';

export default function WatchDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [watch, setWatch] = useState<WatchProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchWatch = async () => {
      setLoading(true);
      try {
        const response = await watchService.getWatchById(Number(id));
        if (response?.data) {
          setWatch(response.data);
        } else {
          setWatch(null);
        }
      } catch (error) {
        console.error('Failed to fetch watch details:', error);
        setWatch(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWatch();
  }, [id]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <NavigationUser />
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: SECTION_WIDTH }}>
        {loading ? (
          <div className="py-20 text-center text-lg" style={{ color: 'var(--muted-foreground)' }}>
            Loading watch details...
          </div>
        ) : (
          <WatchDetailsPage watch={watch} />
        )}
      </div>
      <Footer />
    </div>
  );
}
