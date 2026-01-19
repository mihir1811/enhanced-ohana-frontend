'use client'

import { useState, useEffect } from 'react'
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/features/auth/authSlice'
import { useRouter } from 'next/navigation'
import Loader from './Loader'
import ThemeSwitcher from '@/components/ThemeSwitcher'

interface SellerHeaderProps {
  setSidebarOpen: (open: boolean) => void
}

export default function SellerHeader({ setSidebarOpen }: SellerHeaderProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const [notificationsLoading, setNotificationsLoading] = useState(true)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Simulate notification loading
    const timer = setTimeout(() => {
      setNotificationsLoading(false)
      setNotificationCount(3)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  return (
    <div 
      className="sticky top-0 z-40 border-b"
      style={{ 
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="flex h-16 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="p-2.5 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(true)}
          style={{ color: 'var(--foreground)' }}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>

        {/* Separator */}
        <div 
          className="h-6 w-px lg:hidden"
          style={{ backgroundColor: 'var(--border)' }}
        />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          {/* Search */}
          <form className="relative flex flex-1 justify-between w-full items-center" action="#" method="GET">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <div className="relative max-w-2xl">
              <Search 
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: 'var(--muted-foreground)' }}
              />
              <input
                id="search-field"
                className="block w-full pl-10 pr-3 py-2 rounded-full border border-gray-200 bg-white dark:bg-[#23272f] shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm transition hover:border-gray-400"
                placeholder="Search products, orders..."
                type="search"
                name="search"
                style={{
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--input, #fff)'
                }}
              />
            </div>
          </form>
          
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <ThemeSwitcher />
            {/* Notifications */}
            <button
              type="button"
              className="relative p-2.5 hover:bg-opacity-10 rounded-lg transition-colors cursor-pointer"
              style={{ color: 'var(--foreground)' }}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              {/* Notification badge */}
              {notificationsLoading ? (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center">
                  <Loader size="sm" />
                </div>
              ) : notificationCount > 0 ? (
                <span 
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs font-medium flex items-center justify-center animate-pulse"
                  style={{ 
                    backgroundColor: 'var(--destructive)',
                    color: 'var(--destructive-foreground)'
                  }}
                >
                  {notificationCount}
                </span>
              ) : null}
            </button>

            {/* Separator */}
            <div 
              className="hidden lg:block lg:h-6 lg:w-px"
              style={{ backgroundColor: 'var(--border)' }}
            />

            {/* Profile dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-x-3 p-1.5 text-sm leading-6 hover:bg-opacity-10 rounded-lg transition-colors cursor-pointer"
                  style={{ color: 'var(--foreground)' }}
                >
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <User className="h-5 w-5" style={{ color: 'var(--muted-foreground)' }} />
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span 
                      className="ml-2 text-sm font-semibold leading-6"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {user?.name || 'Seller'}
                    </span>
                    <svg 
                      className="ml-2 h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[240px] rounded-xl p-3 shadow-lg border"
                  style={{ 
                    backgroundColor: 'var(--popover)',
                    borderColor: 'var(--border)',
                    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)'
                  }}
                  sideOffset={5}
                >
                  <DropdownMenu.Item 
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted transition-colors"
                    style={{ color: 'var(--popover-foreground)' }}
                  >
                    <User className="h-4 w-4" />
                    View Profile
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Item 
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted transition-colors"
                    style={{ color: 'var(--popover-foreground)' }}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Separator 
                    className="my-2 h-px"
                    style={{ backgroundColor: 'var(--border)' }}
                  />
                  
                  <DropdownMenu.Item 
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-destructive/10 transition-colors"
                    style={{ color: 'var(--destructive)' }}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </div>
  )
}
