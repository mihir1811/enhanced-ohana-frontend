'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  orders: 'Orders',
  'add-product': 'Add Product',
  profile: 'Profile',
  edit: 'Edit',
  analytics: 'Analytics',
  chat: 'Chat',
}

export default function SellerBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.replace(/^\/seller\/?/, '').split('/').filter(Boolean)

  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) return null

  const items: { label: string; href: string; isLast: boolean }[] = []
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const isNumeric = /^\d+$/.test(seg)
    if (isNumeric && i < segments.length - 1) continue // Skip ID in middle (e.g. products/123/edit -> show Products, Edit)
    let label: string
    if (isNumeric && segments[i + 1] === 'edit') label = 'Edit'
    else if (isNumeric) label = 'Product'
    else label = LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)
    const href = `/seller/${segments.slice(0, i + 1).join('/')}`
    items.push({ label, href, isLast: i === segments.length - 1 })
  }

  return (
    <nav className="flex items-center gap-1 text-sm mb-6" aria-label="Breadcrumb">
      <Link
        href="/seller/dashboard"
        className="hover:underline"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Dashboard
      </Link>
      {items.map((item) => (
        <span key={item.href} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          {item.isLast ? (
            <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:underline"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
