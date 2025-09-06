'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Gem, Leaf, Sparkles, Filter } from 'lucide-react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { filterOptions } from '@/constants/filterOptions'

// Comprehensive search form interface - matching DiamondFilters component
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
  
  // Fancy color filters
  isFancyColor: boolean
  fancyColors: string[]
  overtone: string[]
  intensity: string[]

  // Company and location filters
  company: string[]
  origin: string[]
  location: string[]

  // Advanced filters (like RapNet/VDB)
  polish: string[]
  symmetry: string[]
  finish: string[]
  cutGrade: string[]
  tablePercent: { min: number; max: number }
  depthPercent: { min: number; max: number }
  girdle: string[]
  culet: string[]
  pricePerCarat: { min: number; max: number }
  
  // Measurement filters
  measurements: {
    length: { min: number; max: number }
    width: { min: number; max: number }
    depth: { min: number; max: number }
  }
  ratio: { min: number; max: number }
  
  // Advanced proportion filters
  crownAngle: { min: number; max: number }
  crownHeight: { min: number; max: number }
  pavilionAngle: { min: number; max: number }
  pavilionDepth: { min: number; max: number }
  gridleThickness: { min: string; max: string }
  
  // Additional filters from DiamondFilters component
  diamondTypeAdvanced: string[] // Natural, CVD, HPHT
  productType: string[] // Certified, Non-certified
}

// Using comprehensive options from filterOptions
const SHAPES = filterOptions.shapes
const COLORS = filterOptions.whiteColors
const CLARITIES = filterOptions.clarities
const CUTS = filterOptions.cutGrades
const CERTIFICATIONS = filterOptions.certifications
const FLUORESCENCE_LEVELS = filterOptions.fluorescences
const POLISH_SYMMETRY_OPTIONS = filterOptions.polish
const GIRDLE_OPTIONS = filterOptions.gridleOptions.map(option => 
  option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
)
const CULET_OPTIONS = filterOptions.culetSizeOptions.map(option => 
  option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
)
const OVERTONE_OPTIONS = filterOptions.overTone
const INTENSITY_OPTIONS = filterOptions.intensity
const FINISH_OPTIONS = filterOptions.finish
const COMPANY_OPTIONS = filterOptions.companies
const LOCATION_OPTIONS = filterOptions.locations

// Growth methods for lab-grown diamonds
const GROWTH_METHODS = ['CVD', 'HPHT']

// Advanced filter options (RapNet/VDB style)
const GIRDLE_ORDER = [
  "Extremely Thin",
  "Very Thin", 
  "Thin",
  "Slightly Thin",
  "Medium",
  "Slightly Thick",
  "Thick",
  "Very Thick",
  "Extremely Thick",
]

// Origin options
const ORIGIN_OPTIONS = ['Natural', 'Lab-Grown', 'CVD', 'HPHT']

// Product type options
const PRODUCT_TYPE_OPTIONS = filterOptions.productType

// Shape icons import
import * as ShapeIcons from '@/../public/icons';
import { SECTION_WIDTH } from '@/lib/constants'

const shapeIconMap: Record<string, React.ComponentType<any>> = {
  'Round': ShapeIcons.RoundIcon,
  'Pear': ShapeIcons.PearIcon,
  'Emerald': ShapeIcons.EmeraldIcon,
  'Oval': ShapeIcons.OvalIcon,
  'Heart': ShapeIcons.HeartIcon,
  'Marquise': ShapeIcons.MarquiseIcon,
  'Asscher': ShapeIcons.AsscherIcon,
  'Cushion': ShapeIcons.CushionIcon,
  'Cushion modified': ShapeIcons.CushionModifiedIcon,
  'Cushion brilliant': ShapeIcons.CushionBrilliantIcon,
  'Radiant': ShapeIcons.RadiantIcon,
  'Princess': ShapeIcons.PrincessIcon,
  'French': ShapeIcons.FrenchIcon,
  'Trilliant': ShapeIcons.TrilliantIcon,
  'Euro cut': ShapeIcons.EurocutIcon,
  'Old Miner': ShapeIcons.OldMinerIcon,
  'Briollette': ShapeIcons.BriolletteIcon,
  'Rose cut': ShapeIcons.RosecutIcon,
  'Lozenge': ShapeIcons.LozengeIcon,
  'Baguette': ShapeIcons.BaguetteIcon,
  'Tapered baguette': ShapeIcons.TaperedBaguetteIcon,
  'Half-moon': ShapeIcons.HalfmoonIcon,
  'Flanders': ShapeIcons.FlandersIcon,
  'Trapezoid': ShapeIcons.TrapezoidIcon,
  'Bullet': ShapeIcons.BulletIcon,
  'Kite': ShapeIcons.KiteIcon,
  'Shield': ShapeIcons.ShieldIcon,
  'Star cut': ShapeIcons.StarcutIcon,
  'Pentagonal cut': ShapeIcons.PentagonalIcon,
  'Hexagonal cut': ShapeIcons.HexagonalIcon,
  'Octagonal cut': ShapeIcons.OctagonalIcon,
  'Portugeese cut': ShapeIcons.PortugeeseIcon,
  'Default': ShapeIcons.DefaultIcon
}

