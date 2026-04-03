'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquareQuote } from 'lucide-react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { SECTION_WIDTH } from '@/lib/constants'
import InquiryFormSwitch from '@/components/inquiry/InquiryFormSwitch'
import { INQUIRY_OPTIONS, type InquiryCategory } from '@/components/inquiry/inquiryTypes'
import { INQUIRY_CATEGORY_META } from '@/components/inquiry/inquiryCategoryUi'
import { useAuth } from '@/hooks/data/useAuth'
import { cn } from '@/lib/utils'

export default function InquiryPage() {
  const [inquiryType, setInquiryType] = useState<InquiryCategory | ''>('')
  const { isAuthenticated, isUser, isSeller } = useAuth()

  return (
    <>
      <NavigationUser />
      <main className="min-h-screen bg-gradient-to-b from-muted/40 via-background to-background">
        <div className="mx-auto w-full px-4 sm:px-6 py-10 sm:py-14" style={{ maxWidth: SECTION_WIDTH }}>
          <div className="max-w-full mx-auto mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground mb-4 shadow-sm">
              <MessageSquareQuote className="h-3.5 w-3.5" />
              Buyer & seller inquiries
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
              Product inquiry
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto sm:mx-0 leading-relaxed">
              Choose a category, then complete the form. You need to be signed in to submit — we will use your account
              to attach the inquiry to you.
              {isAuthenticated && isUser && (
                <>
                  {' '}
                  <Link href="/user/inquiries" className="font-medium text-primary underline underline-offset-4 hover:no-underline">
                    View your submitted inquiries
                  </Link>
                  .
                </>
              )}
              {isAuthenticated && isSeller && (
                <>
                  {' '}
                  <Link href="/seller/inquiries" className="font-medium text-primary underline underline-offset-4 hover:no-underline">
                    Open inquiry inbox
                  </Link>
                  .
                </>
              )}
            </p>
          </div>

          <div
            className={cn(
              'max-w-full mx-auto rounded-2xl border shadow-lg shadow-black/5 dark:shadow-black/20',
              'bg-card ring-1 ring-black/5 dark:ring-white/10',
            )}
            style={{ borderColor: 'var(--border)' }}
          >
            <div
              className="border-b px-5 py-5 sm:px-8 sm:py-6"
              style={{
                borderColor: 'var(--border)',
                background: 'linear-gradient(180deg, var(--muted)/0.35, transparent)',
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Step 1</p>
              <h2 className="text-lg font-semibold text-foreground">What are you looking for?</h2>
              <p className="text-sm text-muted-foreground mt-1">Tap a category to load the matching form.</p>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {INQUIRY_OPTIONS.map((opt) => {
                  const m = INQUIRY_CATEGORY_META[opt.value]
                  const Icon = m.Icon
                  const selected = inquiryType === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setInquiryType(opt.value)}
                      className={cn(
                        'rounded-xl border px-3 py-3 sm:py-4 text-left transition-all min-h-[88px] flex flex-col justify-center',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        selected ? m.selectedClass : m.idleClass,
                      )}
                    >
                      <Icon className="h-5 w-5 mb-2 opacity-90" />
                      <span className="text-sm font-semibold text-foreground leading-tight">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 2</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm font-medium text-foreground">Details</span>
              </div>
              <InquiryFormSwitch category={inquiryType} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
