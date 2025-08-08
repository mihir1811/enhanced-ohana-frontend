import type { Metadata } from 'next'
import NavigationSeller from '../../components/Navigation/NavigationSeller'

export const metadata: Metadata = {
  title: 'Seller Dashboard - Ohana Gems',
  description: 'Manage your jewelry listings, orders, and seller profile on Ohana Gems marketplace.',
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <NavigationSeller />
      
      {/* Main Content */}
      <main className="seller-layout">
        {children}
      </main>
    </div>
  )
}
