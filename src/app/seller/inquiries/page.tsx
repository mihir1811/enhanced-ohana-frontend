'use client'

import Link from 'next/link'
import { Inbox } from 'lucide-react'
import { useAuth } from '@/hooks/data/useAuth'
import InquiryListView from '@/components/inquiry/InquiryListView'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SellerInquiriesPage() {
  const { token } = useAuth()

  return (
    <div className="space-y-8">
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border p-6 sm:p-8',
          'bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/10',
        )}
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="absolute right-0 top-0 h-28 w-28 opacity-[0.06] pointer-events-none">
          <Inbox className="h-full w-full text-foreground" strokeWidth={1} />
        </div>
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground mb-3">
              Seller · Inbox
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Inquiry inbox</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Incoming product inquiries from buyers across diamond, gemstone, bullion, watches, and jewelry. Open a row
              to see full specifications.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0 w-full sm:w-auto">
            <Link href="/inquiry">New inquiry</Link>
          </Button>
        </div>
      </div>

      <InquiryListView mode="seller" basePath="/seller/inquiries" token={token} currentUserId={undefined} />
    </div>
  )
}
