import { apiService, ApiResponse } from './api'

// Product specifications interface
export interface ProductSpecifications {
  stockNumber?: string
  sellerSKU?: string
  caratWeight?: number | string
  cut?: string
  color?: string
  clarity?: string
  shape?: string
  origin?: string
  treatment?: string
  measurement?: string
  ratio?: number | string
  [key: string]: string | number | undefined
}

// Cart-related interfaces
export interface CartItem {
  id: string
  productId: string
  productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond'
  name: string
  price: number
  originalPrice?: number
  image: string
  seller: string
  certification?: string
  quantity: number
  inStock: boolean
  savings?: number
  specifications?: ProductSpecifications
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

// Raw API response interfaces
interface RawProduct {
  name?: string
  price?: string | number
  discount?: string | number
  image1?: string
  certificateNumber?: string
  isSold?: boolean
  stockNumber?: string
  sellerSKU?: string
  caratWeight?: number | string
  cut?: string
  color?: string
  clarity?: string
  shape?: string
  origin?: string
  treatment?: string
  measurement?: string
  ratio?: number | string
}

interface RawUser {
  name?: string
}

interface RawCartItem {
  id: string | number
  productId: string | number
  productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond'
  quantity: string | number
  createdAt: string
  updatedAt: string
  userId?: string | number
  product?: RawProduct
  user?: RawUser
}

export interface AddToCartData {
  productId: number
  productType: 'diamond' | 'gemstone' | 'jewellery' | 'meleeDiamond'
  quantity: number
  specifications?: ProductSpecifications
}

export interface UpdateCartItemData {
  quantity: number
  specifications?: ProductSpecifications
}

class CartService {
  // Get user's cart
  async getCart(token: string): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.get('/cart', {}, token)
      
      if (response.success && Array.isArray(response.data)) {
        // Helper to sanitize URLs coming with stray quotes/backticks
        const sanitizeUrl = (url?: string | null): string => {
          if (!url) return ''
          return String(url).replace(/[`"\s]/g, '')
        }

        // Transform the API response to match our Cart interface
        const cartItems: CartItem[] = response.data.map((item: RawCartItem) => {
          const product = item.product || {}
          const priceNum = parseFloat(String(product.price ?? '0'))
          const discountRaw = product.discount ?? '0'
          const discountNum = typeof discountRaw === 'string' ? parseFloat(discountRaw) : Number(discountRaw) || 0
          const effectivePrice = isNaN(priceNum) ? 0 : Math.max(0, priceNum - (isNaN(discountNum) ? 0 : discountNum))
          const originalPrice = isNaN(priceNum) ? undefined : priceNum
          const savings = originalPrice !== undefined ? Math.max(0, priceNum - effectivePrice) : undefined

          return {
            id: String(item.id),
            productId: String(item.productId),
            productType: item.productType,
            name: product.name ?? 'Unknown Product',
            price: effectivePrice,
            originalPrice,
            image: sanitizeUrl(product.image1),
            seller: item.user?.name || 'Unknown Seller',
            certification: product.certificateNumber || undefined,
            quantity: Number(item.quantity) || 1,
            inStock: !product.isSold,
            savings,
            specifications: {
              stockNumber: product.stockNumber,
              sellerSKU: product.sellerSKU,
              caratWeight: product.caratWeight,
              cut: product.cut,
              color: product.color,
              clarity: product.clarity,
              shape: product.shape,
              origin: product.origin,
              treatment: product.treatment,
              measurement: product.measurement,
              ratio: product.ratio,
            },
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }
        })

        // Calculate cart totals
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const totalSavings = cartItems.reduce((sum, item) => sum + ((item.savings || 0) * item.quantity), 0)
        const shipping = subtotal > 1000 ? 0 : 50 // Free shipping over $1000
        const tax = subtotal * 0.1 // 10% tax
        const total = subtotal + shipping + tax

        const cart: Cart = {
          id: 'user-cart',
          userId: response.data[0]?.userId?.toString?.() || '',
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
    return apiService.post('/cart/add', data, token)
  }

  // Update cart item quantity
  async updateCartItem(itemId: string, data: UpdateCartItemData, token: string): Promise<ApiResponse<CartItem>> {
    const payload = {
      cartId: Number(itemId),
      quantity: Number(data.quantity)
    }
    return apiService.put('/cart/update', payload, token)
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