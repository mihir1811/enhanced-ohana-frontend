// User profile and settings API service
import { API_CONFIG } from '../lib/constants';

// User API service for handling user profile operations

export interface UpdateUserRequest {
  userName?: string  // ✅ Supported by API
  phone?: string     // ✅ Supported by API
  // Note: The following fields are kept for future use but not currently sent to API
  name?: string      // ❌ Not currently sent to API
  address?: {        // ❌ Not currently sent to API
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface UserData {
  id?: string;
  sub?: string;
  name?: string;
  email?: string;
  userName?: string;
  phone?: string;
  role?: 'user' | 'seller' | 'admin';
  profilePicture?: string;
  isDeleted?: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  socketId?: string;
  createdAt?: string;
  updatedAt?: string;
  seller?: {
    id: string;
    sellerType: string;
  };
  iat?: number;
  exp?: number;
}

export interface UserUpdateResponse {
  success: boolean
  message: string
  data?: UserData
}

class UserService {
  private baseURL = API_CONFIG.BASE_URL.replace('/api/v1', '') // Remove /api/v1 since it's added in endpoints
  
  private getAuthHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  async updateUserInfo(updateData: UpdateUserRequest, token: string): Promise<UserUpdateResponse> {
    try {
      // Log the data being sent to match the curl example
      console.log('Sending user update data:', JSON.stringify(updateData, null, 2))
      
      const response = await fetch(`${this.baseURL}/user/info`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        message: 'User information updated successfully',
        data
      }
    } catch (error) {
      console.error('Error updating user info:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user information'
      }
    }
  }

  async getUserProfile(token: string): Promise<UserUpdateResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/user/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(token)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        message: 'User profile fetched successfully',
        data
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch user profile'
      }
    }
  }

  async updateProfilePicture(profilePicture: File, token: string): Promise<UserUpdateResponse> {
    try {
      const formData = new FormData()
      formData.append('profilePicture', profilePicture)

      const response = await fetch(`${this.baseURL}/api/v1/user/profile-picture`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        message: 'Profile picture updated successfully',
        data
      }
    } catch (error) {
      console.error('Error updating profile picture:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile picture'
      }
    }
  }
}

export const userService = new UserService()
export default userService
