import api from './api';
import type { ApiResponse } from './api';

export interface WishlistItem {
  id: number;
  userId: string;
  productId: number;
  createdAt: string;
  user?: {
    sub: string;
    id: string;
    name: string;
    email: string;
    userName: string;
    role: string;
    profilePicture: string;
    phone?: string;
    isDeleted: boolean;
    isVerified: boolean;
    isBlocked: boolean;
    socketId?: string;
    createdAt: string;
    updatedAt: string;
    seller?: {
      id: string;
      sellerType: string;
    };
    iat?: number;
    exp?: number;
  };
  product?: {
    id: number;
    name: string;
    skuCode: string;
    category: string;
    subcategory: string;
    collection: string;
    gender: string;
    occasion: string;
    metalType: string;
    metalPurity: string;
    metalWeight: number;
    basePrice: number;
    makingCharge: number;
    tax: number;
    totalPrice: number;
    attributes: Record<string, unknown>;
    description: string;
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
    image6?: string;
    videoURL?: string;
    sellerId: string;
    isOnAuction: boolean;
    isSold: boolean;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  };
}

export interface WishlistResponse {
  data: WishlistItem[];
  meta: {
    total: number;
    currentPage: number;
    perPage: number;
    lastPage: number;
    prev?: number;
    next?: number;
  };
}

export interface AddToWishlistData {
  productId: number;
  productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond' | 'watch';
}

export interface WishlistFilter {
  page?: number;
  limit?: number;
  productType?: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond' | 'watch';
  search?: string;
  sort?: string;
}

export const wishlistService = {
  // Get all wishlist items
  getAllWishlistItems: async (filters: WishlistFilter = {}, token: string): Promise<ApiResponse<WishlistResponse>> => {
    const { page = 1, limit = 10, productType, search, sort } = filters;
    
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    
    if (productType) {
      params.append('productType', productType);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (sort) {
      params.append('sort', sort);
    }
    
    return api.get<WishlistResponse>(`/favorites/all?${params.toString()}`, undefined, token);
  },

  // Add item to wishlist
  addToWishlist: async (wishlistData: AddToWishlistData, token: string): Promise<ApiResponse<WishlistItem>> => {
    return api.post<WishlistItem>('/favorites', wishlistData, token);
  },

  // Remove item from wishlist
  removeFromWishlist: async (wishlistItemId: string, token: string): Promise<ApiResponse<{ message: string }>> => {
    return api.delete<{ message: string }>(`/favorites/${wishlistItemId}`, token);
  },

  // Remove item from wishlist by product ID and type
  removeFromWishlistByProduct: async (
    productId: string | number, 
    productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond' | 'watch', 
    token: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const requestData = {
      productId: Number(productId),
      productType: productType
    };
    
    return api.deleteWithBody<{ message: string }>('/favorites/remove', requestData, token);
  },

  // Check if item is in wishlist
  isInWishlist: async (
    productId: string | number, 
    token: string
  ): Promise<ApiResponse<boolean>> => {
    const params = {
      productId: String(productId),
    };
    
    return api.get<boolean>('/favorites/check', params, token);
  },

  // Get wishlist count
  getWishlistCount: async (token: string): Promise<ApiResponse<{ count: number }>> => {
    return api.get<{ count: number }>('/favorites/count', undefined, token);
  },

  // Clear entire wishlist
  clearWishlist: async (token: string): Promise<ApiResponse<{ message: string; count: number }>> => {
    return api.delete<{ message: string; count: number }>('/favorites/clear', token);
  },
};

export default wishlistService;
