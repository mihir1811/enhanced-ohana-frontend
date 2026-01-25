'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Menu } from 'lucide-react'
import { Drawer } from '@/components/ui/drawer'

interface SellerSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/seller/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Products',
    href: '/seller/products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
      </svg>
    ),
  },
  {
    name: 'Orders',
    href: '/seller/orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    name: 'Analytics',
    href: '/seller/analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Inventory',
    href: '/seller/inventory',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    name: 'Messages',
    href: '/seller/messages',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    name: 'Profile',
    href: '/seller/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function SellerSidebar({ sidebarOpen, setSidebarOpen }: SellerSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar using Drawer */}
      <Drawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        position="left"
        width="w-72"
        title={
          <Link href="/seller/dashboard" className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--sidebar-primary)' }}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: 'var(--sidebar-primary-foreground)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 
                className="text-lg font-bold"
                style={{ color: 'var(--sidebar-foreground)' }}
              >
                Ohana Gems
              </h1>
            </div>
          </Link>
        }
      >
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'shadow-sm' 
                        : 'hover:bg-opacity-10'
                    }`}
                    style={{
                      backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                      color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                    }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </Drawer>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div 
          className="flex grow flex-col gap-y-5 overflow-y-auto border-r px-6 pb-4"
          style={{ 
            backgroundColor: 'var(--sidebar)',
            borderColor: 'var(--sidebar-border)'
          }}
        >
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/seller/dashboard" className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--sidebar-primary)' }}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--sidebar-primary-foreground)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h1 
                  className="text-xl font-bold"
                  style={{ color: 'var(--sidebar-foreground)' }}
                >
                  Ohana Gems
                </h1>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Seller Dashboard
                </p>
              </div>
            </Link>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-semibold transition-all duration-200 ${
                            isActive 
                              ? 'shadow-sm transform scale-[1.02]' 
                              : 'hover:bg-opacity-10 hover:scale-[1.01]'
                          }`}
                          style={{
                            backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                            color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
                          }}
                        >
                          <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                            {item.icon}
                          </div>
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
