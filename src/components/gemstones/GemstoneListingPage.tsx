"use client";

import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import GemstoneResults from './GemstoneResults';
import { GemstonItem } from '@/services/gemstoneService';
import GemstoneFilters, { type GemstoneFilterValues } from './GemstoneFilters';
import { ApiResponse } from '@/services/api';
import * as ShapeIcons from '../../../public/icons';
import { ChevronDown, X, Filter } from 'lucide-react';

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

// Use type alias instead of empty interface
type GemstoneApiResponse = ApiResponse<{
  data: GemstonItem[];
  meta: GemstoneApiMeta;
}>;

interface GemstoneListingPageProps {
  gemstoneType: 'single' | 'melee';
  fetchGemstones: (params: GemstoneSearchParams) => Promise<GemstoneApiResponse>;
  title?: string;
}

// Shape name to icon mapping
const shapeIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  Round: ShapeIcons.RoundIcon,
  Pear: ShapeIcons.PearIcon,
  Emerald: ShapeIcons.EmeraldIcon,
  Oval: ShapeIcons.OvalIcon,
  Heart: ShapeIcons.HeartIcon,
  Marquise: ShapeIcons.MarquiseIcon,
  Asscher: ShapeIcons.AsscherIcon,
  Cushion: ShapeIcons.CushionIcon,
  Princess: ShapeIcons.PrincessIcon,
  'Cushion modified': ShapeIcons.CushionModifiedIcon,
  'Cushion brilliant': ShapeIcons.CushionBrilliantIcon,
  Radiant: ShapeIcons.RadiantIcon,
  French: ShapeIcons.FrenchIcon,
  Trilliant: ShapeIcons.TrilliantIcon,
  Briollette: ShapeIcons.BriolletteIcon,
  'Rose cut': ShapeIcons.RosecutIcon,
  Lozenge: ShapeIcons.LozengeIcon,
  Baguette: ShapeIcons.BaguetteIcon,
  'Tapered baguette': ShapeIcons.TaperedBaguetteIcon,
  'Half-moon': ShapeIcons.HalfmoonIcon,
  Flanders: ShapeIcons.FlandersIcon,
  Trapezoid: ShapeIcons.TrapezoidIcon,
  Bullet: ShapeIcons.BulletIcon,
  Kite: ShapeIcons.KiteIcon,
  Shield: ShapeIcons.ShieldIcon,
  'Star cut': ShapeIcons.StarcutIcon,
  Pentagonal: ShapeIcons.PentagonalIcon,
  Hexagonal: ShapeIcons.HexagonalIcon,
  Octagonal: ShapeIcons.OctagonalIcon,
  'Euro cut': ShapeIcons.EurocutIcon,
  'Old Miner': ShapeIcons.OldMinerIcon,
  'Portugeese cut': ShapeIcons.PortugeeseIcon,
};

