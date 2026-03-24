'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

export function BuyerThemeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const shouldApply = React.useMemo(() => {
    if (!pathname) return false

    // Exclude any route that lives under these top-level segments.
    // Using startsWith() (not just '/segment/') avoids edge cases in Next pathname formatting.
    const isExcluded =
      pathname.startsWith('/user') ||
      pathname.startsWith('/seller') ||
      pathname.startsWith('/admin')

    return !isExcluded
  }, [pathname])

  return (
    <div
      data-pathname={pathname ?? ''}
      className={shouldApply ? 'buyer-theme' : undefined}
    >
      {children}
    </div>
  )
}

