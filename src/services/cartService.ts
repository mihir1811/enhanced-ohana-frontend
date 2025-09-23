import { apiService, ApiResponse } from './api'

// Cart-related interfaces
export interface CartItem {
  id: string
  productId: string
  productType: 'diamond' | 'gemstone' | 'jewelry'
  name: string
  price: number
  originalPrice?: number
  image: string
  seller: string
  certification?: string
  quantity: number
  inStock: boolean
  savings?: number
  specifications?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  totalSavings: number
  shipping: number
  tax: number
  total: number
  itemCount: number
  createdAt: string
  updatedAt: string
}

export interface AddToCartData {
  productId: string
  productType: 'diamond' | 'gemstone' | 'jewelry'
  quantity: number
  specifications?: Record<string, any>
}

export interface UpdateCartItemData {
  quantity: number
  specifications?: Record<string, any>
}

class CartService {
  // Get user's cart
  async getCart(token: string): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.get('/cart', {}, token)
      
      if (response.success && Array.isArray(response.data)) {
        // Transform the API response to match our Cart interface
        const cartItems: CartItem[] = response.data.map((item: any) => ({
          id: item.id.toString(),
          productId: item.productId.toString(),
          productType: item.productType === 'jewellery' ? 'jewelry' : item.productType,
          name: item.product.name,
          price: item.product.totalPrice,
          originalPrice: item.product.basePrice + item.product.makingCharge,
          image: item.product.image1?.trim() || '',
          seller: item.user?.name || 'Unknown Seller',
          certification: item.product.attributes?.certification || undefined,
          quantity: item.quantity,
          inStock: !item.product.isSold,
          savings: (item.product.basePrice + item.product.makingCharge) - item.product.totalPrice,
          specifications: item.product.attributes || {},
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }))

        // Calculate cart totals
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const totalSavings = cartItems.reduce((sum, item) => sum + ((item.savings || 0) * item.quantity), 0)
        const shipping = subtotal > 1000 ? 0 : 50 // Free shipping over $1000
        const tax = subtotal * 0.1 // 10% tax
        const total = subtotal + shipping + tax

        const cart: Cart = {
          id: 'user-cart',
          userId: cartItems[0]?.productId || '',
          items: cartItems,
          subtotal,
          totalSavings,
          shipping,
          tax,
          total,
          itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        return {
          success: true,
          data: cart,
          message: 'Cart loaded successfully'
        }
      }
      
      // Return empty cart if response is not successful or data is not an array
      const emptyCart: Cart = {
        id: 'user-cart',
        userId: '',
        items: [],
        subtotal: 0,
        totalSavings: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return {
        success: false,
        message: response.message || 'Cart is empty',
        data: emptyCart
      }
    } catch (error) {
      // Return empty cart structure for error cases
      const emptyCart: Cart = {
        id: 'user-cart',
        userId: '',
        items: [],
        subtotal: 0,
        totalSavings: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to load cart',
        data: emptyCart
      }
    }
  }

  // Add item to cart
  async addToCart(data: AddToCartData, token: string): Promise<ApiResponse<CartItem>> {
    return apiService.post('/cart/items', data, token)
  }

  // Update cart item quantity
  async updateCartItem(itemId: string, data: UpdateCartItemData, token: string): Promise<ApiResponse<CartItem>> {
    return apiService.patch(`/cart/items/${itemId}`, data, token)
  }

  // Remove item from cart
  async removeFromCart(itemId: string, token: string): Promise<ApiResponse<void>> {
    return apiService.deleteWithBody('/cart/remove', { cartId: parseInt(itemId) }, token)
  }

  // Clear entire cart
  async clearCart(token: string): Promise<ApiResponse<void>> {
    return apiService.delete('/cart', token)
  }

  // Move item to wishlist
  async moveToWishlist(itemId: string, token: string): Promise<ApiResponse<void>> {
    return apiService.post(`/cart/items/${itemId}/move-to-wishlist`, {}, token)
  }
}

export const cartService = new CartService()
export default cartService