'use client'

import ProductSearchPage from '@/components/products/ProductSearchPage'
import { GEMSTONE_CONFIG } from '@/config/products'

export default function GemstonesSearchPage() {
  return (
    <div>
      {/* Main Product Search */}
      <ProductSearchPage
        productType="gemstones"
        config={GEMSTONE_CONFIG}
        heroTitle="Find Your Perfect Gemstone"
        heroSubtitle="Discover rare and beautiful gemstones from around the world with comprehensive filtering"
      />
    </div>
  )
}
