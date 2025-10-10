'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Grid, List, Loader2, Eye, Heart, ShoppingCart, MapPin, Star } from 'lucide-react';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { gemstoneService, GemstonItem } from '@/services/gemstoneService';
import GemstoneFilters, { GemstoneFilterValues } from '@/components/gemstones/GemstoneFilters';
import WishlistButton from '@/components/shared/WishlistButton';

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

export default function GemstoneProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams?.get('category') || 'all';

  // State
  const [gemstones, setGemstones] = useState<GemstonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('-createdAt');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Gemstone filters
  const [filters, setFilters] = useState<GemstoneFilterValues>({
    gemstoneType: category !== 'all' ? [category] : [],
    caratWeight: { min: 0.1, max: 50 },
    color: [],
    clarity: [],
    cut: [],
    priceRange: { min: 0, max: 100000 },
    certification: [],
    origin: [],
    treatment: [],
    enhancement: [],
    transparency: [],
    luster: [],
    phenomena: [],
    location: [],
    companyName: '',
    vendorLocation: '',
    reportNumber: '',
    searchTerm: ''
  });

  // Clear filters function
  const clearFilters = () => {
    setFilters({
      gemstoneType: [],
      caratWeight: { min: 0.1, max: 50 },
      color: [],
      clarity: [],
      cut: [],
      priceRange: { min: 0, max: 100000 },
      certification: [],
      origin: [],
      treatment: [],
      enhancement: [],
      transparency: [],
      luster: [],
      phenomena: [],
      location: [],
      companyName: '',
      vendorLocation: '',
      reportNumber: '',
      searchTerm: ''
    });
    setSearchQuery('');
    setSortBy('-createdAt');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Fetch gemstone data
  const fetchGemstones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        category: category !== 'all' ? category : undefined,
        search: searchQuery || undefined,
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy
      };

      const response = await gemstoneService.getAllGemstones(queryParams);

      if (response.success) {
        setGemstones(response.data.data || []);
        setPagination({
          page: response.data.meta.currentPage,
          limit: response.data.meta.perPage,
          total: response.data.meta.total,
          totalPages: response.data.meta.lastPage
        });
      }
    } catch (err) {
      setError('Failed to fetch gemstones. Please try again.');
      console.error('Error fetching gemstones:', err);
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery, pagination.page, pagination.limit, sortBy]);

  // Load data on mount and changes
  useEffect(() => {
    fetchGemstones();
  }, [fetchGemstones]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle filter change
  const handleFiltersChange = (newFilters: GemstoneFilterValues) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const categoryTitle = category === 'all' ? 'All Gemstones' : `${category.charAt(0).toUpperCase() + category.slice(1)} Gemstones`;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationUser />
      
      <div className="container mx-auto px-6 pb-8 pt-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {categoryTitle}
          </h1>
          <p className="text-slate-600">
            Discover beautiful {categoryTitle.toLowerCase()} with comprehensive filtering and search
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg p-3 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search gemstones..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* View Mode */}
              <div className="flex border border-slate-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <GemstoneFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              gemstoneType="single"
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                {loading ? (
                  'Loading...'
                ) : (
                  `Showing ${gemstones.length} of ${pagination.total} results`
                )}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchGemstones}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && gemstones.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No gemstones found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Product Grid/List */}
            {!loading && !error && gemstones.length > 0 && (
              <>
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }>
                  {gemstones.map(item => (
                    <GemstoneCard key={item.id} item={item} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                      >
                        Previous
                      </button>
                      
                      {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                        const page = Math.max(1, pagination.page - 2) + index;
                        if (page > pagination.totalPages) return null;
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 border rounded-lg ${
                              page === pagination.page
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Gemstone Card Component
interface GemstoneCardProps {
  item: GemstonItem;
  viewMode: 'grid' | 'list';
}

function GemstoneCard({ item, viewMode }: GemstoneCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-slate-100 rounded-lg flex-shrink-0">
            {item.image1 ? (
              <img 
                src={item.image1} 
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                No Image
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-medium text-slate-900">{item.name}</h3>
              <WishlistButton productId={Number(item.id)} productType="gemstone" />
            </div>
            
            <p className="text-slate-600 text-sm mb-2">{item.skuCode}</p>
            
            <div className="flex items-center gap-4 mb-3">
              <span className="text-2xl font-bold text-slate-900">
                ${item.totalPrice?.toLocaleString() || 'Price on request'}
              </span>
              
              {item.gemType && (
                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                  {item.gemType.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
              )}
              
              {item.caratWeight && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {item.caratWeight}ct
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Seller ID: {item.sellerId.slice(-8)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative aspect-square bg-slate-100">
        {item.image1 ? (
          <img 
            src={item.image1} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-slate-200 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <WishlistButton productId={Number(item.id)} productType="gemstone" />
        </div>
        
        {item.isOnAuction && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs rounded">
            Auction
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-slate-900 mb-1 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-slate-600 mb-2">{item.skuCode}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-slate-900">
            ${item.totalPrice?.toLocaleString() || 'POA'}
          </span>
          
          <div className="flex gap-1">
            {item.gemType && (
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                {item.gemType.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>
            )}
            {item.caratWeight && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {item.caratWeight}ct
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>ID: {item.sellerId.slice(-8)}</span>
          </div>
          
          {item.origin && (
            <div className="text-xs text-slate-500">
              {item.origin}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex-1 px-3 py-2 bg-slate-900 text-white text-sm rounded hover:bg-slate-800 flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button className="p-2 border border-slate-300 rounded hover:bg-slate-50">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
