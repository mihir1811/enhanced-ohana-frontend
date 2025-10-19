'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

// Simple Expand/Collapse component - exactly matching DiamondFilters
function Expand({ label, children, defaultOpen = true }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        className="w-full flex items-center justify-between py-2 text-left font-medium text-sm focus:outline-none bg-transparent"
        style={{ color: 'var(--foreground)', paddingLeft: 0, paddingRight: 0 }}
        onClick={() => setOpen(o => !o)}
      >
        <span>{label}</span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="py-2">{children}</div>}
    </div>
  );
}

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
  'Ruby', 'Sapphire', 'Emerald', 'Spinel', 'Tourmaline', 'Garnet', 'Topaz', 'Aquamarine', 'Tanzanite', 'Opal', 'Peridot', 'Amethyst', 'Citrine', 'Morganite', 'Zircon', 'Alexandrite', 'Other'
];



const GEMSTONE_CLARITY = [
  'IF', 'VVS', 'VS', 'SI', 'I', 'Translucent', 'Opaque', 'Eye Clean', 'Included', 'Other'
];

const GEMSTONE_CUTS = [
  'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Cabochon', 'Step', 'Brilliant', 'Mixed', 'Rose', 'Other'
];

const GEMSTONE_TREATMENTS = [
  'None', 'Heated', 'Oiled', 'Irradiated', 'Diffused', 'Fracture Filled', 'Dyed', 'Bleached', 'Coated', 'Other'
];

const GEMSTONE_CERTIFICATIONS = [
  'GIA', 'IGI', 'Gübelin', 'SSEF', 'GRS', 'AGL', 'GIT', 'NGTC', 'Other'
];



const GEMSTONE_ORIGINS = [
  'Burma', 'Sri Lanka', 'Madagascar', 'Mozambique', 'Colombia', 'Brazil', 'Thailand', 'Tanzania', 'Afghanistan', 'Pakistan', 'Zambia', 'Other'
];

export default function GemstoneFilters({ filters, onFiltersChange, gemstoneType, className = '' }: GemstoneFiltersProps) {
  
  // Helper function to update filters
  const updateFilter = <K extends keyof GemstoneFilterValues>(key: K, value: GemstoneFilterValues[K]) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  // Multi-select filter component matching DiamondFilters exactly
  const MultiSelectFilter = ({ 
    options, 
    selected, 
    onChange, 
    layout = 'grid'
  }: { 
    options: string[]
    selected: string[]
    onChange: (values: string[]) => void
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
      <div className={`${layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'} max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-amber-200`}>
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border transition-all duration-75 group focus-within:ring-0 ${selected.includes(option) ? 'border-amber-500 bg-amber-50' : 'border-gray-200 bg-gray-50 hover:border-amber-300'}
            `}
            tabIndex={0}
          >
            <span className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={e => {
                  if (e.target.checked) {
                    onChange([...selected, option])
                  } else {
                    onChange(selected.filter(v => v !== option))
                  }
                }}
                className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded focus:outline-none checked:bg-amber-500 checked:border-amber-500 focus:ring-2 focus:ring-amber-300 transition-all duration-75"
                style={{ minWidth: 16, minHeight: 16 }}
                tabIndex={-1}
              />
              <svg
                className="pointer-events-none absolute left-0 top-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-75"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="5 11 9 15 15 7" />
              </svg>
            </span>
            <span className={`text-sm font-medium transition-colors duration-150 ${selected.includes(option) ? 'text-amber-700 font-semibold' : 'text-gray-700 group-hover:text-amber-700'}`}>
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

  // Range filter component matching DiamondFilters exactly
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
            className="w-full px-2 py-2 text-xs border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
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
            className="w-full px-2 py-2 text-xs border rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all"
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

  return (
    <div className={`space-y-0 ${className}`}>
      {/* Price Range */}
      <Expand label="Price Range">
        <RangeFilter
          min={0}
          max={100000}
          value={filters.priceRange}
          onChange={(range) => updateFilter('priceRange', range)}
          step={100}
          unit="USD"
        />
      </Expand>

      {/* Gemstone Type */}
      <Expand label="Gemstone Type">
        <MultiSelectFilter
          options={GEMSTONE_TYPES}
          selected={filters.gemstoneType}
          onChange={(values) => updateFilter('gemstoneType', values)}
          layout="grid"
        />
      </Expand>

      {/* Carat Weight */}
      <Expand label="Carat Weight">
        <RangeFilter
          min={gemstoneType === 'melee' ? 0.01 : 0.1}
          max={gemstoneType === 'melee' ? 5 : 20}
          value={filters.caratWeight}
          onChange={(range) => updateFilter('caratWeight', range)}
          step={gemstoneType === 'melee' ? 0.01 : 0.1}
          unit="ct"
        />
      </Expand>

      {/* Cut */}
      <Expand label="Cut">
        <MultiSelectFilter
          options={GEMSTONE_CUTS}
          selected={filters.cut}
          onChange={(values) => updateFilter('cut', values)}
          layout="grid"
        />
      </Expand>

      {/* Clarity */}
      <Expand label="Clarity">
        <MultiSelectFilter
          options={GEMSTONE_CLARITY}
          selected={filters.clarity}
          onChange={(values) => updateFilter('clarity', values)}
          layout="grid"
        />
      </Expand>

      {/* Origin */}
      <Expand label="Origin">
        <MultiSelectFilter
          options={GEMSTONE_ORIGINS}
          selected={filters.origin}
          onChange={(values) => updateFilter('origin', values)}
          layout="grid"
        />
      </Expand>

      {/* Treatment */}
      <Expand label="Treatment">
        <MultiSelectFilter
          options={GEMSTONE_TREATMENTS}
          selected={filters.treatment}
          onChange={(values) => updateFilter('treatment', values)}
          layout="grid"
        />
      </Expand>

      {/* Certificate */}
      <Expand label="Certificate">
        <MultiSelectFilter
          options={GEMSTONE_CERTIFICATIONS}
          selected={filters.certification}
          onChange={(values) => updateFilter('certification', values)}
          layout="grid"
        />
      </Expand>
    </div>
  );
}
