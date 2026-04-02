'use client'

import { store, persistor } from './store'
import { Provider } from 'react-redux' 
import { PersistGate } from 'redux-persist/integration/react'
import { PersistLoading } from './components/ui/PersistLoading'
import { WishlistProvider } from './contexts/WishlistContext'
import { SocketProvider } from './components/chat/SocketProvider'
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const shouldEnableSocket =
    pathname?.startsWith('/user/chat') ||
    pathname?.startsWith('/seller/chat') ||
    pathname?.startsWith('/chat-test')

  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        <WishlistProvider>
          {shouldEnableSocket ? (
            <SocketProvider>
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </SocketProvider>
          ) : (
            <>
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </>
          )}
        </WishlistProvider>
      </PersistGate>
    </Provider>
  )
}
