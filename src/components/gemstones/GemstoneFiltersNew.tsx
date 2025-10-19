'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface GemstoneFilterValues {
  // Basic filters
  gemstoneType: string[]
  caratWeight: { min: number; max: number }
  color: string[]
  clarity: string[]
  cut: string[]
  priceRange: { min: number; max: number }

  // Advanced filters
  certification: string[]
  origin: string[]
  treatment: string[]
  enhancement: string[]
  transparency: string[]
  luster: string[]
  phenomena: string[]
  
  // Location & Seller
  location: string[]
  companyName: string
  vendorLocation: string
  reportNumber: string
  searchTerm: string
}

interface GemstoneFiltersProps {
  filters: GemstoneFilterValues
  onFiltersChange: (filters: GemstoneFilterValues) => void
  gemstoneType: 'single' | 'melee'
  className?: string
}

const GEMSTONE_TYPES = [
  'Ruby', 'Sapphire', 'Emerald', 'Spinel', 'Tourmaline', 'Garnet', 
  'Topaz', 'Aquamarine', 'Tanzanite', 'Opal', 'Peridot', 'Amethyst', 
  'Citrine', 'Morganite', 'Zircon', 'Alexandrite', 'Paraiba', 'Padparadscha',
  'Tsavorite', 'Demantoid', 'Mandarin Garnet', 'Other'
]

const GEMSTONE_COLORS = [
  'Red', 'Pink', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Violet', 
  'Brown', 'Black', 'White', 'Colorless', 'Multi-color', 'Color-Change'
]

const GEMSTONE_SHAPES = [
  'Oval', 'Round', 'Cushion', 'Pear', 'Emerald', 'Marquise', 'Heart', 
  'Princess', 'Trillion', 'Octagon', 'Cabochon', 'Baguette', 'Other'
]

const GEMSTONE_CLARITY = [
  'Eye Clean', 'Slightly Included', 'Included', 'Heavily Included',
  'IF', 'VVS', 'VS', 'SI', 'I', 'Translucent', 'Opaque'
]

const CERTIFICATIONS = ['GIA', 'IGI', 'AGL', 'Gübelin', 'SSEF', 'GRS', 'GIT', 'NGTC', 'Other']

const ORIGINS = [
  'Burma', 'Ceylon', 'Kashmir', 'Madagascar', 'Mozambique', 'Thailand', 
  'Brazil', 'Tanzania', 'Afghanistan', 'Pakistan', 'Zambia', 'Colombia', 'Other'
]

const TREATMENTS = ['Natural', 'Heat Treated', 'Oil Treated', 'Irradiated', 'Diffused', 'Other']

