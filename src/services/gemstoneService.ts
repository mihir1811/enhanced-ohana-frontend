import { apiService as api, ApiResponse } from './api';

// Gemstone interfaces
export interface GemstoneAuctionBid {
  id: number;
  userId: string;
  auctionId: number;
  bidAmount: number;
  bidTime: string;
  isWinning?: boolean;
}

export interface GemstonItem {
  id: string | number;
  name: string;
  skuCode?: string;
  totalPrice?: number;
  gemType?: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  image6?: string | null;
  sellerId: string;
  caratWeight?: number;
  quantity?: number;
  length?: number;
  width?: number;
  height?: number;
  cut?: string;
  color?: string;
  clarity?: string;
  origin?: string;
  treatment?: string;
  certification?: string;
  shape?: string;
  isOnAuction?: boolean;
  auctionEndTime?: string | null;
  // Seller information
  seller?: {
    id: string;
    userId?: string;
    sellerType: string;
    companyName: string;
    companyLogo: string;
  };
}

// Detailed gemstone interface for single gemstone API response
export interface DetailedGemstone {
  id: number;
  name: string;
  gemsType: string;
  subType: string;
  composition: string;
  qualityGrade: string;
  quantity: number;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  image6: string;
  videoURL: string;
  stockNumber: number;
  sellerStockNumber: number;
  description: string;
  discount: string;
  price?: number;
  totalPrice?: number;
  carat: number;
  shape: string;
  color: string;
  clarity: string;
  hardness: number;
  origin: string;
  fluoreScence: string;
  process: string;
  cut: string;
  dimension: string;
  refrectiveIndex: string;
  birefringence: string;
  spacificGravity: string;
  treatment: string;
  certificateCompanyName: string;
  sellerId: string;
  isOnAuction: boolean;
  isSold: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    userId?: string;
    sellerType: string;
    companyName: string;
    companyLogo: string;
  };
  auction?: {
    id: number;
    productType: string;
    productId: number;
    sellerId: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
    isSold: boolean;
    createdAt: string;
    updatedAt: string;
    bids: GemstoneAuctionBid[];
  };
}

// API response for single gemstone
export interface SingleGemstoneApiResponse {
  success: boolean;
  message: string;
  data: DetailedGemstone;
}

// Utility function to transform detailed gemstone to GemstonItem with extended data
export const transformDetailedGemstone = (detailed: DetailedGemstone): GemstonItem & {
  // Extended properties from detailed API
  subType?: string;
  composition?: string;
  qualityGrade?: string;
  quantity?: number;
  videoURL?: string;
  stockNumber?: number;
  sellerStockNumber?: number;
  description?: string;
  discount?: string;
  price?: number;
  hardness?: number;
  fluoreScence?: string;
  process?: string;
  dimension?: string;
  refrectiveIndex?: string;
  birefringence?: string;
  spacificGravity?: string;
  seller?: {
    id: string;
    sellerType: string;
    companyName: string;
    companyLogo: string;
  };
  auction?: {
    id: number;
    productType: string;
    productId: number;
    sellerId: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
    isSold: boolean;
    createdAt: string;
    updatedAt: string;
    bids: GemstoneAuctionBid[];
  };
} => {
  return {
    // Basic GemstonItem properties
    id: detailed.id,
    name: detailed.name,
    skuCode: detailed.stockNumber?.toString() || '',
    totalPrice: detailed.totalPrice ?? detailed.price,
    gemType: detailed.gemsType,
    image1: detailed.image1,
    image2: detailed.image2,
    image3: detailed.image3,
    image4: detailed.image4,
    image5: detailed.image5,
    image6: detailed.image6,
    sellerId: detailed.sellerId,
    caratWeight: detailed.carat,
    cut: detailed.cut,
    color: detailed.color,
    clarity: detailed.clarity,
    origin: detailed.origin,
    treatment: detailed.treatment,
    certification: detailed.certificateCompanyName,
    shape: detailed.shape,
    isOnAuction: detailed.isOnAuction,
    auctionEndTime: detailed.auction?.endTime || null,
    
    // Extended properties
    subType: detailed.subType,
    composition: detailed.composition,
    qualityGrade: detailed.qualityGrade,
    quantity: detailed.quantity,
    videoURL: detailed.videoURL,
    stockNumber: detailed.stockNumber,
    sellerStockNumber: detailed.sellerStockNumber,
    description: detailed.description,
    discount: detailed.discount,
    price: detailed.totalPrice ?? detailed.price,
    hardness: detailed.hardness,
    fluoreScence: detailed.fluoreScence,
    process: detailed.process,
    dimension: detailed.dimension,
    refrectiveIndex: detailed.refrectiveIndex,
    birefringence: detailed.birefringence,
    spacificGravity: detailed.spacificGravity,
    seller: detailed.seller,
    auction: detailed.auction,
  };
};

