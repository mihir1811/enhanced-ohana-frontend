// Utility functions for Redux Persist operations
import { store, persistor } from '../store'
import { logout } from '../features/auth/authSlice'
import { clearSellerProfile } from '../features/seller/sellerSlice'
import { clearCompare } from '../features/compare/compareSlice'
import { clearFilters, clearCurrentProduct, clearSearchResults } from '../features/products/productSlice'

// Enhanced logout that clears persisted data and all stats
export const performLogout = async () => {
  console.log('🚪 [persistUtils] Performing complete logout with stats clearing')
  
  // Dispatch all clear actions to empty stats
  store.dispatch(logout()) // Clear auth data
  store.dispatch(clearSellerProfile()) // Clear seller data  
  store.dispatch(clearCompare()) // Clear compare data
  store.dispatch(clearFilters()) // Clear product filters
  store.dispatch(clearCurrentProduct()) // Clear current product
  store.dispatch(clearSearchResults()) // Clear search results
  
  // Clear persisted data
  try {
    await persistor.purge()
    await persistor.flush()
    console.log('✅ [persistUtils] All persisted data cleared')
  } catch (error) {
    console.error('❌ [persistUtils] Error clearing persisted data:', error)
  }
  
  // Redirect to login page
  window.location.href = '/login'
}

// Clear all persisted data (for development/testing)
export const clearAllPersistedData = async () => {
  try {
    await persistor.purge()
    await persistor.flush()
    window.location.reload()
  } catch (error) {
    console.error('Error clearing all persisted data:', error)
  }
}

// Check if persistence is working
export const getPersistenceStatus = () => {
  return {
    isRehydrated: store.getState()._persist?.rehydrated || false,
    version: store.getState()._persist?.version || -1,
  }
}
