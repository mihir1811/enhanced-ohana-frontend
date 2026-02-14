'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auctionService } from '@/services/auctionService';
import { Clock, Search, RefreshCw, Grid, List, Filter } from 'lucide-react';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { SECTION_WIDTH } from '@/lib/constants';

// API Response Interfaces
interface Seller {
  id: string;
  companyName: string;
  companyLogo?: string;
  city: string;
  state: string;
  country: string;
  sellerType: string;
  isVerified: boolean;
}

interface GemsProduct {
  id: number;
  name: string;
  gemsType: string;
  subType: string;
  composition: string;
  qualityGrade: string;
  quantity: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  price: number;
  carat: number;
  shape: string;
  color: string;
  clarity: string;
  origin: string;
  cut: string;
  dimension: string;
  treatment: string;
}

interface JewelryProduct {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  collection: string;
  gender: string;
  occasion: string;
  metalType: string;
  metalPurity: string;
  metalWeight: number;
  basePrice: number;
  makingCharge: number;
  tax: number;
  totalPrice: number;
  attributes: Record<string, unknown>;
  description: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
}

interface Bid {
  id: number;
  amount: number;
  userId: string;
  createdAt: string;
}

interface AuctionItem {
  id: number;
  productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond';
  productId: number;
  sellerId: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isSold: boolean;
  bids: Bid[];
  seller: Seller;
  product: GemsProduct | JewelryProduct;
}

// Minimalist countdown timer with status badge
const AuctionStatusBadge: React.FC<{ endTime: string; isActive: boolean; className?: string }> = ({ endTime, isActive, className }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(!isActive);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft('Ended');
      setIsEnded(true);
      return;
    }

    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
        setIsEnded(true);
        return;
      }

      setIsEnded(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [endTime, isActive]);

  return (
    <div 
      className={`absolute z-10 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm border flex items-center gap-1 ${className}`}
      style={{ 
        backgroundColor: isEnded ? 'rgba(239, 68, 68, 0.1)' : 'var(--card)', 
        borderColor: isEnded ? 'rgba(239, 68, 68, 0.5)' : 'var(--border)', 
        color: isEnded ? 'rgb(239, 68, 68)' : 'var(--foreground)'
      }}
    >
      <Clock className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{timeLeft}</span>
    </div>
  );
};

