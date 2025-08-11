'use client'

import { useState, useEffect } from 'react'
import { Gem, Leaf, Package, Zap, Filter as FilterIcon } from 'lucide-react'
import DiamondFilters, { DiamondFilterValues } from '@/components/diamonds/DiamondFilters'
import DiamondResults, { Diamond } from '@/components/diamonds/DiamondResults'
import Footer from '@/components/Footer'
import NavigationUser from '@/components/Navigation/NavigationUser'

// Sample data for lab-grown melee diamonds
const sampleLabGrownMeleeDiamonds: Diamond[] = [
  {
    id: 'lab-melee-1',
    shape: 'Round',
    caratWeight: 0.04,
    color: 'D',
    clarity: 'VVS2',
    cut: 'Excellent',
    price: 45,
    certification: 'IGI',
    reportNumber: 'IGI-LG-MELEE-001',
    fluorescence: 'None',
    polish: 'Very Good',
    symmetry: 'Very Good',
    measurements: { length: 2.0, width: 2.0, depth: 1.2 },
    tablePercent: 57,
    depthPercent: 60,
    girdle: 'Medium',
    culet: 'None',
    location: 'USA',
    supplier: {
      name: 'Lab Grown Melee Co.',
      verified: true,
      rating: 4.8
    },
    images: ['/api/placeholder/200/200'],
    availability: 'available',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'lab-melee-2',
    shape: 'Round',
    caratWeight: 0.08,
    color: 'E',
    clarity: 'VS1',
    cut: 'Excellent',
    price: 75,
    certification: 'GCAL',
    reportNumber: 'GCAL-LG-MELEE-002',
    fluorescence: 'None',
    polish: 'Excellent',
    symmetry: 'Excellent',
    measurements: { length: 2.6, width: 2.6, depth: 1.6 },
    tablePercent: 56,
    depthPercent: 61.5,
    girdle: 'Medium',
    culet: 'None',
    location: 'Singapore',
    supplier: {
      name: 'Sustainable Melee Solutions',
      verified: true,
      rating: 4.9
    },
    images: ['/api/placeholder/200/200'],
    availability: 'available',
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: 'lab-melee-3',
    shape: 'Princess',
    caratWeight: 0.06,
    color: 'F',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: 60,
    certification: 'IGI',
    reportNumber: 'IGI-LG-MELEE-003',
    fluorescence: 'None',
    polish: 'Excellent',
    symmetry: 'Very Good',
    measurements: { length: 2.2, width: 2.2, depth: 1.6 },
    tablePercent: 64,
    depthPercent: 72.7,
    girdle: 'Medium',
    culet: 'None',
    location: 'India',
    supplier: {
      name: 'Green Diamond Tech',
      verified: true,
      rating: 4.7
    },
    images: ['/api/placeholder/200/200'],
    availability: 'available',
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z'
  },
  {
    id: 'lab-melee-4',
    shape: 'Round',
    caratWeight: 0.12,
    color: 'G',
    clarity: 'VS2',
    cut: 'Very Good',
    price: 95,
    certification: 'IGI',
    reportNumber: 'IGI-LG-MELEE-004',
    fluorescence: 'None',
    polish: 'Very Good',
    symmetry: 'Good',
    measurements: { length: 3.1, width: 3.1, depth: 1.9 },
    tablePercent: 58,
    depthPercent: 61.3,
    girdle: 'Medium to Slightly Thick',
    culet: 'None',
    location: 'China',
    supplier: {
      name: 'Future Melee Diamonds',
      verified: true,
      rating: 4.6
    },
    images: ['/api/placeholder/200/200'],
    availability: 'available',
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  }
]

export default function LabGrownMeleeDiamondsPage() {
  const [filters, setFilters] = useState<DiamondFilterValues>({
    shape: [],
    caratWeight: { min: 0.001, max: 0.30 },
    color: [],
    clarity: [],
    cut: [],
    priceRange: { min: 0, max: 2000 },
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
    pricePerCarat: { min: 0, max: 1000 },
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

  const [filteredDiamonds, setFilteredDiamonds] = useState<Diamond[]>(sampleLabGrownMeleeDiamonds)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const pageSize = 20

  // Filter diamonds based on current filter values
  useEffect(() => {
    setLoading(true)
    
    const timer = setTimeout(() => {
      let filtered = [...sampleLabGrownMeleeDiamonds]

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
    console.log('Selected lab-grown melee diamond:', diamond)
  }

  const handleAddToWishlist = (diamondId: string) => {
    console.log('Add lab-grown melee to wishlist:', diamondId)
  }

  const handleAddToCart = (diamondId: string) => {
    console.log('Add lab-grown melee to cart:', diamondId)
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
          className="h-64 bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, var(--chart-2), var(--chart-4))'
          }}
        >
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                <Leaf className="w-10 h-10" />
                <Package className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold ml-4">Lab-Grown Melee Diamonds</h1>
            </div>
            <p className="text-xl opacity-90 max-w-2xl mx-auto px-4">
              Sustainable, eco-friendly melee diamonds perfect for pave settings, halos, and accent pieces.
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
                      Lab-Grown Melee
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-4)', color: 'var(--primary-foreground)' }}>
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      Zero
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Environmental Impact
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-5)', color: 'var(--primary-foreground)' }}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                      50%+
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
            Lab-Grown Melee Diamonds: The Future of Sustainable Jewelry
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center" style={{ color: 'var(--foreground)' }}>
                <Leaf className="w-5 h-5 mr-2" style={{ color: 'var(--chart-2)' }} />
                Environmentally Responsible
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Lab-grown melee diamonds are created using advanced technology in controlled environments, requiring significantly less water and energy than traditional mining while producing zero environmental waste.
              </p>
              
              <h3 className="font-semibold mb-2 flex items-center" style={{ color: 'var(--foreground)' }}>
                <Zap className="w-5 h-5 mr-2" style={{ color: 'var(--chart-4)' }} />
                Superior Quality Control
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                Laboratory conditions allow for precise control over the diamond formation process, resulting in consistently high-quality stones with fewer inclusions and better color grades.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Perfect Applications:</h3>
              <ul className="text-sm space-y-1 mb-4" style={{ color: 'var(--muted-foreground)' }}>
                <li>• Micro-pave engagement ring settings</li>
                <li>• Halo designs around center stones</li>
                <li>• Tennis bracelets and necklaces</li>
                <li>• Wedding band accents</li>
                <li>• Designer jewelry pieces</li>
                <li>• Watch bezels and luxury timepieces</li>
              </ul>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800">
                  💡 Pro Tip: Lab-grown melee diamonds offer 50-70% cost savings compared to natural melee, allowing designers to create more elaborate and spectacular pieces within budget.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <DiamondFilters
              filters={filters}
              onFiltersChange={setFilters}
              diamondType="lab-grown-melee"
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
              diamondType="lab-grown-melee"
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
                diamondType="lab-grown-melee"
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
