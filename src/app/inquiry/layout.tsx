import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inquiry | Gem World',
  description: 'Send Gem World a product or general inquiry.',
}

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  return children
}
