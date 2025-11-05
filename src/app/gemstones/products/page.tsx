'use client';

import { useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Grid, List, Loader2, Eye, ShoppingCart, MapPin, Star, X, ChevronDown } from 'lucide-react';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { gemstoneService, GemstonItem } from '@/services/gemstoneService';
import { GemstoneFilterValues } from '@/components/gemstones/GemstoneFilters';
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
    shape: [],
    caratWeight: { min: 0.1, max: 50 },
    color: [],
    clarity: [],
    cut: [],
    priceRange: { min: 0, max: 100000 },
    certification: [],
    origin: [],
    treatment: [],
    minerals: [],
    birthstones: [],
    length: { min: 0, max: 100 },
    width: { min: 0, max: 100 },
    height: { min: 0, max: 100 },
    searchTerm: ''
  });

  // Clear filters function
  const clearFilters = () => {
    setFilters({
      gemstoneType: [],
      shape: [],
      caratWeight: { min: 0.1, max: 50 },
      color: [],
      clarity: [],
      cut: [],
      priceRange: { min: 0, max: 100000 },
      certification: [],
      origin: [],
      treatment: [],
      minerals: [],
      birthstones: [],
      length: { min: 0, max: 100 },
      width: { min: 0, max: 100 },
      height: { min: 0, max: 100 },
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

  // Mobile filter sidebar state with animation
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Collapsible filter sections
  const [expandedSections, setExpandedSections] = useState<string[]>(['gemstoneType', 'shape', 'caratWeight']);
  
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionKey)
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };
  
  // Count applied filters
  const totalAppliedFilters = useMemo(() => {
    let count = 0;
    if (filters.gemstoneType.length > 0) count += filters.gemstoneType.length;
    if (filters.shape.length > 0) count += filters.shape.length;
    if (filters.color.length > 0) count += filters.color.length;
    if (filters.clarity.length > 0) count += filters.clarity.length;
    if (filters.cut.length > 0) count += filters.cut.length;
    if (filters.certification.length > 0) count += filters.certification.length;
    if (filters.origin.length > 0) count += filters.origin.length;
    if (filters.treatment.length > 0) count += filters.treatment.length;
    return count;
  }, [filters]);



  // Mount the drawer immediately when opening
  useEffect(() => {
    if (showFilters) {
      setDrawerVisible(true);
    }
  }, [showFilters]);

  // Instantly trigger the open animation after mount, before paint
  useLayoutEffect(() => {
    if (drawerVisible && showFilters) {
      setDrawerOpen(true);
    } else if (!showFilters) {
      setDrawerOpen(false);
    }
  }, [drawerVisible, showFilters]);

  const categoryTitle = category === 'all' ? 'All Gemstones' : `${category.charAt(0).toUpperCase() + category.slice(1)} Gemstones`;

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
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

        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Drawer for mobile filters with animation */}
          {drawerVisible && (
            <>
              {/* Overlay */}
              <div
                className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setShowFilters(false)}
                aria-label="Close filters overlay"
              />
              {/* Drawer */}
              <div
                className={`fixed top-0 right-0 w-full max-w-md h-full bg-white dark:bg-gray-900 z-[110] shadow-2xl p-0 flex flex-col transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ minHeight: '100vh' }}
                onTransitionEnd={() => {
                  if (!drawerOpen) setDrawerVisible(false);
                }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-5 sticky top-0 z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Filters
                    </h2>
                    <button
                      className="p-1.5 rounded-full hover:bg-white dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                      onClick={() => setShowFilters(false)}
                      aria-label="Close filters"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Applied Filters Count and Clear Button */}
                  <div className="flex items-center justify-between">
                    {totalAppliedFilters > 0 ? (
                      <>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {totalAppliedFilters} {totalAppliedFilters === 1 ? 'filter' : 'filters'} applied
                        </span>
                        <button
                          onClick={clearFilters}
                          className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
                        >
                          Clear all
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        No filters applied
                      </span>
                    )}
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    
                    {/* Price Range Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('priceRange')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Price Range
                          {(filters.priceRange.min > 0 || filters.priceRange.max > 0) && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                              ${filters.priceRange.min.toLocaleString()} - ${filters.priceRange.max.toLocaleString()}
                            </span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('priceRange') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('priceRange') && (
                        <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                          <div className="flex gap-3 mb-4">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Min Price</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                                <input
                                  type="number"
                                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  placeholder="0"
                                  min={0}
                                  step={100}
                                  value={filters.priceRange.min || ''}
                                  onChange={e => handleFiltersChange({ ...filters, priceRange: { ...filters.priceRange, min: e.target.value ? Number(e.target.value) : 0 } })}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Max Price</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                                <input
                                  type="number"
                                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  placeholder="No limit"
                                  min={0}
                                  step={100}
                                  value={filters.priceRange.max || ''}
                                  onChange={e => handleFiltersChange({ ...filters, priceRange: { ...filters.priceRange, max: e.target.value ? Number(e.target.value) : 0 } })}
                                />
                              </div>
                            </div>
                          </div>
                          {/* Quick Price Ranges */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Quick Select</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { label: 'Under $1K', min: 0, max: 1000 },
                                { label: '$1K - $5K', min: 1000, max: 5000 },
                                { label: '$5K - $10K', min: 5000, max: 10000 },
                                { label: '$10K - $25K', min: 10000, max: 25000 },
                                { label: '$25K - $50K', min: 25000, max: 50000 },
                                { label: 'Over $50K', min: 50000, max: 0 },
                              ].map(range => (
                                <button
                                  key={range.label}
                                  type="button"
                                  className="px-3 py-2 text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-amber-50 hover:border-amber-500 hover:text-amber-700 dark:hover:bg-amber-900/20 dark:hover:border-amber-600 dark:hover:text-amber-400 transition-all"
                                  onClick={() => handleFiltersChange({ ...filters, priceRange: { min: range.min, max: range.max } })}
                                >
                                  {range.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Gemstone Type Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('gemstoneType')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Gemstone Type
                          {filters.gemstoneType.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                              {filters.gemstoneType.length}
                            </span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('gemstoneType') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('gemstoneType') && (
                        <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                          {/* Search Input */}
                          <div className="mb-3">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search gemstone..."
                                className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                onChange={(e) => {
                                  const searchValue = e.target.value.toLowerCase();
                                  const options = document.querySelectorAll(`[data-filter-section="gemstoneType"] label`);
                                  options.forEach((option: Element) => {
                                    const text = option.textContent?.toLowerCase() || '';
                                    if (option instanceof HTMLElement) {
                                      option.style.display = text.includes(searchValue) ? 'flex' : 'none';
                                    }
                                  });
                                }}
                              />
                              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar" data-filter-section="gemstoneType">
                            {['Ruby', 'Sapphire', 'Emerald', 'Diamond', 'Tanzanite', 'Aquamarine', 'Topaz', 'Amethyst', 'Garnet', 'Opal', 'Tourmaline', 'Peridot'].map(type => {
                              const isSelected = filters.gemstoneType.includes(type);
                              return (
                                <label
                                  key={type}
                                  className={`flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-lg transition-all ${
                                    isSelected 
                                      ? 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30' 
                                      : 'hover:bg-white dark:hover:bg-gray-800'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      const next = isSelected
                                        ? filters.gemstoneType.filter(t => t !== type)
                                        : [...filters.gemstoneType, type];
                                      handleFiltersChange({ ...filters, gemstoneType: next });
                                    }}
                                    className="w-4 h-4 text-amber-600 border-gray-300 dark:border-gray-500 rounded focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer transition-all"
                                  />
                                  <span className={`text-sm select-none transition-colors ${
                                    isSelected 
                                      ? 'text-amber-900 dark:text-amber-100 font-medium' 
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {type}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shape Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('shape')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Shape
                          {filters.shape.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                              {filters.shape.length}
                            </span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('shape') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('shape') && (
                        <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                          {/* Search Input */}
                          <div className="mb-3">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search shape..."
                                className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                onChange={(e) => {
                                  const searchValue = e.target.value.toLowerCase();
                                  const options = document.querySelectorAll(`[data-filter-section="shape"] label`);
                                  options.forEach((option: Element) => {
                                    const text = option.textContent?.toLowerCase() || '';
                                    if (option instanceof HTMLElement) {
                                      option.style.display = text.includes(searchValue) ? 'flex' : 'none';
                                    }
                                  });
                                }}
                              />
                              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar" data-filter-section="shape">
                            {['Round', 'Oval', 'Cushion', 'Emerald', 'Pear', 'Marquise', 'Princess', 'Heart', 'Radiant'].map(shape => {
                              const isSelected = filters.shape.includes(shape);
                              return (
                                <label
                                  key={shape}
                                  className={`flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-lg transition-all ${
                                    isSelected 
                                      ? 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30' 
                                      : 'hover:bg-white dark:hover:bg-gray-800'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      const next = isSelected
                                        ? filters.shape.filter(s => s !== shape)
                                        : [...filters.shape, shape];
                                      handleFiltersChange({ ...filters, shape: next });
                                    }}
                                    className="w-4 h-4 text-amber-600 border-gray-300 dark:border-gray-500 rounded focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer transition-all"
                                  />
                                  <span className={`text-sm select-none transition-colors ${
                                    isSelected 
                                      ? 'text-amber-900 dark:text-amber-100 font-medium' 
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {shape}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Carat Weight Range */}
                    <div>
                      <button
                        onClick={() => toggleSection('caratWeight')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Carat Weight
                          {(filters.caratWeight.min > 0.1 || filters.caratWeight.max < 50) && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                              {filters.caratWeight.min}-{filters.caratWeight.max}ct
                            </span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('caratWeight') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('caratWeight') && (
                        <div className="px-5 pb-4 pt-2">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Min</label>
                              <input
                                type="number"
                                className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="0.1"
                                min={0}
                                step={0.01}
                                value={filters.caratWeight.min ?? ''}
                                onChange={e => handleFiltersChange({ ...filters, caratWeight: { ...filters.caratWeight, min: e.target.value ? Number(e.target.value) : 0 } })}
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Max</label>
                              <input
                                type="number"
                                className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="50"
                                min={0}
                                step={0.01}
                                value={filters.caratWeight.max ?? ''}
                                onChange={e => handleFiltersChange({ ...filters, caratWeight: { ...filters.caratWeight, max: e.target.value ? Number(e.target.value) : 0 } })}
                              />
                            </div>
                          </div>
                          <div className="mt-2.5 text-xs text-gray-500 dark:text-gray-400">
                            Range: {filters.caratWeight.min}ct - {filters.caratWeight.max}ct
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Color Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('color')}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Color
                          {filters.color.length > 0 && (
                            <span className="ml-1.5 text-xs font-normal text-gray-500">({filters.color.length})</span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('color') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('color') && (
                        <div className="px-5 pb-4 pt-2">
                          {/* Search Input */}
                          <div className="mb-3">
                            <input
                              type="text"
                              placeholder="Search color..."
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                              onChange={(e) => {
                                const searchValue = e.target.value.toLowerCase();
                                const options = document.querySelectorAll(`[data-filter-section="color"] label`);
                                options.forEach((option: Element) => {
                                  const text = option.textContent?.toLowerCase() || '';
                                  if (option instanceof HTMLElement) {
                                    option.style.display = text.includes(searchValue) ? 'flex' : 'none';
                                  }
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2.5 max-h-48 overflow-y-auto" data-filter-section="color">
                            {['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'White', 'Black', 'Multi-Color'].map(color => {
                              const isSelected = filters.color.includes(color);
                              return (
                                <label
                                  key={color}
                                  className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800/50 py-1.5 px-2 rounded transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      const next = isSelected
                                        ? filters.color.filter(c => c !== color)
                                        : [...filters.color, color];
                                      handleFiltersChange({ ...filters, color: next });
                                    }}
                                    className="w-4 h-4 text-amber-600 border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
                                    {color}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Clarity Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('clarity')}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Clarity
                          {filters.clarity.length > 0 && (
                            <span className="ml-1.5 text-xs font-normal text-gray-500">({filters.clarity.length})</span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('clarity') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('clarity') && (
                        <div className="px-5 pb-4 pt-2">
                          {/* Search Input */}
                          <div className="mb-3">
                            <input
                              type="text"
                              placeholder="Search clarity..."
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                              onChange={(e) => {
                                const searchValue = e.target.value.toLowerCase();
                                const options = document.querySelectorAll(`[data-filter-section="clarity"] label`);
                                options.forEach((option: Element) => {
                                  const text = option.textContent?.toLowerCase() || '';
                                  if (option instanceof HTMLElement) {
                                    option.style.display = text.includes(searchValue) ? 'flex' : 'none';
                                  }
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2.5 max-h-48 overflow-y-auto" data-filter-section="clarity">
                            {['FL', 'IF', 'VVS', 'VS', 'SI', 'I', 'Eye Clean', 'Slightly Included', 'Moderately Included'].map(clarity => {
                              const isSelected = filters.clarity.includes(clarity);
                              return (
                                <label
                                  key={clarity}
                                  className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800/50 py-1.5 px-2 rounded transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      const next = isSelected
                                        ? filters.clarity.filter(c => c !== clarity)
                                        : [...filters.clarity, clarity];
                                      handleFiltersChange({ ...filters, clarity: next });
                                    }}
                                    className="w-4 h-4 text-amber-600 border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
                                    {clarity}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Origin Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('origin')}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Origin
                          {filters.origin.length > 0 && (
                            <span className="ml-1.5 text-xs font-normal text-gray-500">({filters.origin.length})</span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('origin') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('origin') && (
                        <div className="px-5 pb-4 pt-2">
                          <div className="mb-3">
                            <input
                              type="text"
                              placeholder="Search origin..."
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                              onChange={(e) => {
                                const searchValue = e.target.value.toLowerCase();
                                const options = document.querySelectorAll(`[data-filter-section="origin"] label`);
                                options.forEach((option: Element) => {
                                  const text = option.textContent?.toLowerCase() || '';
                                  if (option instanceof HTMLElement) {
                                    option.style.display = text.includes(searchValue) ? 'flex' : 'none';
                                  }
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2.5 max-h-48 overflow-y-auto" data-filter-section="origin">
                            {['Myanmar', 'Sri Lanka', 'Thailand', 'Madagascar', 'Tanzania', 'Brazil', 'Colombia', 'Zambia', 'India', 'Australia'].map(origin => {
                              const isSelected = filters.origin.includes(origin);
                              return (
                                <label
                                  key={origin}
                                  className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800/50 py-1.5 px-2 rounded transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      const next = isSelected
                                        ? filters.origin.filter(o => o !== origin)
                                        : [...filters.origin, origin];
                                      handleFiltersChange({ ...filters, origin: next });
                                    }}
                                    className="w-4 h-4 text-amber-600 border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
                                    {origin}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Certification Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('certification')}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Certification
                          {filters.certification.length > 0 && (
                            <span className="ml-1.5 text-xs font-normal text-gray-500">({filters.certification.length})</span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('certification') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('certification') && (
                        <div className="px-5 pb-4 pt-2">
                          <div className="mb-3">
                            <input
                              type="text"
                              placeholder="Search certification..."
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                              onChange={(e) => {
                                const searchValue = e.target.value.toLowerCase();
                                const options = document.querySelectorAll(`[data-filter-section="certification"] label`);
                                options.forEach((option: Element) => {
                                  const text = option.textContent?.toLowerCase() || '';
                                  if (option instanceof HTMLElement) {
                                    option.style.display = text.includes(searchValue) ? 'flex' : 'none';
                                  }
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2.5 max-h-48 overflow-y-auto" data-filter-section="certification">
                            {['GIA', 'IGI', 'AGS', 'GRS', 'Gubelin', 'SSEF', 'AGL', 'Lotus', 'GIT', 'ICA', 'GAGTL', 'EGL', 'HRD', 'None'].map(cert => {
                              const isSelected = filters.certification.includes(cert);
                              return (
                                <label
                                  key={cert}
                                  className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800/50 py-1.5 px-2 rounded transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      const next = isSelected
                                        ? filters.certification.filter(c => c !== cert)
                                        : [...filters.certification, cert];
                                      handleFiltersChange({ ...filters, certification: next });
                                    }}
                                    className="w-4 h-4 text-amber-600 border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
                                    {cert}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cut Quality Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('cut')}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Cut Quality
                          {filters.cut.length > 0 && (
                            <span className="ml-1.5 text-xs font-normal text-gray-500">({filters.cut.length})</span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('cut') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('cut') && (
                        <div className="px-5 pb-4 pt-2">
                          <div className="mb-3">
                            <input
                              type="text"
                              placeholder="Search cut quality..."
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                              onChange={(e) => {
                                const searchValue = e.target.value.toLowerCase();
                                const options = document.querySelectorAll(`[data-filter-section="cut"] label`);
                                options.forEach((option: Element) => {
                                  const text = option.textContent?.toLowerCase() || '';
                                  if (option instanceof HTMLElement) {
                                    option.style.display = text.includes(searchValue) ? 'flex' : 'none';
                                  }
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2.5 max-h-48 overflow-y-auto" data-filter-section="cut">
                            {['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Custom', 'Native'].map(cut => {
                              const isSelected = filters.cut.includes(cut);
                              return (
                                <label
                                  key={cut}
                                  className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800/50 py-1.5 px-2 rounded transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      const next = isSelected
                                        ? filters.cut.filter(c => c !== cut)
                                        : [...filters.cut, cut];
                                      handleFiltersChange({ ...filters, cut: next });
                                    }}
                                    className="w-4 h-4 text-amber-600 border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
                                    {cut}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Treatment Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('treatment')}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Treatment
                          {filters.treatment.length > 0 && (
                            <span className="ml-1.5 text-xs font-normal text-gray-500">({filters.treatment.length})</span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('treatment') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('treatment') && (
                        <div className="px-5 pb-4 pt-2">
                          <div className="mb-3">
                            <input
                              type="text"
                              placeholder="Search treatment..."
                              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                              onChange={(e) => {
                                const searchValue = e.target.value.toLowerCase();
                                const options = document.querySelectorAll(`[data-filter-section="treatment"] label`);
                                options.forEach((option: Element) => {
                                  const text = option.textContent?.toLowerCase() || '';
                                  if (option instanceof HTMLElement) {
                                    option.style.display = text.includes(searchValue) ? 'flex' : 'none';
                                  }
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2.5 max-h-48 overflow-y-auto" data-filter-section="treatment">
                            {['None (Natural)', 'Heat Treated', 'No Heat', 'Diffusion', 'Irradiation', 'Oil/Resin', 'Fracture Filling', 'Dyeing', 'HPHT', 'Surface Coating', 'Clarity Enhanced', 'Color Enhanced'].map(treatment => {
                              const isSelected = filters.treatment.includes(treatment);
                              return (
                                <label
                                  key={treatment}
                                  className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800/50 py-1.5 px-2 rounded transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      const next = isSelected
                                        ? filters.treatment.filter(t => t !== treatment)
                                        : [...filters.treatment, treatment];
                                      handleFiltersChange({ ...filters, treatment: next });
                                    }}
                                    className="w-4 h-4 text-amber-600 border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
                                    {treatment}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dimensions Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('dimensions')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Dimensions (mm)
                          {((filters.length.min > 0 || filters.length.max > 0) || (filters.width.min > 0 || filters.width.max > 0) || (filters.height.min > 0 || filters.height.max > 0)) && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                              Set
                            </span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('dimensions') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('dimensions') && (
                        <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20 space-y-4">
                          {/* Length */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Length
                            </label>
                            <div className="flex gap-3">
                              <div className="flex-1 relative">
                                <input
                                  type="number"
                                  className="w-full pr-3 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  placeholder="Min"
                                  min={0}
                                  step={0.1}
                                  value={filters.length.min || ''}
                                  onChange={e => handleFiltersChange({ ...filters, length: { ...filters.length, min: e.target.value ? Number(e.target.value) : 0 } })}
                                />
                              </div>
                              <div className="flex-1 relative">
                                <input
                                  type="number"
                                  className="w-full pr-3 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  placeholder="Max"
                                  min={0}
                                  step={0.1}
                                  value={filters.length.max || ''}
                                  onChange={e => handleFiltersChange({ ...filters, length: { ...filters.length, max: e.target.value ? Number(e.target.value) : 0 } })}
                                />
                              </div>
                            </div>
                          </div>
                          {/* Width */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Width
                            </label>
                            <div className="flex gap-3">
                              <div className="flex-1 relative">
                                <input
                                  type="number"
                                  className="w-full pr-3 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  placeholder="Min"
                                  min={0}
                                  step={0.1}
                                  value={filters.width.min || ''}
                                  onChange={e => handleFiltersChange({ ...filters, width: { ...filters.width, min: e.target.value ? Number(e.target.value) : 0 } })}
                                />
                              </div>
                              <div className="flex-1 relative">
                                <input
                                  type="number"
                                  className="w-full pr-3 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  placeholder="Max"
                                  min={0}
                                  step={0.1}
                                  value={filters.width.max || ''}
                                  onChange={e => handleFiltersChange({ ...filters, width: { ...filters.width, max: e.target.value ? Number(e.target.value) : 0 } })}
                                />
                              </div>
                            </div>
                          </div>
                          {/* Height/Depth */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Height/Depth
                            </label>
                            <div className="flex gap-3">
                              <div className="flex-1 relative">
                                <input
                                  type="number"
                                  className="w-full pr-3 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  placeholder="Min"
                                  min={0}
                                  step={0.1}
                                  value={filters.height.min || ''}
                                  onChange={e => handleFiltersChange({ ...filters, height: { ...filters.height, min: e.target.value ? Number(e.target.value) : 0 } })}
                                />
                              </div>
                              <div className="flex-1 relative">
                                <input
                                  type="number"
                                  className="w-full pr-3 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  placeholder="Max"
                                  min={0}
                                  step={0.1}
                                  value={filters.height.max || ''}
                                  onChange={e => handleFiltersChange({ ...filters, height: { ...filters.height, max: e.target.value ? Number(e.target.value) : 0 } })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
                {/* Sticky Footer */}
                <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 z-20">
                  <button
                    className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors"
                    onClick={() => setShowFilters(false)}
                  >
                    Show {pagination.total} Result{pagination.total !== 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Results */}
          <div className="flex-1 w-full min-w-0 z-0 relative">
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
    </>
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
