'use client'

import React, { useState } from 'react'
import { useCompare } from '@/hooks/useCompare'
import { X, ArrowRight, Scale, Trash2, Eye, Plus, Minus, Maximize2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholders'

const PLURAL_MAP: Record<string, string> = {
  diamond: 'diamonds',
  gemstone: 'gemstones',
  jewelry: 'jewelry',
  watch: 'watches'
}

const TYPE_LABELS: Record<string, string> = {
  diamond: 'Diamonds',
  gemstone: 'Gemstones',
  jewelry: 'Jewelry',
  watch: 'Watches'
}

const HorizontalCapsuleCompare = () => {
  const { 
    products, 
    removeProduct, 
    clearAll,
    getCompareCount,
    getTypeGroups
  } = useCompare()
  
  const router = useRouter()
  const count = getCompareCount()
  const typeGroups = getTypeGroups()
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

  const handleViewComparison = (type: string) => {
    const path = PLURAL_MAP[type] || `${type}s`
    router.push(`/compare/${path}`)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] overflow-visible">
      {/* Main Horizontal Capsule */}
      <div className="flex flex-col items-end gap-3 overflow-visible">
        {/* Product Images Capsule - white bar with strong shadow for visibility */}
        <div 
          className={`
            flex items-center rounded-full p-2 overflow-visible
            transition-all duration-500 ease-out transform hover:scale-[1.02]
            ${isExpanded ? 'pr-4' : ''}
          `}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)',
            width: isExpanded 
              ? `${Math.max(220, 60 + (products.length * 40) + 100)}px`
              : `${Math.max(120, 40 + (products.length * 36) + 50)}px`
          }}
        >
          {/* Overlapping Product Images */}
          <div className="flex items-center overflow-visible">
            {products.slice(0, 6).map((product, index) => (
              <div
                key={product.id}
                className={`
                  relative group overflow-visible transition-all duration-300 transform hover:scale-125 hover:z-20
                  ${isExpanded ? 'w-14 h-14' : 'w-12 h-12'}
                  ${index > 0 ? (isExpanded ? '-ml-4' : '-ml-3') : ''}
                `}
                style={{ zIndex: 10 + index, pointerEvents: 'none' }}
              >
                {/* Product Image - pointer-events-auto so hover works; pass-through on overlap for remove button */}
                <div className="relative w-full h-full rounded-full transition-all duration-200 pointer-events-auto" style={{ backgroundColor: '#e5e7eb', border: '2px solid #d1d5db' }}>
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = PLACEHOLDER_IMAGE
                      }}
                    />
                  </div>
                  {/* Hover ring effect */}
                  <div className="absolute inset-0 rounded-full ring-2 ring-opacity-0 group-hover:ring-opacity-100 transition-all duration-200 pointer-events-none" style={{ boxShadow: '0 0 0 2px var(--status-warning)' }}></div>
                </div>

                {/* Remove button - top-right, pointer-events-auto so it receives clicks even when overlapped */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    removeProduct(String(product.id))
                  }}
                  className="absolute -top-1 -right-1 w-6 h-6 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform pointer-events-auto cursor-pointer"
                  style={{ backgroundColor: '#dc2626', boxShadow: '0 2px 6px rgba(0,0,0,0.2)', zIndex: 50 }}
                >
                  <X className="w-3 h-3" strokeWidth={2.5} />
                </button>

                {/* Product number badge - bottom-right */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 text-white rounded-full flex items-center justify-center text-xs font-bold pointer-events-none" style={{ backgroundColor: '#fbbf24', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 10 }}>
                  {index + 1}
                </div>

                {/* Enhanced tooltip */}
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 p-3 rounded-xl text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 shadow-2xl min-w-32" style={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)' }}>
                  <div className="text-center">
                    <div className="font-medium mb-1 line-clamp-2">{product.name}</div>
                    <div className="font-bold text-sm" style={{ color: 'var(--primary)' }}>{formatPrice(product.price)}</div>
                    <div className="text-xs mt-1 capitalize" style={{ color: 'var(--muted-foreground)' }}>{product.type}</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" style={{ borderTopColor: 'var(--popover)' }}></div>
                </div>
              </div>
            ))}

            {/* Add more placeholder */}
            {count < 6 && isExpanded && (
              <div
                className="flex items-center justify-center rounded-full border-2 border-dashed w-14 h-14 -ml-4 transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: '#f3f4f6',
                  borderColor: '#d1d5db'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7'
                  e.currentTarget.style.borderColor = '#fbbf24'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                  e.currentTarget.style.borderColor = '#d1d5db'
                }}
              >
                <Plus className="w-5 h-5 transition-colors" style={{ color: '#6b7280' }} />
              </div>
            )}
          </div>

          {/* Expand/Collapse trigger and count */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            {isExpanded && (
              <div className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                {count}/4
              </div>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#fbbf24', color: 'white', boxShadow: '0 4px 14px rgba(251,191,36,0.5), 0 2px 8px rgba(0,0,0,0.15)' }}
              aria-label={isExpanded ? 'Collapse compare bar' : 'Expand compare bar'}
            >
              {isExpanded ? (
                <Minus className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                <div className="flex flex-col items-center gap-0.5">
                  <Maximize2 className="w-4 h-4" strokeWidth={2.5} />
                  <span className="text-xs font-bold leading-none">{count}</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Expanded Control Panel */}
        {isExpanded && (
          <div className="rounded-2xl shadow-xl border p-4 w-72 animate-in slide-in-from-bottom-2 duration-300" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--status-warning)' }}>
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>Compare Products</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{count} product{count !== 1 ? 's' : ''} selected</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 h-2 rounded-full transition-all duration-300"
                    style={{ backgroundColor: index < count ? 'var(--status-warning)' : 'var(--muted)' }}
                  />
                ))}
              </div>
              <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
                {count === 4 ? 'Maximum products selected' : `Add ${4 - count} more to compare`}
              </p>
            </div>

            {/* Product list */}
            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
              {products.map((product, index) => (
                <div key={product.id} className="group flex items-center gap-3 p-2 rounded-xl transition-all duration-200" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="w-8 h-8 rounded-lg overflow-hidden border flex-shrink-0" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = PLACEHOLDER_IMAGE
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{product.name}</p>
                    <p className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>{formatPrice(product.price)}</p>
                  </div>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="w-6 h-6 text-white rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'var(--destructive)' }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {typeGroups.length === 1 ? (
                <button
                  onClick={() => handleViewComparison(typeGroups[0].type)}
                  disabled={typeGroups[0].count < 2}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: typeGroups[0].count >= 2 ? 'var(--status-warning)' : 'var(--muted)', color: typeGroups[0].count >= 2 ? 'white' : 'var(--muted-foreground)' }}
                >
                  <Eye className="w-5 h-5" />
                  View Comparison ({typeGroups[0].count} {TYPE_LABELS[typeGroups[0].type]})
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    Compare by type:
                  </p>
                  {typeGroups.map(({ type, count: typeCount }) => (
                    <button
                      key={type}
                      onClick={() => handleViewComparison(type)}
                      disabled={typeCount < 2}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                      style={{ backgroundColor: typeCount >= 2 ? 'var(--status-warning)' : 'var(--muted)', color: typeCount >= 2 ? 'white' : 'var(--muted-foreground)' }}
                    >
                      <Eye className="w-4 h-4" />
                      {typeCount} {TYPE_LABELS[type]}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={clearAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: 'color-mix(in srgb, var(--destructive) 12%, transparent)', color: 'var(--destructive)', border: '1px solid var(--destructive)' }}
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Floating instruction hint */}
        {count < 4 && !isExpanded && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg text-xs whitespace-nowrap animate-bounce" style={{ backgroundColor: '#fbbf24', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            Click ⊕ to add products
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" style={{ borderTopColor: 'var(--status-warning)' }}></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HorizontalCapsuleCompare