// Define filter values interface - using the new structure
const getDefaultFilterValues = (gemstoneType: 'single' | 'melee'): GemstoneFilterValues => {
  return {
    gemstoneType: [],
    shape: [],
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
    minerals: [],
    birthstones: [],
    length: { min: 0, max: 100 },
    width: { min: 0, max: 100 },
    height: { min: 0, max: 100 },
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

  // Collapsible filter sections
  const [expandedSections, setExpandedSections] = useState<string[]>(['gemstoneType', 'shape', 'caratWeight', 'priceRange']);

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
    if (filters.enhancement.length > 0) count += filters.enhancement.length;
    if (filters.transparency.length > 0) count += filters.transparency.length;
    if (filters.luster.length > 0) count += filters.luster.length;
    if (filters.phenomena.length > 0) count += filters.phenomena.length;
    if (filters.minerals.length > 0) count += filters.minerals.length;
    if (filters.birthstones.length > 0) count += filters.birthstones.length;
    if (filters.location.length > 0) count += filters.location.length;
    if (filters.companyName) count += 1;
    if (filters.vendorLocation) count += 1;
    if (filters.reportNumber) count += 1;
    if (filters.searchTerm) count += 1;
    return count;
  }, [filters]);

  const buildQueryFromFilters = (f: GemstoneFilterValues) => {
    const params: Record<string, any> = {
      gemType: f.gemstoneType,
      shape: f.shape,
      color: f.color,
      clarity: f.clarity,
      cut: f.cut,
      certification: f.certification,
      origin: f.origin,
      treatment: f.treatment,
      enhancement: f.enhancement,
      transparency: f.transparency,
      luster: f.luster,
      phenomena: f.phenomena,
      minerals: f.minerals,
      birthstones: f.birthstones,
      location: f.location,
      companyName: f.companyName,
      vendorLocation: f.vendorLocation,
      reportNumber: f.reportNumber,
      search: f.searchTerm,
    };

    if (f.priceRange.min > 0) params.priceMin = f.priceRange.min;
    if (f.priceRange.max < 1000000) params.priceMax = f.priceRange.max;
    if (f.caratWeight.min > 0) params.caratMin = f.caratWeight.min;
    if (f.caratWeight.max < 50) params.caratMax = f.caratWeight.max;
    
    if (f.length.min > 0) params.lengthMin = f.length.min;
    if (f.length.max < 100) params.lengthMax = f.length.max;
    if (f.width.min > 0) params.widthMin = f.width.min;
    if (f.width.max < 100) params.widthMax = f.width.max;
    if (f.height.min > 0) params.heightMin = f.height.min;
    if (f.height.max < 100) params.heightMax = f.height.max;

    return params;
  };

  // Fetch gemstones when filters/page changes
  useEffect(() => {
    setLoading(true);
    fetchGemstones({
      category: gemstoneType,
      page: currentPage,
      limit: pageSize,
      ...buildQueryFromFilters(filters),
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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-sm border p-6 backdrop-blur-xl sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Filters</h2>
                </div>
                {totalAppliedFilters > 0 && (
                  <button
                    onClick={() => handleFiltersChange(getDefaultFilterValues(gemstoneType))}
                    className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                  >
                    Reset All
                  </button>
                )}
              </div>
              <GemstoneFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                gemstoneType={gemstoneType}
                expandedSections={expandedSections}
                onToggleSection={toggleSection}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Header / Title */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Filter className="w-6 h-6 text-amber-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>{title}</h1>
              </div>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
              >
                <Filter className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold">Filters</span>
                {totalAppliedFilters > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                    {totalAppliedFilters}
                  </span>
                )}
              </button>
            </div>

            {/* Results Grid */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-sm border p-6 backdrop-blur-xl" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <GemstoneResults
                gemstones={gemstones}
                loading={loading}
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onGemstoneSelect={(gemstone: GemstonItem) => {
                  if (gemstone?.id) {
                    if (gemstoneType === 'single') {
                      window.location.href = `/gemstones/single/${gemstone.id}`;
                    } else if (gemstoneType === 'melee') {
                      window.location.href = `/gemstones/melee/${gemstone.id}`;
                    } else {
                      window.location.href = `/gemstones/${gemstone.id}`;
                    }
                  }
                }}
                onAddToCart={() => { }}
                gemstoneType={gemstoneType}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Existing implementation with minor style tweaks) */}
      {drawerVisible && (
        <>
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setShowFilters(false)}
          />
          <div
            className={`fixed top-0 right-0 w-full max-w-md h-full z-[110] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ backgroundColor: 'var(--card)' }}
            onTransitionEnd={() => { if (!drawerOpen) setDrawerVisible(false); }}
          >
            <div className="border-b px-6 py-5 sticky top-0 z-10" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Filters</h2>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {totalAppliedFilters > 0 && (
                <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-400">
                    {totalAppliedFilters} filters applied
                  </span>
                  <button
                    onClick={() => handleFiltersChange(getDefaultFilterValues(gemstoneType))}
                    className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <GemstoneFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                gemstoneType={gemstoneType}
                expandedSections={expandedSections}
                onToggleSection={toggleSection}
              />
            </div>

            <div className="border-t p-6 sticky bottom-0" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <button
                className="w-full py-4 rounded-xl bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all active:scale-[0.98]"
                onClick={() => setShowFilters(false)}
              >
                Show Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  </>
);
};

export default GemstoneListingPage;
