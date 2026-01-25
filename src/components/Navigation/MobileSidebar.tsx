'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import ThemeSwitcher from '../ThemeSwitcher'
import { Drawer } from '@/components/ui/drawer'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleLogout: () => void
  isLoggingOut?: boolean
  recentSearches: string[]
  handleSearchSuggestion: (suggestion: string) => void
  clearSearch: () => void
}

export default function MobileSidebar({ 
  isOpen, 
  onClose, 
  searchQuery, 
  setSearchQuery, 
  handleLogout,
  isLoggingOut = false,
  recentSearches,
  handleSearchSuggestion,
  clearSearch
}: MobileSidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      onClose()
    }
  }, [searchQuery, router, onClose])

  const handleLinkClick = useCallback(() => {
    onClose()
  }, [onClose])

  const navigationSections = useMemo(() => [
    {
      id: 'shop',
      title: 'Diamond & Jewelry Categories',
      items: [
        { href: '/diamonds', label: 'Diamonds', icon: '💎' },
        { href: '/gemstones', label: 'Gemstones', icon: '💍' },
        { href: '/jewelry', label: 'Jewelry', icon: '📿' },
        { href: '/watches', label: 'Watches', icon: '⌚' },
        { href: '/auctions', label: 'Auctions', icon: '🔨' },
        { href: '/lab-grown-diamonds', label: 'Lab Grown Diamonds', icon: '⚗️' },
        { href: '/bullions', label: 'Bullions', icon: '🥇' },
        { href: '/experience', label: 'Experience', icon: '✨' }
      ]
    },
    {
      id: 'account',
      title: 'My Account',
      items: [
        { href: '/user/profile', label: 'My Profile', icon: '👤' },
        { href: '/user/orders', label: 'Order History', icon: '📦' },
        { href: '/user/wishlist', label: 'My Wishlist', icon: '❤️' },
        { href: '/user/addresses', label: 'Saved Addresses', icon: '📍' }
      ]
    }
  ], [])

  if (!isOpen) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="w-80"
      title={
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm" style={{ borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--sidebar-accent)', color: 'var(--sidebar-primary-foreground)' }}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg">Ohana Diamonds</h2>
            <p className="text-xs opacity-75">Diamond & Jewelry Marketplace</p>
          </div>
        </div>
      }
      footer={
        <div className="space-y-4">
          {/* Theme Switcher Section */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--sidebar-accent)', borderRadius: 'var(--radius-xl)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-xs opacity-60">Switch appearance</p>
                </div>
              </div>
              <ThemeSwitcher />
            </div>
          </div>

          {/* Settings Link */}
          <Link href="/settings" onClick={handleLinkClick} className="group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:bg-accent/50 border border-border" style={{ borderRadius: 'var(--radius-xl)' }}>
            <span className="font-medium">Settings</span>
            <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] text-left border disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
            style={{ 
              color: 'var(--destructive-foreground)', 
              backgroundColor: 'var(--destructive)',
              borderRadius: 'var(--radius-xl)',
              borderColor: 'var(--destructive)'
            }}
          >
            <span className="font-medium">
              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
            </span>
            {isLoggingOut ? (
              <div className="ml-auto animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : (
              <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
              </svg>
            )}
          </button>

          {/* App Version */}
          <div className="text-center">
            <p className="text-xs opacity-60">
              Ohana Diamonds v1.0.0
            </p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        {/* Search */}
        <div className="mb-6">
          <form onSubmit={handleSearch}>
            <div className="relative group mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search diamonds, gemstones, jewelry..."
                className="w-full px-4 py-3 pl-11 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 shadow-sm text-sm bg-background"
                style={{ 
                  borderRadius: 'var(--radius-xl)'
                }}
              />
              <svg className="absolute left-3.5 top-3.5 w-4 h-4 transition-colors opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-3.5 w-5 h-5 rounded-lg transition-colors hover:bg-accent/50"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4 m-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 px-1 opacity-60">Recent Searches</h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 3).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchSuggestion(search)}
                      className="px-3 py-1 text-xs rounded-full border transition-all duration-200 hover:scale-105 bg-background"
                      style={{ 
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-6">
          {navigationSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className="flex items-center justify-between w-full text-left mb-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent/50"
                style={{ backgroundColor: activeSection === section.id ? 'var(--sidebar-accent)' : 'transparent' }}
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">
                  {section.title}
                </h3>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${activeSection === section.id ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`space-y-1 transition-all duration-300 overflow-hidden ${activeSection === section.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                {section.items.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    onClick={handleLinkClick} 
                    className="group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:bg-accent/50 border border-transparent hover:border-border" 
                    style={{ borderRadius: 'var(--radius-xl)', backgroundColor: pathname && pathname.startsWith(item.href) ? 'var(--sidebar-accent)' : 'transparent' }}
                    aria-current={pathname && pathname.startsWith(item.href) ? 'page' : undefined}
                  >
                    <span className="text-lg opacity-80">{item.icon}</span>
                    <span className="font-medium flex-1">{item.label}</span>
                    <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  )
}
