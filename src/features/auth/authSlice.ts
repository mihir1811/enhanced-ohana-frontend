import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'
import { userService, UpdateUserRequest } from '@/services/userService'

// Base User interface - every user has these properties
export interface BaseUser {
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
// export interface SellerData {
//   businessName: string
//   businessRegistration: string
//   taxId?: string
//   businessAddress: {
//     street: string
//     city: string
//     state: string
//     zipCode: string
//     country: string
//   }
//   certifications: string[]
//   isVerifiedSeller: boolean
//   sellerRating: number
//   totalSales: number
//   joinedAsSellerDate: string
//   businessDescription?: string
//   website?: string
//   specializations: string[] // e.g., ['diamonds', 'gemstones', 'jewelry']
// }
export interface SellerData {
    addressLine1: string
  addressLine2: string
  city: string
  companyLogo: string
  companyName: string
  country: string
  createdAt: string
  gstNumber: string
  id: string
  isBlocked: boolean
  isDeleted: boolean
  isVerified: boolean
  panCard: string
  sellerType: string
  state: string
  updatedAt: string
  userId: string
  zipCode: string
}

// Combined User type that includes seller data when role is 'seller'
export interface User extends BaseUser {
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

// Async thunk for updating user profile via API
export const updateUserProfileAsync = createAsyncThunk(
  'auth/updateUserProfile',
  async (updateData: UpdateUserRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token
      
      if (!token) {
        return rejectWithValue('No authentication token found')
      }
      
      const response = await userService.updateUserInfo(updateData, token)
      
      if (!response.success) {
        return rejectWithValue(response.message)
      }
      
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile')
    }
  }
)

// Async thunk for updating profile picture
export const updateProfilePictureAsync = createAsyncThunk(
  'auth/updateProfilePicture',
  async (profilePicture: File, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token
      
      if (!token) {
        return rejectWithValue('No authentication token found')
      }
      
      const response = await userService.updateProfilePicture(profilePicture, token)
      
      if (!response.success) {
        return rejectWithValue(response.message)
      }
      
      return response.data
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile picture')
    }
  }
)

// Async thunk for logout
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      const token = state.auth.token
      
      if (!token) {
        // If no token, just clear local data
        return { message: 'Logged out locally' }
      }
      
      const response = await userService.logout(token)
      
      if (!response.success) {
        return rejectWithValue(response.message)
      }
      
      return response.data
    } catch (error) {
      // Even if logout API fails, we should clear local data
      console.warn('Logout API failed, clearing local data anyway:', error)
      return { message: 'Logged out locally due to API error' }
    }
  }
)

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
    builder
      .addCase(PURGE, () => {
        return initialState
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        // Update the user data with the response from API
        if (state.user && action.payload) {
          state.user = { ...state.user, ...action.payload }
        }
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        // Handle error - you could add error state here if needed
        console.error('Failed to update user profile:', action.payload)
      })
      .addCase(updateProfilePictureAsync.fulfilled, (state, action) => {
        // Update the user's profile picture with the response from API
        if (state.user && action.payload && action.payload.profilePicture) {
          state.user.profilePicture = action.payload.profilePicture
        }
      })
      .addCase(updateProfilePictureAsync.rejected, (state, action) => {
        // Handle error - you could add error state here if needed
        console.error('Failed to update profile picture:', action.payload)
      })
      .addCase(logoutAsync.fulfilled, (state, action) => {
        // Clear all auth data on successful logout
        state.user = null
        state.role = null
        state.token = null
        state.isSeller = false
        state.isAdmin = false
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        // Even if logout fails, clear local data for security
        console.warn('Logout API failed, clearing local data anyway:', action.payload)
        state.user = null
        state.role = null
        state.token = null
        state.isSeller = false
        state.isAdmin = false
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
// ...existing code...
