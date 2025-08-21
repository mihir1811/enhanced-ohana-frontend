import { apiService, ApiResponse } from './api';

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

class SellerService {
  async updateSellerInfo(
    data: UpdateSellerInfoPayload,
    token: string
  ): Promise<ApiResponse<any>> {
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

    return apiService.uploadPut('/seller/update', formData, token);
  }

  async getSellerInfo(sellerId: string): Promise<ApiResponse<any>> {
    return apiService.get(`/seller/get-seller-info`, { seller_id: sellerId });
  }
}

export const sellerService = new SellerService();
