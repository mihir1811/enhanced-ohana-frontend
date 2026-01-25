'use client'

import { useState } from 'react'
import { ChevronDown, CheckSquare, X, MousePointer2 } from 'lucide-react'

function FilterSection({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="filter-group border-b border-gray-100 dark:border-gray-800 pb-5 mb-5 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100 uppercase">{title}</h3>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      <div className="mt-2">{children}</div>
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
              className={`cursor-pointer group w-full px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${isSelected
                  ? "bg-yellow-50 dark:bg-yellow-900/30 text-gray-900 dark:text-gray-100 border border-yellow-500 dark:border-yellow-500"
                  : "bg-transparent border hover:text-black border-gray-200 dark:border-slate-700 dark:text-gray-300"
                }
                hover:bg-yellow-50 dark:hover:bg-yellow-900/30 dark:hover:text-black 
                hover:border-yellow-500/30 dark:hover:border-yellow-500/30
              `}
            >
              {option}
            </button>
          )
        })}
      </div>
    )
  }

  const ColorButtonGroup = () => {
    const colorOptions = COLORS.map(c => c.name);
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
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 border-blue-500 ring-2 ring-blue-300 shadow-sm'
                :
              isSelected
                ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-500 dark:border-yellow-600 shadow-sm"
                : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-yellow-300 dark:hover:border-yellow-700 hover:shadow-sm"
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-6 h-6 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-700"
                style={{ background: color.color }}
              />
              <span
                className={`text-xs font-medium ${isSelected
                    ? "text-yellow-800 dark:text-yellow-300"
                    : "text-gray-700 dark:text-gray-300"
                  }`}
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
          title={isRangeActive ? "Cancel Range" : "Select Range"}
          className={`cursor-pointer p-1.5 rounded-md transition-all duration-200 ${
            isRangeActive
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 ring-1 ring-blue-500/30'
              : 'text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <MousePointer2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => selectAll(category, options)}
          title="Select All"
          className="cursor-pointer p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>
        {hasSelection && (
          <button
            onClick={() => clearCategory(category)}
            title="Clear"
            className="cursor-pointer p-1.5 rounded-md text-red-400 hover:text-red-600 dark:text-red-500/70 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <X className="w-3.5 h-3.5" />
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
    onChange: (rangeKey: 'min' | 'max', value: number) => void
    step?: number
    unit?: string
  }) => (
    <div className="space-y-3">
      {/* Range Display */}
      <div className="flex items-center justify-between px-2">
        <span className="text-sm font-semibold dark:text-gray-300">
          {value.min.toLocaleString()}{unit}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">to</span>
        <span className="text-sm font-semibold dark:text-gray-300">
          {value.max.toLocaleString()}{unit}
        </span>
      </div>

      {/* Dual Range Sliders */}
      <div className="relative pt-2 pb-3">
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          {/* Active Range Bar */}
          <div
            className="absolute h-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"
            style={{
              left: `${((value.min - min) / (max - min)) * 100}%`,
              right: `${100 - ((value.max - min) / (max - min)) * 100}%`
            }}
          />
        </div>

        {/* Min Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value)
            if (newValue <= value.max) {
              onChange('min', newValue)
            }
          }}
          className="absolute w-full h-2 top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-yellow-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-yellow-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
        />

        {/* Max Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value)
            if (newValue >= value.min) {
              onChange('max', newValue)
            }
          }}
          className="absolute w-full h-2 top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-yellow-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-yellow-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
        />
      </div>

      {/* Number Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1.5 text-gray-600 dark:text-gray-400">
            Minimum{unit && ` (${unit})`}
          </label>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value.min}
            onChange={(e) => onChange('min', parseFloat(e.target.value) || min)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-xs mb-1.5 text-gray-600 dark:text-gray-400">
            Maximum{unit && ` (${unit})`}
          </label>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value.max}
            onChange={(e) => onChange('max', parseFloat(e.target.value) || max)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  )

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
          className="cursor-pointer px-6 py-2 text-sm font-medium text-yellow-600 dark:text-yellow-500 border border-yellow-300 dark:border-yellow-700 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200 flex items-center gap-2"
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
      <div className="space-y-6">
        <FilterSection 
          title="Gemstone Type"
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
        </FilterSection>

        <FilterSection 
          title="Birthstones"
          actions={<FilterActionButtons category="birthstones" options={BIRTHSTONE_MONTHS.map(m => m.month)} />}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {BIRTHSTONE_MONTHS.map((item) => {
              const isSelected = filters.birthstones?.includes(item.month)
              const isRangeStart = rangeSelection.isActive && rangeSelection.category === 'birthstones' && rangeSelection.startItem === item.month;
              const birthstoneOptions = BIRTHSTONE_MONTHS.map(m => m.month);

              return (
                <button
                  key={item.month}
                  onClick={() => handleArrayFilterChange('birthstones', item.month, birthstoneOptions)}
                  className={`p-4 rounded-3xl cursor-pointer transition-all duration-200 border text-center
                    ${isRangeStart
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 border-blue-500 ring-2 ring-blue-300 shadow-md'
                      :
                    isSelected
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-gray-900 dark:text-gray-100"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                    }
                    hover:border-yellow-500/30 dark:hover:border-yellow-500/30
                  `}
                >
                  <span className="block text-sm font-medium mb-1">{item.month}</span>
                  <span className={`block text-xs ${isSelected
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-gray-600 dark:text-gray-400"
                    }`}>
                    {item.stone}
                  </span>
                </button>
              )
            })}
          </div>
        </FilterSection>

        <FilterSection 
          title="Shape"
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
        </FilterSection>

        <div className="grid md:grid-cols-3 gap-6">

          <FilterSection title="Carat Weight">
            <RangeFilter
              min={0}
              max={50}
              value={filters.caratWeight}
              onChange={(rangeKey, value) => handleRangeChange('caratWeight', rangeKey, value)}
              step={0.01}
              unit="ct"
            />
          </FilterSection>

          <FilterSection title="Price Range">
            <RangeFilter
              min={0}
              max={1000000}
              value={filters.priceRange}
              onChange={(rangeKey, value) => handleRangeChange('priceRange', rangeKey, value)}
              step={100}
              unit="$"
            />
          </FilterSection>
        </div>

        <FilterSection 
          title="Color"
          actions={<FilterActionButtons category="color" options={COLORS.map(c => c.name)} />}
        >
          <ColorButtonGroup />
        </FilterSection>

        <FilterSection 
          title="Clarity"
          actions={<FilterActionButtons category="clarity" options={CLARITY_OPTIONS} />}
        >
          <ButtonFilterGroup options={CLARITY_OPTIONS} category="clarity" />
        </FilterSection>

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

        <FilterSection 
          title="Treatments"
          actions={<FilterActionButtons category="treatment" options={TREATMENTS} />}
        >
          <ButtonFilterGroup options={TREATMENTS} category="treatment" />
        </FilterSection>

        <FilterSection 
          title="Certification"
          actions={<FilterActionButtons category="certification" options={CERTIFICATIONS} />}
        >
          <ButtonFilterGroup options={CERTIFICATIONS} category="certification" />
        </FilterSection>

        <FilterSection 
          title="Origin"
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
        </FilterSection>

        <FilterSection 
          title="Cut Grade"
          actions={<FilterActionButtons category="cut" options={CUT_GRADES} />}
        >
          <ButtonFilterGroup options={CUT_GRADES} category="cut" />
        </FilterSection>

        <div className="grid md:grid-cols-3 gap-6">
          <FilterSection title="Length (mm)">
            <RangeFilter
              min={0}
              max={100}
              value={filters.length}
              onChange={(rangeKey, value) => handleRangeChange('length', rangeKey, value)}
              step={0.1}
              unit="mm"
            />
          </FilterSection>

          <FilterSection title="Width (mm)">
            <RangeFilter
              min={0}
              max={100}
              value={filters.width}
              onChange={(rangeKey, value) => handleRangeChange('width', rangeKey, value)}
              step={0.1}
              unit="mm"
            />
          </FilterSection>

          <FilterSection title="Height (mm)">
            <RangeFilter
              min={0}
              max={100}
              value={filters.height}
              onChange={(rangeKey, value) => handleRangeChange('height', rangeKey, value)}
              step={0.1}
              unit="mm"
            />
          </FilterSection>
        </div>
      </div>

      <div className="flex gap-3 pt-6 mt-6 border-t justify-center" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={clearFilters}
          className="cursor-pointer px-6 py-3 rounded-3xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
        >
          Clear Filters
        </button>
        <button
          onClick={onSearch}
          className="cursor-pointer px-6 py-3 rounded-3xl bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Search Gemstones
        </button>
      </div>
    </div>
  )
}