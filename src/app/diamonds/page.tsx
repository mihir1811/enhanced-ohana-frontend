'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Gem, Leaf, Sparkles, Filter, ChevronDown, MoveLeft, MoveRight } from 'lucide-react'
import debounce from 'lodash.debounce'
import Slider from 'rc-slider'
// import 'rc-slider/assets/index.css'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { filterOptions } from '@/constants/filterOptions'
import Image from 'next/image'
import {
  RoundIcon,
  PearIcon,
  EmeraldIcon,
  OvalIcon,
  HeartIcon,
  MarquiseIcon,
  AsscherIcon,
  CushionIcon,
  PrincessIcon,
  CushionModifiedIcon,
  CushionBrilliantIcon,
  RadiantIcon,
  FrenchIcon,
  TrilliantIcon,
  BriolletteIcon,
  RosecutIcon,
  LozengeIcon,
  BaguetteIcon,
  TaperedBaguetteIcon,
  HalfmoonIcon,
  FlandersIcon,
  TrapezoidIcon,
  BulletIcon,
  KiteIcon,
  ShieldIcon,
  StarcutIcon,
  PentagonalIcon,
  HexagonalIcon,
  OctagonalIcon,
  EurocutIcon,
  OldMinerIcon,
  PortugeeseIcon,
  DefaultIcon
} from '../../../public/icons'

// Constants
import { SECTION_WIDTH } from '@/lib/constants'

// Sieve size data for melee diamonds
const SIEVE_DATA = [
  { sieve: "-000", mm: "0.80", cts: "0.003" },
  { sieve: "+000 -00", mm: "0.90", cts: "0.004" },
  { sieve: "+00 -0", mm: "1.00", cts: "0.005" },
  { sieve: "+0 -1", mm: "1.10", cts: "0.006" },
  { sieve: "+1 -1.5", mm: "1.15", cts: "0.007" },
  { sieve: "+1.5 -2", mm: "1.20", cts: "0.008" },
  { sieve: "+2 -2.5", mm: "1.25", cts: "0.009" },
  { sieve: "+2.5 -3", mm: "1.30", cts: "0.010" },
  { sieve: "+3 -3.5", mm: "1.35", cts: "0.011" },
  { sieve: "+3.5 -4", mm: "1.40", cts: "0.012" },
  { sieve: "+4 -4.5", mm: "1.45", cts: "0.013" },
  { sieve: "+4.5 -5", mm: "1.50", cts: "0.014" },
  { sieve: "+5 -5.5", mm: "1.55", cts: "0.015" },
  { sieve: "+5.5 -6", mm: "1.60", cts: "0.018" },
  { sieve: "+6 -6.5", mm: "1.70", cts: "0.021" },
  { sieve: "+6.5 -7", mm: "1.80", cts: "0.025" },
  { sieve: "+7 -7.5", mm: "1.90", cts: "0.029" },
  { sieve: "+7.5 -8", mm: "2.00", cts: "0.035" },
  { sieve: "+8 -8.5", mm: "2.10", cts: "0.038" },
  { sieve: "+8.5 -9", mm: "2.20", cts: "0.045" },
  { sieve: "+9 -9.5", mm: "2.30", cts: "0.050" },
  { sieve: "+9.5 -10", mm: "2.40", cts: "0.058" },
  { sieve: "+10 -10.5", mm: "2.50", cts: "0.066" },
  { sieve: "+10.5 -11", mm: "2.60", cts: "0.070" },
  { sieve: "+11 -11.5", mm: "2.70", cts: "0.077" },
  { sieve: "+11.5 -12", mm: "2.80", cts: "0.086" },
  { sieve: "+12 -12.5", mm: "2.90", cts: "0.094" },
  { sieve: "+12.5 -13", mm: "3.00", cts: "0.103" },
  { sieve: "+13 -13.5", mm: "3.10", cts: "0.119" },
  { sieve: "+13.5 -14", mm: "3.20", cts: "0.131" },
  { sieve: "+14 -14.5", mm: "3.30", cts: "0.144" },
  { sieve: "+14.5 -15", mm: "3.40", cts: "0.158" },
];

// Diamond shapes for carousel
const DIAMOND_SHAPES = [
  { name: 'Round', image: '/images/round.png', alt: 'Round diamond shape' },
  { name: 'Pear', image: '/images/Pear.png', alt: 'Pear diamond shape' },
  { name: 'Emerald', image: '/images/Emerald.png', alt: 'Emerald diamond shape' },
  { name: 'Oval', image: '/images/Oval.png', alt: 'Oval diamond shape' },
  { name: 'Heart', image: '/images/Heart.png', alt: 'Heart diamond shape' },
  { name: 'Marquise', image: '/images/Marquise.png', alt: 'Marquise diamond shape' },
  { name: 'Princess', image: '/images/princess.png', alt: 'Princess diamond shape' },
  { name: 'Asscher', image: '/images/Asscher.png', alt: 'Asscher diamond shape' },
  { name: 'Cushion', image: '/images/Cushion.png', alt: 'Cushion diamond shape' },
  { name: 'Radiant', image: '/images/Radiant.png', alt: 'Radiant diamond shape' },
  { name: 'Trilliant', image: '/images/trilliant.png', alt: 'Trilliant diamond shape' },
  { name: 'Baguette', image: '/images/baguatte.png', alt: 'Baguette diamond shape' },
  { name: 'Tapered baguette', image: '/images/tapered-baguette.png', alt: 'Tapered baguette diamond shape' },
  { name: 'Rose cut', image: '/images/rose-cut.png', alt: 'Rose cut diamond shape' },
  { name: 'Shield', image: '/images/Shield.png', alt: 'Shield cut diamond shape' },
  { name: 'Lozenge', image: '/images/lozenge.png', alt: 'Lozenge diamond shape' },
  { name: 'Half-moon', image: '/images/half-moon.png', alt: 'Half moon diamond shape' },
  { name: 'Flanders', image: '/images/flanders.png', alt: 'Flanders diamond shape' },
  { name: 'Trapezoid', image: '/images/trapezoid.png', alt: 'Trapezoid diamond shape' },
  { name: 'Bullet', image: '/images/bullet.png', alt: 'Bullet diamond shape' }
]

// Type Definitions
interface DiamondSearchForm {
  diamondType: 'natural' | 'lab-grown'
  category: 'single' | 'melee'
  shape: string[]
  caratWeight: { min: number; max: number }
  color: string[]
  clarity: string[]
  cut: string[]
  priceRange: { min: number; max: number }
  totalPcs: { min: number; max: number }
  pricePerPcs: { min: number; max: number }
  certification: string[]
  fluorescence: string[]
  grownMethod: string[]
  isFancyColor: boolean
  fancyColors: string[]
  overtone: string[]
  intensity: string[]
  company: string[]
  origin: string[]
  location: string[]
  polish: string[]
  symmetry: string[]
  finish: string[]
  cutGrade: string[]
  tablePercent: { min: number; max: number }
  depthPercent: { min: number; max: number }
  girdle: string[]
  culet: string[]
  pricePerCarat: { min: number; max: number }
  measurements: {
    length: { min: number; max: number }
    width: { min: number; max: number }
    depth: { min: number; max: number }
  }
  ratio: { min: number; max: number }
  crownAngle: { min: number; max: number }
  crownHeight: { min: number; max: number }
  pavilionAngle: { min: number; max: number }
  pavilionDepth: { min: number; max: number }
  gridleThickness: { min: string; max: string }
  diamondTypeAdvanced: string[]
  productType: string[]
  // Additional fields from DiamondFilters component
  process: string[]
  culetSize: string[]
  lengthRange: { min: number; max: number }
  widthRange: { min: number; max: number }
  heightRange: { min: number; max: number }
  ratioRange: { min: number; max: number }
  depthPercentage: { min: number; max: number }
  tablePercentage: { min: number; max: number }
  crownAngleRange: { min: number; max: number }
  crownHeightRange: { min: number; max: number }
  pavilionAngleRange: { min: number; max: number }
  pavilionDepthRange: { min: number; max: number }
  gridleRange: { min: string; max: string }
  sieveSizes: string[]
}

interface RangeSelectFilterProps {
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  layout?: 'grid' | 'horizontal'
  gridCols?: string
  label?: string
}

interface DiamondTypeCardProps {
  type: 'natural' | 'lab-grown'
  currentType: 'natural' | 'lab-grown'
  onTypeChange: (type: 'natural' | 'lab-grown') => void
}

interface CategoryCardProps {
  category: 'single' | 'melee'
  currentCategory: 'single' | 'melee'
  onCategoryChange: (category: 'single' | 'melee') => void
}

interface MultiSelectFilterProps {
  options: string[]
  selected: string[]
  onChange: (field: keyof DiamondSearchForm, value: string) => void
  label: string
  gridCols?: string
  colorVariant?: 'blue' | 'green' | 'purple' | 'yellow' | 'orange'
}

// Shape Icon Mapping
const SHAPE_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'Round': RoundIcon,
  'Pear': PearIcon,
  'Emerald': EmeraldIcon,
  'Oval': OvalIcon,
  'Heart': HeartIcon,
  'Marquise': MarquiseIcon,
  'Asscher': AsscherIcon,
  'Cushion': CushionIcon,
  'Cushion modified': CushionModifiedIcon,
  'Cushion brilliant': CushionBrilliantIcon,
  'Radiant': RadiantIcon,
  'Princess': PrincessIcon,
  'French': FrenchIcon,
  'Trilliant': TrilliantIcon,
  'Euro cut': EurocutIcon,
  'Old Miner': OldMinerIcon,
  'Briollette': BriolletteIcon,
  'Rose cut': RosecutIcon,
  'Lozenge': LozengeIcon,
  'Baguette': BaguetteIcon,
  'Tapered baguette': TaperedBaguetteIcon,
  'Half-moon': HalfmoonIcon,
  'Flanders': FlandersIcon,
  'Trapezoid': TrapezoidIcon,
  'Bullet': BulletIcon,
  'Kite': KiteIcon,
  'Shield': ShieldIcon,
  'Star cut': StarcutIcon,
  'Pentagonal cut': PentagonalIcon,
  'Hexagonal cut': HexagonalIcon,
  'Octagonal cut': OctagonalIcon,
  'Portugeese cut': PortugeeseIcon,
}

// Constants
const DIAMOND_CONSTANTS = {
  SHAPES: filterOptions.shapes,
  COLORS: filterOptions.whiteColors,
  CLARITIES: filterOptions.clarities,
  CUTS: filterOptions.cutGrades,
  CERTIFICATIONS: filterOptions.certifications,
  FLUORESCENCE_LEVELS: filterOptions.fluorescences,
  POLISH_SYMMETRY_OPTIONS: filterOptions.polish,
  GIRDLE_OPTIONS: filterOptions.gridleOptions.map((option: string) =>
    option.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  ),
  CULET_OPTIONS: filterOptions.culetSizeOptions.map((option: string) =>
    option.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  ),
  CULET_SIZE_OPTIONS: filterOptions.culetSizeOptions,
  OVERTONE_OPTIONS: filterOptions.overTone,
  INTENSITY_OPTIONS: filterOptions.intensity,
  FINISH_OPTIONS: filterOptions.finish,
  COMPANY_OPTIONS: filterOptions.companies,
  LOCATION_OPTIONS: filterOptions.locations,
  GROWTH_METHODS: ['CVD', 'HPHT'],
  PROCESS_OPTIONS: ['CVD', 'HPHT'],
  GIRDLE_ORDER: [
    "Extremely Thin", "Very Thin", "Thin", "Slightly Thin", "Medium",
    "Slightly Thick", "Thick", "Very Thick", "Extremely Thick"
  ],
  ORIGIN_OPTIONS: ['Natural', 'Lab-Grown', 'CVD', 'HPHT'],
  PRODUCT_TYPE_OPTIONS: filterOptions.productType,
  FANCY_COLORS: [
    { name: "Yellow", color: "#FFD700" },
    { name: "Orange", color: "#FFA500" },
    { name: "Blue", color: "#4169E1" },
    { name: "Red", color: "#FF0000" },
    { name: "Pink", color: "#FFB6C1" },
    { name: "Green", color: "#50C878" },
    { name: "olive", color: "#636B2F" },
    { name: "Brown", color: "#8B4513" },
    { name: "Purple", color: "#800080" },
    { name: "other", color: "linear-gradient(#FF0000,#FFB6C1,#4169E1,#50C878,#FFD700)" }
  ]
}

