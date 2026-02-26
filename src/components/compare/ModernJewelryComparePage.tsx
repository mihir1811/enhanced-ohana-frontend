"use client"

import React, { useState } from 'react'
import { useCompare } from '@/hooks/useCompare'
import { ArrowLeft, X, Heart, CheckCircle } from 'lucide-react'
import { ViewToggle } from '@/components/ui/ViewToggle'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
interface AttributeConfig {
  key: string
  label: string
  type: 'currency' | 'text' | 'badge' | 'rating'
  icon: string
}

const ModernJewelryComparePage = () => {
  const router = useRouter()
  const { removeProduct, clearAll, getProductsByType, maxProducts } = useCompare()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')

  const jewelry = getProductsByType('jewelry')

  if (jewelry.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        {/* Clean Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Compare Jewelry</h1>
                  <p className="text-muted-foreground text-sm">
                    Comparing {jewelry.length} of {maxProducts} possible jewelry
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <ViewToggle value={viewMode} onChange={setViewMode} showLabels />
                
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 border border-destructive/20 rounded-lg transition-colors cursor-pointer"
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
            /* List UI in Grid: vertical table - attributes as rows, products as columns */
            <div className="w-full overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <table className="min-w-[600px] w-full border-collapse" style={{ borderColor: 'var(--border)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    <th className="text-left p-4 font-semibold w-40 min-w-[160px] sticky left-0 z-10 border-r border-b" style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                      Spec
                    </th>
                    {jewelry.map((product, index) => (
                      <th key={product.id} className="p-4 min-w-[180px] align-top border-r border-b last:border-r-0" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative">
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'
                                }}
                              />
                            </div>
                            <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}>
                              {index + 1}
                            </span>
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90 cursor-pointer"
                              style={{ backgroundColor: 'var(--destructive)' }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-sm line-clamp-2" style={{ color: 'var(--foreground)' }}>{product.name}</div>
                            <div className="font-bold mt-1" style={{ color: 'var(--status-success)' }}>{formatPrice(product.price)}</div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((attr) => (
                    <tr key={attr.key}>
                      <td className="p-4 font-medium sticky left-0 z-10 border-r border-b" style={{ backgroundColor: 'var(--card)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{attr.icon}</span>
                          {attr.label}
                        </div>
                      </td>
                      {jewelry.map((product) => {
                        const value = (product.data as Record<string, unknown>)[attr.key]
                        const isHighlighted = isBestValue(value, attr)
                        return (
                          <td
                            key={product.id}
                            className={`p-4 text-center border-r border-b last:border-r-0 ${isHighlighted && value != null && value !== '' ? 'font-semibold' : ''}`}
                            style={isHighlighted && value != null && value !== '' ? { backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success)', borderColor: 'var(--border)' } : { color: 'var(--foreground)', borderColor: 'var(--border)' }}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {isHighlighted && value != null && value !== '' && <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--status-success)' }} />}
                              <span className="text-sm">{formatValue(value, attr.type)}</span>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid UI in List: horizontal table - products as rows, attributes as columns */
            <div className="w-full overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <table className="min-w-[700px] w-full border-collapse" style={{ borderColor: 'var(--border)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    <th className="text-left p-4 font-semibold w-48 min-w-[180px] sticky left-0 z-10 border-r border-b" style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                      Jewelry
                    </th>
                    {comparisonData.map((attr) => (
                      <th key={attr.key} className="p-4 font-semibold text-center min-w-[90px] border-r border-b" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>{attr.label}</th>
                    ))}
                    <th className="p-4 w-12 border-b" style={{ borderColor: 'var(--border)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {jewelry.map((product, index) => (
                    <tr key={product.id}>
                      <td className="p-4 sticky left-0 z-10 border-r border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="56px" onError={(e) => { const t = e.target as HTMLImageElement; t.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg' }} />
                            </div>
                            <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}>{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-sm line-clamp-2" style={{ color: 'var(--foreground)' }}>{product.name}</div>
                            <div className="font-bold text-sm mt-0.5" style={{ color: 'var(--status-success)' }}>{formatPrice(product.price)}</div>
                          </div>
                        </div>
                      </td>
                      {comparisonData.map((attr) => {
                        const value = (product.data as Record<string, unknown>)[attr.key]
                        return (
                          <td key={attr.key} className="p-4 text-center border-r border-b" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                            <span className="text-sm">{formatValue(value, attr.type)}</span>
                          </td>
                        )
                      })}
                      <td className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                        <button onClick={() => removeProduct(product.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer" style={{ backgroundColor: 'var(--destructive)' }}><X className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/jewelry')}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors cursor-pointer"
              >
                Browse More Jewelry
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 border border-border hover:bg-muted text-foreground font-medium rounded-lg transition-colors cursor-pointer"
              >
                Start New Comparison
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ModernJewelryComparePage
