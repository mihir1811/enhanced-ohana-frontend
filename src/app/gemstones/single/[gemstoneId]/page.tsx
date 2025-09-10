"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GemstoneDetailsPage from '@/components/gemstones/GemstoneDetailsPage';
import { gemstoneService, GemstonItem, transformDetailedGemstone } from '@/services/gemstoneService';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { SECTION_WIDTH } from '@/lib/constants';

export default function SingleGemstoneDetailPage() {
  const params = useParams();
  const gemstoneId = params?.gemstoneId as string;
  const [gemstone, setGemstone] = useState<GemstonItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gemstoneId) return;
    setLoading(true);
    
    // Try using the new getSingleGemstone method first
    gemstoneService.getSingleGemstone(gemstoneId)
      .then(response => {
        if (response.success && response.data) {
          // Transform the detailed gemstone data to the expected format
          const transformedGemstone = transformDetailedGemstone(response.data);
          setGemstone(transformedGemstone);
        } else {
          console.log('No data found, trying fallback method');
          // Fallback to the original method if the new API doesn't return data
          return gemstoneService.getAllGemstones({ 
            search: gemstoneId,
            limit: 1 
          }).then(fallbackResponse => {
            if (fallbackResponse.success && fallbackResponse.data.data.length > 0) {
              setGemstone(fallbackResponse.data.data[0]);
            } else {
              setGemstone(null);
            }
          });
        }
      })
      .catch(err => {
        console.error('Error fetching gemstone with getSingleGemstone, falling back to search:', err);
        
        // Fallback to the original method if the new API doesn't work
        return gemstoneService.getAllGemstones({ 
          search: gemstoneId,
          limit: 1 
        }).then(fallbackResponse => {
          if (fallbackResponse.success && fallbackResponse.data.data.length > 0) {
            setGemstone(fallbackResponse.data.data[0]);
          } else {
            setGemstone(null);
          }
        });
      })
      .catch(finalErr => {
        console.error('Error with all methods:', finalErr);
        setGemstone(null);
      })
      .finally(() => setLoading(false));
  }, [gemstoneId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>
        {loading ? (
          <div className="py-20 text-center text-gray-500 text-lg">Loading gemstone details...</div>
        ) : (
          <GemstoneDetailsPage gemstone={gemstone} />
        )}
      </div>
      <Footer />
    </div>
  );
}
