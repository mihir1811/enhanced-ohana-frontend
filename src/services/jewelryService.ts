import api, { ApiResponse } from './api';

export interface JewelryQueryParams {
  search?: string;
  searchBy?: string[];
  sort?: string;
  page?: number;
  limit?: number;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  metal?: string[];
  style?: string[];
  brand?: string[];
  certification?: string[];
}

export interface JewelryItem {
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
  attributes: {
    style: string;
    length_cm: number | string;
    chain_type: string;
    clasp_type: string;
    is_adjustable: boolean;
    [key: string]: any;
  };
  description: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  image5: string | null;
  image6: string | null;
  videoURL: string | null;
  sellerId: string;
  isOnAuction: boolean;
  isSold: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  stones: Array<{
    id: number;
    jewelleryId: number;
    type: string;
    shape: string;
    carat: number;
    color: string;
    clarity: string;
    cut: string;
    certification: string;
  }>;
  auctionStartTime: string | null;
  auctionEndTime: string | null;
}

export interface JewelryApiResponse {
  success: boolean;
  message: string;
  data: {
    data: JewelryItem[];
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

export const jewelryService = {
  getAllJewelry: async (params: JewelryQueryParams = {}): Promise<ApiResponse<{
    data: JewelryItem[];
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
      ['name', 'skuCode', 'attributes.style', 'stones.type'].forEach(field => 
        queryParams.append('searchBy', field)
      );
    }
    
    // Add filter params
    if (params.category) queryParams.append('category', params.category);
    if (params.priceMin) queryParams.append('priceMin', String(params.priceMin));
    if (params.priceMax) queryParams.append('priceMax', String(params.priceMax));
    
    // Add array filters
    if (params.metal?.length) {
      params.metal.forEach(m => queryParams.append('metal', m));
    }
    if (params.style?.length) {
      params.style.forEach(s => queryParams.append('style', s));
    }
    if (params.brand?.length) {
      params.brand.forEach(b => queryParams.append('brand', b));
    }
    if (params.certification?.length) {
      params.certification.forEach(c => queryParams.append('certification', c));
    }
    
    return api.get<{
      data: JewelryItem[];
      meta: {
        total: number;
        lastPage: number;
        currentPage: number;
        perPage: number;
        prev: number | null;
        next: number | null;
      };
    }>(`/jewellery?${queryParams.toString()}`);
  },

  getJewelriesBySeller: async <T = any>({ sellerId, page = 1, limit = 10, search = '', sort = '-createdAt' }: { sellerId: string, page?: number, limit?: number, search?: string, sort?: string }) => {
    // Compose query string with sellerId and other params
    const params = new URLSearchParams({
      sellerId,
      page: String(page),
      limit: String(limit),
      sort: sort || '-createdAt',
    });
    if (search) {
      params.append('search', search);
      params.append('searchBy', 'name');
      params.append('searchBy', 'skuCode');
      params.append('searchBy', 'attributes.style');
      params.append('searchBy', 'stones.type');
    }
    return api.get<T>(`/jewellery?${params.toString()}`);
  },
  addJewelry: async (formData: FormData, token: string) => {
    return api.upload('/jewellery', formData, token);
  },
  getJewelryById: async <T = any>(id: string) => {
    return api.get<T>(`/jewellery/${id}`);
  },
  updateJewelry: async (id: string, formData: FormData, token: string) => {
    // Send FormData for PATCH (file upload)
    return api.uploadPatch(`/jewellery/${id}`, formData, token);
  },
  deleteJewelry: async (id: string, token: string) => {
    // Send DELETE request for jewelry
    return api.delete(`/jewellery/${id}`, token);
  },
};
