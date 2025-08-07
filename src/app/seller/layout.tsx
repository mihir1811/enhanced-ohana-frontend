import type { Metadata } from 'next'

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
      {/* Seller-specific layout wrapper */}
      <div className="seller-layout">
        {children}
      </div>
    </div>
  )
}
