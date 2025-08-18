'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Gem, Leaf, Sparkles, Filter } from 'lucide-react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'

// Basic search form interface
interface DiamondSearchForm {
  diamondType: 'natural' | 'lab-grown'
  category: 'single' | 'melee'
  shape: string[]
  caratWeight: { min: number; max: number }
  color: string[]
  clarity: string[]
  cut: string[]
  priceRange: { min: number; max: number }
  certification: string[]
  fluorescence: string[]
  grownMethod: string[] // Added for lab-grown diamonds

  // Advanced filters (like RapNet/VDB)
  polish: string[]
  symmetry: string[]
  tablePercent: { min: number; max: number }
  depthPercent: { min: number; max: number }
  girdle: string[]
  culet: string[]
  location: string[]
  pricePerCarat: { min: number; max: number }
  measurements: {
    length: { min: number; max: number }
    width: { min: number; max: number }
    depth: { min: number; max: number }
  }
}

// Shape options - Your actual industry shapes
const SHAPES = [
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
]

// Color options
const COLORS = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']

// Clarity options
const CLARITIES = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3']

// Cut options
const CUTS = ['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor']

// Certification options
const CERTIFICATIONS = ['GIA', 'IGI', 'GCAL', 'Gübelin', 'SSEF', 'AGS', 'EGL']

// Fluorescence options
const FLUORESCENCE_LEVELS = ['None', 'Faint', 'Medium', 'Strong', 'Very Strong']

// Growth methods for lab-grown diamonds
const GROWTH_METHODS = ['CVD', 'HPHT']

// Advanced filter options (RapNet/VDB style)
const POLISH_SYMMETRY_OPTIONS = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
const GIRDLE_OPTIONS = ['Thin', 'Medium', 'Thick', 'Very Thin', 'Very Thick', 'Extremely Thin', 'Extremely Thick']
const CULET_OPTIONS = ['None', 'Very Small', 'Small', 'Medium', 'Large', 'Very Large']
const LOCATIONS = ['New York', 'Antwerp', 'Mumbai', 'Tel Aviv', 'Hong Kong', 'Bangkok', 'Dubai', 'Surat', 'Los Angeles', 'Las Vegas']

