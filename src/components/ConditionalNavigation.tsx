'use client'

import { usePathname } from 'next/navigation'
import NavigationSeller from './Navigation/NavigationSeller'
import NavigationAdmin from './Navigation/NavigationAdmin'
import NavigationUser from './Navigation/NavigationUser'
import ThemeSwitcher from './ThemeSwitcher'
import { useAppSelector } from '@/store/hooks'

export default function ConditionalNavigation() {
  const pathname = usePathname()
  const { role } = useAppSelector((state) => state.auth) // role comes from Redux
  const authPages = ['/login', '/register']

  // Hide nav on auth pages
  if (authPages.includes(pathname)) return null

  // No role => user not logged in
  if (!role) return null

  let NavigationComponent: React.ReactNode = null

  switch (role) {
    case 'seller':
      NavigationComponent = <NavigationSeller />
      break
    case 'admin':
      NavigationComponent = <NavigationAdmin />
      break
    case 'user':
      NavigationComponent = <NavigationUser />
      break
    default:
      NavigationComponent = null
  }

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      {NavigationComponent}
      <ThemeSwitcher />
    </div>
  )
}
