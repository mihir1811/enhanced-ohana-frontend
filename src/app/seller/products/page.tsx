'use client'

import { useEffect } from 'react'
import { useLoading } from '@/hooks/useLoading'
import { PageLoader } from '@/components/seller/Loader'

export default function SellerProductsPage() {
  const { setPageLoading, isPageLoading } = useLoading()
  const isLoading = isPageLoading('products')

  useEffect(() => {
    setPageLoading('products', true)
    
    // Simulate loading products data
    const timer = setTimeout(() => {
      setPageLoading('products', false)
    }, 2000)

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
            Products
          </h1>
          <p 
            className="mt-2 text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Manage your product catalog and inventory.
          </p>
        </div>
        <button 
          className="px-4 py-2 rounded-lg font-medium transition-colors"
          style={{ 
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)'
          }}
        >
          Add New Product
        </button>
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
          Products Page
        </h3>
        <p 
          className="text-base"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Product management functionality will be implemented here.
        </p>
      </div>
    </div>
  )
}
