import type { Metadata } from 'next'
import NavigationUser from '../../components/Navigation/NavigationUser'

export const metadata: Metadata = {
  title: 'Gem World - Premium Jewelry Marketplace',
  description: 'Discover and purchase premium diamonds, gemstones, and luxury jewelry from verified sellers worldwide.',
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen user-theme">
      <div className="relative z-10">
        {/* Navigation Header */}
        <NavigationUser />
        
        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}