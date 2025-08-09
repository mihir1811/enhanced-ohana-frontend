import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState, AppDispatch } from '@/store'
import { setCredentials, logout } from '@/features/auth/authSlice'
import { authService, userService, sellerService } from '@/services/auth'
import { setCookie, deleteCookie } from '@/lib/cookie-utils'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const authState = useSelector((state: RootState) => state.auth)

  const login = useCallback(async (userName: string, password: string) => {
    try {
      const response = await authService.login({ userName, password })
      
      if (response.success) {
        const { user, accessToken } = response.data
        
        // Save to Redux store
        dispatch(setCredentials({ user, token: accessToken }))
        
        // Save role to cookie for middleware
        setCookie('role', user.role, 30) // 30 days
        
        return { success: true, user, redirectTo: `/${user.role}` }
      }
      
      return { success: false, error: response.message }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }
    }
  }, [dispatch])

  const register = useCallback(async (formData: FormData) => {
    try {
      const response = await authService.register({
        name: formData.get('name') as string,
        userName: formData.get('userName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        role: formData.get('role') as 'user' | 'seller',
        profilePicture: formData.get('profilePicture') as File
      })
      
      if (response.success) {
        return { success: true, message: 'Registration successful! Please login.' }
      }
      
      return { success: false, error: response.message }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }
    }
  }, [])

  const logoutUser = useCallback(async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear local state even if API fails
      dispatch(logout())
      deleteCookie('role')
    }
  }, [dispatch])

  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken()
      
      if (response.success && authState.user) {
        dispatch(setCredentials({ 
          user: authState.user, 
          token: response.data.accessToken 
        }))
        return { success: true }
      }
      
      return { success: false }
    } catch (error) {
      // Token refresh failed, logout user
      dispatch(logout())
      deleteCookie('role')
      return { success: false }
    }
  }, [dispatch, authState.user])

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await authService.forgotPassword(email)
      return { 
        success: response.success, 
        message: response.message || 'Password reset email sent' 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send reset email' 
      }
    }
  }, [])

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      const response = await authService.resetPassword(token, password)
      return { 
        success: response.success, 
        message: response.message || 'Password reset successful' 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      }
    }
  }, [])

  return {
    // State
    user: authState.user,
    token: authState.token,
    role: authState.role,
    isAuthenticated: !!authState.user && !!authState.token,
    isUser: authState.role === 'user',
    isSeller: authState.role === 'seller',
    isAdmin: authState.role === 'admin',

    // Actions
    login,
    register,
    logout: logoutUser,
    refreshToken,
    forgotPassword,
    resetPassword
  }
}

export const useUserProfile = () => {
  const { user } = useAuth()

  const updateProfile = useCallback(async (data: any) => {
    try {
      const response = await userService.updateProfile(data)
      return { success: response.success, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Profile update failed' 
      }
    }
  }, [])

  const changePassword = useCallback(async (passwordData: any) => {
    try {
      const response = await userService.changePassword(passwordData)
      return { success: response.success, message: 'Password changed successfully' }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password change failed' 
      }
    }
  }, [])

  const getAddresses = useCallback(async () => {
    try {
      const response = await userService.getAddresses()
      return { success: response.success, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to load addresses' 
      }
    }
  }, [])

  const addAddress = useCallback(async (address: any) => {
    try {
      const response = await userService.createAddress(address)
      return { success: response.success, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add address' 
      }
    }
  }, [])

  return {
    user,
    updateProfile,
    changePassword,
    getAddresses,
    addAddress
  }
}

export const useSellerProfile = () => {
  const getSellerProfile = useCallback(async () => {
    try {
      const response = await sellerService.getSellerProfile()
      return { success: response.success, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to load seller profile' 
      }
    }
  }, [])

  const updateSellerProfile = useCallback(async (data: any) => {
    try {
      const response = await sellerService.updateSellerProfile(data)
      return { success: response.success, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update seller profile' 
      }
    }
  }, [])

  const getSellerStats = useCallback(async () => {
    try {
      const response = await sellerService.getSellerStats()
      return { success: response.success, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to load seller stats' 
      }
    }
  }, [])

  return {
    getSellerProfile,
    updateSellerProfile,
    getSellerStats
  }
}

export default useAuth
