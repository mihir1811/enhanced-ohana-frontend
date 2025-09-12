// Bullion-related API services
import { apiService, ApiResponse } from './api'

export interface BullionItem {
  id: string;
  name: string;
  type: 'bar' | 'coin' | 'round' | 'ingot' | 'wafer';
  metal: 'gold' | 'silver' | 'platinum' | 'palladium' | 'copper' | 'rhodium';
  purity: string; // e.g., "999.9", "958.4", "925"
  weight: number; // in troy ounces or grams
  weightUnit: 'oz' | 'g' | 'kg' | 'dwt'; // troy ounce, gram, kilogram, pennyweight
  dimensions: {
    length?: number;
    width?: number;
    thickness?: number;
    diameter?: number;
    unit: 'mm' | 'in';
  };
  mint?: string; // Perth Mint, Royal Canadian Mint, etc.
  year?: number;
  country?: string;
  series?: string;
  design?: string;
  condition: 'BU' | 'Proof' | 'MS69' | 'MS70' | 'Circulated' | 'Uncirculated';
  certification?: {
    company: string;
    grade: string;
    certNumber: string;
  };
  price: number;
  premium: number; // premium over spot price
  spotPrice: number; // current metal spot price
  pricePerOunce: number;
  currency: string;
  images: string[];
  description?: string;
  seller: {
    id: string;
    companyName: string;
    companyLogo?: string;
    rating: number;
    location: string;
    verified: boolean;
  };
  inventory: {
    quantity: number;
    sku: string;
    location: string;
  };
  shipping: {
    free: boolean;
    cost?: number;
    insured: boolean;
    signature: boolean;
  };
  status: 'active' | 'sold' | 'reserved' | 'pending';
  createdAt: string;
  updatedAt: string;
  views: number;
  favorites: number;
}

