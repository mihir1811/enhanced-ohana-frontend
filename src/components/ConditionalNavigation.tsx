'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()
  const [shouldShowNav, setShouldShowNav] = useState(false)

  useEffect(() => {
    // Don't show navigation on login/register pages
    const authPages = ['/login', '/register']
    const isAuthPage = authPages.includes(pathname)
    
    // Check if user is logged in by checking for role cookie
    const cookies = document.cookie.split(';')
    const roleCookie = cookies.find(cookie => cookie.trim().startsWith('role='))
    const hasRole = roleCookie && roleCookie.split('=')[1] !== '' && roleCookie.split('=')[1] !== 'undefined'
    
    setShouldShowNav(!isAuthPage && Boolean(hasRole))
  }, [pathname])

  if (!shouldShowNav) {
    return null
  }

  return <Navigation />
}
