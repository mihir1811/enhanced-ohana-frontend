'use client'

import { useState } from 'react'
import { Search, Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'

export interface DiamondFilterValues {
  // Basic filters
  shape: string[]
  caratWeight: { min: number; max: number }
  color: string[]
  clarity: string[]
  cut: string[]
  priceRange: { min: number; max: number }
  
  // Advanced filters
  certification: string[]
  fluorescence: string[]
  polish: string[]
  symmetry: string[]
  location: string[]
  
  // Measurements
  measurements: {
    length: { min: number; max: number }
    width: { min: number; max: number }
    depth: { min: number; max: number }
  }
  
  // Percentages
  tablePercent: { min: number; max: number }
  depthPercent: { min: number; max: number }
  
  // Additional Professional Filters
  girdle: string[]
  culet: string[]
  origin: string[]
  treatment: string[]
  milkyness: string[]
  matching: boolean | null
  
  // Price & Market
  pricePerCarat: { min: number; max: number }
  availability: string[]
  delivery: string[]
  
  // Optical Properties
  brilliance: string[]
  fire: string[]
  scintillation: string[]
  
  // Lab-grown specific
  grownMethod: string[]
  
  // Search
  searchTerm: string
  reportNumber: string
  stoneId: string
}

interface DiamondFiltersProps {
  filters: DiamondFilterValues
  onFiltersChange: (filters: DiamondFilterValues) => void
  diamondType: 'natural-single' | 'natural-melee' | 'lab-grown-single' | 'lab-grown-melee'
  className?: string
}

import * as ShapeIcons from '@/../public/icons';

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
]

// Map shape names to icon components (default fallback if not found)
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
  'Old Miner': ShapeIcons.OldminarIcon,
  'Briollette': ShapeIcons.BriollietteIcon,
  'Rose cut': ShapeIcons.RosecutIcon,
  'Lozenge': ShapeIcons.LozengeIcon,
  'Baguette': ShapeIcons.BaguetteIcon,
  'Tapered baguette': ShapeIcons.TaperedBaguatteIcon,
  'Half-moon': ShapeIcons.HalfmoonIcon,
  'Flanders': ShapeIcons.FlandersIcon,
  'Trapezoid': ShapeIcons.TrapazoidIcon,
  'Bullet': ShapeIcons.BulletIcon,
  'Kite': ShapeIcons.KiteIcon,
  'Shield': ShapeIcons.ShieldIcon,
  'Star cut': ShapeIcons.StarcutIcon,
  'Pentagonal cut': ShapeIcons.PentagonalIcon,
  'Hexagonal cut': ShapeIcons.HexagonalIcon,
  'Octagonal cut': ShapeIcons.OctagonalIcon,
  'Portugeese cut': ShapeIcons.PortugeeseIcon,
  // fallback
  'Default': ShapeIcons.DefaultIcon
};

// Industry-standard shape categories based on your inventory
const SHAPE_CATEGORIES = {
  'Popular': ["Round", "Princess", "Cushion", "Emerald", "Oval", "Radiant", "Asscher"],
  'Fancy': ["Pear", "Heart", "Marquise", "Trilliant"],
  'Cushion Variants': ["Cushion", "Cushion modified", "Cushion brilliant"],
  'Baguette & Step': ["Baguette", "Tapered baguette", "Emerald"],
  'Vintage & Antique': ["Euro cut", "Old Miner", "Rose cut", "Portugeese cut"],
  'Specialty': ["French", "Briollette", "Lozenge", "Half-moon", "Flanders"],
  'Geometric': ["Trapezoid", "Bullet", "Kite", "Shield", "Star cut"],
  'Polygon': ["Pentagonal cut", "Hexagonal cut", "Octagonal cut"]
}

