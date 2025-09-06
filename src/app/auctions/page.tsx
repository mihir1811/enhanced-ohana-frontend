'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { auctionService } from '@/services/auctionService';
import { Clock, Search, RefreshCw } from 'lucide-react';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';

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
  attributes: any;
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
    <span className="text-sm text-slate-600">
      <Clock className="w-4 h-4 inline mr-1" />
      {timeLeft}
    </span>
  );
};

// Enhanced auction card with detailed information
const AuctionCard: React.FC<{ auction: AuctionItem }> = ({ auction }) => {
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

  return (
    <div className="group bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-slate-50 rounded-t-lg overflow-hidden">
        {/* Timer Badge */}
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm">
          <CountdownTimer endTime={endTime} />
        </div>

        {/* Product Type Badge */}
        <div className="absolute top-3 right-3 z-10 bg-slate-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
          {getProductTypeDisplay()}
        </div>

        {/* Bid Count Badge */}
        {bids.length > 0 && (
          <div className="absolute bottom-3 right-3 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
            {bids.length} bids
          </div>
        )}

        {/* Product Image */}
        {product.image1 ? (
          <img
            src={product.image1}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="text-5xl mb-2">💎</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}

        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Header Section */}
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-2 group-hover:text-slate-700 transition-colors">
            {product.name}
          </h3>
          
          {/* Product ID and Seller */}
          <div className="text-xs text-slate-500 mb-2">
            {/* <div>ID: {auction.id}</div> */}
            <div>By: {seller.companyName}</div>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="mb-4 space-y-2">
          {/* Gemstone Specifications */}
          {isGemstone && 'shape' in product && (
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-xs font-medium text-purple-700 mb-2">Gemstone Details</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-purple-600 text-xs">Type:</span>
                  <div className="font-medium text-purple-900">{product.gemsType}</div>
                </div>
                <div>
                  <span className="text-purple-600 text-xs">Shape:</span>
                  <div className="font-medium text-purple-900">{product.shape}</div>
                </div>
                <div>
                  <span className="text-purple-600 text-xs">Carat:</span>
                  <div className="font-medium text-purple-900">{product.carat} ct</div>
                </div>
                <div>
                  <span className="text-purple-600 text-xs">Color:</span>
                  <div className="font-medium text-purple-900">{product.color}</div>
                </div>
                <div>
                  <span className="text-purple-600 text-xs">Clarity:</span>
                  <div className="font-medium text-purple-900">{product.clarity}</div>
                </div>
                <div>
                  <span className="text-purple-600 text-xs">Origin:</span>
                  <div className="font-medium text-purple-900">{product.origin}</div>
                </div>
              </div>
            </div>
          )}

          {/* Jewelry Specifications */}
          {isJewelry && 'category' in product && (
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="text-xs font-medium text-amber-700 mb-2">Jewelry Details</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-amber-600 text-xs">Category:</span>
                  <div className="font-medium text-amber-900">{product.category}</div>
                </div>
                <div>
                  <span className="text-amber-600 text-xs">Metal:</span>
                  <div className="font-medium text-amber-900">{product.metalType}</div>
                </div>
                <div>
                  <span className="text-amber-600 text-xs">Purity:</span>
                  <div className="font-medium text-amber-900">{product.metalPurity}</div>
                </div>
                <div>
                  <span className="text-amber-600 text-xs">Weight:</span>
                  <div className="font-medium text-amber-900">{product.metalWeight}g</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="mb-5">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            {currentBid ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-700">Current Bid</span>
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    <span className="text-xs">Live</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  ${currentBid.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">
                  Starting: ${('totalPrice' in product ? product.basePrice : product.price).toLocaleString()}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-medium text-blue-700 mb-1">Starting Price</div>
                <div className="text-2xl font-bold text-blue-900">
                  ${displayPrice.toLocaleString()}
                </div>
                {isJewelry && 'makingCharge' in product && (
                  <div className="text-xs text-slate-600 mt-2">
                    Base: ${product.basePrice.toLocaleString()} + Making: ${product.makingCharge.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Auction Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>{auction.isActive ? 'Active Auction' : 'Ended'}</span>
            </div>
            {bids.length > 0 && (
              <span className="text-slate-600">
                {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button 
            disabled={!auction.isActive}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>🎯</span>
            {auction.isActive ? 'Place Bid' : 'Auction Ended'}
          </button>
          <div className="flex gap-2">
            <Link 
              href={`/auctions/${auction.id}`}
              className="flex-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-2 px-3 rounded-md text-sm transition-colors duration-200 border border-slate-200 text-center"
            >
              View Details
            </Link>
            <button className="flex-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-2 px-3 rounded-md text-sm transition-colors duration-200 border border-slate-200">
              Watch List
            </button>
          </div>
        </div>

        {/* Additional Info Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Auction #{auction.id}</span>
            <span>{seller.city}, {seller.state}</span>
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

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await auctionService.getLiveAuctions({
        productType: activeFilter as any,
        page: 1,
        limit: 12
      });

      console.log('API Response:', response); // Debug log

      if (response?.data?.data) {
        setAuctions(response.data.data);
      } else {
        setAuctions([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load auctions');
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [activeFilter]);

  const filters = [
    { value: '', label: 'All' },
    { value: 'diamond', label: 'Diamonds' },
    { value: 'gemstone', label: 'Gemstones' },
    { value: 'jewellery', label: 'Jewelry' }
  ];

  return (
    <>
      <NavigationUser />
      
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-light text-slate-900 mb-8">Live Auctions</h1>
            
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      activeFilter === filter.value
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              
              <button
                onClick={fetchAuctions}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200">
                  <div className="aspect-square bg-slate-100 rounded-t-lg animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
                    <div className="h-6 bg-slate-100 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3"></div>
                    <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="text-slate-600 mb-4">{error}</div>
              <button
                onClick={fetchAuctions}
                className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Auctions Grid */}
          {!loading && !error && auctions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {auctions
                .filter(auction => 
                  !searchQuery || 
                  auction.product.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))
              }
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && auctions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">No auctions found</h3>
              <p className="text-slate-600 mb-6">Check back later for new auctions</p>
              <button
                onClick={() => {
                  setActiveFilter('');
                  setSearchQuery('');
                  fetchAuctions();
                }}
                className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
