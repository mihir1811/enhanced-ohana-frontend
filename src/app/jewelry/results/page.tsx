'use client'

import React, { useState } from 'react'
import GenericProductResults, { GenericProduct } from '@/components/products/GenericProductResults'
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell'
import { BuyerSectionHeader } from '@/components/buyer/BuyerSectionHeader'

// Mock jewelry data for demonstration
const mockJewelry: GenericProduct[] = [
  {
    id: '1',
    name: 'Diamond Engagement Ring',
    price: 5500,
    images: ['https://example.com/ring1.jpg'],
    category: 'Rings',
    type: 'engagement',
    material: '18K White Gold',
    centerStone: '1.5ct Diamond',
    setting: 'Solitaire',
    size: '6.5',
    metalPurity: '18K'
  },
  {
    id: '2',
    name: 'Sapphire Tennis Bracelet',
    price: 3200,
    images: ['https://example.com/bracelet1.jpg'],
    category: 'Bracelets',
    type: 'tennis',
    material: '14K Yellow Gold',
    centerStone: 'Blue Sapphires',
    totalCaratWeight: '5.0ct',
    length: '7 inches',
    metalPurity: '14K'
  },
  {
    id: '3',
    name: 'Pearl Drop Earrings',
    price: 850,
    images: ['https://example.com/earrings1.jpg'],
    category: 'Earrings',
    type: 'drop',
    material: '925 Sterling Silver',
    centerStone: 'Cultured Pearls',
    pearlSize: '8-9mm',
    style: 'Classic',
    metalPurity: '925'
  }
]

const JewelryResultsExample = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const handleProductSelect = (jewelry: GenericProduct) => {
    console.log('Selected jewelry:', jewelry)
  }

  const handleAddToWishlist = (jewelryId: string) => {
    console.log('Added to wishlist:', jewelryId)
  }

  const handleAddToCart = (jewelryId: string) => {
    console.log('Added to cart:', jewelryId)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BuyerPageShell className="py-8">
        <BuyerSectionHeader
          title="Jewelry Collection"
          description="Explore our exquisite jewelry pieces with advanced comparison features"
          className="mb-10"
        />
        <GenericProductResults
          products={mockJewelry}
          loading={false}
          totalCount={mockJewelry.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onProductSelect={handleProductSelect}
          onAddToCart={handleAddToCart}
          productType="jewelry"
          placeholderImage="https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg"
        />
      </BuyerPageShell>
    </div>
  )
}

export default JewelryResultsExample
