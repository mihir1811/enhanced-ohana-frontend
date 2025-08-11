'use client'

import { useState, useEffect } from 'react'
import { Gem, Leaf, Zap, Filter as FilterIcon } from 'lucide-react'
import DiamondFilters, { DiamondFilterValues } from '@/components/diamonds/DiamondFilters'
import DiamondResults, { Diamond } from '@/components/diamonds/DiamondResults'
import Footer from '@/components/Footer'
import NavigationUser from '@/components/Navigation/NavigationUser'

// Sample data for lab-grown single diamonds
const sampleLabGrownDiamonds: Diamond[] = [
  {
    id: 'lab-1',
    shape: 'Round',
    caratWeight: 1.75,
    color: 'D',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: 7850,
    certification: 'IGI',
    reportNumber: 'IGI-LG-12345678',
    fluorescence: 'None',
    polish: 'Excellent',
    symmetry: 'Excellent',
    measurements: { length: 7.85, width: 7.82, depth: 4.75 },
    tablePercent: 56,
    depthPercent: 60.5,
    girdle: 'Medium',
    culet: 'None',
    location: 'Singapore',
    supplier: {
      name: 'Lab Grown Innovations',
      verified: true,
      rating: 4.9
    },
    images: ['/api/placeholder/300/300'],
    availability: 'available',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'lab-2',
    shape: 'Princess',
    caratWeight: 2.25,
    color: 'E',
    clarity: 'VS1',
    cut: 'Excellent',
    price: 9200,
    certification: 'GCAL',
    reportNumber: 'GCAL-LG-87654321',
    fluorescence: 'None',
    polish: 'Excellent',
    symmetry: 'Excellent',
    measurements: { length: 7.45, width: 7.42, depth: 5.25 },
    tablePercent: 62,
    depthPercent: 70.5,
    girdle: 'Medium to Slightly Thick',
    culet: 'None',
    location: 'USA',
    supplier: {
      name: 'American Lab Diamonds',
      verified: true,
      rating: 4.8
    },
    images: ['/api/placeholder/300/300'],
    availability: 'available',
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: 'lab-3',
    shape: 'Oval',
    caratWeight: 1.50,
    color: 'F',
    clarity: 'VS2',
    cut: 'Excellent',
    price: 6750,
    certification: 'IGI',
    reportNumber: 'IGI-LG-45678901',
    fluorescence: 'None',
    polish: 'Excellent',
    symmetry: 'Very Good',
    measurements: { length: 9.12, width: 6.85, depth: 4.15 },
    tablePercent: 58,
    depthPercent: 60.5,
    girdle: 'Medium',
    culet: 'None',
    location: 'Israel',
    supplier: {
      name: 'Future Diamonds Ltd.',
      verified: true,
      rating: 4.7
    },
    images: ['/api/placeholder/300/300'],
    availability: 'available',
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z'
  },
  {
    id: 'lab-4',
    shape: 'Emerald',
    caratWeight: 2.00,
    color: 'G',
    clarity: 'VVS2',
    cut: 'Very Good',
    price: 8500,
    certification: 'IGI',
    reportNumber: 'IGI-LG-23456789',
    fluorescence: 'None',
    polish: 'Very Good',
    symmetry: 'Excellent',
    measurements: { length: 9.85, width: 7.12, depth: 4.45 },
    tablePercent: 64,
    depthPercent: 62.5,
    girdle: 'Medium',
    culet: 'None',
    location: 'India',
    supplier: {
      name: 'Sustainable Gems Co.',
      verified: true,
      rating: 4.6
    },
    images: ['/api/placeholder/300/300'],
    availability: 'reserved',
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  }
]

