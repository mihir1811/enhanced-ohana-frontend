'use client'

import React, { useState } from 'react'
import { useCompare } from '@/hooks/useCompare'
import { ArrowLeft, X, Heart, ShoppingCart, Info, Eye, CheckCircle, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import * as ShapeIcons from '@/../public/icons'
import { CompareProduct } from '@/features/compare/compareSlice'

interface AttributeConfig {
  key: string
  label: string
  type: 'currency' | 'shape' | 'text' | 'default'
  suffix?: string
}

const ModernDiamondComparePage = () => {
  const router = useRouter()
  const { removeProduct, clearAll, getProductsByType } = useCompare()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [scrollPosition, setScrollPosition] = useState(0)

  const diamonds = getProductsByType('diamond')

  if (diamonds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center">
              <div className="text-4xl">💎</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No Diamonds to Compare
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Add diamonds to your comparison list to see detailed side-by-side analysis
            </p>
            <button
              onClick={() => router.push('/diamonds')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Browse Diamonds
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

  // Get shape icon
  const getShapeIcon = (shape: string) => {
    const shapeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'round': ShapeIcons.RoundIcon,
      'pear': ShapeIcons.PearIcon,
      'emerald': ShapeIcons.EmeraldIcon,
      'oval': ShapeIcons.OvalIcon,
      'heart': ShapeIcons.HeartIcon,
      'marquise': ShapeIcons.MarquiseIcon,
      'asscher': ShapeIcons.AsscherIcon,
      'cushion': ShapeIcons.CushionIcon,
      'cushion modified': ShapeIcons.CushionModifiedIcon,
      'cushion brilliant': ShapeIcons.CushionBrilliantIcon,
      'radiant': ShapeIcons.RadiantIcon,
      'princess': ShapeIcons.PrincessIcon,
      'default': ShapeIcons.DefaultIcon
    }
    
    const Icon = shapeIconMap[shape?.toLowerCase?.()] || shapeIconMap['default']
    return <Icon className="w-6 h-6" />
  }

  // Comparison attributes configuration
  const attributeCategories: Array<{
    title: string
    attributes: AttributeConfig[]
  }> = [
    {
      title: 'Basic Information',
      attributes: [
        { key: 'price', label: 'Price', type: 'currency' as const },
        { key: 'caratWeight', label: 'Carat Weight', type: 'text' as const, suffix: 'ct' },
        { key: 'shape', label: 'Shape', type: 'shape' as const },
        { key: 'certificateNumber', label: 'Certificate #', type: 'text' as const }
      ]
    },
    {
      title: '4Cs Grading',
      attributes: [
        { key: 'cut', label: 'Cut', type: 'text' as const },
        { key: 'color', label: 'Color', type: 'text' as const },
        { key: 'clarity', label: 'Clarity', type: 'text' as const }
      ]
    },
    {
      title: 'Measurements',
      attributes: [
        { key: 'measurement', label: 'Measurements', type: 'text' as const },
        { key: 'table', label: 'Table %', type: 'text' as const, suffix: '%' },
        { key: 'depth', label: 'Depth %', type: 'text' as const, suffix: '%' },
        { key: 'ratio', label: 'Ratio', type: 'text' as const }
      ]
    },
    {
      title: 'Additional Details',
      attributes: [
        { key: 'polish', label: 'Polish', type: 'text' as const },
        { key: 'symmetry', label: 'Symmetry', type: 'text' as const },
        { key: 'fluorescence', label: 'Fluorescence', type: 'text' as const },
        { key: 'certification', label: 'Lab', type: 'text' as const }
      ]
    }
  ]

  const renderAttributeValue = (diamond: CompareProduct, attribute: AttributeConfig) => {
    const value = (diamond.data as Record<string, unknown>)[attribute.key]
    
    if (!value) {
      return <span className="text-gray-400">N/A</span>
    }
    
    switch (attribute.type) {
      case 'currency':
        return <span className="font-bold text-green-600">{formatPrice(String(value))}</span>
      case 'shape':
        return (
          <div className="flex items-center gap-2 justify-center">
            {getShapeIcon(String(value))}
            <span className="text-sm">{String(value)}</span>
          </div>
        )
      case 'text':
        return (
          <span className="text-sm">
            {String(value)}{attribute.suffix || ''}
          </span>
        )
      default:
        return <span className="text-sm">{String(value)}</span>
    }
  }

  // Find best value for highlighting
  const getBestValue = (attribute: AttributeConfig) => {
    if (attribute.key === 'price') {
      return Math.min(...diamonds.map(d => parseFloat(String((d.data as Record<string, unknown>)[attribute.key]) || 'Infinity')))
    }
    if (attribute.key === 'caratWeight') {
      return Math.max(...diamonds.map(d => parseFloat(String((d.data as Record<string, unknown>)[attribute.key]) || '0')))
    }
    return null
  }

  const isBestValue = (diamond: CompareProduct, attribute: AttributeConfig) => {
    const bestValue = getBestValue(attribute)
    if (bestValue === null) return false
    
    const currentValue = parseFloat(String((diamond.data as Record<string, unknown>)[attribute.key]) || '0')
    return currentValue === bestValue
  }

  // Handle horizontal scrolling for mobile
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('comparison-container')
    if (container) {
      const scrollAmount = 280 // Width of one product card
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount)
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
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
                Compare Diamonds
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comparing {diamonds.length} of 6 possible diamonds
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
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-blue-500 text-white' 
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
        {diamonds.length > 2 && (
          <div className="flex justify-between items-center mb-4 md:hidden">
            <button
              onClick={() => handleScroll('left')}
              disabled={scrollPosition === 0}
              className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Swipe to see more diamonds
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
            id="comparison-container"
            className="overflow-x-auto scrollbar-hide"
          >
            <div 
              className="flex md:grid gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600 min-w-max md:min-w-0"
              style={{
                gridTemplateColumns: diamonds.length <= 3 
                  ? `repeat(${diamonds.length}, 1fr)` 
                  : 'repeat(auto-fit, minmax(250px, 1fr))'
              }}
            >
              {diamonds.map((diamond, index) => (
                <div key={diamond.id} className="relative w-[280px] sm:w-[300px] md:min-w-0 flex-shrink-0">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeProduct(diamond.id)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-10 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Product Number Badge */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center z-10 shadow-lg font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Product Card */}
                  <div className="text-center bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm h-full flex flex-col">
                    {/* Image */}
                    <div className="aspect-square bg-gray-50 dark:bg-gray-700 rounded-xl mb-4 overflow-hidden relative group">
                      <Image
                        src={diamond.image}
                        alt={diamond.name}
                        width={200}
                        height={200}
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
                      {diamond.name}
                    </h3>
                    <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-4">
                      {formatPrice(diamond.price)}
                    </p>

                    {/* Quick Stats */}
                    <div className="mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                          <span className="text-gray-500 dark:text-gray-400">Carat:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {String((diamond.data as Record<string, unknown>).caratWeight)}ct
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">Shape:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {String((diamond.data as Record<string, unknown>).shape)}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">Cut:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {String((diamond.data as Record<string, unknown>).cut) || 'N/A'}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">Color:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {String((diamond.data as Record<string, unknown>).color) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900 rounded-xl hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-300 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl">
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
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
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
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg inline-block">
                          {attribute.label}
                        </span>
                      </div>

                      {/* Values - Horizontal Scroll for Mobile */}
                      <div className="flex-1 overflow-x-auto scrollbar-hide">
                        <div 
                          className="flex lg:grid gap-3 pb-2 lg:pb-0"
                          style={{
                            gridTemplateColumns: diamonds.length <= 3 
                              ? `repeat(${diamonds.length}, 1fr)` 
                              : 'repeat(auto-fit, minmax(150px, 1fr))'
                          }}
                        >
                          {diamonds.map((diamond) => (
                            <div
                              key={`${diamond.id}-${attribute.key}`}
                              className={`min-w-[140px] lg:min-w-0 p-3 rounded-xl text-center transition-all duration-200 ${
                                isBestValue(diamond, attribute)
                                  ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-200 dark:border-green-700 shadow-lg'
                                  : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                {isBestValue(diamond, attribute) && (
                                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                )}
                                <div className="text-gray-900 dark:text-white">
                                  {renderAttributeValue(diamond, attribute)}
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
          <div className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Comparison Tips & Best Practices
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Green highlights show the best value in each category
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Focus on the 4Cs: Cut, Color, Clarity, and Carat weight
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Certification from GIA, IGI, or AGS ensures authenticity
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Consider your budget and personal style preferences
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

export default ModernDiamondComparePage