export interface BullionFilters {
  type?: string[]; // bar, coin, round, etc.
  metal?: string[]; // gold, silver, platinum, etc.
  purity?: string[]; // 999.9, 925, etc.
  weight?: {
    min: number;
    max: number;
  };
  weightUnit?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  mint?: string[];
  year?: {
    min: number;
    max: number;
  };
  country?: string[];
  condition?: string[];
  certification?: string[];
  sellerId?: string;
  location?: string;
  freeShipping?: boolean;
  inStock?: boolean;
  search?: string;
  sortBy?: 'price' | 'weight' | 'premium' | 'date' | 'popularity' | 'spotPrice';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DetailedBullion extends BullionItem {
  detailedDescription?: string;
  specifications?: {
    fineness: string;
    composition: string;
    edgeType?: string;
    mintage?: number;
    designer?: string;
    obverse?: string;
    reverse?: string;
  };
  marketData?: {
    spotPrice: number;
    premium: number;
    priceHistory: Array<{
      date: string;
      price: number;
      spotPrice: number;
    }>;
  };
  relatedProducts?: BullionItem[];
}

export interface CreateBullionData {
  name: string;
  type: BullionItem['type'];
  metal: BullionItem['metal'];
  purity: string;
  weight: number;
  weightUnit: BullionItem['weightUnit'];
  dimensions: BullionItem['dimensions'];
  mint?: string;
  year?: number;
  country?: string;
  series?: string;
  design?: string;
  condition: BullionItem['condition'];
  certification?: BullionItem['certification'];
  price: number;
  premium: number;
  description?: string;
  inventory: {
    quantity: number;
    sku: string;
    location: string;
  };
  shipping: BullionItem['shipping'];
}

// Transform API response to BullionItem interface
export const transformApiBullion = (apiBullion: any): BullionItem => {
  return {
    id: apiBullion.id?.toString() || '',
    name: apiBullion.name || apiBullion.title || '',
    type: apiBullion.type || apiBullion.bullionType || 'bar',
    metal: apiBullion.metal || apiBullion.metalType || 'gold',
    purity: apiBullion.purity || apiBullion.fineness || '999.9',
    weight: apiBullion.weight || 0,
    weightUnit: apiBullion.weightUnit || apiBullion.unit || 'oz',
    dimensions: {
      length: apiBullion.dimensions?.length || apiBullion.length,
      width: apiBullion.dimensions?.width || apiBullion.width,
      thickness: apiBullion.dimensions?.thickness || apiBullion.thickness,
      diameter: apiBullion.dimensions?.diameter || apiBullion.diameter,
      unit: apiBullion.dimensions?.unit || 'mm',
    },
    mint: apiBullion.mint || apiBullion.manufacturer,
    year: apiBullion.year || apiBullion.mintYear,
    country: apiBullion.country || apiBullion.origin,
    series: apiBullion.series || apiBullion.collection,
    design: apiBullion.design || apiBullion.theme,
    condition: apiBullion.condition || apiBullion.grade || 'BU',
    certification: apiBullion.certification && {
      company: apiBullion.certification.company || apiBullion.certification.certifier || '',
      grade: apiBullion.certification.grade || apiBullion.certification.rating || '',
      certNumber: apiBullion.certification.certNumber || apiBullion.certification.number || '',
    },
    price: parseFloat(apiBullion.price?.toString() || '0'),
    premium: parseFloat(apiBullion.premium?.toString() || '0'),
    spotPrice: parseFloat(apiBullion.spotPrice?.toString() || '0'),
    pricePerOunce: parseFloat(apiBullion.pricePerOunce?.toString() || apiBullion.price?.toString() || '0'),
    currency: apiBullion.currency || 'USD',
    images: Array.isArray(apiBullion.images) ? apiBullion.images : 
           apiBullion.image ? [apiBullion.image] : [],
    description: apiBullion.description || apiBullion.shortDescription || '',
    seller: {
      id: apiBullion.seller?.id?.toString() || apiBullion.sellerId?.toString() || '',
      companyName: apiBullion.seller?.companyName || apiBullion.seller?.name || 'Unknown Seller',
      companyLogo: apiBullion.seller?.companyLogo || apiBullion.seller?.logo,
      rating: apiBullion.seller?.rating || 0,
      location: apiBullion.seller?.location || apiBullion.seller?.city || '',
      verified: apiBullion.seller?.verified || false,
    },
    inventory: {
      quantity: apiBullion.inventory?.quantity || apiBullion.quantity || 0,
      sku: apiBullion.inventory?.sku || apiBullion.sku || '',
      location: apiBullion.inventory?.location || apiBullion.location || '',
    },
    shipping: {
      free: apiBullion.shipping?.free || apiBullion.freeShipping || false,
      cost: apiBullion.shipping?.cost || apiBullion.shippingCost,
      insured: apiBullion.shipping?.insured || apiBullion.insuredShipping || false,
      signature: apiBullion.shipping?.signature || apiBullion.signatureRequired || false,
    },
    status: apiBullion.status || 'active',
    createdAt: apiBullion.createdAt || apiBullion.listedAt || new Date().toISOString(),
    updatedAt: apiBullion.updatedAt || apiBullion.modifiedAt || new Date().toISOString(),
    views: apiBullion.views || 0,
    favorites: apiBullion.favorites || apiBullion.wishlistCount || 0,
  };
};

// Transform DetailedBullion API response
export const transformDetailedBullion = (apiResponse: any): DetailedBullion => {
  const baseBullion = transformApiBullion(apiResponse);
  
  return {
    ...baseBullion,
    detailedDescription: apiResponse.detailedDescription || apiResponse.longDescription,
    specifications: apiResponse.specifications && {
      fineness: apiResponse.specifications.fineness || baseBullion.purity,
      composition: apiResponse.specifications.composition || `${baseBullion.metal} ${baseBullion.purity}`,
      edgeType: apiResponse.specifications.edgeType || apiResponse.specifications.edge,
      mintage: apiResponse.specifications.mintage || apiResponse.mintage,
      designer: apiResponse.specifications.designer || apiResponse.artist,
      obverse: apiResponse.specifications.obverse || apiResponse.frontDesign,
      reverse: apiResponse.specifications.reverse || apiResponse.backDesign,
    },
    marketData: apiResponse.marketData && {
      spotPrice: apiResponse.marketData.spotPrice || baseBullion.spotPrice,
      premium: apiResponse.marketData.premium || baseBullion.premium,
      priceHistory: apiResponse.marketData.priceHistory || [],
    },
    relatedProducts: Array.isArray(apiResponse.relatedProducts) 
      ? apiResponse.relatedProducts.map(transformApiBullion)
      : [],
  };
};

class BullionService {
  // Get all bullions with filters
  async getBullions(filters?: BullionFilters): Promise<ApiResponse<{ data: BullionItem[]; meta: any }>> {
    const params = filters ? { ...filters } : {};
    return apiService.get('/bullions', params);
  }

