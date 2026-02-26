"use client";

import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BullionProduct, BullionQueryParams } from '@/services/bullion.service';
import { Shield, Award, TrendingUp, ArrowRight, Grid, List, Loader2, X, ChevronDown, Filter, Search, ArrowUpDown, Eye } from 'lucide-react';
import WishlistButton from '@/components/shared/WishlistButton';
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
  fetchBullions: (params: BullionQueryParams) => Promise<{
    success: boolean;
    message: string;
    data: {
      data: BullionProduct[];
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
        <h3 
          className="text-sm font-semibold text-gray-900 dark:text-white transition-colors"
          style={{ color: isExpanded ? 'var(--status-warning)' : 'inherit' }}
        >
          {title}
          {count !== undefined && count > 0 && (
            <span 
              className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full"
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--status-warning) 15%, transparent)',
                color: 'var(--status-warning)'
              }}
            >
              {count}
            </span>
          )}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-all ${
            isExpanded ? 'rotate-180' : ''
          }`}
          style={{ color: isExpanded ? 'var(--status-warning)' : 'inherit' }}
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
              className="w-full px-3 py-2 pl-9 text-sm border rounded-lg transition-all focus:outline-none"
              style={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)', 
                color: 'var(--foreground)'
              }}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Options Container */}
      <div
        className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar"
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
              className="w-4 h-4 rounded cursor-pointer transition-all"
              style={{ 
                accentColor: 'var(--status-warning)',
                borderColor: 'var(--border)'
              }}
            />
            <span 
              className="text-sm transition-colors flex-1"
              style={{ color: selectedValues.includes(option.value) ? 'var(--status-warning)' : 'var(--muted-foreground)' }}
            >
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

// Bullion Card Component - Watch-style design
interface BullionCardProps {
  bullion: BullionProduct;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

const BULLION_PLACEHOLDER = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg';

function BullionCard({ bullion, viewMode, onClick }: BullionCardProps) {
  const mainImage = BULLION_PLACEHOLDER;
  const price = Number(bullion.price) || 0;
  const formatPrice = (p: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);
  const name = `${bullion.metalWeight || ''} ${bullion.metalType?.name || ''} ${bullion.metalShape?.name || ''}`.trim() || 'Bullion';

  if (viewMode === 'list') {
    return (
      <div
        className="group relative rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        onClick={onClick}
      >
        <div className="relative w-full md:w-64 aspect-[4/5] md:aspect-square overflow-hidden shrink-0" style={{ backgroundColor: 'var(--muted)' }}>
          <Image src={mainImage} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <WishlistButton
            productId={bullion.id}
            productType="jewellery"
            className="absolute top-3 right-3 p-2 shadow-sm rounded-full"
            style={{ backgroundColor: 'color-mix(in srgb, var(--card) 90%, transparent)' }}
          />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-1 block" style={{ color: 'var(--status-warning)' }}>
                {bullion.metalType?.name || 'Bullion'}
              </span>
              <h3 className="text-xl font-bold transition-colors" style={{ color: 'var(--foreground)' }}>
                {bullion.metalWeight} {bullion.metalShape?.name || ''}
              </h3>
              {bullion.design && (
                <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
                  {bullion.design}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-black block" style={{ color: 'var(--foreground)' }}>
                {formatPrice(price)}
              </span>
              <span className="text-xs font-medium uppercase" style={{ color: 'var(--muted-foreground)' }}>
                Ref: {bullion.stockNumber || bullion.id}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y" style={{ borderColor: 'var(--border)' }}>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>Weight</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{bullion.metalWeight || '—'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>Purity</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{bullion.metalFineness?.name || '—'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>Shape</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{bullion.metalShape?.name || '—'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>Condition</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{bullion.condition || '—'}</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              View Details
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="p-3 border rounded-xl transition-all"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              title="Quick View"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view - Watch-style
  return (
    <div
      className="group relative rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
        <Image src={mainImage} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {bullion.condition && (
            <span
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm"
              style={{ backgroundColor: 'color-mix(in srgb, var(--card) 90%, transparent)', color: 'var(--foreground)' }}
            >
              {bullion.condition}
            </span>
          )}
          {bullion.mintYear && (
            <span
              className="px-2.5 py-1 text-[10px] font-bold rounded-full shadow-sm"
              style={{ backgroundColor: 'var(--status-warning)', color: 'white' }}
            >
              {bullion.mintYear}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <WishlistButton
            productId={bullion.id}
            productType="jewellery"
            className="h-[40px] w-[40px] p-2 shadow-lg rounded-full transition-colors"
            style={{ backgroundColor: 'var(--card)' }}
          />
          <button
            className="cursor-pointer h-[40px] w-[40px] p-2 shadow-lg rounded-full transition-colors"
            style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            title="Quick View"
          >
            <Eye size={22} />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block" style={{ color: 'var(--status-warning)' }}>
            {bullion.metalType?.name || 'Bullion'}
          </span>
          <h3 className="font-bold line-clamp-1 transition-colors" style={{ color: 'var(--foreground)' }}>
            {bullion.metalWeight} {bullion.metalShape?.name || ''}
          </h3>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>{bullion.metalFineness?.name || '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{bullion.metalWeight || '—'}</span>
          </div>
          {bullion.condition && (
            <div className="flex items-center gap-1 capitalize">
              <span>{bullion.condition}</span>
            </div>
          )}
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-black" style={{ color: 'var(--foreground)' }}>
            {formatPrice(price)}
          </span>
          <span className="text-[10px] font-medium uppercase" style={{ color: 'var(--muted-foreground)' }}>
            Ref: {bullion.stockNumber || bullion.id}
          </span>
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
  const [bullions, setBullions] = useState<BullionProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch bullions when filters/page changes
  useEffect(() => {
    setLoading(true);
    fetchBullions({
      page: currentPage,
      limit: pageSize,
      sort: '-createdAt',
      priceMin: filters.priceMin || undefined,
      priceMax: filters.priceMax || undefined,
      metalType: filters.metalType.length > 0 ? filters.metalType : undefined,
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
              <div 
                className="border-b px-6 py-5 sticky top-0 z-10"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                    Filters
                  </h2>
                  <button
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    onClick={() => setShowFilters(false)}
                    aria-label="Close filters"
                    style={{ color: 'var(--muted-foreground)' }}
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
                        onClick={clearAllFilters}
                        className="text-sm font-medium transition-colors"
                        style={{ color: 'var(--status-warning)' }}
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

              {/* Filter Sections Container */}
              <div className="filter-scroll flex-1 overflow-y-auto">
                <FilterSections 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
              {/* Sticky Footer */}
              <div 
                className="sticky bottom-0 left-0 w-full border-t px-6 py-4 z-20"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <button
                  className="w-full py-3 rounded-lg text-white font-semibold transition-all active:scale-[0.98]"
                  style={{ 
                    background: 'linear-gradient(to right, var(--status-warning), color-mix(in srgb, var(--status-warning) 85%, black))'
                  }}
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
                  <span 
                    key={subcat} 
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                    style={{ 
                      backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)',
                      color: 'var(--status-warning)',
                      border: '1px solid color-mix(in srgb, var(--status-warning) 20%, transparent)'
                    }}
                  >
                    Type: {subcat}
                    <X
                      className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100"
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
                  <span 
                    key={metal} 
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                    style={{ 
                      backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)',
                      color: 'var(--status-warning)',
                      border: '1px solid color-mix(in srgb, var(--status-warning) 20%, transparent)'
                    }}
                  >
                    Metal: {metal}
                    <X
                      className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100"
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
                  <span 
                    key={type} 
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                    style={{ 
                      backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)',
                      color: 'var(--status-warning)',
                      border: '1px solid color-mix(in srgb, var(--status-warning) 20%, transparent)'
                    }}
                  >
                    Type: {type}
                    <X
                      className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100"
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
                  <span 
                    key={weight} 
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                    style={{ 
                      backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)',
                      color: 'var(--status-warning)',
                      border: '1px solid color-mix(in srgb, var(--status-warning) 20%, transparent)'
                    }}
                  >
                    Weight: {weight}
                    <X
                      className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100"
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
                  <span 
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                    style={{ 
                      backgroundColor: 'color-mix(in srgb, var(--status-warning) 10%, transparent)',
                      color: 'var(--status-warning)',
                      border: '1px solid color-mix(in srgb, var(--status-warning) 20%, transparent)'
                    }}
                  >
                    Price: ${filters.priceMin.toLocaleString()} - ${filters.priceMax.toLocaleString()}
                    <X
                      className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100"
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
            <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: 'var(--status-warning)' }} />
            <p style={{ color: 'var(--muted-foreground)' }}>Loading bullions...</p>
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
                className="px-6 py-2 text-white rounded-lg transition-all active:scale-95"
                style={{ background: 'var(--status-warning)' }}
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
                      onClick={() => router.push(`/bullions/${bullion.id}`)}
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
                      onClick={() => router.push(`/bullions/${bullion.id}`)}
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
