import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'

// Base User interface - every user has these properties
interface BaseUser {
  id: string
  name: string
  email: string
  userName: string
  profilePicture?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
  isVerified: boolean
}

// Seller-specific additional data
interface SellerData {
  businessName: string
  businessRegistration: string
  taxId?: string
  businessAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  certifications: string[]
  isVerifiedSeller: boolean
  sellerRating: number
  totalSales: number
  joinedAsSellerDate: string
  businessDescription?: string
  website?: string
  specializations: string[] // e.g., ['diamonds', 'gemstones', 'jewelry']
}

// Combined User type that includes seller data when role is 'seller'
interface User extends BaseUser {
  role: 'user' | 'seller' | 'admin'
  // Seller data is only present when role is 'seller'
  sellerData?: SellerData
}

interface AuthState {
  role: User['role'] | null
  user: User | null
  token: string | null
  // Helper flags for easier access
  isSeller: boolean
  isAdmin: boolean
}

const initialState: AuthState = {
  role: null,
  user: null,
  token: null,
  isSeller: false,
  isAdmin: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user
      state.role = action.payload.user.role
      state.token = action.payload.token
      
      // Set helper flags
      state.isSeller = action.payload.user.role === 'seller'
      state.isAdmin = action.payload.user.role === 'admin'
    },
    
    // Update user profile (base user data)
    updateUserProfile: (
      state,
      action: PayloadAction<Partial<BaseUser>>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    
    // Update seller data (only for sellers)
    updateSellerData: (
      state,
      action: PayloadAction<Partial<SellerData>>
    ) => {
      if (state.user && state.user.role === 'seller') {
        state.user.sellerData = { 
          ...state.user.sellerData, 
          ...action.payload 
        } as SellerData
      }
    },
    
    // Upgrade user to seller
    upgradeToSeller: (
      state,
      action: PayloadAction<SellerData>
    ) => {
      if (state.user && state.user.role === 'user') {
        state.user.role = 'seller'
        state.user.sellerData = action.payload
        state.role = 'seller'
        state.isSeller = true
      }
    },
    
    logout: (state) => {
      state.user = null
      state.role = null
      state.token = null
      state.isSeller = false
      state.isAdmin = false
    },
    
    clearAuthData: () => initialState,
  },
  
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState
    })
  },
})

export const { 
  setCredentials, 
  updateUserProfile, 
  updateSellerData, 
  upgradeToSeller, 
  logout, 
  clearAuthData 
} = authSlice.actions

export default authSlice.reducer

// Type exports for use in components
export type { User, BaseUser, SellerData }
