'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { ChevronDown, X, Filter, MousePointer2, CheckSquare } from 'lucide-react'
import Slider from 'rc-slider'

// --- Standardized Components (Diamond Style) ---

const FilterSection = ({ title, children, actions, id, expandedSections, onToggle }: { 
  title: string; 
  children: React.ReactNode; 
  actions?: React.ReactNode;
  id: string;
  expandedSections: string[];
  onToggle: (id: string) => void;
}) => {
  const isExpanded = expandedSections.includes(id);
  
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-5 mb-5 last:border-0">
      <div 
        className="flex items-center justify-between mb-3 cursor-pointer group"
        onClick={() => onToggle(id)}
      >
        <h3 className="text-sm font-bold tracking-wide text-gray-900 dark:text-gray-100 uppercase flex items-center gap-2">
          {title}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </h3>
        {actions && <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>{actions}</div>}
      </div>
      {isExpanded && <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">{children}</div>}
    </div>
  )
}

const SelectedOptionsDisplay = React.memo(({
  selected,
  label,
  onRemove,
  colorVariant = 'yellow'
}: {
  selected: string[]
  label: string
  onRemove: (value: string) => void
  colorVariant?: 'blue' | 'green' | 'purple' | 'yellow' | 'orange'
}) => {
  const colorConfig = useMemo(() => ({
    blue: {
      bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      border: 'border-blue-300 dark:border-blue-700',
      text: 'text-blue-800 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
      badge: 'border-blue-400 dark:border-blue-600'
    },
    green: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-300 dark:border-green-700',
      text: 'text-green-800 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400',
      badge: 'border-green-400 dark:border-green-600'
    },
    purple: {
      bg: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      border: 'border-purple-300 dark:border-purple-700',
      text: 'text-purple-800 dark:text-purple-300',
      icon: 'text-purple-600 dark:text-purple-400',
      badge: 'border-purple-400 dark:border-purple-600'
    },
    yellow: {
      bg: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
      border: 'border-yellow-300 dark:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: 'text-yellow-600 dark:text-yellow-400',
      badge: 'border-yellow-400 dark:border-yellow-600'
    },
    orange: {
      bg: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      border: 'border-orange-300 dark:border-orange-700',
      text: 'text-orange-800 dark:text-orange-300',
      icon: 'text-orange-600 dark:text-orange-400',
      badge: 'border-orange-400 dark:border-orange-600'
    }
  }), [])

  const colors = colorConfig[colorVariant as keyof typeof colorConfig] || colorConfig.yellow

  if (!selected || selected.length === 0) return null

  return (
    <div className={`flex items-center justify-between p-3 mb-3 rounded-lg bg-gradient-to-r ${colors.bg} border ${colors.border} shadow-sm`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <svg className={`w-4 h-4 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className={`text-xs font-bold ${colors.text}`}>
            {selected.length} {label}{selected.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {selected.map((option) => (
            <div
              key={option}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-full border ${colors.badge} shadow-sm`}
            >
              <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                {option}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(option)
                }}
                className="cursor-pointer text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => selected.slice().forEach(val => onRemove(val))}
        className="cursor-pointer ml-3 px-3 py-1.5 text-[10px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all border border-red-200 dark:border-red-800 uppercase tracking-wider"
      >
        Clear
      </button>
    </div>
  )
})

const MultiSelectFilter = React.memo(({
  options,
  selected,
  onChange,
  gridCols = 'grid-cols-2',
  colorVariant = 'yellow',
  limit = 10
}: {
  options: string[]
  selected: string[]
  onChange: (value: string) => void
  gridCols?: string
  colorVariant?: 'blue' | 'green' | 'purple' | 'yellow' | 'orange'
  limit?: number
}) => {
  const [showAll, setShowAll] = useState(false)
  const visibleOptions = showAll ? options : options.slice(0, limit)
  const hasMore = options.length > limit

  const colorConfig = useMemo(() => ({
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-100',
    green: 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-100',
    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-100',
    yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-100',
    orange: 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-100'
  }), [])

  return (
    <div className="space-y-3">
      <div className={`grid ${gridCols} gap-2`}>
        {visibleOptions.map(option => {
          const isSelected = selected.includes(option)
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`cursor-pointer w-full px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border
                ${isSelected
                  ? colorConfig[colorVariant as keyof typeof colorConfig] || colorConfig.yellow
                  : "bg-transparent border-gray-200 dark:border-slate-800 text-foreground hover:border-yellow-400 dark:hover:border-yellow-600"
                }
              `}
            >
              {option}
            </button>
          )
        })}
      </div>
      
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-1.5"
        >
          {showAll ? (
            <>Show Less <ChevronDown className="w-3 h-3 rotate-180" /></>
          ) : (
            <>Show {options.length - limit} More <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}
    </div>
  )
})

