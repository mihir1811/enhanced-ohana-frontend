import type { Metadata } from 'next'
import NavigationUser from '../../components/Navigation/NavigationUser'

export const metadata: Metadata = {
  title: 'Ohana Gems - Premium Jewelry Marketplace',
  description: 'Discover and purchase premium diamonds, gemstones, and luxury jewelry from verified sellers worldwide.',
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <NavigationUser />
      
      {/* Main Content */}
      <main className="user-layout">
        {children}
      </main>
    </div>
  )
}