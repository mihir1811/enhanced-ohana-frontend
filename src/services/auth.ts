// User and authentication API services
import { apiService, ApiResponse } from './api'

export interface User {
  id: string
  name: string
  email: string
  userName: string
  role: 'user' | 'seller' | 'admin'
  profilePicture?: string
  phone?: string
  isVerified: boolean
  isActive: boolean
  preferences: {
    newsletter: boolean
    notifications: boolean
    currency: string
    language: string
  }
  addresses: Address[]
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface Address {
  id: string
  type: 'billing' | 'shipping'
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface SellerProfile {
  id: string
  userId: string
  businessName: string
  businessType: string
  taxId?: string
  description: string
  website?: string
  certifications: string[]
  verificationStatus: 'pending' | 'verified' | 'rejected'
  rating: number
  reviewCount: number
  totalSales: number
  memberSince: string
  policies: {
    returnPolicy: string
    shippingPolicy: string
    paymentMethods: string[]
  }
}

export interface LoginCredentials {
  userName: string
  password: string
}

export interface RegisterData {
  name: string
  userName: string
  email: string
  password: string
  role?: 'user' | 'seller'
  profilePicture?: File
}

export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
  preferences?: Partial<User['preferences']>
  profilePicture?: File
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

class AuthService {
  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<{
    user: User
    accessToken: string
    refreshToken: string
  }>> {
    return apiService.post('/auth/login', credentials)
  }

  async register(data: RegisterData): Promise<ApiResponse<{
    user: User
    accessToken: string
    refreshToken: string
  }>> {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value)
      } else if (value !== undefined) {
        formData.append(key, value.toString())
      }
    })
    return apiService.upload('/auth/register', formData)
  }

  async logout(): Promise<ApiResponse<void>> {
    return apiService.post('/auth/logout')
  }

  async refreshToken(): Promise<ApiResponse<{
    accessToken: string
    refreshToken: string
  }>> {
    return apiService.post('/auth/refresh')
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiService.post('/auth/forgot-password', { email })
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return apiService.post('/auth/reset-password', { token, password })
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiService.post('/auth/verify-email', { token })
  }

  async resendVerification(): Promise<ApiResponse<void>> {
    return apiService.post('/auth/resend-verification')
  }
}

class UserService {
  // Profile management
  async getProfile(): Promise<ApiResponse<User>> {
    return apiService.get('/user/profile')
  }

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    if (data.profilePicture) {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value)
        } else if (value !== undefined) {
          formData.append(key, JSON.stringify(value))
        }
      })
      return apiService.upload('/user/profile', formData)
    }
    return apiService.put('/user/profile', data)
  }

  async changePassword(data: ChangePasswordData): Promise<ApiResponse<void>> {
    return apiService.post('/user/change-password', data)
  }

  async deleteAccount(): Promise<ApiResponse<void>> {
    return apiService.delete('/user/account')
  }

  // Address management
  async getAddresses(): Promise<ApiResponse<Address[]>> {
    return apiService.get('/user/addresses')
  }

  async createAddress(address: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    return apiService.post('/user/addresses', address)
  }

  async updateAddress(addressId: string, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return apiService.put(`/user/addresses/${addressId}`, address)
  }

  async deleteAddress(addressId: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/user/addresses/${addressId}`)
  }

  async setDefaultAddress(addressId: string, type: 'billing' | 'shipping'): Promise<ApiResponse<void>> {
    return apiService.patch(`/user/addresses/${addressId}/default`, { type })
  }

  // Wishlist
  async getWishlist(): Promise<ApiResponse<any[]>> {
    return apiService.get('/user/wishlist')
  }

  async addToWishlist(productId: string): Promise<ApiResponse<void>> {
    return apiService.post('/user/wishlist', { productId })
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/user/wishlist/${productId}`)
  }
}

class SellerService {
  // Seller profile
  async getSellerProfile(): Promise<ApiResponse<SellerProfile>> {
    return apiService.get('/seller/profile')
  }

  async updateSellerProfile(data: Partial<SellerProfile>): Promise<ApiResponse<SellerProfile>> {
    return apiService.put('/seller/profile', data)
  }

  async getSellerStats(): Promise<ApiResponse<{
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    averageRating: number
    recentOrders: any[]
    topProducts: any[]
  }>> {
    return apiService.get('/seller/stats')
  }

  // Verification
  async submitVerification(documents: File[]): Promise<ApiResponse<void>> {
    const formData = new FormData()
    documents.forEach((doc, index) => {
      formData.append(`document_${index}`, doc)
    })
    return apiService.upload('/seller/verification', formData)
  }

  async getVerificationStatus(): Promise<ApiResponse<{
    status: SellerProfile['verificationStatus']
    submittedAt?: string
    reviewedAt?: string
    notes?: string
  }>> {
    return apiService.get('/seller/verification/status')
  }
}

export const authService = new AuthService()
export const userService = new UserService()
export const sellerService = new SellerService()
export { AuthService, UserService, SellerService }
