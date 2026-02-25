'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useLoading } from '@/hooks/useLoading'
import { TableLoader } from '@/components/seller/Loader'
import { ShoppingCart, Package } from 'lucide-react'

export default function SellerOrdersPage() {
  const { setPageLoading, isPageLoading } = useLoading()
  const isLoading = isPageLoading('orders')

  useEffect(() => {
    setPageLoading('orders', true)
    const timer = setTimeout(() => setPageLoading('orders', false), 400)
    return () => clearTimeout(timer)
  }, [setPageLoading])

  if (isLoading) {
    return <TableLoader rows={8} />
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Orders
          </h1>
          <p 
            className="mt-2 text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Track and manage your customer orders.
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
            Export Orders
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)'
            }}
          >
            Filter Orders
          </button>
        </div>
      </div>

      <div 
        className="rounded-xl border p-12 text-center"
        style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex justify-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--muted)' }}
          >
            <ShoppingCart className="w-8 h-8" style={{ color: 'var(--muted-foreground)' }} />
          </div>
        </div>
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--card-foreground)' }}
        >
          No orders yet
        </h3>
        <p 
          className="text-base mb-6 max-w-md mx-auto"
          style={{ color: 'var(--muted-foreground)' }}
        >
          When customers place orders, they will appear here. You can track status, update shipping, and manage fulfillment.
        </p>
        <Link
          href="/seller/add-product"
          className="inline-flex items-center gap-2 px-4 py-2 rounded font-medium transition"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <Package className="w-4 h-4" />
          Add Product
        </Link>
      </div>
    </div>
  )
}
