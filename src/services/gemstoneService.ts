import api from './api';
import { ApiResponse } from './api';

// Gemstone interfaces
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
  price: number;
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
  certificateCompanyId: number;
  sellerId: string;
  isOnAuction: boolean;
  isSold: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  seller: {
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
    bids: any[];
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
    bids: any[];
  };
} => {
  return {
    // Basic GemstonItem properties
    id: detailed.id,
    name: detailed.name,
    skuCode: detailed.stockNumber?.toString() || '',
    totalPrice: detailed.price,
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
    certification: detailed.certificateCompanyId?.toString(),
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
    price: detailed.price,
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
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  priceMin?: number;
  priceMax?: number;
  gemType?: string[];
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
    const queryParams = new URLSearchParams();
    
    // Add basic params
    if (params.page) queryParams.append('page', String(params.page));
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.search) queryParams.append('search', params.search);
    
    // Add search fields
    if (params.searchBy?.length) {
      params.searchBy.forEach(field => queryParams.append('searchBy', field));
    } else if (params.search) {
      // Default search fields when search is provided but no specific searchBy
      ['name', 'skuCode', 'gemType', 'origin'].forEach(field => 
        queryParams.append('searchBy', field)
      );
    }
    
    // Add filter params
    if (params.priceMin) queryParams.append('priceMin', String(params.priceMin));
    if (params.priceMax) queryParams.append('priceMax', String(params.priceMax));
    if (params.caratMin) queryParams.append('caratMin', String(params.caratMin));
    if (params.caratMax) queryParams.append('caratMax', String(params.caratMax));
    
    // Add array filters
    if (params.gemType?.length) {
      params.gemType.forEach(type => queryParams.append('gemType', type));
    }
    if (params.shape?.length) {
      params.shape.forEach(shape => queryParams.append('shape', shape));
    }
    if (params.color?.length) {
      params.color.forEach(color => queryParams.append('color', color));
    }
    if (params.clarity?.length) {
      params.clarity.forEach(clarity => queryParams.append('clarity', clarity));
    }
    if (params.cut?.length) {
      params.cut.forEach(cut => queryParams.append('cut', cut));
    }
    if (params.origin?.length) {
      params.origin.forEach(origin => queryParams.append('origin', origin));
    }
    if (params.treatment?.length) {
      params.treatment.forEach(treatment => queryParams.append('treatment', treatment));
    }
    if (params.certification?.length) {
      params.certification.forEach(cert => queryParams.append('certification', cert));
    }
    
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
    }>(`/gem-stone?${queryParams.toString()}`);
  },

  getGemstonesBySeller: async <T = any>({ sellerId, page = 1, limit = 10 }: { sellerId: string, page?: number, limit?: number }) => {
    return api.get<T>(`/gem-stone?sellerId=${sellerId}&page=${page}&limit=${limit}`);
  },

  searchGemstones: async <T = any>(search: string) => {
    const params = new URLSearchParams();
    if (search) {
      params.append('search', search);
      params.append('searchBy', 'name');
      params.append('searchBy', 'skuCode');
      params.append('searchBy', 'gemType');
      params.append('searchBy', 'origin');
    }
    return api.get<T>(`/gem-stone?${params.toString()}`);
  },

  addGemstone: async (formData: FormData, token: string) => {
    // POST /gem-stone with multipart/form-data
    return api.upload('/gem-stone', formData, token);
  },

  getGemstoneById: async <T = any>(id: string) => {
    return api.get<T>(`/gem-stone/${id}`, { headers: { Accept: 'application/json' } });
  },

  getSingleGemstone: async (identifier: string): Promise<ApiResponse<DetailedGemstone>> => {
    // Use the specific gemstone ID in the URL path
    return api.get<DetailedGemstone>(`/gem-stone/${identifier}`, { 
      headers: { Accept: 'application/json' }
    });
  },

  updateGemstone: async (id: string, formData: FormData, token: string) => {
    // PATCH /gem-stone/:id with multipart/form-data
    return api.uploadPatch(`/gem-stone/${id}`, formData, token);
  },
  
  deleteGemstone: async (id: string, token: string) => {
    // DELETE /gem-stone/:id with Accept and Authorization headers
    return api.delete(`/gem-stone/${id}`, token);
  },
};