export default function GemstoneFilters({ 
  filters, 
  onFiltersChange, 
  gemstoneType,
  className = '' 
}: GemstoneFiltersProps) {
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

  const updateFilter = (key: keyof GemstoneFilterValues, value: GemstoneFilterValues[keyof GemstoneFilterValues]) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  // Commented out unused resetFilters function - uncomment if needed
  // const resetFilters = () => {
  //   const defaultFilters: GemstoneFilterValues = {
  //     gemstoneType: [],
  //     caratWeight: { 
  //       min: gemstoneType === 'melee' ? 0.01 : 0.1, 
  //       max: gemstoneType === 'melee' ? 5 : 20 
  //     },
  //     color: [],
  //     clarity: [],
  //     cut: [],
  //     priceRange: { min: 0, max: 100000 },
  //     certification: [],
  //     origin: [],
  //     treatment: [],
  //     enhancement: [],
  //     transparency: [],
  //     luster: [],
  //     phenomena: [],
  //     location: [],
  //     companyName: '',
  //     vendorLocation: '',
  //     reportNumber: '',
  //     searchTerm: ''
  //   }
  //   onFiltersChange(defaultFilters)
  // }

  const getCaratRange = () => {
    switch (gemstoneType) {
      case 'melee':
        return { min: 0.01, max: 5, step: 0.01 }
      default:
        return { min: 0.1, max: 20, step: 0.1 }
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

  const MultiSelectFilter = ({ 
    options, 
    selected, 
    onChange,
    layout = 'grid'
  }: { 
    options: string[]
    selected: string[]
    onChange: (values: string[]) => void
    layout?: 'grid' | 'list'
  }) => {
    const toggleOption = (option: string) => {
      if (selected.includes(option)) {
        onChange(selected.filter(item => item !== option))
      } else {
        onChange([...selected, option])
      }
    }

    return (
      <div className="space-y-2">
        <div className={layout === 'grid' ? 'grid grid-cols-2 gap-1' : 'space-y-1'}>
          {options.map(option => (
            <label
              key={option}
              className={`group cursor-pointer flex items-center space-x-2 p-2 rounded-lg border transition-all duration-150 hover:shadow-sm ${
                selected.includes(option)
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-200'
              }`}
            >
              <span className={`relative flex items-center justify-center w-4 h-4 rounded border-2 transition-all duration-150 ${
                selected.includes(option)
                  ? 'border-amber-500 bg-amber-500'
                  : 'border-gray-300 group-hover:border-amber-400'
              }`}>
                {selected.includes(option) && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="5 11 9 15 15 7" />
                  </svg>
                )}
              </span>
              <span className={`text-sm font-medium transition-colors duration-150 ${
                selected.includes(option) ? 'text-amber-700 font-semibold' : 'text-gray-700 group-hover:text-amber-700'
              }`}>
                {option}
              </span>
            </label>
          ))}
        </div>
        
        {options.length === 0 && (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            <p className="text-sm">No options available</p>
          </div>
        )}
      </div>
    )
  }

  const RangeFilter = ({ 
    min, 
    max, 
    value, 
    onChange, 
    step = 1, 
    unit = ''
  }: { 
    min: number
    max: number
    value: { min: number; max: number }
    onChange: (range: { min: number; max: number }) => void
    step?: number
    unit?: string
  }) => (
    <div className="space-y-2">
      {/* Current Range Display */}
      <div className="flex items-center justify-between px-1 py-1">
        <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
          Current Range:
        </span>
        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
          {unit === 'USD' ? `$${value.min.toLocaleString()} - $${value.max.toLocaleString()}` : 
           `${value.min.toLocaleString()}${unit} - ${value.max.toLocaleString()}${unit}`}
        </span>
      </div>
      
      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Minimum {unit === 'USD' ? '' : unit}
          </label>
          <input
            type="number"
            value={value.min}
            onChange={(e) => onChange({ ...value, min: parseFloat(e.target.value) || min })}
            min={min}
            max={max}
            step={step}
            className="w-full px-2 py-2 text-xs border rounded-md focus:ring-1 focus:ring-amber-400 focus:border-amber-400 bg-white transition-all"
            style={{ color: 'var(--foreground)' }}
            placeholder={unit === 'USD' ? 'Min $' : `Min ${unit}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Maximum {unit === 'USD' ? '' : unit}
          </label>
          <input
            type="number"
            value={value.max}
            onChange={(e) => onChange({ ...value, max: parseFloat(e.target.value) || max })}
            min={min}
            max={max}
            step={step}
            className="w-full px-2 py-2 text-xs border rounded-md focus:ring-1 focus:ring-amber-400 focus:border-amber-400 bg-white transition-all"
            style={{ color: 'var(--foreground)' }}
            placeholder={unit === 'USD' ? 'Max $' : `Max ${unit}`}
          />
        </div>
      </div>
      
      {/* Quick Presets for Price */}
      {unit === 'USD' && (
        <div className="flex flex-wrap gap-1 items-center mt-1">
          <span className="text-xs font-medium mr-1" style={{ color: 'var(--muted-foreground)' }}>
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
              className="px-2 py-0.5 text-xs rounded-full border border-gray-300 bg-white hover:bg-amber-50 transition-all"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
      
      {/* Quick Presets for Carat */}
      {unit === 'ct' && (
        <div className="flex flex-wrap gap-1 items-center mt-1">
          <span className="text-xs font-medium mr-1" style={{ color: 'var(--muted-foreground)' }}>
            Popular Sizes:
          </span>
          {(gemstoneType === 'melee' ? [
            { label: '0.01-0.1ct', min: 0.01, max: 0.1 },
            { label: '0.1-0.5ct', min: 0.1, max: 0.5 },
            { label: '0.5-1ct', min: 0.5, max: 1.0 },
            { label: '1ct+', min: 1.0, max: 5.0 }
          ] : [
            { label: '0.5-1ct', min: 0.5, max: 1.0 },
            { label: '1-2ct', min: 1.0, max: 2.0 },
            { label: '2-5ct', min: 2.0, max: 5.0 },
            { label: '5ct+', min: 5.0, max: 20.0 }
          ]).map((preset) => (
            <button
              key={preset.label}
              onClick={() => onChange({ min: preset.min, max: preset.max })}
              className="px-2 py-0.5 text-xs rounded-full border border-gray-300 bg-white hover:bg-amber-50 transition-all"
              style={{ color: 'var(--muted-foreground)' }}
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
    <div className={`space-y-0 ${className || ''}`}
      style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0 }}
    >
      {/* Basic Filters */}
      <FilterSection
        title="Gemstone Type"
        sectionKey="basic"
        badge={filters.gemstoneType.length > 0 ? `${filters.gemstoneType.length}` : undefined}
        description="Select gemstone varieties"
      >
        <MultiSelectFilter
          options={GEMSTONE_TYPES}
          selected={filters.gemstoneType}
          onChange={(values) => updateFilter('gemstoneType', values)}
          layout="grid"
        />
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        sectionKey="price"
        description="Set your budget"
      >
        <RangeFilter
          min={0}
          max={100000}
          value={filters.priceRange}
          onChange={(range) => updateFilter('priceRange', range)}
          step={500}
          unit="USD"
        />
      </FilterSection>

      {/* Carat Weight */}
      <FilterSection
        title="Carat Weight"
        sectionKey="carat"
        description={gemstoneType === 'melee' ? 'Small gemstones' : 'Single gemstones'}
      >
        <RangeFilter
          min={caratRange.min}
          max={caratRange.max}
          value={filters.caratWeight}
          onChange={(range) => updateFilter('caratWeight', range)}
          step={caratRange.step}
          unit="ct"
        />
      </FilterSection>

      {/* Color */}
      <FilterSection
        title="Color"
        sectionKey="color"
        badge={filters.color.length > 0 ? `${filters.color.length}` : undefined}
      >
        <MultiSelectFilter
          options={GEMSTONE_COLORS}
          selected={filters.color}
          onChange={(values) => updateFilter('color', values)}
          layout="grid"
        />
      </FilterSection>

      {/* Shape/Cut */}
      <FilterSection
        title="Shape/Cut"
        sectionKey="cut"
        badge={filters.cut.length > 0 ? `${filters.cut.length}` : undefined}
      >
        <MultiSelectFilter
          options={GEMSTONE_SHAPES}
          selected={filters.cut}
          onChange={(values) => updateFilter('cut', values)}
          layout="grid"
        />
      </FilterSection>

      {/* Clarity */}
      <FilterSection
        title="Clarity"
        sectionKey="clarity"
        badge={filters.clarity.length > 0 ? `${filters.clarity.length}` : undefined}
      >
        <MultiSelectFilter
          options={GEMSTONE_CLARITY}
          selected={filters.clarity}
          onChange={(values) => updateFilter('clarity', values)}
          layout="list"
        />
      </FilterSection>

      {/* Origin */}
      <FilterSection
        title="Origin"
        sectionKey="origin"
        badge={filters.origin.length > 0 ? `${filters.origin.length}` : undefined}
      >
        <MultiSelectFilter
          options={ORIGINS}
          selected={filters.origin}
          onChange={(values) => updateFilter('origin', values)}
          layout="grid"
        />
      </FilterSection>

      {/* Treatment */}
      <FilterSection
        title="Treatment"
        sectionKey="treatment"
        badge={filters.treatment.length > 0 ? `${filters.treatment.length}` : undefined}
      >
        <MultiSelectFilter
          options={TREATMENTS}
          selected={filters.treatment}
          onChange={(values) => updateFilter('treatment', values)}
          layout="list"
        />
      </FilterSection>

      {/* Certification */}
      <FilterSection
        title="Certification"
        sectionKey="certification"
        badge={filters.certification.length > 0 ? `${filters.certification.length}` : undefined}
      >
        <MultiSelectFilter
          options={CERTIFICATIONS}
          selected={filters.certification}
          onChange={(values) => updateFilter('certification', values)}
          layout="grid"
        />
      </FilterSection>
    </div>
  )
}
