"use client";

import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { JewelryItem, JewelryQueryParams } from '@/services/jewelryService';
import { Shield, Award, TrendingUp, ArrowRight, Grid, List, Loader2, X, ChevronDown, Filter, Search, ArrowUpDown } from 'lucide-react';
import { SECTION_WIDTH } from '@/lib/constants';

interface BullionFilters {
  subcategory: string[];
  metalType: string[];
  productType: string[];
  weight: string[];
  priceMin: number;
  priceMax: number;
}

interface BullionListingPageProps {
  fetchBullions: (params: JewelryQueryParams) => Promise<{
    success: boolean;
    message: string;
    data: {
      data: JewelryItem[];
      meta?: {
        total?: number;
        lastPage?: number;
        currentPage?: number;
        perPage?: number;
        prev?: number | null;
        next?: number | null;
      };
    };
  }>;
  title?: string;
}

// Helper Components
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  count?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen = false, children, count }) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
              {count}
            </span>
          )}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
          {children}
        </div>
      )}
    </div>
  );
};

interface CheckboxGroupProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;
  maxHeight?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange,
  searchable = true,
  maxHeight = "200px"
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayOptions = showAll ? filteredOptions : filteredOptions.slice(0, 8);
  const hasMoreOptions = filteredOptions.length > 8;

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      {/* Search Input */}
      {searchable && options.length > 5 && (
        <div className="mb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Options Container */}
      <div
        className="space-y-1 max-h-64 overflow-y-auto"
        style={{ maxHeight: showAll ? maxHeight : 'auto' }}
      >
        {displayOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex-1">
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMoreOptions && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium mt-2 transition-colors"
          style={{ color: 'var(--foreground)' }}
        >
          {showAll ? 'Show Less' : `Show All (${filteredOptions.length})`}
        </button>
      )}
    </div>
  );
};

// Filter Sections Component
interface FilterSectionsProps {
  filters: BullionFilters;
  onFiltersChange: (filters: BullionFilters) => void;
}

function FilterSections({ filters, onFiltersChange }: FilterSectionsProps) {
  const subcategoryOptions = [
    { label: 'Bar', value: 'Bar' },
    { label: 'Coin', value: 'Coin' },
    { label: 'Granules', value: 'Granules' },
    { label: 'Rounds', value: 'Rounds' }
  ];

  const metalTypeOptions = [
    { label: 'Gold', value: 'Gold' },
    { label: 'Silver', value: 'Silver' },
    { label: 'Platinum', value: 'Platinum' },
    { label: 'Palladium', value: 'Palladium' }
  ];

  const productTypeOptions = [
    { label: 'Bars', value: 'Bars' },
    { label: 'Coins', value: 'Coins' },
    { label: 'Rounds', value: 'Rounds' },
    { label: 'Ingots', value: 'Ingots' }
  ];

  const weightOptions = [
    { label: '1g', value: '1g' },
    { label: '5g', value: '5g' },
    { label: '10g', value: '10g' },
    { label: '20g', value: '20g' },
    { label: '50g', value: '50g' },
    { label: '100g', value: '100g' },
    { label: '1oz', value: '1oz' },
    { label: '5oz', value: '5oz' },
    { label: '10oz', value: '10oz' },
    { label: '1kg', value: '1kg' }
  ];

  return (
    <div className="space-y-6 py-4">
      {/* Subcategory Filter */}
      <FilterSection 
        title="Subcategory" 
        isOpen={true}
        count={filters.subcategory.length}
      >
        <CheckboxGroup
          options={subcategoryOptions}
          selectedValues={filters.subcategory}
          onChange={(values) => onFiltersChange({ ...filters, subcategory: values })}
          searchable={true}
        />
      </FilterSection>

      {/* Metal Type Filter */}
      <FilterSection 
        title="Metal Type" 
        isOpen={true}
        count={filters.metalType.length}
      >
        <CheckboxGroup
          options={metalTypeOptions}
          selectedValues={filters.metalType}
          onChange={(values) => onFiltersChange({ ...filters, metalType: values })}
          searchable={true}
        />
      </FilterSection>

      {/* Product Type Filter */}
      <FilterSection 
        title="Product Type" 
        isOpen={true}
        count={filters.productType.length}
      >
        <CheckboxGroup
          options={productTypeOptions}
          selectedValues={filters.productType}
          onChange={(values) => onFiltersChange({ ...filters, productType: values })}
          searchable={true}
        />
      </FilterSection>

      {/* Weight Filter */}
      <FilterSection 
        title="Weight" 
        isOpen={true}
        count={filters.weight.length}
      >
        <CheckboxGroup
          options={weightOptions}
          selectedValues={filters.weight}
          onChange={(values) => onFiltersChange({ ...filters, weight: values })}
          searchable={true}
        />
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection 
        title="Price Range" 
        isOpen={true}
        count={(filters.priceMin > 0 || filters.priceMax < 500000) ? 1 : 0}
      >
        <div className="space-y-4">
          <div className="mb-4 flex justify-between text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
            <span>${filters.priceMin?.toLocaleString() || 0}</span>
            <span>${filters.priceMax?.toLocaleString() || 500000}</span>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Min Price</label>
              <input
                type="number"
                className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                placeholder="$0"
                min={0}
                value={filters.priceMin || ''}
                onChange={e => onFiltersChange({ ...filters, priceMin: e.target.value ? Number(e.target.value) : 0 })}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Max Price</label>
              <input
                type="number"
                className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                placeholder="No limit"
                min={0}
                value={filters.priceMax || ''}
                onChange={e => onFiltersChange({ ...filters, priceMax: e.target.value ? Number(e.target.value) : 500000 })}
              />
            </div>
          </div>
        </div>
      </FilterSection>
    </div>
  );
}

