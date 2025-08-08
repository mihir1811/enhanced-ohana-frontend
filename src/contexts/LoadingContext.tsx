'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface LoadingContextType {
  isGlobalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
  setPageLoading: (page: string, loading: boolean) => void
  isPageLoading: (page: string) => boolean
  isAnyLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [globalLoading, setGlobalLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState<Record<string, boolean>>({})

  const handleSetPageLoading = useCallback((page: string, loading: boolean) => {
    setPageLoading(prev => {
      if (loading) {
        return { ...prev, [page]: true }
      } else {
        const newState = { ...prev }
        delete newState[page]
        return newState
      }
    })
  }, [])

  const isPageLoading = useCallback((page: string) => !!pageLoading[page], [pageLoading])
  const isAnyLoading = globalLoading || Object.keys(pageLoading).length > 0

  return (
    <LoadingContext.Provider value={{
      isGlobalLoading: globalLoading,
      setGlobalLoading,
      setPageLoading: handleSetPageLoading,
      isPageLoading,
      isAnyLoading,
    }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
