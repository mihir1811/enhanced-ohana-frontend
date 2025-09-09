'use client';

import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Trash2, Grid, List, Eye, Share2 } from 'lucide-react';
import { useWishlistActions, useWishlistStats } from '@/hooks/useWishlist';
import { WishlistIcon } from '@/components/shared/WishlistButton';
import { toast } from 'react-hot-toast';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'diamond' | 'gemstone' | 'jewellery';

export default function UserWishlistPage() {
  const { 
    items, 
    loading, 
    error, 
    removeFromWishlist, 
    clearWishlist, 
    refreshWishlist 
  } = useWishlistActions();
  
  const { stats } = useWishlistStats();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  // Helper function to determine product type from product data
  const getItemProductType = (item: any): string => {
    if (!item.product) return 'jewellery';
    
    // Since the API response shows jewelry products, we'll categorize based on product category
    if (item.product.category) {
      // You can customize this logic based on your categorization needs
      const category = item.product.category.toLowerCase();
      if (category.includes('diamond')) return 'diamond';
      if (category.includes('gem')) return 'gemstone';
      return 'jewellery';
    }
    
    return 'jewellery'; // Default to jewellery
  };

  const getProductIcon = (productType: string) => {
    switch (productType) {
      case 'diamond': return '💎';
      case 'gemstone': return '💍';
      case 'jewellery': return '✨';
      default: return '✨';
    }
  };

  const getProductTypeColor = (productType: string) => {
    switch (productType) {
      case 'diamond': return 'bg-blue-100 text-blue-800';
      case 'gemstone': return 'bg-green-100 text-green-800';
      case 'jewellery': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => {
        const productType = getItemProductType(item);
        return productType === filter;
      });

  const handleRemoveItem = async (itemId: number) => {
    try {
      const success = await removeFromWishlist(itemId);
      if (success) {
        toast.success('Item removed from wishlist');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        setIsClearing(true);
        const success = await clearWishlist();
        if (success) {
          toast.success('Wishlist cleared successfully');
        }
      } catch (error) {
        toast.error('Failed to clear wishlist');
      } finally {
        setIsClearing(false);
      }
    }
  };

  const addToCart = (itemId: string) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', itemId);
    toast.success('Added to cart!');
  };

  const shareItem = (itemId: string) => {
    // TODO: Implement share functionality
    console.log('Share item:', itemId);
    toast.success('Link copied to clipboard!');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
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
                {stats.total} {stats.total === 1 ? 'item' : 'items'} saved for later
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
              
              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors border"
                style={{ 
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--card)'
                }}
              >
                <option value="all">All Items</option>
                <option value="diamond">Diamonds</option>
                <option value="gemstone">Gemstones</option>
                <option value="jewellery">Jewelry</option>
              </select>

              {/* Clear All Button */}
              {items.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="px-4 py-2 rounded-lg font-medium transition-colors border text-red-600 border-red-200 hover:bg-red-50"
                >
                  {isClearing ? 'Clearing...' : 'Clear All'}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          {items.length > 0 && (
            <div className="flex gap-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <span className="font-medium">
                Total: <span style={{ color: 'var(--foreground)' }}>{stats.total}</span>
              </span>
              <span>
                Diamonds: <span style={{ color: 'var(--chart-1)' }}>{stats.diamonds}</span>
              </span>
              <span>
                Gemstones: <span style={{ color: 'var(--chart-2)' }}>{stats.gemstones}</span>
              </span>
              <span>
                Jewelry: <span style={{ color: 'var(--chart-3)' }}>{stats.jewellery}</span>
              </span>
            </div>
          )}

          {filteredItems.length === 0 ? (
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
                {filter === 'all' ? 'Your wishlist is empty' : `No ${filter} items in your wishlist`}
              </h3>
              <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>
                Save items you love for later by clicking the heart icon
              </p>
              <button 
                onClick={() => window.history.back()}
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
              {filteredItems.map((item) => {
                const productType = getItemProductType(item);
                return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    viewMode === 'list' ? 'flex items-center space-x-6 p-6' : 'p-6'
                  }`}
                  style={{ 
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  {/* Product Image */}
                  <div 
                    className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-full h-48'} rounded-lg flex items-center justify-center flex-shrink-0 mb-4`}
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    {item.product?.image1 ? (
                      <img
                        src={item.product.image1}
                        alt={item.product.name || 'Product'}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className={viewMode === 'list' ? 'text-4xl' : 'text-6xl'}>
                        {getProductIcon(productType)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    {/* Product Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${viewMode === 'list' ? 'text-lg' : 'text-xl'}`} style={{ color: 'var(--card-foreground)' }}>
                          {item.product?.name || `Product #${item.productId}`}
                        </h3>
                        <WishlistIcon
                          productId={item.productId}
                          productType={productType as 'diamond' | 'gemstone' | 'jewellery'}
                        />
                      </div>
                      
                      {/* Product Type Badge */}
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${getProductTypeColor(productType)}`}>
                        {productType.charAt(0).toUpperCase() + productType.slice(1)}
                      </span>

                      {item.product?.sellerId && (
                        <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                          Seller ID: {item.product.sellerId}
                        </p>
                      )}
                      
                      {item.product?.category && (
                        <p className="text-sm" style={{ color: 'var(--chart-1)' }}>
                          {item.product.category} - {item.product.subcategory}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    {item.product?.totalPrice && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xl font-bold" style={{ color: 'var(--card-foreground)' }}>
                            {formatPrice(item.product.totalPrice)}
                          </span>
                          {item.product.basePrice && item.product.basePrice < item.product.totalPrice && (
                            <span className="text-sm line-through" style={{ color: 'var(--muted-foreground)' }}>
                              {formatPrice(item.product.basePrice)}
                            </span>
                          )}
                        </div>
                        
                        {item.product.isOnAuction && (
                          <div className="flex items-center space-x-2">
                            <span 
                              className="px-2 py-1 text-xs rounded-full"
                              style={{ 
                                backgroundColor: 'var(--chart-2)',
                                color: 'var(--primary-foreground)'
                              }}
                            >
                              On Auction
                            </span>
                          </div>
                        )}
                        
                        {item.product.isSold && (
                          <p className="text-sm font-medium mt-2" style={{ color: 'var(--destructive)' }}>
                            Sold Out
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className={`flex items-center space-x-3 ${viewMode === 'list' ? '' : 'flex-col space-y-3 space-x-0'}`}>
                      <button
                        onClick={() => addToCart(String(item.id))}
                        disabled={item.product?.isSold === true}
                        className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          viewMode === 'list' ? 'flex-1' : 'w-full'
                        }`}
                        style={{ 
                          backgroundColor: item.product?.isSold !== true ? 'var(--primary)' : 'var(--muted)',
                          color: item.product?.isSold !== true ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{item.product?.isSold !== true ? 'Add to Cart' : 'Sold Out'}</span>
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
                          onClick={() => shareItem(String(item.id))}
                          className="p-2 rounded-lg transition-colors border"
                          style={{ 
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)'
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 rounded-lg transition-colors border text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}

          {error && (
            <div 
              className="rounded-lg p-4 border"
              style={{ 
                backgroundColor: 'var(--destructive)/10',
                borderColor: 'var(--destructive)/20',
                color: 'var(--destructive)'
              }}
            >
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
