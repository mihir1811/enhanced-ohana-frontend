'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/store'
import ThemeSwitcher from '../ThemeSwitcher'
import MobileSidebar from './MobileSidebar'
import useNavigation from '@/hooks/useNavigation'
import '@/styles/navigation.css'

export default function NavigationUser() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const [activeNavDropdown, setActiveNavDropdown] = useState<string | null>(null)
  const [cartItems] = useState(3) // Mock cart count
  const [notifications] = useState(2) // Mock notification count
  const [suggestedProducts] = useState([
    'Diamond Engagement Rings',
    'Blue Sapphire Earrings',
    'Emerald Necklace',
    'Lab Grown Diamonds',
    'Gold Wedding Bands'
  ])
  const { user } = useSelector((state: RootState) => state.auth)
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

  // Calculate dropdown position
  const calculateDropdownPosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const dropdownWidth = 256 // 64 * 4 (w-64 in Tailwind)
      
      // Calculate position
      let top = rect.bottom + scrollTop + 8 // 8px gap below button
      let right = window.innerWidth - rect.right // Right align with button
      
      // Ensure dropdown doesn't go off-screen horizontally
      if (right < 16) { // 16px minimum margin
        right = 16
      }
      
      // Ensure dropdown doesn't go off-screen horizontally on the right
      if (window.innerWidth - right < dropdownWidth + 16) {
        right = window.innerWidth - dropdownWidth - 16
      }
      
      // Ensure dropdown doesn't go off-screen vertically
      const maxHeight = 400 // Approximate dropdown height
      if (top + maxHeight > window.innerHeight + scrollTop) {
        top = rect.top + scrollTop - maxHeight - 8 // Position above button
      }
      
      setDropdownPosition({ top, right })
    }
  }, [])

  // Toggle dropdown and calculate position
  const toggleDropdown = useCallback(() => {
    if (!isDropdownOpen) {
      calculateDropdownPosition()
    }
    setIsDropdownOpen(!isDropdownOpen)
  }, [isDropdownOpen, calculateDropdownPosition])

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
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
        setIsSearchFocused(false)
        setIsOpen(false)
      }
    }

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [setIsSearchFocused])

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isDropdownOpen) {
        calculateDropdownPosition()
      }
    }

    const handleScroll = () => {
      if (isDropdownOpen) {
        calculateDropdownPosition()
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isDropdownOpen, calculateDropdownPosition])

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

  const handleLogout = useCallback(() => {
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    router.push('/')
  }, [router])

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
      href: '/products/diamonds', 
      label: 'Diamonds',
      hasDropdown: true,
      dropdownItems: [
        { href: '/products/diamonds/single', label: 'Single Diamond', description: 'Individual certified diamonds' },
        { href: '/products/diamonds/melee', label: 'Melee Diamond', description: 'Small diamonds for jewelry making' },
        { href: '/products/diamonds/lab-grown', label: 'Lab Grown Diamond', description: 'Sustainable lab-created diamonds' }
      ]
    },
    { 
      href: '/products/gemstones', 
      label: 'Gemstones',
      hasDropdown: true,
      dropdownItems: [
        { href: '/products/gemstones/ruby', label: 'Ruby', description: 'Premium red gemstones' },
        { href: '/products/gemstones/sapphire', label: 'Sapphire', description: 'Blue and fancy sapphires' },
        { href: '/products/gemstones/emerald', label: 'Emerald', description: 'Vibrant green emeralds' },
        { href: '/products/gemstones/precious', label: 'Precious Stones', description: 'All premium gemstones' }
      ]
    },
    { 
      href: '/products/jewelry', 
      label: 'Jewelry',
      hasDropdown: true,
      dropdownItems: [
        { href: '/products/jewelry/rings', label: 'Rings', description: 'Engagement & wedding rings' },
        { href: '/products/jewelry/necklaces', label: 'Necklaces', description: 'Diamond & gemstone necklaces' },
        { href: '/products/jewelry/earrings', label: 'Earrings', description: 'Elegant earring collections' },
        { href: '/products/jewelry/bracelets', label: 'Bracelets', description: 'Tennis & charm bracelets' }
      ]
    },
    { href: '/auction', label: 'Auction', hasDropdown: false },
    { href: '/products/lab-grown', label: 'Lab Grown Diamonds', hasDropdown: false },
    { href: '/diamond-education', label: 'Diamond Education', hasDropdown: false }
  ], [])

  return (
    <>
      {/* Top Bar */}
      <div className="bg-slate-950 border-b border-amber-500/20 py-2 hidden lg:block" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
        <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
          <div className="flex items-center justify-between h-16 lg:h-20 w-full min-w-0 gap-4">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3 flex-shrink-0 min-w-fit">
              <Link href="/user" className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(135deg, var(--chart-1), var(--chart-4))', borderRadius: 'var(--radius-lg)' }}>
                    <svg className="w-5 h-5 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-foreground)' }}>
                      <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2ZM21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22S11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2S12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full animate-pulse" style={{ backgroundColor: 'var(--chart-2)' }}></div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center min-w-0 overflow-visible">
              <div className="flex items-center space-x-2 max-w-fit">
                {navigationItems.map((item) => (
                  <div
                    key={item.href}
                    className="relative group"
                    onMouseEnter={() => item.hasDropdown && setActiveNavDropdown(item.label)}
                    onMouseLeave={() => item.hasDropdown && setActiveNavDropdown(null)}
                  >
                    <Link 
                      href={item.href} 
                      className="relative group px-4 py-2.5 transition-all duration-300 font-medium text-sm rounded-lg hover:scale-[1.02] flex items-center space-x-1"
                      style={{ 
                        color: 'var(--muted-foreground)',
                        borderRadius: 'var(--radius-lg)'
                      }}
                    >
                      <span 
                        className="relative z-10 group-hover:font-semibold transition-all duration-300"
                        style={{ 
                          color: 'var(--foreground)',
                          filter: 'brightness(0.8)'
                        }}
                      >{item.label}</span>
                      
                      {item.hasDropdown && (
                        <svg 
                          className={`w-3 h-3 transition-transform duration-300 ${
                            activeNavDropdown === item.label ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ 
                            color: 'var(--foreground)',
                            filter: 'brightness(0.8)'
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                      
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

                    {/* Revolutionary Dropdown Menu with Bridge Fix */}
                    {item.hasDropdown && activeNavDropdown === item.label && (
                      <div 
                        className="absolute top-full left-1/2 transform -translate-x-1/2 w-96"
                        style={{ zIndex: 9999 }}
                      >
                        {/* Invisible bridge area to prevent dropdown closing - NO GAP */}
                        <div className="h-3 w-full bg-transparent" />
                        
                        <div 
                          className="rounded-2xl border-2 shadow-2xl backdrop-blur-xl overflow-hidden"
                          style={{ 
                            backgroundColor: 'var(--popover)', 
                            borderColor: 'var(--border)', 
                            borderRadius: 'var(--radius-2xl)',
                            boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.35), 0 16px 32px -8px rgba(0, 0, 0, 0.15)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)'
                          }}
                        >
                          {/* Header Section */}
                          <div 
                            className="px-6 py-4 border-b"
                            style={{ 
                              background: 'linear-gradient(135deg, var(--accent), var(--muted))',
                              borderColor: 'var(--border)'
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                                  style={{ 
                                    background: 'linear-gradient(135deg, var(--primary), var(--chart-1))',
                                    color: 'var(--primary-foreground)'
                                  }}
                                >
                                  {item.label === 'Diamonds' ? '💎' : item.label === 'Gemstones' ? '🔮' : '💍'}
                                </div>
                                <div>
                                  <h3 
                                    className="text-lg font-bold"
                                    style={{ color: 'var(--popover-foreground)' }}
                                  >
                                    {item.label}
                                  </h3>
                                  <p 
                                    className="text-sm"
                                    style={{ color: 'var(--muted-foreground)' }}
                                  >
                                    {item.label === 'Diamonds' ? 'Certified Excellence' : 
                                     item.label === 'Gemstones' ? 'Natural Beauty' : 
                                     'Crafted Perfection'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="px-3 py-1 text-xs font-bold rounded-full"
                                  style={{ 
                                    background: 'linear-gradient(90deg, var(--chart-2), var(--chart-3))',
                                    color: 'var(--primary-foreground)'
                                  }}
                                >
                                  PREMIUM
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              </div>
                            </div>
                          </div>

                          {/* Content Grid */}
                          <div className="p-6">
                            <div className="grid grid-cols-1 gap-4">
                              {item.dropdownItems?.map((dropdownItem, index) => {
                                const getIcon = () => {
                                  if (item.label === 'Diamonds') {
                                    return ['💎', '✨', '🌱'][index] || '💎'
                                  } else if (item.label === 'Gemstones') {
                                    return ['🔴', '🔵', '🟢', '🟣'][index] || '💎'
                                  } else {
                                    return ['💍', '📿', '👂', '🔗'][index] || '💍'
                                  }
                                }
                                
                                const getGradient = () => {
                                  const gradients = [
                                    'from-blue-500 to-cyan-500',
                                    'from-purple-500 to-pink-500', 
                                    'from-green-500 to-emerald-500',
                                    'from-orange-500 to-red-500'
                                  ]
                                  return gradients[index] || gradients[0]
                                }

                                return (
                                  <Link
                                    key={index}
                                    href={dropdownItem.href}
                                    className="group block p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] border border-transparent hover:shadow-xl"
                                    style={{ 
                                      borderRadius: 'var(--radius-xl)'
                                    }}
                                  >
                                    <div className="flex items-center space-x-4">
                                      <div 
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                      >
                                        {getIcon()}
                                      </div>
                                      <div className="flex-1">
                                        <div 
                                          className="font-bold text-base group-hover:text-lg transition-all duration-300"
                                          style={{ color: 'var(--popover-foreground)' }}
                                        >
                                          {dropdownItem.label}
                                        </div>
                                        <div 
                                          className="text-sm mt-1 leading-relaxed group-hover:text-base transition-all duration-300"
                                          style={{ color: 'var(--muted-foreground)' }}
                                        >
                                          {dropdownItem.description}
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-center space-y-2">
                                        <svg 
                                          className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" 
                                          fill="none" 
                                          stroke="currentColor" 
                                          viewBox="0 0 24 24"
                                          style={{ color: 'var(--primary)' }}
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </div>
                                    </div>
                                  </Link>
                                )
                              })}
                            </div>
                            
                            {/* Footer CTA */}
                            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                              <Link
                                href={item.href}
                                className="block px-6 py-4 rounded-xl text-center font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                style={{ 
                                  background: 'linear-gradient(135deg, var(--primary), var(--chart-1), var(--chart-4))',
                                  color: 'var(--primary-foreground)',
                                  borderRadius: 'var(--radius-xl)'
                                }}
                              >
                                <div className="flex items-center justify-center space-x-3">
                                  <span className="text-lg">Explore All {item.label}</span>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                </div>
                                <div className="text-sm mt-1 opacity-90">
                                  {item.label === 'Diamonds' ? 'Browse 10,000+ certified diamonds' : 
                                   item.label === 'Gemstones' ? 'Discover rare precious stones' : 
                                   'Shop handcrafted jewelry'}
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Search, Cart, and User Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0 min-w-fit">
              {/* Enhanced Search */}
              <div className="hidden lg:block flex-shrink-0 relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search diamonds, gemstones..."
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
                </form>
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
              <Link href="/user/cart" className="relative group p-2 transition-all duration-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg flex-shrink-0 min-w-fit" style={{ color: 'var(--foreground)', borderRadius: 'var(--radius-md)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 10v6a1 1 0 001 1h8a1 1 0 001-1v-6M7 13l-1.4-7M7 13l1.5 7m8.5-7L15 20" />
                </svg>
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse" style={{ background: 'linear-gradient(90deg, var(--chart-1), var(--chart-4))', color: 'var(--primary-foreground)' }}>
                    {cartItems}
                  </span>
                )}
              </Link>

              {/* Theme Switcher */}
              <div className="hidden sm:block flex-shrink-0 min-w-fit">
                <ThemeSwitcher />
              </div>

              {/* User Profile Dropdown */}
              <div className="relative flex-shrink-0 min-w-fit" ref={dropdownRef}>
                <button
                  ref={buttonRef}
                  onClick={toggleDropdown}
                  className={`flex items-center space-x-2 p-1 transition-all duration-300 rounded-lg ${
                    isDropdownOpen 
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
                    className="fixed w-64 bg-white dark:bg-slate-900 rounded-2xl border shadow-2xl z-[9999] dropdown-enter"
                    style={{ 
                      top: `${dropdownPosition.top}px`,
                      right: `${dropdownPosition.right}px`,
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
                      </div>

                      <div className="border-t pt-2 mt-2" style={{ borderColor: 'var(--border)' }}>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsDropdownOpen(false)
                          }}
                          className="flex items-center space-x-3 px-3 py-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 w-full group" 
                          style={{ borderRadius: 'var(--radius-lg)' }}
                          role="menuitem"
                        >
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleLogout={handleLogout}
        recentSearches={recentSearches}
        handleSearchSuggestion={handleSearchSuggestion}
        clearSearch={clearSearch}
      />
    </>
  )
}
