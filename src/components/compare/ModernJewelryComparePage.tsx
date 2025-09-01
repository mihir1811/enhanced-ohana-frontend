'use client'

import React, { useState } from 'react'
import { useCompare } from '@/hooks/useCompare'
import { ArrowLeft, X, Heart, ShoppingCart, Eye, CheckCircle, Info, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ModernJewelryComparePage = () => {
  const router = useRouter()
  const { products, removeProduct, clearAll, getProductsByType } = useCompare()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [scrollPosition, setScrollPosition] = useState(0)

  const jewelry = getProductsByType('jewelry')

  if (jewelry.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900 dark:to-yellow-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900 dark:to-yellow-800 rounded-full flex items-center justify-center">
              <div className="text-4xl">💍</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No Jewelry to Compare
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Add jewelry pieces to your comparison list to see detailed side-by-side analysis
            </p>
            <button
              onClick={() => router.push('/jewelry')}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Browse Jewelry
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

  // Comparison attributes for jewelry
  const attributeCategories = [
    {
      title: 'Basic Information',
      attributes: [
        { key: 'price', label: 'Price', type: 'currency' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'material', label: 'Material', type: 'text' },
        { key: 'brand', label: 'Brand', type: 'text' }
      ]
    },
    {
      title: 'Design & Craftsmanship',
      attributes: [
        { key: 'style', label: 'Style', type: 'text' },
        { key: 'setting', label: 'Setting', type: 'text' },
        { key: 'metalType', label: 'Metal Type', type: 'text' },
        { key: 'metalPurity', label: 'Metal Purity', type: 'text' }
      ]
    },
    {
      title: 'Specifications',
      attributes: [
        { key: 'weight', label: 'Weight', type: 'text' },
        { key: 'size', label: 'Size', type: 'text' },
        { key: 'dimensions', label: 'Dimensions', type: 'text' },
        { key: 'chainLength', label: 'Chain Length', type: 'text' }
      ]
    },
    {
      title: 'Quality & Certification',
      attributes: [
        { key: 'certification', label: 'Certification', type: 'text' },
        { key: 'condition', label: 'Condition', type: 'text' },
        { key: 'warranty', label: 'Warranty', type: 'text' },
        { key: 'rating', label: 'Rating', type: 'rating' }
      ]
    }
  ]

  const formatAttributeValue = (value: any, attribute: any) => {
    if (value === null || value === undefined || value === '') return '-'
    
    switch (attribute.type) {
      case 'currency':
        return <span className="font-bold text-green-600">{formatPrice(value)}</span>
      case 'rating':
        return (
          <div className="flex items-center">
            <span className="font-medium">{value}</span>
            <div className="flex ml-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-sm ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ⭐
                </span>
              ))}
            </div>
          </div>
        )
      default:
        return String(value) + (attribute.suffix || '')
    }
  }

  const getBestValue = (products: any[], attributeKey: string, type: string) => {
    const values = products.map(p => p.data[attributeKey]).filter(v => v != null && v !== '')
    if (values.length === 0) return null
    
    if (type === 'currency') {
      return Math.min(...values.map(v => typeof v === 'string' ? parseFloat(v) : v))
    }
    if (type === 'rating') {
      return Math.max(...values.map(v => typeof v === 'string' ? parseFloat(v) : v))
    }
    return null
  }

  const isBestValue = (value: any, attributeKey: string, type: string) => {
    const bestValue = getBestValue(jewelry, attributeKey, type)
    if (bestValue === null) return false
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return numValue === bestValue
  }

  const scrollTable = (direction: 'left' | 'right') => {
    const container = document.getElementById('comparison-table-container')
    if (container) {
      const containerWidth = container.clientWidth
      // Use consistent scroll amounts that match card widths
      const scrollAmount = containerWidth > 640 ? 312 : 292 // 300px + 12px gap for sm, 280px + 12px gap for mobile
      const currentScroll = container.scrollLeft
      const newPosition = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900 dark:to-yellow-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-xl transition-colors backdrop-blur-sm flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                Compare Jewelry
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Comparing {jewelry.length} of 6 possible pieces
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between lg:justify-end gap-2">
            {/* Mobile View Mode Toggle */}
            <div className="flex sm:hidden bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-amber-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop View Mode Toggle */}
            <div className="hidden sm:flex bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-amber-500 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm sm:text-base"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
            </button>
          </div>
        </div>

        {/* Mobile Grid Navigation */}
        {jewelry.length > 1 && viewMode === 'grid' && (
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <button
              onClick={() => scrollTable('left')}
              disabled={scrollPosition <= 0}
              className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-amber-600" />
            </button>
            <div className="text-center">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 block">
                Swipe to see more
              </span>
              <div className="flex justify-center gap-1 mt-1">
                {jewelry.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === Math.floor(scrollPosition / 300) 
                        ? 'bg-amber-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => scrollTable('right')}
              className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="w-5 h-5 text-amber-600" />
            </button>
          </div>
        )}

        {viewMode === 'grid' ? (
          /* Grid View - Responsive Card Layout */
          <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-xl overflow-hidden border border-amber-200 dark:border-amber-700">
            {/* Grid Container with Responsive Scroll */}
            <div 
              id="comparison-table-container"
              className="overflow-x-auto scrollbar-hide touch-pan-x"
              style={{ scrollBehavior: 'smooth' }}
              onScroll={(e) => {
                const target = e.target as HTMLDivElement
                setScrollPosition(target.scrollLeft)
              }}
            >
              <div 
                className={`
                  flex gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 
                  bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-800 dark:to-yellow-700 
                  border-b border-amber-200 dark:border-amber-600
                  ${jewelry.length <= 2 ? 'lg:grid lg:grid-cols-2 lg:gap-6' : ''}
                  ${jewelry.length === 3 ? 'xl:grid xl:grid-cols-3 xl:gap-6' : ''}
                  ${jewelry.length >= 4 ? 'min-w-max' : ''}
                `}
              >
                {jewelry.map((product, index) => (
                  <div 
                    key={product.id} 
                    className={`
                      relative flex-shrink-0
                      w-[280px] sm:w-[300px] 
                      ${jewelry.length <= 2 ? 'lg:w-auto' : ''}
                      ${jewelry.length === 3 ? 'xl:w-auto' : ''}
                    `}
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-20 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>

                    {/* Product Number Badge */}
                    <div className="absolute -top-2 -left-2 w-7 h-7 sm:w-8 sm:h-8 bg-amber-500 text-white rounded-full flex items-center justify-center z-20 shadow-lg font-bold text-xs sm:text-sm">
                      {index + 1}
                    </div>

                    {/* Product Card */}
                    <div className="text-center bg-white dark:bg-gray-800 rounded-lg lg:rounded-xl p-3 sm:p-4 shadow-sm border border-amber-200 dark:border-amber-700 h-full flex flex-col">
                      {/* Image */}
                      <div className="aspect-square bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-800 dark:to-yellow-800 rounded-lg lg:rounded-xl mb-3 sm:mb-4 overflow-hidden relative group">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg lg:rounded-xl" />
                      </div>

                      {/* Product Name */}
                      <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm lg:text-base mb-2 line-clamp-2 h-10 flex items-center justify-center leading-tight">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-600 dark:text-amber-400 mb-3">
                        {formatPrice(product.price)}
                      </div>

                      {/* Key Details */}
                      <div className="space-y-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 flex-grow">
                        <div className="flex items-center justify-center">
                          <div className="w-full max-w-[200px] bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                            <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-left">
                              <span className="text-gray-500 dark:text-gray-400 text-xs">Type:</span>
                              <span className="font-medium text-gray-900 dark:text-white text-xs truncate">
                                {product.data.category || 'N/A'}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400 text-xs">Material:</span>
                              <span className="font-medium text-gray-900 dark:text-white text-xs truncate">
                                {product.data.material || 'N/A'}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400 text-xs">Brand:</span>
                              <span className="font-medium text-gray-900 dark:text-white text-xs truncate">
                                {product.data.brand || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1.5 sm:gap-2">
                        <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md lg:rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center">
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Add</span>
                          <span className="sm:hidden">+</span>
                        </button>
                        <button className="p-1.5 sm:p-2 border border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900 rounded-md lg:rounded-lg transition-colors">
                          <Heart className="w-3 h-3" />
                        </button>
                        <button className="p-1.5 sm:p-2 border border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900 rounded-md lg:rounded-lg transition-colors">
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Table View - Responsive Table Layout */
          <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-xl overflow-hidden border border-amber-200 dark:border-amber-700">
            {/* Table Header */}
            <div className="p-3 sm:p-4 lg:p-6 border-b border-amber-200 dark:border-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-800 dark:to-yellow-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                  Detailed Comparison
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollTable('left')}
                    className="p-1.5 sm:p-2 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                  </button>
                  <button
                    onClick={() => scrollTable('right')}
                    className="p-1.5 sm:p-2 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Responsive Table Container */}
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-800 dark:to-yellow-700 border-b border-amber-200 dark:border-amber-600">
                    <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-gray-900 dark:text-white sticky left-0 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-800 dark:to-yellow-700 z-10 min-w-[140px] sm:min-w-[180px] lg:min-w-[200px] text-xs sm:text-sm lg:text-base">
                      Product Details
                    </th>
                    {jewelry.map((product, index) => (
                      <th key={product.id} className="text-center p-2 sm:p-3 lg:p-4 font-semibold text-gray-900 dark:text-white min-w-[160px] sm:min-w-[200px] lg:min-w-[250px]">
                        <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                          {/* Product Number */}
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                            {index + 1}
                          </div>
                          
                          {/* Product Image */}
                          <div className="relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-cover rounded-md lg:rounded-lg border-2 border-amber-200 dark:border-amber-600"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'
                              }}
                            />
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                            >
                              <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                          </div>
                          
                          {/* Product Name */}
                          <div className="text-xs sm:text-sm lg:text-base font-medium line-clamp-2 text-center max-w-[120px] sm:max-w-[150px] lg:max-w-[180px] leading-tight">
                            {product.name}
                          </div>
                          
                          {/* Product Price */}
                          <div className="text-xs sm:text-sm lg:text-base font-bold text-amber-600 dark:text-amber-400">
                            {formatPrice(product.price)}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attributeCategories.map((category, categoryIndex) => (
                    <React.Fragment key={category.title}>
                      <tr className="bg-amber-100 dark:bg-amber-800">
                        <td 
                          colSpan={jewelry.length + 1} 
                          className="p-2 sm:p-3 lg:p-4 font-semibold text-amber-700 dark:text-amber-300 text-xs sm:text-sm lg:text-base uppercase tracking-wide"
                        >
                          {category.title}
                        </td>
                      </tr>
                      {category.attributes.map((attribute, attrIndex) => (
                        <tr 
                          key={attribute.key}
                          className={`border-b border-gray-100 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors ${
                            (categoryIndex + attrIndex) % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'
                          }`}
                        >
                          <td className="p-2 sm:p-3 lg:p-4 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-inherit z-10 text-xs sm:text-sm lg:text-base">
                            {attribute.label}
                          </td>
                          {jewelry.map((product) => {
                            const value = product.data[attribute.key]
                            const isHighlighted = isBestValue(value, attribute.key, attribute.type)
                            
                            return (
                              <td 
                                key={product.id}
                                className={`p-2 sm:p-3 lg:p-4 text-center text-xs sm:text-sm lg:text-base ${
                                  isHighlighted 
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold' 
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}
                              >
                                <div className="flex flex-col items-center space-y-1">
                                  <div className="break-words max-w-[120px] sm:max-w-[150px] lg:max-w-[180px]">
                                    {formatAttributeValue(value, attribute)}
                                  </div>
                                  {isHighlighted && (
                                    <div className="flex items-center justify-center">
                                      <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 mr-1" />
                                      <span className="text-xs text-green-600 dark:text-green-400">Best</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-0">
          <button
            onClick={() => router.push('/jewelry')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            Browse More Jewelry
          </button>
          <button
            onClick={clearAll}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900 font-semibold rounded-xl transition-colors text-sm sm:text-base"
          >
            Start New Comparison
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModernJewelryComparePage
