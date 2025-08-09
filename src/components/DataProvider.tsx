'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { LoadingProvider } from '@/contexts/LoadingContext'
import ErrorBoundary from '@/components/ErrorBoundary'

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <LoadingProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </LoadingProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default DataProvider
