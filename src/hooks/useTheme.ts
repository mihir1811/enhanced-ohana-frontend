'use client'

import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? (resolvedTheme || theme) : undefined
  const isDark = currentTheme === 'dark'

  return {
    theme: currentTheme,
    setTheme,
    isDark,
    // Colors for style props
    bgColor: isDark ? '#000000' : '#ffffff',
    textColor: isDark ? '#ffffff' : '#000000',
    // Classes for className
    bgClass: isDark ? 'bg-black' : 'bg-white',
    textClass: isDark ? 'text-white' : 'text-black',
  }
}
