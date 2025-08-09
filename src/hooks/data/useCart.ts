import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { RootState, AppDispatch } from '@/store'
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCartWithServer,
  updateQuantity,
  removeItem,
  clearCartLocal,
  moveToWishlist,
  applyPromoCode,
  clearError
} from '@/features/cart/cartSlice'

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>()
  const cartState = useSelector((state: RootState) => state.cart)

  // Sync cart with server on mount
  useEffect(() => {
    dispatch(syncCartWithServer())
  }, [dispatch])

  const addItem = useCallback(async (productId: string, quantity = 1, specifications?: Record<string, any>) => {
    return dispatch(addToCart({ productId, quantity, specifications }))
  }, [dispatch])

  const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeItem(itemId))
    } else {
      dispatch(updateQuantity({ itemId, quantity }))
      // Also sync with server
      dispatch(updateCartItem({ itemId, quantity }))
    }
  }, [dispatch])

  const removeItemFromCart = useCallback((itemId: string) => {
    dispatch(removeItem(itemId))
    dispatch(removeFromCart(itemId))
  }, [dispatch])

  const clearCartItems = useCallback(() => {
    dispatch(clearCartLocal())
    dispatch(clearCart())
  }, [dispatch])

  const moveItemToWishlist = useCallback((itemId: string) => {
    dispatch(moveToWishlist(itemId))
    // In real app, would also call wishlist API
  }, [dispatch])

  const applyPromo = useCallback((code: string, discount: number) => {
    dispatch(applyPromoCode({ code, discount }))
  }, [dispatch])

  const clearCartError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const getItemCount = useCallback(() => {
    return cartState.items.reduce((total: number, item: any) => total + item.quantity, 0)
  }, [cartState.items])

  const getItemByProductId = useCallback((productId: string) => {
    return cartState.items.find((item: any) => item.productId === productId)
  }, [cartState.items])

  const isInCart = useCallback((productId: string) => {
    return cartState.items.some((item: any) => item.productId === productId)
  }, [cartState.items])

  return {
    // State
    items: cartState.items,
    loading: cartState.loading,
    error: cartState.error,
    totals: cartState.totals,
    
    // Computed values
    itemCount: getItemCount(),
    isEmpty: cartState.items.length === 0,
    
    // Actions
    addItem,
    updateItemQuantity,
    removeItemFromCart,
    clearCartItems,
    moveItemToWishlist,
    applyPromo,
    clearCartError,
    
    // Utilities
    getItemByProductId,
    isInCart
  }
}

export default useCart
