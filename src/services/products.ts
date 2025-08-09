// Product-related API services
import { apiService, ApiResponse } from './api'

export interface Product {
  id: string
  name: string
  description: string
  category: 'diamond' | 'gemstone' | 'jewelry'
  subcategory: string
  price: number
  images: string[]
  specifications: {
    carat?: number
    clarity?: string
    color?: string
    cut?: string
    certification?: string
    origin?: string
    treatment?: string
    dimensions?: {
      length: number
      width: number
      height: number
    }
  }
  seller: {
    id: string
    name: string
    rating: number
    verified: boolean
  }
  status: 'active' | 'sold' | 'reserved' | 'pending'
  createdAt: string
  updatedAt: string
  views: number
  favorites: number
  inventory: {
    quantity: number
    sku: string
    location: string
  }
}

export interface ProductFilters {
  category?: string
  subcategory?: string
  priceMin?: number
  priceMax?: number
  caratMin?: number
  caratMax?: number
  clarity?: string[]
  color?: string[]
  cut?: string[]
  certification?: string[]
  sellerId?: string
  status?: string
  search?: string
  sortBy?: 'price' | 'carat' | 'date' | 'popularity'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface CreateProductData {
  name: string
  description: string
  category: Product['category']
  subcategory: string
  price: number
  specifications: Product['specifications']
  inventory: {
    quantity: number
    sku: string
    location: string
  }
}

class ProductService {
  // Get all products with filters
  async getProducts(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    return apiService.get('/products', filters)
  }

  // Get single product by ID
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiService.get(`/products/${id}`)
  }

  // Create new product (seller only)
  async createProduct(productData: CreateProductData): Promise<ApiResponse<Product>> {
    return apiService.post('/products', productData)
  }

  // Update product (seller only)
  async updateProduct(id: string, productData: Partial<CreateProductData>): Promise<ApiResponse<Product>> {
    return apiService.put(`/products/${id}`, productData)
  }

  // Delete product (seller only)
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/products/${id}`)
  }

  // Get seller's products
  async getSellerProducts(sellerId?: string, filters?: Omit<ProductFilters, 'sellerId'>): Promise<ApiResponse<Product[]>> {
    const endpoint = sellerId ? `/sellers/${sellerId}/products` : '/seller/products'
    return apiService.get(endpoint, filters)
  }

  // Upload product images
  async uploadProductImages(productId: string, images: File[]): Promise<ApiResponse<string[]>> {
    const formData = new FormData()
    images.forEach((image, index) => {
      formData.append(`images`, image)
    })
    return apiService.upload(`/products/${productId}/images`, formData)
  }

  // Search products
  async searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>): Promise<ApiResponse<Product[]>> {
    return apiService.get('/products/search', { search: query, ...filters })
  }

  // Get product recommendations
  async getRecommendations(productId: string): Promise<ApiResponse<Product[]>> {
    return apiService.get(`/products/${productId}/recommendations`)
  }

  // Get trending products
  async getTrendingProducts(): Promise<ApiResponse<Product[]>> {
    return apiService.get('/products/trending')
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
    return apiService.get(`/products/category/${category}`)
  }

  // Add to favorites
  async addToFavorites(productId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/products/${productId}/favorite`)
  }

  // Remove from favorites
  async removeFromFavorites(productId: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/products/${productId}/favorite`)
  }

  // Get user favorites
  async getFavorites(): Promise<ApiResponse<Product[]>> {
    return apiService.get('/user/favorites')
  }

  // Track product view
  async trackView(productId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/products/${productId}/view`)
  }
}

export const productService = new ProductService()
export default productService
