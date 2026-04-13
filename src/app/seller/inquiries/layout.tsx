import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seller Inquiry Inbox | Gem World',
  description:
    'Manage incoming buyer inquiries for diamond, gemstone, bullion, watch, and jewelry products.',
}

export default function SellerInquiriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
