
import { apiService } from './api';

export interface ApiResponse<T> {
  data: T;
  [key: string]: any;
}

export interface DiamondFilters {
  search?: string;
  searchBy?: string | string[];
  sort?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

class DiamondService {
  // Get seller info by sellerId
  async getSellerInfo(sellerId: string): Promise<ApiResponse<any>> {
    const response = await fetch(`http://localhost:3000/api/v1/seller/get-seller-info?seller_id=${sellerId}`, {
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
  async uploadExcel(file: File, productType: string = 'diamond', token?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.upload(`/products/upload-excel?productType=${encodeURIComponent(productType)}`, formData, token);
  }
  // Delete diamond by ID
  async deleteDiamond(id: string | number, token?: string): Promise<any> {
    return apiService.delete(`/diamond/${id}`, token);
  }
  // Update diamond by ID (with file upload)
  async updateDiamond(id: string, formData: FormData, token?: string): Promise<any> {
    return apiService.uploadPatch(`/diamond/${id}`, formData, token);
  }
  // Add new diamond (with file upload)
  async addDiamond(formData: FormData, token?: string): Promise<any> {
    return apiService.upload('/diamond', formData, token);
  }
  // Get all diamonds with filters
  async getDiamonds(params?: DiamondFilters): Promise<any> {
    return apiService.get('/diamond', params);
  }

  // Get single diamond by ID
  async getDiamondById(id: string): Promise<any> {
    return apiService.get(`/diamond/${id}`);
  }

  // Search diamonds
  async searchDiamonds(query: string, params?: Record<string, any>): Promise<any> {
    return apiService.get('/diamond/search', { search: query, ...params });
  }

  // Get diamonds by seller
  async getDiamondsBySeller(sellerId: string, params?: Record<string, any>): Promise<any> {
    return apiService.get(`/diamond/seller/${sellerId}`, params);
  }

  // Get jewelry by seller
  async getJewelryBySeller(sellerId: string, params?: Record<string, any>): Promise<any> {
    const queryParams = { sellerId, ...params };
    return apiService.get('/jewellery', queryParams);
  }

  // Get gemstones by seller
  async getGemstonesBySeller(sellerId: string, params?: Record<string, any>): Promise<any> {
    const queryParams = { sellerId, ...params };
    return apiService.get('/gemstone', queryParams);
  }

  // Get all products by seller based on seller type
  async getProductsBySeller(sellerId: string, sellerType?: string, params?: Record<string, any>): Promise<any> {
    const promises: Promise<any>[] = [];
    
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
      const diamonds = results[0]?.status === 'fulfilled' ? results[0].value?.data || [] : [];
      const jewelry = results[1]?.status === 'fulfilled' ? results[1].value?.data || [] : [];
      const gemstones = results[2]?.status === 'fulfilled' ? results[2].value?.data || [] : [];
      
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
  async getAllProductsBySeller(sellerId: string, params?: Record<string, any>): Promise<any> {
    return this.getProductsBySeller(sellerId, undefined, params);
  }
}

export const diamondService = new DiamondService();
export default diamondService;