// Helper Functions
class DiamondSearchHelpers {
  static getCaratRange(category: 'single' | 'melee') {
    return category === 'melee'
      ? { min: 0.001, max: 0.30 }
      : { min: 0.30, max: 5.00 }
  }

  static getPriceRange(diamondType: 'natural' | 'lab-grown', category: 'single' | 'melee') {
    if (category === 'melee') {
      return diamondType === 'natural'
        ? { min: 10, max: 500 }
        : { min: 5, max: 200 }
    }
    return diamondType === 'natural'
      ? { min: 1000, max: 100000 }
      : { min: 500, max: 50000 }
  }

  static getPricePerPcsRange(diamondType: 'natural' | 'lab-grown', category: 'single' | 'melee') {
    if (category === 'melee') {
      return diamondType === 'natural'
        ? { min: 10, max: 500 }
        : { min: 5, max: 200 }
    }
    return diamondType === 'natural'
      ? { min: 1000, max: 100000 }
      : { min: 500, max: 50000 }
  }

  static getPricePerCaratRange(diamondType: 'natural' | 'lab-grown', category: 'single' | 'melee') {
    if (category === 'melee') {
      return diamondType === 'natural'
        ? { min: 10, max: 500 }
        : { min: 5, max: 200 }
    }
    return diamondType === 'natural'
      ? { min: 1000, max: 100000 }
      : { min: 500, max: 50000 }
  }

  static getDefaultSearchForm(diamondType: 'natural' | 'lab-grown', category: 'single' | 'melee'): DiamondSearchForm {
    return {
      diamondType,
      category,
      shape: [],
      caratWeight: this.getCaratRange(category),
      color: [],
      clarity: [],
      cut: [],
      priceRange: this.getPriceRange(diamondType, category),
      totalPcs: { min: 1, max: 1000 },
      pricePerPcs: this.getPricePerPcsRange(diamondType, category),
      certification: [],
      fluorescence: [],
      grownMethod: [],
      isFancyColor: false,
      fancyColors: [],
      overtone: [],
      intensity: [],
      company: [],
      origin: [],
      location: [],
      polish: [],
      symmetry: [],
      finish: [],
      cutGrade: [],
      tablePercent: { min: 50, max: 70 },
      depthPercent: { min: 55, max: 75 },
      girdle: [],
      culet: [],
      pricePerCarat: this.getPricePerCaratRange(diamondType, category),
      measurements: {
        length: { min: 0, max: 20 },
        width: { min: 0, max: 20 },
        depth: { min: 0, max: 15 }
      },
      ratio: { min: 0.9, max: 2.5 },
      crownAngle: { min: 30, max: 36 },
      crownHeight: { min: 10, max: 16 },
      pavilionAngle: { min: 40, max: 42 },
      pavilionDepth: { min: 42, max: 44 },
      gridleThickness: { min: '', max: '' },
      diamondTypeAdvanced: [],
      productType: [],
      // Additional fields from DiamondFilters component
      process: [],
      culetSize: [],
      lengthRange: { min: 0, max: 20 },
      widthRange: { min: 0, max: 20 },
      heightRange: { min: 0, max: 15 },
      ratioRange: { min: 0.9, max: 2.5 },
      depthPercentage: { min: 50, max: 75 },
      tablePercentage: { min: 50, max: 75 },
      crownAngleRange: { min: 30, max: 36 },
      crownHeightRange: { min: 10, max: 16 },
      pavilionAngleRange: { min: 40, max: 42 },
      pavilionDepthRange: { min: 42, max: 44 },
      gridleRange: { min: '', max: '' },
      sieveSizes: []
    }
  }

  static buildQueryParams(searchForm: DiamondSearchForm) {
    const params = new URLSearchParams()

    // Multi-select filters
    const multiSelectFields = [
      'shape', 'color', 'clarity', 'cut', 'certification', 'fluorescence', 'grownMethod',
      'fancyColors', 'overtone', 'intensity', 'company', 'origin', 'location',
      'polish', 'symmetry', 'finish', 'cutGrade', 'girdle', 'culet',
      'diamondTypeAdvanced', 'productType', 'process', 'culetSize', 'sieveSizes'
    ]

    multiSelectFields.forEach(field => {
      const values = searchForm[field as keyof DiamondSearchForm] as string[]
      if (values && values.length > 0) {
        params.set(field, values.join(','))
      }
    })

    // Fancy color toggle
    if (searchForm.isFancyColor) {
      params.set('isFancyColor', 'true')
    }

    // Range parameters
    const rangeFields = [
      { key: 'carat', field: 'caratWeight' },
      { key: 'price', field: 'priceRange' },
      { key: 'totalPcs', field: 'totalPcs' },
      { key: 'pricePerPcs', field: 'pricePerPcs' },
      { key: 'table', field: 'tablePercent' },
      { key: 'depth', field: 'depthPercent' },
      { key: 'pricePerCarat', field: 'pricePerCarat' },
      { key: 'ratio', field: 'ratio' },
      { key: 'crownAngle', field: 'crownAngle' },
      { key: 'crownHeight', field: 'crownHeight' },
      { key: 'pavilionAngle', field: 'pavilionAngle' },
      { key: 'pavilionDepth', field: 'pavilionDepth' },
      // Additional range fields
      { key: 'lengthRange', field: 'lengthRange' },
      { key: 'widthRange', field: 'widthRange' },
      { key: 'heightRange', field: 'heightRange' },
      { key: 'ratioRange', field: 'ratioRange' },
      { key: 'depthPercentage', field: 'depthPercentage' },
      { key: 'tablePercentage', field: 'tablePercentage' },
      { key: 'crownAngleRange', field: 'crownAngleRange' },
      { key: 'crownHeightRange', field: 'crownHeightRange' },
      { key: 'pavilionAngleRange', field: 'pavilionAngleRange' },
      { key: 'pavilionDepthRange', field: 'pavilionDepthRange' }
    ]

    rangeFields.forEach(({ key, field }) => {
      const range = searchForm[field as keyof DiamondSearchForm] as { min: number; max: number }
      if (range) {
        params.set(`${key}Min`, range.min.toString())
        params.set(`${key}Max`, range.max.toString())
      }
    })

    // Measurement parameters (legacy)
    const measurementFields = ['length', 'width', 'depth']
    measurementFields.forEach(dimension => {
      const measurement = searchForm.measurements[dimension as keyof typeof searchForm.measurements]
      params.set(`${dimension}Min`, measurement.min.toString())
      params.set(`${dimension}Max`, measurement.max.toString())
    })

    // Girdle thickness (both legacy and new)
    if (searchForm.gridleThickness.min) params.set('gridleThicknessMin', searchForm.gridleThickness.min)
    if (searchForm.gridleThickness.max) params.set('gridleThicknessMax', searchForm.gridleThickness.max)
    if (searchForm.gridleRange.min) params.set('gridleRangeMin', searchForm.gridleRange.min)
    if (searchForm.gridleRange.max) params.set('gridleRangeMax', searchForm.gridleRange.max)

    return params
  }
}

// Range Selection Component with Optimization
const RangeSelectFilter = React.memo(({
  options,
  selected,
  onChange,
  layout = 'grid',
  gridCols = 'grid-cols-4',
  label = ''
}: RangeSelectFilterProps) => {
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null)

  const handleItemClick = useCallback((option: string, index: number) => {
    console.log('Clicked:', option, 'Index:', index, 'LastClicked:', lastClickedIndex)
    console.log('Current selected:', selected)

    const selectedArray = selected || []
    const isCurrentlySelected = selectedArray.includes(option)

    // If clicking on a selected item, always do individual toggle (deselect it)
    if (isCurrentlySelected) {
      const newSelected = selectedArray.filter(v => v !== option)
      console.log('Deselecting individual item:', option, 'New selected:', newSelected)
      onChange(newSelected)
      setLastClickedIndex(null)
      return
    }

    // Range selection logic - only when selecting and have a previous click
    if (lastClickedIndex !== null && lastClickedIndex !== index && !isCurrentlySelected) {
      const startIndex = Math.min(lastClickedIndex, index)
      const endIndex = Math.max(lastClickedIndex, index)
      const rangeItems = options.slice(startIndex, endIndex + 1)

      console.log('Range selection - items:', rangeItems)

      const newSelected = [...new Set([...selectedArray, ...rangeItems])]
      console.log('Selecting range, new selected:', newSelected)
      onChange(newSelected)
      setLastClickedIndex(null)
    } else {
      // Single item selection
      if (!isCurrentlySelected) {
        const newSelected = [...selectedArray, option]
        console.log('Selecting single item, new selected:', newSelected)
        onChange(newSelected)
        setLastClickedIndex(index)
      }
    }
  }, [options, selected, onChange, lastClickedIndex])

  const memoizedButtons = useMemo(() =>
    options.map((option, index) => {
      const selectedArray = selected || []
      const isSelected = selectedArray.includes(option)
      const isLastClicked = lastClickedIndex === index

      return (
        <button
          key={option}
          onClick={() => handleItemClick(option, index)}
          className={`
              p-3 rounded-lg border-2 text-sm font-medium transition-all duration-150
              ${isSelected
              ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-900 shadow-md transform scale-105'
              : 'border-gray-300 bg-white  hover:border-yellow-400 hover:bg-yellow-50'
            }
              ${isLastClicked ? 'ring-2 ring-yellow-400 ring-opacity-60' : ''}
            `}
          style={{
            background: isSelected ? 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)' : '#ffffff',
            borderColor: isSelected ? '#facc15' : '#d1d5db',
            color: isSelected ? '#713f12' : '#374151',
            boxShadow: isLastClicked ? '0 0 0 2px rgba(250, 204, 21, 0.6)' : isSelected ? '0 4px 12px rgba(250, 204, 21, 0.25)' : 'none'
          }}
        >
          {option}
        </button>
      )
    }), [options, selected, lastClickedIndex, handleItemClick]
  )

  return (
    <div className="space-y-3">
      <div className="text-xs p-3 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
        💡 <strong>Range Selection:</strong> Click two unselected {label.toLowerCase()} to select all items in between. Click any selected item to deselect it individually.
      </div>

      {(selected && selected.length > 0) && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <span className="text-sm font-medium text-yellow-900">
            {selected.length} {label.toLowerCase()} selected: <strong>{selected.join(', ')}</strong>
          </span>
          <button
            onClick={() => {
              onChange([])
              setLastClickedIndex(null)
            }}
            className="cursor-pointer text-xs underline hover:no-underline transition-all text-yellow-700 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      <div className={`${layout === 'grid' ? `grid ${gridCols} gap-2` : 'flex flex-wrap gap-2'}`}>
        {memoizedButtons}
      </div>
    </div>
  )
})

