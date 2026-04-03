'use client'

import Link from 'next/link'
import { Inbox } from 'lucide-react'
import { useAuth } from '@/hooks/data/useAuth'
import { SECTION_WIDTH } from '@/lib/constants'
import InquiryListView from '@/components/inquiry/InquiryListView'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function UserInquiriesPage() {
  const { token, user, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" style={{ maxWidth: SECTION_WIDTH }}>
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl border p-6 sm:p-8 mb-8 sm:mb-10',
            'bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/10',
          )}
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="absolute right-0 top-0 h-32 w-32 opacity-[0.07] pointer-events-none">
            <Inbox className="h-full w-full text-foreground" strokeWidth={1} />
          </div>
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground mb-3">
                Your account
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">My inquiries</h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
                Track product inquiries you have sent. Need something new? Start from the{' '}
                <Link href="/inquiry" className="font-medium text-primary underline underline-offset-4 hover:no-underline">
                  inquiry form
                </Link>
                .
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 w-full sm:w-auto shadow-sm">
              <Link href="/inquiry">New inquiry</Link>
            </Button>
          </div>
        </div>

        <InquiryListView mode="user" basePath="/user/inquiries" token={token} currentUserId={user?.id} />

        {isAuthenticated && !token && (
          <p className="mt-6 text-sm text-center text-muted-foreground">
            Session is loading. If this persists, sign in again.
          </p>
        )}
      </div>
    </div>
  )
}
