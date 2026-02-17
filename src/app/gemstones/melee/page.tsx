'use client';

import { useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Grid, List, Loader2, Eye, ShoppingCart, MapPin, Star, X, ChevronDown, Package, Layers } from 'lucide-react';
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

const GEMSTONE_TYPES = [
  { title: 'Alexandrite', img: '/images/gemstones/Alexandrite.png', alt: 'Alexandrite gemstone' },
  { title: 'Amber', img: '/images/gemstones/Amber.png', alt: 'Amber gemstone' },
  { title: 'Amethyst', img: '/images/gemstones/Amethyst.png', alt: 'Amethyst gemstone' },
  { title: 'Aquamarine', img: '/images/gemstones/Aquamarine.png', alt: 'Aquamarine gemstone' },
  { title: 'Citrine', img: '/images/gemstones/Citrine.png', alt: 'Citrine gemstone' },
  { title: 'Emerald', img: '/images/gemstones/Emerald.png', alt: 'Emerald gemstone' },
  { title: 'Garnet', img: '/images/gemstones/Garnet.png', alt: 'Garnet gemstone' },
  { title: 'Jade', img: '/images/gemstones/Jade.png', alt: 'Jade gemstone' },
  { title: 'Jasper', img: '/images/gemstones/Jasper.png', alt: 'Jasper gemstone' },
  { title: 'Lapis Lazuli', img: '/images/gemstones/Lapis Lazuli.png', alt: 'Lapis Lazuli gemstone' },
  { title: 'Moonstone', img: '/images/gemstones/Moonstone.png', alt: 'Moonstone gemstone' },
  { title: 'Onyx', img: '/images/gemstones/Onyx.png', alt: 'Onyx gemstone' },
  { title: 'Pearl', img: '/images/gemstones/Pearl.png', alt: 'Pearl gemstone' },
  { title: 'Rose Quartz', img: '/images/gemstones/Rose Quartz.png', alt: 'Rose Quartz gemstone' },
  { title: 'Sunstone', img: '/images/gemstones/Sunstone.png', alt: 'Sunstone gemstone' },
  { title: 'Tiger Eye', img: '/images/gemstones/Tiger Eye.png', alt: 'Tiger Eye gemstone' },
  { title: 'Zircon', img: '/images/gemstones/Zircon.png', alt: 'Zircon gemstone' }
];

