'use client';

import React, { useState, useEffect } from 'react';
import { auctionService } from '@/services/auctionService';
import { toast } from 'react-hot-toast';
import { Clock, Filter, Search, RefreshCw } from 'lucide-react';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { SECTION_WIDTH } from '@/lib/constants';

// Universal auction product interface
interface AuctionProduct {
  id: string;
  name: string;
  productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond';
  price?: number;
  basePrice?: number;
  totalPrice?: number;
  currentBid?: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  auctionId?: string;
  auctionStartTime?: string;
  auctionEndTime?: string;
  isOnAuction?: boolean;
  bidCount?: number;
  highestBid?: number;
  minimumBid?: number;
  // Diamond specific
  color?: string;
  clarity?: string;
  cut?: string;
  shape?: string;
  caratWeight?: string;
  // Gemstone specific
  stoneType?: string;
  origin?: string;
  treatment?: string;
  // Jewelry specific
  category?: string;
  metalType?: string;
  metalPurity?: string;
  attributes?: any;
  stones?: any[];
}

// Enhanced CountdownTimer Component with theme colors
const CountdownTimer: React.FC<{ endTime: string }> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (isExpired) {
    return (
      <div className="bg-destructive rounded-xl px-4 py-2 text-center shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-primary-foreground text-xs">⏰</span>
          <span className="text-primary-foreground font-bold text-sm">Auction Ended</span>
        </div>
      </div>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;
  const isCritical = timeLeft.days === 0 && timeLeft.hours < 1;

  const getTimerStyle = () => {
    if (isCritical) {
      return 'bg-destructive animate-pulse';
    } else if (isUrgent) {
      return 'bg-chart-1';
    } else {
      return 'bg-primary';
    }
  };

  const formatTime = () => {
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours.toString().padStart(2, '0')}h`;
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours.toString().padStart(2, '0')}h ${timeLeft.minutes.toString().padStart(2, '0')}m`;
    } else {
      return `${timeLeft.minutes.toString().padStart(2, '0')}m ${timeLeft.seconds.toString().padStart(2, '0')}s`;
    }
  };

  return (
    <div className={`${getTimerStyle()} rounded-xl px-4 py-2 text-center shadow-lg backdrop-blur-sm border border-border`}>
      <div className="flex items-center gap-2">
        <span className="text-primary-foreground text-xs">{isCritical ? '🚨' : isUrgent ? '⚡' : '⏱️'}</span>
        <div className="flex flex-col">
          <span className="text-primary-foreground font-bold text-sm leading-tight">
            {formatTime()}
          </span>
          <span className="text-primary-foreground/80 text-xs leading-tight">
            {isCritical ? 'ENDING SOON!' : 'remaining'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Enhanced Auction Product Card with theme colors
const AuctionProductCard: React.FC<{ product: AuctionProduct }> = ({ product }) => {
  const displayImages = [
    product.image1, product.image2, product.image3, 
    product.image4, product.image5, product.image6
  ].filter(Boolean);
  
  const getPrice = () => {
    return product.currentBid || product.highestBid || product.price || product.basePrice || product.totalPrice || 0;
  };

  const getProductTypeIcon = () => {
    switch (product.productType) {
      case 'diamond':
      case 'meleeDiamond':
        return '💎';
      case 'gemstone':
        return '💍';
      case 'jewellery':
        return '👑';
      default:
        return '💎';
    }
  };

  const formatProductType = () => {
    switch (product.productType) {
      case 'meleeDiamond':
        return 'Melee Diamond';
      case 'jewellery':
        return 'Jewelry';
      default:
        return product.productType.charAt(0).toUpperCase() + product.productType.slice(1);
    }
  };

  return (
    <div className="group bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-border hover:border-chart-1 hover:-translate-y-1">
      {/* Image Container with Overlay Elements */}
      <div className="relative h-72 bg-gradient-to-br from-muted to-secondary overflow-hidden">
        {/* Timer Badge - Top Left */}
        {product.auctionEndTime && (
          <div className="absolute top-4 left-4 z-20">
            <CountdownTimer endTime={product.auctionEndTime} />
          </div>
        )}

        {/* Product Type Badge - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border shadow-sm">
            <span className="text-xs font-medium text-foreground flex items-center gap-1">
              <span className="text-sm">{getProductTypeIcon()}</span>
              {formatProductType()}
            </span>
          </div>
        </div>

        {/* Bid Count Badge - Bottom Right */}
        {(product.bidCount || 0) > 0 && (
          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-chart-1/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-chart-1 shadow-sm">
              <span className="text-xs font-bold text-primary-foreground flex items-center gap-1">
                🔥 {product.bidCount} bids
              </span>
            </div>
          </div>
        )}

        {/* Product Image */}
        {displayImages.length > 0 ? (
          <div className="relative w-full h-full group">
            <img
              src={displayImages[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay for Better Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-secondary">
            <div className="text-center">
              <div className="text-6xl mb-3 opacity-50">🖼️</div>
              <p className="text-sm font-medium">No Image Available</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Product Info */}
      <div className="p-6">
        {/* Product Name */}
        <div className="mb-4">
          <h3 className="font-bold text-xl text-foreground mb-1 line-clamp-2 leading-tight group-hover:text-chart-1 transition-colors">
            {product.name}
          </h3>
          
          {/* Product Specifications */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
            {product.shape && (
              <span className="bg-muted px-2 py-1 rounded-full">{product.shape}</span>
            )}
            {product.caratWeight && (
              <span className="bg-muted px-2 py-1 rounded-full">{product.caratWeight} ct</span>
            )}
            {product.color && (
              <span className="bg-muted px-2 py-1 rounded-full">Color: {product.color}</span>
            )}
            {product.clarity && (
              <span className="bg-muted px-2 py-1 rounded-full">Clarity: {product.clarity}</span>
            )}
          </div>
        </div>

        {/* Enhanced Price Information */}
        <div className="space-y-3 mb-5">
          {/* Current Bid - Most Prominent */}
          {product.currentBid ? (
            <div className="bg-gradient-to-r from-chart-1/10 to-chart-1/20 rounded-lg p-3 border border-chart-1/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-chart-1">Current Highest Bid</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-chart-1">🔥</span>
                  <span className="text-lg font-bold text-chart-1">
                    ${product.currentBid.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-chart-2/10 to-chart-2/20 rounded-lg p-3 border border-chart-2/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-chart-2">Starting Price</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-chart-2">⭐</span>
                  <span className="text-lg font-bold text-chart-2">
                    ${getPrice().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info Row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground flex items-center gap-1">
                <span className="text-xs">💰</span>
                Base: ${getPrice().toLocaleString()}
              </span>
              {product.minimumBid && (
                <span className="text-muted-foreground flex items-center gap-1">
                  <span className="text-xs">📊</span>
                  Min: ${product.minimumBid.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col gap-2">
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
            <span className="flex items-center justify-center gap-2">
              <span>🎯</span>
              Place Bid
            </span>
          </button>
          
          <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 border border-border hover:border-ring">
            <span className="flex items-center justify-center gap-2">
              <span>👁️</span>
              View Details
            </span>
          </button>
        </div>
      </div>

      {/* Premium Border Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-chart-1/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
    </div>
  );
};

// Custom styles for animations with theme colors
const customStyles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
    opacity: 0;
  }
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }
  .shimmer {
    background: linear-gradient(90deg, hsl(var(--muted)) 0px, hsl(var(--secondary)) 40px, hsl(var(--muted)) 80px);
    background-size: 400px;
    animation: shimmer 1.5s ease-in-out infinite;
  }
`;

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<AuctionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState('diamond');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 12;

  // Fetch auctions
  const fetchAuctions = async (pageNum = 1, productType = '', search = '') => {
    try {
      setLoading(true);
      setError(null);

      const response = await auctionService.getLiveAuctions({
        productType: productType as any,
        page: pageNum,
        limit,
        sort: '-createdAt'
      });

      if (response?.data?.data) {
        setAuctions(response.data.data);
        
        // Calculate total pages from response
        const total = response.data.meta?.total || response.data.data.length;
        setTotalPages(Math.ceil(total / limit));
      } else {
        setAuctions([]);
      }
    } catch (err: any) {
      console.error('Error fetching auctions:', err);
      setError(err.message || 'Failed to load auctions');
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAuctions(1, activeFilter, searchQuery);
    setPage(1);
  }, [activeFilter, searchQuery]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchAuctions(newPage, activeFilter, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter changes
  const handleFilterChange = (type: string) => {
    setActiveFilter(type);
  };

  const handleRefresh = () => {
    fetchAuctions(page, activeFilter, searchQuery);
    toast.success('Auctions refreshed!');
  };

  const productTypes = [
    { value: 'diamond', label: 'Diamonds', count: 0 },
    { value: 'gemstone', label: 'Gemstones', count: 0 },
    { value: 'jewellery', label: 'Jewelry', count: 0 }
  ];

  return (
    <>
      <NavigationUser />
      <section className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 py-12`}>
        <style jsx>{customStyles}</style>
        
        <div className="min-h-screen bg-background">
          {/* Header Section */}
          <div className="bg-card border-b border-border">
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold text-foreground mb-6">Featured Auctions</h1>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6">
                {productTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleFilterChange(type.value)}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                      activeFilter === type.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Search and Refresh */}
              <div className="flex items-center gap-4 justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search auctions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-chart-2 text-primary-foreground rounded-lg hover:bg-chart-2/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {/* Enhanced Loading State with Skeleton Cards */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
                    {/* Skeleton Image */}
                    <div className="h-72 bg-muted shimmer"></div>
                    
                    {/* Skeleton Content */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="h-6 bg-muted rounded shimmer"></div>
                        <div className="h-4 bg-muted rounded w-3/4 shimmer"></div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="h-12 bg-secondary rounded-lg shimmer"></div>
                        <div className="flex gap-2">
                          <div className="h-4 bg-muted rounded flex-1 shimmer"></div>
                          <div className="h-4 bg-muted rounded flex-1 shimmer"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="h-12 bg-muted rounded-xl shimmer"></div>
                        <div className="h-10 bg-secondary rounded-xl shimmer"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Error State */}
            {error && !loading && (
              <div className="text-center py-16">
                <div className="bg-card rounded-2xl shadow-lg max-w-md mx-auto p-8 border border-destructive/20">
                  <div className="text-6xl mb-4">😞</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Something went wrong</h3>
                  <p className="text-destructive text-base mb-6 leading-relaxed">{error}</p>
                  <button
                    onClick={() => fetchAuctions(page, activeFilter, searchQuery)}
                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Auctions Grid */}
            {!loading && !error && auctions.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
                  {auctions.map((auction, index) => (
                    <div 
                      key={auction.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <AuctionProductCard product={auction} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg ${
                              page === pageNum
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card border border-border text-foreground hover:bg-muted'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Enhanced Empty State */}
            {!loading && !error && auctions.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-card rounded-2xl shadow-lg max-w-lg mx-auto p-12 border border-border">
                  <div className="text-8xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">No auctions found</h3>
                  <p className="text-muted-foreground text-lg mb-2 leading-relaxed">
                    {searchQuery 
                      ? `No results for "${searchQuery}"`
                      : activeFilter 
                        ? `No ${activeFilter} auctions are currently active.`
                        : 'Check back later for new auctions.'}
                  </p>
                  <p className="text-muted-foreground text-base mb-8">
                    Be the first to know when new auctions go live!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('diamond');
                      }}
                      className="px-6 py-3 bg-chart-2 hover:bg-chart-2/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <span className="flex items-center gap-2">
                        <span>🔄</span>
                        Clear Filters
                      </span>
                    </button>
                    
                    <button
                      onClick={handleRefresh}
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
