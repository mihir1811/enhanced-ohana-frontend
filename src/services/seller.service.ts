// Seller registration and profile API service
import { ApiResponse } from './api';

export interface BecomeSellerData {
  companyName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  sellerType: string;
  companyLogo?: File;
}

class SellerService {
  async createSeller(data: BecomeSellerData, token?: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value as string);
      }
    });
    const res = await fetch('/api/v1/seller/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to create seller');
    return res.json();
  }
}

export const sellerService = new SellerService();