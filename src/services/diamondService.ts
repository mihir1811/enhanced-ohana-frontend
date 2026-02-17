
import { apiService, ApiResponse } from './api';
import { API_CONFIG, buildApiUrl } from '../lib/constants';

export interface SellerInfo {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  verificationStatus?: string;
  rating?: number;
  totalProducts?: number;
  joinedDate?: string;
  [key: string]: unknown;
}

export interface DiamondData {
  id: string | number;
  price: number;
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  shape: string;
  certification?: string;
  images?: string[];
  sellerId: string;
  seller?: {
    id: string | number;
    userId?: string;
    companyName?: string;
    companyLogo?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface DiamondResponse extends ApiResponse<DiamondData[]> {
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProductUploadResponse {
  success: boolean;
  message: string;
  uploadedCount?: number;
  failedCount?: number;
  errors?: string[];
  [key: string]: unknown;
}

export interface JewelryData {
  id: string | number;
  name: string;
  price: number;
  category: string;
  material: string;
  weight?: number;
  images?: string[];
  sellerId: string;
  [key: string]: unknown;
}

export interface GemstoneData {
  id: string | number;
  name: string;
  price: number;
  carat: number;
  color: string;
  clarity: string;
  origin?: string;
  treatment?: string;
  images?: string[];
  sellerId: string;
  [key: string]: unknown;
}

export interface ProductsBySellerResponse {
  data: {
    diamonds: DiamondData[];
    meleeDiamonds: DiamondData[];
    jewelry: JewelryData[];
    gemstones: GemstoneData[];
    all: (DiamondData | JewelryData | GemstoneData)[];
  };
}

export interface SearchParams {
  [key: string]: string | number | boolean | undefined;
}

export interface DiamondFilters {
  search?: string;
  searchBy?: string | string[];
  sort?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
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

class DiamondService {
  // Get seller info by sellerId
  async getSellerInfo(sellerId: string): Promise<ApiResponse<SellerInfo>> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.SELLER.INFO, { seller_id: sellerId });
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch seller info');
    }
    return response.json();
  }
  // Bulk upload products via Excel (dynamic productType)
  async uploadExcel(file: File, productType: string = 'diamond', token?: string, hasUpdate: boolean = false): Promise<ApiResponse<ProductUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.upload<ProductUploadResponse>(`/products/upload-file?productType=${encodeURIComponent(productType)}&has_update=${hasUpdate}`, formData, token);
  }
  // Delete diamond by ID
  async deleteDiamond(id: string | number, token?: string): Promise<ApiResponse<unknown>> {
    const diamondId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(diamondId)) {
      throw new Error('Invalid diamond ID provided');
    }
    return apiService.delete(`/diamond/${diamondId}`, token);
  }

    async deleteMeleeDiamond(id: string | number, token?: string): Promise<ApiResponse<unknown>> {
    const diamondId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(diamondId)) {
      throw new Error('Invalid diamond ID provided');
    }
    return apiService.delete(`/melee-diamond/${diamondId}`, token);
  }
  // Update diamond by ID (with file upload)
  async updateDiamond(id: string | number, formData: FormData, token?: string): Promise<ApiResponse<DiamondData>> {
    // Ensure ID is properly formatted for the API endpoint
    const diamondId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(diamondId)) {
      throw new Error('Invalid diamond ID provided');
    }
    return apiService.uploadPatch<DiamondData>(`/diamond/${diamondId}`, formData, token);
  }
  // Update diamond by ID (JSON data only)
  async updateDiamondData(id: string | number, data: Partial<DiamondData>, token?: string): Promise<ApiResponse<DiamondData>> {
    const diamondId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(diamondId)) {
      throw new Error('Invalid diamond ID provided');
    }
    return apiService.patch<DiamondData>(`/diamond/${diamondId}`, data, token);
  }
  // Add new diamond (with file upload)
  async addDiamond(formData: FormData, token?: string): Promise<ApiResponse<DiamondData>> {
    return apiService.upload<DiamondData>('/diamond', formData, token);
  }

  // Add new Melee diamond (with file upload)
  async addMeleeDiamond(formData: FormData, token?: string): Promise<ApiResponse<DiamondData>> {
    return apiService.upload<DiamondData>('/melee-diamond', formData, token);
  }
  // Get all diamonds with filters
  async getDiamonds(params?: DiamondFilters): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get<DiamondData[]>('/diamond', sanitizeParams(params));
  }

  // Get all melee diamonds with filters
  async getMeleeDiamonds(params?: DiamondFilters): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get<DiamondData[]>('/melee-diamond', sanitizeParams(params));
  }

  // Get lab grown diamonds with filters
  async getLabDiamonds(params?: DiamondFilters): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get<DiamondData[]>('/diamond', sanitizeParams({ ...params, stoneType: 'labGrownDiamond' }));
  }

  // Get melee lab grown diamonds with filters
  async getMeleeLabDiamonds(params?: DiamondFilters): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get<DiamondData[]>('/melee-diamond', sanitizeParams({ ...params, stoneType: 'labGrownDiamond' }));
  }

  // Get natural diamonds with filters
  async getNaturalDiamonds(params?: DiamondFilters): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get<DiamondData[]>('/diamond', sanitizeParams({ ...params, stoneType: 'naturalDiamond' }));
  }

  // Get melee natural diamonds with filters
  async getMeleeNaturalDiamonds(params?: DiamondFilters): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get<DiamondData[]>('/melee-diamond', sanitizeParams({ ...params, stoneType: 'naturalDiamond' }));
  }

  // Get single diamond by ID
  async getDiamondById(id: string | number): Promise<ApiResponse<DiamondData>> {
    const diamondId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(diamondId)) {
      throw new Error('Invalid diamond ID provided');
    }
    return apiService.get<DiamondData>(`/diamond/${diamondId}`);
  }

  // Get melee diamond by ID
  async getMeleeDiamondById(id: string | number): Promise<ApiResponse<DiamondData>> {
    const diamondId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(diamondId)) {
      throw new Error('Invalid diamond ID provided');
    }
    return apiService.get<DiamondData>(`/melee-diamond/${diamondId}`);
  }

  // Search diamonds
  async searchDiamonds(query: string, params?: SearchParams): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get<DiamondData[]>('/diamond/search', sanitizeParams({ search: query, ...params }));
  }

  // Get diamonds by seller
  async getDiamondsBySeller(sellerId: string, params?: SearchParams): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get<DiamondData[]>(`/diamond/seller/${sellerId}`, sanitizeParams(params));
  }

  // Get melee diamonds by seller
  async getMeleeDiamondsBySeller(sellerId: string, params?: SearchParams): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get<DiamondData[]>(`/melee-diamond/seller/${sellerId}`, sanitizeParams(params));
  }

  // Get jewelry by seller
  async getJewelryBySeller(sellerId: string, params?: SearchParams): Promise<ApiResponse<JewelryData[]>> {
    const queryParams = { sellerId, ...params };
    return apiService.get<JewelryData[]>('/jewellery', sanitizeParams(queryParams));
  }

  // Get gemstones by seller
  async getGemstonesBySeller(sellerId: string, params?: SearchParams): Promise<ApiResponse<GemstoneData[]>> {
    const queryParams = { sellerId, ...params };
    return apiService.get<GemstoneData[]>('/gemstone', sanitizeParams(queryParams));
  }

  // Get all products by seller based on seller type
  async getProductsBySeller(sellerId: string, sellerType?: string, params?: SearchParams): Promise<ProductsBySellerResponse> {
    const results = {
      diamonds: [] as DiamondData[],
      meleeDiamonds: [] as DiamondData[],
      jewelry: [] as JewelryData[],
      gemstones: [] as GemstoneData[]
    };

    const promises: Promise<void>[] = [];

    const fetchDiamonds = () => this.getDiamondsBySeller(sellerId, params).then(res => { results.diamonds = res.data || []; });
    const fetchMelee = () => this.getMeleeDiamondsBySeller(sellerId, params).then(res => { results.meleeDiamonds = res.data || []; });
    const fetchJewelry = () => this.getJewelryBySeller(sellerId, params).then(res => { results.jewelry = res.data || []; });
    const fetchGemstones = () => this.getGemstonesBySeller(sellerId, params).then(res => { results.gemstones = res.data || []; });

    if (!sellerType) {
      promises.push(fetchDiamonds(), fetchJewelry(), fetchGemstones());
    } else {
      switch (sellerType) {
        case 'naturalDiamond':
          promises.push(fetchDiamonds());
          break;
        case 'labGrownDiamond':
          promises.push(fetchDiamonds(), fetchMelee());
          break;
        case 'jewellery':
          promises.push(fetchJewelry());
          break;
        case 'gemstone':
          promises.push(fetchGemstones());
          break;
        default:
          promises.push(fetchDiamonds(), fetchJewelry(), fetchGemstones());
      }
    }

    await Promise.allSettled(promises);

    return {
      data: {
        ...results,
        all: [...results.diamonds, ...results.meleeDiamonds, ...results.jewelry, ...results.gemstones] as (DiamondData | JewelryData | GemstoneData)[]
      }
    };
  }

  // Get all products (diamonds + jewelry) by seller - keeping for backward compatibility
  async getAllProductsBySeller(sellerId: string, params?: SearchParams): Promise<ProductsBySellerResponse> {
    return this.getProductsBySeller(sellerId, undefined, params);
  }
}

export const diamondService = new DiamondService();
export default diamondService;
