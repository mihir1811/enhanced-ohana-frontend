// Cart API services
import { apiService, ApiResponse } from './api'
import { CartItem } from '@/features/cart/cartSlice'

export interface CartResponse {
  items: CartItem[]
  totals: {
    subtotal: number
    savings: number
    tax: number
    shipping: number
    total: number
  }
  itemCount: number
}

export interface AddToCartData {
  productId: string
  quantity: number
  specifications?: Record<string, any>
}

export interface PromoCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minOrder?: number
  expiresAt?: string
}

class CartService {
  // Get cart contents
  async getCart(): Promise<ApiResponse<CartResponse>> {
    return apiService.get('/cart')
  }

  // Add item to cart
  async addToCart(data: AddToCartData): Promise<ApiResponse<CartItem>> {
    return apiService.post('/cart/add', data)
  }

  // Update cart item quantity
  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<CartItem>> {
    return apiService.put(`/cart/items/${itemId}`, { quantity })
  }

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/cart/items/${itemId}`)
  }

  // Clear entire cart
  async clearCart(): Promise<ApiResponse<void>> {
    return apiService.delete('/cart/clear')
  }

  // Move item to wishlist
  async moveToWishlist(itemId: string): Promise<ApiResponse<void>> {
    return apiService.post(`/cart/items/${itemId}/move-to-wishlist`)
  }

  // Apply promo code
  async applyPromoCode(code: string): Promise<ApiResponse<{
    discount: number
    newTotal: number
    promoCode: PromoCode
  }>> {
    return apiService.post('/cart/promo-code', { code })
  }

  // Remove promo code
  async removePromoCode(): Promise<ApiResponse<{ newTotal: number }>> {
    return apiService.delete('/cart/promo-code')
  }

  // Get shipping options
  async getShippingOptions(address: {
    country: string
    state: string
    zipCode: string
  }): Promise<ApiResponse<Array<{
    id: string
    name: string
    price: number
    estimatedDays: number
    description: string
  }>>> {
    return apiService.post('/cart/shipping-options', address)
  }

  // Save for later (guest checkout)
  async saveCartForLater(email: string): Promise<ApiResponse<{ token: string }>> {
    return apiService.post('/cart/save-for-later', { email })
  }

  // Restore saved cart
  async restoreCart(token: string): Promise<ApiResponse<CartResponse>> {
    return apiService.post('/cart/restore', { token })
  }
}

export const cartService = new CartService()
export default cartService