export default function DiamondsSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Helper functions defined before they're used
  // Update carat ranges based on category
  const getCaratRange = (category: 'single' | 'melee') => {
    if (category === 'melee') {
      return { min: 0.001, max: 0.30 }
    }
    return { min: 0.30, max: 5.00 }
  }

  // Update price ranges based on type and category
  const getPriceRange = (diamondType: 'natural' | 'lab-grown', category: 'single' | 'melee') => {
    if (category === 'melee') {
      return diamondType === 'natural'
        ? { min: 10, max: 500 }
        : { min: 5, max: 200 }
    }
    return diamondType === 'natural'
      ? { min: 1000, max: 100000 }
      : { min: 500, max: 50000 }
  }

  // Read URL parameters
  const urlDiamondType = searchParams.get('diamondType') as 'natural' | 'lab-grown' || 'natural'
  const urlCategory = searchParams.get('category') as 'single' | 'melee' || 'single'

  const [searchForm, setSearchForm] = useState<DiamondSearchForm>({
    diamondType: urlDiamondType,
    category: urlCategory,
    shape: [],
    caratWeight: getCaratRange(urlCategory),
    color: [],
    clarity: [],
    cut: [],
    priceRange: getPriceRange(urlDiamondType, urlCategory),
    certification: [],
    fluorescence: [],
    grownMethod: [],

    // Advanced filters
    polish: [],
    symmetry: [],
    tablePercent: { min: 50, max: 70 },
    depthPercent: { min: 55, max: 75 },
    girdle: [],
    culet: [],
    location: [],
    pricePerCarat: { min: 500, max: 50000 },
    measurements: {
      length: { min: 0, max: 20 },
      width: { min: 0, max: 20 },
      depth: { min: 0, max: 15 }
    }
  })

  // Add effect to update state when URL parameters change
  useEffect(() => {
    const newDiamondType = searchParams.get('diamondType') as 'natural' | 'lab-grown' || 'natural'
    const newCategory = searchParams.get('category') as 'single' | 'melee' || 'single'

    // Only update if values have changed
    if (newDiamondType !== searchForm.diamondType || newCategory !== searchForm.category) {
      setSearchForm(prev => ({
        ...prev,
        diamondType: newDiamondType,
        category: newCategory,
        caratWeight: getCaratRange(newCategory),
        priceRange: getPriceRange(newDiamondType, newCategory)
      }))
    }
  }, [searchParams, searchForm.diamondType, searchForm.category])

  const handleDiamondTypeChange = (type: 'natural' | 'lab-grown') => {
    const newCaratRange = getCaratRange(searchForm.category)
    const newPriceRange = getPriceRange(type, searchForm.category)

    setSearchForm(prev => ({
      ...prev,
      diamondType: type,
      caratWeight: newCaratRange,
      priceRange: newPriceRange
    }))
  }

  const handleCategoryChange = (category: 'single' | 'melee') => {
    const newCaratRange = getCaratRange(category)
    const newPriceRange = getPriceRange(searchForm.diamondType, category)

    setSearchForm(prev => ({
      ...prev,
      category,
      caratWeight: newCaratRange,
      priceRange: newPriceRange
    }))
  }

  const handleMultiSelect = (field: keyof Pick<DiamondSearchForm, 'shape' | 'color' | 'clarity' | 'cut' | 'certification' | 'fluorescence' | 'grownMethod' | 'polish' | 'symmetry' | 'girdle' | 'culet' | 'location'>, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleRangeChange = (field: 'tablePercent' | 'depthPercent' | 'pricePerCarat', type: 'min' | 'max', value: number) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value
      }
    }))
  }

  const handleMeasurementChange = (dimension: 'length' | 'width' | 'depth', type: 'min' | 'max', value: number) => {
    setSearchForm(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [dimension]: {
          ...prev.measurements[dimension],
          [type]: value
        }
      }
    }))
  }

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams()

    // Add basic filter parameters
    if (searchForm.shape.length > 0) params.set('shape', searchForm.shape.join(','))
    if (searchForm.color.length > 0) params.set('color', searchForm.color.join(','))
    if (searchForm.clarity.length > 0) params.set('clarity', searchForm.clarity.join(','))
    if (searchForm.cut.length > 0) params.set('cut', searchForm.cut.join(','))
    if (searchForm.certification.length > 0) params.set('certification', searchForm.certification.join(','))
    if (searchForm.fluorescence.length > 0) params.set('fluorescence', searchForm.fluorescence.join(','))
    if (searchForm.grownMethod.length > 0) params.set('grownMethod', searchForm.grownMethod.join(','))

    // Add advanced filter parameters
    if (searchForm.polish.length > 0) params.set('polish', searchForm.polish.join(','))
    if (searchForm.symmetry.length > 0) params.set('symmetry', searchForm.symmetry.join(','))
    if (searchForm.girdle.length > 0) params.set('girdle', searchForm.girdle.join(','))
    if (searchForm.culet.length > 0) params.set('culet', searchForm.culet.join(','))
    if (searchForm.location.length > 0) params.set('location', searchForm.location.join(','))

    // Add range parameters
    params.set('caratMin', searchForm.caratWeight.min.toString())
    params.set('caratMax', searchForm.caratWeight.max.toString())
    params.set('priceMin', searchForm.priceRange.min.toString())
    params.set('priceMax', searchForm.priceRange.max.toString())
    params.set('tableMin', searchForm.tablePercent.min.toString())
    params.set('tableMax', searchForm.tablePercent.max.toString())
    params.set('depthMin', searchForm.depthPercent.min.toString())
    params.set('depthMax', searchForm.depthPercent.max.toString())
    params.set('pricePerCaratMin', searchForm.pricePerCarat.min.toString())
    params.set('pricePerCaratMax', searchForm.pricePerCarat.max.toString())

    // Add measurement parameters
    params.set('lengthMin', searchForm.measurements.length.min.toString())
    params.set('lengthMax', searchForm.measurements.length.max.toString())
    params.set('widthMin', searchForm.measurements.width.min.toString())
    params.set('widthMax', searchForm.measurements.width.max.toString())
    params.set('depthSizeMin', searchForm.measurements.depth.min.toString())
    params.set('depthSizeMax', searchForm.measurements.depth.max.toString())

    // Navigate to results page
    const resultsUrl = `/diamonds/${searchForm.diamondType}/${searchForm.category}?${params.toString()}`
    router.push(resultsUrl)
  }

  const resetFilters = () => {
    const newCaratRange = getCaratRange(searchForm.category)
    const newPriceRange = getPriceRange(searchForm.diamondType, searchForm.category)

    setSearchForm({
      ...searchForm,
      shape: [],
      color: [],
      clarity: [],
      cut: [],
      certification: [],
      fluorescence: [],
      grownMethod: [],
      polish: [],
      symmetry: [],
      girdle: [],
      culet: [],
      location: [],
      caratWeight: newCaratRange,
      priceRange: newPriceRange,
      tablePercent: { min: 50, max: 70 },
      depthPercent: { min: 55, max: 75 },
      pricePerCarat: { min: 500, max: 50000 },
      measurements: {
        length: { min: 0, max: 20 },
        width: { min: 0, max: 20 },
        depth: { min: 0, max: 15 }
      }
    })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Navigation */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-lg">
        <NavigationUser />
      </div>

      {/* Hero Section with Glassmorphism */}
      <div className="relative">
        <div className="h-96 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <Gem className="w-16 h-16 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">Find Your Perfect Diamond</h1>
            </div>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Search from thousands of certified diamonds with advanced filtering tools
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-4 shadow-lg border border-white/30">
                <div className="text-3xl font-bold">10,000+</div>
                <div className="text-sm opacity-80">Certified Diamonds</div>
              </div>
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-4 shadow-lg border border-white/30">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm opacity-80">Trusted Suppliers</div>
              </div>
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-4 shadow-lg border border-white/30">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-80">Expert Support</div>
              </div>
              <div className="backdrop-blur-xl bg-white/20 rounded-xl p-4 shadow-lg border border-white/30">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-80">Certified Authentic</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-sm border p-8 backdrop-blur-xl relative" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center mb-8">
            <Search className="w-8 h-8 mr-3" style={{ color: 'var(--primary)' }} />
            <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Diamond Search</h2>
          </div>

          {/* Diamond Type & Category Selection */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Diamond Type */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Diamond Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDiamondTypeChange('natural')}
                  className={`p-4 rounded-lg border-2 transition-all ${searchForm.diamondType === 'natural' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'} ${searchForm.diamondType === 'natural' ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{
                    backgroundColor: searchForm.diamondType === 'natural' ? 'var(--primary)/10' : 'var(--card)',
                    borderColor: searchForm.diamondType === 'natural' ? 'var(--primary)' : 'var(--border)',
                    opacity: searchForm.diamondType === 'natural' ? 1 : 0.8
                  }}
                  disabled={searchForm.diamondType === 'natural'}
                >
                  <Gem className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--primary)' }} />
                  <div className="font-medium" style={{ color: 'var(--foreground)' }}>Natural</div>
                  <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Mined diamonds</div>
                </button>
                <button
                  onClick={() => handleDiamondTypeChange('lab-grown')}
                  className={`p-4 rounded-lg border-2 transition-all ${searchForm.diamondType === 'lab-grown' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'} ${searchForm.diamondType === 'lab-grown' ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{
                    backgroundColor: searchForm.diamondType === 'lab-grown' ? 'var(--chart-2)/10' : 'var(--card)',
                    borderColor: searchForm.diamondType === 'lab-grown' ? 'var(--chart-2)' : 'var(--border)',
                    opacity: searchForm.diamondType === 'lab-grown' ? 1 : 0.8
                  }}
                  disabled={searchForm.diamondType === 'lab-grown'}
                >
                  <Leaf className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--chart-2)' }} />
                  <div className="font-medium" style={{ color: 'var(--foreground)' }}>Lab-Grown</div>
                  <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Eco-friendly</div>
                </button>
              </div>
            </div>


            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Diamond Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleCategoryChange('single')}
                  className={`p-4 rounded-lg border-2 transition-all ${searchForm.category === 'single' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'} ${searchForm.category === 'single' ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{
                    backgroundColor: searchForm.category === 'single' ? 'var(--chart-3)/10' : 'var(--card)',
                    borderColor: searchForm.category === 'single' ? 'var(--chart-3)' : 'var(--border)',
                    opacity: searchForm.category === 'single' ? 1 : 0.8
                  }}
                  disabled={searchForm.category === 'single'}
                >
                  <Sparkles className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--chart-3)' }} />
                  <div className="font-medium" style={{ color: 'var(--foreground)' }}>Single Diamonds</div>
                  <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>0.30ct and above</div>
                </button>
                <button
                  onClick={() => handleCategoryChange('melee')}
                  className={`p-4 rounded-lg border-2 transition-all ${searchForm.category === 'melee' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'} ${searchForm.category === 'melee' ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{
                    backgroundColor: searchForm.category === 'melee' ? 'var(--chart-4)/10' : 'var(--card)',
                    borderColor: searchForm.category === 'melee' ? 'var(--chart-4)' : 'var(--border)',
                    opacity: searchForm.category === 'melee' ? 1 : 0.8
                  }}
                  disabled={searchForm.category === 'melee'}
                >
                  <div className="w-6 h-6 mx-auto mb-2 grid grid-cols-2 gap-0.5">
                    <div className="w-2 h-2 bg-current rounded-full" style={{ color: 'var(--chart-4)' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full" style={{ color: 'var(--chart-4)' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full" style={{ color: 'var(--chart-4)' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full" style={{ color: 'var(--chart-4)' }}></div>
                  </div>
                  <div className="font-medium" style={{ color: 'var(--foreground)' }}>Melee Diamonds</div>
                  <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Under 0.30ct</div>
                </button>
              </div>
            </div>
          </div>


          {/* Growth Method - Only for Lab-Grown */}
          {searchForm.diamondType === 'lab-grown' && (
            <div className='mb-4'>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Growth Method (CVD / HPHT)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {GROWTH_METHODS.map(method => (
                  <button
                    key={method}
                    onClick={() => handleMultiSelect('grownMethod', method)}
                    className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${searchForm.grownMethod.includes(method)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    style={{
                      backgroundColor: searchForm.grownMethod.includes(method) ? 'var(--chart-2)/10' : 'var(--card)',
                      borderColor: searchForm.grownMethod.includes(method) ? 'var(--chart-2)' : 'var(--border)',
                      color: searchForm.grownMethod.includes(method) ? 'var(--chart-2)' : 'var(--foreground)'
                    }}
                  >
                    <div className="font-bold text-lg mb-1">{method}</div>
                    <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {method === 'CVD' ? 'Chemical Vapor Deposition' : 'High Pressure High Temperature'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Basic Filters */}
          <div className="space-y-6">
            {/* Shape */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Shape
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {SHAPES.map(shape => (
                  <button
                    key={shape}
                    onClick={() => handleMultiSelect('shape', shape)}
                    className={`p-3 rounded-lg border text-sm transition-all ${searchForm.shape.includes(shape)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    style={{
                      backgroundColor: searchForm.shape.includes(shape) ? 'var(--primary)/10' : 'var(--card)',
                      borderColor: searchForm.shape.includes(shape) ? 'var(--primary)' : 'var(--border)',
                      color: searchForm.shape.includes(shape) ? 'var(--primary)' : 'var(--foreground)'
                    }}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Carat Weight */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Carat Weight ({searchForm.caratWeight.min} - {searchForm.caratWeight.max} ct)
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Minimum</label>
                  <input
                    type="number"
                    step="0.01"
                    value={searchForm.caratWeight.min}
                    onChange={(e) => setSearchForm(prev => ({
                      ...prev,
                      caratWeight: { ...prev.caratWeight, min: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full p-3 border rounded-lg"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Maximum</label>
                  <input
                    type="number"
                    step="0.01"
                    value={searchForm.caratWeight.max}
                    onChange={(e) => setSearchForm(prev => ({
                      ...prev,
                      caratWeight: { ...prev.caratWeight, max: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full p-3 border rounded-lg"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Color
              </label>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => handleMultiSelect('color', color)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${searchForm.color.includes(color)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    style={{
                      backgroundColor: searchForm.color.includes(color) ? 'var(--primary)/10' : 'var(--card)',
                      borderColor: searchForm.color.includes(color) ? 'var(--primary)' : 'var(--border)',
                      color: searchForm.color.includes(color) ? 'var(--primary)' : 'var(--foreground)'
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Clarity */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Clarity
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {CLARITIES.map(clarity => (
                  <button
                    key={clarity}
                    onClick={() => handleMultiSelect('clarity', clarity)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${searchForm.clarity.includes(clarity)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    style={{
                      backgroundColor: searchForm.clarity.includes(clarity) ? 'var(--primary)/10' : 'var(--card)',
                      borderColor: searchForm.clarity.includes(clarity) ? 'var(--primary)' : 'var(--border)',
                      color: searchForm.clarity.includes(clarity) ? 'var(--primary)' : 'var(--foreground)'
                    }}
                  >
                    {clarity}
                  </button>
                ))}
              </div>
            </div>

            {/* Fluorescence */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Fluorescence
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {FLUORESCENCE_LEVELS.map(fluorescence => (
                  <button
                    key={fluorescence}
                    onClick={() => handleMultiSelect('fluorescence', fluorescence)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${searchForm.fluorescence.includes(fluorescence)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    style={{
                      backgroundColor: searchForm.fluorescence.includes(fluorescence) ? 'var(--chart-3)/10' : 'var(--card)',
                      borderColor: searchForm.fluorescence.includes(fluorescence) ? 'var(--chart-3)' : 'var(--border)',
                      color: searchForm.fluorescence.includes(fluorescence) ? 'var(--chart-3)' : 'var(--foreground)'
                    }}
                  >
                    {fluorescence}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Price Range (${searchForm.priceRange.min.toLocaleString()} - ${searchForm.priceRange.max.toLocaleString()})
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Minimum ($)</label>
                  <input
                    type="number"
                    value={searchForm.priceRange.min}
                    onChange={(e) => setSearchForm(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, min: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full p-3 border rounded-lg"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Maximum ($)</label>
                  <input
                    type="number"
                    value={searchForm.priceRange.max}
                    onChange={(e) => setSearchForm(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full p-3 border rounded-lg"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="mt-2" style={{ borderColor: 'var(--border)' }}>
            <div className='flex justify-center relative'>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center justify-center w-[200px] p-2 rounded-full border transition-all duration-200 hover:bg-gray-50 absolute top-[11px]"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <span className="font-medium mr-2">Advanced Filters</span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Advanced Filters Content */}
            {showAdvancedFilters && (
              <div className="mt-[30px] space-y-8 pt-8 rounded-xl" style={{
                // backgroundColor: 'var(--card)',
                // borderColor: 'var(--border)',
                // backgroundImage: 'linear-gradient(135deg, var(--muted)/5, var(--muted)/10)'
              }}>

                {/* Section Header */}
                {/* <div className="text-center">
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                    Professional Diamond Specifications
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Industry-standard filters used by professional diamond traders worldwide
                  </p>
                </div> */}

                {/* Cut Quality Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    {/* <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--chart-1)' }}></div> */}
                    <h4 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Cut Quality Assessment</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Polish</label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--chart-1)/10', color: 'var(--chart-1)' }}>
                          Surface Quality
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {POLISH_SYMMETRY_OPTIONS.map(polish => (
                          <button
                            key={polish}
                            onClick={() => handleMultiSelect('polish', polish)}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:shadow-md ${searchForm.polish.includes(polish)
                                ? 'transform scale-105'
                                : 'hover:scale-102'
                              }`}
                            style={{
                              backgroundColor: searchForm.polish.includes(polish) ? 'var(--chart-1)/10' : 'var(--card)',
                              borderColor: searchForm.polish.includes(polish) ? 'var(--chart-1)' : 'var(--border)',
                              color: searchForm.polish.includes(polish) ? 'var(--chart-1)' : 'var(--foreground)',
                              boxShadow: searchForm.polish.includes(polish) ? '0 4px 12px var(--chart-1)/20' : 'none'
                            }}
                          >
                            {polish}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Symmetry</label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--chart-2)/10', color: 'var(--chart-2)' }}>
                          Facet Alignment
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {POLISH_SYMMETRY_OPTIONS.map(symmetry => (
                          <button
                            key={symmetry}
                            onClick={() => handleMultiSelect('symmetry', symmetry)}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:shadow-md ${searchForm.symmetry.includes(symmetry)
                                ? 'transform scale-105'
                                : 'hover:scale-102'
                              }`}
                            style={{
                              backgroundColor: searchForm.symmetry.includes(symmetry) ? 'var(--chart-2)/10' : 'var(--card)',
                              borderColor: searchForm.symmetry.includes(symmetry) ? 'var(--chart-2)' : 'var(--border)',
                              color: searchForm.symmetry.includes(symmetry) ? 'var(--chart-2)' : 'var(--foreground)',
                              boxShadow: searchForm.symmetry.includes(symmetry) ? '0 4px 12px var(--chart-2)/20' : 'none'
                            }}
                          >
                            {symmetry}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proportions Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    {/* <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--chart-3)' }}></div> */}
                    <h4 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Proportions & Measurements</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Table %</label>
                          <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                            backgroundColor: 'var(--chart-3)/10',
                            color: 'var(--chart-3)'
                          }}>
                            {searchForm.tablePercent.min}% - {searchForm.tablePercent.max}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Minimum</label>
                            <input
                              type="number"
                              min="50"
                              max="80"
                              value={searchForm.tablePercent.min}
                              onChange={(e) => handleRangeChange('tablePercent', 'min', parseFloat(e.target.value) || 50)}
                              className="w-full p-3 border-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-0"
                              style={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)',
                                '--tw-ring-color': 'var(--chart-3)'
                              } as React.CSSProperties}
                            />
                          </div>
                          <div>
                            <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Maximum</label>
                            <input
                              type="number"
                              min="50"
                              max="80"
                              value={searchForm.tablePercent.max}
                              onChange={(e) => handleRangeChange('tablePercent', 'max', parseFloat(e.target.value) || 70)}
                              className="w-full p-3 border-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-0"
                              style={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)',
                                '--tw-ring-color': 'var(--chart-3)'
                              } as React.CSSProperties}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Depth %</label>
                          <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                            backgroundColor: 'var(--chart-4)/10',
                            color: 'var(--chart-4)'
                          }}>
                            {searchForm.depthPercent.min}% - {searchForm.depthPercent.max}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Minimum</label>
                            <input
                              type="number"
                              min="45"
                              max="85"
                              value={searchForm.depthPercent.min}
                              onChange={(e) => handleRangeChange('depthPercent', 'min', parseFloat(e.target.value) || 55)}
                              className="w-full p-3 border-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-0"
                              style={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)',
                                '--tw-ring-color': 'var(--chart-4)'
                              } as React.CSSProperties}
                            />
                          </div>
                          <div>
                            <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Maximum</label>
                            <input
                              type="number"
                              min="45"
                              max="85"
                              value={searchForm.depthPercent.max}
                              onChange={(e) => handleRangeChange('depthPercent', 'max', parseFloat(e.target.value) || 75)}
                              className="w-full p-3 border-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-0"
                              style={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)',
                                '--tw-ring-color': 'var(--chart-4)'
                              } as React.CSSProperties}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Physical Characteristics Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    {/* <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--chart-5)' }}></div> */}
                    <h4 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Physical Characteristics</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Girdle</label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--chart-5)/10', color: 'var(--chart-5)' }}>
                          Edge Thickness
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {GIRDLE_OPTIONS.map(girdle => (
                          <button
                            key={girdle}
                            onClick={() => handleMultiSelect('girdle', girdle)}
                            className={`p-3 rounded-lg border-2 text-xs font-medium transition-all duration-200 hover:shadow-md ${searchForm.girdle.includes(girdle)
                                ? 'transform scale-105'
                                : 'hover:scale-102'
                              }`}
                            style={{
                              backgroundColor: searchForm.girdle.includes(girdle) ? 'var(--chart-5)/10' : 'var(--card)',
                              borderColor: searchForm.girdle.includes(girdle) ? 'var(--chart-5)' : 'var(--border)',
                              color: searchForm.girdle.includes(girdle) ? 'var(--chart-5)' : 'var(--foreground)',
                              boxShadow: searchForm.girdle.includes(girdle) ? '0 4px 12px var(--chart-5)/20' : 'none'
                            }}
                          >
                            {girdle}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Culet</label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--primary)/10', color: 'var(--primary)' }}>
                          Bottom Facet
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {CULET_OPTIONS.map(culet => (
                          <button
                            key={culet}
                            onClick={() => handleMultiSelect('culet', culet)}
                            className={`p-3 rounded-lg border-2 text-xs font-medium transition-all duration-200 hover:shadow-md ${searchForm.culet.includes(culet)
                                ? 'transform scale-105'
                                : 'hover:scale-102'
                              }`}
                            style={{
                              backgroundColor: searchForm.culet.includes(culet) ? 'var(--primary)/10' : 'var(--card)',
                              borderColor: searchForm.culet.includes(culet) ? 'var(--primary)' : 'var(--border)',
                              color: searchForm.culet.includes(culet) ? 'var(--primary)' : 'var(--foreground)',
                              boxShadow: searchForm.culet.includes(culet) ? '0 4px 12px var(--primary)/20' : 'none'
                            }}
                          >
                            {culet}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    {/* <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--chart-2)' }}></div> */}
                    <h4 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Market Information</h4>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Location</label>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--chart-2)/10', color: 'var(--chart-2)' }}>
                        Trading Centers
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {LOCATIONS.map(location => (
                        <button
                          key={location}
                          onClick={() => handleMultiSelect('location', location)}
                          className={`p-3 rounded-lg border-2 text-xs font-medium transition-all duration-200 hover:shadow-md ${searchForm.location.includes(location)
                              ? 'transform scale-105'
                              : 'hover:scale-102'
                            }`}
                          style={{
                            backgroundColor: searchForm.location.includes(location) ? 'var(--chart-2)/10' : 'var(--card)',
                            borderColor: searchForm.location.includes(location) ? 'var(--chart-2)' : 'var(--border)',
                            color: searchForm.location.includes(location) ? 'var(--chart-2)' : 'var(--foreground)',
                            boxShadow: searchForm.location.includes(location) ? '0 4px 12px var(--chart-2)/20' : 'none'
                          }}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Per Carat */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Price Per Carat</label>
                        <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                          backgroundColor: 'var(--chart-2)/10',
                          color: 'var(--chart-2)'
                        }}>
                          ${searchForm.pricePerCarat.min.toLocaleString()} - ${searchForm.pricePerCarat.max.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Min ($/ct)</label>
                          <input
                            type="number"
                            value={searchForm.pricePerCarat.min}
                            onChange={(e) => handleRangeChange('pricePerCarat', 'min', parseInt(e.target.value) || 500)}
                            className="w-full p-3 border-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-0"
                            style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              color: 'var(--foreground)',
                              '--tw-ring-color': 'var(--chart-2)'
                            } as React.CSSProperties}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Max ($/ct)</label>
                          <input
                            type="number"
                            value={searchForm.pricePerCarat.max}
                            onChange={(e) => handleRangeChange('pricePerCarat', 'max', parseInt(e.target.value) || 50000)}
                            className="w-full p-3 border-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-0"
                            style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              color: 'var(--foreground)',
                              '--tw-ring-color': 'var(--chart-2)'
                            } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Measurements Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    {/* <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--chart-4)' }}></div> */}
                    <h4 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Precise Measurements</h4>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { key: 'length' as const, label: 'Length', unit: 'mm', color: 'var(--chart-4)' },
                      { key: 'width' as const, label: 'Width', unit: 'mm', color: 'var(--chart-5)' },
                      { key: 'depth' as const, label: 'Depth', unit: 'mm', color: 'var(--chart-1)' }
                    ].map(({ key, label, unit, color }) => (
                      <div key={key} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{label}</label>
                          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${color}/10`, color: color }}>
                            {unit}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs mb-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>Min</label>
                              <input
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                value={searchForm.measurements[key].min}
                                onChange={(e) => handleMeasurementChange(key, 'min', parseFloat(e.target.value) || 0)}
                                className="w-full p-2 border rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-offset-0"
                                style={{
                                  backgroundColor: 'var(--card)',
                                  borderColor: 'var(--border)',
                                  color: 'var(--foreground)',
                                  '--tw-ring-color': color
                                } as React.CSSProperties}
                              />
                            </div>
                            <div>
                              <label className="block text-xs mb-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>Max</label>
                              <input
                                type="number"
                                placeholder="20.00"
                                step="0.01"
                                value={searchForm.measurements[key].max}
                                onChange={(e) => handleMeasurementChange(key, 'max', parseFloat(e.target.value) || (key === 'depth' ? 15 : 20))}
                                className="w-full p-2 border rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-offset-0"
                                style={{
                                  backgroundColor: 'var(--card)',
                                  borderColor: 'var(--border)',
                                  color: 'var(--foreground)',
                                  '--tw-ring-color': color
                                } as React.CSSProperties}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Tip */}
                <div className="p-6 rounded-xl border-2 border-dashed" style={{
                  backgroundColor: 'var(--primary)/5',
                  borderColor: 'var(--primary)/30'
                }}>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Professional Tip</h5>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        These advanced filters match the specifications used by major diamond trading platforms like RapNet and VDB.
                        Use Polish and Symmetry grades to ensure optimal light performance, and Table/Depth percentages for precise proportions.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleSearch}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <Search className="w-5 h-5 mr-2" />
            Find Diamonds
          </button>
          <button
            onClick={resetFilters}
            className="md:w-auto px-8 py-4 border rounded-lg font-medium transition-colors flex items-center justify-center"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            <Filter className="w-5 h-5 mr-2" />
            Reset Filters
          </button>
        </div>

        {/* Quick Search Options with Glassmorphism */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--foreground)' }}>
            Popular Searches
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[{
              type: 'natural', category: 'single', label: 'Engagement Rings', subtitle: '1-2 Carat Natural', icon: <Sparkles className="w-8 h-8 text-blue-500 mb-2" />
            },
            { type: 'lab-grown', category: 'single', label: 'Eco-Friendly', subtitle: 'Lab-Grown Singles', icon: <Leaf className="w-8 h-8 text-green-500 mb-2" /> },
            { type: 'natural', category: 'melee', label: 'Luxury Settings', subtitle: 'Natural Melee', icon: <Gem className="w-8 h-8 text-purple-500 mb-2" /> },
            { type: 'lab-grown', category: 'melee', label: 'Sustainable Choice', subtitle: 'Lab-Grown Melee', icon: <Leaf className="w-8 h-8 text-green-500 mb-2" /> }
            ].map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchForm(prev => ({
                    ...prev,
                    diamondType: option.type as 'natural' | 'lab-grown',
                    category: option.category as 'single' | 'melee'
                  }))
                  setTimeout(handleSearch, 100)
                }}
                className="p-6 border rounded-xl hover:shadow-2xl transition-all text-left bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col items-start gap-2"
                style={{ borderColor: 'var(--border)' }}
              >
                {option.icon}
                <div className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>{option.label}</div>
                <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{option.subtitle}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
