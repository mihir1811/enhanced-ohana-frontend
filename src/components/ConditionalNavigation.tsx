'use client'

import { usePathname } from 'next/navigation'

// This component is now deprecated since navigation is handled by role-specific layouts
// Each layout (user, seller, admin) now includes its own navigation component
export default function ConditionalNavigation() {
  const pathname = usePathname()
  const authPages = ['/login', '/register']

  // Hide on auth pages - this component now serves minimal purpose
  // Navigation is handled by individual layouts based on route structure
  if (authPages.includes(pathname)) return null

  // Navigation is now handled by:
  // - /user/* routes: user/layout.tsx with NavigationUser
  // - /seller/* routes: seller/layout.tsx with NavigationSeller  
  // - /admin/* routes: admin/layout.tsx with NavigationAdmin
  // - Public pages: PublicPageLayout.tsx with NavigationUser
  
  return null
}