export default function MeleeGemstonesPage() {
  const searchParams = useSearchParams();
  const category = searchParams?.get('category') || 'all';
  const router = useRouter();

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

  // Melee gemstone filters (adjusted ranges)
  const [filters, setFilters] = useState<GemstoneFilterValues>({
    gemstoneType: [],
    shape: [],
    caratWeight: { min: 0.01, max: 5 }, // Melee usually smaller
    color: [],
    clarity: [],
    cut: [],
    priceRange: { min: 0, max: 100000 },
    certification: [],
    origin: [],
    treatment: [],
    minerals: [],
    birthstones: [],
    length: { min: 0, max: 20 },
    width: { min: 0, max: 20 },
    height: { min: 0, max: 20 },
    searchTerm: ''
  });

  // Effect to sync filters from URL search params
  useEffect(() => {
    if (searchParams) {
      const newFilters = { ...filters };
      
      const gemType = searchParams.get('gemType');
      if (gemType) newFilters.gemstoneType = gemType.split(',');
      
      const shape = searchParams.get('shape');
      if (shape) newFilters.shape = shape.split(',');
      
      const color = searchParams.get('color');
      if (color) newFilters.color = color.split(',');
      
      const clarity = searchParams.get('clarity');
      if (clarity) newFilters.clarity = clarity.split(',');
      
      const cut = searchParams.get('cut');
      if (cut) newFilters.cut = cut.split(',');
      
      const certification = searchParams.get('certification');
      if (certification) newFilters.certification = certification.split(',');
      
      const origin = searchParams.get('origin');
      if (origin) newFilters.origin = origin.split(',');
      
      const treatment = searchParams.get('treatment');
      if (treatment) newFilters.treatment = treatment.split(',');

      // Ranges
      const priceMin = searchParams.get('priceMin');
      const priceMax = searchParams.get('priceMax');
      if (priceMin) newFilters.priceRange.min = parseFloat(priceMin);
      if (priceMax) newFilters.priceRange.max = parseFloat(priceMax);

      const caratMin = searchParams.get('caratMin');
      const caratMax = searchParams.get('caratMax');
      if (caratMin) newFilters.caratWeight.min = parseFloat(caratMin);
      if (caratMax) newFilters.caratWeight.max = parseFloat(caratMax);

      const lengthMin = searchParams.get('lengthMin');
      const lengthMax = searchParams.get('lengthMax');
      if (lengthMin) newFilters.length.min = parseFloat(lengthMin);
      if (lengthMax) newFilters.length.max = parseFloat(lengthMax);

      const widthMin = searchParams.get('widthMin');
      const widthMax = searchParams.get('widthMax');
      if (widthMin) newFilters.width.min = parseFloat(widthMin);
      if (widthMax) newFilters.width.max = parseFloat(widthMax);

      const heightMin = searchParams.get('heightMin');
      const heightMax = searchParams.get('heightMax');
      if (heightMin) newFilters.height.min = parseFloat(heightMin);
      if (heightMax) newFilters.height.max = parseFloat(heightMax);

      setFilters(newFilters);
    }
  }, [searchParams]);

  // Clear filters function
  const clearFilters = () => {
    setFilters({
      gemstoneType: [],
      shape: [],
      caratWeight: { min: 0.01, max: 5 },
      color: [],
      clarity: [],
      cut: [],
      priceRange: { min: 0, max: 100000 },
      certification: [],
      origin: [],
      treatment: [],
      minerals: [],
      birthstones: [],
      length: { min: 0, max: 20 },
      width: { min: 0, max: 20 },
      height: { min: 0, max: 20 },
      searchTerm: ''
    });
    setSearchQuery('');
    setSortBy('-createdAt');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Fetch melee gemstone data
  const fetchGemstones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        quantity: { gt: 1 }, // Melee specific: quantity > 1
        category: category !== 'all' ? category : undefined,
        search: searchQuery || undefined,
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        // Map filters to API parameters
        gemType: filters.gemstoneType.length > 0 ? filters.gemstoneType : undefined,
        shape: filters.shape.length > 0 ? filters.shape : undefined,
        color: filters.color.length > 0 ? filters.color : undefined,
        clarity: filters.clarity.length > 0 ? filters.clarity : undefined,
        cut: filters.cut.length > 0 ? filters.cut : undefined,
        certification: filters.certification.length > 0 ? filters.certification : undefined,
        origin: filters.origin.length > 0 ? filters.origin : undefined,
        treatment: filters.treatment.length > 0 ? filters.treatment : undefined,
        minerals: filters.minerals.length > 0 ? filters.minerals : undefined,
        birthstones: filters.birthstones.length > 0 ? filters.birthstones : undefined,
        priceMin: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
        priceMax: filters.priceRange.max < 100000 ? filters.priceRange.max : undefined,
        caratMin: filters.caratWeight.min > 0.01 ? filters.caratWeight.min : undefined,
        caratMax: filters.caratWeight.max < 5 ? filters.caratWeight.max : undefined,
        lengthMin: filters.length.min > 0 ? filters.length.min : undefined,
        lengthMax: filters.length.max < 20 ? filters.length.max : undefined,
        widthMin: filters.width.min > 0 ? filters.width.min : undefined,
        widthMax: filters.width.max < 20 ? filters.width.max : undefined,
        heightMin: filters.height.min > 0 ? filters.height.min : undefined,
        heightMax: filters.height.max < 20 ? filters.height.max : undefined,
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
      setError('Failed to fetch melee gemstones. Please try again.');
      console.error('Error fetching melee gemstones:', err);
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery, pagination.page, pagination.limit, sortBy, filters]);

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
    if (filters.minerals.length > 0) count += filters.minerals.length;
    if (filters.birthstones.length > 0) count += filters.birthstones.length;
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

  const categoryTitle = category === 'all' ? 'All Melee Gemstones' : `${category.charAt(0).toUpperCase() + category.slice(1)} Melee Gemstones`;

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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <NavigationUser />
      
      <div className="max-w-[1380px] container mx-auto px-6 pb-8 pt-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {categoryTitle}
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Browse our collection of high-quality melee gemstones available in bulk quantities
          </p>
        </div>

        {/* Search and Controls */}
        <div className="rounded-lg p-4 mb-8 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search melee gemstones..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)', borderWidth: 1, borderStyle: 'solid' }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 justify-between lg:justify-end w-full lg:w-auto">
              {/* Desktop controls */}
              <div className="hidden sm:flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)', borderWidth: 1, borderStyle: 'solid' }}
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)', borderStyle: 'solid', borderWidth: 1, backgroundColor: 'var(--background)' }}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {totalAppliedFilters > 0 && (
                    <span className="ml-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                      {totalAppliedFilters}
                    </span>
                  )}
                </button>

                <div className="flex rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)', borderStyle: 'solid', borderWidth: 1 }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className="p-2"
                    style={viewMode === 'grid' ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : { backgroundColor: 'var(--background)', color: 'var(--muted-foreground)' }}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className="p-2"
                    style={viewMode === 'list' ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : { backgroundColor: 'var(--background)', color: 'var(--muted-foreground)' }}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile filters button */}
              <button
                onClick={() => setShowFilters(true)}
                className="sm:hidden flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <Filter className="w-4 h-4" />
                Filters
                {totalAppliedFilters > 0 && (
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                    {totalAppliedFilters}
                  </span>
                )}
              </button>
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
                className={`fixed top-0 right-0 w-full max-w-md h-full z-[110] shadow-2xl p-0 flex flex-col transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ minHeight: '100vh', backgroundColor: 'var(--card)' }}
                onTransitionEnd={() => {
                  if (!drawerOpen) setDrawerVisible(false);
                }}
              >
                {/* Header */}
                <div className="border-b px-6 py-5 sticky top-0 z-10" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      Filters
                    </h2>
                    <button
                      className="p-1.5 rounded-full transition-all"
                      style={{ color: 'var(--muted-foreground)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in srgb, currentColor 14%, transparent)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
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
                        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
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
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        No filters applied
                      </span>
                    )}
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ backgroundColor: 'var(--card)' }}>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    
                    {/* Price Range Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('priceRange')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Price Range
                          {(filters.priceRange.min > 0 || filters.priceRange.max < 100000) && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                              ${filters.priceRange.min.toLocaleString()} - ${filters.priceRange.max.toLocaleString()}
                            </span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('priceRange') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('priceRange') && (
                        <div className="px-6 pb-5 pt-3" style={{ backgroundColor: 'var(--muted)' }}>
                          <div className="flex gap-3 mb-4">
                            <div className="flex-1">
                              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Min Price</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--muted-foreground)' }}>$</span>
                                <input
                                  type="number"
                                  className="w-full pl-7 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                  placeholder="0"
                                  min={0}
                                  step={100}
                                  value={filters.priceRange.min || ''}
                                  onChange={e => handleFiltersChange({ ...filters, priceRange: { ...filters.priceRange, min: e.target.value ? Number(e.target.value) : 0 } })}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Max Price</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--muted-foreground)' }}>$</span>
                                <input
                                  type="number"
                                  className="w-full pl-7 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                  placeholder="100,000"
                                  min={0}
                                  step={100}
                                  value={filters.priceRange.max || ''}
                                  onChange={e => handleFiltersChange({ ...filters, priceRange: { ...filters.priceRange, max: e.target.value ? Number(e.target.value) : 100000 } })}
                                />
                              </div>
                            </div>
                          </div>
                          {/* Quick Price Ranges */}
                          <div className="space-y-2">
                            <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Quick Select</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { label: 'Under $500', min: 0, max: 500 },
                                { label: '$500 - $1K', min: 500, max: 1000 },
                                { label: '$1K - $2.5K', min: 1000, max: 2500 },
                                { label: '$2.5K - $5K', min: 2500, max: 5000 },
                                { label: '$5K - $10K', min: 5000, max: 10000 },
                                { label: 'Over $10K', min: 10000, max: 100000 },
                              ].map(range => {
                                const isSelected = filters.priceRange.min === range.min && filters.priceRange.max === range.max;
                                return (
                                  <button
                                    key={range.label}
                                    type="button"
                                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all border ${
                                      isSelected 
                                        ? 'bg-amber-50 border-amber-500 text-amber-700' 
                                        : 'border-gray-200 hover:border-amber-200 text-gray-600'
                                    }`}
                                    style={isSelected ? { backgroundColor: 'var(--accent)', borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                                    onClick={() => handleFiltersChange({ ...filters, priceRange: { min: range.min, max: range.max } })}
                                  >
                                    {range.label}
                                  </button>
                                );
                              })}
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
                        <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Gemstone Type
                          {filters.gemstoneType.length > 0 && (
                            <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--muted-foreground)' }}>({filters.gemstoneType.length})</span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('gemstoneType') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('gemstoneType') && (
                        <div className="px-5 pb-4 pt-2">
                          <div className="grid grid-cols-2 gap-2">
                            {['Ruby', 'Sapphire', 'Emerald', 'Spinel', 'Tourmaline', 'Garnet', 'Zircon', 'Chrysoberyl', 'Alexandrite', 'Topaz', 'Quartz', 'Opal', 'Morganite', 'Aquamarine', 'Tanzanite', 'Iolite', 'Peridot', 'Amethyst', 'Citrine', 'Moonstone'].map(type => {
                              const isSelected = filters.gemstoneType.includes(type);
                              return (
                                <button
                                  key={type}
                                  onClick={() => {
                                    const next = isSelected
                                      ? filters.gemstoneType.filter(t => t !== type)
                                      : [...filters.gemstoneType, type];
                                    handleFiltersChange({ ...filters, gemstoneType: next });
                                  }}
                                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                    isSelected 
                                      ? 'bg-amber-50 border-amber-500 text-amber-700' 
                                      : 'border-gray-200 hover:border-amber-200 text-gray-600'
                                  }`}
                                  style={isSelected ? { backgroundColor: 'var(--accent)', borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                                >
                                  {type}
                                </button>
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
                        <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Shape
                          {filters.shape.length > 0 && (
                            <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--muted-foreground)' }}>({filters.shape.length})</span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('shape') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('shape') && (
                        <div className="px-5 pb-4 pt-2">
                          <div className="grid grid-cols-2 gap-2">
                            {['Round', 'Pear', 'Emerald', 'Oval', 'Heart', 'Marquise', 'Asscher', 'Cushion', 'Princess', 'Radiant'].map(shape => {
                              const isSelected = filters.shape.includes(shape);
                              return (
                                <button
                                  key={shape}
                                  onClick={() => {
                                    const next = isSelected
                                      ? filters.shape.filter(s => s !== shape)
                                      : [...filters.shape, shape];
                                    handleFiltersChange({ ...filters, shape: next });
                                  }}
                                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                    isSelected 
                                      ? 'bg-amber-50 border-amber-500 text-amber-700' 
                                      : 'border-gray-200 hover:border-amber-200 text-gray-600'
                                  }`}
                                  style={isSelected ? { backgroundColor: 'var(--accent)', borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                                >
                                  {shape}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Carat Weight Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('caratWeight')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Carat Weight
                          {(filters.caratWeight.min > 0.01 || filters.caratWeight.max < 5) && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                              {filters.caratWeight.min} - {filters.caratWeight.max} ct
                            </span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('caratWeight') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('caratWeight') && (
                        <div className="px-6 pb-5 pt-3" style={{ backgroundColor: 'var(--muted)' }}>
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Min Carat</label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                placeholder="0.01"
                                min={0}
                                step={0.01}
                                value={filters.caratWeight.min || ''}
                                onChange={e => handleFiltersChange({ ...filters, caratWeight: { ...filters.caratWeight, min: e.target.value ? Number(e.target.value) : 0.01 } })}
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Max Carat</label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                placeholder="5.00"
                                min={0}
                                step={0.01}
                                value={filters.caratWeight.max || ''}
                                onChange={e => handleFiltersChange({ ...filters, caratWeight: { ...filters.caratWeight, max: e.target.value ? Number(e.target.value) : 5 } })}
                              />
                            </div>
                          </div>
                          {/* Quick Carat Ranges */}
                          <div className="space-y-2 mt-4">
                            <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Quick Select</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { label: '0.01 - 0.10 ct', min: 0.01, max: 0.10 },
                                { label: '0.10 - 0.25 ct', min: 0.10, max: 0.25 },
                                { label: '0.25 - 0.50 ct', min: 0.25, max: 0.50 },
                                { label: '0.50 - 1.00 ct', min: 0.50, max: 1.00 },
                                { label: '1.00 - 2.00 ct', min: 1.00, max: 2.00 },
                                { label: 'Over 2.00 ct', min: 2.00, max: 5.00 },
                              ].map(range => {
                                const isSelected = filters.caratWeight.min === range.min && filters.caratWeight.max === range.max;
                                return (
                                  <button
                                    key={range.label}
                                    type="button"
                                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all border ${
                                      isSelected 
                                        ? 'bg-amber-50 border-amber-500 text-amber-700' 
                                        : 'border-gray-200 hover:border-amber-200 text-gray-600'
                                    }`}
                                    style={isSelected ? { backgroundColor: 'var(--accent)', borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                                    onClick={() => handleFiltersChange({ ...filters, caratWeight: { min: range.min, max: range.max } })}
                                  >
                                    {range.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Minerals Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('minerals')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Minerals
                          {filters.minerals.length > 0 && (
                            <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--muted-foreground)' }}>({filters.minerals.length})</span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('minerals') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('minerals') && (
                        <div className="px-5 pb-4 pt-2">
                          <div className="grid grid-cols-2 gap-2">
                            {['Beryl', 'Corundum', 'Quartz', 'Garnet', 'Topaz', 'Tourmaline', 'Spinel', 'Zircon', 'Chrysoberyl', 'Feldspar'].map(mineral => {
                              const isSelected = filters.minerals.includes(mineral);
                              return (
                                <button
                                  key={mineral}
                                  onClick={() => {
                                    const next = isSelected
                                      ? filters.minerals.filter(m => m !== mineral)
                                      : [...filters.minerals, mineral];
                                    handleFiltersChange({ ...filters, minerals: next });
                                  }}
                                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                    isSelected 
                                      ? 'bg-amber-50 border-amber-500 text-amber-700' 
                                      : 'border-gray-200 hover:border-amber-200 text-gray-600'
                                  }`}
                                  style={isSelected ? { backgroundColor: 'var(--accent)', borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                                >
                                  {mineral}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Birthstones Section */}
                    <div>
                      <button
                        onClick={() => toggleSection('birthstones')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <h3 className="text-sm font-semibold text-[var(--foreground)] group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                          Birthstones
                          {filters.birthstones.length > 0 && (
                            <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--muted-foreground)' }}>({filters.birthstones.length})</span>
                          )}
                        </h3>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.includes('birthstones') ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {expandedSections.includes('birthstones') && (
                        <div className="px-5 pb-4 pt-2">
                          <div className="grid grid-cols-2 gap-2">
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => {
                              const isSelected = filters.birthstones.includes(month);
                              return (
                                <button
                                  key={month}
                                  onClick={() => {
                                    const next = isSelected
                                      ? filters.birthstones.filter(m => m !== month)
                                      : [...filters.birthstones, month];
                                    handleFiltersChange({ ...filters, birthstones: next });
                                  }}
                                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                    isSelected 
                                      ? 'bg-amber-50 border-amber-500 text-amber-700' 
                                      : 'border-gray-200 hover:border-amber-200 text-gray-600'
                                  }`}
                                  style={isSelected ? { backgroundColor: 'var(--accent)', borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                                >
                                  {month}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
                {/* Footer */}
                <div className="border-t px-6 py-5 sticky bottom-0 z-10" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-lg shadow-amber-600/20 transition-all active:scale-[0.98]"
                  >
                    Show {pagination.total} Results
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Product Grid/List */}
          <div className="flex-1 w-full min-w-0 z-0 relative">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Showing <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{pagination.total}</span> melee gemstones
              </p>
            </div>

            {/* Gemstone Type Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-muted-foreground/30">
              {GEMSTONE_TYPES.map(type => {
                const isSelected = filters.gemstoneType.includes(type.title);
                return (
                  <button
                    key={type.title}
                    onClick={() => {
                      const next = isSelected
                        ? filters.gemstoneType.filter(t => t !== type.title)
                        : [...filters.gemstoneType, type.title];
                      handleFiltersChange({ ...filters, gemstoneType: next });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors"
                    style={isSelected ? { background: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { background: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    type="button"
                  >
                    <span className="relative w-6 h-6 rounded-full overflow-hidden bg-white">
                      <Image
                        src={type.img}
                        alt={type.alt}
                        fill
                        sizes="24px"
                        style={{ objectFit: 'contain' }}
                      />
                    </span>
                    {type.title}
                  </button>
                );
              })}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchGemstones}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && gemstones.length === 0 && (
              <div className="text-center py-12">
                <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>No melee gemstones found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Product Grid/List */}
            {!loading && !error && gemstones.length > 0 && (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }
                >
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
                                ? 'bg-amber-600 text-white border-amber-600'
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
  const router = useRouter();
  const goToDetails = () => {
    router.push(`/gemstones/melee/${item.id}`);
  };

  const pricePerCarat = item.totalPrice && item.caratWeight ? Math.round(item.totalPrice / item.caratWeight) : null;

  if (viewMode === 'list') {
    return (
      <div className="rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-6">
          <div className="w-32 h-32 rounded-lg flex-shrink-0 overflow-hidden relative" style={{ backgroundColor: 'var(--card)' }}>
            {item.image1 ? (
              <Link href={`/gemstones/melee/${item.id}`}>
                <Image
                  src={item.image1}
                  alt={item.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-lg"
                />
              </Link>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Package className="w-8 h-8" />
              </div>
            )}
            {item.quantity && item.quantity > 1 && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                Parcel
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Link href={`/gemstones/melee/${item.id}`} className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>
                  {item.name}
                </Link>
                <p className="text-xs mt-1 font-medium tracking-wide uppercase" style={{ color: 'var(--muted-foreground)' }}>
                  {item.skuCode}
                </p>
              </div>
              <WishlistButton productId={Number(item.id)} productType="gemstone" />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {item.gemType && (
                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                  {item.gemType}
                </span>
              )}
              {item.shape && (
                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                  {item.shape}
                </span>
              )}
              {item.caratWeight && (
                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                  {item.caratWeight}ct
                </span>
              )}
              {item.quantity && (
                <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                  {item.quantity} pcs
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <div>
                <p className="uppercase tracking-wide text-[10px]">Color</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{item.color || '--'}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-[10px]">Clarity</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{item.clarity || '--'}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-[10px]">Origin</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{item.origin || '--'}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-[10px]">Treatment</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{item.treatment || '--'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    ${item.totalPrice?.toLocaleString() || 'N/A'}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total lot price</span>
                </div>
                {pricePerCarat && (
                  <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    ${pricePerCarat.toLocaleString()} / ct
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToDetails}
                  className="p-2 rounded-lg border"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
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
    <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="relative aspect-square" style={{ backgroundColor: 'var(--card)' }}>
        {item.image1 ? (
          <Link href={`/gemstones/melee/${item.id}`}>
            <Image
              src={item.image1}
              alt={item.name}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Package className="w-10 h-10" />
          </div>
        )}

        <div className="absolute top-3 right-3">
          <WishlistButton productId={Number(item.id)} productType="gemstone" />
        </div>

        {item.quantity && item.quantity > 1 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            Parcel
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1" style={{ color: 'var(--foreground)' }}>
        <div className="mb-2">
          <Link href={`/gemstones/melee/${item.id}`} className="font-medium mb-1 line-clamp-1" style={{ color: 'var(--foreground)' }}>
            {item.name}
          </Link>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {item.skuCode}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.gemType && (
            <span className="px-2 py-1 text-[11px] rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              {item.gemType}
            </span>
          )}
          {item.shape && (
            <span className="px-2 py-1 text-[11px] rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              {item.shape}
            </span>
          )}
          {item.caratWeight && (
            <span className="px-2 py-1 text-[11px] rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              {item.caratWeight}ct
            </span>
          )}
          {item.quantity && (
            <span className="px-2 py-1 text-[11px] rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              {item.quantity} pcs
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <div className="flex flex-col">
            <span>
              Color: <span style={{ color: 'var(--foreground)' }}>{item.color || '--'}</span>
            </span>
            <span>
              Clarity: <span style={{ color: 'var(--foreground)' }}>{item.clarity || '--'}</span>
            </span>
          </div>
          <div className="text-right text-xs">
            {item.origin && <div>{item.origin}</div>}
            {item.treatment && <div>{item.treatment}</div>}
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              ${item.totalPrice?.toLocaleString() || 'N/A'}
            </span>
            {pricePerCarat && (
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                ${pricePerCarat.toLocaleString()}/ct
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex-1 px-3 py-2 text-sm rounded flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={goToDetails}
              className="p-2 rounded border"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
