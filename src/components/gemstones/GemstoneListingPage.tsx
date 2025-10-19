"use client";

import React, { useEffect, useLayoutEffect, useState } from 'react';
import GemstoneResults from './GemstoneResults';
import { GemstonItem } from '@/services/gemstoneService';
import GemstoneFilters, { type GemstoneFilterValues } from './GemstoneFilters';
import { ApiResponse } from '@/services/api';

interface GemstoneSearchParams {
  [key: string]: string | number | boolean | string[] | { min: number; max: number } | undefined;
}

interface GemstoneApiMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

interface GemstoneApiResponse extends ApiResponse<{
  data: GemstonItem[];
  meta: GemstoneApiMeta;
}> {}

interface GemstoneListingPageProps {
  gemstoneType: 'single' | 'melee';
  fetchGemstones: (params: GemstoneSearchParams) => Promise<GemstoneApiResponse>;
  title?: string;
}

// Define filter values interface - using the new structure
const getDefaultFilterValues = (gemstoneType: 'single' | 'melee'): GemstoneFilterValues => {
  return {
    gemstoneType: [],
    caratWeight: { 
      min: gemstoneType === 'melee' ? 0.01 : 0.1, 
      max: gemstoneType === 'melee' ? 5 : 20 
    },
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
  };
};

const GemstoneListingPage: React.FC<GemstoneListingPageProps> = ({
  gemstoneType,
  fetchGemstones,
  title = 'Gemstones',
}) => {
  const [filters, setFilters] = useState<GemstoneFilterValues>(() => getDefaultFilterValues(gemstoneType));
  const [gemstones, setGemstones] = useState<GemstonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch gemstones when filters/page changes
  useEffect(() => {
    setLoading(true);
    fetchGemstones({
      category: gemstoneType,
      page: currentPage,
      limit: pageSize,
      ...filters,
    })
      .then((res) => {
        // API: { data: [...], meta: { total, currentPage, perPage } }
        setGemstones(res.data.data || []);
        setTotalCount(res.data.meta?.total || 0);
        setCurrentPage(res.data.meta?.currentPage || 1);
        setPageSize(res.data.meta?.perPage || 20);
      })
      .catch((err) => {
        console.error('Error fetching gemstones:', err);
        setGemstones([]);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), currentPage, pageSize, gemstoneType]);

  const handleFiltersChange = (newFilters: GemstoneFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Commented out unused handleResetFilters function - uncomment if needed
  // const handleResetFilters = () => {
  //   setFilters(getDefaultFilterValues(gemstoneType));
  //   setCurrentPage(1);
  // };

  // Mobile filter sidebar state with animation
  const [showFilters, setShowFilters] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Listen for custom event to open filter drawer from child (GemstoneResults)
  useEffect(() => {
    const handler = () => setShowFilters(true);
    window.addEventListener('openGemstoneFilters', handler);
    return () => window.removeEventListener('openGemstoneFilters', handler);
  }, []);

  return (
    <div className="w-full py-5">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative">
        {/* Drawer for mobile filters with animation */}
        {drawerVisible && (
          <>
            {/* Overlay */}
            <div
              className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setShowFilters(false)}
              aria-label="Close filters overlay"
            />
            {/* Drawer */}
            <div
              className={`fixed top-0 left-0 w-11/12 max-w-xs h-full bg-white dark:bg-slate-900 z-50 shadow-2xl p-4 flex flex-col transition-transform duration-300 md:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
              style={{ minHeight: '100vh' }}
              onTransitionEnd={() => {
                if (!drawerOpen) setDrawerVisible(false);
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  className="text-2xl font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  onClick={() => setShowFilters(false)}
                  aria-label="Close filters"
                >
                  &times;
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                <GemstoneFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  gemstoneType={gemstoneType}
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
          className="hidden md:flex md:flex-col md:w-72 md:max-w-none bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 p-4 h-fit sticky top-6 self-start max-h-[80vh]"
          style={{ minWidth: '18rem' }}
        >
          <div className="flex items-center justify-between mb-4 sticky top-0 z-10 bg-white dark:bg-slate-900 pt-1 pb-2" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              className="text-xs font-medium text-amber-600 hover:underline"
              onClick={() => {
                // Reset filters to default
                setFilters(getDefaultFilterValues(gemstoneType));
                setCurrentPage(1);
              }}
              aria-label="Reset filters"
            >
              Reset
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <GemstoneFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              gemstoneType={gemstoneType}
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
          <GemstoneResults
            gemstones={gemstones}
            loading={loading}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onGemstoneSelect={(gemstone: GemstonItem) => {
              if (gemstone?.id) {
                // Redirect based on current page's gemstone type
                if (gemstoneType === 'single') {
                  window.location.href = `/gemstones/single/${gemstone.id}`;
                } else if (gemstoneType === 'melee') {
                  window.location.href = `/gemstones/melee/${gemstone.id}`;
                } else {
                  // Default fallback for general gemstones page
                  window.location.href = `/gemstones/${gemstone.id}`;
                }
              }
            }}
            onAddToCart={() => { }}
            gemstoneType={gemstoneType}
          />
        </main>
      </div>
    </div>
  );
};

export default GemstoneListingPage;
