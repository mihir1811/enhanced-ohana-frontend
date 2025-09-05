'use client'

import React, { useState } from 'react'
import { useCompare } from '@/hooks/useCompare'
import { X, ArrowRight, Scale, Trash2, Eye, ShoppingCart, Plus, Minus, Maximize2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const HorizontalCapsuleCompare = () => {
  const { 
    products, 
    removeProduct, 
    clearAll,
    getCompareCount 
  } = useCompare()
  
  const router = useRouter()
  const count = getCompareCount()
  const [isExpanded, setIsExpanded] = useState(false)

  if (count === 0) return null

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
      {/* Main Horizontal Capsule */}
      <div className="flex flex-col items-end gap-3">
        {/* Product Images Capsule */}
        <div 
          className={`
            flex items-center bg-white rounded-full shadow-2xl border border-gray-200 p-1.5
            transition-all duration-500 ease-out transform hover:scale-105
            ${isExpanded ? 'pr-4' : ''}
          `}
          style={{
            width: isExpanded 
              ? `${Math.max(200, 60 + (products.length * 40) + 80)}px`
              : `${Math.max(80, 30 + (products.length * 36))}px`
          }}
        >
          {/* Overlapping Product Images */}
          <div className="flex items-center">
            {products.slice(0, 6).map((product, index) => (
              <div
                key={product.id}
                className={`
                  relative group transition-all duration-300 transform hover:scale-125 hover:z-20
                  ${isExpanded ? 'w-14 h-14' : 'w-12 h-12'}
                  ${index > 0 ? (isExpanded ? '-ml-4' : '-ml-3') : ''}
                `}
                style={{ zIndex: 10 + index }}
              >
                {/* Product Image */}
                <div className="relative w-full h-full bg-white rounded-full shadow-lg border-3 border-white overflow-hidden group-hover:border-blue-400 transition-all duration-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'
                    }}
                  />
                  
                  {/* Hover ring effect */}
                  <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 ring-opacity-0 group-hover:ring-opacity-100 transition-all duration-200"></div>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeProduct(product.id)
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg scale-75 hover:scale-100"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>

                  {/* Product number badge */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>

                {/* Enhanced tooltip */}
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-3 rounded-xl text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 shadow-2xl min-w-32">
                  <div className="text-center">
                    <div className="font-medium mb-1 line-clamp-2">{product.name}</div>
                    <div className="font-bold text-blue-300 text-sm">{formatPrice(product.price)}</div>
                    <div className="text-gray-300 text-xs mt-1 capitalize">{product.type}</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}

            {/* Add more placeholder */}
            {count < 6 && isExpanded && (
              <div className={`
                flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 rounded-full border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-200 cursor-pointer
                w-14 h-14 -ml-4
              `}>
                <Plus className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
              </div>
            )}
          </div>

          {/* Expand/Collapse trigger and count */}
          <div className="flex items-center gap-2 ml-auto">
            {isExpanded && (
              <div className="text-xs font-medium text-gray-600">
                {count}/4
              </div>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isExpanded ? (
                <Minus className="w-4 h-4" />
              ) : (
                <div className="flex flex-col items-center">
                  <Maximize2 className="w-3 h-3" />
                  <div className="text-xs font-bold leading-none">{count}</div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Expanded Control Panel */}
        {isExpanded && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-72 animate-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Compare Products</h3>
                <p className="text-sm text-gray-500">{count} product{count !== 1 ? 's' : ''} selected</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      index < count 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center">
                {count === 4 ? 'Maximum products selected' : `Add ${4 - count} more to compare`}
              </p>
            </div>

            {/* Product list */}
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
              {products.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-all duration-200">
                  <div className="w-8 h-8 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs font-semibold text-blue-600">{formatPrice(product.price)}</p>
                  </div>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleViewComparison}
                disabled={count < 2}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <Eye className="w-5 h-5" />
                View Comparison
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    products.forEach(product => {
                      console.log('Adding to cart:', product.id)
                    })
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add All
                </button>
                <button
                  onClick={clearAll}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating instruction hint */}
        {count < 4 && !isExpanded && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-75 animate-bounce">
            Click ⊕ to add products
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HorizontalCapsuleCompare
