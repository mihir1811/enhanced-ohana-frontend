'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Gem, Leaf, Sparkles, Filter } from 'lucide-react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { ProductConfig, FilterConfig } from '@/types/products'

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [searchForm, setSearchForm] = useState<Record<string, any>>(() => {
    // Initialize form with default values
    const initialForm: Record<string, any> = {
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
    setSearchForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleRangeChange = (field: string, type: 'min' | 'max', value: number) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value
      }
    }))
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
      } else if (typeof value === 'object' && value !== null) {
        if ('min' in value && 'max' in value) {
          params.set(`${key}Min`, value.min.toString())
          params.set(`${key}Max`, value.max.toString())
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
    const resetForm: Record<string, any> = {
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
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    searchForm[filter.key]?.includes(option)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: searchForm[filter.key]?.includes(option) ? 'var(--primary)/10' : 'var(--card)',
                    borderColor: searchForm[filter.key]?.includes(option) ? 'var(--primary)' : 'var(--border)',
                    color: searchForm[filter.key]?.includes(option) ? 'var(--primary)' : 'var(--foreground)'
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
              {filter.label} ({searchForm[filter.key]?.min} - {searchForm[filter.key]?.max})
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Minimum</label>
                <input
                  type="number"
                  step={filter.step || 1}
                  min={filter.min}
                  max={filter.max}
                  value={searchForm[filter.key]?.min || filter.min || 0}
                  onChange={(e) => handleRangeChange(filter.key, 'min', parseFloat(e.target.value) || filter.min || 0)}
                  className="w-full p-3 border rounded-lg"
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
                  value={searchForm[filter.key]?.max || filter.max || 100}
                  onChange={(e) => handleRangeChange(filter.key, 'max', parseFloat(e.target.value) || filter.max || 100)}
                  className="w-full p-3 border rounded-lg"
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Navigation */}
      <NavigationUser />
      
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-96 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, var(--chart-1), var(--chart-3), var(--chart-5))'
          }}
        >
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">{config.icon}</span>
              <h1 className="text-5xl md:text-6xl font-bold">
                {heroTitle || `Find Your Perfect ${config.name}`}
              </h1>
            </div>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              {heroSubtitle || `Search from thousands of certified ${config.name.toLowerCase()} with advanced filtering tools`}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">10,000+</div>
                <div className="text-sm opacity-80">Certified Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm opacity-80">Trusted Suppliers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-80">Expert Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-80">Certified Authentic</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
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
              {config.categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    searchForm.category === category
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: searchForm.category === category ? 'var(--primary)/10' : 'var(--card)',
                    borderColor: searchForm.category === category ? 'var(--primary)' : 'var(--border)'
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
              Price Range (${searchForm.priceRange?.min?.toLocaleString()} - ${searchForm.priceRange?.max?.toLocaleString()})
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Minimum ($)</label>
                <input
                  type="number"
                  value={searchForm.priceRange?.min || 0}
                  onChange={(e) => handleRangeChange('priceRange', 'min', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border rounded-lg"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Maximum ($)</label>
                <input
                  type="number"
                  value={searchForm.priceRange?.max || 0}
                  onChange={(e) => handleRangeChange('priceRange', 'max', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border rounded-lg"
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

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={handleSearch}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
