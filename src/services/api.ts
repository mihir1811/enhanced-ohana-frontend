  // File upload with PUT
// Central API service configuration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

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
  // PUT with FormData
  async uploadPut<T>(endpoint: string, formData: FormData, token?: string): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Upload PUT Error:', error);
      throw error;
    }
  }
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
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
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
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
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
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Upload Error:', error)
      throw error
    }
  }

  // Download blob helper
  async getBlob(endpoint: string, token?: string): Promise<Blob> {
    const config: RequestInit = {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config)
    if (!response.ok) {
      let message = `HTTP error! status: ${response.status}`
      try {
        const data = await response.json()
        message = data?.message || message
      } catch {}
      throw new Error(message)
    }
    return response.blob()
  }
}

export const apiService = new ApiService(API_BASE_URL)
export default apiService
