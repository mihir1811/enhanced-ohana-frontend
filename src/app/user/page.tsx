'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, Heart, Star, TrendingUp, Eye, Clock, CreditCard } from 'lucide-react'

export default function UserDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 
              className="text-4xl font-bold tracking-tight mb-4"
              style={{ color: 'var(--foreground)' }}
            >
              Welcome to Ohana Diamonds
            </h1>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Discover premium diamonds, gemstones, and luxury jewelry from verified sellers worldwide.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div 
                    className="rounded-xl border p-6"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    <div 
                      className="h-6 w-20 rounded mb-3"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                    <div 
                      className="h-8 w-16 rounded mb-2"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                    <div 
                      className="h-4 w-24 rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <>
                <UserStatsCard
                  title="Orders"
                  value="8"
                  subtitle="2 pending"
                  icon={<Package className="w-6 h-6" style={{ color: 'var(--chart-1)' }} />}
                  href="/user/orders"
                />
                <UserStatsCard
                  title="Wishlist"
                  value="24"
                  subtitle="3 on sale"
                  icon={<Heart className="w-6 h-6" style={{ color: 'var(--chart-2)' }} />}
                  href="/user/wishlist"
                />
                <UserStatsCard
                  title="Reviews"
                  value="12"
                  subtitle="4.8 avg rating"
                  icon={<Star className="w-6 h-6" style={{ color: 'var(--chart-3)' }} />}
                  href="/user/reviews"
                />
                <UserStatsCard
                  title="Cart Items"
                  value="3"
                  subtitle="$8,450 total"
                  icon={<ShoppingCart className="w-6 h-6" style={{ color: 'var(--chart-4)' }} />}
                  href="/user/cart"
                />
              </>
            )}
          </div>

          {/* Featured Categories */}
          <div>
            <h2 
              className="text-2xl font-bold mb-6"
              style={{ color: 'var(--foreground)' }}
            >
              Shop by Category
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Diamonds',
                  description: 'Premium certified diamonds',
                  image: '💎',
                  href: '/products/diamonds',
                  color: 'var(--chart-1)'
                },
                {
                  name: 'Gemstones',
                  description: 'Rare and precious gemstones',
                  image: '💍',
                  href: '/products/gemstones',
                  color: 'var(--chart-2)'
                },
                {
                  name: 'Jewelry',
                  description: 'Handcrafted luxury jewelry',
                  image: '👑',
                  href: '/products/jewelry',
                  color: 'var(--chart-3)'
                }
              ].map((category) => (
                <Link key={category.name} href={category.href}>
                  <div 
                    className="group rounded-xl border p-8 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.image}
                    </div>
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{ color: 'var(--card-foreground)' }}
                    >
                      {category.name}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {category.description}
                    </p>
                    <div 
                      className="mt-4 inline-block px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ 
                        backgroundColor: category.color,
                        color: 'var(--primary-foreground)'
                      }}
                    >
                      Browse Collection
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
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
                <Link 
                  href="/user/orders"
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'var(--primary)' }}
                >
                  View all
                </Link>
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div 
                        className="w-12 h-12 rounded-lg"
                        style={{ backgroundColor: 'var(--muted)' }}
                      />
                      <div className="flex-1 space-y-2">
                        <div 
                          className="h-4 w-32 rounded"
                          style={{ backgroundColor: 'var(--muted)' }}
                        />
                        <div 
                          className="h-3 w-24 rounded"
                          style={{ backgroundColor: 'var(--muted)' }}
                        />
                      </div>
                      <div 
                        className="h-5 w-16 rounded-full"
                        style={{ backgroundColor: 'var(--muted)' }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    { id: '#ORD-001', item: '2.5ct Diamond Ring', status: 'Delivered', date: '2 days ago' },
                    { id: '#ORD-002', item: 'Sapphire Earrings', status: 'Shipped', date: '5 days ago' },
                    { id: '#ORD-003', item: 'Gold Necklace', status: 'Processing', date: '1 week ago' }
                  ].map((order) => (
                    <div key={order.id} className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <Package className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: 'var(--card-foreground)' }}>
                          {order.item}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {order.id} • {order.date}
                        </p>
                      </div>
                      <span 
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: order.status === 'Delivered' ? 'var(--chart-1)' : 
                                          order.status === 'Shipped' ? 'var(--chart-2)' : 'var(--chart-3)',
                          color: 'var(--primary-foreground)'
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended for You */}
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
                Recommended for You
              </h3>
              <div className="space-y-4">
                {[
                  { name: '1.2ct Round Diamond', price: '$3,250', image: '💎' },
                  { name: 'Emerald Drop Earrings', price: '$1,890', image: '💍' },
                  { name: 'Vintage Gold Bracelet', price: '$950', image: '👑' }
                ].map((product, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-opacity-50 transition-colors cursor-pointer" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="text-2xl">{product.image}</div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--card-foreground)' }}>
                        {product.name}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--chart-1)' }}>
                        {product.price}
                      </p>
                    </div>
                    <button 
                      className="px-3 py-1 text-xs rounded-lg transition-colors"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)'
                      }}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface UserStatsCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  href: string
}

function UserStatsCard({ title, value, subtitle, icon, href }: UserStatsCardProps) {
  return (
    <Link href={href}>
      <div 
        className="rounded-xl border p-6 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer"
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
            className="text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  )
}