const RangeInput = React.memo(({
  label,
  min,
  max,
  onMinChange,
  onMaxChange,
  unit = '',
  step = 1,
  minBound = 0,
  maxBound = 1000000
}: {
  label: string
  min: number
  max: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  unit?: string
  step?: number
  minBound?: number
  maxBound?: number
}) => {
  const [localMin, setLocalMin] = useState(min)
  const [localMax, setLocalMax] = useState(max)

  useEffect(() => { setLocalMin(min) }, [min])
  useEffect(() => { setLocalMax(max) }, [max])

  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setLocalMin(value[0])
      setLocalMax(value[1])
    }
  }

  const handleSliderAfterChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      onMinChange(value[0])
      onMaxChange(value[1])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold dark:text-gray-300">
          {localMin.toLocaleString()}{unit}
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">to</span>
        <span className="text-xs font-bold dark:text-gray-300">
          {localMax.toLocaleString()}{unit}
        </span>
      </div>

      <div className="px-2 py-2">
        <Slider
          range
          min={minBound}
          max={maxBound}
          step={step}
          value={[localMin, localMax]}
          onChange={handleSliderChange}
          onAfterChange={handleSliderAfterChange}
          trackStyle={{ backgroundColor: '#eab308', height: 4 }}
          railStyle={{ backgroundColor: '#e5e7eb', height: 4 }}
          handleStyle={[
            { backgroundColor: '#ffffff', borderColor: '#eab308', borderWidth: 2, height: 18, width: 18, marginTop: -7, opacity: 1, boxShadow: '0 4px 6px -1px rgba(234, 179, 8, 0.4)' },
            { backgroundColor: '#ffffff', borderColor: '#eab308', borderWidth: 2, height: 18, width: 18, marginTop: -7, opacity: 1, boxShadow: '0 4px 6px -1px rgba(234, 179, 8, 0.4)' }
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] mb-1.5 text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Min</label>
          <input
            type="number"
            step={step}
            value={localMin}
            onChange={(e) => setLocalMin(parseFloat(e.target.value))}
            onBlur={() => onMinChange(localMin)}
            className="w-full px-3 py-1.5 border border-gray-200 dark:border-slate-800 rounded-lg bg-background text-xs focus:ring-2 focus:ring-yellow-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] mb-1.5 text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Max</label>
          <input
            type="number"
            step={step}
            value={localMax}
            onChange={(e) => setLocalMax(parseFloat(e.target.value))}
            onBlur={() => onMaxChange(localMax)}
            className="w-full px-3 py-1.5 border border-gray-200 dark:border-slate-800 rounded-lg bg-background text-xs focus:ring-2 focus:ring-yellow-500 transition-all"
          />
        </div>
      </div>
    </div>
  )
})

export interface GemstoneFilterValues {
  gemstoneType: string[]
  shape: string[]
  caratWeight: { min: number; max: number }
  color: string[]
  clarity: string[]
  cut: string[]
  priceRange: { min: number; max: number }
  certification: string[]
  origin: string[]
  treatment: string[]
  enhancement: string[]
  transparency: string[]
  luster: string[]
  phenomena: string[]
  minerals: string[]
  birthstones: string[]
  length: { min: number; max: number }
  width: { min: number; max: number }
  height: { min: number; max: number }
  location: string[]
  companyName: string
  vendorLocation: string
  reportNumber: string
  searchTerm: string
}

