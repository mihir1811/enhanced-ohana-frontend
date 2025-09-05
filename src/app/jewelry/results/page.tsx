'use client'

import React, { useState } from 'react'
import GenericProductResults, { GenericProduct } from '@/components/products/GenericProductResults'

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Jewelry Collection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore our exquisite jewelry pieces with advanced comparison features
          </p>
        </div>

        <GenericProductResults
          products={mockJewelry}
          loading={false}
          totalCount={mockJewelry.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onProductSelect={handleProductSelect}
          onAddToWishlist={handleAddToWishlist}
          onAddToCart={handleAddToCart}
          productType="jewelry"
          placeholderImage="https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg"
        />
      </div>
    </div>
  )
}

export default JewelryResultsExample
