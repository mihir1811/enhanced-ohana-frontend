'use client'

import ProductSearchPage from '@/components/products/ProductSearchPage'
import { JEWELRY_CONFIG } from '@/config/products'

export default function JewelrySearchPage() {
  return (
    <ProductSearchPage
      productType="jewelry"
      config={JEWELRY_CONFIG}
      heroTitle="Find Your Perfect Jewelry"
      heroSubtitle="Explore exquisite jewelry pieces from engagement rings to luxury collections"
    />
  )
}
