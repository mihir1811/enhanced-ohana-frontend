// File upload with PUT
// Central API service configuration
import { API_CONFIG } from '../lib/constants'

const API_BASE_URL = API_CONFIG.BASE_URL

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    filters?: Record<string, any>
  }
}

class ApiService {
  // File upload with PATCH
  async uploadPatch<T>(endpoint: string, formData: FormData, token?: string): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      method: 'PATCH',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized errors specifically
        if (response.status === 401) {
          console.log('not logged in');
          console.error('Authentication required: User is not logged in or token is invalid');
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // Check if it's a 401 error in the catch block as well
      if (error instanceof Error && error.message.includes('401')) {
        console.log('not logged in');
        console.error('Authentication required: User is not logged in or token is invalid');
      }
      
      console.error('Upload PATCH Error:', error);
      throw error;
    }
  }
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        // Handle 401 Unauthorized errors specifically
        if (response.status === 401) {
          console.log('not logged in')
          console.error('Authentication required: User is not logged in or token is invalid')
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      // Check if it's a 401 error in the catch block as well
      if (error instanceof Error && error.message.includes('401')) {
        console.log('not logged in')
        console.error('Authentication required: User is not logged in or token is invalid')
      }
      
      console.error('API Request Error:', error)
      throw error
    }
  }

  // Generic CRUD operations
  async get<T>(endpoint: string, params?: Record<string, any>, token?: string): Promise<ApiResponse<T>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return this.request<T>(`${endpoint}${queryString}`, {}, token)
  }

  async post<T>(endpoint: string, data?: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token)
  }

  async put<T>(endpoint: string, data?: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token)
  }

  async patch<T>(endpoint: string, data?: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token)
  }

  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    }, token)
  }

  async deleteWithBody<T>(endpoint: string, data: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: JSON.stringify(data),
    }, token)
  }

  // File upload
  async upload<T>(endpoint: string, formData: FormData, token?: string): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        // Handle 401 Unauthorized errors specifically
        if (response.status === 401) {
          console.log('not logged in')
          console.error('Authentication required: User is not logged in or token is invalid')
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      // Check if it's a 401 error in the catch block as well
      if (error instanceof Error && error.message.includes('401')) {
        console.log('not logged in')
        console.error('Authentication required: User is not logged in or token is invalid')
      }
      
      console.error('Upload Error:', error)
      throw error
    }
  }
}

export const apiService = new ApiService(API_BASE_URL)
export default apiService
