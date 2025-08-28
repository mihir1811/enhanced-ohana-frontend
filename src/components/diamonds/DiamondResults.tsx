'use client'

import { useState } from 'react'
import { Eye, Heart, ShoppingCart, Download, Grid, List, ArrowUpDown, ChevronDown, CopyPlus, Filter as FilterIcon } from 'lucide-react'
import Pagination from '../ui/Pagination';
import * as ShapeIcons from '@/../public/icons';


export interface Diamond {
  id: string
  shape: string
  caratWeight: number
  color: string
  clarity: string
  cut: string
  price: number
  certification: string
  reportNumber: string
  fluorescence: string
  polish: string
  symmetry: string
  measurements: {
    length: number
    width: number
    depth: number
  }
  tablePercent: number
  depthPercent: number
  girdle: string
  culet: string
  location: string
  supplier: {
    name: string
    verified: boolean
    rating: number
  }
  images: string[]
  video?: string
  availability: 'available' | 'reserved' | 'sold'
  createdAt: string
  updatedAt: string
}

interface DiamondResultsProps {
  diamonds: Diamond[]
  loading: boolean
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onDiamondSelect: (diamond: Diamond) => void
  onAddToWishlist: (diamondId: string) => void
  onAddToCart: (diamondId: string) => void
  diamondType: 'natural-single' | 'natural-melee' | 'lab-grown-single' | 'lab-grown-melee'
  className?: string
}

type SortOption = 'price-asc' | 'price-desc' | 'carat-asc' | 'carat-desc' | 'newest' | 'popular'
type ViewMode = 'grid' | 'list'

