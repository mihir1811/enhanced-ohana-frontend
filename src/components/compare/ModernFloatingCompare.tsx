'use client'

import React, { useState, useEffect } from 'react'
import { useCompare } from '@/hooks/useCompare'
import { X, ArrowRight, Scale, Trash2, Eye, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ModernFloatingCompare = () => {
  const { 
    products, 
    removeProduct, 
    clearAll,
    getCompareCount 
  } = useCompare()
  
  const router = useRouter()
  const count = getCompareCount()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Show/hide animation
  useEffect(() => {
    if (count > 0) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
      setIsExpanded(false)
    }
  }, [count])

  if (!isVisible) return null

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice)
  }

  const handleViewComparison = () => {
    const firstProductType = products[0]?.type
    if (firstProductType) {
      router.push(`/compare/${firstProductType}s`)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Compare Widget */}
      <div 
        className={`
          bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-500 ease-out transform
          ${isExpanded ? 'w-80 max-h-96' : 'w-20 h-20'}
          ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-75'}
        `}
      >
        {!isExpanded ? (
          /* Collapsed State - Floating Product Stack */
          <div 
            className="relative w-20 h-20 cursor-pointer group"
            onClick={() => setIsExpanded(true)}
          >
            {/* Stacked Product Images */}
            <div className="absolute inset-2">
              {products.slice(0, 3).map((product, index) => (
                <div
                  key={product.id}
                  className="absolute inset-0 rounded-xl overflow-hidden border-2 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                  style={{
                    transform: `rotate(${index * 5 - 5}deg) translate(${index * 2}px, ${index * 2}px)`,
                    zIndex: 10 - index
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Count Badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
              {count}
            </div>

            {/* Compare Icon Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Scale className="w-6 h-6 text-white" />
            </div>
          </div>
        ) : (
          /* Expanded State - Full Compare Panel */
          <div className="p-4 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Compare</h3>
                <span className="text-sm text-gray-500">({count}/4)</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Product List */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {products.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                  {/* Product Image */}
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeProduct(product.id)
                    }}
                    className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
                      index < count ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center">
                {count === 4 ? 'Maximum reached' : `Add ${4 - count} more to compare`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleViewComparison}
                disabled={count < 2}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
              >
                <Eye className="w-4 h-4" />
                View Comparison
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    products.forEach(product => {
                      console.log('Add to cart:', product.id)
                    })
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add All
                </button>
                <button
                  onClick={clearAll}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Add More Tip */}
      {count < 4 && !isExpanded && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-75 animate-pulse">
          Click ⊕ on products to add
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}

export default ModernFloatingCompare
