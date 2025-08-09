import { BaseUser, SellerData, User } from '../features/auth/authSlice'
import { ApiResponse } from './api'

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
    const response = await fetch(`/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }

    return response.json()
  }

  // Update basic user profile
  async updateUserProfile(
    userId: string, 
    data: UserProfileUpdateData
  ): Promise<ApiResponse<User>> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to update user profile')
    }

    return response.json()
  }

  // Register as seller (upgrade from user to seller)
  async registerAsSeller(
    userId: string,
    sellerData: SellerRegistrationData
  ): Promise<ApiResponse<User>> {
    const response = await fetch(`/api/users/${userId}/upgrade-to-seller`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(sellerData),
    })

    if (!response.ok) {
      throw new Error('Failed to register as seller')
    }

    return response.json()
  }

  // Update seller data (only for existing sellers)
  async updateSellerData(
    userId: string,
    sellerData: Partial<SellerData>
  ): Promise<ApiResponse<User>> {
    const response = await fetch(`/api/users/${userId}/seller-data`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(sellerData),
    })

    if (!response.ok) {
      throw new Error('Failed to update seller data')
    }

    return response.json()
  }

  // Get seller public profile (for other users to view)
  async getSellerProfile(sellerId: string): Promise<ApiResponse<{
    user: BaseUser
    sellerData: Omit<SellerData, 'taxId' | 'businessRegistration'>
  }>> {
    const response = await fetch(`/api/sellers/${sellerId}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch seller profile')
    }

    return response.json()
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
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.specialization) queryParams.append('specialization', params.specialization)
    if (params?.location) queryParams.append('location', params.location)

    const response = await fetch(`/api/sellers?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch sellers')
    }

    return response.json()
  }

  // Upload profile picture
  async uploadProfilePicture(
    userId: string,
    file: File
  ): Promise<ApiResponse<{ profilePicture: string }>> {
    const formData = new FormData()
    formData.append('profilePicture', file)

    const response = await fetch(`/api/users/${userId}/profile-picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload profile picture')
    }

    return response.json()
  }

  // Verify seller account (admin only)
  async verifySellerAccount(
    sellerId: string,
    verified: boolean
  ): Promise<ApiResponse<User>> {
    const response = await fetch(`/api/admin/sellers/${sellerId}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ verified }),
    })

    if (!response.ok) {
      throw new Error('Failed to verify seller account')
    }

    return response.json()
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
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)

    const response = await fetch(`/api/users/${userId}/orders?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user orders')
    }

    return response.json()
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
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const response = await fetch(`/api/sellers/${sellerId}/sales?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch seller sales')
    }

    return response.json()
  }
}

export const userService = new UserService()
