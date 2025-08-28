"use client";

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Filter as FilterIcon } from 'lucide-react';
import DiamondFilters, { DiamondFilterValues } from './DiamondFilters';
import DiamondResults, { Diamond } from './DiamondResults';
import { getDefaultDiamondFilters, transformApiDiamond } from './diamondUtils';

interface DiamondListingPageProps {
  diamondType: 'lab-grown-single' | 'lab-grown-melee' | 'natural-single' | 'natural-melee';
  fetchDiamonds: (params: any) => Promise<any>; // expects API response with data & meta
  title?: string;
}

const DiamondListingPage: React.FC<DiamondListingPageProps> = ({
  diamondType,
  fetchDiamonds,
  title = 'Diamonds',
}) => {
  const [filters, setFilters] = useState<DiamondFilterValues>(() => getDefaultDiamondFilters(diamondType));
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch diamonds when filters/page changes
  useEffect(() => {
    setLoading(true);
    fetchDiamonds({
      // ...filters,
      // page: currentPage,
      // perPage: pageSize,
      // diamondType,
    })
      .then((res) => {
        // API: { data: [...], meta: { total, currentPage, perPage } }
        setDiamonds(res.data.data.map(transformApiDiamond));
        setTotalCount(res.data.meta?.total || 0);
        setCurrentPage(res.data.meta?.currentPage || 1);
        setPageSize(res.data.meta?.perPage || 20);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), currentPage, pageSize, diamondType]);

  const handleFiltersChange = (newFilters: DiamondFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };


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

  // Listen for custom event to open filter drawer from child (DiamondResults)
  useEffect(() => {
    const handler = () => setShowFilters(true);
    window.addEventListener('openDiamondFilters', handler);
    return () => window.removeEventListener('openDiamondFilters', handler);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative">
        {/* Remove floating filter button on mobile; filter button is now in results header */}

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
                <DiamondFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  diamondType={diamondType}
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
          className="hidden md:block md:w-72 md:max-w-none md:p-0 md:rounded-none md:shadow-none"
        >
          <DiamondFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            diamondType={diamondType}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 w-full min-w-0">
          <h1 className="text-2xl font-bold mb-4 hidden md:block">{title}</h1>
          <DiamondResults
            diamonds={diamonds}
            loading={loading}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onDiamondSelect={() => { }}
            onAddToWishlist={() => { }}
            onAddToCart={() => { }}
            diamondType={diamondType}
          />
        </main>
      </div>
    </div>
  );
};

export default DiamondListingPage;
