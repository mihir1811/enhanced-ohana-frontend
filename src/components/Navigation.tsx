'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RootState } from '../store'
import { useAppDispatch } from '../store/hooks'
import { logout, logoutAsync } from '../features/auth/authSlice'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    // Get role from cookie if user is not in Redux store yet
    const cookies = document.cookie.split(';')
    const roleCookie = cookies.find(cookie => cookie.trim().startsWith('role='))
    if (roleCookie) {
      setUserRole(roleCookie.split('=')[1])
    }
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // Logout is handled entirely on frontend now
      await dispatch(logoutAsync()).unwrap()
    } catch (error) {
      // Frontend logout should not fail, but handle edge cases
      console.warn('Logout process failed, continuing with cleanup:', error)
    } finally {
      // Clear all local storage, cookies, and redirect
      document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      localStorage.clear()
      sessionStorage.clear()
      setIsLoggingOut(false)
      router.push('/login')
    }
  }

  const currentRole = user?.role || userRole

  const getNavigationItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { href: '/admin', label: 'Dashboard', icon: '🏠' },
          { href: '/admin/users', label: 'Users', icon: '👥' },
          { href: '/admin/sellers', label: 'Sellers', icon: '🏪' },
          { href: '/admin/products', label: 'Products', icon: '💎' },
          { href: '/admin/orders', label: 'Orders', icon: '📦' },
        ]
      case 'seller':
        return [
          { href: '/seller/dashboard', label: 'Dashboard', icon: '🏠' },
          { href: '/seller/add-product', label: 'Add Product', icon: '➕' },
          { href: '/seller/listings', label: 'My Listings', icon: '📋' },
          { href: '/seller/orders', label: 'Orders', icon: '📦' },
          { href: '/seller/stats', label: 'Analytics', icon: '📊' },
        ]
      default: // user
        return [
          { href: '/user', label: 'Home', icon: '🏠' },
          { href: '/user/diamonds', label: 'Diamonds', icon: '💎' },
          { href: '/user/gemstones', label: 'Gemstones', icon: '💍' },
          { href: '/user/jewelries', label: 'Jewelry', icon: '👑' },
          { href: '/user/cart', label: 'Cart', icon: '🛒' },
        ]
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={currentRole === 'seller' ? '/seller/dashboard' : currentRole === 'admin' ? '/admin' : '/user'} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2ZM21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22S11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2S12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Ohana Gems
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-amber-500/30"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="text-sm">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-slate-400 capitalize">{user.role}</p>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-2 text-slate-300 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              )}
              <span className="hidden md:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-slate-300 hover:text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 text-slate-300 hover:text-amber-400 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile User Info */}
              {user && (
                <div className="flex items-center space-x-3 px-3 py-2 border-t border-white/10 mt-4 pt-4">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-amber-500/30"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-slate-400 text-sm capitalize">{user.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