export interface GemstoneQueryParams {
  category?: string;
  sellerId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
  gemsType?: string[];
  shape?: string[];
  color?: string[];
  clarity?: string[];
  cut?: string[];
  origin?: string[];
  treatment?: string[];
  certification?: string[];
  caratMin?: number;
  caratMax?: number;
  searchBy?: string[];
  enhancement?: string[];
  transparency?: string[];
  luster?: string[];
  phenomena?: string[];
  minerals?: string[];
  birthstones?: string[];
  location?: string[];
  companyName?: string;
  vendorLocation?: string;
  reportNumber?: string;
  lengthMin?: number;
  lengthMax?: number;
  widthMin?: number;
  widthMax?: number;
  heightMin?: number;
  heightMax?: number;
  quantity?: number | { gt?: number; lt?: number; gte?: number; lte?: number };
}

export interface GemstoneApiResponse {
  success: boolean;
  message: string;
  data: {
    data: GemstonItem[];
    meta: {
      total: number;
      lastPage: number;
      currentPage: number;
      perPage: number;
      prev: number | null;
      next: number | null;
    };
  };
}

const sanitizeParams = (params: Record<string, any> | undefined): Record<string, string | number | boolean> => {
  if (!params) return {};
  const sanitized: Record<string, string | number | boolean> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        sanitized[key] = value.join(',');
      } else if (typeof value === 'object') {
        sanitized[key] = JSON.stringify(value);
      } else {
        sanitized[key] = String(value);
      }
    }
  });
  return sanitized;
}

export const gemstoneService = {
  getAllGemstones: async (params: GemstoneQueryParams = {}): Promise<ApiResponse<{
    data: GemstonItem[];
    meta: {
      total: number;
      lastPage: number;
      currentPage: number;
      perPage: number;
      prev: number | null;
      next: number | null;
    };
  }>> => {
    return api.get<{
      data: GemstonItem[];
      meta: {
        total: number;
        lastPage: number;
        currentPage: number;
        perPage: number;
        prev: number | null;
        next: number | null;
      };
    }>(`/gem-stone`, sanitizeParams(params));
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGemstonesBySeller: async <T = any>({ sellerId, page = 1, limit = 10 }: { sellerId: string, page?: number, limit?: number }) => {
    return api.get<T>(`/gem-stone`, sanitizeParams({ sellerId, page, limit }));
  },

  // Get single gemstones by seller
  getSingleGemstonesBySeller: async <T = any>({ sellerId, page = 1, limit = 10 }: { sellerId: string, page?: number, limit?: number }) => {
    return api.get<T>(`/gem-stone`, sanitizeParams({ sellerId, page, limit, quantity: 1 }));
  },

  // Get melee gemstones by seller
  getMeleeGemstonesBySeller: async <T = any>({ sellerId, page = 1, limit = 10 }: { sellerId: string, page?: number, limit?: number }) => {
    return api.get<T>(`/gem-stone`, sanitizeParams({ sellerId, page, limit, quantity: { gt: 1 } }));
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchGemstones: async <T = any>(search: string) => {
    return api.get<T>(`/gem-stone`, sanitizeParams({ search, searchBy: 'name,skuCode,gemType,origin' }));
  },

  addGemstone: async (formData: FormData, token: string) => {
    // POST /gem-stone with multipart/form-data
    return api.upload('/gem-stone', formData, token);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getGemstoneById: async <T = any>(id: string) => {
    return api.get<T>(`/gem-stone/${id}`);
  },

  getSingleGemstone: async (identifier: string): Promise<ApiResponse<DetailedGemstone>> => {
    // Use the specific gemstone ID in the URL path
    return api.get<DetailedGemstone>(`/gem-stone/${identifier}`);
  },

  updateGemstone: async (id: string, formData: FormData, token: string) => {
    // PATCH /gem-stone/:id with multipart/form-data
    return api.uploadPatch(`/gem-stone/${id}`, formData, token);
  },
  
  deleteGemstone: async (id: string | number, token: string) => {
    // DELETE /gem-stone/:id with Accept and Authorization headers
    return api.delete(`/gem-stone/${id}`, token);
  },
};
