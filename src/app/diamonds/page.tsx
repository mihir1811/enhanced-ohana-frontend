'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Gem, Leaf, Sparkles, Filter, ChevronDown, MoveLeft, MoveRight } from 'lucide-react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { filterOptions } from '@/constants/filterOptions'
import Image from 'next/image'

// Constants
const SECTION_WIDTH = 1400

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
      pricePerCarat: { min: 500, max: 50000 },
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
      gridleRange: { min: '', max: '' }
    }
  }

  static buildQueryParams(searchForm: DiamondSearchForm) {
    const params = new URLSearchParams()

    // Multi-select filters
    const multiSelectFields = [
      'shape', 'color', 'clarity', 'cut', 'certification', 'fluorescence', 'grownMethod',
      'fancyColors', 'overtone', 'intensity', 'company', 'origin', 'location',
      'polish', 'symmetry', 'finish', 'cutGrade', 'girdle', 'culet',
      'diamondTypeAdvanced', 'productType', 'process', 'culetSize'
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
    }), [options, selected, lastClickedIndex, handleItemClick]
  )

  return (
    <div className="space-y-3">
      <div className="text-xs p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
        💡 <strong>Range Selection:</strong> Click two unselected {label.toLowerCase()} to select all items in between. Click any selected item to deselect it individually.
      </div>

      {(selected && selected.length > 0) && (
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
      colors: 'border-blue-500 bg-blue-50',
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
const DiamondShapesCarousel = ({ title }: { title: string }) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [selectedShapes, setSelectedShapes] = useState<string[]>([])

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
      <div className='flex justify-between items-center'>
        <h2 className="text-3xl font-bold text-left mb-8" style={{ color: 'var(--foreground)' }}>
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-all border border-gray-200 dark:border-slate-600"
            style={{ transform: 'translate(-50%, -50%)' }}
            aria-label="Previous slide"
          >
            <MoveLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            onClick={handleNext}
            className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-all border border-gray-200 dark:border-slate-600"
            style={{ transform: 'translate(50%, -50%)' }}
            aria-label="Next slide"
          >
            <MoveRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>

      <button
        onClick={toggleAutoplay}
        className="absolute right-0 bottom-0 z-10 bg-white dark:bg-slate-700 p-2 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-all mb-2 mr-2 border border-gray-200 dark:border-slate-600"
        aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
      >
        {isAutoPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200">
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
              className={`diamond-carousel-card rounded-full h-[300px] p-3 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${selectedShapes.includes(shape.name) ? 'selected ring-2 ring-blue-500 dark:ring-blue-400' : ''
                }`}
              onClick={(e) => {
                e.preventDefault();
                // Toggle selection of this shape
                setSelectedShapes(prev =>
                  prev.includes(shape.name)
                    ? prev.filter(s => s !== shape.name)
                    : [...prev, shape.name]
                );
              }}
            >
              <div className="relative w-25 h-25 mb-1 flex items-center justify-center hover:scale-105 transition-transform">
                <Image
                  src={shape.image}
                  alt={shape.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  priority={index < 6}
                />
              </div>
              <h3 className="text-xs font-medium pt-5 text-foreground">{shape.name}</h3>
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
                ? 'bg-blue-500 dark:bg-blue-400 w-4 shadow-md'
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
  colorVariant = 'blue'
}: MultiSelectFilterProps) => {
  const colorConfig = useMemo(() => ({
    blue: 'border-blue-500 bg-blue-50 text-blue-700',
    green: 'border-green-500 bg-green-50 text-green-700',
    purple: 'border-purple-500 bg-purple-50 text-purple-700',
    yellow: 'border-yellow-500 bg-yellow-50 text-yellow-700',
    orange: 'border-orange-500 bg-orange-50 text-orange-700'
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
          className={`group w-full px-4 py-2 rounded-3xl text-sm font-medium transition-all duration-200
            ${isSelected
              ? "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-md"
              : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
            }
            hover:bg-yellow-50 dark:hover:bg-yellow-900/30
            hover:border-yellow-500/30 dark:hover:border-yellow-500/30
          `}
        >
          {option}
        </button>
      )
    }), [options, selected, onChange, label, colorConfig, colorVariant, fieldMap]
  )

  return (
    <div>
      <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
        {label}
      </label>
      <div className={`grid ${gridCols} gap-2`}>
        {memoizedButtons}
      </div>
    </div>
  )
})

MultiSelectFilter.displayName = 'MultiSelectFilter'

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
  return (
    <div>
      <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
        {label} ({min}{unit} - {max.toLocaleString()}{unit})
      </label>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Minimum{unit && ` (${unit})`}</label>
          <input
            type="number"
            step={step}
            value={min}
            onChange={(e) => onMinChange(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border rounded-lg"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Maximum{unit && ` (${unit})`}</label>
          <input
            type="number"
            step={step}
            value={max}
            onChange={(e) => onMaxChange(parseFloat(e.target.value) || 0)}
            className="w-full p-3 border rounded-lg"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
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
      <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
        {label}
      </label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 p-3 border rounded-lg"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                className="text-blue-600 hover:text-blue-800"
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

  // Update state when URL parameters change
  useEffect(() => {
    const newDiamondType = searchParams.get('diamondType') as 'natural' | 'lab-grown' || 'natural'
    const newCategory = searchParams.get('category') as 'single' | 'melee' || 'single'

    if (newDiamondType !== searchForm.diamondType || newCategory !== searchForm.category) {
      setSearchForm(DiamondSearchHelpers.getDefaultSearchForm(newDiamondType, newCategory))
    }
  }, [searchParams, searchForm.diamondType, searchForm.category])

  // Handlers
  const handleDiamondTypeChange = useCallback((type: 'natural' | 'lab-grown') => {
    const newCaratRange = DiamondSearchHelpers.getCaratRange(searchForm.category)
    const newPriceRange = DiamondSearchHelpers.getPriceRange(type, searchForm.category)

    setSearchForm(prev => ({
      ...prev,
      diamondType: type,
      caratWeight: newCaratRange,
      priceRange: newPriceRange
    }))
  }, [searchForm.category])

  const handleCategoryChange = useCallback((category: 'single' | 'melee') => {
    const newCaratRange = DiamondSearchHelpers.getCaratRange(category)
    const newPriceRange = DiamondSearchHelpers.getPriceRange(searchForm.diamondType, category)

    setSearchForm(prev => ({
      ...prev,
      category,
      caratWeight: newCaratRange,
      priceRange: newPriceRange
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

  const handleArrayChange = useCallback((field: keyof DiamondSearchForm, values: string[]) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: values
    }))
  }, [])

  const handleRangeChange = useCallback((field: keyof DiamondSearchForm, type: 'min' | 'max', value: number) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as { min: number; max: number }),
        [type]: value
      }
    }))
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Navigation */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-lg">
        <NavigationUser />
      </div>

      <div className="w-full py-12 ">
        <div className="max-w-7xl mx-auto px-4">

          <DiamondShapesCarousel title="Select Diamond Shapes" />
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
                  return (
                    <button
                      key={shape}
                      onClick={() => handleMultiSelect('shape', shape)}
                      className={`p-3 rounded-lg border text-xs font-medium transition-all ${isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--blue)/10' : 'var(--card)',
                        borderColor: isSelected ? 'var(--blue)' : 'var(--border)',
                        color: isSelected ? 'var(--blue)' : 'var(--foreground)'
                      }}
                      title={shape}
                    >
                      {shape}
                    </button>
                  )
                })}
              </div>

              {/* Show More/Less Button */}
              {DIAMOND_CONSTANTS.SHAPES.length > 16 && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setShowAllShapes(!showAllShapes)}
                    className="px-6 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center gap-2"
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
                <div className="mt-3 flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-sm font-medium text-blue-800">
                    {searchForm.shape.length} shape{searchForm.shape.length > 1 ? 's' : ''} selected: <strong>{searchForm.shape.join(', ')}</strong>
                  </span>
                  <button
                    onClick={() => setSearchForm(prev => ({ ...prev, shape: [] }))}
                    className="text-xs underline hover:no-underline transition-all text-blue-600 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Carat and Price Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RangeInput
                label="Carat Range"
                min={searchForm.caratWeight.min}
                max={searchForm.caratWeight.max}
                onMinChange={(value) => handleRangeChange('caratWeight', 'min', value)}
                onMaxChange={(value) => handleRangeChange('caratWeight', 'max', value)}
                unit=" ct"
                step={0.01}
              />

              <RangeInput
                label="Price Range"
                min={searchForm.priceRange.min}
                max={searchForm.priceRange.max}
                onMinChange={(value) => handleRangeChange('priceRange', 'min', value)}
                onMaxChange={(value) => handleRangeChange('priceRange', 'max', value)}
                unit="$"
                step={1000}
              />
            </div>

            {/* Color */}
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

              {searchForm.isFancyColor ? (
                <div className="space-y-4">
                  {/* Fancy Colors with Color Circles */}
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                      Fancy Colors
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
                      {DIAMOND_CONSTANTS.FANCY_COLORS.map((color) => {
                        const isSelected = searchForm.fancyColors.includes(color.name)
                        return (
                          <button
                            key={color.name}
                            onClick={() => handleMultiSelect('fancyColors', color.name)}
                            className={`relative p-3 rounded-xl transition-all duration-200 border-2
                              ${isSelected
                                ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-500 dark:border-yellow-600 shadow-md"
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
                <RangeSelectFilter
                  options={DIAMOND_CONSTANTS.COLORS}
                  selected={searchForm.color}
                  onChange={(values) => handleArrayChange('color', values)}
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
                options={DIAMOND_CONSTANTS.CLARITIES}
                selected={searchForm.clarity}
                onChange={(values) => handleArrayChange('clarity', values)}
                layout="grid"
                gridCols="grid-cols-4 md:grid-cols-8"
                label="Clarity"
              />
            </div>

            {/* Cut Grade, Finish, Certification, Fluorescence */}
            <MultiSelectFilter
              options={DIAMOND_CONSTANTS.CUTS}
              selected={searchForm.cutGrade}
              onChange={handleMultiSelect}
              label="Cut Grade"
              gridCols="grid-cols-3 md:grid-cols-5"
              colorVariant="green"
            />

            <MultiSelectFilter
              options={DIAMOND_CONSTANTS.FINISH_OPTIONS}
              selected={searchForm.finish}
              onChange={handleMultiSelect}
              label="Finish (Quick Select)"
              gridCols="grid-cols-2 md:grid-cols-4"
              colorVariant="purple"
            />

            {/* Polish and Symmetry - Auto-selected by Finish */}
            <div className="grid md:grid-cols-2 gap-6">
              <MultiSelectFilter
                options={DIAMOND_CONSTANTS.POLISH_SYMMETRY_OPTIONS}
                selected={searchForm.polish}
                onChange={handleMultiSelect}
                label="Polish"
                gridCols="grid-cols-2 md:grid-cols-3"
                colorVariant="blue"
              />

              <MultiSelectFilter
                options={DIAMOND_CONSTANTS.POLISH_SYMMETRY_OPTIONS}
                selected={searchForm.symmetry}
                onChange={handleMultiSelect}
                label="Symmetry"
                gridCols="grid-cols-2 md:grid-cols-3"
                colorVariant="green"
              />
            </div>

            <MultiSelectFilter
              options={DIAMOND_CONSTANTS.CERTIFICATIONS}
              selected={searchForm.certification}
              onChange={handleMultiSelect}
              label="Certification"
              gridCols="grid-cols-3 md:grid-cols-4"
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
          </div>

          {/* Advanced Filters Toggle */}
          <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
            <div className='flex justify-center relative'>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center justify-center w-[200px] p-2 rounded-full border transition-all duration-200 hover:bg-gray-50"
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
                  gridCols="grid-cols-2 md:grid-cols-3"
                />
                {/* Additional Extended Filters */}


                {/* Culet Size */}
                <MultiSelectFilter
                  options={DIAMOND_CONSTANTS.CULET_SIZE_OPTIONS}
                  selected={searchForm.culetSize}
                  onChange={handleMultiSelect}
                  label="Culet Size"
                  gridCols="grid-cols-2 md:grid-cols-3"
                />

                {/* Company, Location, Origin Search */}
                <div className="grid md:grid-cols-3 gap-6">
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
                <div className="grid md:grid-cols-3 gap-6">
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
                        onChange={(e) => handleStringRangeChange('gridleRange', 'min', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
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
                        onChange={(e) => handleStringRangeChange('gridleRange', 'max', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
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
                  {searchForm.gridleRange.min && searchForm.gridleRange.max && (
                    <div className="mt-2">
                      <span className="text-sm text-blue-600">
                        Selected range: {searchForm.gridleRange.min} to {searchForm.gridleRange.max}
                      </span>
                    </div>
                  )}
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

        {/* Quick Search Options */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--foreground)' }}>
            Popular Searches
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { type: 'natural', category: 'single', label: 'Engagement Rings', subtitle: '1-2 Carat Natural', icon: <Sparkles className="w-8 h-8 text-blue-500 mb-2" /> },
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

      {/* Diamond Shapes Carousel */}


      {/* Footer */}
      <Footer />
    </div>
  )
}
