import { BaseUser, SellerData, User } from '@/types/user'
import { apiService, ApiResponse } from './api'

export interface UserProfileUpdateData {
  name?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  profilePicture?: string
}

export interface SellerRegistrationData {
  businessName: string
  businessRegistration: string
  taxId?: string
  businessAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  businessDescription?: string
  website?: string
  specializations: string[]
}

class UserService {
  // Get user profile
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    return apiService.get(`/users/${userId}`)
  }

  // Update basic user profile
  async updateUserProfile(
    userId: string, 
    data: UserProfileUpdateData
  ): Promise<ApiResponse<User>> {
    return apiService.patch(`/users/${userId}`, data)
  }

  // Register as seller (upgrade from user to seller)
  async registerAsSeller(
    userId: string,
    sellerData: SellerRegistrationData
  ): Promise<ApiResponse<User>> {
    return apiService.post(`/users/${userId}/upgrade-to-seller`, sellerData)
  }

  // Update seller data (only for existing sellers)
  async updateSellerData(
    userId: string,
    sellerData: Partial<SellerData>
  ): Promise<ApiResponse<User>> {
    return apiService.patch(`/users/${userId}/seller-data`, sellerData)
  }

  // Get seller public profile (for other users to view)
  async getSellerProfile(sellerId: string): Promise<ApiResponse<{
    user: BaseUser
    sellerData: Omit<SellerData, 'taxId' | 'businessRegistration'>
  }>> {
    return apiService.get(`/sellers/${sellerId}/profile`)
  }

  // Get all verified sellers (public listing)
  async getVerifiedSellers(params?: {
    page?: number
    limit?: number
    specialization?: string
    location?: string
  }): Promise<ApiResponse<{
    sellers: Array<{
      user: BaseUser
      sellerData: Omit<SellerData, 'taxId' | 'businessRegistration'>
    }>
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }>> {
    return apiService.get(`/sellers`, {
      page: params?.page,
      limit: params?.limit,
      specialization: params?.specialization,
      location: params?.location,
    })
  }

  // Upload profile picture
  async uploadProfilePicture(
    userId: string,
    file: File
  ): Promise<ApiResponse<{ profilePicture: string }>> {
    const formData = new FormData()
    formData.append('profilePicture', file)
    return apiService.upload(`/users/${userId}/profile-picture`, formData)
  }

  // Verify seller account (admin only)
  async verifySellerAccount(
    sellerId: string,
    verified: boolean
  ): Promise<ApiResponse<User>> {
    return apiService.patch(`/admin/sellers/${sellerId}/verify`, { verified })
  }

  // Get user's orders (for profile page)
  async getUserOrders(
    userId: string,
    params?: {
      page?: number
      limit?: number
      status?: string
    }
  ): Promise<ApiResponse<any>> {
    return apiService.get(`/users/${userId}/orders`, {
      page: params?.page,
      limit: params?.limit,
      status: params?.status,
    })
  }

  // Get seller's sales (for seller dashboard)
  async getSellerSales(
    sellerId: string,
    params?: {
      page?: number
      limit?: number
      status?: string
      startDate?: string
      endDate?: string
    }
  ): Promise<ApiResponse<any>> {
    return apiService.get(`/sellers/${sellerId}/sales`, {
      page: params?.page,
      limit: params?.limit,
      status: params?.status,
      startDate: params?.startDate,
      endDate: params?.endDate,
    })
  }
}

export const userService = new UserService()
