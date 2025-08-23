'use client'

import { useSearchParams } from 'next/navigation'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { PRODUCT_CONFIGS, ProductType } from '@/config/products'
import { SECTION_WIDTH } from '@/lib/constants'

interface ProductResultsPageProps {
  params: {
    product: ProductType
    category: string
  }
}

export default function ProductResultsPage({ params }: ProductResultsPageProps) {
  const searchParams = useSearchParams()
  const config = PRODUCT_CONFIGS[params.product]

  // Get all filter parameters
  const filters = Object.fromEntries(searchParams.entries())

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 py-8`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {config.name} - {params.category}
          </h1>
          <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
            Search results for your selected filters
          </p>
        </div>

        {/* Filters Summary */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => (
              <span
                key={key}
                className="px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: 'var(--primary)/10', 
                  color: 'var(--primary)',
                  border: '1px solid var(--primary)/20'
                }}
              >
                {key}: {value}
              </span>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Placeholder for actual product results */}
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="aspect-square bg-gray-200 rounded-lg mb-4" style={{ backgroundColor: 'var(--muted)' }}>
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {config.icon}
                </div>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Sample {config.name.slice(0, -1)} #{index + 1}
              </h3>
              <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                Category: {params.category}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>
                  ${(Math.random() * 10000 + 1000).toFixed(0)}
                </span>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    color: 'var(--primary-foreground)' 
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  page === 1 ? 'bg-blue-500 text-white' : 'border'
                }`}
                style={{
                  backgroundColor: page === 1 ? 'var(--primary)' : 'var(--card)',
                  color: page === 1 ? 'var(--primary-foreground)' : 'var(--foreground)',
                  borderColor: 'var(--border)'
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
