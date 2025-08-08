'use client'

import { useState } from 'react'
import { Heart, ShoppingCart, Share2, Eye, Filter, Grid, List } from 'lucide-react'

export default function UserWishlistPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: '3.2ct Oval Diamond Ring',
      price: 12500,
      originalPrice: 14200,
      image: '💎',
      seller: 'DiamondCraft Jewelry',
      certification: 'GIA Certified',
      inStock: true,
      onSale: true,
      saleEnds: '2025-01-20',
      rating: 4.9,
      reviews: 127
    },
    {
      id: 2,
      name: 'Ruby Tennis Necklace',
      price: 5800,
      originalPrice: 5800,
      image: '❤️',
      seller: 'Luxury Gems Co.',
      certification: 'AGS Certified',
      inStock: true,
      onSale: false,
      saleEnds: null,
      rating: 4.8,
      reviews: 89
    },
    {
      id: 3,
      name: 'Emerald Halo Earrings',
      price: 4200,
      originalPrice: 4750,
      image: '💚',
      seller: 'Premium Stones',
      certification: 'GIA Certified',
      inStock: false,
      onSale: true,
      saleEnds: '2025-01-18',
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: 'Sapphire Eternity Band',
      price: 3450,
      originalPrice: 3450,
      image: '💙',
      seller: 'Classic Jewelry',
      certification: 'GIA Certified',
      inStock: true,
      onSale: false,
      saleEnds: null,
      rating: 4.9,
      reviews: 203
    }
  ])

  const removeFromWishlist = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id))
  }

  const addToCart = (id: number) => {
    // Handle add to cart logic
    console.log('Added to cart:', id)
  }

  const shareItem = (id: number) => {
    // Handle share logic
    console.log('Share item:', id)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-3xl font-bold tracking-tight"
                style={{ color: 'var(--foreground)' }}
              >
                My Wishlist
              </h1>
              <p 
                className="mt-2 text-lg"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex items-center border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}`}
                  style={{
                    backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--primary-foreground)' : 'var(--foreground)'
                  }}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}`}
                  style={{
                    backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                    color: viewMode === 'list' ? 'var(--primary-foreground)' : 'var(--foreground)'
                  }}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors border"
                style={{ 
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  backgroundColor: 'transparent'
                }}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            /* Empty Wishlist */
            <div 
              className="text-center py-16 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>
                Your wishlist is empty
              </h3>
              <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>
                Save items you love for later by clicking the heart icon
              </p>
              <button 
                className="px-6 py-3 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* Wishlist Items */
            <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'}>
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    viewMode === 'list' ? 'flex items-center space-x-6 p-6' : 'p-6'
                  }`}
                  style={{ 
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    opacity: item.inStock ? 1 : 0.7
                  }}
                >
                  {/* Product Image */}
                  <div 
                    className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-full h-48'} rounded-lg flex items-center justify-center flex-shrink-0 mb-4`}
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <span className={viewMode === 'list' ? 'text-4xl' : 'text-6xl'}>
                      {item.image}
                    </span>
                  </div>

                  <div className="flex-1">
                    {/* Product Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${viewMode === 'list' ? 'text-lg' : 'text-xl'}`} style={{ color: 'var(--card-foreground)' }}>
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-1 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                      <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                        by {item.seller}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--chart-1)' }}>
                        {item.certification}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {item.rating} ({item.reviews})
                      </span>
                    </div>

                    {/* Price and Sale Info */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl font-bold" style={{ color: 'var(--card-foreground)' }}>
                          ${item.price.toLocaleString()}
                        </span>
                        {item.onSale && (
                          <span className="text-sm line-through" style={{ color: 'var(--muted-foreground)' }}>
                            ${item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {item.onSale && (
                        <div className="flex items-center space-x-2">
                          <span 
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ 
                              backgroundColor: 'var(--chart-2)',
                              color: 'var(--primary-foreground)'
                            }}
                          >
                            Sale
                          </span>
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            Ends {new Date(item.saleEnds!).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {!item.inStock && (
                        <p className="text-sm font-medium mt-2" style={{ color: 'var(--destructive)' }}>
                          Out of Stock
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center space-x-3 ${viewMode === 'list' ? '' : 'flex-col space-y-3 space-x-0'}`}>
                      <button
                        onClick={() => addToCart(item.id)}
                        disabled={!item.inStock}
                        className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          viewMode === 'list' ? 'flex-1' : 'w-full'
                        }`}
                        style={{ 
                          backgroundColor: item.inStock ? 'var(--primary)' : 'var(--muted)',
                          color: item.inStock ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{item.inStock ? 'Add to Cart' : 'Notify When Available'}</span>
                      </button>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-2 rounded-lg transition-colors border"
                          style={{ 
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)'
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => shareItem(item.id)}
                          className="p-2 rounded-lg transition-colors border"
                          style={{ 
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)'
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
