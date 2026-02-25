'use client'

import { useState } from 'react'
import { Package, Truck, Check, Clock, MoreHorizontal, Eye, Download, RefreshCw } from 'lucide-react'

export default function UserOrdersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [orders] = useState([
    {
      id: 'ORD-001',
      date: '2025-01-05',
      items: [
        { name: '2.5ct Diamond Solitaire Ring', price: '$8,500', image: '💎' },
        { name: 'Diamond Stud Earrings', price: '$2,200', image: '💍' }
      ],
      total: '$10,700',
      status: 'delivered',
      tracking: 'TRK-789654123',
      estimatedDelivery: '2025-01-08'
    },
    {
      id: 'ORD-002',
      date: '2025-01-10',
      items: [
        { name: 'Sapphire Tennis Bracelet', price: '$3,450', image: '💙' }
      ],
      total: '$3,450',
      status: 'shipped',
      tracking: 'TRK-456789012',
      estimatedDelivery: '2025-01-15'
    },
    {
      id: 'ORD-003',
      date: '2025-01-12',
      items: [
        { name: 'Emerald Drop Necklace', price: '$5,200', image: '💚' },
        { name: 'Gold Chain Bracelet', price: '$890', image: '🪙' }
      ],
      total: '$6,090',
      status: 'processing',
      tracking: 'TRK-123456789',
      estimatedDelivery: '2025-01-18'
    },
    {
      id: 'ORD-004',
      date: '2025-01-14',
      items: [
        { name: 'Ruby Heart Pendant', price: '$1,650', image: '❤️' }
      ],
      total: '$1,650',
      status: 'pending',
      tracking: null,
      estimatedDelivery: '2025-01-20'
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Check className="w-5 h-5" style={{ color: 'var(--status-success)' }} />
      case 'shipped':
        return <Truck className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
      case 'processing':
        return <Package className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
      case 'pending':
        return <Clock className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
      default:
        return <Package className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'var(--status-success-bg)'
      case 'shipped':
        return 'var(--status-warning-bg)'
      case 'processing':
        return 'color-mix(in srgb, var(--status-warning) 10%, transparent)'
      case 'pending':
        return 'var(--muted)'
      default:
        return 'var(--muted)'
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'var(--status-success)'
      case 'shipped':
        return 'var(--status-warning)'
      case 'processing':
        return 'var(--status-warning)'
      case 'pending':
        return 'var(--muted-foreground)'
      default:
        return 'var(--muted-foreground)'
    }
  }

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(order => order.status === activeTab)

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 
              className="text-3xl font-bold tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              My Orders
            </h1>
            <p 
              className="mt-2 text-lg"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Track and manage your jewelry orders.
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b" style={{ borderColor: 'var(--border)' }}>
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="py-2 px-1 border-b-2 font-medium text-sm transition-all"
                  style={{
                    borderBottomColor: activeTab === tab.id ? 'var(--status-warning)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--status-warning)' : 'var(--muted-foreground)'
                  }}
                >
                  {tab.label}
                  <span 
                    className="ml-2 px-2 py-0.5 text-xs rounded-full"
                    style={{ 
                      backgroundColor: activeTab === tab.id ? 'color-mix(in srgb, var(--status-warning) 15%, transparent)' : 'var(--muted)',
                      color: activeTab === tab.id ? 'var(--status-warning)' : 'var(--muted-foreground)'
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div 
                className="text-center py-12 rounded-xl border"
                style={{ 
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)'
                }}
              >
                <Package className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--card-foreground)' }}>
                  No orders found
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  {activeTab === 'all' ? 'You haven\'t placed any orders yet.' : `No ${activeTab} orders found.`}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border p-6 transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--card-foreground)' }}>
                          Order {order.id}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span 
                          className="px-3 py-1 text-sm font-medium rounded-full capitalize"
                          style={{ 
                            backgroundColor: getStatusColor(order.status),
                            color: getStatusTextColor(order.status)
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="text-3xl">{item.image}</div>
                        <div className="flex-1">
                          <h4 className="font-medium" style={{ color: 'var(--card-foreground)' }}>
                            {item.name}
                          </h4>
                          <p className="text-sm font-semibold" style={{ color: 'var(--status-warning)' }}>
                            {item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-6">
                      <div>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total</p>
                        <p className="text-xl font-bold" style={{ color: 'var(--card-foreground)' }}>
                          {order.total}
                        </p>
                      </div>
                      {order.tracking && (
                        <div>
                          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Tracking</p>
                          <p className="text-sm font-mono" style={{ color: 'var(--card-foreground)' }}>
                            {order.tracking}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {order.status === 'delivered' ? 'Delivered' : 'Est. Delivery'}
                        </p>
                        <p className="text-sm font-medium" style={{ color: 'var(--card-foreground)' }}>
                          {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {order.status === 'shipped' && (
                        <button 
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors border"
                          style={{ 
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)',
                            backgroundColor: 'transparent'
                          }}
                        >
                          <Truck className="w-4 h-4" />
                          <span>Track Package</span>
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <button 
                          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium transition-all active:scale-95"
                          style={{ 
                            backgroundColor: 'var(--status-warning)'
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Reorder</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
