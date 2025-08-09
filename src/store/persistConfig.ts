// Redux persist configuration
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import loadingReducer from './loading'
import productReducer from '../features/products/productSlice'
import orderReducer from '../features/orders/orderSlice'
import cartReducer from '../features/cart/cartSlice'

// Persist configuration for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'role', 'token'], // Only persist these fields
}

// Persist configuration for cart slice
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'summary'], // Persist cart items and summary
}

// Root persist configuration
const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'], // Only persist auth and cart
  blacklist: ['loading', 'products', 'orders'], // Don't persist these (they should be fresh)
}

// Combine all reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  loading: loadingReducer,
  products: productReducer,
  orders: orderReducer,
})

// Create persisted reducer
export const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export type RootState = ReturnType<typeof rootReducer>
