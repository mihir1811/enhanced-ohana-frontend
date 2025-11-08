'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auctionService } from '@/services/auctionService';
import { Clock, Search, RefreshCw, Grid, List } from 'lucide-react';
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

// Minimalist countdown timer
const CountdownTimer: React.FC<{ endTime: string }> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }

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
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
      <Clock className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{timeLeft}</span>
    </div>
  );
};

// Enhanced auction card with detailed information
const AuctionCard: React.FC<{ auction: AuctionItem; viewMode: 'grid' | 'list' }> = ({ auction, viewMode }) => {
  const { product, bids, endTime, seller, productType } = auction;
  
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
      <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          {/* Image Section */}
          <Link 
            href={`/auctions/${auction.id}`}
            className="md:w-56 md:h-56 w-full h-64 flex-shrink-0 relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
          >
            {/* Timer Badge */}
            <div className="absolute top-2 left-2 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
              <CountdownTimer endTime={endTime} />
            </div>

            {/* Product Type Badge */}
            <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {getProductTypeDisplay()}
            </div>

            {/* Bid Count Badge */}
            {bids.length > 0 && (
              <div className="absolute bottom-2 left-2 z-10 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span>Seller:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{seller.companyName}</span>
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
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Pricing Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                  {currentBid ? (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Current Bid</span>
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          <span className="text-xs font-medium">Live</span>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        ${currentBid.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Started at: ${('totalPrice' in product ? product.basePrice : product.price).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Starting Price</div>
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        ${displayPrice.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link 
                    href={`/auctions/${auction.id}`}
                    className="flex-1 sm:flex-none bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white py-2.5 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                  >
                    {auction.isActive ? '🎯 Place Bid' : '⏰ Ended'}
                  </Link>
                  <Link 
                    href={`/auctions/${auction.id}`}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 dark:border-gray-600 text-center"
                  >
                    View Details
                  </Link>
                  <button className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 dark:border-gray-600">
                    <span className="text-lg">❤️</span>
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Auction #{auction.id}</span>
                <div className="flex items-center gap-3">
                  {auction.isActive ? (
                    <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>
                      Ended
                    </span>
                  )}
                  {bids.length > 0 && (
                    <span className="text-gray-600 dark:text-gray-400">
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
    <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {/* Timer Badge */}
        <div className="absolute top-3 left-3 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
          <CountdownTimer endTime={endTime} />
        </div>

        {/* Product Type Badge */}
        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
          {getProductTypeDisplay()}
        </div>

        {/* Bid Count Badge */}
        {bids.length > 0 && (
          <div className="absolute bottom-3 left-3 z-10 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
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
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {product.name}
        </h3>
        
        {/* Seller Info */}
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
          <span>By:</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{seller.companyName}</span>
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
        <div className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
          {currentBid ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Current Bid</span>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  <span className="text-xs font-medium">Live</span>
                </div>
              </div>
              <div className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                ${currentBid.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Starting: ${('totalPrice' in product ? product.basePrice : product.price).toLocaleString()}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Starting Price</div>
              <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                ${displayPrice.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link 
            href={`/auctions/${auction.id}`}
            className="w-full bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
          >
            {auction.isActive ? '🎯 Place Bid' : '⏰ Auction Ended'}
          </Link>
          <div className="flex gap-2">
            <Link 
              href={`/auctions/${auction.id}`}
              className="flex-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 border border-gray-200 dark:border-gray-600 text-center"
            >
              Details
            </Link>
            <button className="flex-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors duration-200 border border-gray-200 dark:border-gray-600">
              ❤️ Watch
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
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
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 py-6`}>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Live Auctions 🎯</h1>
            <p className="text-gray-600 dark:text-gray-400">Bid on premium diamonds, gemstones & jewelry</p>
          </div>
          
          {/* Filters Bar */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeFilter === filter.value
                        ? 'bg-gray-900 dark:bg-gray-700 text-white border border-gray-900 dark:border-gray-700'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
                
                <button
                  onClick={fetchAuctions}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-white dark:bg-gray-700 shadow border border-gray-200 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${
                      viewMode === 'grid' 
                        ? 'bg-gray-900 dark:bg-gray-600 text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${
                      viewMode === 'list' 
                        ? 'bg-gray-900 dark:bg-gray-600 text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Indicator */}
            {activeFilter && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Filter:</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm rounded-full">
                    {filters.find(f => f.value === activeFilter)?.label}
                    <button
                      onClick={() => setActiveFilter('')}
                      className="ml-1 hover:text-amber-900 dark:hover:text-amber-200"
                    >
                      ×
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {loading ? 'Loading...' : `Showing ${auctions.filter(a => !searchQuery || a.product.name.toLowerCase().includes(searchQuery.toLowerCase())).length} of ${auctions.length} auctions`}
            </p>
          </div>

          {/* Content */}
          <div>
            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-t-lg animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                      <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {error}
                </h3>
                <button
                  onClick={fetchAuctions}
                  className="mt-4 px-6 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
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
                    {auctions
                      .filter(auction => 
                        !searchQuery || 
                        auction.product.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} viewMode="grid" />
                      ))
                    }
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auctions
                      .filter(auction => 
                        !searchQuery || 
                        auction.product.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
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
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No auctions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Check back later for new auctions
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('');
                    setSearchQuery('');
                    fetchAuctions();
                  }}
                  className="px-6 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
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
