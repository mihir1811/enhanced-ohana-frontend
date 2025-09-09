'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { wishlistService } from '@/services/wishlistService';
import type { WishlistItem, AddToWishlistData } from '@/services/wishlistService';

// Define RootState type for Redux
interface RootState {
  auth: {
    user: any;
    token: string | null;
  };
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  count: number;
  isInitialized: boolean;
}

type WishlistAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: WishlistItem[] }
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_COUNT'; payload: number }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'SET_INITIALIZED'; payload: boolean };

interface WishlistContextType extends WishlistState {
  addToWishlist: (productId: number, productType?: 'diamond' | 'gemstone' | 'jewellery') => Promise<boolean>;
  removeFromWishlist: (wishlistItemId: number) => Promise<boolean>;
  removeFromWishlistByProduct: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  loadWishlist: (page?: number, limit?: number) => Promise<void>;
  clearWishlist: () => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  count: 0,
  isInitialized: false,
};

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ITEMS':
      const itemsArray = Array.isArray(action.payload) ? action.payload : [];
      return { 
        ...state, 
        items: itemsArray, 
        count: itemsArray.length,
        error: null 
      };
    
    case 'ADD_ITEM':
      const currentItems = Array.isArray(state.items) ? state.items : [];
      const exists = currentItems.some(item => 
        item.productId === action.payload.productId
      );
      if (exists) return state;
      
      return {
        ...state,
        items: [...currentItems, action.payload],
        count: currentItems.length + 1,
        error: null,
      };
    
    case 'REMOVE_ITEM':
      const itemsToFilter = Array.isArray(state.items) ? state.items : [];
      const filteredItems = itemsToFilter.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        count: filteredItems.length,
        error: null,
      };
    
    case 'UPDATE_COUNT':
      return { ...state, count: action.payload };
    
    case 'CLEAR_WISHLIST':
      return { ...state, items: [], count: 0, error: null };
    
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    
    default:
      return state;
  }
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { user, token } = useSelector((state: RootState) => ({
    user: state.auth.user,
    token: state.auth.token
  }));

  // Load wishlist items
  const loadWishlist = useCallback(async (page = 1, limit = 50) => {
    if (!token) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await wishlistService.getAllWishlistItems({ page, limit }, token);
      
      if (response.success) {
        // Extract the nested data array from response.data.data
        const nestedData = response.data?.data;
        const itemsData = Array.isArray(nestedData) ? nestedData : [];
        dispatch({ type: 'SET_ITEMS', payload: itemsData });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to load wishlist' });
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load wishlist' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    }
  }, [token]);

  // Add item to wishlist
  const addToWishlist = useCallback(async (productId: number, productType: 'diamond' | 'gemstone' | 'jewellery' = 'jewellery'): Promise<boolean> => {
    if (!token) {
      dispatch({ type: 'SET_ERROR', payload: 'Please login to add items to wishlist' });
      return false;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const wishlistData: AddToWishlistData = { productId, productType };
      const response = await wishlistService.addToWishlist(wishlistData, token);
      
      if (response.success) {
        dispatch({ type: 'ADD_ITEM', payload: response.data });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to add to wishlist' });
        return false;
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to wishlist' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [token]);

  // Remove item from wishlist by ID
  const removeFromWishlist = useCallback(async (wishlistItemId: number): Promise<boolean> => {
    if (!token) {
      dispatch({ type: 'SET_ERROR', payload: 'Please login to manage wishlist' });
      return false;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await wishlistService.removeFromWishlist(String(wishlistItemId), token);
      
      if (response.success) {
        dispatch({ type: 'REMOVE_ITEM', payload: wishlistItemId });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to remove from wishlist' });
        return false;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from wishlist' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [token]);

  // Remove item from wishlist by product ID and type
  const removeFromWishlistByProduct = useCallback(async (productId: number): Promise<boolean> => {
    if (!token) {
      dispatch({ type: 'SET_ERROR', payload: 'Please login to manage wishlist' });
      return false;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Find the item in the current wishlist to determine its type
      const itemsArray = Array.isArray(state.items) ? state.items : [];
      const itemToRemove = itemsArray.find(item => item.productId === productId);
      
      // Determine productType based on the product category or default to 'jewellery'
      let productType: 'diamond' | 'gemstone' | 'jewellery' = 'jewellery';
      if (itemToRemove?.product?.category) {
        const category = itemToRemove.product.category.toLowerCase();
        if (category.includes('diamond')) {
          productType = 'diamond';
        } else if (category.includes('gem')) {
          productType = 'gemstone';
        } else {
          productType = 'jewellery';
        }
      }

      const response = await wishlistService.removeFromWishlistByProduct(productId, productType, token);
      
      if (response.success) {
        // Remove the item from state
        if (itemToRemove) {
          dispatch({ type: 'REMOVE_ITEM', payload: itemToRemove.id });
        }
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to remove from wishlist' });
        return false;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from wishlist' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [token, state.items]);

  // Check if item is in wishlist
  // Check if item is in wishlist
  const isInWishlist = useCallback((productId: number): boolean => {
    const itemsArray = Array.isArray(state.items) ? state.items : [];
    return itemsArray.some(item => 
      item.productId === productId
    );
  }, [state.items]);

  // Clear entire wishlist
  const clearWishlist = useCallback(async (): Promise<boolean> => {
    if (!token) {
      dispatch({ type: 'SET_ERROR', payload: 'Please login to manage wishlist' });
      return false;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await wishlistService.clearWishlist(token);
      
      if (response.success) {
        dispatch({ type: 'CLEAR_WISHLIST' });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to clear wishlist' });
        return false;
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear wishlist' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [token]);

  // Refresh wishlist
  const refreshWishlist = useCallback(async () => {
    await loadWishlist();
  }, [loadWishlist]);

  // Initialize wishlist when user logs in
  useEffect(() => {
    if (user && token && !state.isInitialized) {
      loadWishlist();
    } else if (!user && state.isInitialized) {
      // Clear wishlist when user logs out
      dispatch({ type: 'CLEAR_WISHLIST' });
      dispatch({ type: 'SET_INITIALIZED', payload: false });
    }
  }, [user, token, loadWishlist, state.isInitialized]);

  const value: WishlistContextType = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    removeFromWishlistByProduct,
    isInWishlist,
    loadWishlist,
    clearWishlist,
    refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export default WishlistContext;
