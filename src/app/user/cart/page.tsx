'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Minus, Plus, Trash2, Heart, ShoppingBag, ArrowRight, Shield, Truck, Loader2 } from 'lucide-react'
import { cartService, Cart, CartItem } from '@/services'
import { RootState } from '@/store'

export default function UserCartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  // Get authentication token from Redux store
  const { token } = useSelector((state: RootState) => state.auth)

  // Load cart data on component mount
  useEffect(() => {
    loadCart()
  }, [token])

  const loadCart = async () => {
    if (!token) {
      setError('Please log in to view your cart')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await cartService.getCart(token)
      
      if (response.success) {
        setCart(response.data)
      } else {
        setError(response.message || 'Failed to load cart')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, change: number) => {
    if (!token || !cart) return

    const item = cart.items.find(item => item.id === itemId)
    if (!item) return

    const newQuantity = Math.max(1, item.quantity + change)
    if (newQuantity === item.quantity) return

    try {
      setActionLoading(itemId)
      const response = await cartService.updateCartItem(
        itemId, 
        { quantity: newQuantity }, 
        token
      )
      
      if (response.success) {
        // Reload cart to get updated data
        await loadCart()
      } else {
        setError(response.message || 'Failed to update quantity')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity')
    } finally {
      setActionLoading(null)
    }
  }

  const removeItem = async (itemId: string) => {
    if (!token) return

    try {
      setActionLoading(itemId)
      const response = await cartService.removeFromCart(itemId, token)
      
      if (response.success) {
        // Reload cart to get updated data
        await loadCart()
      } else {
        setError(response.message || 'Failed to remove item')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item')
    } finally {
      setActionLoading(null)
    }
  }

  const moveToWishlist = async (itemId: string) => {
    if (!token) return

    try {
      setActionLoading(itemId)
      const response = await cartService.moveToWishlist(itemId, token)
      
      if (response.success) {
        // Reload cart to get updated data
        await loadCart()
      } else {
        setError(response.message || 'Failed to move to wishlist')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move to wishlist')
    } finally {
      setActionLoading(null)
    }
  }

  // Use cart data for calculations, fallback to 0 if cart is null
  const cartItems = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const totalSavings = cart?.totalSavings || 0
  const shipping = cart?.shipping || 0
  const tax = cart?.tax || 0
  const total = cart?.total || 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 
              className="text-3xl font-bold tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              Shopping Cart
            </h1>
            <p 
              className="mt-2 text-lg"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div 
              className="text-center py-16 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" style={{ color: 'var(--primary)' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>
                Loading your cart...
              </h3>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Please wait while we fetch your items
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div 
              className="text-center py-16 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: 'var(--destructive)', color: 'var(--destructive-foreground)' }}>
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>
                Error loading cart
              </h3>
              <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                {error}
              </p>
              <button 
                onClick={loadCart}
                className="px-6 py-3 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
              >
                Try Again
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty Cart */
            <div 
              className="text-center py-16 rounded-xl border"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <ShoppingBag className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>
                Your cart is empty
              </h3>
              <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>
                Discover our exquisite collection of diamonds and jewelry
              </p>
              <button 
                className="px-6 py-3 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            /* Cart Content */
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border p-6 transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      opacity: item.inStock ? 1 : 0.7
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div 
                        className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span>
                            {item.productType === 'diamond' ? '💎' : 
                             item.productType === 'gemstone' ? '💙' : '💍'}
                          </span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--card-foreground)' }}>
                              {item.name}
                            </h3>
                            <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                              Sold by {item.seller}
                            </p>
                            {item.certification && (
                              <div className="flex items-center space-x-2 mb-3">
                                <Shield className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                                <span className="text-sm" style={{ color: 'var(--status-warning)' }}>
                                  {item.certification}
                                </span>
                              </div>
                            )}
                            {!item.inStock && (
                              <p className="text-sm font-medium" style={{ color: 'var(--destructive)' }}>
                                Currently out of stock
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => moveToWishlist(item.id)}
                              disabled={actionLoading === item.id}
                              className="p-2 rounded-lg transition-colors hover:bg-opacity-10 disabled:opacity-50"
                              style={{ color: 'var(--muted-foreground)' }}
                            >
                              {actionLoading === item.id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Heart className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              disabled={actionLoading === item.id}
                              className="p-2 rounded-lg transition-colors hover:bg-opacity-10 disabled:opacity-50"
                              style={{ color: 'var(--destructive)' }}
                            >
                              {actionLoading === item.id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1 || actionLoading === item.id}
                                className="p-1 rounded border transition-colors disabled:opacity-50"
                                style={{ 
                                  borderColor: 'var(--border)',
                                  color: 'var(--foreground)'
                                }}
                              >
                                {actionLoading === item.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Minus className="w-4 h-4" />
                                )}
                              </button>
                              <span className="w-8 text-center font-medium" style={{ color: 'var(--card-foreground)' }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                disabled={actionLoading === item.id}
                                className="p-1 rounded border transition-colors disabled:opacity-50"
                                style={{ 
                                  borderColor: 'var(--border)',
                                  color: 'var(--foreground)'
                                }}
                              >
                                {actionLoading === item.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold" style={{ color: 'var(--card-foreground)' }}>
                                ${(item.price * item.quantity).toLocaleString()}
                              </span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-sm line-through" style={{ color: 'var(--muted-foreground)' }}>
                                  ${(item.originalPrice * item.quantity).toLocaleString()}
                                </span>
                              )}
                            </div>
                            {item.savings && item.savings > 0 && (
                              <p className="text-sm" style={{ color: 'var(--status-warning)' }}>
                                Save ${(item.savings * item.quantity).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div 
                  className="rounded-xl border p-6 sticky top-8"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--card-foreground)' }}>
                    Order Summary
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
                      <span style={{ color: 'var(--card-foreground)' }}>
                        ${subtotal.toLocaleString()}
                      </span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--status-warning)' }}>Savings</span>
                        <span style={{ color: 'var(--status-warning)' }}>
                          -${totalSavings.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--muted-foreground)' }}>Shipping</span>
                      <div className="text-right">
                        {shipping === 0 ? (
                          <>
                            <span style={{ color: 'var(--status-warning)' }}>FREE</span>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              On orders over $1,000
                            </p>
                          </>
                        ) : (
                          <span style={{ color: 'var(--card-foreground)' }}>
                            ${shipping.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--muted-foreground)' }}>Tax</span>
                      <span style={{ color: 'var(--card-foreground)' }}>
                        ${tax.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex justify-between text-lg font-bold">
                        <span style={{ color: 'var(--card-foreground)' }}>Total</span>
                        <span style={{ color: 'var(--card-foreground)' }}>
                          ${total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--card-foreground)' }}>
                        Secure Checkout
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Your payment information is encrypted and secure
                    </p>
                  </div>

                  {/* Shipping Info */}
                  <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Truck className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--card-foreground)' }}>
                        Free Express Shipping
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Estimated delivery: 2-3 business days
                    </p>
                  </div>

                  <button 
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors mb-4"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)'
                    }}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button 
                    className="w-full px-6 py-3 rounded-lg font-medium transition-colors border"
                    style={{ 
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
