import type { Metadata } from 'next'
import SellerLayoutWrapper from '../../components/seller/SellerLayoutWrapper'

export const metadata: Metadata = {
  title: 'Seller Dashboard - Ohana Gems',
  description: 'Manage your jewelry listings, orders, and seller profile on Ohana Gems marketplace.',
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SellerLayoutWrapper>{children}</SellerLayoutWrapper>
}
