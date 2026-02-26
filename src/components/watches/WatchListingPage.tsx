"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { WatchProduct, MovementType, DisplayType, Gender } from '@/services/watch.service';
import { Shield, Award, Grid, List, X, ChevronDown, Filter, Search, ArrowUpDown, ShoppingCart, Eye, Clock, Watch as WatchIcon, MoreHorizontal } from 'lucide-react';
import WishlistButton from '@/components/shared/WishlistButton';
import CompareButton from '@/components/compare/CompareButton';
import Pagination from '../ui/Pagination';
import * as ShapeIcons from '../../../public/icons';

interface WatchFilters {
  brand: string[];
  movementType: string[];
  gender: string[];
  condition: string[];
  caseMaterial: string[];
  dialColor: string[];
  priceMin: number;
  priceMax: number;
}

interface WatchListingPageProps {
  fetchWatches: (params: any) => Promise<{
    success: boolean;
    message: string;
    data: {
      data: WatchProduct[];
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
  onToggle?: () => void;
}

const FilterSection = ({ title, children, isOpen = false, count = 0, onToggle }: FilterSectionProps) => {
  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group"
        style={{ color: 'var(--foreground)' }}
      >
        <div className="flex items-center gap-2">
          <span 
            className="text-sm font-semibold transition-colors"
            style={{ color: isOpen ? 'var(--primary)' : 'inherit' }}
          >
            {title}
          </span>
          {count > 0 && (
            <span 
              className="px-2 py-0.5 text-xs font-medium rounded-full" 
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--status-warning) 15%, transparent)', 
                color: 'var(--status-warning)' 
              }}
            >
              {count}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: isOpen ? 'var(--primary)' : 'var(--muted-foreground)' }}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 pt-3 animate-in fade-in slide-in-from-top-2 duration-300" style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 3%, transparent)' }}>
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
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange,
  searchable = true,
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
      {searchable && options.length > 5 && (
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 pl-8 text-xs border rounded-lg outline-none transition-all"
            style={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)', 
              color: 'var(--foreground)'
            }}
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      )}

      <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
        {displayOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
          >
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => handleToggle(option.value)}
                className="w-4 h-4 rounded cursor-pointer transition-colors"
                style={{ 
                  accentColor: 'var(--primary)',
                  borderColor: 'var(--border)'
                }}
              />
            </div>
            <span 
              className="text-sm transition-colors flex-1"
              style={{ color: selectedValues.includes(option.value) ? 'var(--primary)' : 'var(--muted-foreground)' }}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {hasMoreOptions && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-medium hover:underline mt-1"
          style={{ color: 'var(--primary)' }}
        >
          {showAll ? 'Show Less' : `Show All (${filteredOptions.length})`}
        </button>
      )}
    </div>
  );
};

