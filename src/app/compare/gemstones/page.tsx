'use client'

import React, { useState } from 'react'
import { useCompare } from '@/hooks/useCompare'
import { ArrowLeft, X, CheckCircle, Info } from 'lucide-react'
import { ViewToggle } from '@/components/ui/ViewToggle'
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
  const { removeProduct, clearAll, getProductsByType, maxProducts } = useCompare()
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')

  const gemstones = getProductsByType('gemstone')

  if (gemstones.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--card-gem-bg)' }}>
              <div className="text-4xl">💎</div>
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              No Gemstones to Compare
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--muted-foreground)' }}>
              Add gemstones to your comparison list to see detailed side-by-side analysis
            </p>
            <button
              onClick={() => router.push('/gemstones')}
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{ backgroundColor: 'var(--card-gem-icon-text)', color: 'white' }}
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
      return <span style={{ color: 'var(--muted-foreground)' }}>N/A</span>
    }
    
    switch (attribute.type) {
      case 'currency':
        return <span className="font-bold" style={{ color: 'var(--status-success)' }}>{formatPrice(value as number | string)}</span>
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl transition-colors hover:opacity-80 cursor-pointer"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                Compare Gemstones
              </h1>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Comparing {gemstones.length} of {maxProducts} possible gemstones
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ViewToggle value={viewMode} onChange={setViewMode} accentColor="var(--card-gem-icon-text)" />

            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors cursor-pointer"
              style={{ color: 'var(--destructive)' }}
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
        </div>

        {/* Comparison Container */}
        <div className="rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: 'var(--card)' }}>
          {viewMode === 'grid' ? (
            /* Vertical table: attributes as rows, products as columns */
            <div className="w-full overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <table className="min-w-[600px] w-full border-collapse" style={{ borderColor: 'var(--border)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--card-gem-bg)' }}>
                    <th className="text-left p-4 font-semibold w-40 min-w-[160px] sticky left-0 z-10 border-r border-b" style={{ color: 'var(--foreground)', backgroundColor: 'var(--card-gem-bg)', borderColor: 'var(--border)' }}>
                      Spec
                    </th>
                    {gemstones.map((gemstone, index) => (
                      <th key={gemstone.id} className="p-4 min-w-[180px] align-top border-r border-b last:border-r-0" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative">
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border" style={{ backgroundColor: 'var(--card-gem-bg)', borderColor: 'var(--border)' }}>
                              <img
                                src={gemstone.image}
                                alt={generateGemstoneName({ process: (gemstone.data as any).process, color: (gemstone.data as any).color, shape: (gemstone.data as any).shape, gemsType: (gemstone.data as any).gemstoneType, subType: (gemstone.data as any).subType, carat: (gemstone.data as any).weight, quantity: (gemstone.data as any).quantity }) || gemstone.name}
                                className="w-full h-full object-contain"
                                onError={(e) => { const t = e.target as HTMLImageElement; t.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg' }}
                              />
                            </div>
                            <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--card-gem-icon-text)' }}>
                              {index + 1}
                            </span>
                            <button
                              onClick={() => removeProduct(gemstone.id)}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90 cursor-pointer"
                              style={{ backgroundColor: 'var(--destructive)' }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-sm line-clamp-2" style={{ color: 'var(--foreground)' }}>
                              {generateGemstoneName({ process: (gemstone.data as any).process, color: (gemstone.data as any).color, shape: (gemstone.data as any).shape, gemsType: (gemstone.data as any).gemstoneType, subType: (gemstone.data as any).subType, carat: (gemstone.data as any).weight, quantity: (gemstone.data as any).quantity }) || gemstone.name}
                            </div>
                            <div className="font-bold mt-1" style={{ color: 'var(--status-success)' }}>{formatPrice(gemstone.price)}</div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attributeCategories.flatMap((cat) => cat.attributes).map((attr) => (
                    <tr key={attr.key}>
                      <td className="p-4 font-medium sticky left-0 z-10 border-r border-b" style={{ backgroundColor: 'var(--card)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                        {attr.label}
                      </td>
                      {gemstones.map((gemstone) => (
                        <td
                          key={gemstone.id}
                          className={`p-4 text-center border-r border-b last:border-r-0 ${isBestValue(gemstone, attr) ? 'font-semibold' : ''}`}
                          style={isBestValue(gemstone, attr) ? { backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success)', borderColor: 'var(--border)' } : { color: 'var(--foreground)', borderColor: 'var(--border)' }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {isBestValue(gemstone, attr) && <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--status-success)' }} />}
                            {renderAttributeValue(gemstone, attr)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid UI in List: horizontal table - products as rows, attributes as columns */
            <div className="w-full overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <table className="min-w-[800px] w-full border-collapse" style={{ borderColor: 'var(--border)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--card-gem-bg)' }}>
                    <th className="text-left p-4 font-semibold w-48 min-w-[180px] sticky left-0 z-10 border-r border-b" style={{ color: 'var(--foreground)', backgroundColor: 'var(--card-gem-bg)', borderColor: 'var(--border)' }}>
                      Gemstone
                    </th>
                    {attributeCategories.flatMap((c) => c.attributes).map((attr) => (
                      <th key={attr.key} className="p-4 font-semibold text-center min-w-[90px] border-r border-b" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>{attr.label}</th>
                    ))}
                    <th className="p-4 w-12 border-b" style={{ borderColor: 'var(--border)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {gemstones.map((gemstone, index) => {
                    const name = generateGemstoneName({
                      process: (gemstone.data as any).process,
                      color: (gemstone.data as any).color,
                      shape: (gemstone.data as any).shape,
                      gemsType: (gemstone.data as any).gemstoneType,
                      subType: (gemstone.data as any).subType,
                      carat: (gemstone.data as any).weight,
                      quantity: (gemstone.data as any).quantity
                    }) || gemstone.name
                    return (
                      <tr key={gemstone.id}>
                        <td className="p-4 sticky left-0 z-10 border-r border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--card-gem-bg)' }}>
                                <img src={gemstone.image} alt={name} className="w-full h-full object-contain" onError={(e) => { const t = e.target as HTMLImageElement; t.src = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg' }} />
                              </div>
                              <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--card-gem-icon-text)' }}>{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-semibold text-sm line-clamp-2" style={{ color: 'var(--foreground)' }}>{name}</div>
                              <div className="font-bold text-sm mt-0.5" style={{ color: 'var(--status-success)' }}>{formatPrice(gemstone.price)}</div>
                            </div>
                          </div>
                        </td>
                        {attributeCategories.flatMap((c) => c.attributes).map((attr) => (
                          <td key={attr.key} className="p-4 text-center border-r border-b" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                            <div className="flex justify-center">{renderAttributeValue(gemstone, attr)}</div>
                          </td>
                        ))}
                        <td className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                          <button onClick={() => removeProduct(gemstone.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer" style={{ backgroundColor: 'var(--destructive)' }}><X className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary/Recommendations */}
          <div className="p-4 md:p-6 border-t" style={{ backgroundColor: 'var(--card-gem-bg)', borderColor: 'var(--border)' }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--card-gem-icon-text)' }}>
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: 'var(--card-gem-icon-text)' }}>
                  Gemstone Comparison Guide
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm" style={{ color: 'var(--foreground)' }}>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--status-success)' }} />
                      Green highlights show the best value in each category
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--status-success)' }} />
                      Consider origin and treatment for authenticity
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--status-success)' }} />
                      Different gemstones have varying hardness scales
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--status-success)' }} />
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
