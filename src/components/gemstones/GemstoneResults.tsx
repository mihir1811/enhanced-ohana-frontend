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
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white rounded-lg p-4 shadow-sm">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1">
            {gemstoneType === 'single' ? 'Single Gemstones' : 'Melee Gemstones'}
          </h2>
          <p className="text-sm text-gray-600">
            {totalCount} {totalCount === 1 ? 'gemstone' : 'gemstones'} found
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile filter button */}
          <button
            onClick={handleFilterToggle}
            className="md:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FilterIcon className="w-4 h-4" />
            Filters
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      sortBy === option.value ? 'bg-amber-50 text-amber-700' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View mode toggles */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* No results */}
      {gemstones.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="max-w-md mx-auto">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gemstones found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more results.
            </p>
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
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative aspect-square bg-gray-100">
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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Star className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <WishlistButton productId={Number(gemstone.id)} productType="gemstone" />
        </div>
        
        {gemstone.isOnAuction && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs rounded">
            Auction
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{gemstone.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{gemstone.skuCode}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(gemstone.totalPrice)}
          </span>
          
          <div className="flex gap-1">
            {gemstone.gemType && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {gemstone.gemType.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>
            )}
            {gemstone.caratWeight && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                {gemstone.caratWeight}ct
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onSelect}
            className="flex-1 px-3 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button
            onClick={onAddToCart}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <ShoppingCart className="w-4 h-4" />
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
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0">
          {gemstone.image1 ? (
            <img 
              src={gemstone.image1} 
              alt={gemstone.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Star className="w-8 h-8" />
            </div>
          )}
          <div className="absolute top-2 left-2 z-10">
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
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">{gemstone.name}</h3>
            <WishlistButton productId={Number(gemstone.id)} productType="gemstone" />
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{gemstone.skuCode}</p>
          
          <div className="flex items-center gap-4 mb-3">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(gemstone.totalPrice)}
            </span>
            
            <div className="flex gap-2">
              {gemstone.gemType && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {gemstone.gemType.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
              )}
              {gemstone.caratWeight && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                  {gemstone.caratWeight}ct
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {gemstone.origin && (
                <span>Origin: {gemstone.origin}</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onSelect}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={onAddToCart}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
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
