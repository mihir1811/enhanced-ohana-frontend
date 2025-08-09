// Utility functions for Redux Persist operations
import { store, persistor } from '../store'
import { logout } from '../features/auth/authSlice'

// Enhanced logout that clears persisted data
export const performLogout = async () => {
  // Dispatch logout action
  store.dispatch(logout())
  
  // Clear persisted data
  try {
    await persistor.purge()
    await persistor.flush()
  } catch (error) {
    console.error('Error clearing persisted data:', error)
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
