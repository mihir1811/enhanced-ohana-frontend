import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Inquiry | Gem World',
  description:
    'Submit product inquiries for diamond, gemstone, bullion, watch, and jewelry requirements on Gem World.',
}

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  return children
}