export default function DiamondResults({
  diamonds,
  loading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onDiamondSelect,
  onAddToWishlist,
  onAddToCart,
  diamondType,
  className = ''
}: DiamondResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('price-asc')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedShapes, setSelectedShapes] = useState<string[]>(['All'])


  // Map shape names to icon components (default fallback if not found)
  // Full list of 32 diamond shapes
  const DIAMOND_SHAPES = [
    "Round",
    "Pear",
    "Emerald",
    "Oval",
    "Heart",
    "Marquise",
    "Asscher",
    "Cushion",
    "Cushion modified",
    "Cushion brilliant",
    "Radiant",
    "Princess",
    "French",
    "Trilliant",
    "Euro cut",
    "Old Miner",
    "Briollette",
    "Rose cut",
    "Lozenge",
    "Baguette",
    "Tapered baguette",
    "Half-moon",
    "Flanders",
    "Trapezoid",
    "Bullet",
    "Kite",
    "Shield",
    "Star cut",
    "Pentagonal cut",
    "Hexagonal cut",
    "Octagonal cut",
    "Portugeese cut"
  ];

  // Map shape names to icon components (default fallback if not found)
  // Make shapeIconMap case-insensitive by using lowercase keys
  const shapeIconMap: Record<string, React.ComponentType<any>> = {
    'round': ShapeIcons.RoundIcon,
    'pear': ShapeIcons.PearIcon,
    'emerald': ShapeIcons.EmeraldIcon,
    'oval': ShapeIcons.OvalIcon,
    'heart': ShapeIcons.HeartIcon,
    'marquise': ShapeIcons.MarquiseIcon,
    'asscher': ShapeIcons.AsscherIcon,
    'cushion': ShapeIcons.CushionIcon,
    'cushion modified': ShapeIcons.CushionModifiedIcon,
    'cushion brilliant': ShapeIcons.CushionBrilliantIcon,
    'radiant': ShapeIcons.RadiantIcon,
    'princess': ShapeIcons.PrincessIcon,
    'french': ShapeIcons.FrenchIcon,
    'trilliant': ShapeIcons.TrilliantIcon,
    'euro cut': ShapeIcons.EurocutIcon,
    'old miner': ShapeIcons.OldMinerIcon,
    'briollette': ShapeIcons.BriolletteIcon,
    'rose cut': ShapeIcons.RosecutIcon,
    'lozenge': ShapeIcons.LozengeIcon,
    'baguette': ShapeIcons.BaguetteIcon,
    'tapered baguette': ShapeIcons.TaperedBaguetteIcon,
    'half-moon': ShapeIcons.HalfmoonIcon,
    'flanders': ShapeIcons.FlandersIcon,
    'trapezoid': ShapeIcons.TrapezoidIcon,
    'bullet': ShapeIcons.BulletIcon,
    'kite': ShapeIcons.KiteIcon,
    'shield': ShapeIcons.ShieldIcon,
    'star cut': ShapeIcons.StarcutIcon,
    'pentagonal cut': ShapeIcons.PentagonalIcon,
    'hexagonal cut': ShapeIcons.HexagonalIcon,
    'octagonal cut': ShapeIcons.OctagonalIcon,
    'portugeese cut': ShapeIcons.PortugeeseIcon,
    // fallback
    'default': ShapeIcons.DefaultIcon
  };



  const shapeOptions = [
    { value: 'All', label: 'All', icon: <ShapeIcons.DefaultIcon width={20} height={20} /> },
    ...DIAMOND_SHAPES.map(shape => {
      const Icon = shapeIconMap[shape.toLowerCase()] || shapeIconMap['default'];
      return {
        value: shape,
        label: shape,
        icon: <Icon width={20} height={20} />
      };
    })
  ];


  // Helper to get shape icon component for a given shape (case-insensitive)
  const getShapeIcon = (shape: string) => {
    const Icon = shapeIconMap[shape?.toLowerCase?.()] || shapeIconMap['default'];
    return <Icon width={20} height={20} />;
  };

  const filteredDiamonds =
    selectedShapes.includes('All')
      ? diamonds
      : diamonds.filter(d =>
          d.shape && selectedShapes.some(sel => d.shape.toLowerCase() === sel.toLowerCase())
        );

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'carat-asc', label: 'Carat: Low to High' },
    { value: 'carat-desc', label: 'Carat: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ]

  const totalPages = Math.ceil(totalCount / pageSize)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600'
      case 'reserved': return 'text-yellow-600'
      case 'sold': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Grid view: tile card (image on top, details below, floating favorite button, compare & quick view)
  const DiamondGridCard = ({ diamond }: { diamond: Diamond }) => {
    // Support both diamond.images and legacy image1-image6
    const allImages = [
      ...(diamond.images || []),
      (diamond as any).image1, (diamond as any).image2, (diamond as any).image3, (diamond as any).image4, (diamond as any).image5, (diamond as any).image6
    ].filter((img, i, arr) => img && typeof img === 'string' && img.trim() && arr.indexOf(img) === i);
    const [imgIdx, setImgIdx] = useState(0);
    const hasImages = allImages.length > 0;

    const prevImg = (e: React.MouseEvent) => {
      e.stopPropagation();
      setImgIdx(idx => (idx - 1 + allImages.length) % allImages.length);
    };
    const nextImg = (e: React.MouseEvent) => {
      e.stopPropagation();
      setImgIdx(idx => (idx + 1) % allImages.length);
    };

    return (
        <div
          className="relative border rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col overflow-hidden min-w-[260px] max-w-[320px]"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
          onClick={() => onDiamondSelect(diamond)}
        >
        {/* Image Carousel & Favorite */}
        <div className="relative w-full aspect-square flex items-center justify-center bg-gray-50"
          style={{ background: 'var(--muted)' }}>
          {/* Compare & Quick View Icons */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-20">
            <button
              className="p-2 rounded-full shadow border bg-white/80 hover:bg-white transition-colors"
              style={{ borderColor: 'var(--border)' }}
              title="Compare"
              onClick={e => { e.stopPropagation(); /* TODO: handle compare */ }}
            >
              <CopyPlus className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </button>
            <button
              className="p-2 rounded-full shadow border bg-white/80 hover:bg-white transition-colors"
              style={{ borderColor: 'var(--border)' }}
              title="Quick View"
              onClick={e => { e.stopPropagation(); /* TODO: handle quick view */ }}
            >
              <Eye className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </button>
          </div>
          {hasImages ? (
            <>
              <img
                src={allImages[imgIdx]}
                alt={`${diamond.shape} Diamond`}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 bg-white"
                loading="lazy"
                style={{ objectFit: 'contain', background: 'white', borderRadius: 8, maxHeight: '100%', maxWidth: '100%' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              {allImages.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow border z-10"
                    style={{ borderColor: 'var(--border)' }}
                    onClick={prevImg}
                    tabIndex={-1}
                  >
                    <ChevronDown className="w-5 h-5 rotate-90" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow border z-10"
                    style={{ borderColor: 'var(--border)' }}
                    onClick={nextImg}
                    tabIndex={-1}
                  >
                    <ChevronDown className="w-5 h-5 -rotate-90" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {allImages.map((img, i) => (
                      <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === imgIdx ? 'bg-primary' : 'bg-gray-300'}`}></span>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="text-5xl" style={{ color: 'var(--muted-foreground)' }}>💎</span>
          )}
          {/* Favorite Button (always visible, top right) */}
          <button
            onClick={e => { e.stopPropagation(); onAddToWishlist(diamond.id); }}
            className="absolute top-2 right-2 p-2 rounded-full shadow hover:bg-pink-100 transition-colors z-10 border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            title="Add to Favourites"
          >
            <Heart className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          </button>
          {/* Availability Badge */}
          <span className={`absolute bottom-2 left-2 px-2 py-1 text-xs font-semibold rounded-full shadow`} style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--primary)' }}>
            {(diamond.availability || 'available').charAt(0).toUpperCase() + (diamond.availability || 'available').slice(1)}
          </span>
        </div>
        {/* Details */}
        <div className="flex-1 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-base truncate" style={{ color: 'var(--foreground)' }}>
              {diamond.caratWeight}ct {diamond.shape}
            </h3>
            <span className="text-base font-bold" style={{ color: 'var(--primary)' }}>
              {formatPrice(diamond.price)}
            </span>
          </div>
          {/* Reference Number */}
          <div className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Ref: <span className="font-mono">{diamond.reportNumber || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div className="truncate">Color: <span className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.color}</span></div>
            <div className="truncate">Clarity: <span className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.clarity}</span></div>
            <div className="truncate flex items-center gap-1">Shape: <span className="inline-block align-middle w-5 h-5 text-primary">{getShapeIcon(diamond.shape)}</span> <span className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.shape}</span></div>
            <div className="truncate">Carat: <span className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.caratWeight}</span></div>
          </div>
          {/* Supplier & Actions */}
          <div className="flex items-center justify-between pt-2 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-2">
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {(diamond.supplier && diamond.supplier.name) ? diamond.supplier.name : 'Unknown Supplier'}
              </span>
              {diamond.supplier && diamond.supplier.verified && (
                <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                  Verified
                </span>
              )}
            </div>
            <button
              onClick={e => { e.stopPropagation(); onAddToCart(diamond.id); }}
              className="px-3 py-1 rounded-lg font-medium transition-colors text-xs"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4 inline mr-1" />Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  // List view: horizontal card (with compare & quick view)
  const DiamondListCard = ({ diamond }: { diamond: Diamond }) => (
    <div
      className="relative border rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-row overflow-hidden"
      style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      onClick={() => onDiamondSelect(diamond)}
    >
      {/* Compare & Quick View Icons */}
      <div className="absolute top-2 left-2 flex flex-col gap-2 z-20">
        <button
          className="p-2 rounded-full shadow border bg-white/80 hover:bg-white transition-colors"
          style={{ borderColor: 'var(--border)' }}
          title="Compare"
          onClick={e => { e.stopPropagation(); /* TODO: handle compare */ }}
        >
          <CopyPlus className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        </button>
        <button
          className="p-2 rounded-full shadow border bg-white/80 hover:bg-white transition-colors"
          style={{ borderColor: 'var(--border)' }}
          title="Quick View"
          onClick={e => { e.stopPropagation(); /* TODO: handle quick view */ }}
        >
          <Eye className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        </button>
      </div>
      {/* Left: Image & Favorite */}
      <div className="relative w-36 min-w-36 h-36 flex items-center justify-center"
        style={{ background: 'var(--muted)' }}>
        {diamond.images && diamond.images.length > 0 ? (
          <img
            src={diamond.images[0]}
            alt={`${diamond.shape} Diamond`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <span className="text-5xl" style={{ color: 'var(--muted-foreground)' }}>💎</span>
        )}
        {/* Favorite Button (always visible, top right) */}
        <button
          onClick={e => { e.stopPropagation(); onAddToWishlist(diamond.id); }}
          className="absolute top-2 right-2 p-2 rounded-full shadow hover:bg-pink-100 transition-colors z-10 border"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          title="Add to Favourites"
        >
          <Heart className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        </button>
        {/* Availability Badge */}
        <span className={`absolute bottom-2 left-2 px-2 py-1 text-xs font-semibold rounded-full shadow`} style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--primary)' }}>
          {(diamond.availability || 'available').charAt(0).toUpperCase() + (diamond.availability || 'available').slice(1)}
        </span>
      </div>
      {/* Right: Details */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-lg truncate" style={{ color: 'var(--foreground)' }}>
            {diamond.caratWeight}ct {diamond.shape}
          </h3>
          <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
            {formatPrice(diamond.price)}
          </span>
        </div>
        {/* Reference Number */}
        <div className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
          Ref: <span className="font-mono">{diamond.reportNumber || 'N/A'}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-sm mb-2">
          <div className="truncate">Color: <span className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.color}</span></div>
          <div className="truncate">Clarity: <span className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.clarity}</span></div>
          <div className="truncate flex items-center gap-1">Shape: <span className="inline-block align-middle w-5 h-5 text-primary">{getShapeIcon(diamond.shape)}</span> <span className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.shape}</span></div>
          <div className="truncate">Carat: <span className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.caratWeight}</span></div>
        </div>
        {/* Supplier & Actions */}
        <div className="flex items-center justify-between pt-2 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center space-x-2">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {(diamond.supplier && diamond.supplier.name) ? diamond.supplier.name : 'Unknown Supplier'}
            </span>
            {diamond.supplier && diamond.supplier.verified && (
              <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={e => { e.stopPropagation(); onAddToCart(diamond.id); }}
              className="px-3 py-1 rounded-lg font-medium transition-colors text-xs"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4 inline mr-1" />Add to Cart
            </button>
            <button
              className="text-xs px-3 py-1 rounded-lg font-medium transition-colors"
              style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
              onClick={e => e.stopPropagation()}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const DiamondListItem = ({ diamond }: { diamond: Diamond }) => (
    <div 
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      onClick={() => onDiamondSelect(diamond)}
    >
      <div className="flex items-center space-x-4">
        {/* Diamond Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            {diamond.images && diamond.images.length > 0 ? (
              <img 
                src={diamond.images[0]} 
                alt={`${diamond.shape} Diamond`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                <span className="text-2xl">💎</span>
              </div>
            )}
          </div>
        </div>

        {/* Diamond Details */}
        <div className="flex-1 grid grid-cols-6 gap-4 items-center">
          <div>
            <div className="font-semibold" style={{ color: 'var(--foreground)' }}>
              {diamond.caratWeight}ct
            </div>
            <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {diamond.shape}
            </div>
          </div>

          <div className="text-center">
            <div className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.color}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Color</div>
          </div>

          <div className="text-center">
            <div className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.clarity}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Clarity</div>
          </div>

          <div className="text-center">
            <div className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.cut}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cut</div>
          </div>

          <div className="text-center">
            <div className="font-medium" style={{ color: 'var(--foreground)' }}>{diamond.certification}</div>
            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cert</div>
          </div>

          <div className="text-right">
            <div className="font-bold text-lg" style={{ color: 'var(--primary)' }}>
              {formatPrice(diamond.price)}
            </div>
            <div className={`text-xs ${getAvailabilityColor(diamond.availability || 'available')}`}>
              {(diamond.availability || 'available')}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddToWishlist(diamond.id)
            }}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{ backgroundColor: 'var(--muted)' }}
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart(diamond.id)
            }}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Results Header - Desktop/Tablet */}
      <div className="hidden sm:flex items-center justify-between p-4 border rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            {totalCount.toLocaleString()} Diamonds Found
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Sort, Filter, and View Toggle - Desktop (Mobile Style) */}
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              aria-label="Sort"
            >
              <ArrowUpDown className="w-4 h-4 text-gray-700" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
              onClick={() => {
                const evt = new CustomEvent('openDiamondFilters');
                window.dispatchEvent(evt);
              }}
              aria-label="Open filters"
            >
              <FilterIcon className="w-4 h-4 text-gray-700" />
            </button>
            <div className="flex items-center bg-white shadow border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header - Mobile */}
      {/* Results Header - Mobile (Modern, Minimal, Floating) */}
      <div className="sm:hidden flex items-center justify-between w-full pt-2">
        <div className="flex gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              aria-label="Sort"
            >
              <ArrowUpDown className="w-4 h-4 text-gray-700" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
              onClick={() => {
                const evt = new CustomEvent('openDiamondFilters');
                window.dispatchEvent(evt);
              }}
              aria-label="Open filters"
            >
              <FilterIcon className="w-4 h-4 text-gray-700" />
            </button>
        </div>
        <div className="flex items-center bg-white shadow border border-gray-200 rounded-lg gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Diamond Shape Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-muted-foreground/30">
        {shapeOptions.map(opt => {
          const isSelected = selectedShapes.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => {
                if (opt.value === 'All') {  
                  setSelectedShapes(['All']);
                } else {
                  setSelectedShapes(prev => {
                    let next;
                    if (prev.includes(opt.value)) {
                      next = prev.filter(s => s !== opt.value);
                    } else {
                      next = prev.filter(s => s !== 'All').concat(opt.value);
                    }
                    return next.length === 0 ? ['All'] : next;
                  });
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:bg-muted'}`}
              style={isSelected ? { background: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' } : { background: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              type="button"
            >
              <span className="text-lg">{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Results Grid/List */}
      {filteredDiamonds.length === 0 ? (
        <div className="text-center py-12 border rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-6xl mb-4">💎</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            No diamonds found
          </h3>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Try adjusting your filters to see more results
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDiamonds.map((diamond) => (
                <DiamondGridCard key={diamond.id} diamond={diamond} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDiamonds.map((diamond) => (
                <DiamondListCard key={diamond.id} diamond={diamond} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
