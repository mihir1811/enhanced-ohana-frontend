'use client'

import { useEffect } from 'react'
import { useLoading } from '@/hooks/useLoading'
import { PageLoader } from '@/components/seller/Loader'

export default function SellerProfilePage() {
  const { setPageLoading, isPageLoading } = useLoading()
  const isLoading = isPageLoading('profile')

  useEffect(() => {
    setPageLoading('profile', true)
    
    // Simulate loading profile data
    const timer = setTimeout(() => {
      setPageLoading('profile', false)
    }, 1600)

    return () => clearTimeout(timer)
  }, []) // Empty dependency array - only run once on mount

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Profile
          </h1>
          <p 
            className="mt-2 text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Manage your seller profile and account settings.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="px-4 py-2 rounded-lg font-medium transition-colors border"
            style={{ 
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      <div 
        className="rounded-xl border p-8 text-center"
        style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)'
        }}
      >
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--card-foreground)' }}
        >
          Seller Profile
        </h3>
        <p 
          className="text-base"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Profile settings, business information, payment details, and account preferences will be managed here.
        </p>
      </div>
    </div>
  )
}