// Fancy colors
const FANCY_COLORS = [
  { name: "Yellow", color: "#FFD700" },
  { name: "Orange", color: "#FFA500" },
  { name: "Blue", color: "#4169E1" },
  { name: "Red", color: "#FF0000" },
  { name: "Pink", color: "#FFB6C1" },
  { name: "Green", color: "#50C878" },
  { name: "olive", color: "#636B2F" },
  { name: "Brown", color: "#8B4513" },
  { name: "Purple", color: "#800080" },
  {
    name: "other",
    color: "linear-gradient(#FF0000,#FFB6C1,#4169E1,#50C878,#FFD700)",
  },
]

// Range Selection Component for Color and Clarity
interface RangeSelectFilterProps {
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  layout?: 'grid' | 'horizontal'
  gridCols?: string
  label?: string
}

function RangeSelectFilter({ 
  options, 
  selected, 
  onChange, 
  layout = 'grid',
  gridCols = 'grid-cols-4',
  label = ''
}: RangeSelectFilterProps) {
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null)

  const handleItemClick = (option: string, index: number) => {
    console.log('Clicked:', option, 'Index:', index, 'LastClicked:', lastClickedIndex)
    console.log('Current selected:', selected)
    
    const isCurrentlySelected = selected.includes(option)
    
    // If clicking on a selected item, always do individual toggle (deselect it)
    // This prevents range selection when trying to deselect individual items
    if (isCurrentlySelected) {
      const newSelected = selected.filter(v => v !== option)
      console.log('Deselecting individual item:', option, 'New selected:', newSelected)
      onChange(newSelected)
      setLastClickedIndex(null) // Reset to prevent accidental range selection
      return
    }
    
    // Range selection logic - only when selecting (not deselecting) and have a previous click
    if (lastClickedIndex !== null && lastClickedIndex !== index && !isCurrentlySelected) {
      const startIndex = Math.min(lastClickedIndex, index)
      const endIndex = Math.max(lastClickedIndex, index)
      const rangeItems = options.slice(startIndex, endIndex + 1)
      
      console.log('Range selection - items:', rangeItems)
      
      // Always select the entire range (no deselection of ranges)
      const newSelected = [...new Set([...selected, ...rangeItems])]
      console.log('Selecting range, new selected:', newSelected)
      onChange(newSelected)
      
      setLastClickedIndex(null) // Reset after range selection
    } else {
      // Single item selection (not deselection - that's handled above)
      if (!isCurrentlySelected) {
        const newSelected = [...selected, option]
        console.log('Selecting single item, new selected:', newSelected)
        onChange(newSelected)
        setLastClickedIndex(index) // Set as potential range start
      }
    }
  }

  return (
    <div className="space-y-3">
      {/* Instructions */}
      <div className="text-xs p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
        💡 <strong>Range Selection:</strong> Click two unselected {label.toLowerCase()} to select all items in between. Click any selected item to deselect it individually.
      </div>

      {/* Selected Count & Clear */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
          <span className="text-sm font-medium text-green-800">
            {selected.length} {label.toLowerCase()} selected: <strong>{selected.join(', ')}</strong>
          </span>
          <button
            onClick={() => {
              onChange([])
              setLastClickedIndex(null)
            }}
            className="text-xs underline hover:no-underline transition-all text-green-600 font-medium"
          >
            Clear all
          </button>
        </div>
      )}
      
      {/* Options */}
      <div className={`${layout === 'grid' ? `grid ${gridCols} gap-2` : 'flex flex-wrap gap-2'}`}>
        {options.map((option, index) => {
          const isSelected = selected.includes(option)
          const isLastClicked = lastClickedIndex === index
          
          return (
            <button
              key={option}
              onClick={() => handleItemClick(option, index)}
              className={`
                p-3 rounded-lg border-2 text-sm font-medium transition-all duration-150
                ${isSelected 
                  ? 'border-blue-500 bg-blue-100 text-blue-800 shadow-md transform scale-105' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                }
                ${isLastClicked ? 'ring-2 ring-yellow-400 ring-opacity-60' : ''}
              `}
              style={{
                backgroundColor: isSelected ? '#dbeafe' : '#ffffff',
                borderColor: isSelected ? '#3b82f6' : '#d1d5db',
                color: isSelected ? '#1e40af' : '#374151',
                boxShadow: isLastClicked ? '0 0 0 2px rgba(251, 191, 36, 0.6)' : isSelected ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
              }}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

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

    // Fancy color filters
    isFancyColor: false,
    fancyColors: [],
    overtone: [],
    intensity: [],

    // Company and location filters
    company: [],
    origin: [],
    location: [],

    // Advanced filters
    polish: [],
    symmetry: [],
    finish: [],
    cutGrade: [],
    tablePercent: { min: 50, max: 70 },
    depthPercent: { min: 55, max: 75 },
    girdle: [],
    culet: [],
    pricePerCarat: { min: 500, max: 50000 },
    
    // Measurement filters
    measurements: {
      length: { min: 0, max: 20 },
      width: { min: 0, max: 20 },
      depth: { min: 0, max: 15 }
    },
    ratio: { min: 0.9, max: 2.5 },
    
    // Advanced proportion filters
    crownAngle: { min: 30, max: 36 },
    crownHeight: { min: 10, max: 16 },
    pavilionAngle: { min: 40, max: 42 },
    pavilionDepth: { min: 42, max: 44 },
    gridleThickness: { min: '', max: '' },
    
    // Additional filters from DiamondFilters component
    diamondTypeAdvanced: [], // Natural, CVD, HPHT
    productType: [] // Certified, Non-certified
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

  const handleMultiSelect = (field: keyof Pick<DiamondSearchForm, 'shape' | 'color' | 'clarity' | 'cut' | 'certification' | 'fluorescence' | 'grownMethod' | 'polish' | 'symmetry' | 'girdle' | 'culet' | 'location' | 'fancyColors' | 'overtone' | 'intensity' | 'company' | 'origin' | 'finish' | 'cutGrade' | 'diamondTypeAdvanced' | 'productType'>, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleRangeChange = (field: 'tablePercent' | 'depthPercent' | 'pricePerCarat' | 'ratio' | 'crownAngle' | 'crownHeight' | 'pavilionAngle' | 'pavilionDepth', type: 'min' | 'max', value: number) => {
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

  const handleAddCompanyOrLocation = (field: 'company' | 'origin', value: string) => {
    if (!value.trim()) return
    setSearchForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value.trim()) 
        ? prev[field] 
        : [...prev[field], value.trim()]
    }))
  }

  const handleRemoveCompanyOrLocation = (field: 'company' | 'origin', value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
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

    // Add fancy color parameters
    if (searchForm.isFancyColor) {
      params.set('isFancyColor', 'true')
      if (searchForm.fancyColors.length > 0) params.set('fancyColors', searchForm.fancyColors.join(','))
      if (searchForm.overtone.length > 0) params.set('overtone', searchForm.overtone.join(','))
      if (searchForm.intensity.length > 0) params.set('intensity', searchForm.intensity.join(','))
    }

    // Add company and origin parameters
    if (searchForm.company.length > 0) params.set('company', searchForm.company.join(','))
    if (searchForm.origin.length > 0) params.set('origin', searchForm.origin.join(','))
    if (searchForm.location.length > 0) params.set('location', searchForm.location.join(','))

    // Add advanced filter parameters
    if (searchForm.polish.length > 0) params.set('polish', searchForm.polish.join(','))
    if (searchForm.symmetry.length > 0) params.set('symmetry', searchForm.symmetry.join(','))
    if (searchForm.finish.length > 0) params.set('finish', searchForm.finish.join(','))
    if (searchForm.cutGrade.length > 0) params.set('cutGrade', searchForm.cutGrade.join(','))
    if (searchForm.girdle.length > 0) params.set('girdle', searchForm.girdle.join(','))
    if (searchForm.culet.length > 0) params.set('culet', searchForm.culet.join(','))
    
    // Add new comprehensive filter parameters
    if (searchForm.diamondTypeAdvanced.length > 0) params.set('diamondTypeAdvanced', searchForm.diamondTypeAdvanced.join(','))
    if (searchForm.productType.length > 0) params.set('productType', searchForm.productType.join(','))

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
    
    // Add ratio parameters
    params.set('ratioMin', searchForm.ratio.min.toString())
    params.set('ratioMax', searchForm.ratio.max.toString())

    // Add advanced proportion parameters
    params.set('crownAngleMin', searchForm.crownAngle.min.toString())
    params.set('crownAngleMax', searchForm.crownAngle.max.toString())
    params.set('crownHeightMin', searchForm.crownHeight.min.toString())
    params.set('crownHeightMax', searchForm.crownHeight.max.toString())
    params.set('pavilionAngleMin', searchForm.pavilionAngle.min.toString())
    params.set('pavilionAngleMax', searchForm.pavilionAngle.max.toString())
    params.set('pavilionDepthMin', searchForm.pavilionDepth.min.toString())
    params.set('pavilionDepthMax', searchForm.pavilionDepth.max.toString())

    // Add girdle thickness parameters
    if (searchForm.gridleThickness.min) params.set('gridleThicknessMin', searchForm.gridleThickness.min)
    if (searchForm.gridleThickness.max) params.set('gridleThicknessMax', searchForm.gridleThickness.max)

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
      
      // Fancy color filters
      isFancyColor: false,
      fancyColors: [],
      overtone: [],
      intensity: [],

      // Company and location filters
      company: [],
      origin: [],
      location: [],

      // Advanced filters
      polish: [],
      symmetry: [],
      finish: [],
      cutGrade: [],
      girdle: [],
      culet: [],
      
      // New comprehensive filters
      diamondTypeAdvanced: [],
      productType: [],
      
      // Reset ranges
      caratWeight: newCaratRange,
      priceRange: newPriceRange,
      tablePercent: { min: 50, max: 70 },
      depthPercent: { min: 55, max: 75 },
      pricePerCarat: { min: 500, max: 50000 },
      
      // Measurement filters
      measurements: {
        length: { min: 0, max: 20 },
        width: { min: 0, max: 20 },
        depth: { min: 0, max: 15 }
      },
      ratio: { min: 0.9, max: 2.5 },
      
      // Advanced proportion filters
      crownAngle: { min: 30, max: 36 },
      crownHeight: { min: 10, max: 16 },
      pavilionAngle: { min: 40, max: 42 },
      pavilionDepth: { min: 42, max: 44 },
      gridleThickness: { min: '', max: '' }
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
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 py-12`}>
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
              {(() => {
                const [showAllShapes, setShowAllShapes] = React.useState(false);
                const visibleShapes = showAllShapes ? SHAPES : SHAPES.slice(0, 9);
                return (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {visibleShapes.map(shape => {
                        const Icon = shapeIconMap[shape] || shapeIconMap['Default'];
                        const selected = searchForm.shape.includes(shape);
                        return (
                          <button
                            key={shape}
                            onClick={() => handleMultiSelect('shape', shape)}
                            className={`flex flex-col items-center justify-center p-3 duration-75 rounded-xl border transition-all group relative focus:outline-none focus:ring-2 focus:ring-blue-400 ${selected ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
                            style={{
                              backgroundColor: selected ? 'var(--primary)/10' : 'var(--card)',
                              borderColor: selected ? 'var(--primary)' : 'var(--border)',
                              color: selected ? 'var(--primary)' : 'var(--foreground)',
                              transition: 'box-shadow 0.2s, transform 0.2s'
                            }}
                            title={shape}
                          >
                            <span className={`w-12 h-12 flex items-center justify-center mb-1 rounded-full transition-all bg-transparent`}
                            >
                              <Icon width={40} height={40} />
                            </span>
                            <span className="text-xs font-medium text-center truncate w-full">{shape}</span>
                            {/* Tooltip for better UX on hover */}
                            <span className="absolute z-10 left-1/2 -translate-x-1/2 bottom-[-2.2rem] px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap shadow-lg" style={{ minWidth: 60 }}>
                              {shape}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {SHAPES.length > 9 && (
                      <div className="flex justify-center mt-3">
                        <button
                          type="button"
                          className="px-4 py-1 rounded-full border text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--border)',
                            color: 'var(--primary)',
                            minWidth: 100
                          }}
                          onClick={() => setShowAllShapes(v => !v)}
                        >
                          {showAllShapes ? 'Show Less' : 'Show More'}
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
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

            {/* Color - Enhanced with Fancy Color Toggle */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Color
              </label>
              
              {/* Color Type Toggle */}
              <div className="mb-4">
                <div className="inline-flex rounded-lg bg-gray-100 dark:bg-slate-800 p-0.5">
                  <button
                    onClick={() => setSearchForm(prev => ({
                      ...prev,
                      isFancyColor: false,
                      color: [],
                      fancyColors: [],
                      overtone: [],
                      intensity: []
                    }))}
                    className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer
                      ${!searchForm.isFancyColor
                        ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    style={{
                      backgroundColor: !searchForm.isFancyColor ? 'var(--card)' : 'transparent',
                      color: !searchForm.isFancyColor ? 'var(--foreground)' : 'var(--muted-foreground)'
                    }}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setSearchForm(prev => ({
                      ...prev,
                      isFancyColor: true,
                      color: [],
                      fancyColors: [],
                      overtone: [],
                      intensity: []
                    }))}
                    className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer
                      ${searchForm.isFancyColor
                        ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    style={{
                      backgroundColor: searchForm.isFancyColor ? 'var(--card)' : 'transparent',
                      color: searchForm.isFancyColor ? 'var(--foreground)' : 'var(--muted-foreground)'
                    }}
                  >
                    Fancy
                  </button>
                </div>
              </div>

              {searchForm.isFancyColor ? (
                <div className="space-y-4">
                  {/* Fancy Colors */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {FANCY_COLORS.map((fancyColor) => (
                      <button
                        key={fancyColor.name}
                        onClick={() => handleMultiSelect("fancyColors", fancyColor.name)}
                        className={`relative py-3 px-4 rounded-xl transition-all duration-200 border
                          ${searchForm.fancyColors?.includes(fancyColor.name)
                            ? "border-amber-500 shadow-lg transform scale-105"
                            : "border-gray-200 hover:border-amber-300"
                          }`}
                        style={{
                          backgroundColor: searchForm.fancyColors?.includes(fancyColor.name) ? 'var(--primary)/10' : 'var(--card)',
                          borderColor: searchForm.fancyColors?.includes(fancyColor.name) ? 'var(--primary)' : 'var(--border)'
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: fancyColor.color }}
                          />
                          <span className={`text-sm ${searchForm.fancyColors?.includes(fancyColor.name) ? "font-semibold" : ""}`}
                            style={{ color: 'var(--foreground)' }}>
                            {fancyColor.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Overtone */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                      Overtone
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {OVERTONE_OPTIONS.map(overtone => (
                        <button
                          key={overtone}
                          onClick={() => handleMultiSelect('overtone', overtone)}
                          className={`p-2 rounded-lg border text-xs font-medium transition-all ${searchForm.overtone.includes(overtone)
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                          style={{
                            backgroundColor: searchForm.overtone.includes(overtone) ? 'var(--chart-4)/10' : 'var(--card)',
                            borderColor: searchForm.overtone.includes(overtone) ? 'var(--chart-4)' : 'var(--border)',
                            color: searchForm.overtone.includes(overtone) ? 'var(--chart-4)' : 'var(--foreground)'
                          }}
                        >
                          {overtone}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Intensity */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                      Intensity
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {INTENSITY_OPTIONS.map(intensity => (
                        <button
                          key={intensity}
                          onClick={() => handleMultiSelect('intensity', intensity)}
                          className={`p-2 rounded-lg border text-xs font-medium transition-all ${searchForm.intensity.includes(intensity)
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                          style={{
                            backgroundColor: searchForm.intensity.includes(intensity) ? 'var(--chart-5)/10' : 'var(--card)',
                            borderColor: searchForm.intensity.includes(intensity) ? 'var(--chart-5)' : 'var(--border)',
                            color: searchForm.intensity.includes(intensity) ? 'var(--chart-5)' : 'var(--foreground)'
                          }}
                        >
                          {intensity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <RangeSelectFilter
                  options={COLORS}
                  selected={searchForm.color}
                  onChange={(values) => setSearchForm(prev => ({ ...prev, color: values }))}
                  layout="grid"
                  gridCols="grid-cols-5 md:grid-cols-10"
                  label="Colors"
                />
              )}
            </div>

            {/* Clarity */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Clarity
              </label>
              <RangeSelectFilter
                options={CLARITIES}
                selected={searchForm.clarity}
                onChange={(values) => setSearchForm(prev => ({ ...prev, clarity: values }))}
                layout="grid"
                gridCols="grid-cols-4 md:grid-cols-8"
                label="Clarity"
              />
            </div>

            {/* Cut Grade */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Cut Grade
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {CUTS.map(cut => (
                  <button
                    key={cut}
                    onClick={() => handleMultiSelect('cutGrade', cut)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${searchForm.cutGrade.includes(cut)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    style={{
                      backgroundColor: searchForm.cutGrade.includes(cut) ? 'var(--chart-2)/10' : 'var(--card)',
                      borderColor: searchForm.cutGrade.includes(cut) ? 'var(--chart-2)' : 'var(--border)',
                      color: searchForm.cutGrade.includes(cut) ? 'var(--chart-2)' : 'var(--foreground)'
                    }}
                  >
                    {cut}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Finish (Quick Select)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FINISH_OPTIONS.map(finish => (
                  <button
                    key={finish}
                    onClick={() => handleMultiSelect('finish', finish)}
                    className={`p-4 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:shadow-md ${searchForm.finish.includes(finish)
                        ? 'border-indigo-500 bg-indigo-50 transform scale-105'
                        : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    style={{
                      backgroundColor: searchForm.finish.includes(finish) ? 'var(--chart-1)/10' : 'var(--card)',
                      borderColor: searchForm.finish.includes(finish) ? 'var(--chart-1)' : 'var(--border)',
                      color: searchForm.finish.includes(finish) ? 'var(--chart-1)' : 'var(--foreground)',
                      boxShadow: searchForm.finish.includes(finish) ? '0 4px 12px var(--chart-1)/20' : 'none'
                    }}
                  >
                    <div className="font-bold text-lg">{finish}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                      {finish === '3X' ? 'Triple Excellent' : 
                       finish === 'EX-' ? 'Excellent to Very Good' :
                       finish === 'VG+' ? 'Very Good+' : 'Very Good to Good'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Certification */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Certification
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {CERTIFICATIONS.map(cert => (
                  <button
                    key={cert}
                    onClick={() => handleMultiSelect('certification', cert)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${searchForm.certification.includes(cert)
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    style={{
                      backgroundColor: searchForm.certification.includes(cert) ? 'var(--primary)/10' : 'var(--card)',
                      borderColor: searchForm.certification.includes(cert) ? 'var(--primary)' : 'var(--border)',
                      color: searchForm.certification.includes(cert) ? 'var(--primary)' : 'var(--foreground)'
                    }}
                  >
                    {cert}
                  </button>
                ))}
              </div>
            </div>
            
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

                {/* Diamond Type and Product Type Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h4 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Diamond Classification</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Diamond Type</label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--chart-1)/10', color: 'var(--chart-1)' }}>
                          Origin & Process
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {filterOptions.diamondType.map(type => (
                          <button
                            key={type}
                            onClick={() => handleMultiSelect('diamondTypeAdvanced', type)}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:shadow-md ${searchForm.diamondTypeAdvanced.includes(type)
                                ? 'transform scale-105'
                                : 'hover:scale-102'
                              }`}
                            style={{
                              backgroundColor: searchForm.diamondTypeAdvanced.includes(type) ? 'var(--chart-1)/10' : 'var(--card)',
                              borderColor: searchForm.diamondTypeAdvanced.includes(type) ? 'var(--chart-1)' : 'var(--border)',
                              color: searchForm.diamondTypeAdvanced.includes(type) ? 'var(--chart-1)' : 'var(--foreground)',
                              boxShadow: searchForm.diamondTypeAdvanced.includes(type) ? '0 4px 12px var(--chart-1)/20' : 'none'
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Product Type</label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--chart-2)/10', color: 'var(--chart-2)' }}>
                          Certification Status
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {filterOptions.productType.map(prodType => (
                          <button
                            key={prodType}
                            onClick={() => handleMultiSelect('productType', prodType)}
                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:shadow-md ${searchForm.productType.includes(prodType)
                                ? 'transform scale-105'
                                : 'hover:scale-102'
                              }`}
                            style={{
                              backgroundColor: searchForm.productType.includes(prodType) ? 'var(--chart-2)/10' : 'var(--card)',
                              borderColor: searchForm.productType.includes(prodType) ? 'var(--chart-2)' : 'var(--border)',
                              color: searchForm.productType.includes(prodType) ? 'var(--chart-2)' : 'var(--foreground)',
                              boxShadow: searchForm.productType.includes(prodType) ? '0 4px 12px var(--chart-2)/20' : 'none'
                            }}
                          >
                            {prodType}
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

                  {/* Girdle Thickness Range Selector */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Girdle Thickness Range</label>
                        {searchForm.gridleThickness.min && searchForm.gridleThickness.max && (
                          <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                            backgroundColor: 'var(--primary)/10',
                            color: 'var(--primary)'
                          }}>
                            {searchForm.gridleThickness.min} to {searchForm.gridleThickness.max}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs mb-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>Minimum</label>
                          <select
                            value={searchForm.gridleThickness.min}
                            onChange={(e) => {
                              const minValue = e.target.value
                              let maxValue = searchForm.gridleThickness.max || GIRDLE_ORDER[GIRDLE_ORDER.length - 1]
                              
                              const minIndex = GIRDLE_ORDER.indexOf(minValue)
                              const maxIndex = GIRDLE_ORDER.indexOf(maxValue)
                              
                              if (minIndex > maxIndex) {
                                maxValue = minValue
                              }
                              
                              setSearchForm(prev => ({
                                ...prev,
                                gridleThickness: {
                                  min: minValue,
                                  max: maxValue
                                }
                              }))
                            }}
                            className="w-full p-2 border rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          >
                            <option value="">Select minimum</option>
                            {GIRDLE_ORDER.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs mb-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>Maximum</label>
                          <select
                            value={searchForm.gridleThickness.max}
                            onChange={(e) => {
                              setSearchForm(prev => ({
                                ...prev,
                                gridleThickness: {
                                  ...prev.gridleThickness,
                                  max: e.target.value
                                }
                              }))
                            }}
                            className="w-full p-2 border rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          >
                            <option value="">Select maximum</option>
                            {GIRDLE_ORDER.map((option) => {
                              const minIndex = searchForm.gridleThickness.min
                                ? GIRDLE_ORDER.indexOf(searchForm.gridleThickness.min)
                                : 0
                              const optionIndex = GIRDLE_ORDER.indexOf(option)
                              
                              if (optionIndex >= minIndex) {
                                return (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                )
                              }
                              return null
                            })}
                          </select>
                        </div>
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
                      {LOCATION_OPTIONS.map(location => (
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

                {/* Company and Origin Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h4 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Company & Origin Information</h4>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Company Name with Search */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Company Name</label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--chart-2)/10', color: 'var(--chart-2)' }}>
                          Supplier
                        </span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Enter company name and press Enter"
                          className="w-full p-3 border rounded-lg font-medium"
                          style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)'
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value.trim()
                              if (value && !searchForm.company.includes(value)) {
                                handleAddCompanyOrLocation('company', value)
                                ;(e.target as HTMLInputElement).value = ''
                              }
                            }
                          }}
                        />
                        <div className="flex flex-wrap gap-2">
                          {searchForm.company.map((company, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                              style={{
                                backgroundColor: 'var(--chart-2)/10',
                                color: 'var(--chart-2)',
                                border: '1px solid var(--chart-2)'
                              }}
                            >
                              {company}
                              <button
                                type="button"
                                className="ml-2 text-xs hover:text-red-500"
                                onClick={() => handleRemoveCompanyOrLocation('company', company)}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Vendor's Location with Search */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Vendor's Location</label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--chart-3)/10', color: 'var(--chart-3)' }}>
                          Trading Center
                        </span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Enter location and press Enter"
                          className="w-full p-3 border rounded-lg font-medium"
                          style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)'
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value.trim()
                              if (value && !searchForm.location.includes(value)) {
                                setSearchForm(prev => ({
                                  ...prev,
                                  location: [...prev.location, value]
                                }))
                                ;(e.target as HTMLInputElement).value = ''
                              }
                            }
                          }}
                        />
                        <div className="flex flex-wrap gap-2">
                          {searchForm.location.map((location, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                              style={{
                                backgroundColor: 'var(--chart-3)/10',
                                color: 'var(--chart-3)',
                                border: '1px solid var(--chart-3)'
                              }}
                            >
                              {location}
                              <button
                                type="button"
                                className="ml-2 text-xs hover:text-red-500"
                                onClick={() => setSearchForm(prev => ({
                                  ...prev,
                                  location: prev.location.filter(l => l !== location)
                                }))}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Origin with Search */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Origin</label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--chart-4)/10', color: 'var(--chart-4)' }}>
                          Source
                        </span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Enter origin and press Enter"
                          className="w-full p-3 border rounded-lg font-medium"
                          style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)'
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value.trim()
                              if (value && !searchForm.origin.includes(value)) {
                                handleAddCompanyOrLocation('origin', value)
                                ;(e.target as HTMLInputElement).value = ''
                              }
                            }
                          }}
                        />
                        <div className="flex flex-wrap gap-2">
                          {searchForm.origin.map((origin, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                              style={{
                                backgroundColor: 'var(--chart-4)/10',
                                color: 'var(--chart-4)',
                                border: '1px solid var(--chart-4)'
                              }}
                            >
                              {origin}
                              <button
                                type="button"
                                className="ml-2 text-xs hover:text-red-500"
                                onClick={() => handleRemoveCompanyOrLocation('origin', origin)}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Measurement Ratios and Proportions */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h4 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Advanced Proportions</h4>
                  </div>

                  {/* Length to Width Ratio */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Length to Width Ratio</label>
                        <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                          backgroundColor: 'var(--chart-1)/10',
                          color: 'var(--chart-1)'
                        }}>
                          {searchForm.ratio.min.toFixed(2)} : 1 - {searchForm.ratio.max.toFixed(2)} : 1
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Minimum Ratio</label>
                          <input
                            type="number"
                            min="0.5"
                            max="3.0"
                            step="0.01"
                            value={searchForm.ratio.min}
                            onChange={(e) => handleRangeChange('ratio', 'min', parseFloat(e.target.value) || 0.9)}
                            className="w-full p-3 border-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-0"
                            style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              color: 'var(--foreground)',
                              '--tw-ring-color': 'var(--chart-1)'
                            } as React.CSSProperties}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>Maximum Ratio</label>
                          <input
                            type="number"
                            min="0.5"
                            max="3.0"
                            step="0.01"
                            value={searchForm.ratio.max}
                            onChange={(e) => handleRangeChange('ratio', 'max', parseFloat(e.target.value) || 2.5)}
                            className="w-full p-3 border-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-offset-0"
                            style={{
                              backgroundColor: 'var(--card)',
                              borderColor: 'var(--border)',
                              color: 'var(--foreground)',
                              '--tw-ring-color': 'var(--chart-1)'
                            } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Crown Angle and Height */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Crown Angle</label>
                        <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                          backgroundColor: 'var(--chart-4)/10',
                          color: 'var(--chart-4)'
                        }}>
                          {searchForm.crownAngle.min}° - {searchForm.crownAngle.max}°
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          min="25"
                          max="40"
                          step="0.1"
                          value={searchForm.crownAngle.min}
                          onChange={(e) => handleRangeChange('crownAngle', 'min', parseFloat(e.target.value) || 30)}
                          placeholder="Min"
                          className="w-full p-2 border rounded-lg text-sm"
                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                        <input
                          type="number"
                          min="25"
                          max="40"
                          step="0.1"
                          value={searchForm.crownAngle.max}
                          onChange={(e) => handleRangeChange('crownAngle', 'max', parseFloat(e.target.value) || 36)}
                          placeholder="Max"
                          className="w-full p-2 border rounded-lg text-sm"
                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Crown Height %</label>
                        <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                          backgroundColor: 'var(--chart-5)/10',
                          color: 'var(--chart-5)'
                        }}>
                          {searchForm.crownHeight.min}% - {searchForm.crownHeight.max}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          min="8"
                          max="20"
                          step="0.1"
                          value={searchForm.crownHeight.min}
                          onChange={(e) => handleRangeChange('crownHeight', 'min', parseFloat(e.target.value) || 10)}
                          placeholder="Min"
                          className="w-full p-2 border rounded-lg text-sm"
                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                        <input
                          type="number"
                          min="8"
                          max="20"
                          step="0.1"
                          value={searchForm.crownHeight.max}
                          onChange={(e) => handleRangeChange('crownHeight', 'max', parseFloat(e.target.value) || 16)}
                          placeholder="Max"
                          className="w-full p-2 border rounded-lg text-sm"
                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pavilion Angle and Depth */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Pavilion Angle</label>
                        <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                          backgroundColor: 'var(--chart-2)/10',
                          color: 'var(--chart-2)'
                        }}>
                          {searchForm.pavilionAngle.min}° - {searchForm.pavilionAngle.max}°
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          min="38"
                          max="45"
                          step="0.1"
                          value={searchForm.pavilionAngle.min}
                          onChange={(e) => handleRangeChange('pavilionAngle', 'min', parseFloat(e.target.value) || 40)}
                          placeholder="Min"
                          className="w-full p-2 border rounded-lg text-sm"
                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                        <input
                          type="number"
                          min="38"
                          max="45"
                          step="0.1"
                          value={searchForm.pavilionAngle.max}
                          onChange={(e) => handleRangeChange('pavilionAngle', 'max', parseFloat(e.target.value) || 42)}
                          placeholder="Max"
                          className="w-full p-2 border rounded-lg text-sm"
                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Pavilion Depth %</label>
                        <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                          backgroundColor: 'var(--chart-3)/10',
                          color: 'var(--chart-3)'
                        }}>
                          {searchForm.pavilionDepth.min}% - {searchForm.pavilionDepth.max}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          min="40"
                          max="47"
                          step="0.1"
                          value={searchForm.pavilionDepth.min}
                          onChange={(e) => handleRangeChange('pavilionDepth', 'min', parseFloat(e.target.value) || 42)}
                          placeholder="Min"
                          className="w-full p-2 border rounded-lg text-sm"
                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                        <input
                          type="number"
                          min="40"
                          max="47"
                          step="0.1"
                          value={searchForm.pavilionDepth.max}
                          onChange={(e) => handleRangeChange('pavilionDepth', 'max', parseFloat(e.target.value) || 44)}
                          placeholder="Max"
                          className="w-full p-2 border rounded-lg text-sm"
                          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Girdle Thickness */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Girdle Thickness Range</label>
                        {searchForm.gridleThickness.min && searchForm.gridleThickness.max && (
                          <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                            backgroundColor: 'var(--primary)/10',
                            color: 'var(--primary)'
                          }}>
                            {searchForm.gridleThickness.min} to {searchForm.gridleThickness.max}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs mb-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>Minimum</label>
                          <select
                            value={searchForm.gridleThickness.min}
                            onChange={(e) => {
                              const minValue = e.target.value
                              setSearchForm(prev => ({
                                ...prev,
                                gridleThickness: {
                                  ...prev.gridleThickness,
                                  min: minValue,
                                  max: prev.gridleThickness.max || GIRDLE_ORDER[GIRDLE_ORDER.length - 1]
                                }
                              }))
                            }}
                            className="w-full p-2 border rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          >
                            <option value="">Select minimum</option>
                            {GIRDLE_ORDER.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs mb-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>Maximum</label>
                          <select
                            value={searchForm.gridleThickness.max}
                            onChange={(e) => {
                              setSearchForm(prev => ({
                                ...prev,
                                gridleThickness: {
                                  ...prev.gridleThickness,
                                  max: e.target.value
                                }
                              }))
                            }}
                            className="w-full p-2 border rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          >
                            <option value="">Select maximum</option>
                            {GIRDLE_ORDER.map((option) => {
                              const minIndex = searchForm.gridleThickness.min
                                ? GIRDLE_ORDER.indexOf(searchForm.gridleThickness.min)
                                : 0
                              const optionIndex = GIRDLE_ORDER.indexOf(option)
                              
                              if (optionIndex >= minIndex) {
                                return (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                )
                              }
                              return null
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
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
