// UI Constants
export const SECTION_WIDTH = 1400;

// API Configuration
export const API_CONFIG = {
  // Base API URL - can be overridden by environment variable
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      RESEND_VERIFICATION: '/auth/resend-verification',
    },
    
    // User Management
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      CHANGE_PASSWORD: '/user/change-password',
      DELETE_ACCOUNT: '/user/delete',
      ADDRESSES: '/user/addresses',
      WISHLIST: '/user/wishlist',
    },
    
    // Seller Management
    SELLER: {
      CREATE: '/seller/create',
      UPDATE: '/seller/update',
      PROFILE: '/seller/profile',
      INFO: '/seller/get-seller-info',
      STATS: '/seller/stats',
      VERIFICATION: '/seller/verification',
    },
    
    // Products
    PRODUCTS: {
      BASE: '/products',
      UPLOAD_EXCEL: '/products/upload-excel',
      SEARCH: '/products/search',
      TRENDING: '/products/trending',
      RECOMMENDATIONS: '/products/recommendations',
      BY_CATEGORY: '/products/category',
      FAVORITES: '/products/favorites',
    },
    
    // Diamonds
    DIAMONDS: {
      BASE: '/diamond',
      SEARCH: '/diamond/search',
      BY_SELLER: '/diamond/seller',
    },
    
    // Gemstones
    GEMSTONES: {
      BASE: '/gemstone',
      SEARCH: '/gemstone/search',
      BY_SELLER: '/gemstone/seller',
    },
    
    // Jewelry
    JEWELRY: {
      BASE: '/jewelry',
      SEARCH: '/jewelry/search',
      BY_SELLER: '/jewelry/seller',
    },
    

    
    // Auctions
    AUCTIONS: {
      BASE: '/auctions',
      BID: '/auctions/bid',
      ACTIVE: '/auctions/active',
      ENDED: '/auctions/ended',
    },
    
    // Chat
    CHAT: {
      BASE: '/chat',
      DELETE_MESSAGE: '/chat/:messageId',
      READ: '/chat/read',
    },

    
    // File Uploads
    UPLOADS: {
      IMAGES: '/uploads/images',
      DOCUMENTS: '/uploads/documents',
      EXCEL: '/uploads/excel',
    },
  },
  
  // Request Configuration
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number>): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

// Environment-specific configurations
export const ENV_CONFIG = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  
  // Feature flags
  FEATURES: {
    ENABLE_AUCTIONS: process.env.NEXT_PUBLIC_ENABLE_AUCTIONS === 'true',
    ENABLE_CHAT: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true',
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
} as const;