"use client"

import React, { useState } from 'react'
import { useCompare } from '@/hooks/useCompare'
import { ArrowLeft, X, Heart, Grid, List, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface AttributeConfig {
  key: string
  label: string
  type: 'currency' | 'text' | 'badge' | 'rating'
  icon: string
}

const ModernJewelryComparePage = () => {
  const router = useRouter()
  const { removeProduct, clearAll, getProductsByType } = useCompare()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')

  const jewelry = getProductsByType('jewelry')

  if (jewelry.length === 0) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="text-4xl">💍</div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              No Jewelry Selected
            </h2>
            <p className="text-muted-foreground mb-6">
              Choose jewelry pieces to compare side by side
            </p>
            <button
              onClick={() => router.push('/jewelry')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
            >
              Browse Jewelry
            </button>
          </div>
        </div>
        <Footer />
      </>
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

  // Simplified comparison attributes
  const comparisonData: AttributeConfig[] = [
    { key: 'price', label: 'Price', type: 'currency', icon: '💰' },
    { key: 'category', label: 'Type', type: 'text', icon: '📝' },
    { key: 'material', label: 'Material', type: 'text', icon: '💎' },
    { key: 'brand', label: 'Brand', type: 'text', icon: '🏷️' },
    { key: 'metalType', label: 'Metal', type: 'text', icon: '⚡' },
    { key: 'weight', label: 'Weight', type: 'text', icon: '⚖️' },
    { key: 'certification', label: 'Certified', type: 'badge', icon: '🛡️' },
    { key: 'rating', label: 'Rating', type: 'rating', icon: '⭐' },
  ] as const

  const formatValue = (value: unknown, type: string): string => {
    if (value === null || value === undefined || value === '') return '—'
    
    switch (type) {
      case 'currency':
        return formatPrice(typeof value === 'string' || typeof value === 'number' ? value : 0)
      case 'badge':
        return Boolean(value) ? 'Yes' : 'No'
      case 'rating':
        return value ? `${value}/5` : '—'
      default:
        return String(value)
    }
  }

  const getBestValue = (attribute: AttributeConfig): number | null => {
    const values = jewelry.map(p => (p.data as Record<string, unknown>)[attribute.key]).filter(v => v != null && v !== '')
    if (values.length === 0) return null
    
    if (attribute.type === 'currency') {
      return Math.min(...values.map(v => typeof v === 'string' ? parseFloat(v) : Number(v)))
    }
    if (attribute.type === 'rating') {
      return Math.max(...values.map(v => typeof v === 'string' ? parseFloat(v) : Number(v)))
    }
    return null
  }

  const isBestValue = (value: unknown, attribute: AttributeConfig): boolean => {
    const bestValue = getBestValue(attribute)
    if (bestValue === null) return false
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return numValue === bestValue
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        {/* Clean Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Compare Jewelry</h1>
                  <p className="text-muted-foreground text-sm">
                    Comparing {jewelry.length} item{jewelry.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      viewMode === 'grid'
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Grid className="w-4 h-4 mr-2 inline" />
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      viewMode === 'table'
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <List className="w-4 h-4 mr-2 inline" />
                    Table
                  </button>
                </div>
                
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 border border-destructive/20 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {viewMode === 'grid' ? (
            /* Clean Card Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {jewelry.map((product, index) => (
                <div 
                  key={product.id} 
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'
                      }}
                    />
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-background/80 hover:bg-background text-foreground rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute top-3 left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    {/* Key Details */}
                    <div className="space-y-2 text-sm">
                      {(() => {
                        const val = (product.data as Record<string, unknown>).category
                        if (val === null || val === undefined || val === '') return null
                        return (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{String(val)}</span>
                          </div>
                        )
                      })()}
                      {(() => {
                        const val = (product.data as Record<string, unknown>).material
                        if (val === null || val === undefined || val === '') return null
                        return (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Material:</span>
                            <span className="font-medium">{String(val)}</span>
                          </div>
                        )
                      })()}
                      {(() => {
                        const val = (product.data as Record<string, unknown>).metalType
                        if (val === null || val === undefined || val === '') return null
                        return (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Metal:</span>
                            <span className="font-medium">{String(val)}</span>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Add to Cart
                      </button>
                      <button className="p-2 border border-border hover:bg-muted rounded-lg transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Clean Table Layout */
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Product Headers */}
              <div className="bg-muted/30 p-6 border-b border-border">
                <div className="grid grid-cols-[200px_1fr] gap-6">
                  <div className="font-semibold text-muted-foreground">PRODUCTS</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {jewelry.map((product, index) => (
                      <div key={product.id} className="text-center">
                        <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                          <div className="relative">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 mx-auto object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'
                              }}
                            />
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-foreground line-clamp-2 mb-1">
                              {product.name}
                            </h4>
                            <p className="text-sm font-bold text-primary">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comparison Data */}
              <div className="divide-y divide-border">
                {comparisonData.map((attribute) => (
                  <div key={attribute.key} className="grid grid-cols-[200px_1fr] hover:bg-muted/20 transition-colors">
                    <div className="px-6 py-4 border-r border-border font-medium text-foreground flex items-center gap-2">
                      <span className="text-lg">{attribute.icon}</span>
                      {attribute.label}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 divide-x divide-border">
                      {jewelry.map((product) => {
                        const value = (product.data as Record<string, unknown>)[attribute.key]
                        const isHighlighted = isBestValue(value, attribute)
                        
                        return (
                          <div 
                            key={product.id}
                            className={`px-4 py-4 text-center ${
                              isHighlighted && value != null && value !== ''
                                ? 'bg-green-50 text-green-700 font-semibold' 
                                : 'text-foreground'
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-1">
                              <span className="text-sm">
                                {formatValue(value, attribute.type)}
                              </span>
                              {isHighlighted && value != null && value !== '' && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/jewelry')}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
              >
                Browse More Jewelry
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 border border-border hover:bg-muted text-foreground font-medium rounded-lg transition-colors"
              >
                Start New Comparison
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ModernJewelryComparePage
