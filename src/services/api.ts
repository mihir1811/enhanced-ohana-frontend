// Central API service configuration
import { API_CONFIG } from '../lib/constants'

const API_BASE_URL = API_CONFIG.BASE_URL

export interface ApiResponse<T = unknown> {
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
    filters?: Record<string, unknown>
  }
}

/** Error with HTTP status for API failures */
export interface ApiError extends Error {
  status?: number
}

function createApiError(message: string, status?: number): ApiError {
  const error = new Error(message) as ApiError
  error.status = status
  return error
}

class ApiService {
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
        throw createApiError(data.message || `HTTP error! status: ${response.status}`, response.status)
      }

      return data
    } catch (error) {
      throw error
    }
  }

  // File upload with PATCH
  async uploadPatch<T>(endpoint: string, formData: FormData, token?: string): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      method: 'PATCH',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        throw createApiError(data.message || `HTTP error! status: ${response.status}`, response.status)
      }

      return data
    } catch (error) {
      throw error
    }
  }

  // Generic CRUD operations
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>, token?: string): Promise<ApiResponse<T>> {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString() : ''
    return this.request<T>(`${endpoint}${queryString}`, {}, token)
  }

  async post<T>(endpoint: string, data?: Record<string, unknown> | unknown[], token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token)
  }

  async put<T>(endpoint: string, data?: Record<string, unknown> | unknown[], token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token)
  }

  async patch<T>(endpoint: string, data?: Record<string, unknown> | unknown[], token?: string): Promise<ApiResponse<T>> {
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

  async deleteWithBody<T>(endpoint: string, data: Record<string, unknown> | unknown[], token?: string): Promise<ApiResponse<T>> {
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
      const text = await response.text()
      let data: ApiResponse<T>
      try {
        data = text ? JSON.parse(text) : { success: false, message: 'Empty response', data: null as T }
      } catch {
        throw createApiError(
          response.status === 500
            ? 'Server error. Please try again or contact support.'
            : `Request failed (${response.status})`,
          response.status
        )
      }

      if (!response.ok) {
        throw createApiError(data.message || `HTTP error! status: ${response.status}`, response.status)
      }

      return data
    } catch (error) {
      throw error
    }
  }
}

export const apiService = new ApiService(API_BASE_URL)
export default apiService
