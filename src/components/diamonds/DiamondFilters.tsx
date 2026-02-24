
'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

// Simple Expand/Collapse component
function Expand({ label, children, defaultOpen = true }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
      <button
        type="button"
        className="w-full flex items-center justify-between py-2 text-left font-medium text-sm focus:outline-none bg-transparent transition-colors hover:opacity-80"
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

  // Fancy Color filters
  fancyColor: string[]
  fancyIntensity: string[]
  fancyOvertone: string[]

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
const shapeIconMap: Record<string, React.ComponentType<{ width?: number; height?: number }>> = {
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

const TREATMENT_OPTIONS = ['None', 'Laser Drilling', 'Fracture Filling', 'HPHT', 'Irradiation', 'Coating']

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

  const updateFilter = (key: keyof DiamondFilterValues, value: unknown) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
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
                      selected.includes(shape) ? 'shadow-sm' : ''
                    }`}
                    style={{
                      backgroundColor: selected.includes(shape) ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'var(--card)',
                      borderColor: selected.includes(shape) ? 'var(--primary)' : 'var(--border)',
                      color: selected.includes(shape) ? 'var(--primary)' : 'var(--foreground)'
                    }}
                    onMouseEnter={(e) => {
                      if (!selected.includes(shape)) {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected.includes(shape)) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }
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
        <div className="flex items-center justify-between p-3 rounded-lg border" 
          style={{ 
            backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)', 
            borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)' 
          }}
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
      <div className={`${layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'} max-h-80 overflow-y-auto custom-scrollbar`}>
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border transition-all duration-75 group focus-within:ring-0 ${selected.includes(option) ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: selected.includes(option) ? 'color-mix(in srgb, var(--status-warning) 10%, transparent)' : 'var(--card)',
              borderColor: selected.includes(option) ? 'var(--status-warning)' : 'var(--border)',
            }}
            onMouseEnter={(e) => {
              if (!selected.includes(option)) {
                e.currentTarget.style.borderColor = 'var(--status-warning)';
              }
            }}
            onMouseLeave={(e) => {
              if (!selected.includes(option)) {
                e.currentTarget.style.borderColor = 'var(--border)';
              }
            }}
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
                className="peer appearance-none w-4 h-4 border rounded focus:outline-none transition-all duration-75"
                style={{ 
                  minWidth: 16, 
                  minHeight: 16,
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--card)'
                }}
                tabIndex={-1}
              />
              <div 
                className="absolute inset-0 rounded pointer-events-none transition-all duration-75 scale-0 peer-checked:scale-100"
                style={{ backgroundColor: 'var(--status-warning)' }}
              />
              <svg
                className="pointer-events-none absolute left-0 top-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-75 z-10"
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
            <span className={`text-sm font-medium transition-colors duration-150 ${selected.includes(option) ? 'font-semibold' : ''}`}
              style={{ color: selected.includes(option) ? 'var(--status-warning)' : 'var(--foreground)' }}
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
            className="w-full px-2 py-2 text-xs border rounded-md focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all outline-none"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
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
            className="w-full px-2 py-2 text-xs border rounded-md focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all outline-none"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
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
              className="px-2 py-0.5 text-xs rounded-full border transition-all"
              style={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)', 
                color: 'var(--muted-foreground)' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 5%, transparent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--muted-foreground)';
                e.currentTarget.style.backgroundColor = 'var(--card)';
              }}
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
              className="px-2 py-0.5 text-xs rounded-full border transition-all"
              style={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)', 
                color: 'var(--muted-foreground)' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--primary) 5%, transparent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--muted-foreground)';
                e.currentTarget.style.backgroundColor = 'var(--card)';
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  // Get carat range based on diamond type
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
        />
      </Expand>

      <Expand label="Clarity">
        <MultiSelectFilter
          options={DIAMOND_CLARITY}
          selected={filters.clarity}
          onChange={(values) => updateFilter('clarity', values)}
        />
      </Expand>

      <Expand label="Cut">
        <MultiSelectFilter
          options={CUT_GRADES}
          selected={filters.cut}
          onChange={(values) => updateFilter('cut', values)}
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
        />
      </Expand>

      <Expand label="Fluorescence">
        <MultiSelectFilter
          options={FLUORESCENCE_LEVELS}
          selected={filters.fluorescence}
          onChange={(values) => updateFilter('fluorescence', values)}
        />
      </Expand>

      <Expand label="Polish">
        <MultiSelectFilter
          options={CUT_GRADES}
          selected={filters.polish}
          onChange={(values) => updateFilter('polish', values)}
        />
      </Expand>

      <Expand label="Symmetry">
        <MultiSelectFilter
          options={CUT_GRADES}
          selected={filters.symmetry}
          onChange={(values) => updateFilter('symmetry', values)}
        />
      </Expand>

      <Expand label="Location">
        <MultiSelectFilter
          options={LOCATION_OPTIONS}
          selected={filters.location}
          onChange={(values) => updateFilter('location', values)}
        />
      </Expand>

      <Expand label="Girdle">
        <MultiSelectFilter
          options={GIRDLE_OPTIONS}
          selected={filters.girdle}
          onChange={(values) => updateFilter('girdle', values)}
        />
      </Expand>

      <Expand label="Culet">
        <MultiSelectFilter
          options={CULET_OPTIONS}
          selected={filters.culet}
          onChange={(values) => updateFilter('culet', values)}
        />
      </Expand>

      <Expand label="Treatment">
        <MultiSelectFilter
          options={TREATMENT_OPTIONS}
          selected={filters.treatment}
          onChange={(values) => updateFilter('treatment', values)}
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
