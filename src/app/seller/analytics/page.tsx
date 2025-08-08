'use client'

import { useEffect } from 'react'
import { CardLoader } from '@/components/seller/Loader'
import { useLoading } from '@/hooks/useLoading'

export default function SellerAnalyticsPage() {
  const { setPageLoading, isPageLoading } = useLoading()
  const isLoading = isPageLoading('analytics')

  useEffect(() => {
    setPageLoading('analytics', true)
    
    // Simulate loading analytics data
    const timer = setTimeout(() => {
      setPageLoading('analytics', false)
    }, 2200)

    return () => clearTimeout(timer)
  }, []) // Empty dependency array - only run once on mount

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardLoader key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Analytics
          </h1>
          <p 
            className="mt-2 text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Track your store performance and sales insights.
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
            Export Report
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)'
            }}
          >
            Date Range
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
          Analytics Dashboard
        </h3>
        <p 
          className="text-base"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Sales analytics, charts, and performance metrics will be displayed here.
        </p>
      </div>
    </div>
  )
}
