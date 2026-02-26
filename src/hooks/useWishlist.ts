'use client';

import { useCallback } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import type { WishlistItem } from '@/services/wishlistService';

export interface UseWishlistReturn {
  // State
  items: Array<WishlistItem>;
  loading: boolean;
  error: string | null;
  count: number;
  isInitialized: boolean;

  // Actions
  addToWishlist: (productId: number, productType?: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond' | 'watch') => Promise<boolean>;
  removeFromWishlist: (wishlistItemId: number) => Promise<boolean>;
  removeFromWishlistByProduct: (productId: number, explicitProductType?: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond' | 'watch') => Promise<boolean>;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  loadWishlist: (page?: number, limit?: number) => Promise<void>;
  clearWishlist: () => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

/**
 * Custom hook for wishlist functionality
 * Provides easy access to wishlist state and actions
 */
export function useWishlistActions(): UseWishlistReturn {
  const wishlistContext = useWishlist();

  // Toggle wishlist - add if not present, remove if present
  const toggleWishlist = useCallback(async (productId: number): Promise<boolean> => {
    const isCurrentlyInWishlist = wishlistContext.isInWishlist(productId);
    
    if (isCurrentlyInWishlist) {
      return await wishlistContext.removeFromWishlistByProduct(productId);
    } else {
      return await wishlistContext.addToWishlist(productId);
    }
  }, [wishlistContext]);

  return {
    ...wishlistContext,
    toggleWishlist,
  };
}

/**
 * Hook specifically for wishlist button components
 * Provides optimized state and handlers for wishlist buttons
 */
export function useWishlistButton(productId: number, productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond' | 'watch' = 'jewellery') {
  const {
    isInWishlist,
    addToWishlist,
    removeFromWishlistByProduct,
    loading,
    error
  } = useWishlistActions();

  const inWishlist = isInWishlist(productId);

  const toggleWishlist = useCallback(async () => {
    if (inWishlist) {
      return await removeFromWishlistByProduct(productId, productType);
    } else {
      return await addToWishlist(productId, productType);
    }
  }, [inWishlist, productId, productType, addToWishlist, removeFromWishlistByProduct]);

  return {
    inWishlist,
    loading,
    error,
    toggleWishlist,
  };
}

/**
 * Hook for getting wishlist statistics
 */
export function useWishlistStats() {
  const { items, loading } = useWishlistActions();

  // Ensure items is always an array
  const itemsArray = Array.isArray(items) ? items : [];

  // Helper function to determine product type from product data
  const getProductType = (item: WishlistItem): string => {
    if (!item.product) return 'jewellery';
    
    const product = item.product as Record<string, unknown>;
    
    // More sophisticated type detection based on product structure
    // Check for diamond-specific fields (use 'in' checks to avoid TS errors)
    if ('caratWeight' in product && 'cut' in product && 'clarity' in product && !('gemType' in product) && !('metalType' in product)) {
      return 'diamond';
    }
    
    // Check for gemstone-specific fields
    if ('gemType' in product || (('caratWeight' in product) && 'origin' in product && !('cut' in product) && !('metalType' in product))) {
      return 'gemstone';
    }
    
    // Check for jewelry-specific fields
    if ('metalType' in product || 'category' in product || 'subcategory' in product) {
      return 'jewellery';
    }
    
    // Fallback to category-based detection
    if ('category' in product && typeof product.category === 'string') {
      const category = product.category.toLowerCase();
      if (category.includes('diamond')) return 'diamond';
      if (category.includes('gem')) return 'gemstone';
      return 'jewellery';
    }
    
    return 'jewellery';
  };

  const stats = {
    total: itemsArray.length, // Use actual array length instead of count
    diamonds: itemsArray.filter(item => getProductType(item) === 'diamond').length,
    gemstones: itemsArray.filter(item => getProductType(item) === 'gemstone').length,
    jewellery: itemsArray.filter(item => getProductType(item) === 'jewellery').length,
  };

  return {
    stats,
    loading,
    items: itemsArray,
  };
}

export default useWishlistActions;
