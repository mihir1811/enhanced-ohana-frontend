'use client';

import { useCallback } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';

export interface UseWishlistReturn {
  // State
  items: Array<any>;
  loading: boolean;
  error: string | null;
  count: number;
  isInitialized: boolean;

  // Actions
  addToWishlist: (productId: number, productType?: 'diamond' | 'gemstone' | 'jewellery') => Promise<boolean>;
  removeFromWishlist: (wishlistItemId: number) => Promise<boolean>;
  removeFromWishlistByProduct: (productId: number) => Promise<boolean>;
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
export function useWishlistButton(productId: number, productType: 'diamond' | 'gemstone' | 'jewellery' = 'jewellery') {
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
      return await removeFromWishlistByProduct(productId);
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
  const { items, count, loading } = useWishlistActions();

  // Ensure items is always an array
  const itemsArray = Array.isArray(items) ? items : [];

  // Helper function to determine product type from product data
  const getProductType = (item: any): string => {
    if (!item.product) return 'jewellery';
    
    const product = item.product;
    
    // More sophisticated type detection based on product structure
    // Check for diamond-specific fields
    if (product.caratWeight && product.cut && product.clarity && !product.gemType && !product.metalType) {
      return 'diamond';
    }
    
    // Check for gemstone-specific fields
    if (product.gemType || (product.caratWeight && product.origin && !product.cut && !product.metalType)) {
      return 'gemstone';
    }
    
    // Check for jewelry-specific fields
    if (product.metalType || product.category || product.subcategory) {
      return 'jewellery';
    }
    
    // Fallback to category-based detection
    if (product.category) {
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