RangeSelectFilter.displayName = 'RangeSelectFilter'

// Diamond Type Selection Component
const DiamondTypeCard = React.memo(({ type, currentType, onTypeChange }: DiamondTypeCardProps) => {
  const isSelected = currentType === type
  const config = useMemo(() => ({
    natural: {
      icon: <Gem className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--primary)' }} />,
      title: 'Natural',
      subtitle: 'Mined diamonds',
      colors: 'border-yellow-500 bg-yellow-50',
      style: {
        backgroundColor: 'var(--primary)/10',
        borderColor: 'var(--primary)'
      }
    },
    'lab-grown': {
      icon: <Leaf className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--chart-2)' }} />,
      title: 'Lab-Grown',
      subtitle: 'Eco-friendly',
      colors: 'border-green-500 bg-green-50',
      style: {
        backgroundColor: 'var(--chart-2)/10',
        borderColor: 'var(--chart-2)'
      }
    }
  }), [])

  const selectedConfig = config[type]

  return (
    <button
      onClick={() => onTypeChange(type)}
      className={`p-4 rounded-lg border-2 transition-all ${isSelected ? selectedConfig.colors : 'border-gray-200 hover:border-gray-300'
        } ${isSelected ? 'cursor-default' : 'cursor-pointer'}`}
      style={isSelected ? selectedConfig.style : {
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        opacity: 0.8
      }}
      disabled={isSelected}
    >
      {selectedConfig.icon}
      <div className="font-medium" style={{ color: 'var(--foreground)' }}>{selectedConfig.title}</div>
      <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedConfig.subtitle}</div>
    </button>
  )
})

DiamondTypeCard.displayName = 'DiamondTypeCard'

// Category Selection Component
const CategoryCard = React.memo(({ category, currentCategory, onCategoryChange }: CategoryCardProps) => {
  const isSelected = currentCategory === category
  const config = useMemo(() => ({
    single: {
      icon: <Sparkles className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--chart-3)' }} />,
      title: 'Single Diamonds',
      subtitle: '0.30ct and above',
      colors: 'border-purple-500 bg-purple-50',
      style: {
        backgroundColor: 'var(--chart-3)/10',
        borderColor: 'var(--chart-3)'
      }
    },
    melee: {
      icon: (
        <div className="w-6 h-6 mx-auto mb-2 grid grid-cols-2 gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-current rounded-full" style={{ color: 'var(--chart-4)' }} />
          ))}
        </div>
      ),
      title: 'Melee Diamonds',
      subtitle: 'Under 0.30ct',
      colors: 'border-orange-500 bg-orange-50',
      style: {
        backgroundColor: 'var(--chart-4)/10',
        borderColor: 'var(--chart-4)'
      }
    }
  }), [])

  const selectedConfig = config[category]

  return (
    <button
      onClick={() => onCategoryChange(category)}
      className={`p-4 rounded-lg border-2 transition-all ${isSelected ? selectedConfig.colors : 'border-gray-200 hover:border-gray-300'
        } ${isSelected ? 'cursor-default' : 'cursor-pointer'}`}
      style={isSelected ? selectedConfig.style : {
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        opacity: 0.8
      }}
      disabled={isSelected}
    >
      {selectedConfig.icon}
      <div className="font-medium" style={{ color: 'var(--foreground)' }}>{selectedConfig.title}</div>
      <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedConfig.subtitle}</div>
    </button>
  )
})

CategoryCard.displayName = 'CategoryCard'

// Diamond Shapes Carousel Component
const DiamondShapesCarousel = ({ 
  title, 
  selectedShapes, 
  onShapeToggle 
}: { 
  title: string
  selectedShapes: string[]
  onShapeToggle: (shape: string) => void
}) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const visibleItems = useMemo(() => {
    // Responsive number of items based on screen size
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2
      if (window.innerWidth < 768) return 3
      if (window.innerWidth < 1024) return 4
      return 6
    }
    return 6
  }, [])

  const maxIndex = DIAMOND_SHAPES.length - visibleItems

  // Update current index based on scroll position
  const updateCurrentIndexFromScroll = useCallback(() => {
    if (!carouselRef.current) return

    const scrollLeft = carouselRef.current.scrollLeft
    const itemWidth = carouselRef.current.scrollWidth / DIAMOND_SHAPES.length
    const newIndex = Math.round(scrollLeft / itemWidth)

    // Only update if changed to avoid unnecessary re-renders
    if (newIndex !== currentIndex) {
      setCurrentIndex(Math.max(0, Math.min(newIndex, maxIndex)))
    }
  }, [currentIndex, maxIndex])

  // Scroll to a specific index
  const scrollToIndex = useCallback((index: number) => {
    if (!carouselRef.current) return

    const newIndex = Math.max(0, Math.min(index, maxIndex))
    setCurrentIndex(newIndex)

    const itemWidth = carouselRef.current.scrollWidth / DIAMOND_SHAPES.length
    carouselRef.current.scrollTo({
      left: newIndex * itemWidth,
      behavior: 'smooth'
    })
  }, [maxIndex])

  const handlePrev = useCallback(() => {
    if (currentIndex === 0) {
      // Wrap around to the end when at the beginning
      scrollToIndex(maxIndex)
    } else {
      scrollToIndex(currentIndex - 1)
    }
  }, [currentIndex, maxIndex, scrollToIndex])

  const handleNext = useCallback(() => {
    if (currentIndex >= maxIndex) {
      // Wrap around to the beginning when at the end
      scrollToIndex(0)
    } else {
      scrollToIndex(currentIndex + 1)
    }
  }, [currentIndex, maxIndex, scrollToIndex])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      handleNext()
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      handlePrev()
    }
  }

  // Add scroll event listener
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    // Debounce function to limit how often the scroll event fires
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        updateCurrentIndexFromScroll()
      }, 50)
    }

    carousel.addEventListener('scroll', handleScroll)

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll)
      }
      clearTimeout(scrollTimeout)
    }
  }, [updateCurrentIndexFromScroll])

  // Autoplay functionality
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
    }

    autoplayIntervalRef.current = setInterval(() => {
      if (currentIndex >= maxIndex) {
        // Reset to first slide when reaching the end for infinite scrolling
        scrollToIndex(0)
      } else {
        handleNext()
      }
    }, 3000) // 3 seconds interval
  }, [currentIndex, maxIndex, handleNext, scrollToIndex])

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
      autoplayIntervalRef.current = null
    }
  }, [])

  const toggleAutoplay = useCallback(() => {
    setIsAutoPlaying(prev => !prev)
  }, [])

  // Start/stop autoplay based on isAutoPlaying state
  useEffect(() => {
    if (isAutoPlaying) {
      startAutoplay()
    } else {
      stopAutoplay()
    }

    return () => {
      stopAutoplay()
    }
  }, [isAutoPlaying, startAutoplay, stopAutoplay])

  return (
    <div className="relative">
      <div className='flex justify-between items-center mb-6'>
        <h2 className="text-3xl font-bold text-left" style={{ color: 'var(--foreground)' }}>
          {title}
        </h2>
        <div className="flex gap-2 ">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full transition-colors border border-gray-200 dark:border-slate-600"
            aria-label="Previous slide"
          >
            <MoveLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-full transition-colors border border-gray-200 dark:border-slate-600"
            aria-label="Next slide"
          >
            <MoveRight className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
      </div>

      <button
        onClick={toggleAutoplay}
        className="absolute right-0 bottom-0 z-10 p-2 rounded-full transition-colors mb-2 mr-2 border border-gray-200 dark:border-slate-600"
        aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
      >
        {isAutoPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--foreground)' }}>
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--foreground)' }}>
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {DIAMOND_SHAPES.map((shape, index) => (
          <div
            key={shape.name}
            className="flex-none p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-2 snap-start"
          >
            <div
              className={`group diamond-carousel-card rounded-full h-[300px] p-3 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${selectedShapes.includes(shape.name) ? 'selected ring-2 ring-yellow-500 dark:ring-yellow-400' : ''
                }`}
              onClick={(e) => {
                e.preventDefault();
                // Toggle selection of this shape
                onShapeToggle(shape.name);
              }}
            >
              <div className="relative w-24 h-24 mb-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-125">
                <Image
                  src={shape.image}
                  alt={shape.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  priority={index < 6}
                />
              </div>
              <h3 className="text-xs font-medium pt-5 transition-colors" style={{ color: 'var(--foreground)' }}>{shape.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                ? 'bg-yellow-500 dark:bg-yellow-400 w-4 shadow-md'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

DiamondShapesCarousel.displayName = 'DiamondShapesCarousel'

// Multi-Select Filter Component
const MultiSelectFilter = React.memo(({
  options,
  selected,
  onChange,
  label,
  gridCols = 'grid-cols-3',
  colorVariant = 'yellow'
}: MultiSelectFilterProps) => {
  const colorConfig = useMemo(() => ({
    blue: 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-100',
    green: 'border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-100',
    purple: 'border-purple-500 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-100',
    yellow: 'border-yellow-500 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-100',
    orange: 'border-orange-500 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-100'
  }), [])

  const fieldMap: Record<string, keyof DiamondSearchForm> = useMemo(() => ({
    'growth method (cvd / hpht)': 'grownMethod',
    'manufacturing process': 'process',
    'fancy colors': 'fancyColors',
    'overtone': 'overtone',
    'intensity': 'intensity',
    'cut grade': 'cutGrade',
    'finish (quick select)': 'finish',
    'certification': 'certification',
    'fluorescence': 'fluorescence',
    'polish': 'polish',
    'symmetry': 'symmetry',
    'girdle': 'girdle',
    'culet': 'culet',
    'process': 'process',
    'culet size': 'culetSize',
    'origin': 'origin',
    'company': 'company',
    'location': 'location'
  }), [])

  const memoizedButtons = useMemo(() =>
    options.map(option => {
      const selectedArray = selected || []
      const isSelected = selectedArray.includes(option)
      return (
        <button
          key={option}
          onClick={() => onChange(fieldMap[label.toLowerCase()] || label.toLowerCase() as keyof DiamondSearchForm, option)}
          className={`cursor-pointer group w-full px-4 py-2 rounded-3xl text-sm font-medium transition-all duration-200
            ${isSelected
              ? colorConfig[colorVariant]
              : "bg-transparent border border-input text-foreground"
            }
            hover:bg-yellow-50 dark:hover:bg-yellow-900/30 hover:text-yellow-900 dark:hover:text-yellow-100
            hover:border-yellow-300 dark:hover:border-yellow-700
          `}
        >
          {option}
        </button>
      )
    }), [options, selected, onChange, label, fieldMap]
  )

  return (
    <div>
      <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
        {label}
      </label>
      
      {/* Selected Options Display */}
      <SelectedOptionsDisplay
        selected={selected || []}
        label={label}
        onRemove={(value) => onChange(fieldMap[label.toLowerCase()] || label.toLowerCase() as keyof DiamondSearchForm, value)}
        colorVariant={colorVariant}
      />
      
      {/* Options Grid */}
      <div className={`grid ${gridCols} gap-2 ${(selected && selected.length > 0) ? 'mt-3' : ''}`}>
        {memoizedButtons}
      </div>
    </div>
  )
})

MultiSelectFilter.displayName = 'MultiSelectFilter'

// Selected Options Display Component
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

  const colors = colorConfig[colorVariant]

  if (!selected || selected.length === 0) return null

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${colors.bg} border ${colors.border} shadow-sm`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <svg className={`w-5 h-5 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className={`text-sm font-bold ${colors.text}`}>
            {selected.length} {label}{selected.length > 1 ? 's' : ''} Selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {selected.map((option) => (
            <div
              key={option}
              className={`inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full border ${colors.badge} shadow-sm`}
            >
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {option}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(option)
                }}
                className="cursor-pointer ml-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                title={`Remove ${option}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => selected.slice().forEach(val => onRemove(val))}
        className="cursor-pointer ml-4 flex-shrink-0 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all border border-red-200 dark:border-red-800"
      >
        Clear All
      </button>
    </div>
  )
})

SelectedOptionsDisplay.displayName = 'SelectedOptionsDisplay'

// Range Input Component
const RangeInput = React.memo(({
  label,
  min,
  max,
  onMinChange,
  onMaxChange,
  unit = '',
  step = 1
}: {
  label: string
  min: number
  max: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  unit?: string
  step?: number
}) => {
  // Local state for smooth UI interaction
  const [localMin, setLocalMin] = useState(min)
  const [localMax, setLocalMax] = useState(max)

  // Sync local state with props when props change
  useEffect(() => {
    setLocalMin(min)
  }, [min])

  useEffect(() => {
    setLocalMax(max)
  }, [max])

  // Determine appropriate min/max bounds based on label
  const getDefaultBounds = () => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('price per carat')) return { minBound: 0, maxBound: 200000 };
    if (lowerLabel.includes('price per pcs')) return { minBound: 0, maxBound: 200000 };
    if (lowerLabel.includes('price')) return { minBound: 0, maxBound: 200000 };
    if (lowerLabel.includes('carat')) return { minBound: 0, maxBound: 10 };
    if (lowerLabel.includes('total pcs')) return { minBound: 1, maxBound: 1000 };
    if (lowerLabel.includes('table') || lowerLabel.includes('depth')) return { minBound: 0, maxBound: 100 };
    if (lowerLabel.includes('length') || lowerLabel.includes('width') || lowerLabel.includes('height')) return { minBound: 0, maxBound: 20 };
    if (lowerLabel.includes('ratio')) return { minBound: 0, maxBound: 3 };
    if (lowerLabel.includes('angle')) return { minBound: 0, maxBound: 50 };
    return { minBound: 0, maxBound: 100 };
  }

  const { minBound, maxBound } = getDefaultBounds()

  // Handle slider change (update local state immediately)
  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setLocalMin(value[0])
      setLocalMax(value[1])
    }
  }

  // Handle slider release (update parent)
  const handleSliderAfterChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      onMinChange(value[0])
      onMaxChange(value[1])
    }
  }

  // Handle text input changes
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty string for typing
    if (e.target.value === '') {
      setLocalMin(minBound); // Or handle empty state differently?
      return;
    }
    const val = parseFloat(e.target.value);
    setLocalMin(val);
  };
  
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setLocalMax(maxBound);
      return;
    }
    const val = parseFloat(e.target.value);
    setLocalMax(val);
  };

  const handleMinInputBlur = () => {
    let val = localMin;
    if (isNaN(val) || val < minBound) val = minBound;
    if (val > localMax) val = localMax;
    setLocalMin(val);
    onMinChange(val);
  };

  const handleMaxInputBlur = () => {
    let val = localMax;
    if (isNaN(val) || val > maxBound) val = maxBound;
    if (val < localMin) val = localMin;
    setLocalMax(val);
    onMaxChange(val);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        <button
          onClick={() => {
            onMinChange(minBound);
            onMaxChange(maxBound);
          }}
          className="cursor-pointer text-xs px-3 py-1 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
        >
          Clear
        </button>
      </div>
      
      {/* Range Display */}
      <div className="flex items-center justify-between px-2">
        <span className="text-sm font-semibold dark:text-gray-300">
          {localMin.toLocaleString()}{unit}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">to</span>
        <span className="text-sm font-semibold dark:text-gray-300">
          {localMax.toLocaleString()}{unit}
        </span>
      </div>

      {/* RC Slider */}
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
            {
              backgroundColor: '#ffffff',
              borderColor: '#eab308',
              borderWidth: 2,
              height: 20,
              width: 20,
              marginTop: -8,
              opacity: 1,
              boxShadow: '0 4px 6px -1px rgba(234, 179, 8, 0.4), 0 2px 4px -1px rgba(234, 179, 8, 0.2)'
            },
            {
              backgroundColor: '#ffffff',
              borderColor: '#eab308',
              borderWidth: 2,
              height: 20,
              width: 20,
              marginTop: -8,
              opacity: 1,
              boxShadow: '0 4px 6px -1px rgba(234, 179, 8, 0.4), 0 2px 4px -1px rgba(234, 179, 8, 0.2)'
            }
          ]}
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
            step={step}
            min={minBound}
            max={maxBound}
            value={localMin}
            onChange={handleMinInputChange}
            onBlur={handleMinInputBlur}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-xs mb-1.5 text-gray-600 dark:text-gray-400">
            Maximum{unit && ` (${unit})`}
          </label>
          <input
            type="number"
            step={step}
            min={minBound}
            max={maxBound}
            value={localMax}
            onChange={handleMaxInputChange}
            onBlur={handleMaxInputBlur}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  )
})

