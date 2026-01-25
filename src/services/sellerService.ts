import { ApiResponse } from './api';
import { API_CONFIG, buildApiUrl } from '../lib/constants';

export interface UpdateSellerInfoPayload {
  companyName: string;
  companyLogo?: File | null;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  panCard?: File | null;
  gstNumber?: File | null;
}

export interface SellerInfo {
  id: string;
  userId: string;
  companyName: string;
  companyLogo?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  panCard?: string;
  gstNumber?: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  sellerType?: string;
  businessType?: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSellerInfoResponse {
  message: string;
  seller: SellerInfo;
}

class SellerService {
  async updateSellerInfo(
    data: UpdateSellerInfoPayload,
    token: string
  ): Promise<ApiResponse<UpdateSellerInfoResponse>> {
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
        'Accept': 'application/json',
        // 'Content-Type' is omitted for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update seller info');
    }
    return response.json();
  }

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
}

export const sellerService = new SellerService();
