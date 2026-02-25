'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Heart, Grid, List } from 'lucide-react';
import { useWishlistActions } from '@/hooks/useWishlist';
import { transformWishlistItemToUnified, UnifiedProduct, WishlistUnifiedProduct } from '@/types/unified-product';
import WishlistProductCard from '@/components/user/WishlistProductCard';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SECTION_WIDTH } from '@/lib/constants';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'diamond' | 'gemstone' | 'jewellery';

export default function UserWishlistPage() {
  const router = useRouter();
  const { 
    items, 
    loading, 
    error, 
    removeFromWishlist, 
    clearWishlist, 
    refreshWishlist 
  } = useWishlistActions();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  // Transform wishlist items to unified products
  const unifiedProducts = useMemo(() => {
    const itemsArray = Array.isArray(items) ? items : [];
    return itemsArray
      .map(item => {
        const product = transformWishlistItemToUnified(item);
        return product ? { ...product, wishlistItemId: item.id } : null;
      })
      .filter((item): item is WishlistUnifiedProduct => item !== null);
  }, [items]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = unifiedProducts.length;
    const diamonds = unifiedProducts.filter(p => p.productType === 'diamond').length;
    const gemstones = unifiedProducts.filter(p => p.productType === 'gemstone').length;
    const jewellery = unifiedProducts.filter(p => p.productType === 'jewellery').length;

    return { total, diamonds, gemstones, jewellery };
  }, [unifiedProducts]);

  // Filter products
  const filteredProducts = filter === 'all' 
    ? unifiedProducts 
    : unifiedProducts.filter(product => product.productType === filter);

  const handleRemoveItem = async (wishlistItemId: number) => {
    try {
      const success = await removeFromWishlist(wishlistItemId);
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

  const handleAddToCart = (productId: string | number) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId);
    toast.success('Added to cart!');
  };

  const handleViewProduct = (product: UnifiedProduct) => {
    // Navigate to product details page based on product type
    const id = String(product.id);
    switch (product.productType) {
      case 'diamond':
        router.push(`/product/diamond/${id}`);
        break;
      case 'gemstone':
        router.push(`/product/gemstone/${id}`);
        break;
      case 'jewellery':
        router.push(`/product/jewelry/${id}`);
        break;
      default:
        router.push(`/product/${id}`);
    }
  };

  const handleShareProduct = (productId: string | number) => {
    // TODO: Implement share functionality
    const url = `${window.location.origin}/product/${productId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  if (loading && unifiedProducts.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--status-warning)' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
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
          {unifiedProducts.length > 0 && (
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
      {unifiedProducts.length > 0 && (
        <div className="flex gap-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <span className="font-medium">
            Total: <span style={{ color: 'var(--foreground)' }}>{stats.total}</span>
          </span>
          <span>
            Diamonds: <span style={{ color: 'var(--status-warning)' }}>{stats.diamonds}</span>
          </span>
          <span>
            Gemstones: <span style={{ color: 'var(--status-warning)' }}>{stats.gemstones}</span>
          </span>
          <span>
            Jewelry: <span style={{ color: 'var(--status-warning)' }}>{stats.jewellery}</span>
          </span>
        </div>
      )}

      {filteredProducts.length === 0 ? (
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
            onClick={() => router.back()}
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
          {filteredProducts.map((product) => (
            <WishlistProductCard
              key={`${product.productType}-${product.id}`}
              product={product}
              viewMode={viewMode}
              onRemove={() => handleRemoveItem(product.wishlistItemId)}
              onAddToCart={() => handleAddToCart(product.id)}
              onView={() => handleViewProduct(product)}
              onShare={() => handleShareProduct(product.id)}
            />
          ))}
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