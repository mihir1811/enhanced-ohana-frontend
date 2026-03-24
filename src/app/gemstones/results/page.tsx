'use client'

import React, { useState } from 'react'
import GenericProductResults, { GenericProduct } from '@/components/products/GenericProductResults'
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell'
import { BuyerSectionHeader } from '@/components/buyer/BuyerSectionHeader'

// Mock gemstone data for demonstration
const mockGemstones: GenericProduct[] = [
  {
    id: '1',
    name: 'Blue Sapphire',
    price: 2500,
    images: ['https://example.com/sapphire.jpg'],
    category: 'Precious Stones',
    type: 'sapphire',
    weight: '2.5ct',
    cut: 'Oval',
    color: 'Royal Blue',
    clarity: 'VS1',
    origin: 'Ceylon'
  },
  {
    id: '2',
    name: 'Ruby',
    price: 3200,
    images: ['https://example.com/ruby.jpg'],
    category: 'Precious Stones',
    type: 'ruby',
    weight: '2.1ct',
    cut: 'Round',
    color: 'Pigeon Blood',
    clarity: 'VVS2',
    origin: 'Burma'
  },
  {
    id: '3',
    name: 'Emerald',
    price: 1800,
    images: ['https://example.com/emerald.jpg'],
    category: 'Precious Stones',
    type: 'emerald',
    weight: '3.0ct',
    cut: 'Emerald',
    color: 'Vivid Green',
    clarity: 'SI1',
    origin: 'Colombia'
  }
]

const GemstoneResultsExample = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const handleProductSelect = (gemstone: GenericProduct) => {
    console.log('Selected gemstone:', gemstone)
  }

  const handleAddToWishlist = (gemstoneId: string) => {
    console.log('Added to wishlist:', gemstoneId)
  }

  const handleAddToCart = (gemstoneId: string) => {
    console.log('Added to cart:', gemstoneId)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BuyerPageShell className="py-8">
        <BuyerSectionHeader
          title="Gemstone Collection"
          description="Discover our curated selection of fine gemstones with compare functionality"
          className="mb-10"
        />
        <GenericProductResults
          products={mockGemstones}
          loading={false}
          totalCount={mockGemstones.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onProductSelect={handleProductSelect}
          onAddToCart={handleAddToCart}
          productType="gemstone"
          placeholderImage="https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg"
        />
      </BuyerPageShell>
    </div>
  )
}

export default GemstoneResultsExample