const DIAMOND_COLORS = [
  'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

const DIAMOND_CLARITY = [
  'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3'
]

const CUT_GRADES = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']

const CERTIFICATIONS = ['GIA', 'AGS', 'EGL', 'Gübelin', 'SSEF', 'IGI', 'GCAL']

const FLUORESCENCE_LEVELS = ['None', 'Faint', 'Medium', 'Strong', 'Very Strong']

// Additional filter options
const GIRDLE_OPTIONS = ['Extremely Thin', 'Very Thin', 'Thin', 'Medium', 'Slightly Thick', 'Thick', 'Very Thick', 'Extremely Thick']

const CULET_OPTIONS = ['None', 'Very Small', 'Small', 'Medium', 'Large', 'Very Large']

const ORIGIN_OPTIONS = ['Natural', 'Lab-Grown', 'HPHT', 'CVD']

const TREATMENT_OPTIONS = ['None', 'Laser Drilling', 'Fracture Filling', 'HPHT', 'Irradiation', 'Coating']

const MILKYNESS_OPTIONS = ['None', 'Slight', 'Moderate', 'Strong']

const AVAILABILITY_OPTIONS = ['In Stock', 'Available on Memo', 'Made to Order', 'Virtual Inventory']

const DELIVERY_OPTIONS = ['Same Day', '1-2 Days', '3-5 Days', '1 Week', '2+ Weeks']

const OPTICAL_PROPERTIES = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']

const GROWN_METHODS = ['HPHT', 'CVD']

const LOCATION_OPTIONS = ['New York', 'Antwerp', 'Mumbai', 'Tel Aviv', 'Hong Kong', 'Bangkok', 'Dubai', 'Surat']

export default function DiamondFilters({ 
  filters, 
  onFiltersChange, 
  diamondType,
  className = '' 
}: DiamondFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic', 'price'])
  )

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateFilter = (key: keyof DiamondFilterValues, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const resetFilters = () => {
    const defaultFilters: DiamondFilterValues = {
      shape: [],
      caratWeight: { 
        min: diamondType.includes('melee') ? 0.001 : 0.30, 
        max: diamondType.includes('melee') ? 0.30 : 10 
      },
      color: [],
      clarity: [],
      cut: [],
      priceRange: { min: 0, max: 100000 },
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
    }
    onFiltersChange(defaultFilters)
  }

  const getCaratRange = () => {
    switch (diamondType) {
      case 'natural-melee':
      case 'lab-grown-melee':
        return { min: 0.001, max: 0.30, step: 0.001 }
      default:
        return { min: 0.30, max: 10, step: 0.01 }
    }
  }

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children,
    badge,
    description
  }: { 
    title: string
    sectionKey: string
    children: React.ReactNode
    badge?: string
    description?: string
  }) => {
    const isExpanded = expandedSections.has(sectionKey)
    
    return (
      <div className="border-b transition-all duration-200" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-opacity-50 transition-all duration-200 group"
          style={{ backgroundColor: isExpanded ? 'var(--muted)/5' : 'transparent', color: 'var(--foreground)' }}
        >
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-base">{title}</h3>
            {badge && (
              <span className="px-2 py-1 text-xs font-medium rounded-full"
                style={{ 
                  backgroundColor: 'var(--primary)/10', 
                  color: 'var(--primary)' 
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {description && (
              <span className="text-xs hidden md:block" style={{ color: 'var(--muted-foreground)' }}>
                {description}
              </span>
            )}
            <div className="p-1 rounded-full group-hover:bg-current group-hover:bg-opacity-10 transition-all">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              ) : (
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              )}
            </div>
          </div>
        </button>
        {isExpanded && (
          <div className="p-4 pt-0 animate-in slide-in-from-top-2 duration-200">
            {children}
          </div>
        )}
      </div>
    )
  }

  const CategorizedShapeFilter = ({ 
    selected, 
    onChange 
  }: { 
    selected: string[]
    onChange: (values: string[]) => void 
  }) => {
    const [showAllCategories, setShowAllCategories] = useState(false)
    const categoriesToShow = showAllCategories ? Object.keys(SHAPE_CATEGORIES) : ['Popular']

    const toggleShape = (shape: string) => {
      if (selected.includes(shape)) {
        onChange(selected.filter(s => s !== shape))
      } else {
        onChange([...selected, shape])
      }
    }

    return (
      <div className="space-y-3">
        {categoriesToShow.map(category => (
          <div key={category}>
            <div className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
              {category}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {SHAPE_CATEGORIES[category as keyof typeof SHAPE_CATEGORIES].map(shape => {
                const Icon = shapeIconMap[shape] || shapeIconMap['Default'];
                return (
                  <button
                    key={shape}
                    onClick={() => toggleShape(shape)}
                    className={`flex items-center gap-2 text-xs p-2 rounded border transition-all text-left ${
                      selected.includes(shape)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      backgroundColor: selected.includes(shape) ? 'var(--primary)/10' : 'var(--card)',
                      borderColor: selected.includes(shape) ? 'var(--primary)' : 'var(--border)',
                      color: selected.includes(shape) ? 'var(--primary)' : 'var(--foreground)'
                    }}
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      <Icon width={18} height={18} />
                    </span>
                    {shape}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <button
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="text-xs hover:underline w-full text-left"
          style={{ color: 'var(--primary)' }}
        >
          {showAllCategories ? 'Show Less Shapes' : `Show All Shapes (${DIAMOND_SHAPES.length} total)`}
        </button>
        {selected.length > 0 && (
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {selected.length} shape{selected.length > 1 ? 's' : ''} selected
          </div>
        )}
      </div>
    )
  }

  const MultiSelectFilter = ({ 
    options, 
    selected, 
    onChange, 
    placeholder,
    layout = 'grid'
  }: { 
    options: string[]
    selected: string[]
    onChange: (values: string[]) => void
    placeholder: string
    layout?: 'grid' | 'horizontal'
  }) => (
    <div className="space-y-3">
      {/* Selected Count & Clear */}
      {selected.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg" 
          style={{ backgroundColor: 'var(--primary)/5', borderColor: 'var(--primary)/20' }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
            {selected.length} selected
          </span>
          <button
            onClick={() => onChange([])}
            className="text-xs underline hover:no-underline transition-all"
            style={{ color: 'var(--primary)' }}
          >
            Clear all
          </button>
        </div>
      )}
      
      {/* Options */}
      <div className={`${layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'} max-h-48 overflow-y-auto`}>
        {options.map((option) => (
          <label 
            key={option} 
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
              selected.includes(option) ? 'ring-2 ring-offset-1' : 'hover:ring-1'
            }`}
            style={{ 
              backgroundColor: selected.includes(option) ? 'var(--primary)/10' : 'var(--muted)/30',
              borderColor: selected.includes(option) ? 'var(--primary)' : 'var(--border)',
              '--tw-ring-color': selected.includes(option) ? 'var(--primary)' : 'var(--muted-foreground)'
            } as React.CSSProperties}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selected, option])
                } else {
                  onChange(selected.filter(v => v !== option))
                }
              }}
              className="w-4 h-4 rounded border-2 focus:ring-2 focus:ring-offset-0"
              style={{ 
                accentColor: 'var(--primary)',
                borderColor: 'var(--border)'
              }}
            />
            <span className={`text-sm font-medium ${selected.includes(option) ? 'font-semibold' : ''}`} 
              style={{ color: selected.includes(option) ? 'var(--primary)' : 'var(--foreground)' }}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
      
      {/* Empty State */}
      {options.length === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
          <p className="text-sm">No options available</p>
        </div>
      )}
    </div>
  )

  const RangeFilter = ({ 
    min, 
    max, 
    value, 
    onChange, 
    step = 1, 
    unit = '',
    showSlider = false
  }: { 
    min: number
    max: number
    value: { min: number; max: number }
    onChange: (range: { min: number; max: number }) => void
    step?: number
    unit?: string
    showSlider?: boolean
  }) => (
    <div className="space-y-4">
      {/* Current Range Display */}
      <div className="flex items-center justify-between p-3 rounded-lg" 
        style={{ backgroundColor: 'var(--muted)/20', borderColor: 'var(--border)' }}
      >
        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          Current Range:
        </span>
        <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
          {value.min.toLocaleString()}{unit} - {value.max.toLocaleString()}{unit}
        </span>
      </div>
      
      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Minimum {unit}
          </label>
          <div className="relative">
            <input
              type="number"
              value={value.min}
              onChange={(e) => onChange({ ...value, min: parseFloat(e.target.value) || min })}
              min={min}
              max={max}
              step={step}
              className="w-full px-4 py-3 text-sm border-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:border-transparent"
              style={{ 
                backgroundColor: 'var(--input)', 
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                '--tw-ring-color': 'var(--primary)'
              } as React.CSSProperties}
              placeholder={`Min ${unit}`}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Maximum {unit}
          </label>
          <div className="relative">
            <input
              type="number"
              value={value.max}
              onChange={(e) => onChange({ ...value, max: parseFloat(e.target.value) || max })}
              min={min}
              max={max}
              step={step}
              className="w-full px-4 py-3 text-sm border-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:border-transparent"
              style={{ 
                backgroundColor: 'var(--input)', 
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                '--tw-ring-color': 'var(--primary)'
              } as React.CSSProperties}
              placeholder={`Max ${unit}`}
            />
          </div>
        </div>
      </div>
      
      {/* Quick Presets */}
      {unit === 'USD' && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Quick Select:
          </span>
          {[
            { label: 'Under $5K', min: 0, max: 5000 },
            { label: '$5K-$10K', min: 5000, max: 10000 },
            { label: '$10K-$25K', min: 10000, max: 25000 },
            { label: '$25K+', min: 25000, max: 100000 }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => onChange({ min: preset.min, max: preset.max })}
              className="px-3 py-1 text-xs rounded-full border transition-all hover:shadow-sm"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                color: 'var(--muted-foreground)'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
      
      {unit === 'ct' && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Popular Sizes:
          </span>
          {[
            { label: '0.5-1ct', min: 0.5, max: 1.0 },
            { label: '1-2ct', min: 1.0, max: 2.0 },
            { label: '2-3ct', min: 2.0, max: 3.0 },
            { label: '3ct+', min: 3.0, max: 10.0 }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => onChange({ min: preset.min, max: preset.max })}
              className="px-3 py-1 text-xs rounded-full border transition-all hover:shadow-sm"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                color: 'var(--muted-foreground)'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const caratRange = getCaratRange()

  return (
    <div className={`bg-white border-2 rounded-xl shadow-lg ${className}`} 
      style={{ 
        backgroundColor: 'var(--card)', 
        borderColor: 'var(--border)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Header */}
      <div className="p-6 border-b-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-xl" 
        style={{ 
          borderColor: 'var(--border)',
          background: 'linear-gradient(135deg, var(--muted)/20, var(--muted)/40)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)/10' }}>
              <Filter className="w-6 h-6" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 className="font-bold text-xl" style={{ color: 'var(--foreground)' }}>
                Diamond Filters
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Refine your diamond search with professional-grade filters
              </p>
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 hover:shadow-md"
            style={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)',
              color: 'var(--muted-foreground)'
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <FilterSection 
        title="Search & Identification" 
        sectionKey="search"
        badge="Essential"
        description="Find specific diamonds"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              placeholder="Search diamonds by any keyword..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:border-transparent"
              style={{ 
                backgroundColor: 'var(--input)', 
                borderColor: 'var(--border)', 
                color: 'var(--foreground)',
                '--tw-ring-color': 'var(--primary)'
              } as React.CSSProperties}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Report Number (e.g., GIA-1234567890)"
              value={filters.reportNumber}
              onChange={(e) => updateFilter('reportNumber', e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:border-transparent"
              style={{ 
                backgroundColor: 'var(--input)', 
                borderColor: 'var(--border)', 
                color: 'var(--foreground)',
                '--tw-ring-color': 'var(--primary)'
              } as React.CSSProperties}
            />
            <input
              type="text"
              placeholder="Stone ID / SKU"
              value={filters.stoneId}
              onChange={(e) => updateFilter('stoneId', e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:border-transparent"
              style={{ 
                backgroundColor: 'var(--input)', 
                borderColor: 'var(--border)', 
                color: 'var(--foreground)',
                '--tw-ring-color': 'var(--primary)'
              } as React.CSSProperties}
            />
          </div>
        </div>
      </FilterSection>

      {/* Basic Filters */}
      <FilterSection 
        title="Basic Properties" 
        sectionKey="basic"
        badge="Popular"
        description="Essential diamond characteristics"
      >
        <div className="space-y-6">
          {/* Shape */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Shape
            </label>
            <CategorizedShapeFilter
              selected={filters.shape}
              onChange={(values) => updateFilter('shape', values)}
            />
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <p className="text-blue-800 font-medium mb-1">� Industry Standard Shapes:</p>
              <p className="text-blue-700">
                <strong>Round</strong> dominates 60%+ of the market. <strong>Princess, Cushion, Emerald, Oval</strong> are the next most popular. 
                <strong>Modified cuts</strong> offer enhanced brilliance over traditional shapes.
              </p>
            </div>
          </div>

          {/* Carat Weight */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Carat Weight
            </label>
            <RangeFilter
              min={caratRange.min}
              max={caratRange.max}
              value={filters.caratWeight}
              onChange={(range) => updateFilter('caratWeight', range)}
              step={caratRange.step}
              unit="ct"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Color
            </label>
            <MultiSelectFilter
              options={DIAMOND_COLORS}
              selected={filters.color}
              onChange={(values) => updateFilter('color', values)}
              placeholder="Select colors"
            />
          </div>

          {/* Clarity */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Clarity
            </label>
            <MultiSelectFilter
              options={DIAMOND_CLARITY}
              selected={filters.clarity}
              onChange={(values) => updateFilter('clarity', values)}
              placeholder="Select clarity"
            />
          </div>

          {/* Cut */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Cut
            </label>
            <MultiSelectFilter
              options={CUT_GRADES}
              selected={filters.cut}
              onChange={(values) => updateFilter('cut', values)}
              placeholder="Select cut grades"
            />
          </div>
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection 
        title="Pricing" 
        sectionKey="price"
        badge="Market"
        description="Set your budget range"
      >
        <RangeFilter
          min={0}
          max={1000000}
          value={filters.priceRange}
          onChange={(range) => updateFilter('priceRange', range)}
          step={100}
          unit="USD"
        />
      </FilterSection>

      {/* Advanced Filters */}
      <FilterSection 
        title="Professional Filters" 
        sectionKey="advanced"
        badge="Expert"
        description="Industry-grade specifications"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certification */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Certification
              </label>
              <MultiSelectFilter
                options={CERTIFICATIONS}
                selected={filters.certification}
                onChange={(values) => updateFilter('certification', values)}
                placeholder="Select certifications"
              />
            </div>

            {/* Fluorescence */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Fluorescence
              </label>
              <MultiSelectFilter
                options={FLUORESCENCE_LEVELS}
                selected={filters.fluorescence}
                onChange={(values) => updateFilter('fluorescence', values)}
                placeholder="Select fluorescence"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Polish */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Polish
              </label>
              <MultiSelectFilter
                options={CUT_GRADES}
                selected={filters.polish}
                onChange={(values) => updateFilter('polish', values)}
                placeholder="Select polish grades"
              />
            </div>

            {/* Symmetry */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Symmetry
              </label>
              <MultiSelectFilter
                options={CUT_GRADES}
                selected={filters.symmetry}
                onChange={(values) => updateFilter('symmetry', values)}
                placeholder="Select symmetry grades"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
              Location
            </label>
            <MultiSelectFilter
              options={LOCATION_OPTIONS}
              selected={filters.location}
              onChange={(values) => updateFilter('location', values)}
              placeholder="Select locations"
            />
          </div>
        </div>
      </FilterSection>

      {/* Professional Filters */}
      <FilterSection title="Professional Filters" sectionKey="professional">
        <div className="space-y-4">
          {/* Girdle */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Girdle
            </label>
            <MultiSelectFilter
              options={GIRDLE_OPTIONS}
              selected={filters.girdle}
              onChange={(values) => updateFilter('girdle', values)}
              placeholder="Select girdle types"
            />
          </div>

          {/* Culet */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Culet
            </label>
            <MultiSelectFilter
              options={CULET_OPTIONS}
              selected={filters.culet}
              onChange={(values) => updateFilter('culet', values)}
              placeholder="Select culet sizes"
            />
          </div>

          {/* Treatment */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Treatment
            </label>
            <MultiSelectFilter
              options={TREATMENT_OPTIONS}
              selected={filters.treatment}
              onChange={(values) => updateFilter('treatment', values)}
              placeholder="Select treatments"
            />
          </div>

          {/* Milkyness */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Milkyness
            </label>
            <MultiSelectFilter
              options={MILKYNESS_OPTIONS}
              selected={filters.milkyness}
              onChange={(values) => updateFilter('milkyness', values)}
              placeholder="Select milkyness levels"
            />
          </div>

          {/* Matching Pairs */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Matching Pairs Available
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="matching"
                  checked={filters.matching === true}
                  onChange={() => updateFilter('matching', true)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="matching"
                  checked={filters.matching === false}
                  onChange={() => updateFilter('matching', false)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>No</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="matching"
                  checked={filters.matching === null}
                  onChange={() => updateFilter('matching', null)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>Any</span>
              </label>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Price & Market */}
      <FilterSection title="Price & Market" sectionKey="market">
        <div className="space-y-4">
          {/* Price per Carat */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Price per Carat
            </label>
            <RangeFilter
              min={0}
              max={50000}
              value={filters.pricePerCarat}
              onChange={(range) => updateFilter('pricePerCarat', range)}
              step={100}
              unit="$/ct"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Availability
            </label>
            <MultiSelectFilter
              options={AVAILABILITY_OPTIONS}
              selected={filters.availability}
              onChange={(values) => updateFilter('availability', values)}
              placeholder="Select availability"
            />
          </div>

          {/* Delivery */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Delivery Time
            </label>
            <MultiSelectFilter
              options={DELIVERY_OPTIONS}
              selected={filters.delivery}
              onChange={(values) => updateFilter('delivery', values)}
              placeholder="Select delivery times"
            />
          </div>
        </div>
      </FilterSection>

      {/* Optical Properties */}
      <FilterSection title="Optical Properties" sectionKey="optical">
        <div className="space-y-4">
          {/* Brilliance */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Brilliance
            </label>
            <MultiSelectFilter
              options={OPTICAL_PROPERTIES}
              selected={filters.brilliance}
              onChange={(values) => updateFilter('brilliance', values)}
              placeholder="Select brilliance grades"
            />
          </div>

          {/* Fire */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Fire
            </label>
            <MultiSelectFilter
              options={OPTICAL_PROPERTIES}
              selected={filters.fire}
              onChange={(values) => updateFilter('fire', values)}
              placeholder="Select fire grades"
            />
          </div>

          {/* Scintillation */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Scintillation
            </label>
            <MultiSelectFilter
              options={OPTICAL_PROPERTIES}
              selected={filters.scintillation}
              onChange={(values) => updateFilter('scintillation', values)}
              placeholder="Select scintillation grades"
            />
          </div>
        </div>
      </FilterSection>

      

      {/* Lab-Grown Specific */}
      {(diamondType === 'lab-grown-single' || diamondType === 'lab-grown-melee') && (
        <FilterSection 
          title="Lab-Grown Properties" 
          sectionKey="labgrown"
          badge="Lab-Grown"
          description="Synthetic diamond growth methods"
        >
          <div className="space-y-6">
            {/* Growth Method */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Growth Method (CVD / HPHT)
              </label>
              <MultiSelectFilter
                options={GROWN_METHODS}
                selected={filters.grownMethod}
                onChange={(values) => updateFilter('grownMethod', values)}
                placeholder="Select growth methods (CVD or HPHT)"
              />
              <div className="mt-3 p-3 rounded-lg border" style={{ 
                backgroundColor: 'var(--muted)/30', 
                borderColor: 'var(--border)'
              }}>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--primary)' }}>
                  🌱 Growth Methods Available:
                </p>
                <div className="space-y-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <p><strong>CVD (Chemical Vapor Deposition)</strong>: Layer-by-layer growth method, often more affordable and produces high-quality diamonds.</p>
                  <p><strong>HPHT (High Pressure, High Temperature)</strong>: Mimics natural formation conditions, creates more cubic crystals with excellent clarity.</p>
                </div>
              </div>
            </div>
          </div>
        </FilterSection>
      )}

      {/* Measurements */}
      <FilterSection title="Measurements" sectionKey="measurements">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Length (mm)
            </label>
            <RangeFilter
              min={0}
              max={20}
              value={filters.measurements.length}
              onChange={(range) => updateFilter('measurements', { ...filters.measurements, length: range })}
              step={0.1}
              unit="mm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Width (mm)
            </label>
            <RangeFilter
              min={0}
              max={20}
              value={filters.measurements.width}
              onChange={(range) => updateFilter('measurements', { ...filters.measurements, width: range })}
              step={0.1}
              unit="mm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Depth (mm)
            </label>
            <RangeFilter
              min={0}
              max={15}
              value={filters.measurements.depth}
              onChange={(range) => updateFilter('measurements', { ...filters.measurements, depth: range })}
              step={0.1}
              unit="mm"
            />
          </div>
        </div>
      </FilterSection>

      {/* Percentages */}
      <FilterSection title="Percentages" sectionKey="percentages">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Table %
            </label>
            <RangeFilter
              min={40}
              max={80}
              value={filters.tablePercent}
              onChange={(range) => updateFilter('tablePercent', range)}
              step={0.1}
              unit="%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Depth %
            </label>
            <RangeFilter
              min={50}
              max={80}
              value={filters.depthPercent}
              onChange={(range) => updateFilter('depthPercent', range)}
              step={0.1}
              unit="%"
            />
          </div>
        </div>
      </FilterSection>
    </div>
  )
}
