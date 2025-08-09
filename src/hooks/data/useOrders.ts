import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState, AppDispatch } from '@/store'
import {
  fetchOrders,
  fetchOrder,
  fetchUserOrders,
  fetchSellerOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  addTracking,
  fetchOrderStats,
  processRefund,
  setFilters,
  clearFilters,
  clearCurrentOrder,
  clearError
} from '@/features/orders/orderSlice'
import { OrderFilters, CreateOrderData, Order } from '@/services/orders'

export const useOrders = () => {
  const dispatch = useDispatch<AppDispatch>()
  const orderState = useSelector((state: RootState) => state.orders)

  const loadOrders = useCallback((filters?: OrderFilters) => {
    dispatch(fetchOrders(filters))
  }, [dispatch])

  const loadOrder = useCallback((orderId: string) => {
    dispatch(fetchOrder(orderId))
  }, [dispatch])

  const loadUserOrders = useCallback((filters?: Omit<OrderFilters, 'customerId'>) => {
    dispatch(fetchUserOrders(filters))
  }, [dispatch])

  const loadSellerOrders = useCallback((filters?: OrderFilters) => {
    dispatch(fetchSellerOrders(filters))
  }, [dispatch])

  const createNewOrder = useCallback((orderData: CreateOrderData) => {
    return dispatch(createOrder(orderData))
  }, [dispatch])

  const updateStatus = useCallback((orderId: string, status: Order['status'], notes?: string) => {
    dispatch(updateOrderStatus({ orderId, status, notes }))
  }, [dispatch])

  const cancelOrderAction = useCallback((orderId: string, reason?: string) => {
    dispatch(cancelOrder({ orderId, reason }))
  }, [dispatch])

  const addTrackingInfo = useCallback((orderId: string, trackingNumber: string, carrier: string) => {
    dispatch(addTracking({ orderId, trackingNumber, carrier }))
  }, [dispatch])

  const loadOrderStats = useCallback((dateFrom?: string, dateTo?: string) => {
    dispatch(fetchOrderStats({ dateFrom, dateTo }))
  }, [dispatch])

  const refundOrder = useCallback((orderId: string, amount: number, reason: string) => {
    dispatch(processRefund({ orderId, amount, reason }))
  }, [dispatch])

  const updateFilters = useCallback((filters: Partial<OrderFilters>) => {
    dispatch(setFilters(filters))
  }, [dispatch])

  const resetFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  const clearOrder = useCallback(() => {
    dispatch(clearCurrentOrder())
  }, [dispatch])

  const clearOrderError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    // State
    orders: orderState.orders,
    currentOrder: orderState.currentOrder,
    userOrders: orderState.userOrders,
    sellerOrders: orderState.sellerOrders,
    orderStats: orderState.orderStats,
    filters: orderState.filters,
    loading: orderState.loading,
    error: orderState.error,
    pagination: orderState.pagination,

    // Actions
    loadOrders,
    loadOrder,
    loadUserOrders,
    loadSellerOrders,
    createNewOrder,
    updateStatus,
    cancelOrder: cancelOrderAction,
    addTrackingInfo,
    loadOrderStats,
    refundOrder,
    updateFilters,
    resetFilters,
    clearOrder,
    clearOrderError
  }
}

export default useOrders
