import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Inquiries | Gem World',
  description:
    'View and track your submitted inquiries across diamonds, gemstones, bullion, watches, and jewelry.',
}

export default function UserInquiriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
