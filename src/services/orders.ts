// Order management API services
import { apiService, ApiResponse } from './api'
import { Product } from './products'

export interface OrderItem {
  id: string
  productId: string
  product: Pick<Product, 'id' | 'name' | 'images' | 'category' | 'seller'>
  quantity: number
  price: number
  specifications: Record<string, any>
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer: {
    id: string
    name: string
    email: string
    phone?: string
    address: Address
  }
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  estimatedDelivery?: string
  notes?: string
  createdAt: string
  updatedAt: string
  timeline: OrderTimeline[]
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault?: boolean
}

export interface OrderTimeline {
  id: string
  status: Order['status']
  message: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface CreateOrderData {
  items: {
    productId: string
    quantity: number
    specifications?: Record<string, any>
  }[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  notes?: string
}

export interface OrderFilters {
  status?: Order['status']
  paymentStatus?: Order['paymentStatus']
  customerId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  sortBy?: 'date' | 'total' | 'status'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

class OrderService {
  // Get all orders (admin/seller view)
  async getOrders(filters?: OrderFilters): Promise<ApiResponse<Order[]>> {
    return apiService.get('/orders', filters)
  }

  // Get single order
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiService.get(`/orders/${orderId}`)
  }

  // Create new order
  async createOrder(orderData: CreateOrderData): Promise<ApiResponse<Order>> {
    return apiService.post('/orders', orderData)
  }

  // Update order status (seller/admin only)
  async updateOrderStatus(orderId: string, status: Order['status'], notes?: string): Promise<ApiResponse<Order>> {
    return apiService.patch(`/orders/${orderId}/status`, { status, notes })
  }

  // Cancel order
  async cancelOrder(orderId: string, reason?: string): Promise<ApiResponse<Order>> {
    return apiService.patch(`/orders/${orderId}/cancel`, { reason })
  }

  // Get user's orders
  async getUserOrders(filters?: Omit<OrderFilters, 'customerId'>): Promise<ApiResponse<Order[]>> {
    return apiService.get('/user/orders', filters)
  }

  // Get seller's orders
  async getSellerOrders(filters?: OrderFilters): Promise<ApiResponse<Order[]>> {
    return apiService.get('/seller/orders', filters)
  }

  // Add tracking information
  async addTracking(orderId: string, trackingNumber: string, carrier: string): Promise<ApiResponse<Order>> {
    return apiService.patch(`/orders/${orderId}/tracking`, { trackingNumber, carrier })
  }

  // Get order timeline
  async getOrderTimeline(orderId: string): Promise<ApiResponse<OrderTimeline[]>> {
    return apiService.get(`/orders/${orderId}/timeline`)
  }

  // Process refund
  async processRefund(orderId: string, amount: number, reason: string): Promise<ApiResponse<Order>> {
    return apiService.post(`/orders/${orderId}/refund`, { amount, reason })
  }

  // Get order statistics
  async getOrderStats(dateFrom?: string, dateTo?: string): Promise<ApiResponse<{
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    statusBreakdown: Record<Order['status'], number>
    revenueByDate: Array<{ date: string; revenue: number }>
  }>> {
    return apiService.get('/orders/stats', { dateFrom, dateTo })
  }

  // Download order invoice
  async downloadInvoice(orderId: string, token?: string): Promise<Blob> {
    return apiService.getBlob(`/orders/${orderId}/invoice`, token)
  }
}

export const orderService = new OrderService()
export default orderService
