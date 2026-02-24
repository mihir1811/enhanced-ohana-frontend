import type { Metadata } from 'next'
import SellerLayoutWrapper from '../../components/seller/SellerLayoutWrapper'

export const metadata: Metadata = {
  title: 'Seller Dashboard - Gem World',
  description: 'Manage your jewelry listings, orders, and seller profile on Gem World marketplace.',
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SellerLayoutWrapper>{children}</SellerLayoutWrapper>
}