interface GemstoneFiltersProps {
  filters: GemstoneFilterValues
  onFiltersChange: (filters: GemstoneFilterValues) => void
  onSearch?: () => void
  gemstoneType: 'single' | 'melee'
  className?: string
  expandedSections: string[]
  onToggleSection: (id: string) => void
}

const GEMSTONE_TYPES = [
  "Ruby",
  "Sapphire",
  "Emerald",
  "Tanzanite",
  "Amethyst",
  "Aquamarine",
  "Topaz",
  "Garnet",
  "Opal",
  "Tourmaline",
  "Peridot",
  "Citrine",
  "Spinel",
  "Turquoise",
  "Morganite",
  "Alexandrite",
  "Amber",
  "Ametrine",
  "Aventurine",
  "Jade",
  "Jasper",
  "Kunzite",
  "Lapis Lazuli",
  "Moonstone",
  "Onyx",
  "Pearl",
  "Rose Quartz",
  "Sunstone",
  "Tiger Eye",
  "Zircon"
];

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
  "Portugeese cut",
  "Cabochon"
];

const CLARITY_OPTIONS = [
  "Eye Clean",
  "Slightly included",
  "Moderately included",
  "Visibly included"
];

const CUT_GRADES = ["Excellent", "Very Good", "Good", "Fair", "Poor"];
const CERTIFICATIONS = ["GIA", "AGL", "GRS", "Gubelin", "SSEF", "AIGS", "IGI", "Non-certified"];
const ORIGINS = [
  "Afghanistan", "Australia", "Brazil", "Burma (Myanmar)", "Cambodia",
  "Colombia", "Ethiopia", "India", "Kenya", "Madagascar", "Malawi",
  "Mozambique", "Nigeria", "Pakistan", "Russia", "Sri Lanka",
  "Tanzania", "Thailand", "Vietnam", "Zambia", "Zimbabwe"
];
const TREATMENTS = [
  "Bleached", "Coated", "Dyed", "Enhancement", "Filling", "Heated",
  "Heating & Pressure", "Impregnated", "Infused", "Irradiated",
  "Lasering", "None", "Oiling", "Other", "Waxing"
];
const ENHANCEMENTS = ["None", "Minor", "Moderate", "Significant"];
const TRANSPARENCY_OPTIONS = ["Transparent", "Translucent", "Opaque"];
const LUSTER_OPTIONS = ["Vitreous", "Adamantine", "Pearly", "Silky", "Resinous", "Metallic", "Dull"];
const PHENOMENA = ["None", "Asterism", "Chatoyancy", "Color Change", "Pleochroism"];
const BIRTHSTONES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const COLORS = [
  { name: "Red", color: "#E57373" },
  { name: "Blue", color: "#64B5F6" },
  { name: "Green", color: "#81C784" },
  { name: "Purple", color: "#9575CD" },
  { name: "Pink", color: "#F48FB1" },
  { name: "Yellow", color: "#FFF176" },
  { name: "Orange", color: "#FFB74D" },
  { name: "Brown", color: "#A1887F" },
  { name: "Black", color: "#616161" },
  { name: "White", color: "#FAFAFA" },
  { name: "Multi", color: "linear-gradient(45deg, #E57373, #64B5F6, #81C784, #FFF176)" }
];

const MINERAL_CLASSIFICATIONS = [
  "Chrysoberyl",
  "Fossilized resin",
  "Quartz",
  "Beryl",
  "Garnet group",
  "Olite (Cordierite)",
  "Jadeite",
  "Nephrite",
  "Green Omphacite",
  "Spodumene",
  "Rock",
  "Feldspar",
  "Hydrated Silica",
  "Calcium Carbonate",
  "Olivine",
  "Corundum",
  "Spinel",
  "Zoisite",
  "Topaz",
  "Tourmaline",
  "Turquoise",
  "Zircon",
];