// Enhanced auction card with detailed information
const AuctionCard: React.FC<{ auction: AuctionItem; viewMode: 'grid' | 'list' }> = ({ auction, viewMode }) => {
  const { product, bids, endTime, seller, productType, isActive } = auction;
  
  // Get current bid (highest bid from bids array)
  const currentBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.amount)) : null;
  
  // Get display price based on product type
  const getDisplayPrice = () => {
    if (currentBid) return currentBid;
    
    if ('totalPrice' in product) {
      return product.totalPrice || product.basePrice;
    } else if ('price' in product) {
      return product.price;
    }
    return 0;
  };
  
  const displayPrice = getDisplayPrice();
  
  // Get starting price safely
  const startingPrice = 'totalPrice' in product 
    ? (product.basePrice ?? product.totalPrice ?? 0)
    : (product.price ?? 0);
  
  const getProductTypeDisplay = () => {
    switch (productType) {
      case 'meleeDiamond':
        return 'Melee Diamond';
      case 'jewellery':
        return 'Jewelry';
      default:
        return productType.charAt(0).toUpperCase() + productType.slice(1);
    }
  };

  // Check if product is gemstone type
  const isGemstone = productType === 'gemstone';
  const isJewelry = productType === 'jewellery';

  // List view layout
  if (viewMode === 'list') {
    return (
      <div className="group rounded-lg shadow-sm hover:shadow-md transition-shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex flex-col md:flex-row gap-4 p-4">
          {/* Image Section */}
          <Link 
            href={`/auctions/${auction.id}`}
            className="md:w-56 md:h-56 w-full h-64 flex-shrink-0 relative rounded-lg overflow-hidden cursor-pointer"
            style={{ backgroundColor: 'var(--card)' }}
          >
            {/* Timer Badge */}
            <AuctionStatusBadge endTime={endTime} isActive={isActive} className="top-2 left-2" />

            {/* Product Type Badge */}
            <div className="absolute top-2 right-2 z-10 text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              {getProductTypeDisplay()}
            </div>

            {/* Bid Count Badge */}
            {bids.length > 0 && (
              <div className="absolute bottom-2 left-2 z-10 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                <span>🔥</span>
                {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
              </div>
            )}

            {/* Product Image */}
            {product.image1 ? (
              <Image
                src={product.image1}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-2">💎</div>
                  <div className="text-sm">No Image</div>
                </div>
              </div>
            )}
          </Link>

          {/* Content Section */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Header */}
            <div className="mb-3">
              <Link 
                href={`/auctions/${auction.id}`}
                className="block"
              >
                <h3 className="text-xl font-semibold mb-2 transition-colors line-clamp-2" style={{ color: 'var(--foreground)' }}>
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span>Seller:</span>
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>{seller.companyName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  📍 {seller.city}, {seller.state}
                </span>
              </div>
            </div>

            {/* Product Details Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              {isGemstone && 'shape' in product && (
                <>
                  <span className="text-xs px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md font-medium">
                    {product.gemsType}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md font-medium">
                    {product.shape}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md font-medium">
                    {product.carat} ct
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md font-medium">
                    {product.color}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md font-medium">
                    {product.clarity}
                  </span>
                  {product.origin && (
                    <span className="text-xs px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md font-medium">
                      {product.origin}
                    </span>
                  )}
                </>
              )}

              {isJewelry && 'category' in product && (
                <>
                  <span className="text-xs px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-md font-medium">
                    {product.category}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-md font-medium">
                    {product.metalType}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-md font-medium">
                    {product.metalPurity}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-md font-medium">
                    {product.metalWeight}g
                  </span>
                </>
              )}
            </div>

            {/* Bottom Section - Price and Actions */}
            <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Pricing Section */}
                <div className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  {currentBid ? (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Current Bid</span>
                        <div className="flex items-center" style={{ color: 'var(--muted-foreground)' }}>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          <span className="text-xs font-medium">Live</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                        ${currentBid.toLocaleString()}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        Started at: ${startingPrice.toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Starting Price</div>
                      <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                        ${displayPrice.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link 
                    href={`/auctions/${auction.id}`}
                    className="flex-1 sm:flex-none py-2.5 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    {auction.isActive ? '🎯 Place Bid' : '⏰ Ended'}
                  </Link>
                  <Link 
                    href={`/auctions/${auction.id}`}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border text-center"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'color-mix(in srgb, currentColor 14%, transparent)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent' }}
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, currentColor 14%, transparent)' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}>
                    <span className="text-lg">❤️</span>
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--muted-foreground)' }}>Auction #{auction.id}</span>
                <div className="flex items-center gap-3">
                  {auction.isActive ? (
                    <span className="flex items-center font-medium" style={{ color: 'var(--muted-foreground)' }}>
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center" style={{ color: 'var(--muted-foreground)' }}>
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>
                      Ended
                    </span>
                  )}
                  {bids.length > 0 && (
                    <span style={{ color: 'var(--muted-foreground)' }}>
                      {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view layout
  return (
    <div className="group rounded-lg shadow-sm hover:shadow-lg transition-all border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--card)' }}>
        {/* Timer Badge */}
        <AuctionStatusBadge endTime={endTime} isActive={isActive} className="top-3 left-3" />

        {/* Product Type Badge */}
        <div className="absolute top-3 right-3 z-10 text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
          {getProductTypeDisplay()}
        </div>

        {/* Bid Count Badge */}
        {bids.length > 0 && (
          <div className="absolute bottom-3 left-3 z-10 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
            <span>🔥</span>
            {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
          </div>
        )}

        {/* Product Image */}
        {product.image1 ? (
          <Image
            src={product.image1}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-2">💎</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-4" style={{ color: 'var(--foreground)' }}>
        {/* Product Name */}
        <h3 className="font-semibold text-base mb-2 line-clamp-2 transition-colors" style={{ color: 'var(--foreground)' }}>
          {product.name}
        </h3>
        
        {/* Seller Info */}
        <div className="text-xs mb-3 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
          <span>By:</span>
          <span className="font-medium" style={{ color: 'var(--foreground)' }}>{seller.companyName}</span>
        </div>

        {/* Product Details Badges */}
        <div className="mb-3 flex flex-wrap gap-2">
          {isGemstone && 'shape' in product && (
            <>
              <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                {product.shape}
              </span>
              <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                {product.carat} ct
              </span>
              <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                {product.color}
              </span>
            </>
          )}

          {isJewelry && 'category' in product && (
            <>
              <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                {product.metalType}
              </span>
              <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                {product.metalPurity}
              </span>
              <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">
                {product.metalWeight}g
              </span>
            </>
          )}
        </div>

        {/* Pricing Section */}
        <div className="mb-4 rounded-lg p-3 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          {currentBid ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Current Bid</span>
                <div className="flex items-center" style={{ color: 'var(--muted-foreground)' }}>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  <span className="text-xs font-medium">Live</span>
                </div>
              </div>
              <div className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                ${currentBid.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Starting: ${startingPrice.toLocaleString()}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Starting Price</div>
              <div className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                ${displayPrice.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link 
            href={`/auctions/${auction.id}`}
            className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            {auction.isActive ? '🎯 Place Bid' : '⏰ Auction Ended'}
          </Link>
          <div className="flex gap-2">
            <Link 
              href={`/auctions/${auction.id}`}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 border text-center"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'color-mix(in srgb, currentColor 14%, transparent)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent' }}
            >
              Details
            </Link>
            <button className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, currentColor 14%, transparent)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}>
              ❤️ Watch
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
            <span>#{auction.id}</span>
            <span className="flex items-center gap-1">
              📍 {seller.city}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [priceMin, setPriceMin] = useState<number | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');

  const getAuctionDisplayPrice = useCallback((auction: AuctionItem) => {
    const { bids, product } = auction;
    const currentBid = bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : null;
    if (currentBid) return currentBid;
    if ('totalPrice' in product) {
      return (product.totalPrice || product.basePrice) as number;
    }
    if ('price' in product) {
      return product.price as number;
    }
    return 0;
  }, []);

  const filteredAuctions = useMemo(() => {
    return auctions
      .filter(a => !searchQuery || a.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(a => {
        const price = getAuctionDisplayPrice(a);
        const minOk = priceMin === '' || price >= priceMin;
        const maxOk = priceMax === '' || price <= priceMax;
        return minOk && maxOk;
      });
  }, [auctions, searchQuery, priceMin, priceMax, getAuctionDisplayPrice]);

  const fetchAuctions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await auctionService.getLiveAuctions<{ data: AuctionItem[], meta?: unknown }>({
        productType: activeFilter === '' ? undefined : activeFilter as 'diamond' | 'gemstone' | 'jewellery',
        page: 1,
        limit: 12
      });

      console.log('API Response:', response); // Debug log

      if (response?.data?.data) {
        setAuctions(response.data.data);
      } else {
        setAuctions([]);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load auctions';
      setError(errorMessage);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const filters = [
    { value: '', label: 'All' },
    { value: 'diamond', label: 'Diamonds' },
    { value: 'gemstone', label: 'Gemstones' },
    { value: 'jewellery', label: 'Jewelry' }
  ];

  return (
    <>
      <NavigationUser />
      
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 py-6`}>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Live Auctions 🎯</h1>
            <p style={{ color: 'var(--muted-foreground)' }}>Bid on premium diamonds, gemstones & jewelry</p>
          </div>
          
          {/* Filters Bar */}
          <div className="mb-6 rounded-lg shadow-sm p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                    style={{
                      backgroundColor: activeFilter === filter.value ? 'var(--primary)' : 'var(--card)',
                      color: activeFilter === filter.value ? 'var(--primary-foreground)' : 'var(--foreground)',
                      borderColor: activeFilter === filter.value ? 'var(--primary)' : 'var(--border)',
                      borderWidth: 1,
                    }}
                    onMouseEnter={(e) => { if (activeFilter !== filter.value) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, currentColor 12%, transparent)' }}
                    onMouseLeave={(e) => { if (activeFilter !== filter.value) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--card)' }}
                  >
                    {filter.label}
                  </button>
                ))}
                
                <button
                  onClick={() => setFilterSidebarOpen(true)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow-md hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' }}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <button
                  onClick={fetchAuctions}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--muted-foreground)' }}
                  title="Refresh"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, currentColor 14%, transparent)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center shadow border rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition"
                    style={{
                      backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                      color: viewMode === 'grid' ? 'var(--primary-foreground)' : 'var(--foreground)'
                    }}
                    onMouseEnter={(e) => { if (viewMode !== 'grid') (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, currentColor 14%, transparent)' }}
                    onMouseLeave={(e) => { if (viewMode !== 'grid') (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition"
                    style={{
                      backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                      color: viewMode === 'list' ? 'var(--primary-foreground)' : 'var(--foreground)'
                    }}
                    onMouseEnter={(e) => { if (viewMode !== 'list') (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, currentColor 14%, transparent)' }}
                    onMouseLeave={(e) => { if (viewMode !== 'list') (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Indicator */}
            {activeFilter && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Active Filter:</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                    {filters.find(f => f.value === activeFilter)?.label}
                    <button
                      onClick={() => setActiveFilter('')}
                      className="ml-1"
                      style={{ color: 'var(--accent-foreground)' }}
                    >
                      ×
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>

          {isFilterSidebarOpen && (
            <div className="fixed inset-0 z-50">
              <div
                className="absolute inset-0"
                style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 14%, transparent)' }}
                onClick={() => setFilterSidebarOpen(false)}
              />
              <div className="absolute right-0 top-0 h-full w-full sm:w-[360px] border-l shadow-xl flex flex-col"
                   style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Filters</div>
                  <button
                    onClick={() => setFilterSidebarOpen(false)}
                    className="p-2 rounded-lg transition-colors hover:bg-[color:color-mix(in srgb, currentColor 40%, transparent)]"
                    style={{ color: 'var(--foreground)' }}
                    aria-label="Close filters"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                  <div>
                    <div className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Search</div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-lg border"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)', backgroundColor: 'var(--card)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Product Type</div>
                    <div className="grid grid-cols-2 gap-2">
                      {filters.map((f) => (
                        <button
                          key={f.value}
                          onClick={() => setActiveFilter(f.value)}
                          className="px-3 py-2 rounded-lg text-sm border transition-colors"
                          style={{
                            borderColor: 'var(--border)',
                            color: activeFilter === f.value ? 'var(--primary-foreground)' : 'var(--foreground)',
                            backgroundColor: activeFilter === f.value ? 'var(--primary)' : 'transparent'
                          }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Price Range</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--muted-foreground)' }}>$</span>
                        <input
                          type="number"
                          min={0}
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Min"
                          className="w-full pl-7 pr-3 py-2 rounded-lg border"
                          style={{ borderColor: 'var(--border)', color: 'var(--foreground)', backgroundColor: 'var(--card)' }}
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--muted-foreground)' }}>$</span>
                        <input
                          type="number"
                          min={0}
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Max"
                          className="w-full pl-7 pr-3 py-2 rounded-lg border"
                          style={{ borderColor: 'var(--border)', color: 'var(--foreground)', backgroundColor: 'var(--card)' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => { setActiveFilter(''); setSearchQuery(''); setPriceMin(''); setPriceMax(''); fetchAuctions(); setFilterSidebarOpen(false); }}
                    className="flex-1 px-4 py-2 rounded-lg border transition-colors hover:bg-[color:color-mix(in srgb, currentColor 40%, transparent)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => { fetchAuctions(); setFilterSidebarOpen(false); }}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p style={{ color: 'var(--muted-foreground)' }}>
              {loading ? 'Loading...' : `Showing ${filteredAuctions.length} of ${auctions.length} auctions`}
            </p>
          </div>

          {/* Content */}
          <div>
            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="rounded-lg border"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  >
                    <div 
                      className="aspect-square rounded-t-lg animate-pulse"
                      style={{ backgroundColor: 'var(--muted)' }}
                    ></div>
                    <div className="p-4 space-y-3">
                      <div 
                        className="h-4 rounded animate-pulse"
                        style={{ backgroundColor: 'var(--muted)' }}
                      ></div>
                      <div 
                        className="h-6 rounded animate-pulse"
                        style={{ backgroundColor: 'var(--muted)' }}
                      ></div>
                      <div 
                        className="h-4 rounded animate-pulse w-2/3"
                        style={{ backgroundColor: 'var(--muted)' }}
                      ></div>
                      <div 
                        className="h-10 rounded animate-pulse"
                        style={{ backgroundColor: 'var(--muted)' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div 
                className="text-center py-20 rounded-lg border"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  {error}
                </h3>
                <button
                  onClick={fetchAuctions}
                  className="mt-4 px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-colors border border-gray-200 dark:border-gray-800"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Auctions Grid/List */}
            {!loading && !error && auctions.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAuctions
                      .map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} viewMode="grid" />
                      ))
                    }
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAuctions
                      .map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} viewMode="list" />
                      ))
                    }
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && !error && auctions.length === 0 && (
              <div 
                className="text-center py-20 rounded-lg border"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  No auctions found
                </h3>
                <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
                  Check back later for new auctions
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('');
                    setSearchQuery('');
                    fetchAuctions();
                  }}
                  className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-colors border border-gray-200 dark:border-gray-800"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
