
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
  async uploadExcel(file: File, productType: string = 'diamond', token?: string): Promise<ApiResponse<ProductUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.upload(`/products/upload-excel?productType=${encodeURIComponent(productType)}`, formData, token);
  }
  // Delete diamond by ID
  async deleteDiamond(id: string | number, token?: string): Promise<ApiResponse<unknown>> {
    const diamondId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(diamondId)) {
      throw new Error('Invalid diamond ID provided');
    }
    return apiService.delete(`/diamond/${diamondId}`, token);
  }
  // Update diamond by ID (with file upload)
  async updateDiamond(id: string | number, formData: FormData, token?: string): Promise<ApiResponse<DiamondData>> {
    // Ensure ID is properly formatted for the API endpoint
    const diamondId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(diamondId)) {
      throw new Error('Invalid diamond ID provided');
    }
    return apiService.uploadPatch(`/diamond/${diamondId}`, formData, token);
  }
  // Update diamond by ID (JSON data only)
  async updateDiamondData(id: string | number, data: Partial<DiamondData>, token?: string): Promise<ApiResponse<DiamondData>> {
    const diamondId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(diamondId)) {
      throw new Error('Invalid diamond ID provided');
    }
    return apiService.patch(`/diamond/${diamondId}`, data, token);
  }
  // Add new diamond (with file upload)
  async addDiamond(formData: FormData, token?: string): Promise<ApiResponse<DiamondData>> {
    return apiService.upload('/diamond', formData, token);
  }
  // Get all diamonds with filters
  async getDiamonds(params?: DiamondFilters): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get('/diamond', params);
  }

  // Get single diamond by ID
  async getDiamondById(id: string | number): Promise<ApiResponse<DiamondData>> {
    const diamondId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(diamondId)) {
      throw new Error('Invalid diamond ID provided');
    }
    return apiService.get(`/diamond/${diamondId}`);
  }

  // Search diamonds
  async searchDiamonds(query: string, params?: SearchParams): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get('/diamond/search', { search: query, ...params });
  }

  // Get diamonds by seller
  async getDiamondsBySeller(sellerId: string, params?: SearchParams): Promise<ApiResponse<DiamondData[]>> {
    return apiService.get(`/diamond/seller/${sellerId}`, params);
  }

  // Get jewelry by seller
  async getJewelryBySeller(sellerId: string, params?: SearchParams): Promise<ApiResponse<JewelryData[]>> {
    const queryParams = { sellerId, ...params };
    return apiService.get('/jewellery', queryParams);
  }

  // Get gemstones by seller
  async getGemstonesBySeller(sellerId: string, params?: SearchParams): Promise<ApiResponse<GemstoneData[]>> {
    const queryParams = { sellerId, ...params };
    return apiService.get('/gemstone', queryParams);
  }

  // Get all products by seller based on seller type
  async getProductsBySeller(sellerId: string, sellerType?: string, params?: SearchParams): Promise<ProductsBySellerResponse> {
    const promises: Promise<ApiResponse<unknown[]>>[] = [];
    
    // Based on seller type, fetch relevant products
    if (!sellerType) {
      // If no seller type specified, fetch all product types
      promises.push(
        this.getDiamondsBySeller(sellerId, params),
        this.getJewelryBySeller(sellerId, params),
        this.getGemstonesBySeller(sellerId, params)
      );
    } else {
      switch (sellerType) {
        case 'naturalDiamond':
        case 'labGrownDiamond':
          promises.push(this.getDiamondsBySeller(sellerId, params));
          break;
        case 'jewellery':
          promises.push(this.getJewelryBySeller(sellerId, params));
          break;
        case 'gemstone':
          promises.push(this.getGemstonesBySeller(sellerId, params));
          break;
        default:
          // For unknown types, try to fetch all
          promises.push(
            this.getDiamondsBySeller(sellerId, params),
            this.getJewelryBySeller(sellerId, params),
            this.getGemstonesBySeller(sellerId, params)
          );
      }
    }

    return Promise.allSettled(promises).then((results) => {
      const diamonds = results[0]?.status === 'fulfilled' ? (results[0].value?.data || []) as DiamondData[] : [];
      const jewelry = results[1]?.status === 'fulfilled' ? (results[1].value?.data || []) as JewelryData[] : [];
      const gemstones = results[2]?.status === 'fulfilled' ? (results[2].value?.data || []) as GemstoneData[] : [];
      
      return {
        data: {
          diamonds,
          jewelry,
          gemstones,
          all: [...diamonds, ...jewelry, ...gemstones]
        }
      };
    });
  }

  // Get all products (diamonds + jewelry) by seller - keeping for backward compatibility
  async getAllProductsBySeller(sellerId: string, params?: SearchParams): Promise<ProductsBySellerResponse> {
    return this.getProductsBySeller(sellerId, undefined, params);
  }
}

export const diamondService = new DiamondService();
export default diamondService;
