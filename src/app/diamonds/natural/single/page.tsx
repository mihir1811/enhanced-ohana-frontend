'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Gem, Crown, Award, TrendingUp, Filter as FilterIcon, ArrowLeft } from 'lucide-react'
import DiamondFilters, { DiamondFilterValues } from '@/components/diamonds/DiamondFilters'
import DiamondResults, { Diamond } from '@/components/diamonds/DiamondResults'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'


import { diamondService } from '@/services/diamondService'

export default function NaturalSingleDiamondsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Parse URL parameters for applied filters
  const getInitialFilters = (): DiamondFilterValues => {
    const urlShape = searchParams.get('shape')?.split(',') || []
    const urlColor = searchParams.get('color')?.split(',') || []
    const urlClarity = searchParams.get('clarity')?.split(',') || []
    const urlCut = searchParams.get('cut')?.split(',') || []
    const urlCertification = searchParams.get('certification')?.split(',') || []
    const urlFluorescence = searchParams.get('fluorescence')?.split(',') || []
    
    const caratMin = parseFloat(searchParams.get('caratMin') || '0.30')
    const caratMax = parseFloat(searchParams.get('caratMax') || '5.00')
    const priceMin = parseInt(searchParams.get('priceMin') || '1000')
    const priceMax = parseInt(searchParams.get('priceMax') || '100000')

    return {
      shape: urlShape,
      caratWeight: { min: caratMin, max: caratMax },
      color: urlColor,
      clarity: urlClarity,
      cut: urlCut,
      priceRange: { min: priceMin, max: priceMax },
      certification: urlCertification,
      fluorescence: urlFluorescence,
      polish: [],
      symmetry: [],
      location: [],
      measurements: {
        length: { min: 0, max: 15 },
        width: { min: 0, max: 15 },
        depth: { min: 0, max: 10 }
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
    }
  }


  const [filters, setFilters] = useState<DiamondFilterValues>(getInitialFilters())
  const [diamonds, setDiamonds] = useState<Diamond[]>([])
  const [filteredDiamonds, setFilteredDiamonds] = useState<Diamond[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const pageSize = 20

  // Check if any filters are applied from URL
  const hasAppliedFilters = () => {
    return searchParams.toString().length > 0
  }


  // Fetch diamonds from API when filters or page changes
  useEffect(() => {
    setLoading(true)
    diamondService.getDiamonds()
      .then((res) => {
        const data = res?.data?.data || []
        setDiamonds(data)
        setFilteredDiamonds(data)
        setTotalCount(res?.data?.meta?.total || data.length)
        setLoading(false)
      })
      .catch(() => {
        setDiamonds([])
        setFilteredDiamonds([])
        setTotalCount(0)
        setLoading(false)
      })
  }, [filters, currentPage])

  const handleDiamondSelect = (diamond: Diamond) => {
    console.log('Selected natural single diamond:', diamond)
  }

  const handleAddToWishlist = (diamondId: string) => {
    console.log('Add natural single to wishlist:', diamondId)
  }

  const handleAddToCart = (diamondId: string) => {
    console.log('Add natural single to cart:', diamondId)
  }

  const currentDiamonds = filteredDiamonds

  const goBackToSearch = () => {
    router.push('/diamonds')
  }

  const getAppliedFiltersCount = () => {
    let count = 0
    if (filters.shape.length > 0) count += filters.shape.length
    if (filters.color.length > 0) count += filters.color.length
    if (filters.clarity.length > 0) count += filters.clarity.length
    if (filters.cut.length > 0) count += filters.cut.length
    if (filters.certification.length > 0) count += filters.certification.length
    return count
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Navigation */}
      <NavigationUser />
      
      {/* Breadcrumb & Back Navigation */}
      <div className="border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goBackToSearch}
              className="flex items-center space-x-2 text-sm hover:underline"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Diamond Search</span>
            </button>
            <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <span>Diamonds</span>
              <span>/</span>
              <span>Natural</span>
              <span>/</span>
              <span className="font-medium" style={{ color: 'var(--foreground)' }}>Single Diamonds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          {/* <div>
            <h1 className="text-3xl font-bold flex items-center" style={{ color: 'var(--foreground)' }}>
              <Crown className="w-8 h-8 mr-3" style={{ color: 'var(--chart-1)' }} />
              Natural Single Diamonds
            </h1>
            <p className="text-lg mt-2" style={{ color: 'var(--muted-foreground)' }}>
              {hasAppliedFilters() ? (
                <>Showing {filteredDiamonds.length.toLocaleString()} results with applied filters</>
              ) : (
                <>Premium natural diamonds for engagement rings and luxury jewelry</>
              )}
            </p>
          </div> */}
          
          {/* {hasAppliedFilters() && (
            <div className="text-right">
              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {getAppliedFiltersCount()} filters applied
              </div>
              <button
                onClick={goBackToSearch}
                className="text-sm hover:underline mt-1"
                style={{ color: 'var(--primary)' }}
              >
                Modify Search
              </button>
            </div>
          )} */}
        </div>

        {/* Applied Filters Summary */}
        {/* {hasAppliedFilters() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Applied Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {filters.shape.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Shape: {filters.shape.join(', ')}
                </span>
              )}
              {filters.color.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Color: {filters.color.join(', ')}
                </span>
              )}
              {filters.clarity.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Clarity: {filters.clarity.join(', ')}
                </span>
              )}
              {filters.cut.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Cut: {filters.cut.join(', ')}
                </span>
              )}
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Carat: {filters.caratWeight.min}-{filters.caratWeight.max}ct
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Price: ${filters.priceRange.min.toLocaleString()}-${filters.priceRange.max.toLocaleString()}
              </span>
            </div>
          </div>
        )} */}

        {/* Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-1)', color: 'var(--primary-foreground)' }}>
                <Gem className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {filteredDiamonds.length.toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Available Diamonds
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-3)', color: 'var(--primary-foreground)' }}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  100%
                </div>
                <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Certified Authentic
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--chart-5)', color: 'var(--primary-foreground)' }}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  Investment
                </div>
                <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Grade Quality
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <DiamondFilters
              filters={filters}
              onFiltersChange={setFilters}
              diamondType="natural-single"
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
              {getAppliedFiltersCount() > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {getAppliedFiltersCount()}
                </span>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <DiamondResults
              diamonds={currentDiamonds}
              loading={loading}
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onDiamondSelect={handleDiamondSelect}
              onAddToWishlist={handleAddToWishlist}
              onAddToCart={handleAddToCart}
              diamondType="natural-single"
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
                diamondType="natural-single"
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