  // Get single bullion by ID
  async getSingleBullion(id: string): Promise<ApiResponse<DetailedBullion>> {
    return apiService.get(`/bullions/${id}`);
  }

  // Create new bullion (seller only)
  async createBullion(bullionData: CreateBullionData): Promise<ApiResponse<BullionItem>> {
    return apiService.post('/bullions', bullionData);
  }

  // Update bullion (seller only)
  async updateBullion(id: string, bullionData: Partial<CreateBullionData>): Promise<ApiResponse<BullionItem>> {
    return apiService.put(`/bullions/${id}`, bullionData);
  }

  // Delete bullion (seller only)
  async deleteBullion(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/bullions/${id}`);
  }

  // Get seller's bullions
  async getSellerBullions(sellerId?: string, filters?: Omit<BullionFilters, 'sellerId'>): Promise<ApiResponse<{ data: BullionItem[]; meta: any }>> {
    const endpoint = sellerId ? `/sellers/${sellerId}/bullions` : '/seller/bullions';
    return apiService.get(endpoint, filters);
  }

  // Upload bullion images
  async uploadBullionImages(bullionId: string, images: File[]): Promise<ApiResponse<string[]>> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    return apiService.upload(`/bullions/${bullionId}/images`, formData);
  }

  // Search bullions
  async searchBullions(query: string, filters?: Omit<BullionFilters, 'search'>): Promise<ApiResponse<{ data: BullionItem[]; meta: any }>> {
    return apiService.get('/bullions/search', { search: query, ...filters });
  }

  // Get current spot prices
  async getSpotPrices(): Promise<ApiResponse<{ [metal: string]: number }>> {
    return apiService.get('/bullions/spot-prices');
  }

  // Get trending bullions
  async getTrendingBullions(): Promise<ApiResponse<BullionItem[]>> {
    return apiService.get('/bullions/trending');
  }

  // Get bullions by metal type
  async getBullionsByMetal(metal: string): Promise<ApiResponse<{ data: BullionItem[]; meta: any }>> {
    return apiService.get(`/bullions/metal/${metal}`);
  }

  // Add to favorites
  async addToFavorites(bullionId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/bullions/${bullionId}/favorite`);
  }

  // Remove from favorites
  async removeFromFavorites(bullionId: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/bullions/${bullionId}/favorite`);
  }

  // Get user favorites
  async getFavorites(): Promise<ApiResponse<BullionItem[]>> {
    return apiService.get('/user/bullions/favorites');
  }

  // Track bullion view
  async trackView(bullionId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/bullions/${bullionId}/view`);
  }

  // Get price history for a bullion
  async getPriceHistory(bullionId: string, period?: '1d' | '7d' | '30d' | '1y'): Promise<ApiResponse<Array<{ date: string; price: number; spotPrice: number }>>> {
    return apiService.get(`/bullions/${bullionId}/price-history`, { period });
  }
}

export const bullionService = new BullionService();
export default bullionService;
