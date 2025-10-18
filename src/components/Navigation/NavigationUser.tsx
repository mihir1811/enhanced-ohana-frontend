'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/store'
import { useAppDispatch } from '@/store/hooks'
import { logoutAsync } from '@/features/auth/authSlice'
import ThemeSwitcher from '../ThemeSwitcher'
import MobileSidebar from './MobileSidebar'
import useNavigation from '@/hooks/useNavigation'
// @ts-expect-error: global CSS side-effect import without TypeScript declarations

import '@/styles/navigation.css'
import { SECTION_WIDTH } from '@/lib/constants'
import { cartService, type Cart } from '@/services'

export default function NavigationUser() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeNavDropdown, setActiveNavDropdown] = useState<string | null>(null)
  const [dropdownPositions, setDropdownPositions] = useState<{ [key: string]: { left: number, top: number } }>({})
  const [mouseLeaveTimeout, setMouseLeaveTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [cartItems] = useState(3) // Mock cart count
  const [notifications] = useState(2) // Mock notification count
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [cart, setCart] = useState<Cart | null>(null)
  const [cartLoading, setCartLoading] = useState(false)
  const [cartError, setCartError] = useState<string | null>(null)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [suggestedProducts] = useState([
    'Diamond Engagement Rings',
    'Blue Sapphire Earrings',
    'Emerald Necklace',
    'Lab Grown Diamonds',
    'Gold Wedding Bands'
  ])
  const { user, token } = useSelector((state: RootState) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Use custom navigation hook
  const {
    searchQuery,
    setSearchQuery,
    recentSearches,
    isSearchFocused,
    setIsSearchFocused,
    handleSearch: handleSearchSubmit,
    handleSearchSuggestion,
    clearSearch
  } = useNavigation()



  // Toggle dropdown and calculate position
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen)
  }, [isDropdownOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Close user dropdown if clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false)
      }

      // Close search dropdown if clicking outside
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchFocused(false)
      }

      // Close navigation dropdown if clicking outside
      if (!target || !(target as Element).closest('.nav-dropdown-container')) {
        setActiveNavDropdown(null)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
        setIsSearchFocused(false)
        setIsOpen(false)
        setActiveNavDropdown(null)
      }
    }

    const handleScroll = () => {
      // Recalculate dropdown positions on scroll
      if (activeNavDropdown) {
        const element = document.querySelector(`[data-nav-item="${activeNavDropdown}"]`) as HTMLElement
        if (element) {
          calculateNavDropdownPosition(element, activeNavDropdown)
        }
      }
    }

    const handleResize = () => {
      // Recalculate dropdown positions on resize
      if (activeNavDropdown) {
        const element = document.querySelector(`[data-nav-item="${activeNavDropdown}"]`) as HTMLElement
        if (element) {
          calculateNavDropdownPosition(element, activeNavDropdown)
        }
      }
    }

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)

      // Clear any pending timeout
      if (mouseLeaveTimeout) {
        clearTimeout(mouseLeaveTimeout)
      }
    }
  }, [setIsSearchFocused, activeNavDropdown, mouseLeaveTimeout])

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      // Position calculations no longer needed
    }

    const handleScroll = () => {
      // Position calculations no longer needed
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isDropdownOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Search shortcut (Ctrl+K)
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        searchRef.current?.querySelector('input')?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      // Logout is handled entirely on frontend now
      await dispatch(logoutAsync()).unwrap()
    } catch (error) {
      // Frontend logout should not fail, but handle edge cases
      console.warn('Logout process failed, continuing with cleanup:', error)
    } finally {
      // Clear all local storage, cookies, and redirect
      document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      localStorage.clear()
      sessionStorage.clear()
      setIsLoggingOut(false)
      router.push('/')
    }
  }, [dispatch, router])

  const loadCartForDrawer = useCallback(async () => {
    setCartLoading(true)
    try {
      setCartError(null)
      if (!token) {
        setCart(null)
        setCartError('Please login to view your cart.')
        return
      }
      const result = await cartService.getCart(token)
      if (result.success) {
        setCart(result.data)
      } else {
        setCart(result.data || null)
        setCartError(result.message || 'Failed to load cart')
      }
    } catch (error) {
      setCart(null)
      setCartError(error instanceof Error ? error.message : 'Failed to load cart')
    } finally {
      setCartLoading(false)
    }
  }, [token])

  const openCartDrawer = useCallback(() => {
    setCartDrawerVisible(true)
    setCartLoading(true)
    setCartError(null)
    loadCartForDrawer()
    // Defer to next frame for smooth transition
    requestAnimationFrame(() => setCartDrawerOpen(true))
  }, [loadCartForDrawer])

  const closeCartDrawer = useCallback(() => {
    setCartDrawerOpen(false)
    // Match duration-300 to unmount after animation
    setTimeout(() => setCartDrawerVisible(false), 300)
  }, [])

  const updateItemQuantity = useCallback(
    async (itemId: string, newQuantity: number) => {
      if (!token) {
        setCartError('Please log in to update your cart.')
        return
      }
      if (!cart) return
      if (newQuantity < 1) return

      setCartError(null)
      setUpdatingItems((prev) => {
        const next = new Set(prev)
        next.add(itemId)
        return next
      })
      try {
        await cartService.updateCartItem(itemId, { quantity: newQuantity }, token)
        const refreshed = await cartService.getCart(token)
        if (refreshed.success) {
          setCart(refreshed.data)
        } else {
          setCartError(refreshed.message || 'Failed to refresh cart.')
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update cart.'
        setCartError(message)
      } finally {
        setUpdatingItems((prev) => {
          const next = new Set(prev)
          next.delete(itemId)
          return next
        })
      }
    },
    [token, cart]
  )

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    handleSearchSubmit()
  }, [handleSearchSubmit])

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return suggestedProducts.slice(0, 3)
    return suggestedProducts.filter(product =>
      product.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3)
  }, [searchQuery, suggestedProducts])

  const navigationItems = useMemo(() => [
    {
      href: '/diamonds',
      label: 'Diamonds',
      hasDropdown: true,
      dropdownItems: [
        { href: '/diamonds', params: { category: 'single', diamondType: 'natural' }, label: 'Single Diamond', description: 'Individual certified diamonds' },
        { href: '/diamonds', params: { category: 'melee', diamondType: 'natural' }, label: 'Melee Diamonds', description: 'Small diamonds for jewelry making' },
        { href: '/diamonds', params: { diamondType: 'lab-grown', category: 'single' }, label: 'Lab Grown Diamonds', description: 'Sustainable lab-created diamonds' }
        , { href: '/diamonds', params: { category: 'melee', diamondType: 'lab-grown' }, label: 'Lab Grown Melee Diamonds', description: 'Small sustainable lab-created diamonds' }
      ]
    },
    {
      href: '/gemstones',
      label: 'Gemstones',
      hasDropdown: true,
      dropdownItems: [
        { href: '/gemstones?category=single', label: 'Single Gemstones', description: 'Individual certified gemstones' },
        { href: '/gemstones?category=melee', label: 'Melee Gemstones', description: 'Small gemstones for jewelry making' }
      ]
    },
    { href: '/jewelry', label: 'Jewelry' },
    { href: '/auctions', label: 'Auctions' },
    { href: '/diamond-education', label: 'Diamond Education' }
  ], [])

  const calculateNavDropdownPosition = (element: HTMLElement, itemHref: string) => {
    try {
      const rect = element.getBoundingClientRect()
      const dropdownWidth = 320 // 20rem (w-80)
      const viewportWidth = window.innerWidth

      // Calculate the center position of the link
      const linkCenter = rect.left + (rect.width / 2)

      // Calculate ideal left position (centered on link)
      let leftPosition = linkCenter - (dropdownWidth / 2)

      // Ensure dropdown doesn't go off-screen on the left
      if (leftPosition < 16) {
        leftPosition = 16
      }

      // Ensure dropdown doesn't go off-screen on the right
      if (leftPosition + dropdownWidth > viewportWidth - 16) {
        leftPosition = viewportWidth - dropdownWidth - 16
      }

      setDropdownPositions(prev => ({
        ...prev,
        [itemHref]: {
          left: leftPosition,
          top: rect.bottom + 8 // 8px gap below the link
        }
      }))
    } catch (error) {
      console.error('Error calculating dropdown position:', error)
    }
  }

  const handleNavMouseEnter = (itemId: string, event: React.MouseEvent<HTMLElement>) => {
    // Clear any existing timeout
    if (mouseLeaveTimeout) {
      clearTimeout(mouseLeaveTimeout)
      setMouseLeaveTimeout(null)
    }

    const target = event.currentTarget as HTMLElement
    // Small delay to ensure the element is properly rendered
    requestAnimationFrame(() => {
      calculateNavDropdownPosition(target, itemId)
      setActiveNavDropdown(itemId)
    })
  }

  const handleNavMouseLeave = () => {
    // Small delay to prevent flickering when moving between elements
    const timeout = setTimeout(() => {
      setActiveNavDropdown(null)
    }, 150)
    setMouseLeaveTimeout(timeout)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-slate-950 border-b border-amber-500/20 py-2 hidden lg:block" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6" style={{ color: 'var(--muted-foreground)' }}>
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--chart-1)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>GIA Certified Diamonds</span>
              </span>
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--chart-1)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                <span>Secure Diamond Trading</span>
              </span>
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--chart-1)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Worldwide Shipping</span>
              </span>
            </div>
            <div className="flex items-center space-x-4" style={{ color: 'var(--muted-foreground)' }}>
              <Link href="/diamond-certification" className="hover:text-amber-400 transition-colors" style={{ '--hover-color': 'var(--chart-1)' } as React.CSSProperties}>Certificate Verification</Link>
              <Link href="/expert-consultation" className="hover:text-amber-400 transition-colors" style={{ '--hover-color': 'var(--chart-1)' } as React.CSSProperties}>Expert Consultation</Link>
              <Link href="/contact" className="hover:text-amber-400 transition-colors" style={{ '--hover-color': 'var(--chart-1)' } as React.CSSProperties}>Support</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-lg w-full" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <nav className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8 w-full`}>
          <div className="flex items-center justify-between h-16 lg:h-20 w-full min-w-0 gap-4">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3 flex-shrink-0 min-w-fit">
              <Link href="/user" className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(135deg, var(--chart-1), var(--chart-4))', borderRadius: 'var(--radius-lg)' }}>
                    <svg className="w-5 h-5 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-foreground)' }}>
                      <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2ZM21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22S11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2S12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full animate-pulse" style={{ backgroundColor: 'var(--chart-2)' }}></div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center min-w-0 overflow-hidden">
              <div className="flex items-center space-x-2 max-w-fit">
                {navigationItems.map((item) => (
                  <div
                    key={item.href}
                    className="relative nav-dropdown-container"
                    data-nav-item={item.href}
                    onMouseEnter={(e) => item.hasDropdown && handleNavMouseEnter(item.href, e)}
                    onMouseLeave={handleNavMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className="relative group px-4 py-2.5 transition-all duration-300 font-medium text-sm rounded-lg hover:scale-[1.02] block nav-item"
                      style={{
                        color: 'var(--muted-foreground)',
                        borderRadius: 'var(--radius-lg)'
                      }}
                    >
                      <span
                        className="relative z-10 group-hover:font-semibold transition-all duration-300 flex items-center gap-1"
                        style={{
                          color: 'var(--foreground)',
                          filter: 'brightness(0.8)'
                        }}
                      >
                        {item.label}
                        {item.hasDropdown && (
                          <svg
                            className={`w-3 h-3 dropdown-arrow ${activeNavDropdown === item.href ? 'active' : ''
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </span>

                      {/* Modern hover background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{
                          background: 'var(--accent)',
                          borderRadius: 'var(--radius-lg)',
                          backdropFilter: 'blur(8px)'
                        }}
                      ></div>

                      {/* Professional underline indicator */}
                      <div
                        className="absolute bottom-1 left-1/2 w-0 h-0.5 group-hover:w-3/4 group-hover:left-[12.5%] transition-all duration-300 rounded-full"
                        style={{
                          backgroundColor: 'var(--primary)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      ></div>
                    </Link>

                    {/* Desktop Dropdown */}
                    {item.hasDropdown && activeNavDropdown === item.href && (
                      <>
                        {/* Bridge area to prevent dropdown from closing */}
                        <div className="absolute top-full left-0 right-0 h-2 bg-transparent"></div>

                        <div
                          className="fixed w-80 rounded-lg shadow-xl border z-50 overflow-hidden nav-dropdown-animate"
                          style={{
                            backgroundColor: 'var(--background)',
                            borderColor: 'var(--border)',
                            left: dropdownPositions[item.href]?.left || 'auto',
                            top: dropdownPositions[item.href]?.top || 'auto',
                            visibility: dropdownPositions[item.href] ? 'visible' : 'hidden'
                          }}
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">{item.label === 'Diamonds' ? '💎' : '🔮'}</span>
                              <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                                {item.label}
                              </h3>
                            </div>
                            <div className="grid gap-2">
                              {item.dropdownItems?.map((dropdownItem) => (
                                item.label === 'Diamonds' && 'params' in dropdownItem ? (
                                  // For diamonds, use a button that just sets URL params without redirecting
                                  <button
                                    key={`${dropdownItem.href}-${JSON.stringify(dropdownItem.params)}`}
                                    onClick={() => {
                                      // Navigate to diamonds page with params in URL but don't trigger search
                                      router.push(`${dropdownItem.href}?${new URLSearchParams((dropdownItem as { params: Record<string, string> }).params).toString()}`)
                                    }}
                                    className="block p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] w-full text-left"
                                    style={{
                                      backgroundColor: 'var(--muted)',
                                      color: 'var(--foreground)'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = 'var(--accent)'
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'var(--muted)'
                                    }}
                                  >
                                    <div className="font-medium text-sm">{dropdownItem.label}</div>
                                    <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                                      {dropdownItem.description}
                                    </div>
                                  </button>
                                ) : (
                                  // For other items, use regular Link
                                  <Link
                                    key={`${dropdownItem.href}-${dropdownItem.label}`}
                                    href={'params' in dropdownItem ? `${dropdownItem.href}?${new URLSearchParams((dropdownItem as { params: Record<string, string> }).params).toString()}` : dropdownItem.href}
                                    className="block p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                                    style={{
                                      backgroundColor: 'var(--muted)',
                                      color: 'var(--foreground)'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = 'var(--accent)'
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'var(--muted)'
                                    }}
                                  >
                                    <div className="font-medium text-sm">{dropdownItem.label}</div>
                                    <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                                      {dropdownItem.description}
                                    </div>
                                  </Link>
                                )
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Search, Cart, and User Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0 min-w-fit">
              {/* Enhanced Search with Autocomplete */}
              <div className="hidden lg:block flex-shrink-0 relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search diamonds, gemstones, jewelry... (Ctrl+K)"
                    className="w-40 lg:w-44 xl:w-48 px-3 py-2 pl-9 pr-8 border rounded-lg text-sm transition-all duration-300 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 focus:w-56"
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      borderRadius: 'var(--radius-lg)'
                    } as React.CSSProperties}
                  />
                  <svg className="absolute left-2.5 top-2.5 w-4 h-4 transition-colors group-focus-within:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--muted-foreground)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </form>

                {/* Search Suggestions Dropdown */}
                {isSearchFocused && (
                  <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl rounded-xl border shadow-xl z-50 max-h-80 overflow-y-auto" style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: 'var(--radius-xl)' }}>
                    <div className="p-4 space-y-4">
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>Recent Searches</h4>
                          <div className="space-y-1">
                            {recentSearches.map((search, index) => (
                              <button
                                key={index}
                                onClick={() => handleSearchSuggestion(search)}
                                className="flex items-center space-x-3 w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                                style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--muted-foreground)' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{search}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Products */}
                      {filteredSuggestions.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>Suggested Products</h4>
                          <div className="space-y-1">
                            {filteredSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSearchSuggestion(suggestion)}
                                className="flex items-center space-x-3 w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                                style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--chart-1)' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="text-sm">{suggestion}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Link href="/diamonds" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors" style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}>
                            <span className="text-sm">Browse Diamonds</span>
                          </Link>
                          <Link href="/gemstones" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors" style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}>
                            <span className="text-sm">Browse Gemstones</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <Link href="/notifications" className="relative group p-2 transition-all duration-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg flex-shrink-0 min-w-fit" style={{ color: 'var(--foreground)', borderRadius: 'var(--radius-md)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9a6 6 0 10-12 0v3l-5 5h5a6 6 0 0012 0z" />
                </svg>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse" style={{ background: 'linear-gradient(90deg, var(--chart-2), var(--chart-3))', color: 'var(--primary-foreground)' }}>
                    {notifications}
                  </span>
                )}
              </Link>

              {/* Shopping Cart */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="relative group p-2 transition-all duration-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg flex-shrink-0 min-w-fit"
                style={{ color: 'var(--foreground)', borderRadius: 'var(--radius-md)' }}
                aria-label="Open cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 10v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-1.4-7M7 13l1.5 7m8.5-7L15 20" />
                </svg>
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse" style={{ background: 'linear-gradient(90deg, var(--chart-1), var(--chart-4))', color: 'var(--primary-foreground)' }}>
                    {cartItems}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              <Link href="/user/wishlist" className="relative group p-2 transition-all duration-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg flex-shrink-0 min-w-fit" style={{ color: 'var(--foreground)', borderRadius: 'var(--radius-md)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Theme Switcher */}
              <div className="hidden sm:block flex-shrink-0 min-w-fit">
                <ThemeSwitcher />
              </div>

              {/* User Profile Dropdown */}
              {
                !user?.email ? (
                  <Link href="/login" className="px-3 py-2 lg:px-4 lg:py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors text-sm">
                    Login
                  </Link>
                ) : (
                  <div className="relative flex-shrink-0 min-w-fit" ref={dropdownRef}>
                    <button
                      ref={buttonRef}
                      onClick={toggleDropdown}
                      className={`flex items-center space-x-2 p-1 transition-all duration-300 rounded-lg ${isDropdownOpen
                          ? 'text-amber-500 bg-slate-100 dark:bg-slate-800/50'
                          : 'hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      style={{ color: isDropdownOpen ? 'var(--chart-1)' : 'var(--foreground)', borderRadius: 'var(--radius-md)' }}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg" style={{ background: 'linear-gradient(135deg, var(--chart-1), var(--chart-4))', color: 'var(--primary-foreground)', borderRadius: 'var(--radius-md)' }}>
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="hidden lg:block text-left">
                        <div className="font-medium text-sm" style={{ color: isDropdownOpen ? 'var(--chart-1)' : 'var(--foreground)' }}>{user?.name || 'User'}</div>
                        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Premium</div>
                      </div>
                      <svg className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div
                        className="absolute w-64 bg-white dark:bg-slate-900 rounded-2xl border shadow-2xl z-[9999] dropdown-enter"
                        style={{
                          top: 'calc(100% + 8px)',
                          right: 0,
                          backgroundColor: 'var(--popover)',
                          borderColor: 'var(--border)',
                          borderRadius: 'var(--radius-xl)',
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)'
                        }}
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <div className="p-4">
                          {/* User Info */}
                          <div className="flex items-center space-x-3 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, var(--chart-1), var(--chart-4))', color: 'var(--primary-foreground)', borderRadius: 'var(--radius-lg)' }}>
                              {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-medium" style={{ color: 'var(--popover-foreground)' }}>{user?.name || 'User'}</div>
                              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{user?.email || 'user@example.com'}</div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2 space-y-1">
                            <Link
                              href="/user"
                              className="flex items-center space-x-3 px-3 py-3 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 group"
                              style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="w-5 h-5 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4m8-4v4" />
                              </svg>
                              <span className="font-medium">Dashboard</span>
                            </Link>

                            <Link
                              href="/user/profile"
                              className="flex items-center space-x-3 px-3 py-3 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 group"
                              style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="w-5 h-5 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">My Profile</span>
                            </Link>
                            <Link
                              href="/become-seller"
                              className="flex items-center space-x-3 px-3 py-3 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 group"
                              style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="w-5 h-5 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span className="font-medium">Become Seller</span>
                            </Link>
                            <Link
                              href="/user/orders"
                              className="flex items-center space-x-3 px-3 py-3 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 group"
                              style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="w-5 h-5 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              <span className="font-medium">Order History</span>
                            </Link>

                            <Link
                              href="/user/cart"
                              className="flex items-center space-x-3 px-3 py-3 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 group"
                              style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="w-5 h-5 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 10v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-1.4-7M7 13l1.5 7m8.5-7L15 20" />
                              </svg>
                              <span className="font-medium">Shopping Cart</span>
                            </Link>

                            <Link
                              href="/user/wishlist"
                              className="flex items-center space-x-3 px-3 py-3 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 group"
                              style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="w-5 h-5 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span className="font-medium">My Wishlist</span>
                            </Link>

                            <Link
                              href="/user/reviews"
                              className="flex items-center space-x-3 px-3 py-3 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 group"
                              style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="w-5 h-5 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span className="font-medium">My Reviews</span>
                            </Link>

                            <Link
                              href="/user/chat"
                              className="flex items-center space-x-3 px-3 py-3 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 group"
                              style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="w-5 h-5 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
                              </svg>
                              <span className="font-medium">Messages</span>
                            </Link>

                            <Link
                              href="/user/settings"
                              className="flex items-center space-x-3 px-3 py-3 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 group"
                              style={{ color: 'var(--popover-foreground)', borderRadius: 'var(--radius-lg)' }}
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <svg className="w-5 h-5 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-medium">Settings</span>
                            </Link>
                          </div>

                          <div className="border-t pt-2 mt-2" style={{ borderColor: 'var(--border)' }}>
                            <button
                              onClick={() => {
                                handleLogout()
                                setIsDropdownOpen(false)
                              }}
                              disabled={isLoggingOut}
                              className="flex items-center space-x-3 px-3 py-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 w-full group disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ borderRadius: 'var(--radius-lg)' }}
                              role="menuitem"
                            >
                              {isLoggingOut ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                              )}
                              <span className="font-medium">{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }


              {/* Mobile Menu Button */}
              <div className="lg:hidden flex-shrink-0 min-w-fit">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
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
          </div>

          {/* Tablet Navigation - Below Header */}
          <div className="hidden md:flex lg:hidden items-center justify-center py-3 border-t overflow-visible relative" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide px-4 max-w-full">
              {navigationItems.map((item) => (
                <div
                  key={item.href}
                  className="relative nav-dropdown-container"
                  data-nav-item={item.href}
                  onMouseEnter={(e) => item.hasDropdown && handleNavMouseEnter(item.href, e)}
                  onMouseLeave={handleNavMouseLeave}
                >
                  <Link
                    href={item.href}
                    className="whitespace-nowrap px-4 py-2 text-sm font-medium hover:text-amber-500 transition-colors flex items-center gap-1"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <svg
                        className={`w-3 h-3 dropdown-arrow ${activeNavDropdown === item.href ? 'active' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Tablet Dropdown */}
                  {item.hasDropdown && activeNavDropdown === item.href && (
                    <>
                      {/* Bridge area to prevent dropdown from closing */}
                      <div className="absolute top-full left-0 right-0 h-2 bg-transparent"></div>

                      <div
                        className="fixed w-80 rounded-lg shadow-xl border z-50 overflow-hidden nav-dropdown-animate"
                        style={{
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)',
                          left: dropdownPositions[item.href]?.left || 'auto',
                          top: dropdownPositions[item.href]?.top || 'auto',
                          visibility: dropdownPositions[item.href] ? 'visible' : 'hidden'
                        }}
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">{item.label === 'Diamonds' ? '💎' : '🔮'}</span>
                            <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                              {item.label}
                            </h3>
                          </div>
                          <div className="grid gap-2">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={`${dropdownItem.href}-${dropdownItem.label}`}
                                href={dropdownItem.href}
                                className="block p-3 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                                style={{
                                  backgroundColor: 'var(--muted)',
                                  color: 'var(--foreground)'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'var(--accent)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'var(--muted)'
                                }}
                              >
                                <div className="font-medium text-sm">{dropdownItem.label}</div>
                                <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                                  {dropdownItem.description}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <Link href="/products/bullions" className="whitespace-nowrap px-4 py-2 text-sm font-medium hover:text-amber-500 transition-colors" style={{ color: 'var(--foreground)' }}>
                Bullions
              </Link>
              <Link href="/experience" className="whitespace-nowrap px-4 py-2 text-sm font-medium hover:text-amber-500 transition-colors" style={{ color: 'var(--foreground)' }}>
                Experience
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Cart Drawer (right side) */}
      {cartDrawerVisible && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${cartDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={closeCartDrawer}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div
            className={`fixed top-0 right-0 w-11/12 max-w-sm h-full bg-white dark:bg-slate-900 z-[9999] shadow-2xl p-4 flex flex-col transition-transform duration-300 ${cartDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
            role="dialog"
            aria-modal="true"
            aria-label="Cart drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 10v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-1.4-7M7 13l1.5 7m8.5-7L15 20" />
                </svg>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Your Cart</h3>
                  <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                    {cart?.itemCount ?? 0}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCartDrawer}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
                style={{ borderRadius: 'var(--radius-md)', color: 'var(--muted-foreground)' }}
                aria-label="Close cart"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Products (scrollable) */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cartLoading ? (
                <div className="space-y-3">
                  {[1,2,3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg border animate-pulse" style={{ borderColor: 'var(--border)' }}>
                      <div className="w-14 h-14 rounded bg-muted" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-3 w-2/3 rounded bg-muted" />
                        <div className="h-3 w-1/3 rounded bg-muted" />
                      </div>
                      <div className="h-3 w-12 rounded bg-muted" />
                    </div>
                  ))}
                </div>
              ) : cartError ? (
                <div className="space-y-3">
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{cartError}</p>
                  <Link href="/user/cart" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    View Cart
                  </Link>
                </div>
              ) : cart && cart.items.length > 0 ? (
                <>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    You have <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{cart.itemCount}</span> items in your cart.
                  </p>
                  <div className="space-y-3">
                    {cart.items.slice(0, 6).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                        <Image
                          src={item.image && item.image.trim() !== '' ? item.image : '/images/round.png'}
                          alt={item.name || 'Product'}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded object-cover bg-[var(--muted)]"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/round.png' }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{item.name}</div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                              {item.productType}
                            </span>
                          </div>
                          <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
                            by {item.seller}{item.certification ? ` • ${item.certification}` : ''}
                          </div>
                          <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
                            Qty {item.quantity}
                            {item.specifications?.caratWeight ? ` • ${item.specifications.caratWeight}ct` : ''}
                            {item.specifications?.color ? ` • ${item.specifications.color}` : ''}
                            {item.specifications?.clarity ? ` • ${item.specifications.clarity}` : ''}
                          </div>
                        </div>
                        <div className="text-right min-w-[132px]">
                          {item.originalPrice && item.originalPrice > item.price ? (
                            <div className="text-xs line-through" style={{ color: 'var(--muted-foreground)' }}>
                              ${item.originalPrice.toFixed(2)}
                            </div>
                          ) : null}
                          <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.savings && item.savings > 0 ? (
                            <div className="text-[11px] text-green-600">Save ${item.savings.toFixed(2)}</div>
                          ) : null}
                          <div className="mt-2 inline-flex items-center select-none">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={updatingItems.has(item.id) || item.quantity <= 1}
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-l border border-[var(--border)] text-sm hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              −
                            </button>
                            <div className="w-9 h-7 flex items-center justify-center border-t border-b border-[var(--border)] text-xs">
                              {item.quantity}
                            </div>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              disabled={updatingItems.has(item.id)}
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-r border border-[var(--border)] text-sm hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Footer will render below */}
                </>
              ) : (
                <div className="space-y-3 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--muted-foreground)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 10v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-1.4-7M7 13l1.5 7m8.5-7L15 20" />
                    </svg>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Your cart is empty.</p>
                  <Link href="/diamonds" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-colors">
                    Browse products
                  </Link>
                </div>
              )}
            </div>

            {/* Footer (sticky) */}
            {!cartLoading && !cartError && cart && cart.items.length > 0 && (
              <div className="border-t pt-3 space-y-2" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>${cart.subtotal.toFixed(2)}</span>
                </div>
                {cart.totalSavings > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Savings</span>
                    <span className="font-semibold text-green-600">-${cart.totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Shipping</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>${cart.shipping.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Tax</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Total</span>
                  <span className="text-base font-bold" style={{ color: 'var(--foreground)' }}>${cart.total.toFixed(2)}</span>
                </div>
                <div className="mt-3">
                  <Link
                    href="/user/cart"
                    aria-label={`Go to cart with ${cart.items.reduce((sum, i) => sum + i.quantity, 0)} items, total $${cart.total.toFixed(2)}`}
                    className="group w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-[var(--background)] transition-colors font-semibold shadow-sm"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6" />
                    </svg>
                    <span>Go to Cart</span>
                    <span className="text-xs opacity-80">
                      ({cart.items.reduce((sum, i) => sum + i.quantity, 0)} items • ${cart.total.toFixed(2)})
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Mobile Sidebar - Outside of header for proper semantic structure */}
      <MobileSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        recentSearches={recentSearches}
        handleSearchSuggestion={handleSearchSuggestion}
        clearSearch={clearSearch}
      />
    </>
  )
}