export default function LabGrownSingleDiamondsPage() {
  const [filters, setFilters] = useState<DiamondFilterValues>({
    shape: [],
    caratWeight: { min: 0.30, max: 10 },
    color: [],
    clarity: [],
    cut: [],
    priceRange: { min: 0, max: 50000 },
    certification: [],
    fluorescence: [],
    polish: [],
    symmetry: [],
    location: [],
    measurements: {
      length: { min: 0, max: 20 },
      width: { min: 0, max: 20 },
      depth: { min: 0, max: 15 }
    },
    tablePercent: { min: 50, max: 70 },
    depthPercent: { min: 55, max: 75 },
    // New filter defaults
    girdle: [],
    culet: [],
    origin: [],
    treatment: [],
    milkyness: [],
    matching: null,
    pricePerCarat: { min: 0, max: 10000 },
    availability: [],
    delivery: [],
    brilliance: [],
    fire: [],
    scintillation: [],
    grownMethod: [],
    searchTerm: '',
    reportNumber: '',
    stoneId: ''
  })

  const [filteredDiamonds, setFilteredDiamonds] = useState<Diamond[]>(sampleLabGrownDiamonds)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const pageSize = 12

  // Filter diamonds based on current filter values
  useEffect(() => {
    setLoading(true)
    
    const timer = setTimeout(() => {
      let filtered = [...sampleLabGrownDiamonds]

      // Apply filters
      if (filters.shape.length > 0) {
        filtered = filtered.filter(d => filters.shape.includes(d.shape))
      }
      
      if (filters.color.length > 0) {
        filtered = filtered.filter(d => filters.color.includes(d.color))
      }
      
      if (filters.clarity.length > 0) {
        filtered = filtered.filter(d => filters.clarity.includes(d.clarity))
      }
      
      if (filters.cut.length > 0) {
        filtered = filtered.filter(d => filters.cut.includes(d.cut))
      }
      
      if (filters.certification.length > 0) {
        filtered = filtered.filter(d => filters.certification.includes(d.certification))
      }

      filtered = filtered.filter(d => 
        d.caratWeight >= filters.caratWeight.min && 
        d.caratWeight <= filters.caratWeight.max
      )
      
      filtered = filtered.filter(d => 
        d.price >= filters.priceRange.min && 
        d.price <= filters.priceRange.max
      )

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        filtered = filtered.filter(d => 
          d.shape.toLowerCase().includes(searchLower) ||
          d.color.toLowerCase().includes(searchLower) ||
          d.clarity.toLowerCase().includes(searchLower) ||
          d.supplier.name.toLowerCase().includes(searchLower)
        )
      }

      if (filters.reportNumber) {
        filtered = filtered.filter(d => 
          d.reportNumber.toLowerCase().includes(filters.reportNumber.toLowerCase())
        )
      }

      setFilteredDiamonds(filtered)
      setCurrentPage(1)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [filters])

  const handleDiamondSelect = (diamond: Diamond) => {
    console.log('Selected lab-grown diamond:', diamond)
  }

  const handleAddToWishlist = (diamondId: string) => {
    console.log('Add lab-grown to wishlist:', diamondId)
  }

  const handleAddToCart = (diamondId: string) => {
    console.log('Add lab-grown to cart:', diamondId)
  }

  const currentDiamonds = filteredDiamonds.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <NavigationUser />
      
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-64 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, var(--chart-4), var(--chart-5))'
          }}
        >
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="w-12 h-12 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Lab-Grown Single Diamonds</h1>
            </div>
            <p className="text-xl opacity-90 max-w-2xl mx-auto px-4">
              Sustainable, ethically-created diamonds with the same physical, chemical, and optical properties as natural diamonds.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-4)', color: 'var(--primary-foreground)' }}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      {filteredDiamonds.length.toLocaleString()}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Lab-Grown Available
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-5)', color: 'var(--primary-foreground)' }}>
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      100%
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Conflict-Free
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-1)', color: 'var(--primary-foreground)' }}>
                    <Gem className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      40-60%
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Cost Savings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        <div className="bg-white rounded-lg p-6 border mb-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Why Choose Lab-Grown Diamonds?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 rounded-full inline-block mb-3" style={{ backgroundColor: 'var(--chart-4)', color: 'var(--primary-foreground)' }}>
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Environmentally Friendly</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Created in controlled laboratory environments with minimal environmental impact compared to traditional mining.
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full inline-block mb-3" style={{ backgroundColor: 'var(--chart-5)', color: 'var(--primary-foreground)' }}>
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Same Quality</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Identical physical, chemical, and optical properties to natural diamonds. Same hardness, brilliance, and fire.
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full inline-block mb-3" style={{ backgroundColor: 'var(--chart-1)', color: 'var(--primary-foreground)' }}>
                <Gem className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Better Value</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Typically 40-60% less expensive than natural diamonds of comparable quality, allowing for larger or higher-grade stones.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <DiamondFilters
              filters={filters}
              onFiltersChange={setFilters}
              diamondType="lab-grown-single"
              className="sticky top-4"
            />
          </div>

          {/* Mobile Filters Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg w-full justify-center"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <FilterIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <DiamondResults
              diamonds={currentDiamonds}
              loading={loading}
              totalCount={filteredDiamonds.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onDiamondSelect={handleDiamondSelect}
              onAddToWishlist={handleAddToWishlist}
              onAddToCart={handleAddToCart}
              diamondType="lab-grown-single"
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-80 max-w-full">
            <div className="h-full overflow-y-auto">
              <DiamondFilters
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters)
                  setShowMobileFilters(false)
                }}
                diamondType="lab-grown-single"
                className="h-full rounded-none"
              />
            </div>
          </div>
          <div 
            className="absolute inset-0"
            onClick={() => setShowMobileFilters(false)}
          />
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
