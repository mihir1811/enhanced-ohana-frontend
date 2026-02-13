'use client'

import React, { useState } from 'react'
import { useCompare } from '@/hooks/useCompare'
import { ArrowLeft, X, Heart, ShoppingCart, Eye, CheckCircle, Info, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CompareProduct } from '@/features/compare/compareSlice'
import { generateGemstoneName } from '@/utils/gemstoneUtils'

// Define types for gemstone data structure
interface GemstoneData {
  price?: number | string
  weight?: number | string
  gemstoneType?: string
  origin?: string
  cut?: string
  color?: string
  clarity?: string
  treatment?: string
  dimensions?: string
  shape?: string
  hardness?: string
  certification?: string
  certificateNumber?: string
  [key: string]: unknown
}

interface AttributeDefinition {
  key: string
  label: string
  type: 'currency' | 'text'
  suffix?: string
}

const ModernGemstoneComparePage = () => {
  const router = useRouter()
  const { removeProduct, clearAll, getProductsByType } = useCompare()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [scrollPosition, setScrollPosition] = useState(0)

  const gemstones = getProductsByType('gemstone')

  if (gemstones.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900 dark:to-pink-800 rounded-full flex items-center justify-center">
              <div className="text-4xl">💎</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No Gemstones to Compare
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Add gemstones to your comparison list to see detailed side-by-side analysis
            </p>
            <button
              onClick={() => router.push('/gemstones')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Browse Gemstones
            </button>
          </div>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice)
  }

  // Comparison attributes for gemstones
  const attributeCategories = [
    {
      title: 'Basic Information',
      attributes: [
        { key: 'price', label: 'Price', type: 'currency' as const },
        { key: 'weight', label: 'Weight', type: 'text' as const, suffix: 'ct' },
        { key: 'gemstoneType', label: 'Type', type: 'text' as const },
        { key: 'origin', label: 'Origin', type: 'text' as const }
      ]
    },
    {
      title: 'Quality & Grading',
      attributes: [
        { key: 'cut', label: 'Cut', type: 'text' as const },
        { key: 'color', label: 'Color', type: 'text' as const },
        { key: 'clarity', label: 'Clarity', type: 'text' as const },
        { key: 'treatment', label: 'Treatment', type: 'text' as const }
      ]
    },
    {
      title: 'Measurements',
      attributes: [
        { key: 'dimensions', label: 'Dimensions', type: 'text' as const },
        { key: 'shape', label: 'Shape', type: 'text' as const },
        { key: 'hardness', label: 'Hardness', type: 'text' as const }
      ]
    },
    {
      title: 'Certification',
      attributes: [
        { key: 'certification', label: 'Lab', type: 'text' as const },
        { key: 'certificateNumber', label: 'Certificate #', type: 'text' as const }
      ]
    }
  ]

  const renderAttributeValue = (gemstone: CompareProduct, attribute: AttributeDefinition) => {
    const value = (gemstone.data as GemstoneData)[attribute.key]
    
    if (!value) {
      return <span className="text-gray-400">N/A</span>
    }
    
    switch (attribute.type) {
      case 'currency':
        return <span className="font-bold text-green-600">{formatPrice(value as number | string)}</span>
      case 'text':
        return (
          <span className="text-sm">
            {String(value)}{attribute.suffix || ''}
          </span>
        )
      default:
        return <span className="text-sm">{value as string}</span>
    }
  }

  // Find best value for highlighting
  const getBestValue = (attribute: AttributeDefinition) => {
    if (attribute.key === 'price') {
      return Math.min(...gemstones.map(g => parseFloat(String((g.data as GemstoneData)[attribute.key] || Infinity))))
    }
    if (attribute.key === 'weight') {
      return Math.max(...gemstones.map(g => parseFloat(String((g.data as GemstoneData)[attribute.key] || 0))))
    }
    return null
  }

  const isBestValue = (gemstone: CompareProduct, attribute: AttributeDefinition) => {
    const bestValue = getBestValue(attribute)
    if (bestValue === null) return false
    
    const currentValue = parseFloat(String((gemstone.data as GemstoneData)[attribute.key] || 0))
    return currentValue === bestValue
  }

  // Handle horizontal scrolling for mobile
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('gemstone-comparison-container')
    if (container) {
      const scrollAmount = 280
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-xl transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Compare Gemstones
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comparing {gemstones.length} of 6 possible gemstones
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-purple-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Arrows */}
        {gemstones.length > 2 && (
          <div className="flex justify-between items-center mb-4 md:hidden">
            <button
              onClick={() => handleScroll('left')}
              disabled={scrollPosition === 0}
              className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Swipe to see more gemstones
            </span>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Comparison Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Product Headers - Horizontal Scroll for Mobile */}
          <div 
            id="gemstone-comparison-container"
            className="overflow-x-auto scrollbar-hide"
          >
            <div 
              className="flex md:grid gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-800 dark:to-pink-800 border-b border-gray-200 dark:border-gray-600 min-w-max md:min-w-0"
              style={{
                gridTemplateColumns: gemstones.length <= 3 
                  ? `repeat(${gemstones.length}, 1fr)` 
                  : 'repeat(auto-fit, minmax(250px, 1fr))'
              }}
            >
              {gemstones.map((gemstone, index) => (
                <div key={gemstone.id} className="relative w-[280px] sm:w-[300px] md:min-w-0 flex-shrink-0">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeProduct(gemstone.id)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-10 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Product Number Badge */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center z-10 shadow-lg font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Product Card */}
                  <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm h-full flex flex-col">
                    {/* Image */}
                    <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-xl mb-4 overflow-hidden relative group">
                      <img
                        src={gemstone.image}
                        alt={generateGemstoneName({
                          process: (gemstone.data as any).process,
                          color: (gemstone.data as any).color,
                          shape: (gemstone.data as any).shape,
                          gemsType: (gemstone.data as any).gemstoneType,
                          subType: (gemstone.data as any).subType,
                          carat: (gemstone.data as any).weight,
                          quantity: (gemstone.data as any).quantity
                        }) || gemstone.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl" />
                    </div>

                    {/* Product Info */}
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm">
                      {generateGemstoneName({
                        process: (gemstone.data as any).process,
                        color: (gemstone.data as any).color,
                        shape: (gemstone.data as any).shape,
                        gemsType: (gemstone.data as any).gemstoneType,
                        subType: (gemstone.data as any).subType,
                        carat: (gemstone.data as any).weight,
                        quantity: (gemstone.data as any).quantity
                      }) || gemstone.name}
                    </h3>
                    <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-4">
                      {formatPrice(gemstone.price)}
                    </p>

                    {/* Quick Stats */}
                    <div className="mb-4">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-3">
                        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                          <span className="text-gray-500 dark:text-gray-400">Weight:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {(gemstone.data as GemstoneData).weight || 'N/A'}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">Type:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {(gemstone.data as GemstoneData).gemstoneType || 'N/A'}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">Color:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {(gemstone.data as GemstoneData).color || 'N/A'}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">Origin:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {(gemstone.data as GemstoneData).origin || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl">
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                          <Heart className="w-4 h-4" />
                          <span className="hidden sm:inline">Save</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Attributes */}
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {attributeCategories.map((category) => (
              <div key={category.title} className="p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  {category.title}
                </h3>
                
                <div className="space-y-4">
                  {category.attributes.map((attribute) => (
                    <div
                      key={attribute.key}
                      className="flex flex-col lg:flex-row lg:items-center gap-4"
                    >
                      {/* Attribute Label */}
                      <div className="lg:w-48 lg:flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 px-3 py-2 rounded-lg inline-block">
                          {attribute.label}
                        </span>
                      </div>

                      {/* Values - Horizontal Scroll for Mobile */}
                      <div className="flex-1 overflow-x-auto scrollbar-hide">
                        <div 
                          className="flex lg:grid gap-3 pb-2 lg:pb-0"
                          style={{
                            gridTemplateColumns: gemstones.length <= 3 
                              ? `repeat(${gemstones.length}, 1fr)` 
                              : 'repeat(auto-fit, minmax(150px, 1fr))'
                          }}
                        >
                          {gemstones.map((gemstone) => (
                            <div
                              key={`${gemstone.id}-${attribute.key}`}
                              className={`min-w-[140px] lg:min-w-0 p-3 rounded-xl text-center transition-all duration-200 ${
                                isBestValue(gemstone, attribute)
                                  ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-200 dark:border-green-700 shadow-lg'
                                  : 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                {isBestValue(gemstone, attribute) && (
                                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                )}
                                <div className="text-gray-900 dark:text-white">
                                  {renderAttributeValue(gemstone, attribute)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary/Recommendations */}
          <div className="p-4 md:p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
                  Gemstone Comparison Guide
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-purple-800 dark:text-purple-200">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Green highlights show the best value in each category
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Consider origin and treatment for authenticity
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Different gemstones have varying hardness scales
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Certification ensures quality and authenticity
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernGemstoneComparePage
