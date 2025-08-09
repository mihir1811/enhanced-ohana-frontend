import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice?: number
  image: string
  seller: string
  certification: string
  quantity: number
  inStock: boolean
  savings: number
  specifications?: Record<string, any>
}

interface CartState {
  items: CartItem[]
  loading: {
    adding: boolean
    updating: boolean
    removing: boolean
    clearing: boolean
  }
  error: string | null
  totals: {
    subtotal: number
    savings: number
    tax: number
    shipping: number
    total: number
  }
}

const initialState: CartState = {
  items: [],
  loading: {
    adding: false,
    updating: false,
    removing: false,
    clearing: false
  },
  error: null,
  totals: {
    subtotal: 0,
    savings: 0,
    tax: 0,
    shipping: 0,
    total: 0
  }
}

// Async thunks for cart operations
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1, specifications }: { 
    productId: string
    quantity?: number
    specifications?: Record<string, any>
  }) => {
    // In real app, this would call API
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, specifications })
    })
    return response.json()
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    const response = await fetch(`/api/cart/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    })
    return response.json()
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string) => {
    await fetch(`/api/cart/items/${itemId}`, {
      method: 'DELETE'
    })
    return itemId
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async () => {
    await fetch('/api/cart/clear', {
      method: 'DELETE'
    })
  }
)

export const syncCartWithServer = createAsyncThunk(
  'cart/syncCartWithServer',
  async () => {
    const response = await fetch('/api/cart')
    return response.json()
  }
)

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const savings = items.reduce((sum, item) => sum + (item.savings * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 1000 ? 0 : 50 // Free shipping over $1000
  const total = subtotal + tax + shipping

  return { subtotal, savings, tax, shipping, total }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload
      const item = state.items.find(item => item.id === itemId)
      if (item && quantity > 0) {
        item.quantity = quantity
        state.totals = calculateTotals(state.items)
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.totals = calculateTotals(state.items)
    },
    clearCartLocal: (state) => {
      state.items = []
      state.totals = calculateTotals([])
    },
    moveToWishlist: (state, action: PayloadAction<string>) => {
      // Remove from cart (wishlist logic would be in wishlist slice)
      state.items = state.items.filter(item => item.id !== action.payload)
      state.totals = calculateTotals(state.items)
    },
    applyPromoCode: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      // Apply discount logic
      const { discount } = action.payload
      state.totals.total = Math.max(0, state.totals.total - discount)
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading.adding = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading.adding = false
        if (action.payload.success) {
          const existingItem = state.items.find(item => item.productId === action.payload.data.productId)
          if (existingItem) {
            existingItem.quantity += action.payload.data.quantity
          } else {
            state.items.push(action.payload.data)
          }
          state.totals = calculateTotals(state.items)
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading.adding = false
        state.error = action.error.message || 'Failed to add item to cart'
      })

    // Update Cart Item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading.updating = true
        state.error = null
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading.updating = false
        if (action.payload.success) {
          const item = state.items.find(item => item.id === action.meta.arg.itemId)
          if (item) {
            item.quantity = action.meta.arg.quantity
            state.totals = calculateTotals(state.items)
          }
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading.updating = false
        state.error = action.error.message || 'Failed to update cart item'
      })

    // Remove from Cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading.removing = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading.removing = false
        state.items = state.items.filter(item => item.id !== action.payload)
        state.totals = calculateTotals(state.items)
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading.removing = false
        state.error = action.error.message || 'Failed to remove item from cart'
      })

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading.clearing = true
        state.error = null
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading.clearing = false
        state.items = []
        state.totals = calculateTotals([])
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading.clearing = false
        state.error = action.error.message || 'Failed to clear cart'
      })

    // Sync Cart with Server
    builder
      .addCase(syncCartWithServer.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.items = action.payload.data
          state.totals = calculateTotals(action.payload.data)
        }
      })
  }
})

export const { 
  updateQuantity, 
  removeItem, 
  clearCartLocal, 
  moveToWishlist, 
  applyPromoCode,
  clearError 
} = cartSlice.actions

export default cartSlice.reducer
