'use client'

import { useState } from 'react'
import { Eye, Heart, ShoppingCart, Download, Grid, List, ArrowUpDown, ChevronDown } from 'lucide-react'

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

  const DiamondCard = ({ diamond }: { diamond: Diamond }) => (
    <div 
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      onClick={() => onDiamondSelect(diamond)}
    >
      {/* Diamond Image */}
      <div className="relative mb-3">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {diamond.images && diamond.images.length > 0 ? (
            <img 
              src={diamond.images[0]} 
              alt={`${diamond.shape} Diamond`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
              <span className="text-4xl">💎</span>
            </div>
          )}
        </div>
        
        {/* Availability Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(diamond.availability)} bg-white shadow-sm`}>
          {diamond.availability.charAt(0).toUpperCase() + diamond.availability.slice(1)}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddToWishlist(diamond.id)
            }}
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart(diamond.id)
            }}
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Diamond Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
            {diamond.caratWeight}ct {diamond.shape}
          </h3>
          <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
            {formatPrice(diamond.price)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <div>Color: <span style={{ color: 'var(--foreground)' }}>{diamond.color}</span></div>
          <div>Clarity: <span style={{ color: 'var(--foreground)' }}>{diamond.clarity}</span></div>
          <div>Cut: <span style={{ color: 'var(--foreground)' }}>{diamond.cut}</span></div>
          <div>Cert: <span style={{ color: 'var(--foreground)' }}>{diamond.certification}</span></div>
        </div>

        {/* Supplier Info */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center space-x-2">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {diamond.supplier.name}
            </span>
            {diamond.supplier.verified && (
              <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                Verified
              </span>
            )}
          </div>
          <button className="text-xs px-2 py-1 rounded transition-colors" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            View Details
          </button>
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
            <div className={`text-xs ${getAvailabilityColor(diamond.availability)}`}>
              {diamond.availability}
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
      {/* Results Header */}
      <div className="flex items-center justify-between p-4 border rounded-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            {totalCount.toLocaleString()} Diamonds Found
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-sm">
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showSortDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 border rounded-lg shadow-lg z-10" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value as SortOption)
                      setShowSortDropdown(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-opacity-80 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    style={{ backgroundColor: sortBy === option.value ? 'var(--accent)' : 'transparent', color: 'var(--foreground)' }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-opacity-100' : 'bg-opacity-0'}`}
              style={{ backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent', color: viewMode === 'grid' ? 'var(--primary-foreground)' : 'var(--foreground)' }}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-opacity-100' : 'bg-opacity-0'}`}
              style={{ backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'transparent', color: viewMode === 'list' ? 'var(--primary-foreground)' : 'var(--foreground)' }}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Export Button */}
          <button className="flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors hover:bg-opacity-80" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </div>

      {/* Results Grid/List */}
      {diamonds.length === 0 ? (
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
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
          {diamonds.map((diamond) => (
            viewMode === 'grid' ? (
              <DiamondCard key={diamond.id} diamond={diamond} />
            ) : (
              <DiamondListItem key={diamond.id} diamond={diamond} />
            )
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 border rounded-lg transition-colors ${currentPage === page ? 'bg-opacity-100' : 'bg-opacity-0'}`}
                style={{ 
                  backgroundColor: currentPage === page ? 'var(--primary)' : 'var(--background)', 
                  borderColor: 'var(--border)', 
                  color: currentPage === page ? 'var(--primary-foreground)' : 'var(--foreground)' 
                }}
              >
                {page}
              </button>
            )
          })}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
