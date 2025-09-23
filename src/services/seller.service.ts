// Seller registration and profile API service
import { ApiResponse } from './api';
import { API_CONFIG, buildApiUrl } from '../lib/constants';

export const SellerType = {
  naturalDiamond: 'naturalDiamond',
  labGrownDiamond: 'labGrownDiamond',
  jewellery: 'jewellery',
  gemstone: 'gemstone'
} as const;

export type SellerTypeValue = typeof SellerType[keyof typeof SellerType];

// Simple interface matching the API exactly
export interface CreateSellerRequest {
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  sellerType: SellerTypeValue;
  companyLogo?: File;
}

class SellerService {
  // Create seller with exact API call matching the curl request
  async createSeller(data: CreateSellerRequest, token?: string): Promise<ApiResponse<any>> {
    // Build FormData exactly matching the curl request
    const formData = new FormData();
    
    // Add all required fields from the curl request
    formData.append('companyName', data.companyName);
    formData.append('addressLine1', data.addressLine1);
    formData.append('addressLine2', data.addressLine2);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('country', data.country);
    formData.append('zipCode', data.zipCode);
    formData.append('sellerType', data.sellerType);
    
    // Add company logo if provided
    if (data.companyLogo) {
      formData.append('companyLogo', data.companyLogo);
    }

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SELLER.CREATE), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        // Note: Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.message || 'Failed to create seller');
    }
    
    return response.json();
  }

  async updateSellerInfo(data: any, token?: string): Promise<any> {
    const formData = new FormData();
    formData.append('companyName', data.companyName);
    if (data.companyLogo) formData.append('companyLogo', data.companyLogo);
    formData.append('addressLine1', data.addressLine1);
    if (data.addressLine2) formData.append('addressLine2', data.addressLine2);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('country', data.country);
    formData.append('zipCode', data.zipCode);
    if (data.panCard) formData.append('panCard', data.panCard);
    if (data.gstNumber) formData.append('gstNumber', data.gstNumber);

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SELLER.UPDATE), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to update seller info');
    }

    return response.json();
  }

  async getSellerInfo(sellerId: string): Promise<any> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/seller/${sellerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get seller info');
    }

    return response.json();
  }
}

export const sellerService = new SellerService();