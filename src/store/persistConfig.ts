// Redux persist configuration
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import sellerReducer from '../features/seller/sellerSlice'
import loadingReducer from './loading'
import cartReducer from '../features/cart/cartSlice'
import orderReducer from '../features/orders/orderSlice'
import productReducer from '../features/products/productSlice'
import compareReducer from '../features/compare/compareSlice'

// Persist configuration for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'role', 'token','seller'], // Only persist these fields
}

// Persist configuration for cart slice
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'totals'], // Persist cart items and totals
}

// Persist configuration for orders slice
const orderPersistConfig = {
  key: 'orders',
  storage,
  whitelist: ['userOrders'], // Only persist user orders
}

// Persist configuration for products slice
const productPersistConfig = {
  key: 'products',
  storage,
  whitelist: [], // Don't persist product data (too large, should be fetched fresh)
}

// Persist configuration for seller slice
const sellerPersistConfig = {
  key: 'seller',
  storage,
  whitelist: ['profile', 'error'], // Only persist profile and error, not isLoading
}

// Persist configuration for compare slice
const comparePersistConfig = {
  key: 'compare',
  storage,
  whitelist: ['products'], // Persist compare products
}

// Root persist configuration
const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'orders', 'seller', 'compare'], // Persist auth, cart, orders, seller, compare
  blacklist: ['loading', 'products'], // Don't persist loading or products
}

// Combine all reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  orders: persistReducer(orderPersistConfig, orderReducer),
  products: productReducer, // No persistence for products
  loading: loadingReducer,
  seller: persistReducer(sellerPersistConfig, sellerReducer), // Persisted seller slice
  compare: persistReducer(comparePersistConfig, compareReducer), // Persisted compare slice
})

// Create persisted reducer
export const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export type RootState = ReturnType<typeof rootReducer>
