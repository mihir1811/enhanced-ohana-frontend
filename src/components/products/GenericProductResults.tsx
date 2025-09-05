'use client'

import React, { useState } from 'react'
import { Heart, ShoppingCart, Eye, Grid, List, ArrowUpDown, Filter as FilterIcon } from 'lucide-react'
import CompareButton from '@/components/compare/CompareButton'
import Pagination from '@/components/ui/Pagination'

export interface GenericProduct {
  id: string
  name: string
  price: number | string
  images: string[]
  image?: string
  category?: string
  type?: string
  [key: string]: any
}

interface GenericProductResultsProps {
  products: GenericProduct[]
  loading: boolean
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onProductSelect: (product: GenericProduct) => void
  onAddToWishlist: (productId: string) => void
  onAddToCart: (productId: string) => void
  productType: 'diamond' | 'gemstone' | 'jewelry'
  className?: string
  placeholderImage?: string
}

type ViewMode = 'grid' | 'list'

export default function GenericProductResults({
  products,
  loading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onProductSelect,
  onAddToWishlist,
  onAddToCart,
  productType,
  className = '',
  placeholderImage = 'https://www.mariposakids.co.nz/wp-content/uploads/2014/08/image-placeholder2.jpg'
}: GenericProductResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice)
  }

  const getProductImage = (product: GenericProduct) => {
    return product.images?.[0] || product.image || placeholderImage
  }

  // Grid view component
  const ProductGridCard = ({ product }: { product: GenericProduct }) => (
    <div
      className="relative border rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col overflow-hidden"
      style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      onClick={() => onProductSelect(product)}
    >
      {/* Image and Action Buttons */}
      <div className="relative w-full aspect-square flex items-center justify-center bg-gray-50">
        {/* Compare & Quick View Icons */}
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-20">
          <CompareButton
            product={product}
            productType={productType}
            size="md"
          />
          <button
            className="p-2 rounded-full shadow border bg-white/80 hover:bg-white transition-colors"
            title="Quick View"
            onClick={e => { e.stopPropagation(); /* Quick view modal */ }}
          >
            <Eye className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Product Image */}
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = placeholderImage
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={e => { e.stopPropagation(); onAddToWishlist(product.id); }}
          className="absolute top-2 right-2 p-2 rounded-full shadow hover:bg-pink-100 transition-colors z-10 border bg-white/90"
          title="Add to Favourites"
        >
          <Heart className="w-5 h-5 text-primary" />
        </button>

        {/* Status Badge */}
        <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-semibold rounded-full shadow bg-white/90 text-primary">
          Available
        </span>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-base truncate text-foreground">
            {product.name}
          </h3>
          <span className="text-base font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Product Attributes */}
        <div className="text-xs mb-2 text-muted-foreground">
          {product.category && <span>Category: {product.category}</span>}
        </div>

        {/* Seller & Actions */}
        <div className="flex items-center justify-between pt-2 border-t mt-2 border-border">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {product.seller || 'Verified Seller'}
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(product.id); }}
            className="px-3 py-1 rounded-lg font-medium transition-colors text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4 inline mr-1" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )

  // List view component
  const ProductListCard = ({ product }: { product: GenericProduct }) => (
    <div
      className="relative border rounded-lg bg-card hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row overflow-hidden min-h-[8rem]"
      style={{ borderColor: 'var(--border)' }}
      onClick={() => onProductSelect(product)}
    >
      {/* Left: Image */}
      <div className="relative w-full sm:w-40 h-40 bg-gray-50 overflow-hidden flex items-center">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = placeholderImage
          }}
        />
        
        {/* Favorite Button */}
        <button
          onClick={e => { e.stopPropagation(); onAddToWishlist(product.id); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 border hover:bg-pink-100 transition-colors z-10"
          title="Add to Favourites"
        >
          <Heart className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Right: Details */}
      <div className="flex-1 flex flex-col justify-between p-4 gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
          <h3 className="font-semibold text-base sm:text-lg truncate text-foreground">
            {product.name}
          </h3>
          <span className="text-base sm:text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground mb-1">
          {product.category && <span>Category: <span className="text-foreground">{product.category}</span></span>}
        </div>

        <div className="flex items-center justify-between border-t pt-2 mt-2 gap-2 border-border">
          <span className="text-xs text-muted-foreground">
            {product.seller || 'Verified Seller'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={e => { e.stopPropagation(); onAddToCart(product.id); }}
              className="px-3 py-1 rounded-md font-medium text-xs bg-gray-900 text-white hover:bg-gray-700 transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4 inline mr-1" />
              Add to Cart
            </button>
            
            {/* Compare & Quick View */}
            <CompareButton
              product={product}
              productType={productType}
              size="sm"
            />
            <button
              className="p-2 rounded-full bg-gray-100 border hover:bg-gray-200 transition-colors"
              title="Quick View"
              onClick={e => { e.stopPropagation(); }}
            >
              <Eye className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Results Header */}
      <div className="hidden sm:flex items-center justify-between p-4 border rounded-lg bg-card">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {totalCount.toLocaleString()} {productType === 'jewelry' ? 'Jewelry Pieces' : `${productType}s`} Found
          </h2>
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border hover:bg-gray-50 transition">
              <ArrowUpDown className="w-4 h-4 text-gray-700" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border hover:bg-gray-50 transition">
              <FilterIcon className="w-4 h-4 text-gray-700" />
            </button>
            <div className="flex items-center bg-white shadow border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between w-full pt-2">
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border hover:bg-gray-50 transition">
            <ArrowUpDown className="w-4 h-4 text-gray-700" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow border hover:bg-gray-50 transition">
            <FilterIcon className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <div className="flex items-center bg-white shadow border rounded-lg gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results Grid/List */}
      {products.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <div className="text-6xl mb-4">
            {productType === 'diamond' ? '💎' : productType === 'jewelry' ? '💍' : '💎'}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            No {productType === 'jewelry' ? 'jewelry pieces' : `${productType}s`} found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more results
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductGridCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductListCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / pageSize)}
        onPageChange={onPageChange}
      />
    </div>
  )
}