const WatchListingPage: React.FC<WatchListingPageProps> = ({ fetchWatches, title = "Luxury Watches" }) => {
  const router = useRouter();
  const [products, setProducts] = useState<WatchProduct[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [sortBy, setSortBy] = useState('newest');

  const [filters, setFilters] = useState<WatchFilters>({
    brand: [],
    movementType: [],
    gender: [],
    condition: [],
    caseMaterial: [],
    dialColor: [],
    priceMin: 0,
    priceMax: 1000000,
  });

  // Collapsible filter sections
  const [expandedSections, setExpandedSections] = useState<string[]>(['brand', 'movementType', 'gender']);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionKey)
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const loadWatches = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        // Backend expects brand, movementType etc. as comma-separated strings or arrays
        brand: filters.brand.length > 0 ? filters.brand.join(',') : undefined,
        movementType: filters.movementType.length > 0 ? filters.movementType.join(',') : undefined,
        gender: filters.gender.length > 0 ? filters.gender.join(',') : undefined,
        condition: filters.condition.length > 0 ? filters.condition.join(',') : undefined,
        caseMaterial: filters.caseMaterial.length > 0 ? filters.caseMaterial.join(',') : undefined,
        dialColor: filters.dialColor.length > 0 ? filters.dialColor.join(',') : undefined,
      };

      const response = await fetchWatches(params);
      if (response.success) {
        setProducts(response.data.data);
        setMeta(response.data.meta);
      }
    } catch (error) {
      console.error('Error loading watches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatches();
  }, [currentPage, pageSize, sortBy, filters]);

  // Mobile filter sidebar state with animation
  useEffect(() => {
    if (showFilters) {
      setDrawerVisible(true);
    }
  }, [showFilters]);

  // Trigger the open animation after mount
  useEffect(() => {
    if (drawerVisible && showFilters) {
      // Small delay to ensure the drawer is mounted before animating
      const timer = setTimeout(() => setDrawerOpen(true), 10);
      return () => clearTimeout(timer);
    } else if (!showFilters) {
      setDrawerOpen(false);
    }
  }, [drawerVisible, showFilters]);

  const brandOptions = [
    { label: 'Rolex', value: 'Rolex', logo: '/images/watch_logo/Rolex Logo.png' },
    { label: 'Patek Philippe', value: 'Patek Philippe', logo: '/images/watch_logo/Patek-Philippe-Logo.png' },
    { label: 'Audemars Piguet', value: 'Audemars Piguet', logo: '/images/watch_logo/Audemars-Piguet.png' },
    { label: 'Richard Mille', value: 'Richard Mille', logo: '/images/watch_logo/Richard_Mille_Logo.png' },
    { label: 'Vacheron Constantin', value: 'Vacheron Constantin', logo: '/images/watch_logo/Vacheron-Constantin-Logo.png' },
    { label: 'Omega', value: 'Omega', logo: '/images/watch_logo/Omega-Logo.png' },
    { label: 'Cartier', value: 'Cartier', logo: '/images/watch_logo/Cartier.png' },
    { label: 'TAG Heuer', value: 'TAG Heuer', logo: '/images/watch_logo/TAG-Heuer-Logo.png' },
    { label: 'Breitling', value: 'Breitling', logo: '/images/watch_logo/Breitling-logo.png' },
    { label: 'Hublot', value: 'Hublot', logo: '/images/watch_logo/Hublot-Logo.png' },
    { label: 'Grand Seiko', value: 'Grand Seiko', logo: '/images/watch_logo/Grand-Seiko-Logo.png' },
    { label: 'IWC', value: 'IWC', logo: undefined },
    { label: 'Panerai', value: 'Panerai', logo: undefined },
    { label: 'Seiko', value: 'Seiko', logo: undefined },
    { label: 'Tissot', value: 'Tissot', logo: undefined },
  ];

  const movementOptions = Object.values(MovementType).map(type => ({
    label: type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' '),
    value: type
  }));

  const genderOptions = Object.values(Gender).map(type => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type
  }));

  const conditionOptions = [
    { label: 'New', value: 'New' },
    { label: 'Pre-owned', value: 'Pre-owned' },
    { label: 'Unworn', value: 'Unworn' },
    { label: 'Vintage', value: 'Vintage' },
  ];

  const caseMaterialOptions = [
    { label: 'Stainless Steel', value: 'Stainless Steel' },
    { label: 'Yellow Gold', value: 'Yellow Gold' },
    { label: 'Rose Gold', value: 'Rose Gold' },
    { label: 'White Gold', value: 'White Gold' },
    { label: 'Platinum', value: 'Platinum' },
    { label: 'Titanium', value: 'Titanium' },
    { label: 'Ceramic', value: 'Ceramic' },
    { label: 'Carbon', value: 'Carbon' },
    { label: 'Two-tone', value: 'Two-tone' },
  ];

  const dialColorOptions = [
    { label: 'Black', value: 'Black' },
    { label: 'White', value: 'White' },
    { label: 'Silver', value: 'Silver' },
    { label: 'Blue', value: 'Blue' },
    { label: 'Grey', value: 'Grey' },
    { label: 'Champagne', value: 'Champagne' },
    { label: 'Green', value: 'Green' },
    { label: 'Red', value: 'Red' },
    { label: 'Brown', value: 'Brown' },
    { label: 'Mother of Pearl', value: 'Mother of Pearl' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const WatchGridCard = ({ product }: { product: WatchProduct }) => {
    const images = [product.image1, product.image2, product.image3, product.image4, product.image5, product.image6].filter(Boolean) as string[];
    const mainImage = images[0] || '/placeholder-watch.png';

    return (
      <div 
        className="group relative rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        onClick={() => router.push(`/watches/${product.id}`)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
          <Image
            src={mainImage}
            alt={`${product.brand} ${product.model}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span 
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm" 
              style={{ backgroundColor: 'color-mix(in srgb, var(--card) 90%, transparent)', color: 'var(--foreground)' }}
            >
              {product.condition}
            </span>
            {product.modelYear && (
              <span 
                className="px-2.5 py-1 text-[10px] font-bold rounded-full shadow-sm"
                style={{ backgroundColor: 'var(--status-warning)', color: 'white' }}
              >
                {product.modelYear}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
            <WishlistButton
              productId={product.id}
              productType="watch"
              className="h-[40px] w-[40px] p-2 shadow-lg rounded-full transition-colors"
              style={{ backgroundColor: 'var(--card)' }}
            />
            <CompareButton
              product={product}
              productType="watch"
              className="h-[40px] w-[40px] flex items-center justify-center p-2 shadow-lg rounded-full transition-colors"
              style={{ backgroundColor: 'var(--card)' }}
            />
            <button 
              className="cursor-pointer h-[40px] w-[40px] p-2 shadow-lg rounded-full transition-colors"
              style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/watches/${product.id}`);
              }}
            >
              <Eye size={22} />
            </button>
          </div>

          {/* Bottom Info Overlay */}
          {/* <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button 
              className="w-full py-2.5 bg-white text-gray-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart logic
              }}
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div> */}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-1">
            <span 
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block"
              style={{ color: 'var(--status-warning)' }}
            >
              {product.brand}
            </span>
            <h3 
              className="font-bold line-clamp-1 transition-colors" 
              style={{ color: 'var(--foreground)' }}
            >
              {product.model}
            </h3>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
            <div className="flex items-center gap-1">
              <WatchIcon size={12} />
              <span>{product.caseSize}mm</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{product.movementType.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1 capitalize">
              <span>{product.gender}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-lg font-black" style={{ color: 'var(--foreground)' }}>
              {formatPrice(Number(product.price))}
            </span>
            <span className="text-[10px] font-medium uppercase" style={{ color: 'var(--muted-foreground)' }}>
              Ref: {product.referenceNumber || product.stockNumber}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const WatchListCard = ({ product }: { product: WatchProduct }) => {
    const images = [product.image1, product.image2, product.image3, product.image4, product.image5, product.image6].filter(Boolean) as string[];
    const mainImage = images[0] || '/placeholder-watch.png';

    return (
      <div 
        className="group relative rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        onClick={() => router.push(`/watches/${product.id}`)}
      >
        {/* Image Container */}
        <div className="relative w-full md:w-64 aspect-[4/5] md:aspect-square overflow-hidden shrink-0" style={{ backgroundColor: 'var(--muted)' }}>
          <Image
            src={mainImage}
            alt={`${product.brand} ${product.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <WishlistButton
            productId={product.id}
            productType="watch"
            className="absolute top-3 right-3 p-2 shadow-sm rounded-full"
            style={{ backgroundColor: 'color-mix(in srgb, var(--card) 90%, transparent)' }}
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <span 
                className="text-xs font-bold uppercase tracking-[0.2em] mb-1 block"
                style={{ color: 'var(--status-warning)' }}
              >
                {product.brand}
              </span>
              <h3 
                className="text-xl font-bold transition-colors" 
                style={{ color: 'var(--foreground)' }}
              >
                {product.model}
              </h3>
              <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
                {product.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black block" style={{ color: 'var(--foreground)' }}>
                {formatPrice(Number(product.price))}
              </span>
              <span className="text-xs font-medium uppercase" style={{ color: 'var(--muted-foreground)' }}>
                Ref: {product.referenceNumber || product.stockNumber}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y" style={{ borderColor: 'var(--border)' }}>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>Case Size</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{product.caseSize}mm</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>Movement</span>
              <span className="text-sm font-semibold capitalize" style={{ color: 'var(--foreground)' }}>{product.movementType.toLowerCase()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>Material</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{product.caseMaterial}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>Condition</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{product.condition}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button 
              className="flex-1 py-3 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ 
                background: 'linear-gradient(to right, var(--status-warning), color-mix(in srgb, var(--status-warning) 85%, black))'
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button 
              className="px-6 py-3 border text-sm font-bold rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/watches/${product.id}`);
              }}
            >
              Quick View
            </button>
            <CompareButton
              product={product}
              productType="watch"
              className="p-3 border rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
        </div>
      </div>
    );
  };

  const totalAppliedFilters = useMemo(() => {
    let count = 0;
    if (filters.brand.length > 0) count += filters.brand.length;
    if (filters.movementType.length > 0) count += filters.movementType.length;
    if (filters.gender.length > 0) count += filters.gender.length;
    if (filters.condition.length > 0) count += filters.condition.length;
    if (filters.caseMaterial.length > 0) count += filters.caseMaterial.length;
    if (filters.dialColor.length > 0) count += filters.dialColor.length;
    if (filters.priceMin > 0 || filters.priceMax < 1000000) count += 1;
    return count;
  }, [filters]);

  const FilterSections = () => (
    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
      {/* Brand Section */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group"
          style={{ color: 'var(--foreground)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold group-hover:text-primary transition-colors">
              Brand
            </span>
            {filters.brand.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                {filters.brand.length}
              </span>
            )}
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 group-hover:text-primary transition-all duration-300 ${expandedSections.includes('brand') ? 'rotate-180' : ''}`}
          />
        </button>
        {/* {expandedSections.includes('brand') && (
          <div className="px-4 pb-4 pt-2" style={{ backgroundColor: 'var(--muted)' }}>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {brandOptions.map(opt => {
                const isSelected = filters.brand.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`flex flex-col items-center justify-center border rounded-2xl p-2 transition-all ${isSelected ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-primary'}`}
                    onClick={() => {
                      const next = isSelected
                        ? filters.brand.filter(b => b !== opt.value)
                        : [...filters.brand, opt.value];
                      setFilters({ ...filters, brand: next });
                    }}
                  >
                    <div className={`w-10 h-10 mb-1 flex items-center justify-center rounded-full overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      {opt.logo ? (
                        <div className="relative w-7 h-7">
                          <Image
                            src={opt.logo}
                            alt={opt.label}
                            fill
                            className={`object-contain ${isSelected ? 'brightness-0 invert' : ''}`}
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold">{opt.label.substring(0, 2)}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-center line-clamp-1">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )} */}
      </div>

      <FilterSection 
        title="Movement" 
        count={filters.movementType.length}
        isOpen={expandedSections.includes('movementType')}
        onToggle={() => toggleSection('movementType')}
      >
        <CheckboxGroup
          options={movementOptions}
          selectedValues={filters.movementType}
          onChange={(values) => setFilters({ ...filters, movementType: values })}
        />
      </FilterSection>

      <FilterSection 
        title="Gender" 
        count={filters.gender.length}
        isOpen={expandedSections.includes('gender')}
        onToggle={() => toggleSection('gender')}
      >
        <CheckboxGroup
          options={genderOptions}
          selectedValues={filters.gender}
          onChange={(values) => setFilters({ ...filters, gender: values })}
        />
      </FilterSection>

      <FilterSection 
        title="Case Material" 
        count={filters.caseMaterial.length}
        isOpen={expandedSections.includes('caseMaterial')}
        onToggle={() => toggleSection('caseMaterial')}
      >
        <CheckboxGroup
          options={caseMaterialOptions}
          selectedValues={filters.caseMaterial}
          onChange={(values) => setFilters({ ...filters, caseMaterial: values })}
        />
      </FilterSection>

      <FilterSection 
        title="Condition" 
        count={filters.condition.length}
        isOpen={expandedSections.includes('condition')}
        onToggle={() => toggleSection('condition')}
      >
        <CheckboxGroup
          options={conditionOptions}
          selectedValues={filters.condition}
          onChange={(values) => setFilters({ ...filters, condition: values })}
        />
      </FilterSection>

      <FilterSection 
        title="Dial Color" 
        count={filters.dialColor.length}
        isOpen={expandedSections.includes('dialColor')}
        onToggle={() => toggleSection('dialColor')}
      >
        <CheckboxGroup
          options={dialColorOptions}
          selectedValues={filters.dialColor}
          onChange={(values) => setFilters({ ...filters, dialColor: values })}
        />
      </FilterSection>

      <FilterSection 
        title="Price Range" 
        count={(filters.priceMin > 0 || filters.priceMax < 1000000) ? 1 : 0}
        isOpen={expandedSections.includes('price')}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4 pt-2">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Min</label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all focus:ring-2 focus:ring-primary"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Max</label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all focus:ring-2 focus:ring-primary"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          </div>
        </div>
      </FilterSection>
    </div>
  );

  const totalCount = meta?.total || products.length;
  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalCount > 0 ? Math.min(currentPage * pageSize, totalCount) : 0;

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
      <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Mobile Filter Drawer */}
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
                          onClick={() => setFilters({
                            brand: [],
                            movementType: [],
                            gender: [],
                            condition: [],
                            caseMaterial: [],
                            dialColor: [],
                            priceMin: 0,
                            priceMax: 1000000,
                          })}
                          className="text-sm font-medium transition-colors"
                          style={{ color: 'var(--primary)' }}
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
                <div className="flex-1 overflow-y-auto filter-scroll custom-scrollbar" style={{ backgroundColor: 'var(--card)' }}>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    <FilterSections />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t sticky bottom-0 z-10" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-3 text-sm font-bold rounded-xl transition-colors"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Header - aligned with diamond listing layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {totalCount > 0 ? `${totalCount.toLocaleString()} Watches Found` : title}
                </h2>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {loading
                    ? 'Searching...'
                    : totalCount > 0
                      ? `Showing ${startItem}-${endItem} of ${totalCount.toLocaleString()}`
                      : 'We could not find any watches matching your filters.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg shadow border active:scale-95 transition"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  onClick={() => setShowFilters(true)}
                  aria-label="Open filters"
                >
                  <Filter className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                </button>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-8 px-2 rounded-lg shadow border"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  aria-label="Items per page"
                >
                  {[5, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>{n} / page</option>
                  ))}
                </select>
                <div className="relative md:w-40">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-8 w-full appearance-none pl-8 pr-2 rounded-lg shadow border"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    aria-label="Sort watches"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="brand">Brand: A-Z</option>
                  </select>
                  <ArrowUpDown className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} style={{ color: 'var(--muted-foreground)' }} />
                </div>
                <div className="flex items-center shadow border rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition"
                    style={{ backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent', color: viewMode === 'grid' ? 'var(--primary-foreground)' : 'var(--muted-foreground)' }}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition"
                    style={{ backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'transparent', color: viewMode === 'list' ? 'var(--primary-foreground)' : 'var(--muted-foreground)' }}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Brand Filter Bar (Horizontal) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-muted-foreground/30">
            <button
              onClick={() => setFilters({ ...filters, brand: [] })}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors"
              style={{ 
                backgroundColor: filters.brand.length === 0 ? 'var(--primary)' : 'var(--card)',
                borderColor: filters.brand.length === 0 ? 'var(--primary)' : 'var(--border)',
                color: filters.brand.length === 0 ? 'var(--primary-foreground)' : 'var(--foreground)'
              }}
            >
              <span 
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold"
                style={{ 
                  backgroundColor: filters.brand.length === 0 ? 'rgba(255,255,255,0.2)' : 'var(--muted)'
                }}
              >
                All
              </span>
              <span>All Brands</span>
            </button>
              {brandOptions.map(opt => {
                const isSelected = filters.brand.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const next = isSelected
                        ? filters.brand.filter(b => b !== opt.value)
                        : [...filters.brand, opt.value];
                      setFilters({ ...filters, brand: next });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors"
                    style={{ 
                      backgroundColor: isSelected ? 'var(--primary)' : 'var(--card)',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      color: isSelected ? 'var(--primary-foreground)' : 'var(--foreground)'
                    }}
                  >
                    {opt.logo ? (
                      <span
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center overflow-hidden rounded-full shrink-0 transition-colors"
                        style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.1)' : 'white' }}
                      >
                        <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                          <Image
                            src={opt.logo}
                            alt={opt.label}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </span>
                    ) : (
                      <span
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shrink-0"
                        style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.1)' : 'var(--muted)' }}
                      >
                        <span 
                          className="text-[10px] font-semibold"
                          style={{ color: isSelected ? 'white' : 'var(--muted-foreground)' }}
                        >
                          {opt.label
                            .split(' ')
                            .map(word => word.charAt(0))
                            .join('')
                            .slice(0, 3)}
                        </span>
                      </span>
                    )}
                    <span className="leading-none">{opt.label}</span>
                  </button>
                );
              })}
            </div>

        {/* Results Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
              style={{ borderColor: 'var(--primary)' }}
            />
            <p className="font-medium" style={{ color: 'var(--muted-foreground)' }}>Curating luxury timepieces...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-4">
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-4"}>
              {products.map((product) => (
                viewMode === 'grid' ? (
                  <WatchGridCard key={product.id} product={product} />
                ) : (
                  <WatchListCard key={product.id} product={product} />
                )
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.lastPage > 1 && (
              <div className="flex justify-center pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={meta.lastPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        ) : (
          <div
            className="text-center py-12 border rounded-lg"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="text-6xl mb-4">⌚</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              No watches found
            </h3>
            <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={() => setFilters({
                brand: [],
                movementType: [],
                gender: [],
                condition: [],
                caseMaterial: [],
                dialColor: [],
                priceMin: 0,
                priceMax: 1000000,
              })}
              className="px-8 py-3 font-bold rounded-xl transition-all active:scale-95"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
      </div>
    </div>
  </div>
</>
);
};

export default WatchListingPage;
