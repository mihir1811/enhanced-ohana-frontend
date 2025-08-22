import { apiService } from './api';

export interface DiamondFilters {
  search?: string;
  searchBy?: string | string[];
  sort?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

class DiamondService {
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
}

export const diamondService = new DiamondService();
export default diamondService;
