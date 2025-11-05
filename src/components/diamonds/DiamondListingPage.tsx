"use client";

import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { DiamondFilterValues } from './DiamondFilters';
import DiamondResults, { Diamond } from './DiamondResults';
import { getDefaultDiamondFilters, transformApiDiamond, ApiDiamondData } from './diamondUtils';
import { cartService } from '@/services/cartService';
import { useAppSelector } from '@/store/hooks';
import * as ShapeIcons from '../../../public/icons';
import { ChevronDown, X } from 'lucide-react';

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
  
  // Collapsible filter sections
  const [expandedSections, setExpandedSections] = useState<string[]>(['shape', 'caratWeight', 'color']);
  
  // Color type toggle (Standard or Fancy)
  const [colorType, setColorType] = useState<'standard' | 'fancy'>('standard');
  
  // Show more shapes toggle
  const [showAllShapes, setShowAllShapes] = useState(false);
  
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
    if (filters.shape.length > 0) count += filters.shape.length;
    if (filters.color && filters.color.length > 0) count += filters.color.length;
    if (filters.clarity.length > 0) count += filters.clarity.length;
    if (filters.cut.length > 0) count += filters.cut.length;
    if (filters.polish && filters.polish.length > 0) count += filters.polish.length;
    if (filters.symmetry && filters.symmetry.length > 0) count += filters.symmetry.length;
    if (filters.certification && filters.certification.length > 0) count += filters.certification.length;
    if (filters.fluorescence && filters.fluorescence.length > 0) count += filters.fluorescence.length;
    if (filters.fancyColor && filters.fancyColor.length > 0) count += filters.fancyColor.length;
    if (filters.fancyIntensity && filters.fancyIntensity.length > 0) count += filters.fancyIntensity.length;
    if (filters.fancyOvertone && filters.fancyOvertone.length > 0) count += filters.fancyOvertone.length;
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

  // Listen for custom event to open filter drawer from child (DiamondResults)
  useEffect(() => {
    const handler = () => setShowFilters(true);
    window.addEventListener('openDiamondFilters', handler);
    return () => window.removeEventListener('openDiamondFilters', handler);
  }, []);

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
    'Cushion Modified': ShapeIcons.CushionModifiedIcon,
    'Cushion Brilliant': ShapeIcons.CushionBrilliantIcon,
    Radiant: ShapeIcons.RadiantIcon,
    French: ShapeIcons.FrenchIcon,
    Trilliant: ShapeIcons.TrilliantIcon,
    Briolette: ShapeIcons.BriolletteIcon,
    'Rose Cut': ShapeIcons.RosecutIcon,
    Lozenge: ShapeIcons.LozengeIcon,
    Baguette: ShapeIcons.BaguetteIcon,
    'Tapered Baguette': ShapeIcons.TaperedBaguetteIcon,
    'Half-Moon': ShapeIcons.HalfmoonIcon,
    Flanders: ShapeIcons.FlandersIcon,
    Trapezoid: ShapeIcons.TrapezoidIcon,
    Bullet: ShapeIcons.BulletIcon,
    Kite: ShapeIcons.KiteIcon,
    Shield: ShapeIcons.ShieldIcon,
    'Star Cut': ShapeIcons.StarcutIcon,
    Pentagonal: ShapeIcons.PentagonalIcon,
    Hexagonal: ShapeIcons.HexagonalIcon,
    Octagonal: ShapeIcons.OctagonalIcon,
    'Euro Cut': ShapeIcons.EurocutIcon,
    'Old Miner': ShapeIcons.OldMinerIcon,
    'Portugeese Cut': ShapeIcons.PortugeeseIcon,
  };

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
      <div className="w-full py-5  min-h-screen">
        <div className="flex flex-col md:flex-row gap-6 relative max-w-7xl mx-auto">
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
                        onClick={() => handleFiltersChange(getDefaultDiamondFilters(diamondType))}
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
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {(() => {
                            const allShapes = [
                              'Round', 'Pear', 'Emerald', 'Oval', 'Heart', 'Marquise', 
                              'Asscher', 'Cushion', 'Princess', 'Cushion Modified', 
                              'Cushion Brilliant', 'Radiant', 'French', 'Trilliant', 
                              'Briolette', 'Rose Cut', 'Lozenge', 'Baguette', 
                              'Tapered Baguette', 'Half-Moon', 'Flanders', 'Trapezoid', 
                              'Bullet', 'Kite', 'Shield', 'Star Cut', 'Pentagonal', 
                              'Hexagonal', 'Octagonal', 'Euro Cut', 'Old Miner', 'Portugeese Cut'
                            ];
                            const displayShapes = showAllShapes ? allShapes : allShapes.slice(0, 12);
                            
                            return displayShapes.map(shape => {
                              const Icon = shapeIconMap[shape] || ShapeIcons.DefaultIcon;
                              const isSelected = filters.shape.includes(shape);
                              return (
                                <button
                                  key={shape}
                                  type="button"
                                  className={`flex flex-col items-center justify-center border rounded-full p-2 transition-all ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white border-yellow-600' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-yellow-300'}`}
                                  onClick={() => {
                                    const next = isSelected
                                      ? filters.shape.filter(s => s !== shape)
                                      : [...filters.shape, shape];
                                    handleFiltersChange({ ...filters, shape: next });
                                  }}
                                >
                                  <span className={`w-8 h-8 mb-1 flex items-center justify-center ${isSelected ? 'text-white' : 'text-yellow-600 dark:text-yellow-500'}`}>
                                    <Icon width={24} height={24} />
                                  </span>
                                  <span className={`text-xs font-medium text-center ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{shape}</span>
                                </button>
                              );
                            });
                          })()}
                        </div>
                        
                        {/* Show More / Show Less Button */}
                        <button
                          type="button"
                          className="w-full mt-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          onClick={() => setShowAllShapes(!showAllShapes)}
                        >
                          {showAllShapes ? '− Show Less' : `+ Show More (${32 - 12} more shapes)`}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Carat & Price Range */}
                  <div>
                    <button
                      onClick={() => toggleSection('caratWeight')}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        Carat Weight
                        {(filters.caratWeight.min > 0 || filters.caratWeight.max > 0) && (
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
                      <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Min Carat</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                              placeholder="0.00"
                              min={0}
                              step={0.01}
                              value={filters.caratWeight.min || ''}
                              onChange={e => handleFiltersChange({ ...filters, caratWeight: { ...filters.caratWeight, min: e.target.value ? Number(e.target.value) : 0 } })}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Max Carat</label>
                            <input
                              type="number"
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                              placeholder="No limit"
                              min={0}
                              step={0.01}
                              value={filters.caratWeight.max || ''}
                              onChange={e => handleFiltersChange({ ...filters, caratWeight: { ...filters.caratWeight, max: e.target.value ? Number(e.target.value) : 0 } })}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Color Type & Filters Section */}
                  <div>
                    <button
                      onClick={() => toggleSection('color')}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        Color
                        {((filters.color && filters.color.length > 0) || (filters.fancyColor && filters.fancyColor.length > 0)) && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                            {(filters.color?.length || 0) + (filters.fancyColor?.length || 0)}
                          </span>
                        )}
                      </h3>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('color') ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedSections.includes('color') && (
                      <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                        {/* Color Type Toggle */}
                        <div className="flex gap-2 mb-4">
                          <button
                            type="button"
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              colorType === 'standard'
                                ? 'bg-amber-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => setColorType('standard')}
                          >
                            Standard
                          </button>
                          <button
                            type="button"
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              colorType === 'fancy'
                                ? 'bg-amber-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => setColorType('fancy')}
                          >
                            Fancy
                          </button>
                        </div>

                        {/* Standard Color Options */}
                        {colorType === 'standard' && (
                          <div className="grid grid-cols-6 gap-2">
                            {['D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].map(color => {
                              const isSelected = filters.color?.includes(color);
                              return (
                                <button
                                  key={color}
                                  type="button"
                                  className={`px-2 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-300'}`}
                                  onClick={() => {
                                    const currentColors = filters.color || [];
                                    const next = isSelected
                                      ? currentColors.filter(c => c !== color)
                                      : [...currentColors, color];
                                    handleFiltersChange({ ...filters, color: next });
                                  }}
                                >
                                  {color}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Fancy Color Options */}
                        {colorType === 'fancy' && (
                          <div className="space-y-4">
                            {/* Fancy Colors */}
                            <div>
                              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">Fancy Color</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { name: 'Yellow', color: '#FFD700' },
                                  { name: 'Orange', color: '#FFA500' },
                                  { name: 'Blue', color: '#4169E1' },
                                  { name: 'Red', color: '#FF0000' },
                                  { name: 'Pink', color: '#FFB6C1' },
                                  { name: 'Green', color: '#50C878' },
                                  { name: 'olive', color: '#636B2F' },
                                  { name: 'Brown', color: '#8B4513' },
                                  { name: 'Purple', color: '#800080' },
                                  { name: 'other', color: 'linear-gradient(#FF0000,#FFB6C1,#4169E1,#50C878,#FFD700)' },
                                ].map(({ name, color: colorValue }) => {
                                  const isSelected = filters.fancyColor?.includes(name);
                                  const isGradient = colorValue.startsWith('linear-gradient');
                                  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
                                  
                                  return (
                                    <button
                                      key={name}
                                      type="button"
                                      className={`px-2 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-300'}`}
                                      onClick={() => {
                                        const currentFancyColors = filters.fancyColor || [];
                                        const next = isSelected
                                          ? currentFancyColors.filter((c: string) => c !== name)
                                          : [...currentFancyColors, name];
                                        handleFiltersChange({ ...filters, fancyColor: next });
                                      }}
                                    >
                                      <span 
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={isGradient 
                                          ? { background: colorValue }
                                          : { backgroundColor: colorValue }
                                        }
                                      ></span>
                                      {displayName}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Intensity */}
                            <div>
                              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">Intensity</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {['Faint', 'Very Light', 'Light', 'Fancy Light', 'Fancy', 'Fancy Intense', 'Fancy Vivid', 'Fancy Deep', 'Fancy Dark'].map(intensity => {
                                  const isSelected = filters.fancyIntensity?.includes(intensity);
                                  return (
                                    <button
                                      key={intensity}
                                      type="button"
                                      className={`px-2 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-300'}`}
                                      onClick={() => {
                                        const currentIntensity = filters.fancyIntensity || [];
                                        const next = isSelected
                                          ? currentIntensity.filter(i => i !== intensity)
                                          : [...currentIntensity, intensity];
                                        handleFiltersChange({ ...filters, fancyIntensity: next });
                                      }}
                                    >
                                      {intensity}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Overtone */}
                            <div>
                              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">Overtone</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {['None', 'Yellowish', 'Pinkish', 'Blueish', 'Greenish', 'Brownish', 'Orangy', 'Grayish'].map(overtone => {
                                  const isSelected = filters.fancyOvertone?.includes(overtone);
                                  return (
                                    <button
                                      key={overtone}
                                      type="button"
                                      className={`px-2 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-300'}`}
                                      onClick={() => {
                                        const currentOvertone = filters.fancyOvertone || [];
                                        const next = isSelected
                                          ? currentOvertone.filter(o => o !== overtone)
                                          : [...currentOvertone, overtone];
                                        handleFiltersChange({ ...filters, fancyOvertone: next });
                                      }}
                                    >
                                      {overtone}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Clarity Section */}
                  <div>
                    <button
                      onClick={() => toggleSection('clarity')}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        Clarity
                        {filters.clarity.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                            {filters.clarity.length}
                          </span>
                        )}
                      </h3>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('clarity') ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedSections.includes('clarity') && (
                      <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {['FL','IF','VVS1','VVS2','VS1','VS2','SI1','SI2','SI3','I1','I2','I3'].map(clarity => {
                            const isSelected = filters.clarity.includes(clarity);
                            return (
                              <button
                                key={clarity}
                                type="button"
                                className={`px-2 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-300'}`}
                                onClick={() => {
                                  const next = isSelected
                                    ? filters.clarity.filter(c => c !== clarity)
                                    : [...filters.clarity, clarity];
                                  handleFiltersChange({ ...filters, clarity: next });
                                }}
                              >
                                {clarity}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cut Grade Section */}
                  <div>
                    <button
                      onClick={() => toggleSection('cut')}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        Cut
                        {filters.cut.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                            {filters.cut.length}
                          </span>
                        )}
                      </h3>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('cut') ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedSections.includes('cut') && (
                      <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['ID','EX','VG','GD','FR','PR'].map(cut => {
                            const isSelected = filters.cut.includes(cut);
                            return (
                              <button
                                key={cut}
                                type="button"
                                className={`px-2 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-300'}`}
                                onClick={() => {
                                  const next = isSelected
                                    ? filters.cut.filter(c => c !== cut)
                                    : [...filters.cut, cut];
                                  handleFiltersChange({ ...filters, cut: next });
                                }}
                              >
                                {cut}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Polish Section */}
                  <div>
                    <button
                      onClick={() => toggleSection('polish')}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        Polish
                        {filters.polish && filters.polish.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                            {filters.polish.length}
                          </span>
                        )}
                      </h3>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('polish') ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedSections.includes('polish') && (
                      <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {['EX','VG','GD','FR','PR'].map(polish => {
                            const isSelected = filters.polish?.includes(polish);
                            return (
                              <button
                                key={polish}
                                type="button"
                                className={`px-2 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-300'}`}
                                onClick={() => {
                                  const currentPolish = filters.polish || [];
                                  const next = isSelected
                                    ? currentPolish.filter(p => p !== polish)
                                    : [...currentPolish, polish];
                                  handleFiltersChange({ ...filters, polish: next });
                                }}
                              >
                                {polish}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Symmetry Section */}
                  <div>
                    <button
                      onClick={() => toggleSection('symmetry')}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        Symmetry
                        {filters.symmetry && filters.symmetry.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                            {filters.symmetry.length}
                          </span>
                        )}
                      </h3>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('symmetry') ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedSections.includes('symmetry') && (
                      <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {['EX','VG','GD','FR','PR'].map(symmetry => {
                            const isSelected = filters.symmetry?.includes(symmetry);
                            return (
                              <button
                                key={symmetry}
                                type="button"
                                className={`px-2 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-300'}`}
                                onClick={() => {
                                  const currentSymmetry = filters.symmetry || [];
                                  const next = isSelected
                                    ? currentSymmetry.filter(s => s !== symmetry)
                                    : [...currentSymmetry, symmetry];
                                  handleFiltersChange({ ...filters, symmetry: next });
                                }}
                              >
                                {symmetry}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Certification (Lab) Section */}
                  <div>
                    <button
                      onClick={() => toggleSection('lab')}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        Lab
                        {filters.certification && filters.certification.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                            {filters.certification.length}
                          </span>
                        )}
                      </h3>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('lab') ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedSections.includes('lab') && (
                      <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {['GIA','IGI','HRD','GCAL','AGS'].map(cert => {
                            const isSelected = filters.certification?.includes(cert);
                            return (
                              <button
                                key={cert}
                                type="button"
                                className={`px-2 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-300'}`}
                                onClick={() => {
                                  const currentCert = filters.certification || [];
                                  const next = isSelected
                                    ? currentCert.filter(c => c !== cert)
                                    : [...currentCert, cert];
                                  handleFiltersChange({ ...filters, certification: next });
                                }}
                              >
                                {cert}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fluorescence Section */}
                  <div>
                    <button
                      onClick={() => toggleSection('fluorescence')}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                        Fluorescence
                        {filters.fluorescence && filters.fluorescence.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                            {filters.fluorescence.length}
                          </span>
                        )}
                      </h3>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all ${expandedSections.includes('fluorescence') ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedSections.includes('fluorescence') && (
                      <div className="px-6 pb-5 pt-3 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['None','Faint','Medium','Slight','Strong','V. Str'].map(fluor => {
                            const isSelected = filters.fluorescence?.includes(fluor);
                            return (
                              <button
                                key={fluor}
                                type="button"
                                className={`px-2 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-300'}`}
                                onClick={() => {
                                  const currentFluor = filters.fluorescence || [];
                                  const next = isSelected
                                    ? currentFluor.filter(f => f !== fluor)
                                    : [...currentFluor, fluor];
                                  handleFiltersChange({ ...filters, fluorescence: next });
                                }}
                              >
                                {fluor}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ratio Range Section - Removed due to type errors */}
                </div>
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
          {/* <h1 className="text-2xl font-bold mb-4 hidden md:block">{title}</h1> */}
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
            selectedShapes={filters.shape}
            onShapeChange={(shapes) => {
              handleFiltersChange({ ...filters, shape: shapes });
            }}
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
    </>
  );
};

export default DiamondListingPage;
