'use client'

import { useState, useEffect, CSSProperties, MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Package, ShoppingCart, DollarSign, Eye, Heart, MessageSquare, Star } from 'lucide-react'
import { CardLoader } from '@/components/seller/Loader'

type RippleButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

function RippleButton({ children, onClick, disabled, className = '', style }: RippleButtonProps) {
  const [rippleStyle, setRippleStyle] = useState<CSSProperties>({})
  const [rippleKey, setRippleKey] = useState(0)
  const [showRipple, setShowRipple] = useState(false)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2.4
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    setRippleStyle({
      width: size,
      height: size,
      left: x,
      top: y
    })
    setRippleKey(Date.now())
    setShowRipple(true)

    setTimeout(() => {
      setShowRipple(false)
    }, 400)

    onClick?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {showRipple && (
        <span
          key={rippleKey}
          style={rippleStyle}
          className="pointer-events-none absolute z-10 rounded-full bg-blue-500/40 dark:bg-blue-400/30 opacity-75 animate-ping"
        />
      )}
      <span className="relative z-20">
        {children}
      </span>
    </button>
  )
}

export default function SellerDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simple loading - just one timer
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleAddProduct = () => {
    router.push('/seller/add-product')
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Dashboard
          </h1>
          <p 
            className="mt-2 text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Welcome back! Here&rsquo;s what&rsquo;s happening with your store today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <RippleButton 
            className="px-4 py-2 rounded-lg font-medium transition-colors border disabled:opacity-50"
            style={{ 
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
            disabled={isLoading}
          >
            Export Data
          </RippleButton>
          <RippleButton 
            onClick={handleAddProduct}
            className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)'
            }}
            disabled={isLoading}
          >
            Add Product
          </RippleButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardLoader key={i} />)
        ) : (
          <>
            <DashboardCard
              title="Total Revenue"
              value="$12,480"
              change="+12.5%"
              trend="up"
              icon={<DollarSign className="w-6 h-6" style={{ color: 'var(--chart-1)' }} />}
            />
            <DashboardCard
              title="Total Products"
              value="128"
              change="+8 this month"
              trend="up"
              icon={<Package className="w-6 h-6" style={{ color: 'var(--chart-2)' }} />}
            />
            <DashboardCard
              title="Total Orders"
              value="312"
              change="+23 today"
              trend="up"
              icon={<ShoppingCart className="w-6 h-6" style={{ color: 'var(--chart-3)' }} />}
            />
            <DashboardCard
              title="Conversion Rate"
              value="3.2%"
              change="+0.4%"
              trend="up"
              icon={<TrendingUp className="w-6 h-6" style={{ color: 'var(--chart-4)' }} />}
            />
          </>
        )}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div 
          className="rounded-xl border p-6"
          style={{ 
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--card-foreground)' }}
            >
              Recent Orders
            </h3>
              <RippleButton 
                className="text-sm font-medium hover:underline disabled:opacity-50"
                style={{ color: 'var(--primary)' }}
                disabled={isLoading}
              >
              View all
              </RippleButton>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="h-4 w-16 rounded"
                        style={{ backgroundColor: 'var(--muted)' }}
                      />
                      <div 
                        className="h-5 w-20 rounded-full"
                        style={{ backgroundColor: 'var(--muted)' }}
                      />
                    </div>
                    <div 
                      className="h-3 w-40 rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                  </div>
                  <div 
                    className="h-4 w-16 rounded"
                    style={{ backgroundColor: 'var(--muted)' }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { id: '#3241', customer: 'Sarah Johnson', amount: '$1,250', status: 'Processing', time: '2 hours ago' },
                { id: '#3240', customer: 'Mike Chen', amount: '$890', status: 'Shipped', time: '4 hours ago' },
                { id: '#3239', customer: 'Emma Davis', amount: '$2,100', status: 'Delivered', time: '6 hours ago' },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium" style={{ color: 'var(--card-foreground)' }}>{order.id}</span>
                      <span 
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: order.status === 'Processing' ? 'var(--chart-2)' : 
                                          order.status === 'Shipped' ? 'var(--chart-3)' : 'var(--chart-1)',
                          color: 'var(--primary-foreground)'
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                      {order.customer} • {order.time}
                    </p>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--card-foreground)' }}>{order.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div 
          className="rounded-xl border p-6"
          style={{ 
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)'
          }}
        >
          <h3 
            className="text-lg font-semibold mb-6"
            style={{ color: 'var(--card-foreground)' }}
          >
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Add Product', icon: <Package className="w-5 h-5" />, href: '/seller/add-product' },
              { name: 'View Orders', icon: <ShoppingCart className="w-5 h-5" />, href: '/seller/orders' },
              { name: 'Analytics', icon: <TrendingUp className="w-5 h-5" />, href: '/seller/analytics' },
              { name: 'Chat', icon: <MessageSquare className="w-5 h-5" />, href: '/seller/chat' },
            ].map((action) => (
              <RippleButton
                key={action.name}
                onClick={() => router.push(action.href)}
                className="flex flex-col items-center p-4 rounded-lg border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{ 
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
                disabled={isLoading}
              >
                <div className="mb-2" style={{ color: 'var(--primary)' }}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium">{action.name}</span>
              </RippleButton>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div 
        className="rounded-xl border p-6"
        style={{ 
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)'
        }}
      >
        <h3 
          className="text-lg font-semibold mb-6"
          style={{ color: 'var(--card-foreground)' }}
        >
          Performance Metrics
        </h3>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div 
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3"
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <div 
                  className="h-8 w-16 mx-auto rounded mb-2"
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <div 
                  className="h-4 w-20 mx-auto rounded mb-1"
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <div 
                  className="h-3 w-16 mx-auto rounded"
                  style={{ backgroundColor: 'var(--muted)' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Product Views"
              value="2,847"
              change="+18%"
              icon={<Eye className="w-5 h-5" />}
            />
            <MetricCard
              title="Favorites"
              value="456"
              change="+12%"
              icon={<Heart className="w-5 h-5" />}
            />
            <MetricCard
              title="Average Rating"
              value="4.8"
              change="+0.2"
              icon={<Star className="w-5 h-5" />}
            />
            <MetricCard
              title="Messages"
              value="23"
              change="+5 today"
              icon={<MessageSquare className="w-5 h-5" />}
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ReactNode
}

function DashboardCard({ title, value, change, trend, icon }: DashboardCardProps) {
  return (
    <div 
      className="rounded-xl border p-6 transition-all duration-200 hover:shadow-lg"
      style={{ 
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-sm font-medium"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {title}
        </h3>
        {icon}
      </div>
      <div className="space-y-1">
        <div 
          className="text-2xl font-bold"
          style={{ color: 'var(--card-foreground)' }}
        >
          {value}
        </div>
        <p 
          className="text-sm flex items-center"
          style={{ 
            color: trend === 'up' ? 'var(--chart-1)' : 'var(--destructive)'
          }}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          {change}
        </p>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="text-center">
      <div 
        className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3"
        style={{ backgroundColor: 'var(--muted)' }}
      >
        <div style={{ color: 'var(--muted-foreground)' }}>
          {icon}
        </div>
      </div>
      <div 
        className="text-2xl font-bold"
        style={{ color: 'var(--card-foreground)' }}
      >
        {value}
      </div>
      <div 
        className="text-sm"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {title}
      </div>
      <div 
        className="text-sm mt-1"
        style={{ color: 'var(--chart-1)' }}
      >
        {change}
      </div>
    </div>
  )
}