// Bullion Card Component
interface BullionCardProps {
  bullion: JewelryItem;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

function BullionCard({ bullion, viewMode, onClick }: BullionCardProps) {
  const mainImage = bullion.image1 || bullion.image2 || bullion.image3 || 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg';
  const price = bullion.totalPrice || bullion.basePrice || 0;

  if (viewMode === 'list') {
    return (
      <div className="rounded-lg shadow-sm hover:shadow-md transition-shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-6 p-6">
          <div 
            onClick={onClick}
            className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <Image
              src={mainImage}
              alt={bullion.name || 'Bullion'}
              width={128}
              height={128}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
          
          <div className="flex-1" style={{ color: 'var(--foreground)' }}>
            <div className="flex items-start justify-between mb-2">
              <div onClick={onClick} className="cursor-pointer flex-1">
                <h3 className="text-lg font-semibold transition-colors mb-2" style={{ color: 'var(--foreground)' }}>
                  {bullion.name || 'Unnamed Bullion'}
                </h3>
                <div className="flex flex-wrap gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {bullion.metalType && (
                    <span className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                      {bullion.metalType}
                    </span>
                  )}
                  {bullion.metalWeight && (
                    <span className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                      {bullion.metalWeight}g
                    </span>
                  )}
                  {bullion.metalPurity && (
                    <span className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                      {bullion.metalPurity}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  ${price.toLocaleString()}
                </p>
              </div>
            </div>
            
            {bullion.description && (
              <p className="text-sm line-clamp-2 mt-2" style={{ color: 'var(--muted-foreground)' }}>
                {bullion.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="rounded-lg shadow-sm hover:shadow-lg transition-all border overflow-hidden group" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div onClick={onClick} className="relative aspect-square overflow-hidden cursor-pointer" style={{ backgroundColor: 'var(--card)' }}>
        <Image
          src={mainImage}
          alt={bullion.name || 'Bullion'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {bullion.category && (
          <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
            <Shield className="w-3 h-3" />
            {bullion.category}
          </div>
        )}
      </div>
      
      <div onClick={onClick} className="p-4 cursor-pointer" style={{ color: 'var(--foreground)' }}>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 transition-colors" style={{ color: 'var(--foreground)' }}>
          {bullion.name || 'Unnamed Bullion'}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-3 text-xs">
          {bullion.metalType && (
            <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              {bullion.metalType}
            </span>
          )}
          {bullion.metalWeight && (
            <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
              {bullion.metalWeight}g
            </span>
          )}
        </div>
        
        {bullion.metalPurity && (
          <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Purity: {bullion.metalPurity}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            ${price.toLocaleString()}
          </p>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" style={{ color: 'var(--muted-foreground)' }} />
        </div>
      </div>
    </div>
  );
}

const BullionListingPage: React.FC<BullionListingPageProps> = ({
  fetchBullions,
}) => {
  const router = useRouter();
  const [filters, setFilters] = useState<BullionFilters>({
    subcategory: [],
    metalType: [],
    productType: [],
    weight: [],
    priceMin: 0,
    priceMax: 0
  });
  const [bullions, setBullions] = useState<JewelryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch bullions when filters/page changes
  useEffect(() => {
    setLoading(true);
    fetchBullions({
      // category: 'bullions',
      page: currentPage,
      limit: pageSize,
      sort: '-createdAt',
      priceMin: filters.priceMin || undefined,
      priceMax: filters.priceMax || undefined,
      metal: filters.metalType.length > 0 ? filters.metalType : undefined,
    })
      .then((res) => {
        const bullionsRaw = res.data?.data ?? [];
        setBullions(Array.isArray(bullionsRaw) ? bullionsRaw : []);
        setTotalCount(res.data?.meta?.total || 0);
        setCurrentPage(res.data?.meta?.currentPage || 1);
        setPageSize(res.data?.meta?.perPage || 20);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  const handleFiltersChange = (newFilters: BullionFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Mobile filter sidebar state with animation
  const [showFilters, setShowFilters] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Count applied filters
  const totalAppliedFilters = useMemo(() => {
    let count = 0;
    if (filters.subcategory.length > 0) count += filters.subcategory.length;
    if (filters.metalType.length > 0) count += filters.metalType.length;
    if (filters.productType.length > 0) count += filters.productType.length;
    if (filters.weight.length > 0) count += filters.weight.length;
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

  // Listen for custom event to open filter drawer (for consistency with diamonds)
  useEffect(() => {
    const handler = () => setShowFilters(true);
    window.addEventListener('openBullionFilters', handler);
    return () => window.removeEventListener('openBullionFilters', handler);
  }, []);

  const clearAllFilters = () => {
    setFilters({
      subcategory: [],
      metalType: [],
      productType: [],
      weight: [],
      priceMin: 0,
      priceMax: 500000
    });
    setCurrentPage(1);
  };

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar,
        .filter-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track,
        .filter-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb,
        .filter-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover,
        .filter-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb,
        .dark .filter-scroll::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover,
        .dark .filter-scroll::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="w-full py-5 min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        <div className={`flex flex-col md:flex-row gap-6 relative mx-auto`} style={{ maxWidth: SECTION_WIDTH }}>
        
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
                        onClick={clearAllFilters}
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

              {/* Filter Sections Container */}
              <div className="filter-scroll flex-1 overflow-y-auto">
                <FilterSections 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
              {/* Sticky Footer */}
              <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 z-20">
                <button
                  className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors"
                  onClick={() => setShowFilters(false)}
                >
                  Show Results
                </button>
              </div>
            </div>
          </>
        )}


        {/* Main content */}
        <main className="flex-1 w-full min-w-0 z-0 relative">
          {/* Horizontal Filter Bar - Subcategory and Metal Types */}
          <div className="mb-2 rounded-lg shadow-sm p-2 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>

            {/* Metal Type Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3 whitespace-nowrap" style={{ color: 'var(--foreground)' }}>Metal Type:</span>
              </div>
              <div className="flex flex-nowrap gap-3 overflow-x-auto w-full scrollbar-hide">
                {/* All Metals Button */}
                <button
                  onClick={() => handleFiltersChange({ ...filters, metalType: [] })}
                  className={`rounded-lg whitespace-nowrap px-4 py-2 h-auto transition-all duration-200 border`}
                  style={filters.metalType.length === 0 ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                >
                  All Metals
                </button>
                
                {/* Metal Type Buttons */}
                {[
                  { name: 'Gold', icon: '🟡', color: 'from-yellow-500 to-yellow-600' },
                  { name: 'Silver', icon: '⚪', color: 'from-gray-300 to-gray-400' },
                  { name: 'Platinum', icon: '⚫', color: 'from-gray-600 to-gray-700' },
                  { name: 'Palladium', icon: '🔘', color: 'from-gray-400 to-gray-500' }
                ].map(metal => {
                  const isSelected = filters.metalType.includes(metal.name);
                  
                  return (
                    <button
                      key={metal.name}
                      onClick={() => {
                        const currentMetalTypes = filters.metalType;
                        const newMetalTypes = isSelected
                          ? currentMetalTypes.filter(m => m !== metal.name)
                          : [...currentMetalTypes, metal.name];
                        handleFiltersChange({ ...filters, metalType: newMetalTypes });
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap`}
                      style={isSelected ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      {/* Icon */}
                      <span className="text-lg" role="img" aria-label={metal.name}>
                        {metal.icon}
                      </span>
                      {/* Name */}
                      <span className="text-sm font-medium">
                        {metal.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="rounded-lg p-3 mb-4 shadow-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bullions..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Sort */}
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg shadow border active:scale-95 transition"
                  aria-label="Sort"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <ArrowUpDown className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                </button>

                {/* Filter Button */}
                <button
                  className="px-3 py-2 flex items-center gap-2 rounded-lg shadow border active:scale-95 transition"
                  onClick={() => setShowFilters(true)}
                  aria-label="Open filters"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  <Filter className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Filters</span>
                  {totalAppliedFilters > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                      {totalAppliedFilters}
                    </span>
                  )}
                </button>

                {/* View Mode */}
                <div className="flex items-center shadow border rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition`}
                    style={viewMode === 'grid' ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : { color: 'var(--muted-foreground)' }}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition`}
                    style={viewMode === 'list' ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : { color: 'var(--muted-foreground)' }}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {totalAppliedFilters > 0 && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Active Filters:</span>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Subcategory Filters */}
                  {filters.subcategory.map(subcat => (
                    <span key={subcat} className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm rounded-full">
                      Type: {subcat}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-yellow-900 dark:hover:text-yellow-200"
                        onClick={() => {
                          handleFiltersChange({
                            ...filters,
                            subcategory: filters.subcategory.filter(s => s !== subcat)
                          });
                        }}
                      />
                    </span>
                  ))}
                  {/* Metal Type Filters */}
                  {filters.metalType.map(metal => (
                    <span key={metal} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm rounded-full">
                      Metal: {metal}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-amber-900 dark:hover:text-amber-200"
                        onClick={() => {
                          handleFiltersChange({
                            ...filters,
                            metalType: filters.metalType.filter(m => m !== metal)
                          });
                        }}
                      />
                    </span>
                  ))}
                  {/* Product Type Filters */}
                  {filters.productType.map(type => (
                    <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full">
                      Type: {type}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-blue-900 dark:hover:text-blue-200"
                        onClick={() => {
                          handleFiltersChange({
                            ...filters,
                            productType: filters.productType.filter(t => t !== type)
                          });
                        }}
                      />
                    </span>
                  ))}
                  {/* Weight Filters */}
                  {filters.weight.map(weight => (
                    <span key={weight} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                      Weight: {weight}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-green-900 dark:hover:text-green-200"
                        onClick={() => {
                          handleFiltersChange({
                            ...filters,
                            weight: filters.weight.filter(w => w !== weight)
                          });
                        }}
                      />
                    </span>
                  ))}
                  {/* Price Range Filter */}
                  {(filters.priceMin > 0 || filters.priceMax < 500000) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full">
                      Price: ${filters.priceMin.toLocaleString()} - ${filters.priceMax.toLocaleString()}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-purple-900 dark:hover:text-purple-200"
                        onClick={() => {
                          handleFiltersChange({
                            ...filters,
                            priceMin: 0,
                            priceMax: 500000
                          });
                        }}
                      />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p style={{ color: 'var(--muted-foreground)' }}>
              {loading ? (
                'Loading...'
              ) : (
                `Showing ${bullions.length} of ${totalCount} results`
              )}
            </p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading bullions...</p>
            </div>
          )}

          {!loading && bullions.length === 0 && (
            <div className="text-center py-20 rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="text-6xl mb-4">🪙</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                No Bullions Found
              </h3>
              <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Try adjusting your filters or check back later.
              </p>
              {totalAppliedFilters > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {!loading && bullions.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {bullions.map((bullion) => (
                    <BullionCard 
                      key={bullion.id} 
                      bullion={bullion} 
                      viewMode="grid"
                      onClick={() => router.push(`/product/jewelry/${bullion.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {bullions.map((bullion) => (
                    <BullionCard 
                      key={bullion.id} 
                      bullion={bullion} 
                      viewMode="list"
                      onClick={() => router.push(`/product/jewelry/${bullion.id}`)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
        </div>
      </div>
    </>
  );
};

export default BullionListingPage;