const BIRTHSTONE_MONTHS = [
  { month: "January", stone: "Garnet", color: "#A42D41" },
  { month: "February", stone: "Amethyst", color: "#9966CC" },
  { month: "March", stone: "Aquamarine", color: "#7FFFD4" },
  { month: "April", stone: "Diamond", color: "#DEE2E6" },
  { month: "May", stone: "Emerald", color: "#50C878" },
  { month: "June", stone: "Pearl, Moonstone, Alexandrite", color: "#FDEEF4" },
  { month: "July", stone: "Ruby", color: "#E0115F" },
  { month: "August", stone: "Peridot", color: "#ACBF60" },
  { month: "September", stone: "Sapphire", color: "#0F52BA" },
  { month: "October", stone: "Opal, Tourmaline", color: "#FBCCE7" },
  { month: "November", stone: "Topaz, Citrine", color: "#FFC87C" },
  { month: "December", stone: "Turquoise, Tanzanite, Zircon", color: "#30D5C8" }
];

export default function GemstoneFilters({
  filters,
  onFiltersChange,
  onSearch,
  gemstoneType,
  className = '',
  expandedSections,
  onToggleSection
}: GemstoneFiltersProps) {
  const handleArrayFilterChange = (key: keyof GemstoneFilterValues, value: string) => {
    const currentValues = filters[key] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]

    onFiltersChange({
      ...filters,
      [key]: newValues
    })
  }

  const handleRangeChange = (
    key: keyof GemstoneFilterValues,
    rangeKey: 'min' | 'max',
    value: number
  ) => {
    const currentRange = filters[key] as { min: number; max: number }
    onFiltersChange({
      ...filters,
      [key]: {
        ...currentRange,
        [rangeKey]: value
      }
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      gemstoneType: [],
      shape: [],
      caratWeight: { min: 0, max: 50 },
      color: [],
      clarity: [],
      cut: [],
      priceRange: { min: 0, max: 1000000 },
      certification: [],
      origin: [],
      treatment: [],
      enhancement: [],
      transparency: [],
      luster: [],
      phenomena: [],
      minerals: [],
      birthstones: [],
      length: { min: 0, max: 100 },
      width: { min: 0, max: 100 },
      height: { min: 0, max: 100 },
      location: [],
      companyName: '',
      vendorLocation: '',
      reportNumber: '',
      searchTerm: ''
    })
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Search Term */}
      <div className="mb-6">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search gemstones..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all outline-none"
          />
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
        </div>
      </div>

      {/* Gemstone Type */}
      <FilterSection 
        title="Gemstone Type" 
        id="gemstoneType"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.gemstoneType}
          label="Gemstone Type"
          onRemove={(val) => handleArrayFilterChange('gemstoneType', val)}
          colorVariant="blue"
        />
        <MultiSelectFilter
          options={GEMSTONE_TYPES}
          selected={filters.gemstoneType}
          onChange={(val) => handleArrayFilterChange('gemstoneType', val)}
          colorVariant="blue"
        />
      </FilterSection>

      {/* Shape */}
      <FilterSection 
        title="Shape" 
        id="shape"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.shape}
          label="Shape"
          onRemove={(val) => handleArrayFilterChange('shape', val)}
          colorVariant="purple"
        />
        <MultiSelectFilter
          options={SHAPES}
          selected={filters.shape}
          onChange={(val) => handleArrayFilterChange('shape', val)}
          colorVariant="purple"
        />
      </FilterSection>

      {/* Carat Weight */}
      <FilterSection 
        title="Carat Weight" 
        id="caratWeight"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <RangeInput
          label="Carat"
          min={filters.caratWeight.min}
          max={filters.caratWeight.max}
          onMinChange={(val) => handleRangeChange('caratWeight', 'min', val)}
          onMaxChange={(val) => handleRangeChange('caratWeight', 'max', val)}
          unit="ct"
          step={0.01}
          minBound={0}
          maxBound={50}
        />
      </FilterSection>

      {/* Price Range */}
      <FilterSection 
        title="Price Range" 
        id="priceRange"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <RangeInput
          label="Price"
          min={filters.priceRange.min}
          max={filters.priceRange.max}
          onMinChange={(val) => handleRangeChange('priceRange', 'min', val)}
          onMaxChange={(val) => handleRangeChange('priceRange', 'max', val)}
          unit="$"
          step={10}
          minBound={0}
          maxBound={1000000}
        />
      </FilterSection>

      {/* Color */}
      <FilterSection 
        title="Color" 
        id="color"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.color}
          label="Color"
          onRemove={(val) => handleArrayFilterChange('color', val)}
          colorVariant="orange"
        />
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => {
            const isSelected = filters.color.includes(color.name)
            return (
              <button
                key={color.name}
                onClick={() => handleArrayFilterChange('color', color.name)}
                className={`cursor-pointer group flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200
                  ${isSelected
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30"
                    : "border-gray-100 dark:border-slate-800 bg-transparent hover:border-orange-300 dark:hover:border-orange-700"
                  }
                `}
              >
                <div 
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-110"
                  style={{ background: color.color }}
                />
                <span className={`text-[10px] font-bold ${isSelected ? 'text-orange-700 dark:text-orange-300' : 'text-gray-500'}`}>
                  {color.name}
                </span>
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* Clarity */}
      <FilterSection 
        title="Clarity" 
        id="clarity"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.clarity}
          label="Clarity"
          onRemove={(val) => handleArrayFilterChange('clarity', val)}
          colorVariant="green"
        />
        <MultiSelectFilter
          options={CLARITY_OPTIONS}
          selected={filters.clarity}
          onChange={(val) => handleArrayFilterChange('clarity', val)}
          colorVariant="green"
        />
      </FilterSection>

      {/* Cut */}
      <FilterSection 
        title="Cut Grade" 
        id="cut"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.cut}
          label="Cut"
          onRemove={(val) => handleArrayFilterChange('cut', val)}
          colorVariant="yellow"
        />
        <MultiSelectFilter
          options={CUT_GRADES}
          selected={filters.cut}
          onChange={(val) => handleArrayFilterChange('cut', val)}
          colorVariant="yellow"
        />
      </FilterSection>

      {/* Certification */}
      <FilterSection 
        title="Certification" 
        id="certification"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.certification}
          label="Certification"
          onRemove={(val) => handleArrayFilterChange('certification', val)}
          colorVariant="blue"
        />
        <MultiSelectFilter
          options={CERTIFICATIONS}
          selected={filters.certification}
          onChange={(val) => handleArrayFilterChange('certification', val)}
          colorVariant="blue"
        />
      </FilterSection>

      {/* Origin */}
      <FilterSection 
        title="Origin" 
        id="origin"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.origin}
          label="Origin"
          onRemove={(val) => handleArrayFilterChange('origin', val)}
          colorVariant="purple"
        />
        <MultiSelectFilter
          options={ORIGINS}
          selected={filters.origin}
          onChange={(val) => handleArrayFilterChange('origin', val)}
          colorVariant="purple"
        />
      </FilterSection>

      {/* Treatment */}
      <FilterSection 
        title="Treatment" 
        id="treatment"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.treatment}
          label="Treatment"
          onRemove={(val) => handleArrayFilterChange('treatment', val)}
          colorVariant="orange"
        />
        <MultiSelectFilter
          options={TREATMENTS}
          selected={filters.treatment}
          onChange={(val) => handleArrayFilterChange('treatment', val)}
          colorVariant="orange"
        />
      </FilterSection>

      {/* Enhancement */}
      <FilterSection 
        title="Enhancement" 
        id="enhancement"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.enhancement}
          label="Enhancement"
          onRemove={(val) => handleArrayFilterChange('enhancement', val)}
          colorVariant="yellow"
        />
        <MultiSelectFilter
          options={ENHANCEMENTS}
          selected={filters.enhancement}
          onChange={(val) => handleArrayFilterChange('enhancement', val)}
          colorVariant="yellow"
        />
      </FilterSection>

      {/* Transparency */}
      <FilterSection 
        title="Transparency" 
        id="transparency"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.transparency}
          label="Transparency"
          onRemove={(val) => handleArrayFilterChange('transparency', val)}
          colorVariant="green"
        />
        <MultiSelectFilter
          options={TRANSPARENCY_OPTIONS}
          selected={filters.transparency}
          onChange={(val) => handleArrayFilterChange('transparency', val)}
          colorVariant="green"
        />
      </FilterSection>

      {/* Luster */}
      <FilterSection 
        title="Luster" 
        id="luster"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.luster}
          label="Luster"
          onRemove={(val) => handleArrayFilterChange('luster', val)}
          colorVariant="blue"
        />
        <MultiSelectFilter
          options={LUSTER_OPTIONS}
          selected={filters.luster}
          onChange={(val) => handleArrayFilterChange('luster', val)}
          colorVariant="blue"
        />
      </FilterSection>

      {/* Phenomena */}
      <FilterSection 
        title="Phenomena" 
        id="phenomena"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.phenomena}
          label="Phenomena"
          onRemove={(val) => handleArrayFilterChange('phenomena', val)}
          colorVariant="purple"
        />
        <MultiSelectFilter
          options={PHENOMENA}
          selected={filters.phenomena}
          onChange={(val) => handleArrayFilterChange('phenomena', val)}
          colorVariant="purple"
        />
      </FilterSection>

      {/* Minerals */}
      <FilterSection 
        title="Mineral Classification" 
        id="minerals"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.minerals}
          label="Mineral"
          onRemove={(val) => handleArrayFilterChange('minerals', val)}
          colorVariant="blue"
        />
        <MultiSelectFilter
          options={MINERAL_CLASSIFICATIONS}
          selected={filters.minerals}
          onChange={(val) => handleArrayFilterChange('minerals', val)}
          colorVariant="blue"
        />
      </FilterSection>

      {/* Birthstones */}
      <FilterSection 
        title="Birthstones" 
        id="birthstones"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <SelectedOptionsDisplay
          selected={filters.birthstones}
          label="Birthstone"
          onRemove={(val) => handleArrayFilterChange('birthstones', val)}
          colorVariant="purple"
        />
        <div className="grid grid-cols-3 gap-2">
          {BIRTHSTONE_MONTHS.map((item) => {
            const isSelected = filters.birthstones.includes(item.month)
            return (
              <button
                key={item.month}
                onClick={() => handleArrayFilterChange('birthstones', item.month)}
                className={`cursor-pointer group flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200
                  ${isSelected
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                    : "border-gray-100 dark:border-slate-800 bg-transparent hover:border-purple-300 dark:hover:border-purple-700"
                  }
                `}
              >
                <div 
                  className="w-6 h-6 rounded-md shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex flex-col items-center">
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-gray-100'}`}>
                    {item.month}
                  </span>
                  <span className="text-[8px] text-gray-500 text-center leading-tight">
                    {item.stone.split(',')[0]}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* Dimensions */}
      <FilterSection 
        title="Dimensions" 
        id="dimensions"
        expandedSections={expandedSections}
        onToggle={onToggleSection}
      >
        <div className="space-y-6">
          <RangeInput
            label="Length"
            min={filters.length.min}
            max={filters.length.max}
            onMinChange={(val) => handleRangeChange('length', 'min', val)}
            onMaxChange={(val) => handleRangeChange('length', 'max', val)}
            unit="mm"
            step={0.1}
            minBound={0}
            maxBound={100}
          />
          <RangeInput
            label="Width"
            min={filters.width.min}
            max={filters.width.max}
            onMinChange={(val) => handleRangeChange('width', 'min', val)}
            onMaxChange={(val) => handleRangeChange('width', 'max', val)}
            unit="mm"
            step={0.1}
            minBound={0}
            maxBound={100}
          />
          <RangeInput
            label="Height"
            min={filters.height.min}
            max={filters.height.max}
            onMinChange={(val) => handleRangeChange('height', 'min', val)}
            onMaxChange={(val) => handleRangeChange('height', 'max', val)}
            unit="mm"
            step={0.1}
            minBound={0}
            maxBound={100}
          />
        </div>
      </FilterSection>

      {/* Clear All Button */}
      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={clearFilters}
          className="w-full py-3 rounded-2xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-red-200 dark:border-red-800 uppercase tracking-widest"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}