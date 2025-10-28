"use client";

import React, { useEffect, useLayoutEffect, useState } from 'react';
import DiamondFilters, { DiamondFilterValues } from './DiamondFilters';
import DiamondResults, { Diamond } from './DiamondResults';
import { getDefaultDiamondFilters, transformApiDiamond, ApiDiamondData } from './diamondUtils';
import { cartService } from '@/services/cartService';
import { useAppSelector } from '@/store/hooks';

interface DiamondListingPageProps {
  diamondType: 'lab-grown-single' | 'lab-grown-melee' | 'natural-single' | 'natural-melee';
  fetchDiamonds: (params?: Record<string, unknown>) => Promise<{
    success: boolean;
    message: string;
    data: {
      data: ApiDiamondData[];
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

const DiamondListingPage: React.FC<DiamondListingPageProps> = ({
  diamondType,
  fetchDiamonds,
  title = 'Diamonds',
}) => {
  const token = useAppSelector((state) => state.auth.token);
  const [filters, setFilters] = useState<DiamondFilterValues>(() => getDefaultDiamondFilters(diamondType));
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch diamonds when filters/page changes
  useEffect(() => {
    setLoading(true);
    fetchDiamonds()
      .then((res) => {
        // API: { data: { data: [...], meta: {...} } }
        const diamondsRaw = res.data?.data ?? [];
        setDiamonds(Array.isArray(diamondsRaw) ? diamondsRaw.map((item: ApiDiamondData) => transformApiDiamond(item)) : []);
        setTotalCount(res.data?.meta?.total || 0);
        setCurrentPage(res.data?.meta?.currentPage || 1);
        setPageSize(res.data?.meta?.perPage || 20);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diamondType]);

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
    <div className="w-full py-5">
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
          className="hidden md:flex md:flex-col md:w-72 md:max-w-none bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 p-4 h-fit sticky top-6 self-start max-h-[80vh]"
          style={{ minWidth: '18rem' }}
        >
          <div className="flex items-center justify-between mb-4 sticky top-0 z-10 bg-white dark:bg-slate-900 pt-1 pb-2" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              className="text-xs font-medium text-amber-600 hover:underline"
              onClick={() => {
                // Reset filters to default
                setFilters(getDefaultDiamondFilters(diamondType));
                setCurrentPage(1);
              }}
              aria-label="Reset filters"
            >
              Reset
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
          <DiamondResults
            diamonds={diamonds}
            loading={loading}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onDiamondSelect={(diamond) => {
              if (diamond?.id) {
                window.location.href = `/diamonds/${diamond.id}`;
              }
            } }
            diamondType={diamondType}
            onAddToCart={async (diamondId: string) => {
              if (!token) {
                // Silently ignore if not authenticated; could prompt login in future
                return;
              }
              try {
                await cartService.addToCart({
                  productId: Number(diamondId),
                  productType: diamondType.includes('melee') ? 'meleeDiamond' : 'diamond',
                  quantity: 1,
                }, token);
              } catch {
                // Intentionally swallow errors here; a global toast system can be added
              }
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default DiamondListingPage;
