import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { orderService, Order, OrderFilters, CreateOrderData } from '@/services/orders'

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  userOrders: Order[]
  sellerOrders: Order[]
  orderStats: {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    statusBreakdown: Record<Order['status'], number>
    revenueByDate: Array<{ date: string; revenue: number }>
  } | null
  filters: OrderFilters
  loading: {
    orders: boolean
    currentOrder: boolean
    userOrders: boolean
    sellerOrders: boolean
    stats: boolean
    creating: boolean
    updating: boolean
  }
  error: string | null
  pagination: {
    page: number
    totalPages: number
    total: number
    limit: number
  }
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  userOrders: [],
  sellerOrders: [],
  orderStats: null,
  filters: {
    page: 1,
    limit: 20,
    sortBy: 'date',
    sortOrder: 'desc'
  },
  loading: {
    orders: false,
    currentOrder: false,
    userOrders: false,
    sellerOrders: false,
    stats: false,
    creating: false,
    updating: false
  },
  error: null,
  pagination: {
    page: 1,
    totalPages: 0,
    total: 0,
    limit: 20
  }
}

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (filters?: OrderFilters) => {
    const response = await orderService.getOrders(filters)
    return response
  }
)

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (orderId: string) => {
    const response = await orderService.getOrder(orderId)
    return response
  }
)

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (filters?: Omit<OrderFilters, 'customerId'>) => {
    const response = await orderService.getUserOrders(filters)
    return response
  }
)

export const fetchSellerOrders = createAsyncThunk(
  'orders/fetchSellerOrders',
  async (filters?: OrderFilters) => {
    const response = await orderService.getSellerOrders(filters)
    return response
  }
)

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: CreateOrderData) => {
    const response = await orderService.createOrder(orderData)
    return response
  }
)

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status, notes }: { orderId: string; status: Order['status']; notes?: string }) => {
    const response = await orderService.updateOrderStatus(orderId, status, notes)
    return response
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId, reason }: { orderId: string; reason?: string }) => {
    const response = await orderService.cancelOrder(orderId, reason)
    return response
  }
)

export const addTracking = createAsyncThunk(
  'orders/addTracking',
  async ({ orderId, trackingNumber, carrier }: { orderId: string; trackingNumber: string; carrier: string }) => {
    const response = await orderService.addTracking(orderId, trackingNumber, carrier)
    return response
  }
)

export const fetchOrderStats = createAsyncThunk(
  'orders/fetchOrderStats',
  async ({ dateFrom, dateTo }: { dateFrom?: string; dateTo?: string } = {}) => {
    const response = await orderService.getOrderStats(dateFrom, dateTo)
    return response
  }
)

export const processRefund = createAsyncThunk(
  'orders/processRefund',
  async ({ orderId, amount, reason }: { orderId: string; amount: number; reason: string }) => {
    const response = await orderService.processRefund(orderId, amount, reason)
    return response
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<OrderFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    updateOrderInList: (state, action: PayloadAction<Order>) => {
      const updateOrderInArray = (orders: Order[], updatedOrder: Order) => {
        const index = orders.findIndex(o => o.id === updatedOrder.id)
        if (index !== -1) {
          orders[index] = updatedOrder
        }
      }

      updateOrderInArray(state.orders, action.payload)
      updateOrderInArray(state.userOrders, action.payload)
      updateOrderInArray(state.sellerOrders, action.payload)

      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload
      }
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading.orders = false
        state.orders = action.payload.data
        if (action.payload.meta?.pagination) {
          state.pagination = action.payload.meta.pagination
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading.orders = false
        state.error = action.error.message || 'Failed to fetch orders'
      })

    // Fetch Single Order
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading.currentOrder = true
        state.error = null
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading.currentOrder = false
        state.currentOrder = action.payload.data
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading.currentOrder = false
        state.error = action.error.message || 'Failed to fetch order'
      })

    // Fetch User Orders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading.userOrders = true
        state.error = null
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading.userOrders = false
        state.userOrders = action.payload.data
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading.userOrders = false
        state.error = action.error.message || 'Failed to fetch user orders'
      })

    // Fetch Seller Orders
    builder
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading.sellerOrders = true
        state.error = null
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading.sellerOrders = false
        state.sellerOrders = action.payload.data
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading.sellerOrders = false
        state.error = action.error.message || 'Failed to fetch seller orders'
      })

    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading.creating = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading.creating = false
        state.userOrders.unshift(action.payload.data)
        state.currentOrder = action.payload.data
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading.creating = false
        state.error = action.error.message || 'Failed to create order'
      })

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading.updating = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading.updating = false
        orderSlice.caseReducers.updateOrderInList(state, { payload: action.payload.data, type: 'updateOrderInList' })
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading.updating = false
        state.error = action.error.message || 'Failed to update order status'
      })

    // Cancel Order
    builder
      .addCase(cancelOrder.fulfilled, (state, action) => {
        orderSlice.caseReducers.updateOrderInList(state, { payload: action.payload.data, type: 'updateOrderInList' })
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to cancel order'
      })

    // Add Tracking
    builder
      .addCase(addTracking.fulfilled, (state, action) => {
        orderSlice.caseReducers.updateOrderInList(state, { payload: action.payload.data, type: 'updateOrderInList' })
      })
      .addCase(addTracking.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add tracking'
      })

    // Fetch Order Stats
    builder
      .addCase(fetchOrderStats.pending, (state) => {
        state.loading.stats = true
        state.error = null
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.loading.stats = false
        state.orderStats = action.payload.data
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.loading.stats = false
        state.error = action.error.message || 'Failed to fetch order statistics'
      })

    // Process Refund
    builder
      .addCase(processRefund.fulfilled, (state, action) => {
        orderSlice.caseReducers.updateOrderInList(state, { payload: action.payload.data, type: 'updateOrderInList' })
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to process refund'
      })
  }
})

export const { 
  setFilters, 
  clearFilters, 
  clearCurrentOrder, 
  updateOrderInList,
  clearError 
} = orderSlice.actions

export default orderSlice.reducer
