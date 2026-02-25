'use client'

import React, { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, Diamond, Gem } from 'lucide-react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { ProductConfig, FilterConfig } from '@/types/products'
import { SECTION_WIDTH } from '@/lib/constants'
import { GemstoneCarousel } from '../gemstones/GemstoneCarousel'
import GemstoneFilters, { GemstoneFilterValues } from '../gemstones/GemstoneFilters'

interface PriceRange {
  min: number;
  max: number;
}

interface FormState {
  category: string;
  priceRange: PriceRange;
  certification: string[];
  location: string[];
  [key: string]: string | number | boolean | string[] | PriceRange | undefined;
}

interface ProductSearchPageProps {
  productType: string
  config: ProductConfig
  heroTitle?: string
  heroSubtitle?: string
}

export default function ProductSearchPage({ 
  productType, 
  config, 
  heroTitle, 
  heroSubtitle 
}: ProductSearchPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialCategory = searchParams ? (searchParams.get('category') || 'single') : 'single'
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedGemstones, setSelectedGemstones] = useState<string[]>([])
  
  // Gemstone filters state
  const [gemstoneFilters, setGemstoneFilters] = useState<GemstoneFilterValues>({
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
  
  const [searchForm, setSearchForm] = useState<FormState>(() => {
    // Initialize form with default values
    const initialForm: FormState = {
      category: config.categories[0],
      priceRange: config.priceRanges[config.categories[0]] || { min: 100, max: 10000 },
      certification: [],
      location: []
    }

    // Initialize filters based on config
    config.filters.forEach(filter => {
      if (filter.type === 'multiselect') {
        initialForm[filter.key] = []
      } else if (filter.type === 'range') {
        initialForm[filter.key] = { 
          min: filter.min || 0, 
          max: filter.max || 100 
        }
      } else if (filter.type === 'toggle') {
        initialForm[filter.key] = false
      } else {
        initialForm[filter.key] = ''
      }
    })

    return initialForm
  })

  // Get basic and advanced filters
  const basicFilters = useMemo(() => 
    config.filters.filter(filter => !filter.advanced), 
    [config.filters]
  )
  
  const advancedFilters = useMemo(() => 
    config.filters.filter(filter => filter.advanced), 
    [config.filters]
  )

  const handleMultiSelect = (field: string, value: string) => {
    setSearchForm(prev => {
      const currentValue = prev[field]
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [field]: currentValue.includes(value)
            ? currentValue.filter((item: string) => item !== value)
            : [...currentValue, value]
        }
      }
      return prev
    })
  }

  const handleRangeChange = (field: string, type: 'min' | 'max', value: number) => {
    setSearchForm(prev => {
      const currentValue = prev[field]
      if (currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue) && 'min' in (currentValue as PriceRange) && 'max' in (currentValue as PriceRange)) {
        return {
          ...prev,
          [field]: {
            ...currentValue,
            [type]: value
          }
        }
      }
      return prev
    })
  }

  const handleCategoryChange = (category: string) => {
    const newPriceRange = config.priceRanges[category] || { min: 100, max: 10000 }
    
    setSearchForm(prev => ({
      ...prev,
      category,
      priceRange: newPriceRange
    }))
  }

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams()
    
    // Add filter parameters
      Object.entries(searchForm).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','))
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if ('min' in (value as PriceRange) && 'max' in (value as PriceRange)) {
            params.set(`${key}Min`, (value as PriceRange).min.toString())
            params.set(`${key}Max`, (value as PriceRange).max.toString())
          }
        } else if (value && value !== '') {
          params.set(key, value.toString())
        }
      })

    // Navigate to results page
    const resultsUrl = `/${productType}/${searchForm.category}?${params.toString()}`
    router.push(resultsUrl)
  }

  const resetFilters = () => {
    const resetForm: FormState = {
      category: config.categories[0],
      priceRange: config.priceRanges[config.categories[0]] || { min: 100, max: 10000 },
      certification: [],
      location: []
    }

    config.filters.forEach(filter => {
      if (filter.type === 'multiselect') {
        resetForm[filter.key] = []
      } else if (filter.type === 'range') {
        resetForm[filter.key] = { 
          min: filter.min || 0, 
          max: filter.max || 100 
        }
      } else if (filter.type === 'toggle') {
        resetForm[filter.key] = false
      } else {
        resetForm[filter.key] = ''
      }
    })

    setSearchForm(resetForm)
  }

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'multiselect':
        return (
          <div key={filter.key}>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
              {filter.label}
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {filter.options?.map(option => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect(filter.key, option)}
                  className="p-3 rounded-lg border text-sm transition-all"
                  style={{
                    backgroundColor:
                      Array.isArray(searchForm[filter.key]) &&
                      (searchForm[filter.key] as string[]).includes(option)
                        ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                        : 'var(--card)',
                    borderColor:
                      Array.isArray(searchForm[filter.key]) &&
                      (searchForm[filter.key] as string[]).includes(option)
                        ? 'var(--primary)'
                        : 'var(--border)',
                    color:
                      Array.isArray(searchForm[filter.key]) &&
                      (searchForm[filter.key] as string[]).includes(option)
                        ? 'var(--primary)'
                        : 'var(--foreground)',
                    boxShadow:
                      Array.isArray(searchForm[filter.key]) &&
                      (searchForm[filter.key] as string[]).includes(option)
                        ? '0 6px 18px color-mix(in srgb, var(--primary) 18%, transparent)'
                        : 'none'
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 'range':
        return (
          <div key={filter.key}>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
              {filter.label} ({(searchForm[filter.key] as PriceRange)?.min} - {(searchForm[filter.key] as PriceRange)?.max})
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Minimum</label>
                <input
                  type="number"
                  step={filter.step || 1}
                  min={filter.min}
                  max={filter.max}
                  value={(searchForm[filter.key] as PriceRange)?.min || filter.min || 0}
                  onChange={(e) => handleRangeChange(filter.key, 'min', parseFloat(e.target.value) || filter.min || 0)}
                  className="w-full p-3 border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Maximum</label>
                <input
                  type="number"
                  step={filter.step || 1}
                  min={filter.min}
                  max={filter.max}
                  value={(searchForm[filter.key] as PriceRange)?.max || filter.max || 100}
                  onChange={(e) => handleRangeChange(filter.key, 'max', parseFloat(e.target.value) || filter.max || 100)}
                  className="w-full p-3 border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Gemstone types data - only including gemstones with available images
  const gemstoneTypes = useMemo(() => [
    { title: "Alexandrite", img: "/images/gemstones/Alexandrite.png", alt: "Alexandrite gemstone" },
    { title: "Amber", img: "/images/gemstones/Amber.png", alt: "Amber gemstone" },
    { title: "Amethyst", img: "/images/gemstones/Amethyst.png", alt: "Amethyst gemstone" },
    { title: "Aquamarine", img: "/images/gemstones/Aquamarine.png", alt: "Aquamarine gemstone" },
    { title: "Citrine", img: "/images/gemstones/Citrine.png", alt: "Citrine gemstone" },
    { title: "Emerald", img: "/images/gemstones/Emerald.png", alt: "Emerald gemstone" },
    { title: "Garnet", img: "/images/gemstones/Garnet.png", alt: "Garnet gemstone" },
    { title: "Jade", img: "/images/gemstones/Jade.png", alt: "Jade gemstone" },
    { title: "Jasper", img: "/images/gemstones/Jasper.png", alt: "Jasper gemstone" },
    { title: "Lapis Lazuli", img: "/images/gemstones/Lapis Lazuli.png", alt: "Lapis Lazuli gemstone" },
    { title: "Moonstone", img: "/images/gemstones/Moonstone.png", alt: "Moonstone gemstone" },
    { title: "Onyx", img: "/images/gemstones/Onyx.png", alt: "Onyx gemstone" },
    { title: "Pearl", img: "/images/gemstones/Pearl.png", alt: "Pearl gemstone" },
    { title: "Rose Quartz", img: "/images/gemstones/Rose Quartz.png", alt: "Rose Quartz gemstone" },
    { title: "Sunstone", img: "/images/gemstones/Sunstone.png", alt: "Sunstone gemstone" },
    { title: "Tiger Eye", img: "/images/gemstones/Tiger Eye.png", alt: "Tiger Eye gemstone" },
    { title: "Zircon", img: "/images/gemstones/Zircon.png", alt: "Zircon gemstone" }
  ], [])

  const handleGemstoneSelect = (gemstone: string) => {
    setSelectedGemstones(prev => {
      const newSelection = prev.includes(gemstone)
        ? prev.filter(g => g !== gemstone)
        : [...prev, gemstone]
      
      // Sync with gemstoneFilters
      setGemstoneFilters(prevFilters => ({
        ...prevFilters,
        gemstoneType: newSelection
      }))
      
      return newSelection
    })
  }

  const handleGemstoneFiltersChange = (filters: GemstoneFilterValues) => {
    setGemstoneFilters(filters)
    // Sync gemstoneType with selectedGemstones
    setSelectedGemstones(filters.gemstoneType)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Navigation */}
      <NavigationUser />

      {/* Gemstone Carousel Section - Only for gemstones */}
      {productType === 'gemstones' && (
        <div className="py-6 pb-0">
          <GemstoneCarousel 
            shapes={gemstoneTypes}
            selectedShapes={selectedGemstones}
            onShapeSelect={handleGemstoneSelect}
          />
        </div>
      )}
      
      {/* Search Form */}
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 py-12`}>
        {/* Conditional rendering: GemstoneFilters for gemstones, generic form for others */}
        {productType === 'gemstones' ? (
          <GemstoneFilters 
            filters={gemstoneFilters}
            onFiltersChange={handleGemstoneFiltersChange}
            onSearch={() => {
              const params = new URLSearchParams();
              
              // Add common gemstone filters
              if (gemstoneFilters.gemstoneType.length > 0) params.set('gemType', gemstoneFilters.gemstoneType.join(','));
              if (gemstoneFilters.shape.length > 0) params.set('shape', gemstoneFilters.shape.join(','));
              if (gemstoneFilters.color.length > 0) params.set('color', gemstoneFilters.color.join(','));
              if (gemstoneFilters.clarity.length > 0) params.set('clarity', gemstoneFilters.clarity.join(','));
              if (gemstoneFilters.cut.length > 0) params.set('cut', gemstoneFilters.cut.join(','));
              if (gemstoneFilters.certification.length > 0) params.set('certification', gemstoneFilters.certification.join(','));
              if (gemstoneFilters.origin.length > 0) params.set('origin', gemstoneFilters.origin.join(','));
              if (gemstoneFilters.treatment.length > 0) params.set('treatment', gemstoneFilters.treatment.join(','));
              
              // Ranges
              if (gemstoneFilters.priceRange.min > 0) params.set('priceMin', gemstoneFilters.priceRange.min.toString());
              if (gemstoneFilters.priceRange.max < 1000000) params.set('priceMax', gemstoneFilters.priceRange.max.toString());
              if (gemstoneFilters.caratWeight.min > 0) params.set('caratMin', gemstoneFilters.caratWeight.min.toString());
              if (gemstoneFilters.caratWeight.max < 50) params.set('caratMax', gemstoneFilters.caratWeight.max.toString());
              
              // Dimensions
              if (gemstoneFilters.length.min > 0) params.set('lengthMin', gemstoneFilters.length.min.toString());
              if (gemstoneFilters.length.max < 100) params.set('lengthMax', gemstoneFilters.length.max.toString());
              if (gemstoneFilters.width.min > 0) params.set('widthMin', gemstoneFilters.width.min.toString());
              if (gemstoneFilters.width.max < 100) params.set('widthMax', gemstoneFilters.width.max.toString());
              if (gemstoneFilters.height.min > 0) params.set('heightMin', gemstoneFilters.height.min.toString());
              if (gemstoneFilters.height.max < 100) params.set('heightMax', gemstoneFilters.height.max.toString());

              const path = initialCategory === 'melee' ? '/gemstones/melee' : '/gemstones/products';
              router.push(`${path}?${params.toString()}`);
            }}
            gemstoneType={initialCategory === 'melee' ? 'melee' : 'single'}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border p-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center mb-8">
              <Search className="w-8 h-8 mr-3" style={{ color: 'var(--primary)' }} />
              <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                {config.name} Search
              </h2>
            </div>

            {/* Category Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {config.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className="p-4 rounded-lg border-2 transition-all"
                  style={{
                    backgroundColor:
                      searchForm.category === category
                        ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                        : 'var(--card)',
                    borderColor:
                      searchForm.category === category ? 'var(--primary)' : 'var(--border)',
                    boxShadow:
                      searchForm.category === category
                        ? '0 8px 22px color-mix(in srgb, var(--primary) 22%, transparent)'
                        : 'none'
                  }}
                >
                  <div className="font-medium capitalize" style={{ color: 'var(--foreground)' }}>
                    {category}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--foreground)' }}>
              Price Range (${(searchForm.priceRange as PriceRange)?.min?.toLocaleString()} - ${(searchForm.priceRange as PriceRange)?.max?.toLocaleString()})
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Minimum ($)</label>
                <input
                  type="number"
                  value={(searchForm.priceRange as PriceRange)?.min || 0}
                  onChange={(e) => handleRangeChange('priceRange', 'min', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Maximum ($)</label>
                <input
                  type="number"
                  value={(searchForm.priceRange as PriceRange)?.max || 0}
                  onChange={(e) => handleRangeChange('priceRange', 'max', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
            </div>
          </div>

          {/* Basic Filters */}
          <div className="space-y-6">
            {basicFilters.map(renderFilter)}
          </div>

          {/* Advanced Filters Toggle */}
          {advancedFilters.length > 0 && (
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center justify-center w-full p-4 rounded-lg border transition-all duration-200 hover:bg-gray-50"
                style={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <span className="font-medium mr-2">Advanced Filters</span>
                <svg 
                  className={`w-5 h-5 transform transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Advanced Filters Content */}
              {showAdvancedFilters && (
                <div className="mt-6 space-y-6 p-6 border rounded-xl" style={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)'
                }}>
                  {advancedFilters.map(renderFilter)}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={handleSearch}
              className="flex-1 px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--primary), color-mix(in srgb, var(--primary) 72%, var(--chart-3) 28%))',
                color: 'var(--primary-foreground)',
                boxShadow: '0 18px 45px color-mix(in srgb, var(--primary) 30%, transparent)'
              }}
            >
              <Search className="w-5 h-5 mr-2" />
              Find {config.name}
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
        </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