RangeInput.displayName = 'RangeInput'

// Search Input Component for Company/Location
const SearchInput = React.memo(({
  label,
  placeholder,
  selected,
  onAdd,
  onRemove
}: {
  label: string
  placeholder: string
  selected: string[]
  onAdd: (value: string) => void
  onRemove: (value: string) => void
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = useCallback(() => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim())
      setInputValue('')
    }
  }, [inputValue, onAdd])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }, [handleAdd])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          {label}
        </label>
        {selected.length > 0 && (
          <button
            onClick={() => selected.slice().forEach(item => onRemove(item))}
            className="cursor-pointer text-xs px-3 py-1 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 p-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
        />
        <button
          onClick={handleAdd}
          className="cursor-pointer px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Add
        </button>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                className="cursor-pointer text-yellow-600 hover:text-yellow-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
})

SearchInput.displayName = 'SearchInput'

// Sieve Size Table Component for Melee Diamonds
const SieveSizeTable = React.memo(({
  selectedSizes,
  onSizeToggle,
  rangeMode,
  rangeStart,
  onRangeModeToggle,
  onSelectAll
}: {
  selectedSizes: string[]
  onSizeToggle: (mm: string) => void
  rangeMode: boolean
  rangeStart: string | null
  onRangeModeToggle: () => void
  onSelectAll: () => void
}) => {
  const mmToPx = (mm: string): number => {
    // Convert mm to pixels with better scaling for visual representation
    // Using 10px per mm for more realistic proportions
    // Range: 0.80mm (8px) to 3.40mm (34px)
    const mmValue = parseFloat(mm);
    const pxValue = mmValue * 10;
    // Ensure minimum visibility and reasonable maximum
    return Math.max(8, Math.min(40, pxValue));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          Sieve Size
        </label>
        <div className="flex gap-2">
          <button
            onClick={onRangeModeToggle}
            className={`text-xs px-3 py-1 rounded-full transition-all ${
              rangeMode
                ? 'bg-yellow-500 text-white'
                : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
            }`}
          >
            {rangeMode ? 'Cancel Range' : 'Select Range'}
          </button>
          <button
            onClick={onSelectAll}
            className="text-xs px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-all"
          >
            Select All
          </button>
        </div>
      </div>

      {/* Selected sizes display at top */}
      {selectedSizes.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-300 dark:border-yellow-700 shadow-sm">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-bold text-yellow-800 dark:text-yellow-300">
                {selectedSizes.length} Sieve Size{selectedSizes.length > 1 ? 's' : ''} Selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSizes.map((size) => {
                const sieveData = SIEVE_DATA.find(item => item.mm === size)
                return (
                  <div
                    key={size}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full border border-yellow-400 dark:border-yellow-600 shadow-sm"
                  >
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {size}mm
                    </span>
                    {sieveData && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({sieveData.sieve} • {sieveData.cts}ct)
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSizeToggle(size)
                      }}
                      className="cursor-pointer ml-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      title="Remove this size"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
          <button
            onClick={() => selectedSizes.forEach(size => onSizeToggle(size))}
            className="cursor-pointer ml-4 flex-shrink-0 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all border border-red-200 dark:border-red-800"
          >
            Clear All
          </button>
        </div>
      )}
      
      {/* Table Header */}
      <div className="flex font-medium bg-gray-50 dark:bg-gray-800 rounded-t-md border border-gray-200 dark:border-gray-700">
        <div className="flex-1 p-2.5 text-sm text-gray-600 dark:text-gray-300 border-r dark:border-gray-700">Sieve</div>
        <div className="flex-1 p-2.5 text-sm text-gray-600 dark:text-gray-300 border-r dark:border-gray-700">MM</div>
        <div className="flex-1 p-2.5 text-sm text-gray-600 dark:text-gray-300 border-r dark:border-gray-700">Carat</div>
        <div className="w-[25%] p-2.5 text-sm text-gray-600 dark:text-gray-300">Visual Size</div>
      </div>

      {/* Scrollable Table Body */}
      <div className="border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-md overflow-hidden">
        <div className="max-h-[300px] overflow-y-auto">
          {SIEVE_DATA.map((item, index) => {
            const isSelected = selectedSizes.includes(item.mm);
            const isRangeStart = rangeMode && rangeStart === item.mm;
            const pxValue = mmToPx(item.mm);

            return (
              <div
                key={item.mm}
                className={`flex items-center cursor-pointer transition-all duration-200 ${
                  isRangeStart
                    ? 'bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 shadow-sm ring-2 ring-yellow-300 dark:ring-yellow-700'
                    : isSelected
                    ? 'bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 shadow-sm'
                    : index % 2 === 0 
                      ? 'bg-white dark:bg-black hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                      : 'bg-gray-50/50 dark:bg-slate-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                }`}
                onClick={() => onSizeToggle(item.mm)}
              >
                <div className={`flex-1 px-3 py-2 text-sm transition-colors ${
                  isRangeStart || isSelected
                    ? 'text-white dark:text-white font-semibold'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {item.sieve}
                </div>
                <div className={`flex-1 px-3 py-2 text-sm transition-colors ${
                  isRangeStart || isSelected
                    ? 'text-white dark:text-white font-semibold'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {item.mm}
                </div>
                <div className={`flex-1 px-3 py-2 text-sm transition-colors ${
                  isRangeStart || isSelected
                    ? 'text-white dark:text-white font-semibold'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {item.cts}
                </div>
                <div className={`flex justify-center items-center w-[25%] py-3 transition-colors ${
                  isRangeStart ? 'bg-yellow-500 dark:bg-yellow-600' : isSelected ? 'bg-yellow-500 dark:bg-yellow-600' : ''
                }`}>
                  <div
                    className={`rounded-full transition-all duration-200 ${
                      isRangeStart
                        ? 'border-2 border-white dark:border-white bg-yellow-50 dark:bg-yellow-100 shadow-md'
                        : isSelected
                        ? 'border-2 border-white dark:border-white bg-yellow-50 dark:bg-yellow-100 shadow-md'
                        : 'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                    style={{
                      height: `${pxValue}px`,
                      width: `${pxValue}px`,
                      minHeight: '8px',
                      minWidth: '8px'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Help text */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        💡 Click on sizes to select or deselect them. Visual circles show relative size.
      </div>
    </div>
  );
});

SieveSizeTable.displayName = 'SieveSizeTable';

// Main Component
export default function DiamondsSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showAllShapes, setShowAllShapes] = useState(false)

  // Read URL parameters
  const urlDiamondType = searchParams.get('diamondType') as 'natural' | 'lab-grown' || 'natural'
  const urlCategory = searchParams.get('category') as 'single' | 'melee' || 'single'

  const [searchForm, setSearchForm] = useState<DiamondSearchForm>(
    () => DiamondSearchHelpers.getDefaultSearchForm(urlDiamondType, urlCategory)
  )
  const [colorRangeMode, setColorRangeMode] = useState(false);
  const [colorRangeStart, setColorRangeStart] = useState<string | null>(null);
  const [clarityRangeMode, setClarityRangeMode] = useState(false);
  const [clarityRangeStart, setClarityRangeStart] = useState<string | null>(null);
  const [sieveRangeMode, setSieveRangeMode] = useState(false);
  const [sieveRangeStart, setSieveRangeStart] = useState<string | null>(null);
  const [gridleRangeError, setGridleRangeError] = useState<string>('');

  // Update state when URL parameters change
  useEffect(() => {
    const newDiamondType = searchParams.get('diamondType') as 'natural' | 'lab-grown' || 'natural'
    const newCategory = searchParams.get('category') as 'single' | 'melee' || 'single'

    if (newDiamondType !== searchForm.diamondType || newCategory !== searchForm.category) {
      setSearchForm(DiamondSearchHelpers.getDefaultSearchForm(newDiamondType, newCategory))
    }
  }, [searchParams, searchForm.diamondType, searchForm.category])

  // Handlers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDiamondTypeChange = useCallback((type: 'natural' | 'lab-grown') => {
    const newCaratRange = DiamondSearchHelpers.getCaratRange(searchForm.category)
    const newPriceRange = DiamondSearchHelpers.getPriceRange(type, searchForm.category)
    const newPricePerPcsRange = DiamondSearchHelpers.getPricePerPcsRange(type, searchForm.category)
    const newPricePerCaratRange = DiamondSearchHelpers.getPricePerCaratRange(type, searchForm.category)

    setSearchForm(prev => ({
      ...prev,
      diamondType: type,
      caratWeight: newCaratRange,
      priceRange: newPriceRange,
      pricePerPcs: newPricePerPcsRange,
      pricePerCarat: newPricePerCaratRange
    }))
  }, [searchForm.category])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCategoryChange = useCallback((category: 'single' | 'melee') => {
    const newCaratRange = DiamondSearchHelpers.getCaratRange(category)
    const newPriceRange = DiamondSearchHelpers.getPriceRange(searchForm.diamondType, category)
    const newPricePerPcsRange = DiamondSearchHelpers.getPricePerPcsRange(searchForm.diamondType, category)
    const newPricePerCaratRange = DiamondSearchHelpers.getPricePerCaratRange(searchForm.diamondType, category)

    setSearchForm(prev => ({
      ...prev,
      category,
      caratWeight: newCaratRange,
      priceRange: newPriceRange,
      pricePerPcs: newPricePerPcsRange,
      pricePerCarat: newPricePerCaratRange
    }))
  }, [searchForm.diamondType])

  // Corresponding grades for finish quick select
  const correspondingGrades = useMemo<Record<string, { cutGrade: string[]; polish: string[]; symmetry: string[] }>>(() => ({
    "3X": {
      cutGrade: ["Excellent", "Ideal"],
      polish: ["Excellent", "Ideal"],
      symmetry: ["Excellent", "Ideal"],
    },
    "EX-": {
      cutGrade: ["Excellent", "Very Good"],
      polish: ["Excellent", "Very Good"],
      symmetry: ["Excellent", "Very Good"],
    },
    "VG+": {
      cutGrade: ["Very Good"],
      polish: ["Very Good"],
      symmetry: ["Very Good"],
    },
    "VG-": {
      cutGrade: ["Very Good", "Good"],
      polish: ["Very Good", "Good"],
      symmetry: ["Very Good", "Good"],
    },
  }), [])

  const handleMultiSelect = useCallback((field: keyof DiamondSearchForm, value: string) => {
    // Special handling for finish field
    if (field === 'finish') {
      const isAlreadySelected = searchForm.finish?.includes(value)
      const currentFinishes = searchForm.finish || []

      if (isAlreadySelected) {
        // Remove from finish
        const updatedFinishes = currentFinishes.filter(f => f !== value)
        
        setSearchForm(prev => ({
          ...prev,
          finish: updatedFinishes
        }))

        // If no finish grades selected, clear cut/polish/symmetry
        if (updatedFinishes.every(f => !correspondingGrades[f])) {
          setSearchForm(prev => ({
            ...prev,
            cutGrade: [],
            polish: [],
            symmetry: []
          }))
        }
      } else if (correspondingGrades[value]) {
        // Add to finish and update corresponding grades
        const grades = correspondingGrades[value]
        const updatedFinishes = [...currentFinishes, value]

        setSearchForm(prev => ({
          ...prev,
          finish: updatedFinishes,
          cutGrade: grades.cutGrade,
          polish: grades.polish,
          symmetry: grades.symmetry
        }))
      } else {
        // Regular finish selection (non-quick select)
        setSearchForm(prev => {
          const currentArray = (prev.finish as string[]) || []
          return {
            ...prev,
            finish: currentArray.includes(value)
              ? currentArray.filter(item => item !== value)
              : [...currentArray, value]
          }
        })
      }
      return
    }

    // Regular multi-select for other fields
    setSearchForm(prev => {
      const currentArray = (prev[field] as string[]) || []
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      }
    })
  }, [searchForm.finish, correspondingGrades])

  // Handle color range selection
  const handleColorClick = useCallback((clickedColor: string) => {
    if (colorRangeMode) {
      // Range selection mode
      if (!colorRangeStart) {
        // First click - set start
        setColorRangeStart(clickedColor)
        handleMultiSelect('color', clickedColor)
      } else {
        // Second click - select range and exit mode
        const colorValues = DIAMOND_CONSTANTS.COLORS
        const startIndex = colorValues.indexOf(colorRangeStart)
        const endIndex = colorValues.indexOf(clickedColor)

        const [minIndex, maxIndex] = startIndex < endIndex 
          ? [startIndex, endIndex] 
          : [endIndex, startIndex]

        const rangeItems = colorValues.slice(minIndex, maxIndex + 1)
        const currentColors = (searchForm.color || []) as string[]
        const newColors = [...new Set([...currentColors, ...rangeItems])]
        
        setSearchForm(prev => ({
          ...prev,
          color: newColors
        }))
        
        setColorRangeMode(false)
        setColorRangeStart(null)
      }
    } else {
      // Regular toggle
      handleMultiSelect('color', clickedColor)
    }
  }, [colorRangeMode, colorRangeStart, searchForm.color, handleMultiSelect])

  // Handle clarity range selection
  const handleClarityClick = useCallback((clickedClarity: string) => {
    if (clarityRangeMode) {
      // Range selection mode
      if (!clarityRangeStart) {
        // First click - set start
        setClarityRangeStart(clickedClarity)
        handleMultiSelect('clarity', clickedClarity)
      } else {
        // Second click - select range and exit mode
        const clarityValues = DIAMOND_CONSTANTS.CLARITIES
        const startIndex = clarityValues.indexOf(clarityRangeStart)
        const endIndex = clarityValues.indexOf(clickedClarity)

        const [minIndex, maxIndex] = startIndex < endIndex 
          ? [startIndex, endIndex] 
          : [endIndex, startIndex]

        const rangeItems = clarityValues.slice(minIndex, maxIndex + 1)
        const currentClarities = (searchForm.clarity || []) as string[]
        const newClarities = [...new Set([...currentClarities, ...rangeItems])]
        
        setSearchForm(prev => ({
          ...prev,
          clarity: newClarities
        }))
        
        setClarityRangeMode(false)
        setClarityRangeStart(null)
      }
    } else {
      // Regular toggle
      handleMultiSelect('clarity', clickedClarity)
    }
  }, [clarityRangeMode, clarityRangeStart, searchForm.clarity, handleMultiSelect])

  // Handle sieve size toggle with range support
  const handleSieveSizeToggle = useCallback((mm: string) => {
    if (sieveRangeMode) {
      // Range selection mode
      if (!sieveRangeStart) {
        // First click - set start
        setSieveRangeStart(mm)
        // Add to selection if not already selected
        const currentSizes = searchForm.sieveSizes || []
        if (!currentSizes.includes(mm)) {
          setSearchForm(prev => ({
            ...prev,
            sieveSizes: [...currentSizes, mm]
          }))
        }
      } else {
        // Second click - select range and exit mode
        const sieveValues = SIEVE_DATA.map(item => item.mm)
        const startIndex = sieveValues.indexOf(sieveRangeStart)
        const endIndex = sieveValues.indexOf(mm)

        if (startIndex === -1 || endIndex === -1) {
          console.error('Invalid sieve range selection')
          return
        }

        const [minIndex, maxIndex] = startIndex < endIndex 
          ? [startIndex, endIndex] 
          : [endIndex, startIndex]

        const rangeItems = sieveValues.slice(minIndex, maxIndex + 1)
        const currentSizes = (searchForm.sieveSizes || []) as string[]
        const newSizes = [...new Set([...currentSizes, ...rangeItems])]
        
        setSearchForm(prev => ({
          ...prev,
          sieveSizes: newSizes
        }))
        
        setSieveRangeMode(false)
        setSieveRangeStart(null)
      }
    } else {
      // Regular toggle
      setSearchForm(prev => {
        const currentSizes = prev.sieveSizes || []
        const newSizes = currentSizes.includes(mm)
          ? currentSizes.filter(size => size !== mm)
          : [...currentSizes, mm]
        return {
          ...prev,
          sieveSizes: newSizes
        }
      })
    }
  }, [sieveRangeMode, sieveRangeStart, searchForm.sieveSizes])

  const handleRangeChange = useCallback((field: keyof DiamondSearchForm, type: 'min' | 'max', value: number) => {
    setSearchForm(prev => {
      console.log('Previous value:', prev[field]);
      const newForm = {
        ...prev,
        [field]: {
          ...(prev[field] as { min: number; max: number }),
          [type]: value
        }
      };
      console.log('New value:', newForm[field]);
      return newForm;
    });
  }, [])

  const handleStringRangeChange = useCallback((field: keyof DiamondSearchForm, type: 'min' | 'max', value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as { min: string; max: string }),
        [type]: value
      }
    }))
  }, [])

  const handleAddToArray = useCallback((field: keyof DiamondSearchForm, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value]
    }))
  }, [])

  const handleRemoveFromArray = useCallback((field: keyof DiamondSearchForm, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter(item => item !== value)
    }))
  }, [])

  const handleSearch = useCallback(() => {
    const params = DiamondSearchHelpers.buildQueryParams(searchForm)
    const resultsUrl = `/diamonds/${searchForm.diamondType}/${searchForm.category}?${params.toString()}`
    router.push(resultsUrl)
  }, [searchForm, router])

  const resetFilters = useCallback(() => {
    setSearchForm(DiamondSearchHelpers.getDefaultSearchForm(searchForm.diamondType, searchForm.category))
  }, [searchForm.diamondType, searchForm.category])

  const isDefaultFilters = useMemo(() => {
    const def = DiamondSearchHelpers.getDefaultSearchForm(searchForm.diamondType, searchForm.category)
    try {
      return JSON.stringify(def) === JSON.stringify(searchForm)
    } catch {
      return false
    }
  }, [searchForm])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Navigation */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-black/70 shadow-lg">
        <NavigationUser />
      </div>

      <div className="w-full py-7 ">
        <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4`}>

          <DiamondShapesCarousel 
            title="Select Diamond Shapes" 
            selectedShapes={searchForm.shape || []}
            onShapeToggle={(shape) => handleMultiSelect('shape', shape)}
          />
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
          {/* <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Diamond Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <DiamondTypeCard
                  type="natural"
                  currentType={searchForm.diamondType}
                  onTypeChange={handleDiamondTypeChange}
                />
                <DiamondTypeCard
                  type="lab-grown"
                  currentType={searchForm.diamondType}
                  onTypeChange={handleDiamondTypeChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Diamond Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <CategoryCard
                  category="single"
                  currentCategory={searchForm.category}
                  onCategoryChange={handleCategoryChange}
                />
                <CategoryCard
                  category="melee"
                  currentCategory={searchForm.category}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
            </div>
          </div> */}

          {/* Growth Method - Only for Lab-Grown */}
          {searchForm.diamondType === 'lab-grown' && (
            <div className='mb-6'>
              <MultiSelectFilter
                options={DIAMOND_CONSTANTS.GROWTH_METHODS}
                selected={searchForm.grownMethod}
                onChange={handleMultiSelect}
                label="Growth Method (CVD / HPHT)"
                gridCols="grid-cols-2"
                colorVariant="green"
              />
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 ml-4">
                <span className="inline-flex items-center">
                  💡 CVD: Chemical Vapor Deposition | HPHT: High Pressure High Temperature
                </span>
              </div>
            </div>
          )}

          {/* Basic Filters */}
          <div className="space-y-6">
            {/* Shape Selection */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                Shape ({DIAMOND_CONSTANTS.SHAPES.length} shapes available)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                {DIAMOND_CONSTANTS.SHAPES.slice(0, showAllShapes ? DIAMOND_CONSTANTS.SHAPES.length : 16).map((shape) => {
                  const isSelected = (searchForm.shape || []).includes(shape)
                  const IconComponent = SHAPE_ICONS[shape] || DefaultIcon
                  return (
                    <button
                      key={shape}
                      onClick={() => handleMultiSelect('shape', shape)}
                      className={`cursor-pointer flex flex-col items-center gap-2 px-3 py-3 rounded-lg text-xs font-medium transition-all ${isSelected
                        ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-500 shadow-sm text-yellow-700 dark:text-yellow-400'
                        : 'bg-transparent border border-gray-200 dark:border-slate-700 hover:border-yellow-400'
                        }`}
                      title={shape}
                    >
                      <div className={`w-10 h-10 ${!isSelected ? 'dark:invert' : ''}`}>
                        <IconComponent className="w-full h-full" />
                      </div>
                      <span className={`text-center leading-tight`}>{shape}</span>
                    </button>
                  )
                })}
              </div>

              {/* Show More/Less Button */}
              {DIAMOND_CONSTANTS.SHAPES.length > 16 && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setShowAllShapes(!showAllShapes)}
                    className="px-6 py-2 text-sm font-medium text-yellow-600 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-all duration-200 flex items-center gap-2"
                  >
                    {showAllShapes ? (
                      <>
                        <span>Show Less Shapes</span>
                        <ChevronDown className="w-4 h-4 rotate-180 transition-transform" />
                      </>
                    ) : (
                      <>
                        <span>Show More Shapes ({DIAMOND_CONSTANTS.SHAPES.length - 16} more)</span>
                        <ChevronDown className="w-4 h-4 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {(searchForm.shape || []).length > 0 && (
                <div className="mt-3">
                  <SelectedOptionsDisplay
                    selected={searchForm.shape || []}
                    label="Shape"
                    onRemove={(shape) => handleMultiSelect('shape', shape)}
                    colorVariant="yellow"
                  />
                </div>
              )}
            </div>

            {/* Carat and Price Range - All 5 filters for melee diamonds */}
            <div>
              {/* Header with Deselect All button */}
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  Range Filters
                </label>
                {(() => {
                  const defaultForm = DiamondSearchHelpers.getDefaultSearchForm(searchForm.diamondType, searchForm.category);
                  const isCaratModified = searchForm.caratWeight.min !== defaultForm.caratWeight.min || searchForm.caratWeight.max !== defaultForm.caratWeight.max;
                  const isPriceModified = searchForm.priceRange.min !== defaultForm.priceRange.min || searchForm.priceRange.max !== defaultForm.priceRange.max;
                  const isTotalPcsModified = searchForm.category === 'melee' && (searchForm.totalPcs.min !== defaultForm.totalPcs.min || searchForm.totalPcs.max !== defaultForm.totalPcs.max);
                  const isPricePerPcsModified = searchForm.category === 'melee' && (searchForm.pricePerPcs.min !== defaultForm.pricePerPcs.min || searchForm.pricePerPcs.max !== defaultForm.pricePerPcs.max);
                  const isPricePerCaratModified = searchForm.category === 'melee' && (searchForm.pricePerCarat.min !== defaultForm.pricePerCarat.min || searchForm.pricePerCarat.max !== defaultForm.pricePerCarat.max);
                  const hasAnyRangeFilter = isCaratModified || isPriceModified || isTotalPcsModified || isPricePerPcsModified || isPricePerCaratModified;
                  
                  return hasAnyRangeFilter ? (
                    <button
                      onClick={() => {
                        setSearchForm(prev => ({
                          ...prev,
                          caratWeight: defaultForm.caratWeight,
                          priceRange: defaultForm.priceRange,
                          ...(searchForm.category === 'melee' && {
                            totalPcs: defaultForm.totalPcs,
                            pricePerPcs: defaultForm.pricePerPcs,
                            pricePerCarat: defaultForm.pricePerCarat
                          })
                        }));
                      }}
                      className="cursor-pointer text-xs px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
                    >
                      Deselect All
                    </button>
                  ) : null;
                })()}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                <RangeInput
                  label="Total Carat"
                  min={searchForm.caratWeight.min}
                  max={searchForm.caratWeight.max}
                  onMinChange={(value) => handleRangeChange('caratWeight', 'min', value)}
                  onMaxChange={(value) => handleRangeChange('caratWeight', 'max', value)}
                  unit=" ct"
                  step={0.01}
                />

                <RangeInput
                  label="Total Price"
                  min={searchForm.priceRange.min}
                  max={searchForm.priceRange.max}
                  onMinChange={(value) => handleRangeChange('priceRange', 'min', value)}
                  onMaxChange={(value) => handleRangeChange('priceRange', 'max', value)}
                  unit="$"
                  step={1000}
                />

                {/* Only show Total Pcs, Price per Pcs, and Price per Carat for melee diamonds */}
                {searchForm.category === 'melee' && (
                  <>
                    <RangeInput
                      label="Total Pcs"
                      min={searchForm.totalPcs.min}
                      max={searchForm.totalPcs.max}
                      onMinChange={(value) => handleRangeChange('totalPcs', 'min', value)}
                      onMaxChange={(value) => handleRangeChange('totalPcs', 'max', value)}
                      unit=" pcs"
                      step={1}
                    />

                    <RangeInput
                      label="Price per Pcs"
                      min={searchForm.pricePerPcs.min}
                      max={searchForm.pricePerPcs.max}
                      onMinChange={(value) => handleRangeChange('pricePerPcs', 'min', value)}
                      onMaxChange={(value) => handleRangeChange('pricePerPcs', 'max', value)}
                      unit="$"
                      step={1000}
                    />

                    <RangeInput
                      label="Price per Carat"
                      min={searchForm.pricePerCarat.min}
                      max={searchForm.pricePerCarat.max}
                      onMinChange={(value) => handleRangeChange('pricePerCarat', 'min', value)}
                      onMaxChange={(value) => handleRangeChange('pricePerCarat', 'max', value)}
                      unit="$"
                      step={1000}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Color */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  Color
                </label>
                {!searchForm.isFancyColor && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setColorRangeMode(!colorRangeMode)
                        setColorRangeStart(null)
                      }}
                      className={`cursor-pointer text-xs px-3 py-1 rounded-full transition-all ${
                        colorRangeMode
                          ? 'bg-yellow-500 text-white'
                          : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
                      }`}
                    >
                      {colorRangeMode ? 'Cancel Range' : 'Select Range'}
                    </button>
                    <button
                      onClick={() => {
                        const allColors = DIAMOND_CONSTANTS.COLORS
                        setSearchForm(prev => ({
                          ...prev,
                          color: allColors
                        }))
                      }}
                      className="cursor-pointer text-xs px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-all"
                    >
                      Select All
                    </button>
                  </div>
                )}
              </div>

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
                  >
                    Fancy
                  </button>
                </div>
              </div>

              {/* Selected Colors Display */}
              {!searchForm.isFancyColor && (searchForm.color || []).length > 0 && (
                <div className="mb-4">
                  <SelectedOptionsDisplay
                    selected={searchForm.color || []}
                    label="Color"
                    onRemove={(color) => handleMultiSelect('color', color)}
                    colorVariant="yellow"
                  />
                </div>
              )}

              {searchForm.isFancyColor ? (
                <div className="space-y-6">
                  {/* Selected Fancy Colors Display */}
                  {(searchForm.fancyColors || []).length > 0 && (
                    <SelectedOptionsDisplay
                      selected={searchForm.fancyColors || []}
                      label="Fancy Color"
                      onRemove={(color) => handleMultiSelect('fancyColors', color)}
                      colorVariant="orange"
                    />
                  )}

                  {/* Fancy Colors with Color Circles */}
                  <div>
                    <label className="block text-sm font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                      Fancy Colors
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
                      {DIAMOND_CONSTANTS.FANCY_COLORS.map((color) => {
                        const isSelected = searchForm.fancyColors.includes(color.name)
                        return (
                          <button
                            key={color.name}
                            onClick={() => handleMultiSelect('fancyColors', color.name)}
                            className={`cursor-pointer group relative p-4 rounded-2xl transition-all duration-200 border
                              ${isSelected
                                ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500 dark:border-yellow-500 shadow-lg"
                                : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:border-yellow-400 dark:hover:border-yellow-600 hover:shadow-md hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10"
                              }
                            `}
                          >
                            <div className="flex flex-col items-center gap-2.5">
                              <div
                                className={`w-10 h-10 rounded-full shadow-lg ring-2 transition-all duration-200
                                  ${isSelected 
                                    ? "ring-yellow-400 dark:ring-yellow-500 ring-offset-2 dark:ring-offset-slate-800 scale-105" 
                                    : "ring-gray-200 dark:ring-slate-600 ring-offset-1 dark:ring-offset-slate-800 group-hover:scale-110 group-hover:ring-yellow-300"
                                  }
                                `}
                                style={{ background: color.color }}
                              />
                              <span
                                className={`text-[11px] font-semibold text-center leading-tight transition-colors ${isSelected
                                  ? "text-yellow-700 dark:text-yellow-400"
                                  : "text-gray-600 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-500"
                                  }`}
                              >
                                {color.name}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <MultiSelectFilter
                    options={DIAMOND_CONSTANTS.OVERTONE_OPTIONS}
                    selected={searchForm.overtone}
                    onChange={handleMultiSelect}
                    label="Overtone"
                    gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                    colorVariant="purple"
                  />
                  <MultiSelectFilter
                    options={DIAMOND_CONSTANTS.INTENSITY_OPTIONS}
                    selected={searchForm.intensity}
                    onChange={handleMultiSelect}
                    label="Intensity"
                    gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                    colorVariant="orange"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                  {DIAMOND_CONSTANTS.COLORS.map((color) => {
                    const isSelected = (searchForm.color || []).includes(color)
                    const isRangeStart = colorRangeMode && colorRangeStart === color
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorClick(color)}
                        className={`cursor-pointer px-4 py-2.5 rounded-3xl text-sm font-medium transition-all duration-200 border ${
                          isRangeStart
                            ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100 border-yellow-500 ring-2 ring-yellow-300 shadow-md'
                            :
                          isSelected
                            ? 'bg-yellow-50 dark:bg-yellow-900/30 text-gray-900 dark:text-gray-100 border-yellow-500 dark:border-yellow-500 shadow-sm'
                            : 'dark:bg-slate-800 border-gray-300 dark:border-slate-600 dark:text-gray-300 hover:text-black hover:bg-yellow-50  dark:hover:bg-yellow-900/20 hover:border-yellow-400 dark:hover:border-yellow-600 hover:shadow-sm'
                        }`}
                      >
                        {color}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Clarity */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  Clarity
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setClarityRangeMode(!clarityRangeMode)
                      setClarityRangeStart(null)
                    }}
                    className={`cursor-pointer text-xs px-3 py-1 rounded-full transition-all ${
                      clarityRangeMode
                        ? 'bg-yellow-500 text-white'
                        : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
                    }`}
                  >
                    {clarityRangeMode ? 'Cancel Range' : 'Select Range'}
                  </button>
                  <button
                    onClick={() => {
                      const allClarities = DIAMOND_CONSTANTS.CLARITIES
                      setSearchForm(prev => ({
                        ...prev,
                        clarity: allClarities
                      }))
                    }}
                    className="cursor-pointer text-xs px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-all"
                  >
                    Select All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {DIAMOND_CONSTANTS.CLARITIES.map((clarity) => {
                  const isSelected = (searchForm.clarity || []).includes(clarity)
                  const isRangeStart = clarityRangeMode && clarityRangeStart === clarity
                  return (
                    <button
                      key={clarity}
                      onClick={() => handleClarityClick(clarity)}
                      className={`cursor-pointer px-4 py-2.5 rounded-3xl text-sm font-medium transition-all duration-200 border ${
                        isRangeStart
                          ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100 border-yellow-500 ring-2 ring-yellow-300 shadow-md'
                          :
                        isSelected
                          ? 'bg-yellow-50 dark:bg-yellow-900/30 text-gray-900 dark:text-gray-100 border-yellow-500 dark:border-yellow-500 shadow-sm'
                          : 'dark:bg-slate-800 border-gray-300 dark:border-slate-600 dark:text-gray-300 hover:text-black hover:bg-yellow-50  dark:hover:bg-yellow-900/20 hover:border-yellow-400 dark:hover:border-yellow-600 hover:shadow-sm'
                      }`}
                    >
                      {clarity}
                    </button>
                  )
                })}
              </div>

              {(searchForm.clarity || []).length > 0 && (
                <div className="mt-3">
                  <SelectedOptionsDisplay
                    selected={searchForm.clarity || []}
                    label="Clarity"
                    onRemove={(clarity) => handleMultiSelect('clarity', clarity)}
                    colorVariant="purple"
                  />
                </div>
              )}
            </div>

            
            <MultiSelectFilter
              options={DIAMOND_CONSTANTS.FINISH_OPTIONS}
              selected={searchForm.finish}
              onChange={handleMultiSelect}
              label="Finish (Quick Select)"
              gridCols="grid-cols-2 md:grid-cols-5"
              colorVariant="purple"
            />

            {/* Cut Grade, Finish, Certification, Fluorescence */}
            <MultiSelectFilter
              options={DIAMOND_CONSTANTS.CUTS}
              selected={searchForm.cutGrade}
              onChange={handleMultiSelect}
              label="Cut Grade"
              gridCols="grid-cols-3 md:grid-cols-6"
              colorVariant="green"
            />

            {/* Polish and Symmetry - Auto-selected by Finish */}
            <div className="grid md:grid-cols-1 gap-6">
              <MultiSelectFilter
                options={DIAMOND_CONSTANTS.POLISH_SYMMETRY_OPTIONS}
                selected={searchForm.polish}
                onChange={handleMultiSelect}
                label="Polish"
                gridCols="grid-cols-2 md:grid-cols-6"
                colorVariant="yellow"
              />

              <MultiSelectFilter
                options={DIAMOND_CONSTANTS.POLISH_SYMMETRY_OPTIONS}
                selected={searchForm.symmetry}
                onChange={handleMultiSelect}
                label="Symmetry"
                gridCols="grid-cols-2 md:grid-cols-6"
                colorVariant="green"
              />
            </div>

            <MultiSelectFilter
              options={DIAMOND_CONSTANTS.CERTIFICATIONS}
              selected={searchForm.certification}
              onChange={handleMultiSelect}
              label="Certification"
              gridCols="grid-cols-3 md:grid-cols-5"
              colorVariant="yellow"
            />

            <MultiSelectFilter
              options={DIAMOND_CONSTANTS.FLUORESCENCE_LEVELS}
              selected={searchForm.fluorescence}
              onChange={handleMultiSelect}
              label="Fluorescence"
              gridCols="grid-cols-3 md:grid-cols-5"
              colorVariant="purple"
            />

            {/* Sieve Size Table - Only for Melee Diamonds */}
                        <div className="grid md:grid-cols-2 gap-6">

            {searchForm.category === 'melee' && (
              <SieveSizeTable
                selectedSizes={searchForm.sieveSizes}
                onSizeToggle={handleSieveSizeToggle}
                rangeMode={sieveRangeMode}
                rangeStart={sieveRangeStart}
                onRangeModeToggle={() => {
                  setSieveRangeMode(!sieveRangeMode)
                  setSieveRangeStart(null)
                }}
                onSelectAll={() => {
                  const allSizes = SIEVE_DATA.map(item => item.mm)
                  setSearchForm(prev => ({
                    ...prev,
                    sieveSizes: allSizes
                  }))
                }}
              />
            )}
            </div>

            {/* Company, Location, Origin Search - Moved before Advanced Filters */}
            <div className="grid md:grid-cols-3 gap-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <SearchInput
                label="Company Name"
                placeholder="Search by company name"
                selected={searchForm.company}
                onAdd={(value) => handleAddToArray('company', value)}
                onRemove={(value) => handleRemoveFromArray('company', value)}
              />

              <SearchInput
                label="Vendor's Location"
                placeholder="Search by location"
                selected={searchForm.location}
                onAdd={(value) => handleAddToArray('location', value)}
                onRemove={(value) => handleRemoveFromArray('location', value)}
              />

              <SearchInput
                label="Origin"
                placeholder="Search by origin"
                selected={searchForm.origin}
                onAdd={(value) => handleAddToArray('origin', value)}
                onRemove={(value) => handleRemoveFromArray('origin', value)}
              />
            </div>
          </div>

          {/* Melee-specific Measurement Filters - Shown before Advanced Filters */}
          {searchForm.category === 'melee' && (
            <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  Measurement Filters
                </h3>
                {(() => {
                  const defaultForm = DiamondSearchHelpers.getDefaultSearchForm(searchForm.diamondType, searchForm.category);
                  const isLengthModified = searchForm.lengthRange.min !== defaultForm.lengthRange.min || searchForm.lengthRange.max !== defaultForm.lengthRange.max;
                  const isWidthModified = searchForm.widthRange.min !== defaultForm.widthRange.min || searchForm.widthRange.max !== defaultForm.widthRange.max;
                  const isHeightModified = searchForm.heightRange.min !== defaultForm.heightRange.min || searchForm.heightRange.max !== defaultForm.heightRange.max;
                  const hasAnyMeasurementFilter = isLengthModified || isWidthModified || isHeightModified;
                  
                  return hasAnyMeasurementFilter ? (
                    <button
                      onClick={() => {
                        setSearchForm(prev => ({
                          ...prev,
                          lengthRange: defaultForm.lengthRange,
                          widthRange: defaultForm.widthRange,
                          heightRange: defaultForm.heightRange
                        }));
                      }}
                      className="cursor-pointer text-xs px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
                    >
                      Deselect All
                    </button>
                  ) : null;
                })()}
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <RangeInput
                  label="Length Range"
                  min={searchForm.lengthRange.min}
                  max={searchForm.lengthRange.max}
                  onMinChange={(value) => handleRangeChange('lengthRange', 'min', value)}
                  onMaxChange={(value) => handleRangeChange('lengthRange', 'max', value)}
                  unit="mm"
                  step={0.1}
                />

                <RangeInput
                  label="Width Range"
                  min={searchForm.widthRange.min}
                  max={searchForm.widthRange.max}
                  onMinChange={(value) => handleRangeChange('widthRange', 'min', value)}
                  onMaxChange={(value) => handleRangeChange('widthRange', 'max', value)}
                  unit="mm"
                  step={0.1}
                />

                <RangeInput
                  label="Height Range"
                  min={searchForm.heightRange.min}
                  max={searchForm.heightRange.max}
                  onMinChange={(value) => handleRangeChange('heightRange', 'min', value)}
                  onMaxChange={(value) => handleRangeChange('heightRange', 'max', value)}
                  unit="mm"
                  step={0.1}
                />
              </div>
            </div>
          )}

          {/* Advanced Filters Toggle - Hidden for Melee */}
          {searchForm.category !== 'melee' && (
            <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
            <div className='flex justify-center relative'>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="cursor-pointer flex items-center justify-center w-[200px] p-2 rounded-full border transition-all duration-200 hover:bg-gray-50"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <span className="font-medium mr-2">Advanced Filters</span>
                <ChevronDown className={`w-5 h-5 transform transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Advanced Filters Content */}
            {showAdvancedFilters && (
              <div className="mt-8 space-y-6 p-6 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)/5' }}>
                {/* Header with Deselect All button for Advanced Range Filters */}
                {(() => {
                  const defaultForm = DiamondSearchHelpers.getDefaultSearchForm(searchForm.diamondType, searchForm.category);
                  const isTableModified = searchForm.tablePercent.min !== defaultForm.tablePercent.min || searchForm.tablePercent.max !== defaultForm.tablePercent.max;
                  const isDepthModified = searchForm.depthPercent.min !== defaultForm.depthPercent.min || searchForm.depthPercent.max !== defaultForm.depthPercent.max;
                  const isLengthModified = searchForm.lengthRange.min !== defaultForm.lengthRange.min || searchForm.lengthRange.max !== defaultForm.lengthRange.max;
                  const isWidthModified = searchForm.widthRange.min !== defaultForm.widthRange.min || searchForm.widthRange.max !== defaultForm.widthRange.max;
                  const isHeightModified = searchForm.heightRange.min !== defaultForm.heightRange.min || searchForm.heightRange.max !== defaultForm.heightRange.max;
                  const isRatioModified = searchForm.ratioRange.min !== defaultForm.ratioRange.min || searchForm.ratioRange.max !== defaultForm.ratioRange.max;
                  const isCrownAngleModified = searchForm.crownAngleRange.min !== defaultForm.crownAngleRange.min || searchForm.crownAngleRange.max !== defaultForm.crownAngleRange.max;
                  const isCrownHeightModified = searchForm.crownHeightRange.min !== defaultForm.crownHeightRange.min || searchForm.crownHeightRange.max !== defaultForm.crownHeightRange.max;
                  const isPavilionAngleModified = searchForm.pavilionAngleRange.min !== defaultForm.pavilionAngleRange.min || searchForm.pavilionAngleRange.max !== defaultForm.pavilionAngleRange.max;
                  const isPavilionDepthModified = searchForm.pavilionDepthRange.min !== defaultForm.pavilionDepthRange.min || searchForm.pavilionDepthRange.max !== defaultForm.pavilionDepthRange.max;
                  
                  const hasAnyAdvancedRangeFilter = isTableModified || isDepthModified || isLengthModified || isWidthModified || 
                                                     isHeightModified || isRatioModified || isCrownAngleModified || 
                                                     isCrownHeightModified || isPavilionAngleModified || isPavilionDepthModified;
                  
                  return hasAnyAdvancedRangeFilter ? (
                    <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Advanced range filters active
                      </span>
                      <button
                        onClick={() => {
                          setSearchForm(prev => ({
                            ...prev,
                            tablePercent: defaultForm.tablePercent,
                            depthPercent: defaultForm.depthPercent,
                            lengthRange: defaultForm.lengthRange,
                            widthRange: defaultForm.widthRange,
                            heightRange: defaultForm.heightRange,
                            ratioRange: defaultForm.ratioRange,
                            crownAngleRange: defaultForm.crownAngleRange,
                            crownHeightRange: defaultForm.crownHeightRange,
                            pavilionAngleRange: defaultForm.pavilionAngleRange,
                            pavilionDepthRange: defaultForm.pavilionDepthRange
                          }));
                        }}
                        className="cursor-pointer text-xs px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all font-medium"
                      >
                        Deselect All Ranges
                      </button>
                    </div>
                  ) : null;
                })()}

                <div className="grid md:grid-cols-2 gap-6">
                  <RangeInput
                    label="Table Percent"
                    min={searchForm.tablePercent.min}
                    max={searchForm.tablePercent.max}
                    onMinChange={(value) => handleRangeChange('tablePercent', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('tablePercent', 'max', value)}
                    unit="%"
                  />

                  <RangeInput
                    label="Depth Percent"
                    min={searchForm.depthPercent.min}
                    max={searchForm.depthPercent.max}
                    onMinChange={(value) => handleRangeChange('depthPercent', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('depthPercent', 'max', value)}
                    unit="%"
                  />
                </div>

                <MultiSelectFilter
                  options={DIAMOND_CONSTANTS.GIRDLE_OPTIONS}
                  selected={searchForm.girdle}
                  onChange={handleMultiSelect}
                  label="Girdle"
                  gridCols="grid-cols-2 md:grid-cols-5"
                />
                {/* Additional Extended Filters */}


                {/* Culet Size */}
                <MultiSelectFilter
                  options={DIAMOND_CONSTANTS.CULET_SIZE_OPTIONS}
                  selected={searchForm.culetSize}
                  onChange={handleMultiSelect}
                  label="Culet Size"
                  gridCols="grid-cols-2 md:grid-cols-5"
                />

                {/* Additional Measurements */}
                <div className="grid md:grid-cols-3 gap-6">
                  <RangeInput
                    label="Length Range"
                    min={searchForm.lengthRange.min}
                    max={searchForm.lengthRange.max}
                    onMinChange={(value) => handleRangeChange('lengthRange', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('lengthRange', 'max', value)}
                    unit="mm"
                    step={0.1}
                  />

                  <RangeInput
                    label="Width Range"
                    min={searchForm.widthRange.min}
                    max={searchForm.widthRange.max}
                    onMinChange={(value) => handleRangeChange('widthRange', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('widthRange', 'max', value)}
                    unit="mm"
                    step={0.1}
                  />

                  <RangeInput
                    label="Height Range"
                    min={searchForm.heightRange.min}
                    max={searchForm.heightRange.max}
                    onMinChange={(value) => handleRangeChange('heightRange', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('heightRange', 'max', value)}
                    unit="mm"
                    step={0.1}
                  />
                </div>

                {/* Ratio Range */}
                <div className='grid md:grid-cols-3 gap-6'>
                  <RangeInput
                    label="Length to Width Ratio Range"
                    min={searchForm.ratioRange.min}
                    max={searchForm.ratioRange.max}
                    onMinChange={(value) => handleRangeChange('ratioRange', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('ratioRange', 'max', value)}
                    step={0.01}
                  />
                </div>

                {/* Additional Percentage Ranges */}
                <div className="grid md:grid-cols-2 gap-6">
                  <RangeInput
                    label="Depth Percentage Range"
                    min={searchForm.depthPercentage.min}
                    max={searchForm.depthPercentage.max}
                    onMinChange={(value) => handleRangeChange('depthPercentage', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('depthPercentage', 'max', value)}
                    unit="%"
                    step={0.1}
                  />

                  <RangeInput
                    label="Table Percentage Range"
                    min={searchForm.tablePercentage.min}
                    max={searchForm.tablePercentage.max}
                    onMinChange={(value) => handleRangeChange('tablePercentage', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('tablePercentage', 'max', value)}
                    unit="%"
                    step={0.1}
                  />
                </div>

                {/* Advanced Crown/Pavilion Ranges */}
                <div className="grid md:grid-cols-2 gap-6">
                  <RangeInput
                    label="Crown Angle Range"
                    min={searchForm.crownAngleRange.min}
                    max={searchForm.crownAngleRange.max}
                    onMinChange={(value) => handleRangeChange('crownAngleRange', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('crownAngleRange', 'max', value)}
                    unit="°"
                    step={0.1}
                  />

                  <RangeInput
                    label="Crown Height Range"
                    min={searchForm.crownHeightRange.min}
                    max={searchForm.crownHeightRange.max}
                    onMinChange={(value) => handleRangeChange('crownHeightRange', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('crownHeightRange', 'max', value)}
                    unit="%"
                    step={0.1}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <RangeInput
                    label="Pavilion Angle Range"
                    min={searchForm.pavilionAngleRange.min}
                    max={searchForm.pavilionAngleRange.max}
                    onMinChange={(value) => handleRangeChange('pavilionAngleRange', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('pavilionAngleRange', 'max', value)}
                    unit="°"
                    step={0.1}
                  />

                  <RangeInput
                    label="Pavilion Depth Range"
                    min={searchForm.pavilionDepthRange.min}
                    max={searchForm.pavilionDepthRange.max}
                    onMinChange={(value) => handleRangeChange('pavilionDepthRange', 'min', value)}
                    onMaxChange={(value) => handleRangeChange('pavilionDepthRange', 'max', value)}
                    unit="%"
                    step={0.1}
                  />
                </div>

                {/* Girdle Range Selector */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                    Girdle Thickness Range
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Minimum</label>
                      <select
                        value={searchForm.gridleRange.min}
                        onChange={(e) => {
                          const newMin = e.target.value
                          const minIndex = DIAMOND_CONSTANTS.GIRDLE_ORDER.indexOf(newMin)
                          const maxIndex = DIAMOND_CONSTANTS.GIRDLE_ORDER.indexOf(searchForm.gridleRange.max)
                          
                          // If max is set and new min is greater than max, show error
                          if (searchForm.gridleRange.max && minIndex > maxIndex) {
                            setGridleRangeError('Minimum girdle thickness cannot be greater than maximum.')
                            return
                          }
                          
                          setGridleRangeError('')
                          handleStringRangeChange('gridleRange', 'min', newMin)
                        }}
                        className={`w-full p-3 border rounded-lg transition-colors ${
                          gridleRangeError ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                        style={{ backgroundColor: 'var(--card)', borderColor: gridleRangeError ? '#ef4444' : 'var(--border)', color: 'var(--foreground)' }}
                      >
                        <option value="">Select minimum</option>
                        {DIAMOND_CONSTANTS.GIRDLE_ORDER.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Maximum</label>
                      <select
                        value={searchForm.gridleRange.max}
                        onChange={(e) => {
                          const newMax = e.target.value
                          const minIndex = DIAMOND_CONSTANTS.GIRDLE_ORDER.indexOf(searchForm.gridleRange.min)
                          const maxIndex = DIAMOND_CONSTANTS.GIRDLE_ORDER.indexOf(newMax)
                          
                          // If min is set and new max is less than min, show error
                          if (searchForm.gridleRange.min && maxIndex < minIndex) {
                            setGridleRangeError('Maximum girdle thickness cannot be less than minimum.')
                            return
                          }
                          
                          setGridleRangeError('')
                          handleStringRangeChange('gridleRange', 'max', newMax)
                        }}
                        className={`w-full p-3 border rounded-lg transition-colors ${
                          gridleRangeError ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                        style={{ backgroundColor: 'var(--card)', borderColor: gridleRangeError ? '#ef4444' : 'var(--border)', color: 'var(--foreground)' }}
                      >
                        <option value="">Select maximum</option>
                        {DIAMOND_CONSTANTS.GIRDLE_ORDER.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Error Message */}
                  {gridleRangeError && (
                    <div className="mt-2 flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        {gridleRangeError}
                      </span>
                    </div>
                  )}
                  
                  {/* Success Message */}
                  {!gridleRangeError && searchForm.gridleRange.min && searchForm.gridleRange.max && (
                    <div className="mt-2 flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Selected range: {searchForm.gridleRange.min} to {searchForm.gridleRange.max}
                      </span>
                    </div>
                  )}
                </div>
              </div>

            )}
          </div>
          )}
        </div>



        {/* Action Buttons */}
        <div className="flex justify-center flex-col md:flex-row gap-4 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleSearch}
            className="group cursor-pointer px-5 py-0 rounded-2xl font-semibold text-base md:text-lg flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'color-mix(in srgb, var(--primary) 80%, currentColor 20%)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary)' }}
          >
            <Search className="w-5 h-5 mr-2" />
            Find Diamonds
          </button>
          <button
            onClick={resetFilters}
            disabled={isDefaultFilters}
            className="group md:w-auto px-6 py-2 rounded-2xl font-semibold text-base md:text-lg flex items-center justify-center transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'transparent' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'color-mix(in srgb, currentColor 40%, transparent)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            <Filter className="w-5 h-5 mr-2" />
            Reset Filters
          </button>
        </div>

        {/* Quick Search Options */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--foreground)' }}>
            Popular Searches
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { type: 'natural', category: 'single', label: 'Engagement Rings', subtitle: '1-2 Carat Natural', icon: <Sparkles className="w-8 h-8 text-yellow-500 mb-2" /> },
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
                className="p-6 border rounded-xl hover:shadow-2xl transition-all text-left bg-white/80 dark:bg-black/80 backdrop-blur-xl flex flex-col items-start gap-2"
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

      {/* Diamond Shapes Carousel */}


      {/* Footer */}
      <Footer />
    </div>
  )
}
