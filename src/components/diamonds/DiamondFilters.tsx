
'use client'
import { useState } from 'react'
import { Search, Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'

// Simple Expand/Collapse component
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

  // Price & Market
  pricePerCarat: { min: number; max: number }
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
      girdle: [],
      culet: [],
      origin: [],
      treatment: [],
      pricePerCarat: { min: 0, max: 10000 }
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
    <div className="space-y-2">
      {/* Current Range Display */}
      <div className="flex items-center justify-between px-1 py-1">
        <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
          Current Range:
        </span>
        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
          {value.min.toLocaleString()}{unit} - {value.max.toLocaleString()}{unit}
        </span>
      </div>
      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Minimum {unit}
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
            placeholder={`Min ${unit}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>
            Maximum {unit}
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
            placeholder={`Max ${unit}`}
          />
        </div>
      </div>
      {/* Quick Presets */}
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
              className="px-2 py-0.5 text-xs rounded-full border border-gray-300 bg-white hover:bg-blue-50 transition-all"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
      {unit === 'ct' && (
        <div className="flex flex-wrap gap-1 items-center mt-1">
          <span className="text-xs font-medium mr-1" style={{ color: 'var(--muted-foreground)' }}>
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
              className="px-2 py-0.5 text-xs rounded-full border border-gray-300 bg-white hover:bg-blue-50 transition-all"
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
      {/* <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>
          Filters
        </h2>
        <button
          onClick={resetFilters}
          className="text-xs text-blue-600 hover:underline px-1 py-0.5 rounded"
          style={{ background: 'none', border: 'none' }}
        >
          Reset All
        </button>
      </div> */}

      <Expand label="Shape">
        <CategorizedShapeFilter
          selected={filters.shape}
          onChange={(values) => updateFilter('shape', values)}
        />
      </Expand>

      <Expand label="Carat Weight">
        <RangeFilter
          min={caratRange.min}
          max={caratRange.max}
          value={filters.caratWeight}
          onChange={(range) => updateFilter('caratWeight', range)}
          step={caratRange.step}
          unit="ct"
        />
      </Expand>

      <Expand label="Color">
        <MultiSelectFilter
          options={DIAMOND_COLORS}
          selected={filters.color}
          onChange={(values) => updateFilter('color', values)}
          placeholder="Select colors"
        />
      </Expand>

      <Expand label="Clarity">
        <MultiSelectFilter
          options={DIAMOND_CLARITY}
          selected={filters.clarity}
          onChange={(values) => updateFilter('clarity', values)}
          placeholder="Select clarity"
        />
      </Expand>

      <Expand label="Cut">
        <MultiSelectFilter
          options={CUT_GRADES}
          selected={filters.cut}
          onChange={(values) => updateFilter('cut', values)}
          placeholder="Select cut grades"
        />
      </Expand>

      <Expand label="Price Range">
        <RangeFilter
          min={0}
          max={1000000}
          value={filters.priceRange}
          onChange={(range) => updateFilter('priceRange', range)}
          step={100}
          unit="USD"
        />
      </Expand>

      <Expand label="Certification">
        <MultiSelectFilter
          options={CERTIFICATIONS}
          selected={filters.certification}
          onChange={(values) => updateFilter('certification', values)}
          placeholder="Select certifications"
        />
      </Expand>

      <Expand label="Fluorescence">
        <MultiSelectFilter
          options={FLUORESCENCE_LEVELS}
          selected={filters.fluorescence}
          onChange={(values) => updateFilter('fluorescence', values)}
          placeholder="Select fluorescence"
        />
      </Expand>

      <Expand label="Polish">
        <MultiSelectFilter
          options={CUT_GRADES}
          selected={filters.polish}
          onChange={(values) => updateFilter('polish', values)}
          placeholder="Select polish grades"
        />
      </Expand>

      <Expand label="Symmetry">
        <MultiSelectFilter
          options={CUT_GRADES}
          selected={filters.symmetry}
          onChange={(values) => updateFilter('symmetry', values)}
          placeholder="Select symmetry grades"
        />
      </Expand>

      <Expand label="Location">
        <MultiSelectFilter
          options={LOCATION_OPTIONS}
          selected={filters.location}
          onChange={(values) => updateFilter('location', values)}
          placeholder="Select locations"
        />
      </Expand>

      <Expand label="Girdle">
        <MultiSelectFilter
          options={GIRDLE_OPTIONS}
          selected={filters.girdle}
          onChange={(values) => updateFilter('girdle', values)}
          placeholder="Select girdle types"
        />
      </Expand>

      <Expand label="Culet">
        <MultiSelectFilter
          options={CULET_OPTIONS}
          selected={filters.culet}
          onChange={(values) => updateFilter('culet', values)}
          placeholder="Select culet sizes"
        />
      </Expand>

      <Expand label="Treatment">
        <MultiSelectFilter
          options={TREATMENT_OPTIONS}
          selected={filters.treatment}
          onChange={(values) => updateFilter('treatment', values)}
          placeholder="Select treatments"
        />
      </Expand>

      <Expand label="Price per Carat">
        <RangeFilter
          min={0}
          max={50000}
          value={filters.pricePerCarat}
          onChange={(range) => updateFilter('pricePerCarat', range)}
          step={100}
          unit="$/ct"
        />
      </Expand>

      <Expand label="Length (mm)">
        <RangeFilter
          min={0}
          max={20}
          value={filters.measurements.length}
          onChange={(range) => updateFilter('measurements', { ...filters.measurements, length: range })}
          step={0.1}
          unit="mm"
        />
      </Expand>
      <Expand label="Width (mm)">
        <RangeFilter
          min={0}
          max={20}
          value={filters.measurements.width}
          onChange={(range) => updateFilter('measurements', { ...filters.measurements, width: range })}
          step={0.1}
          unit="mm"
        />
      </Expand>
      <Expand label="Depth (mm)">
        <RangeFilter
          min={0}
          max={15}
          value={filters.measurements.depth}
          onChange={(range) => updateFilter('measurements', { ...filters.measurements, depth: range })}
          step={0.1}
          unit="mm"
        />
      </Expand>
      <Expand label="Table %">
        <RangeFilter
          min={40}
          max={80}
          value={filters.tablePercent}
          onChange={(range) => updateFilter('tablePercent', range)}
          step={0.1}
          unit="%"
        />
      </Expand>
      <Expand label="Depth %">
        <RangeFilter
          min={50}
          max={80}
          value={filters.depthPercent}
          onChange={(range) => updateFilter('depthPercent', range)}
          step={0.1}
          unit="%"
        />
      </Expand>
    </div>
  )
}
