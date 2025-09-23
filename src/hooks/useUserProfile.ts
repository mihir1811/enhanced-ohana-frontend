import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { 
  updateUserProfile, 
  updateSellerData, 
  upgradeToSeller,
  User,
  BaseUser,
  SellerData
} from '../features/auth/authSlice'
import { 
  userService, 
  UserProfileUpdateData, 
  SellerRegistrationData 
} from '../services/user.service'

// Simple notification function (you can replace with your preferred toast library)
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  console.log(`${type.toUpperCase()}: ${message}`)
  // You can integrate with react-hot-toast, react-toastify, or your custom notification system here
}

export interface UseUserProfileReturn {
  // User data
  user: User | null
  isSeller: boolean
  isAdmin: boolean
  
  // Loading states
  isLoading: boolean
  isUpdatingProfile: boolean
  isUpgradingToSeller: boolean
  isUpdatingSellerData: boolean
  
  // Profile actions
  updateProfile: (data: UserProfileUpdateData) => Promise<void>
  uploadProfilePicture: (file: File) => Promise<void>
  
  // Seller actions
  registerAsSeller: (data: SellerRegistrationData) => Promise<void>
  updateSellerProfile: (data: Partial<SellerData>) => Promise<void>
  
  // Data fetching
  refreshProfile: () => Promise<void>
}

export const useUserProfile = (): UseUserProfileReturn => {
  const dispatch = useDispatch()
  const { user, isSeller, isAdmin } = useSelector((state: RootState) => state.auth)
  
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpgradingToSeller, setIsUpgradingToSeller] = useState(false)
  const [isUpdatingSellerData, setIsUpdatingSellerData] = useState(false)

  // Update basic user profile
  const updateProfile = useCallback(async (data: UserProfileUpdateData) => {
    if (!user) return

    setIsUpdatingProfile(true)
    try {
      const response = await userService.updateUserProfile(user.id, data)
      
      if (response.success && response.data) {
        dispatch(updateUserProfile(data))
        showNotification('Profile updated successfully')
      } else {
        showNotification(response.message || 'Failed to update profile', 'error')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      showNotification('Failed to update profile', 'error')
    } finally {
      setIsUpdatingProfile(false)
    }
  }, [user, dispatch])

  // Upload profile picture
  const uploadProfilePicture = useCallback(async (file: File) => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await userService.uploadProfilePicture(user.id, file)
      
      if (response.success && response.data) {
        dispatch(updateUserProfile({ profilePicture: response.data.profilePicture }))
        showNotification('Profile picture updated successfully')
      } else {
        showNotification(response.message || 'Failed to upload profile picture', 'error')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      showNotification('Failed to upload profile picture', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [user, dispatch])

  // Register as seller (upgrade from user)
  const registerAsSeller = useCallback(async (data: SellerRegistrationData) => {
    if (!user || user.role !== 'user') return

    setIsUpgradingToSeller(true)
    try {
      const response = await userService.registerAsSeller(user.id, data)
      
      if (response.success && response.data) {
        // Transform registration data to SellerData format
        const sellerData: SellerData = {
          id: response.data.id || '',
          userId: user.id,
          companyName: data.businessName,
          addressLine1: data.businessAddress.street,
          addressLine2: '',
          city: data.businessAddress.city,
          state: data.businessAddress.state,
          country: data.businessAddress.country,
          zipCode: data.businessAddress.zipCode,
          sellerType: data.specializations[0] || 'general',
          companyLogo: '',
          isVerified: false,
          isBlocked: false,
          isDeleted: false,
          panCard: '',
          gstNumber: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        dispatch(upgradeToSeller(sellerData))
        showNotification('Successfully registered as seller! Your application is under review.')
      } else {
        showNotification(response.message || 'Failed to register as seller', 'error')
      }
    } catch (error) {
      console.error('Error registering as seller:', error)
      showNotification('Failed to register as seller', 'error')
    } finally {
      setIsUpgradingToSeller(false)
    }
  }, [user, dispatch])

  // Update seller data
  const updateSellerProfile = useCallback(async (data: Partial<SellerData>) => {
    if (!user || user.role !== 'seller') return

    setIsUpdatingSellerData(true)
    try {
      const response = await userService.updateSellerData(user.id, data)
      
      if (response.success && response.data) {
        dispatch(updateSellerData(data))
        showNotification('Seller profile updated successfully')
      } else {
        showNotification(response.message || 'Failed to update seller profile', 'error')
      }
    } catch (error) {
      console.error('Error updating seller profile:', error)
      showNotification('Failed to update seller profile', 'error')
    } finally {
      setIsUpdatingSellerData(false)
    }
  }, [user, dispatch])

  // Refresh user profile from server
  const refreshProfile = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await userService.getUserProfile(user.id)
      
      if (response.success && response.data) {
        // The full user data will be updated via setCredentials in auth context
        // This is mainly for refreshing the UI
        showNotification('Profile refreshed')
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
      showNotification('Failed to refresh profile', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  return {
    // User data
    user,
    isSeller,
    isAdmin,
    
    // Loading states
    isLoading,
    isUpdatingProfile,
    isUpgradingToSeller,
    isUpdatingSellerData,
    
    // Profile actions
    updateProfile,
    uploadProfilePicture,
    
    // Seller actions
    registerAsSeller,
    updateSellerProfile,
    
    // Data fetching
    refreshProfile,
  }
}

// Hook for fetching public seller profiles
export interface UseSellerProfilesReturn {
  sellers: Array<{
    user: BaseUser
    sellerData: Omit<SellerData, 'taxId' | 'businessRegistration'>
  }>
  isLoading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  } | null
  fetchSellers: (params?: {
    page?: number
    limit?: number
    specialization?: string
    location?: string
  }) => Promise<void>
  fetchSellerProfile: (sellerId: string) => Promise<{
    user: BaseUser
    sellerData: Omit<SellerData, 'taxId' | 'businessRegistration'>
  } | null>
}

export const useSellerProfiles = (): UseSellerProfilesReturn => {
  const [sellers, setSellers] = useState<UseSellerProfilesReturn['sellers']>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<UseSellerProfilesReturn['pagination']>(null)

  const fetchSellers = useCallback(async (params?: {
    page?: number
    limit?: number
    specialization?: string
    location?: string
  }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await userService.getVerifiedSellers(params)
      
      if (response.success && response.data) {
        setSellers(response.data.sellers)
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to fetch sellers')
      }
    } catch (error) {
      console.error('Error fetching sellers:', error)
      setError('Failed to fetch sellers')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchSellerProfile = useCallback(async (sellerId: string) => {
    try {
      const response = await userService.getSellerProfile(sellerId)
      
      if (response.success && response.data) {
        return response.data
      } else {
        showNotification(response.message || 'Failed to fetch seller profile', 'error')
        return null
      }
    } catch (error) {
      console.error('Error fetching seller profile:', error)
      showNotification('Failed to fetch seller profile', 'error')
      return null
    }
  }, [])

  return {
    sellers,
    isLoading,
    error,
    pagination,
    fetchSellers,
    fetchSellerProfile,
  }
}
