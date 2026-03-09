'use client'

import React, { useState } from 'react'
import Pagination from '../ui/Pagination';
import { Star, Grid, List, ArrowUpDown, ChevronDown, Filter as FilterIcon } from 'lucide-react'
import { GemstonItem } from '@/services/gemstoneService';
import { GemstoneCard } from '@/components/gemstones/GemstoneCard'

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
                  viewMode="grid"
                  detailHref={gemstoneType === 'melee' ? `/gemstones/melee/${gemstone.id}` : `/gemstones/single/${gemstone.id}`}
                  onSelect={() => onGemstoneSelect(gemstone)}
                  onAddToCart={() => onAddToCart(gemstone)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {gemstones.map(gemstone => (
                <GemstoneCard
                  key={gemstone.id}
                  gemstone={gemstone}
                  viewMode="list"
                  detailHref={gemstoneType === 'melee' ? `/gemstones/melee/${gemstone.id}` : `/gemstones/single/${gemstone.id}`}
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

export default GemstoneResults;
