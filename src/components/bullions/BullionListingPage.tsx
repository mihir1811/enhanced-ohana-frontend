"use client";

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Filter as FilterIcon } from 'lucide-react';
import BullionFilters, { BullionFilterValues } from './BullionFilters';
import BullionResults from './BullionResults';
import { BullionItem, bullionService } from '../../services/bullionService';
import { getDefaultBullionFilters, transformApiBullion } from './bullionUtils';

interface BullionListingPageProps {
  title?: string;
  fetchBullions?: (params: any) => Promise<any>; // expects API response with data & meta
}

const BullionListingPage: React.FC<BullionListingPageProps> = ({
  title = 'Bullions',
  fetchBullions = bullionService.getBullions.bind(bullionService),
}) => {
  const [filters, setFilters] = useState<BullionFilterValues>(() => getDefaultBullionFilters());
  const [bullions, setBullions] = useState<BullionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Debounce ref for API calls
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const initialFetchDone = useRef(false);

  // Debounced fetch function
  const debouncedFetchBullions = useCallback((apiParams: any) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      
      // For now, just use mock data to prevent API issues
      const mockBullions = generateMockBullions();
      setBullions(mockBullions);
      setTotalCount(mockBullions.length);
      setLoading(false);
      
      // Uncomment below when API is ready
      /*
      fetchBullions(apiParams)
        .then((res) => {
          if (res.data && Array.isArray(res.data.data)) {
            setBullions(res.data.data.map(transformApiBullion));
            setTotalCount(res.data.meta?.total || 0);
            setCurrentPage(res.data.meta?.currentPage || 1);
            setPageSize(res.data.meta?.perPage || 20);
          } else if (res.data && Array.isArray(res.data)) {
            setBullions(res.data.map(transformApiBullion));
            setTotalCount(res.data.length);
          } else {
            const mockBullions = generateMockBullions();
            setBullions(mockBullions);
            setTotalCount(mockBullions.length);
          }
        })
        .catch((error) => {
          console.error('Error fetching bullions:', error);
          const mockBullions = generateMockBullions();
          setBullions(mockBullions);
          setTotalCount(mockBullions.length);
        })
        .finally(() => setLoading(false));
      */
    }, 300);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Memoized filter string for stable dependencies
  const filterDependency = useMemo(() => {
    return JSON.stringify({
      type: filters.type.sort(),
      metal: filters.metal.sort(),
      purity: filters.purity.sort(),
      weightMin: filters.weight.min,
      weightMax: filters.weight.max,
      weightUnit: filters.weightUnit,
      priceMin: filters.priceRange.min,
      priceMax: filters.priceRange.max,
      mint: filters.mint.sort(),
      yearMin: filters.yearRange.min,
      yearMax: filters.yearRange.max,
      country: filters.country.sort(),
      condition: filters.condition.sort(),
      certification: filters.certification.sort(),
      freeShipping: filters.freeShipping,
      inStock: filters.inStock,
      searchTerm: filters.searchTerm,
      companyName: filters.companyName,
    });
  }, [filters]);

  // Initial data load
  useEffect(() => {
    const mockBullions = generateMockBullions();
    setBullions(mockBullions);
    setTotalCount(mockBullions.length);
  }, []);

  // Only fetch when filters actually change (debounced)
  useEffect(() => {
    if (!initialFetchDone.current) return;

    const apiParams = {
      type: filters.type.length > 0 ? filters.type : undefined,
      metal: filters.metal.length > 0 ? filters.metal : undefined,
      purity: filters.purity.length > 0 ? filters.purity : undefined,
      weightMin: filters.weight.min > 0 ? filters.weight.min : undefined,
      weightMax: filters.weight.max > 0 ? filters.weight.max : undefined,
      weightUnit: filters.weightUnit || 'oz',
      priceMin: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
      priceMax: filters.priceRange.max > 0 ? filters.priceRange.max : undefined,
      mint: filters.mint.length > 0 ? filters.mint : undefined,
      yearMin: filters.yearRange.min > 1900 ? filters.yearRange.min : undefined,
      yearMax: filters.yearRange.max < new Date().getFullYear() ? filters.yearRange.max : undefined,
      country: filters.country.length > 0 ? filters.country : undefined,
      condition: filters.condition.length > 0 ? filters.condition : undefined,
      certification: filters.certification.length > 0 ? filters.certification : undefined,
      freeShipping: filters.freeShipping || undefined,
      inStock: filters.inStock || undefined,
      search: filters.searchTerm || undefined,
      companyName: filters.companyName || undefined,
      page: currentPage,
      limit: pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    Object.keys(apiParams).forEach(key => {
      if (apiParams[key as keyof typeof apiParams] === undefined) {
        delete apiParams[key as keyof typeof apiParams];
      }
    });

    debouncedFetchBullions(apiParams);
  }, [filterDependency, currentPage]);

  const handleFiltersChange = useCallback((newFilters: BullionFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
    initialFetchDone.current = true; // Mark that user has interacted with filters
  }, []);

  const handleBullionSelect = (bullion: BullionItem) => {
    // Navigate to bullion details page
    window.location.href = `/bullions/${bullion.id}`;
  };

  const handleAddToCart = (bullion: BullionItem) => {
    // Add to cart logic
    console.log('Adding to cart:', bullion);
    // You can implement your cart service here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Mobile filter toggle */}
          <div className="md:hidden fixed top-4 left-4 z-50">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-white rounded-lg shadow-lg border border-gray-200"
            >
              <FilterIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile filters overlay */}
          {showFilters && (
            <>
              <div 
                className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setShowFilters(false)}
              />
              <div className="md:hidden fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    className="text-2xl font-bold text-slate-500 hover:text-slate-900"
                    onClick={() => setShowFilters(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-1">
                  <BullionFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>
                <button
                  className="mt-4 w-full py-2 rounded-lg bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </>
          )}

          {/* Sidebar: hidden on mobile, visible on md+ */}
          <aside
            className="hidden md:flex md:flex-col md:w-72 md:max-w-none bg-white rounded-2xl shadow-xl border border-gray-200 p-4 h-fit sticky top-6 self-start max-h-[80vh]"
            style={{ minWidth: '18rem' }}
          >
            <div className="flex items-center justify-between mb-4 sticky top-0 z-10 bg-white pt-1 pb-2" style={{ borderBottom: '1px solid #f3f4f6' }}>
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                className="text-xs font-medium text-amber-600 hover:underline"
                onClick={() => {
                  // Reset filters to default
                  setFilters(getDefaultBullionFilters());
                  setCurrentPage(1);
                }}
                aria-label="Reset filters"
              >
                Reset
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <BullionFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
            <button
              className="mt-4 w-full py-2 rounded-lg bg-amber-500 text-white font-semibold shadow hover:bg-amber-600 transition"
              onClick={() => {}}
              aria-label="Apply filters (desktop)"
              type="button"
            >
              Apply Filters
            </button>
          </aside>

          {/* Main content */}
          <main className="flex-1 w-full min-w-0">
            <h1 className="text-2xl font-bold mb-4 hidden md:block">{title}</h1>
            <BullionResults
              bullions={bullions}
              loading={loading}
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onBullionSelect={handleBullionSelect}
              onAddToCart={handleAddToCart}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

// Mock data generator for development
const generateMockBullions = (): BullionItem[] => {
  const metals = ['gold', 'silver', 'platinum', 'palladium'];
  const types = ['bar', 'coin', 'round', 'ingot', 'wafer'];
  const purities = ['999.9', '999.0', '958.3', '925.0'];
  const mints = ['Royal Canadian Mint', 'Perth Mint', 'US Mint', 'PAMP Suisse', 'Sunshine Mint'];
  const conditions = ['BU', 'Proof', 'MS70', 'MS69', 'Uncirculated'];

  // Better image mapping based on metal type and bullion type
  const getImageUrl = (metal: string, type: string, index: number) => {
    // Use placeholder.com for consistent, professional-looking images
    const size = '400x400';
    const colors = {
      gold: 'FFD700',
      silver: 'C0C0C0', 
      platinum: 'E5E5E5',
      palladium: 'CED0DD'
    };
    
    const color = colors[metal as keyof typeof colors] || 'FFD700';
    const text = `${metal.toUpperCase()}+${type.toUpperCase()}`;
    
    return `https://via.placeholder.com/${size}/${color}/000000?text=${encodeURIComponent(text)}`;
  };

  return Array.from({ length: 48 }, (_, i) => {
    const metal = metals[i % metals.length];
    const type = types[i % types.length];
    const weight = [0.1, 0.25, 0.5, 1, 2, 5, 10][i % 7];
    
    return {
      id: `mock-${i + 1}`,
      name: `${weight} oz ${metal.charAt(0).toUpperCase() + metal.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)}${Math.random() > 0.5 ? ' - Premium Grade' : ''}`,
      type: type as any,
      metal: metal as any,
      purity: purities[i % purities.length],
      weight: weight,
      weightUnit: 'oz' as any,
      dimensions: {
        length: 20 + (i % 30),
        width: 15 + (i % 20),
        thickness: 1 + (i % 3),
        unit: 'mm' as any,
      },
      mint: mints[i % mints.length],
      year: 2020 + (i % 5),
      country: ['Canada', 'USA', 'Australia', 'Switzerland'][i % 4],
      condition: conditions[i % conditions.length] as any,
      price: 50 + (i * 25) + Math.floor(Math.random() * 500),
      premium: 10 + Math.floor(Math.random() * 50),
      spotPrice: 1800 + Math.floor(Math.random() * 200),
      pricePerOunce: 1850 + Math.floor(Math.random() * 250),
      currency: 'USD',
      images: [
        getImageUrl(metal, type, i),
        getImageUrl(metal, type, i + 100), // Second image variant
      ],
      description: `Premium ${weight} oz ${metal} ${type} from ${mints[i % mints.length]}. Excellent condition with ${purities[i % purities.length]} purity.`,
      seller: {
        id: `seller-${(i % 5) + 1}`,
        companyName: ['Golden Eagle Coins', 'Silver Stackers', 'Precious Metals Plus', 'Bullion Direct', 'Metal Exchange'][i % 5],
        rating: 4.2 + Math.random() * 0.8,
        location: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'][i % 5],
        verified: Math.random() > 0.3,
      },
      inventory: {
        quantity: Math.floor(Math.random() * 100) + 1,
        sku: `${metal.toUpperCase()}-${type.toUpperCase()}-${weight}OZ-${i + 1000}`,
        location: 'Warehouse A',
      },
      shipping: {
        free: Math.random() > 0.4,
        cost: Math.random() > 0.4 ? undefined : 9.99,
        insured: Math.random() > 0.3,
        signature: Math.random() > 0.5,
      },
      status: 'active' as any,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 1000),
      favorites: Math.floor(Math.random() * 50),
    };
  });
};

export default BullionListingPage;
