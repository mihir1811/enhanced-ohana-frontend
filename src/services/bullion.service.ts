import { API_CONFIG, buildApiUrl } from '../lib/constants';
import { getCookie } from '../lib/cookie-utils';

export interface MetalType {
  id: number;
  name: string;
  isActive: boolean;
}

export interface MetalShape {
  id: number;
  name: string;
  isActive: boolean;
}

export interface MetalFineness {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CreateBullionRequest {
  stockNumber: string;
  metalTypeId: number;
  metalShapeId: number;
  metalFinenessId: number;
  metalWeight: string;
  price: string;
  quantity: number;
  design?: string;
  demention?: string;
  condition?: string;
  mintMark?: string;
  mintYear?: number;
  serialNumber?: string;
  certificateNumber?: string;
  certification?: string;
  availability?: string;
}

export interface BullionQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  metalType?: string[];
  metalShape?: string[];
  metalFineness?: string[];
  stockNumber?: string;
}

export interface BullionProduct {
  id: number;
  stockNumber: string;
  metalTypeId: number;
  metalShapeId: number;
  metalFinenessId: number;
  metalWeight: string;
  price: string;
  quantity: number;
  design?: string;
  demention?: string;
  condition?: string;
  mintMark?: string;
  mintYear?: number;
  serialNumber?: string;
  certificateNumber?: string;
  certification?: string;
  availability?: string;
  isActive: boolean;
  isSold: boolean;
  createdAt: string;
  updatedAt: string;
  metalType?: MetalType;
  metalShape?: MetalShape;
  metalFineness?: MetalFineness;
}

class BullionService {
  private getHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async getMetalTypes(): Promise<{ data: MetalType[] }> {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.BULLION.METAL_TYPES), {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch metal types');
    return response.json();
  }

  async getMetalShapes(): Promise<{ data: MetalShape[] }> {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.BULLION.METAL_SHAPES), {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch metal shapes');
    return response.json();
  }

  async getMetalFineness(): Promise<{ data: MetalFineness[] }> {
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.BULLION.METAL_FINENESS), {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch metal fineness');
    return response.json();
  }

  async createBullion(data: CreateBullionRequest): Promise<any> {
    const token = getCookie('token') || undefined;
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.BULLION.BASE), {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to create bullion');
    }
    return response.json();
  }

  async getBullions(params: BullionQueryParams = {}): Promise<any> {
    const token = getCookie('token') || undefined;
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.search) queryParams.append('search', params.search);

    // Filters
    if (params.priceMin !== undefined) queryParams.append('filters[price][gte]', params.priceMin.toString());
    if (params.priceMax !== undefined) queryParams.append('filters[price][lte]', params.priceMax.toString());
    
    // Metal Type filter (assuming backend handles nested filtering or we filter by ID if we had it, but here we try name)
    // Backend prisma where: { metalType: { name: { in: [...] } } }
    if (params.metalType && params.metalType.length > 0) {
      params.metalType.forEach(type => {
        queryParams.append('filters[metalType][name][in][]', type);
      });
    }

    if (params.stockNumber) queryParams.append('filters[stockNumber][contains]', params.stockNumber);
    
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.BULLION.ALL)}?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch bullions');
    return response.json();
  }

  async getBullionById(id: number): Promise<any> {
    const token = getCookie('token') || undefined;
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.BULLION.BASE)}/${id}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch bullion');
    return response.json();
  }

  async deleteBullion(id: number): Promise<any> {
    const token = getCookie('token') || undefined;
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.BULLION.BASE)}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete bullion');
    return response.json();
  }
  async updateBullion(id: number, data: Partial<CreateBullionRequest>): Promise<any> {
    const token = getCookie('token') || undefined;
    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.BULLION.BASE)}/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to update bullion');
    }
    return response.json();
  }
}

export const bullionService = new BullionService();
