'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function Expand({
  label,
  children,
  actions,
  defaultOpen = true
}: {
  label: string
  children: React.ReactNode
  actions?: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--card) 92%, transparent)' }}>
      <div className="flex items-center gap-2 px-4 py-3 md:px-5 md:py-4">
        <button
          type="button"
          className="flex-1 flex items-center justify-between text-left"
          onClick={() => setOpen((prev) => !prev)}
        >
          <h3 className="text-sm font-bold tracking-wide uppercase" style={{ color: 'var(--foreground)' }}>{label}</h3>
          {open ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />}
        </button>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      {open && <div className="px-4 pb-4 md:px-5 md:pb-5">{children}</div>}
    </div>
  )
}

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
  minerals: string[]
  birthstones: string[]
  length: { min: number; max: number }
  width: { min: number; max: number }
  height: { min: number; max: number }
  searchTerm: string
}

interface GemstoneFiltersProps {
  filters: GemstoneFilterValues
  onFiltersChange: (filters: GemstoneFilterValues) => void
  onSearch?: () => void
  gemstoneType: 'single' | 'melee'
  className?: string
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
  className = ''
}: GemstoneFiltersProps) {
  const [showAllGemstoneTypes, setShowAllGemstoneTypes] = useState(false)
  const [showAllShapes, setShowAllShapes] = useState(false)
  const [showAllMineralClassifications, setShowAllMineralClassifications] = useState(false)
  const [showAllOrigins, setShowAllOrigins] = useState(false)

  const birthstoneMonthOptions = useMemo(
    () => BIRTHSTONE_MONTHS.map((month) => month.month),
    []
  );
  const colorOptions = useMemo(() => COLORS.map((color) => color.name), []);
  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.gemstoneType.length;
    count += filters.shape.length;
    count += filters.color.length;
    count += filters.clarity.length;
    count += filters.cut.length;
    count += filters.certification.length;
    count += filters.origin.length;
    count += filters.treatment.length;
    count += filters.birthstones.length;
    count += filters.minerals.length;
    if (filters.searchTerm.trim()) count += 1;
    return count;
  }, [filters]);

  const [rangeSelection, setRangeSelection] = useState<{
    isActive: boolean;
    category: keyof GemstoneFilterValues | null;
    startItem: string | null;
  }>({ isActive: false, category: null, startItem: null });

  const toggleRangeMode = (category: keyof GemstoneFilterValues) => {
    if (rangeSelection.isActive && rangeSelection.category === category) {
      setRangeSelection({ isActive: false, category: null, startItem: null });
    } else {
      setRangeSelection({ isActive: true, category, startItem: null });
    }
  };

  const selectAll = (category: keyof GemstoneFilterValues, options: string[]) => {
    // If all are already selected, deselect all (optional, but nice UX)
    // But user asked for "Select All", usually means select all.
    // Let's check if all are currently selected.
    const currentValues = filters[category] as string[];
    const allSelected = options.every(opt => currentValues.includes(opt));
    
    if (allSelected) {
        // Deselect all
        onFiltersChange({
            ...filters,
            [category]: []
        });
    } else {
        // Select all
        // Merge with existing selections (though usually we just set to options)
        // If we want to be safe and only add unique ones from the passed options:
        const newValues = Array.from(new Set([...currentValues, ...options]));
        onFiltersChange({
            ...filters,
            [category]: newValues
        });
    }
  };

  const clearCategory = (category: keyof GemstoneFilterValues) => {
    onFiltersChange({
      ...filters,
      [category]: []
    });
  };

  const handleArrayFilterChange = (key: keyof GemstoneFilterValues, value: string, allOptions: string[] = []) => {
    // Range Selection Logic
    if (rangeSelection.isActive && rangeSelection.category === key && allOptions.length > 0) {
      if (rangeSelection.startItem === null) {
        setRangeSelection(prev => ({ ...prev, startItem: value }));
        // Continue to select this item normally below
      } else {
        const startIdx = allOptions.indexOf(rangeSelection.startItem);
        const endIdx = allOptions.indexOf(value);
        
        if (startIdx !== -1 && endIdx !== -1) {
          const min = Math.min(startIdx, endIdx);
          const max = Math.max(startIdx, endIdx);
          const rangeItems = allOptions.slice(min, max + 1);
          
          const currentValues = filters[key] as string[];
          const newValues = Array.from(new Set([...currentValues, ...rangeItems]));
          
          onFiltersChange({
            ...filters,
            [key]: newValues
          });
          
          // Reset start item but keep range mode active for next range
          setRangeSelection(prev => ({ ...prev, startItem: null }));
          return;
        }
      }
    }

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
      minerals: [],
      birthstones: [],
      length: { min: 0, max: 100 },
      width: { min: 0, max: 100 },
      height: { min: 0, max: 100 },
      searchTerm: ''
    })
  }

  const ButtonFilterGroup = ({
    options,
    category,
    showAll = true,
    itemsPerRow = 6,
    defaultRows = 2
  }: {
    options: string[],
    category: keyof GemstoneFilterValues,
    showAll?: boolean,
    itemsPerRow?: number,
    defaultRows?: number
  }) => {
    const itemsToShow = showAll ? options : options.slice(0, itemsPerRow * defaultRows)
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {itemsToShow.map((option) => {
          const values = filters[category] as string[]
          const isSelected = values.includes(option)

          return (
            <button
              key={option}
              onClick={() => handleArrayFilterChange(category, option, options)}
              className={`cursor-pointer group w-full px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                ${isSelected
                  ? "text-white shadow-md scale-[1.01]"
                  : "bg-transparent border-border text-muted-foreground hover:scale-[1.01]"
                }
              `}
              style={{
                backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                color: isSelected ? 'white' : 'var(--muted-foreground)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                }
              }}
            >
              {option}
            </button>
          )
        })}
      </div>
    )
  }

  const ColorButtonGroup = () => {
    return (
    <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-11 gap-3">
      {COLORS.map((color) => {
        const isSelected = (filters.color as string[]).includes(color.name)
        const isRangeStart = rangeSelection.isActive && rangeSelection.category === 'color' && rangeSelection.startItem === color.name;

        return (
          <button
            key={color.name}
            onClick={() => handleArrayFilterChange('color', color.name, colorOptions)}
            className={`cursor-pointer relative p-2 rounded-lg transition-all duration-200 border
              ${isRangeStart
                ? 'ring-2 ring-blue-300 shadow-sm'
                :
              isSelected
                ? "shadow-sm"
                : "hover:shadow-sm"
              }
            `}
            style={{
              backgroundColor: isRangeStart ? 'color-mix(in srgb, var(--status-info) 10%, transparent)' : isSelected ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'var(--card)',
              borderColor: isRangeStart ? 'var(--status-info)' : isSelected ? 'var(--primary)' : 'var(--border)',
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-6 h-6 rounded-full shadow-sm ring-2"
                style={{ background: color.color, borderColor: 'var(--card)' }}
              />
              <span
                className="text-xs font-bold"
                style={{ color: isSelected ? 'var(--primary)' : 'var(--muted-foreground)' }}
              >
                {color.name}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )}

  const FilterActionButtons = ({ 
    category, 
    options 
  }: { 
    category: keyof GemstoneFilterValues, 
    options: string[] 
  }) => {
    const isRangeActive = rangeSelection.isActive && rangeSelection.category === category;
    const hasSelection = (filters[category] as string[]).length > 0;

    return (
      <>
        <button
          onClick={() => toggleRangeMode(category)}
          title={isRangeActive ? "Cancel Range" : "Range Select"}
          className={`cursor-pointer px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 border ${
            isRangeActive
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted border-border'
          }`}
        >
          Range
        </button>
        <button
          onClick={() => selectAll(category, options)}
          title="Select All"
          className="cursor-pointer px-2.5 py-1 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 border"
          style={{ borderColor: 'var(--border)' }}
        >
          Select all
        </button>
        {hasSelection && (
          <button
            onClick={() => clearCategory(category)}
            title="Clear"
            className="cursor-pointer px-2.5 py-1 rounded-md text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 border border-red-200"
          >
            Clear
          </button>
        )}
      </>
    )
  }

  const RangeFilter = ({
    min,
    max,
    value,
    onChange,
    step = 0.1,
    unit = ''
  }: {
    min: number
    max: number
    value: { min: number; max: number }
    onChange: (range: { min: number; max: number }) => void
    step?: number
    unit?: string
  }) => {
    const normalizedMin = Number.isFinite(value.min) ? value.min : min
    const normalizedMax = Number.isFinite(value.max) ? value.max : max

    const safeSetMin = (next: number) => {
      const clamped = Math.max(min, Math.min(next, normalizedMax))
      onChange({ min: clamped, max: normalizedMax })
    }

    const safeSetMax = (next: number) => {
      const clamped = Math.min(max, Math.max(next, normalizedMin))
      onChange({ min: normalizedMin, max: clamped })
    }

    return (
    <div className="space-y-2">
      {/* Current Range Display */}
      <div className="flex items-center justify-between px-1 py-1">
        <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
          Current Range:
        </span>
        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
          {normalizedMin.toLocaleString()}{unit} - {normalizedMax.toLocaleString()}{unit}
        </span>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Minimum {unit}</label>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={normalizedMin}
            onChange={(e) => safeSetMin(Number(e.target.value))}
            className="w-full px-2 py-2 text-xs border rounded-md focus:ring-1 transition-all outline-none"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder={`Min ${unit}`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Maximum {unit}</label>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={normalizedMax}
            onChange={(e) => safeSetMax(Number(e.target.value))}
            className="w-full px-2 py-2 text-xs border rounded-md focus:ring-1 transition-all outline-none"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 0 1px var(--primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            placeholder={`Max ${unit}`}
          />
        </div>
      </div>

      <div className="relative h-7 mt-1">
        <div
          className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 18%, transparent)' }}
        >
          <div
            className="absolute h-2 rounded-full"
            style={{
              background: 'linear-gradient(to right, var(--primary), var(--accent))',
              left: `${((value.min - min) / (max - min)) * 100}%`,
              right: `${100 - ((normalizedMax - min) / (max - min)) * 100}%`,
            }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={normalizedMin}
          onChange={(e) => safeSetMin(Number(e.target.value))}
          className="absolute left-0 top-0 w-full h-7 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: 20 }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={normalizedMax}
          onChange={(e) => safeSetMax(Number(e.target.value))}
          className="absolute left-0 top-0 w-full h-7 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: 30 }}
        />
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
  )}

  const ShowMoreButton = ({ 
    isExpanded, 
    onClick, 
    totalItems, 
    visibleItems 
  }: { 
    isExpanded: boolean; 
    onClick: () => void; 
    totalItems: number; 
    visibleItems: number;
  }) => {
    if (totalItems <= visibleItems) return null;
    
    return (
      <div className="mt-4 flex justify-center">
        <button
          onClick={onClick}
          className="cursor-pointer px-6 py-2 text-sm font-medium text-primary dark:text-primary border border-primary/40 dark:border-primary/60 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200 flex items-center gap-2"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <ChevronDown className="w-4 h-4 rotate-180 transition-transform" />
            </>
          ) : (
            <>
              <span>Show More ({totalItems - visibleItems} more)</span>
              <ChevronDown className="w-4 h-4 transition-transform" />
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className={`bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-sm border p-8 backdrop-blur-xl ${className}`} style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="mb-6 rounded-2xl border p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--muted) 30%, transparent)' }}>
        <div>
          <h2 className="text-base md:text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            Refine {gemstoneType === 'single' ? 'Single Gemstones' : 'Melee Gemstones'}
          </h2>
          <p className="text-xs md:text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {activeFilterCount > 0 ? `${activeFilterCount} filters selected` : 'No filters selected yet'}
          </p>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="cursor-pointer px-4 py-2 rounded-xl border text-sm font-medium transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            Reset All
          </button>
        )}
      </div>

      <div className="space-y-4 md:space-y-5">
        <Expand
          label="Gemstone Type"
          actions={<FilterActionButtons category="gemstoneType" options={GEMSTONE_TYPES} />}
        >
          <ButtonFilterGroup 
            options={GEMSTONE_TYPES} 
            category="gemstoneType" 
            showAll={showAllGemstoneTypes}
            itemsPerRow={6}
            defaultRows={2}
          />
          <ShowMoreButton
            isExpanded={showAllGemstoneTypes}
            onClick={() => setShowAllGemstoneTypes(!showAllGemstoneTypes)}
            totalItems={GEMSTONE_TYPES.length}
            visibleItems={12}
          />
        </Expand>

        <Expand
          label="Birthstones"
          actions={<FilterActionButtons category="birthstones" options={birthstoneMonthOptions} />}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {BIRTHSTONE_MONTHS.map((item) => {
              const isSelected = filters.birthstones?.includes(item.month)
              const isRangeStart = rangeSelection.isActive && rangeSelection.category === 'birthstones' && rangeSelection.startItem === item.month;

              return (
                <button
                  key={item.month}
                  onClick={() => handleArrayFilterChange('birthstones', item.month, birthstoneMonthOptions)}
                  className={`p-4 rounded-3xl cursor-pointer transition-all duration-200 border text-center
                    ${isRangeStart
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 border-blue-500 ring-2 ring-blue-300 shadow-md'
                      :
                    isSelected
                      ? "border-primary bg-primary/10 dark:bg-primary/15 text-gray-900 dark:text-gray-100"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                    }
                    hover:border-primary/30 dark:hover:border-primary/30
                  `}
                >
                  <span className="block text-sm font-medium mb-1">{item.month}</span>
                  <span className={`block text-xs ${isSelected
                      ? "text-primary"
                      : "text-gray-600 dark:text-gray-400"
                    }`}>
                    {item.stone}
                  </span>
                </button>
              )
            })}
          </div>
        </Expand>

        <Expand
          label="Shape"
          actions={<FilterActionButtons category="shape" options={SHAPES} />}
        >
          <ButtonFilterGroup 
            options={SHAPES} 
            category="shape" 
            showAll={showAllShapes}
            itemsPerRow={6}
            defaultRows={2}
          />
          <ShowMoreButton
            isExpanded={showAllShapes}
            onClick={() => setShowAllShapes(!showAllShapes)}
            totalItems={SHAPES.length}
            visibleItems={12}
          />
        </Expand>

        <div className="grid md:grid-cols-2 gap-4">

          <Expand label="Carat Weight">
            <RangeFilter
              min={0}
              max={50}
              value={filters.caratWeight}
              onChange={(range) => onFiltersChange({ ...filters, caratWeight: range })}
              step={0.01}
              unit="ct"
            />
          </Expand>

          <Expand label="Price Range">
            <RangeFilter
              min={0}
              max={1000000}
              value={filters.priceRange}
              onChange={(range) => onFiltersChange({ ...filters, priceRange: range })}
              step={100}
              unit="USD"
            />
          </Expand>
        </div>

        <Expand
          label="Color"
          actions={<FilterActionButtons category="color" options={colorOptions} />}
        >
          <ColorButtonGroup />
        </Expand>

        <Expand
          label="Clarity"
          actions={<FilterActionButtons category="clarity" options={CLARITY_OPTIONS} />}
        >
          <ButtonFilterGroup options={CLARITY_OPTIONS} category="clarity" />
        </Expand>

        {/* <FilterSection title="Mineral Classification">
          <ButtonFilterGroup 
            options={MINERAL_CLASSIFICATIONS} 
            category="minerals" 
            showAll={showAllMineralClassifications}
            itemsPerRow={6}
            defaultRows={2}
          />
          <ShowMoreButton
            isExpanded={showAllMineralClassifications}
            onClick={() => setShowAllMineralClassifications(!showAllMineralClassifications)}
            totalItems={MINERAL_CLASSIFICATIONS.length}
            visibleItems={12}
          />
        </FilterSection> */}

        <Expand
          label="Treatments"
          actions={<FilterActionButtons category="treatment" options={TREATMENTS} />}
        >
          <ButtonFilterGroup options={TREATMENTS} category="treatment" />
        </Expand>

        <Expand
          label="Certification"
          actions={<FilterActionButtons category="certification" options={CERTIFICATIONS} />}
        >
          <ButtonFilterGroup options={CERTIFICATIONS} category="certification" />
        </Expand>

        <Expand
          label="Origin"
          actions={<FilterActionButtons category="origin" options={ORIGINS} />}
        >
          <ButtonFilterGroup 
            options={ORIGINS} 
            category="origin" 
            showAll={showAllOrigins}
            itemsPerRow={6}
            defaultRows={2}
          />
          <ShowMoreButton
            isExpanded={showAllOrigins}
            onClick={() => setShowAllOrigins(!showAllOrigins)}
            totalItems={ORIGINS.length}
            visibleItems={12}
          />
        </Expand>

        <Expand
          label="Cut Grade"
          actions={<FilterActionButtons category="cut" options={CUT_GRADES} />}
        >
          <ButtonFilterGroup options={CUT_GRADES} category="cut" />
        </Expand>

        <div className="grid md:grid-cols-3 gap-4">
          <Expand label="Length (mm)">
            <RangeFilter
              min={0}
              max={100}
              value={filters.length}
              onChange={(range) => onFiltersChange({ ...filters, length: range })}
              step={0.1}
              unit="mm"
            />
          </Expand>

          <Expand label="Width (mm)">
            <RangeFilter
              min={0}
              max={100}
              value={filters.width}
              onChange={(range) => onFiltersChange({ ...filters, width: range })}
              step={0.1}
              unit="mm"
            />
          </Expand>

          <Expand label="Height (mm)">
            <RangeFilter
              min={0}
              max={100}
              value={filters.height}
              onChange={(range) => onFiltersChange({ ...filters, height: range })}
              step={0.1}
              unit="mm"
            />
          </Expand>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 mt-6 pt-4 border-t backdrop-blur supports-[backdrop-filter]:bg-[color:var(--card)]/80" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={clearFilters}
          className="cursor-pointer px-6 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground)', backgroundColor: 'var(--card)' }}
        >
          Clear Filters
        </button>
        <button
          onClick={onSearch}
          className="cursor-pointer px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Search Gemstones
        </button>
        </div>
      </div>
    </div>
  )
}