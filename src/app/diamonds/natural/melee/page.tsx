'use client'

import { useState, useEffect } from 'react'
import { Gem, Package, Users, Filter as FilterIcon } from 'lucide-react'
import DiamondFilters, { DiamondFilterValues } from '@/components/diamonds/DiamondFilters'
import DiamondResults, { Diamond } from '@/components/diamonds/DiamondResults'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'

// Sample data for natural melee diamonds
const sampleMeleeDiamonds: Diamond[] = [
  {
    id: 'melee-1',
    shape: 'Round',
    caratWeight: 0.05,
    color: 'G',
    clarity: 'VS2',
    cut: 'Very Good',
    price: 85,
    certification: 'GIA',
    reportNumber: 'GIA-MELEE-001',
    fluorescence: 'None',
    polish: 'Good',
    symmetry: 'Good',
    measurements: { length: 2.1, width: 2.1, depth: 1.3 },
    tablePercent: 58,
    depthPercent: 62,
    girdle: 'Medium',
    culet: 'None',
    location: 'Surat, India',
    supplier: {
      name: 'Melee Specialists Inc.',
      verified: true,
      rating: 4.6
    },
    images: ['/api/placeholder/200/200'],
    availability: 'available',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'melee-2',
    shape: 'Round',
    caratWeight: 0.10,
    color: 'H',
    clarity: 'SI1',
    cut: 'Good',
    price: 145,
    certification: 'GIA',
    reportNumber: 'GIA-MELEE-002',
    fluorescence: 'Faint',
    polish: 'Good',
    symmetry: 'Good',
    measurements: { length: 3.0, width: 3.0, depth: 1.8 },
    tablePercent: 59,
    depthPercent: 60,
    girdle: 'Medium',
    culet: 'None',
    location: 'Mumbai, India',
    supplier: {
      name: 'Small Stone Solutions',
      verified: true,
      rating: 4.5
    },
    images: ['/api/placeholder/200/200'],
    availability: 'available',
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: 'melee-3',
    shape: 'Princess',
    caratWeight: 0.08,
    color: 'F',
    clarity: 'VS1',
    cut: 'Very Good',
    price: 120,
    certification: 'IGI',
    reportNumber: 'IGI-MELEE-003',
    fluorescence: 'None',
    polish: 'Very Good',
    symmetry: 'Good',
    measurements: { length: 2.5, width: 2.5, depth: 1.8 },
    tablePercent: 65,
    depthPercent: 72,
    girdle: 'Medium',
    culet: 'None',
    location: 'Bangkok, Thailand',
    supplier: {
      name: 'Asian Melee Co.',
      verified: true,
      rating: 4.7
    },
    images: ['/api/placeholder/200/200'],
    availability: 'available',
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z'
  },
  {
    id: 'melee-4',
    shape: 'Round',
    caratWeight: 0.15,
    color: 'I',
    clarity: 'SI2',
    cut: 'Good',
    price: 195,
    certification: 'GIA',
    reportNumber: 'GIA-MELEE-004',
    fluorescence: 'None',
    polish: 'Good',
    symmetry: 'Fair',
    measurements: { length: 3.4, width: 3.4, depth: 2.1 },
    tablePercent: 57,
    depthPercent: 62,
    girdle: 'Medium to Slightly Thick',
    culet: 'None',
    location: 'Antwerp, Belgium',
    supplier: {
      name: 'European Melee House',
      verified: true,
      rating: 4.8
    },
    images: ['/api/placeholder/200/200'],
    availability: 'available',
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  }
]

export default function NaturalMeleeDiamondsPage() {
  const [filters, setFilters] = useState<DiamondFilterValues>({
    shape: [],
    caratWeight: { min: 0.001, max: 0.30 },
    color: [],
    clarity: [],
    cut: [],
    priceRange: { min: 0, max: 5000 },
    certification: [],
    fluorescence: [],
    polish: [],
    symmetry: [],
    location: [],
    measurements: {
      length: { min: 0, max: 5 },
      width: { min: 0, max: 5 },
      depth: { min: 0, max: 3 }
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
    pricePerCarat: { min: 0, max: 2000 },
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

  const [filteredDiamonds, setFilteredDiamonds] = useState<Diamond[]>(sampleMeleeDiamonds)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const pageSize = 20

  // Filter diamonds based on current filter values
  useEffect(() => {
    setLoading(true)
    
    const timer = setTimeout(() => {
      let filtered = [...sampleMeleeDiamonds]

      // Apply filters (same logic as single diamonds)
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
    console.log('Selected melee diamond:', diamond)
  }

  const handleAddToWishlist = (diamondId: string) => {
    console.log('Add melee to wishlist:', diamondId)
  }

  const handleAddToCart = (diamondId: string) => {
    console.log('Add melee to cart:', diamondId)
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
          className="h-64 bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, var(--chart-2), var(--chart-5))'
          }}
        >
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Package className="w-12 h-12 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Natural Melee Diamonds</h1>
            </div>
            <p className="text-xl opacity-90 max-w-2xl mx-auto px-4">
              Small diamonds, big impact. Perfect for pave settings, side stones, and accent pieces in fine jewelry.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-2)', color: 'var(--primary-foreground)' }}>
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      {filteredDiamonds.length.toLocaleString()}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Melee Diamonds
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-3)', color: 'var(--primary-foreground)' }}>
                    <Gem className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      0.001-0.30ct
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Size Range
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-4)', color: 'var(--primary-foreground)' }}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      50+
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Verified Suppliers
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
            About Melee Diamonds
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>What are Melee Diamonds?</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Melee diamonds are small diamonds typically weighing less than 0.30 carats. They're commonly used as accent stones in engagement rings, wedding bands, and other fine jewelry pieces to add sparkle and brilliance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Perfect for:</h3>
              <ul className="text-sm space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                <li>• Pave and micro-pave settings</li>
                <li>• Halo engagement rings</li>
                <li>• Wedding band accents</li>
                <li>• Tennis bracelets</li>
                <li>• Eternity bands</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <DiamondFilters
              filters={filters}
              onFiltersChange={setFilters}
              diamondType="natural-melee"
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
              diamondType="natural-melee"
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
                diamondType="natural-melee"
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
