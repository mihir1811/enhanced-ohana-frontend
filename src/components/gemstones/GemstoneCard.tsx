'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Eye, ShoppingCart, Award, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import WishlistButton from '@/components/shared/WishlistButton';
import CompareButton from '@/components/compare/CompareButton';
import { GemstonItem } from '@/services/gemstoneService';

export interface GemstoneCardProps {
  gemstone: GemstonItem;
  viewMode: 'grid' | 'list';
  onSelect?: () => void;
  onAddToCart?: () => void;
  detailHref: string;
}

function formatPrice(price: number | string | undefined): string {
  if (price == null || price === '') return 'POA';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (Number.isNaN(num)) return 'POA';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function gemTypeLabel(gemType?: string): string {
  if (!gemType) return '';
  return gemType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

// Image carousel for card (filter nulls, show first image or placeholder)
function GemstoneImageBlock({
  images,
  alt,
  className = '',
}: {
  images: (string | null | undefined)[];
  alt: string;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const valid = images.filter((u): u is string => u != null && u !== '');
  const src = valid[idx] ?? null;

  if (valid.length === 0 || !src) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ backgroundColor: 'var(--muted)' }}>
        <div className="text-center" style={{ color: 'var(--muted-foreground)' }}>
          <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 5%, transparent)' }}>
            <Star className="w-8 h-8" />
          </div>
          <p className="text-sm">No Image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={400}
        height={400}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {valid.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + valid.length) % valid.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % valid.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {valid.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const gemstoneImages = (g: GemstonItem) => [g.image1, g.image2, g.image3, g.image4, g.image5, g.image6];

export function GemstoneCard({ gemstone, viewMode, onSelect, onAddToCart, detailHref }: GemstoneCardProps) {
  const router = useRouter();
  const productPayload = {
    id: gemstone.id,
    name: gemstone.name,
    price: gemstone.totalPrice ?? 0,
    images: gemstoneImages(gemstone).filter(Boolean) as string[],
  };

  const handleCardClick = () => {
    onSelect?.();
    router.push(detailHref);
  };

  // ——— List view (match jewelry list layout) ———
  if (viewMode === 'list') {
    return (
      <div
        className="rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border group"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        onClick={handleCardClick}
      >
        <div className="flex gap-6">
          <div className="w-40 h-40 rounded-xl flex-shrink-0 overflow-hidden relative" style={{ backgroundColor: 'var(--card)' }} onClick={(e) => e.stopPropagation()}>
            <GemstoneImageBlock images={gemstoneImages(gemstone)} alt={gemstone.name} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
            {gemstone.isOnAuction && (
              <div className="absolute top-2 left-2 px-2 py-1 text-white text-xs font-semibold rounded-full shadow-lg" style={{ backgroundColor: 'var(--destructive)' }}>
                Auction
              </div>
            )}
            {gemstone.quantity != null && gemstone.quantity > 1 && (
              <div className="absolute top-2 right-2 px-2 py-1 text-white text-xs font-semibold rounded-full shadow" style={{ backgroundColor: 'var(--status-warning)' }}>
                {gemstone.quantity} pcs
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold mb-1 transition-colors line-clamp-2" style={{ color: 'var(--foreground)' }}>{gemstone.name}</h3>
                <p className="text-sm font-mono" style={{ color: 'var(--muted-foreground)' }}>{gemstone.skuCode}</p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <WishlistButton productId={Number(gemstone.id)} productType="gemstone" size="md" variant="minimal" />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                {formatPrice(gemstone.totalPrice)}
              </span>
              {gemstone.gemType && (
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--card-gem-icon-text) 12%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--card-gem-icon-text) 45%, transparent)',
                    color: 'var(--card-gem-icon-text)',
                  }}
                >
                  {gemTypeLabel(gemstone.gemType)}
                </span>
              )}
              {gemstone.caratWeight != null && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  {gemstone.caratWeight} ct
                </span>
              )}
              {gemstone.shape && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full border text-sm capitalize" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  {gemstone.shape}
                </span>
              )}
            </div>

            {gemstone.origin && (
              <div className="flex items-center gap-2 text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                <Award className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--card-gem-icon-text)' }} />
                <span>Origin: {gemstone.origin}</span>
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-mono">Seller: {gemstone.sellerId?.slice(-8) ?? 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <CompareButton product={productPayload} productType="gemstone" size="md" className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); router.push(detailHref); }}
                  className="p-2.5 border-2 rounded-lg transition-all duration-200"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}
                  className="px-6 py-2.5 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ——— Grid view (match jewelry grid layout) ———
  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
    >
      <Link href={detailHref} className="block" onClick={() => handleCardClick()}>
        <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--card)' }}>
          <GemstoneImageBlock images={gemstoneImages(gemstone)} alt={gemstone.name} className="w-full h-full" />

          <div onClick={(e) => e.stopPropagation()} className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <CompareButton product={productPayload} productType="gemstone" size="md" className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white" />
            <WishlistButton productId={Number(gemstone.id)} productType="gemstone" size="md" className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white" />
          </div>

          {gemstone.isOnAuction && (
            <div className="absolute top-3 left-3 px-3 py-1.5 text-white text-xs font-semibold rounded-full shadow-lg animate-pulse" style={{ backgroundColor: 'var(--destructive)' }}>
              Live Auction
            </div>
          )}
          {gemstone.quantity != null && gemstone.quantity > 1 && !gemstone.isOnAuction && (
            <div className="absolute top-3 left-3 px-3 py-1.5 text-white text-xs font-semibold rounded-full shadow" style={{ backgroundColor: 'var(--status-warning)' }}>
              {gemstone.quantity} pcs
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
        </div>
      </Link>

      <div className="p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
        <div>
          <Link href={detailHref} className="font-semibold mb-1 line-clamp-2 text-base transition-colors block hover:opacity-80" style={{ color: 'var(--foreground)' }}>
            {gemstone.name}
          </Link>
          <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{gemstone.skuCode}</p>
        </div>

        {(gemstone.gemType || gemstone.caratWeight != null || gemstone.shape) && (
          <div className="flex items-center gap-2 flex-wrap">
            {gemstone.gemType && (
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--card-gem-icon-text) 10%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--card-gem-icon-text) 45%, transparent)',
                  color: 'var(--card-gem-icon-text)',
                }}
              >
                {gemTypeLabel(gemstone.gemType)}
              </span>
            )}
            {gemstone.caratWeight != null && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                {gemstone.caratWeight} ct
              </span>
            )}
            {gemstone.shape && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full border text-xs capitalize" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                {gemstone.shape}
              </span>
            )}
          </div>
        )}

        <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Price</div>
              <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                {formatPrice(gemstone.totalPrice)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <MapPin className="w-3 h-3" />
              <span className="font-mono">{gemstone.sellerId?.slice(-8) ?? '—'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onAddToCart?.(); }}
              className="flex-1 px-4 py-2.5 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <Link
              href={detailHref}
              className="p-2.5 border-2 rounded-lg transition-all duration-200 inline-flex items-center justify-center active:scale-95"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GemstoneCard;
