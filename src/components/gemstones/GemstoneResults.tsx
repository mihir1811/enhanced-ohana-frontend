'use client'

import React, { useState } from 'react'
import Pagination from '../ui/Pagination';
import { Heart, ShoppingCart, Share2, Download, Star, Award, Shield, Eye, Grid, List, ArrowUpDown, ChevronDown, Filter as FilterIcon} from 'lucide-react'
import WishlistButton from '@/components/shared/WishlistButton'
import { GemstonItem } from '@/services/gemstoneService';
import CompareButton from '@/components/compare/CompareButton'

export interface GemstoneResultsProps {
  gemstones: GemstonItem[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onGemstoneSelect: (gemstone: GemstonItem) => void;
  onAddToCart: (gemstone: GemstonItem) => void;
  gemstoneType: 'single' | 'melee';
}

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'totalPrice', label: 'Price: Low to High' },
  { value: '-totalPrice', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: '-name', label: 'Name: Z to A' },
  { value: 'caratWeight', label: 'Carat: Low to High' },
  { value: '-caratWeight', label: 'Carat: High to Low' }
];

const GemstoneResults: React.FC<GemstoneResultsProps> = ({
  gemstones,
  loading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onGemstoneSelect,
  onAddToCart,
  gemstoneType
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const formatPrice = (price: number | string | undefined) => {
    if (!price) return 'Price on Request';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const handleFilterToggle = () => {
    // Dispatch custom event to parent component
    window.dispatchEvent(new CustomEvent('openGemstoneFilters'));
  };

  if (loading) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Loading...</h2>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-xl shadow-sm p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="animate-pulse">
                <div className="aspect-square rounded-lg mb-4" style={{ backgroundColor: 'var(--muted)' }}></div>
                <div className="h-4 rounded mb-2 w-full" style={{ backgroundColor: 'var(--muted)' }}></div>
                <div className="h-4 rounded mb-2 w-2/3" style={{ backgroundColor: 'var(--muted)' }}></div>
                <div className="h-6 rounded w-1/2" style={{ backgroundColor: 'var(--muted)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 rounded-xl p-4 border shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
            {gemstoneType === 'single' ? 'Single Gemstones' : 'Melee Gemstones'}
          </h2>
          <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
            {totalCount} {totalCount === 1 ? 'gemstone' : 'gemstones'} found
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile filter button */}
          <button
            onClick={handleFilterToggle}
            className="md:hidden flex items-center gap-2 px-4 py-2 text-sm font-bold border rounded-xl transition-all active:scale-95"
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
          >
            <FilterIcon className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
            Filters
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold border rounded-xl transition-all active:scale-95"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
            >
              <ArrowUpDown className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
              Sort
              <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
            
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-56 border rounded-xl shadow-2xl z-[60] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200" style={{ backgroundColor: 'color-mix(in srgb, var(--card) 98%, transparent)', borderColor: 'var(--border)' }}>
                <div className="p-2">
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group flex items-center justify-between"
                      style={{ 
                        backgroundColor: sortBy === option.value ? 'color-mix(in srgb, var(--status-warning) 10%, transparent)' : 'transparent',
                        color: sortBy === option.value ? 'var(--status-warning)' : 'var(--foreground)'
                      }}
                      onMouseEnter={(e) => {
                        if (sortBy !== option.value) {
                          e.currentTarget.style.backgroundColor = 'var(--accent)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (sortBy !== option.value) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {option.label}
                      {sortBy === option.value && (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-warning)' }}></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View mode toggles */}
          <div className="flex border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className="p-2.5 transition-all"
              style={{ 
                backgroundColor: viewMode === 'grid' ? 'var(--status-warning)' : 'var(--background)',
                color: viewMode === 'grid' ? 'white' : 'var(--muted-foreground)'
              }}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-2.5 transition-all"
              style={{ 
                backgroundColor: viewMode === 'list' ? 'var(--status-warning)' : 'var(--background)',
                color: viewMode === 'list' ? 'white' : 'var(--muted-foreground)'
              }}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* No results */}
      {gemstones.length === 0 && !loading && (
        <div className="text-center py-20 rounded-2xl border shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--muted)' }}>
              <Star className="w-10 h-10" style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>No gemstones found</h3>
            <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>
              Try adjusting your search criteria or filters to find more results.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
              style={{ backgroundColor: 'var(--status-warning)', color: 'white' }}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {gemstones.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {gemstones.map(gemstone => (
                <GemstoneCard
                  key={gemstone.id}
                  gemstone={gemstone}
                  onSelect={() => onGemstoneSelect(gemstone)}
                  onAddToCart={() => onAddToCart(gemstone)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {gemstones.map(gemstone => (
                <GemstoneListItem
                  key={gemstone.id}
                  gemstone={gemstone}
                  onSelect={() => onGemstoneSelect(gemstone)}
                  onAddToCart={() => onAddToCart(gemstone)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / pageSize)}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}

      {/* Click outside to close sort dropdown */}
      {showSortDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowSortDropdown(false)}
        />
      )}
    </div>
  );
};

// Gemstone Card Component for Grid View
interface GemstoneCardProps {
  gemstone: GemstonItem;
  onSelect: () => void;
  onAddToCart: () => void;
}

const GemstoneCard: React.FC<GemstoneCardProps> = ({ gemstone, onSelect, onAddToCart }) => {
  const formatPrice = (price: number | string | undefined) => {
    if (!price) return 'POA';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="relative aspect-square" style={{ backgroundColor: 'var(--muted)' }}>
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <CompareButton
            product={{
              id: gemstone.id,
              name: gemstone.name,
              price: gemstone.totalPrice ?? 0,
              images: [gemstone.image1, gemstone.image2, gemstone.image3, gemstone.image4, gemstone.image5, gemstone.image6].filter(Boolean) as string[],
            }}
            productType="gemstone"
            size="md"
          />
        </div>
        {gemstone.image1 ? (
          <img 
            src={gemstone.image1} 
            alt={gemstone.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
            <div className="text-center">
              <Star className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-wider opacity-40">No Image</p>
            </div>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <WishlistButton productId={Number(gemstone.id)} productType="gemstone" />
        </div>
        
        {gemstone.isOnAuction && (
          <div className="absolute top-3 left-3 px-3 py-1 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg" style={{ backgroundColor: 'var(--destructive)' }}>
            Auction
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="mb-1">
          {gemstone.gemType && (
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--status-warning)' }}>
              {gemstone.gemType.replace('-', ' ')}
            </span>
          )}
        </div>
        <h3 className="font-bold mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors" style={{ color: 'var(--foreground)' }}>{gemstone.name}</h3>
        <p className="text-xs font-medium mb-4" style={{ color: 'var(--muted-foreground)' }}>{gemstone.skuCode}</p>
        
        <div className="flex items-center justify-between mb-5">
          <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            {formatPrice(gemstone.totalPrice)}
          </span>
          
          {gemstone.caratWeight && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)', color: 'var(--status-warning)' }}>
              {gemstone.caratWeight}ct
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onSelect}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={onAddToCart}
            className="p-2.5 border rounded-xl transition-all active:scale-95 shadow-sm"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Gemstone List Item Component for List View
const GemstoneListItem: React.FC<GemstoneCardProps> = ({ gemstone, onSelect, onAddToCart }) => {
  const formatPrice = (price: number | string | undefined) => {
    if (!price) return 'Price on Request';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  return (
    <div className="rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border group" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="w-full sm:w-48 h-48 rounded-xl flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
          {gemstone.image1 ? (
            <img 
              src={gemstone.image1} 
              alt={gemstone.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
              <Star className="w-12 h-12 opacity-20" />
            </div>
          )}
          <div className="absolute top-3 left-3 z-10">
            <CompareButton
              product={{
                id: gemstone.id,
                name: gemstone.name,
                price: gemstone.totalPrice ?? 0,
                images: [gemstone.image1, gemstone.image2, gemstone.image3, gemstone.image4, gemstone.image5, gemstone.image6].filter(Boolean) as string[],
              }}
              productType="gemstone"
              size="sm"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="mb-1">
                {gemstone.gemType && (
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--status-warning)' }}>
                    {gemstone.gemType.replace('-', ' ')}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold group-hover:text-amber-600 transition-colors" style={{ color: 'var(--foreground)' }}>{gemstone.name}</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{gemstone.skuCode}</p>
            </div>
            <WishlistButton productId={Number(gemstone.id)} productType="gemstone" />
          </div>
          
          <div className="flex items-center gap-6 mb-6 mt-4">
            <span className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
              {formatPrice(gemstone.totalPrice)}
            </span>
            
            <div className="flex gap-2">
              {gemstone.caratWeight && (
                <span className="px-3 py-1.5 rounded-lg text-sm font-bold" style={{ backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)', color: 'var(--status-warning)' }}>
                  {gemstone.caratWeight}ct
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
              {gemstone.origin && (
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Origin: {gemstone.origin}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onSelect}
                className="flex-1 sm:flex-none px-6 py-3 border rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={onAddToCart}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                style={{ backgroundColor: 'var(--status-warning)', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--status-warning) 80%, black)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--status-warning)'}
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
};

export default GemstoneResults;
